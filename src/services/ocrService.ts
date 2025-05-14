import Tesseract from 'tesseract.js';
import { toast } from '@/hooks/use-toast';
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy, version } from 'pdfjs-dist';

// Configure PDF.js worker
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

export interface OCRResult {
  text: string;
  confidence: number;
  words: Array<{ text: string; confidence: number }>;
}

interface ImageProcessingOptions {
  contrast?: number;
  brightness?: number;
  grayscale?: boolean;
  scale?: number;
  sharpen?: boolean;
  threshold?: boolean;
}

const preprocessImage = async (imageBlob: Blob, options: ImageProcessingOptions = {}): Promise<Blob> => {
  const {
    contrast = 1.3,
    brightness = 1.2,
    grayscale = true,
    scale = 2.0,
    sharpen = true,
    threshold = true
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Create canvas and get context
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (!ctx) {
        URL.revokeObjectURL(img.src);
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Enable image smoothing for better scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Apply scaling
      ctx.scale(scale, scale);

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Apply image processing
      for (let i = 0; i < data.length; i += 4) {
        // Convert to grayscale first if needed
        if (grayscale) {
          const avg = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
          data[i] = data[i + 1] = data[i + 2] = avg;
        }

        // Apply brightness
        for (let j = 0; j < 3; j++) {
          data[i + j] = data[i + j] * brightness;
        }

        // Apply contrast
        for (let j = 0; j < 3; j++) {
          data[i + j] = ((data[i + j] - 128) * contrast) + 128;
        }

        // Apply threshold for better text detection
        if (threshold) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const value = avg > 128 ? 255 : 0;
          data[i] = data[i + 1] = data[i + 2] = value;
        }

        // Ensure values are within bounds
        for (let j = 0; j < 3; j++) {
          data[i + j] = Math.max(0, Math.min(255, data[i + j]));
        }
      }

      // Apply sharpening if enabled
      if (sharpen) {
        const sharpenKernel = [
          0, -1, 0,
          -1, 5, -1,
          0, -1, 0
        ];
        const tempData = new Uint8ClampedArray(data);
        
        for (let y = 1; y < canvas.height - 1; y++) {
          for (let x = 1; x < canvas.width - 1; x++) {
            for (let c = 0; c < 3; c++) {
              let sum = 0;
              for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                  const idx = ((y + ky) * canvas.width + (x + kx)) * 4 + c;
                  sum += tempData[idx] * sharpenKernel[(ky + 1) * 3 + (kx + 1)];
                }
              }
              const idx = (y * canvas.width + x) * 4 + c;
              data[idx] = Math.max(0, Math.min(255, sum));
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Convert to blob with high quality
      canvas.toBlob((blob) => {
        if (blob) {
          URL.revokeObjectURL(img.src);
          resolve(blob);
        } else {
          URL.revokeObjectURL(img.src);
          reject(new Error('Failed to convert canvas to blob'));
        }
      }, 'image/jpeg', 1.0); // Use maximum quality
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(imageBlob);
  });
};

export interface OCRProgressCallback {
  (message: string, progress: number): void;
}

export const processImage = async (
  imageFile: string | Blob,
  onProgress?: OCRProgressCallback
): Promise<OCRResult | null> => {
  try {
    // Convert string URLs to blobs if needed
    const imageBlob = typeof imageFile === 'string' 
      ? await fetch(imageFile).then(r => r.blob())
      : imageFile;

    // Try different preprocessing configurations
    const preprocessingConfigs = [
      // Default config with balanced settings
      {
        contrast: 1.3,
        brightness: 1.2,
        grayscale: true,
        scale: 2.0,
        sharpen: true,
        threshold: true
      },
      // High contrast config for faded text
      {
        contrast: 1.5,
        brightness: 1.3,
        grayscale: true,
        scale: 2.0,
        sharpen: true,
        threshold: true
      },
      // No threshold for colored text
      {
        contrast: 1.3,
        brightness: 1.2,
        grayscale: true,
        scale: 2.0,
        sharpen: true,
        threshold: false
      }
    ];

    let bestResult = null;
    let highestConfidence = 0;

    for (const config of preprocessingConfigs) {
      const processedImageBlob = await preprocessImage(imageBlob, config);
      
      const result = await Tesseract.recognize(
        processedImageBlob,
        'eng',
        {
          logger: m => {
            if (onProgress) {
              let progressMessage = '';
              let progressValue = 0;

              switch (m.status) {
                case 'loading tesseract core':
                  progressMessage = 'Loading OCR engine...';
                  progressValue = 0.1;
                  break;
                case 'initializing tesseract':
                  progressMessage = 'Trying different processing methods...';
                  progressValue = 0.2;
                  break;
                case 'loading language traineddata':
                  progressMessage = 'Loading language data...';
                  progressValue = 0.3;
                  break;
                case 'initializing api':
                  progressMessage = 'Preparing OCR...';
                  progressValue = 0.4;
                  break;
                case 'recognizing text':
                  progressMessage = 'Extracting text...';
                  progressValue = 0.4 + (m.progress * 0.6);
                  break;
              }

              onProgress(progressMessage, progressValue);
            }
          }
        }
      );

      // Update best result if this configuration produced better confidence
      if (result.data.confidence > highestConfidence) {
        highestConfidence = result.data.confidence;
        bestResult = result;
      }

      // If we got a good result, no need to try other configs
      if (highestConfidence > 70) break;
    }

    if (!bestResult) {
      throw new Error('Failed to extract text from image');
    }

    const { text, confidence, words } = bestResult.data;

    // Process the words to find the most confident ones
    const significantWords = words
      .filter(w => w.confidence > 60 && w.text.length > 1)
      .sort((a, b) => b.confidence - a.confidence);

    // If we have some high-confidence words, lower the overall threshold
    const confidenceThreshold = significantWords.length > 0 ? 25 : 35;

    if (confidence < confidenceThreshold && significantWords.length === 0) {
      toast({
        title: 'Text Detection Issue',
        description: 'Could not detect clear text. Try adjusting the angle or lighting.',
        variant: 'destructive',
      });
      return null;
    }

    return {
      text: text.trim(),
      confidence,
      words: significantWords.map(w => ({ text: w.text, confidence: w.confidence }))
    };
  } catch (error) {
    console.error('OCR Error:', error);
    toast({
      title: 'OCR Error',
      description: 'Failed to process image. Please try again.',
      variant: 'destructive',
    });
    return null;
  }
};

export const extractProductName = (text: string, words: Array<{ text: string; confidence: number }> = []): string => {
  // First try to use high-confidence words
  const highConfidenceWords = words
    .filter(w => w.confidence > 70 && w.text.length > 2)
    .map(w => w.text)
    .join(' ');

  if (highConfidenceWords) {
    return highConfidenceWords;
  }

  // Fall back to line-based analysis
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // Score each line based on various factors
  const scoredLines = lines.map(line => {
    let score = 0;
    
    // Prefer lines with letters
    if (/[a-zA-Z]/.test(line)) score += 3;
    
    // Prefer lines with reasonable length
    if (line.length >= 3 && line.length <= 100) score += 2;
    
    // Prefer lines that don't start with numbers
    if (!/^\d/.test(line)) score += 1;
    
    // Prefer lines with proper capitalization
    if (/^[A-Z][a-z]/.test(line)) score += 2;
    
    return { line, score };
  });

  // Get the line with highest score
  const bestLine = scoredLines.sort((a, b) => b.score - a.score)[0]?.line || lines[0] || '';

  // Clean up the text
  return bestLine
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
};

export const extractBarcode = (text: string, words: Array<{ text: string; confidence: number }> = []): string => {
  // First look for high-confidence numbers in the words array
  const highConfidenceNumber = words
    .filter(w => w.confidence > 70 && /^\d+$/.test(w.text) && w.text.length >= 6)
    .sort((a, b) => b.text.length - a.text.length)[0]?.text;

  if (highConfidenceNumber) {
    return highConfidenceNumber;
  }

  // Fall back to regular text analysis
  const numbers = text.match(/\d{6,}/g);
  
  if (!numbers) return '';

  // Return the longest number sequence
  return numbers.reduce((longest, current) => 
    current.length > longest.length ? current : longest
  );
};

export const extractDescription = (text: string, words: Array<{ text: string; confidence: number }> = []): string => {
  // First try to use high-confidence words
  const highConfidenceWords = words
    .filter(w => w.confidence > 60) // Lower confidence threshold for descriptions
    .map(w => w.text)
    .join(' ');

  if (highConfidenceWords && highConfidenceWords.length > 10) {
    return highConfidenceWords;
  }

  // Fall back to line-based analysis
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // Score each line based on various factors
  const scoredLines = lines.map(line => {
    let score = 0;
    
    // Prefer lines with letters
    if (/[a-zA-Z]/.test(line)) score += 2;
    
    // Prefer lines with reasonable length for descriptions
    if (line.length >= 10) score += 3;
    
    // Prefer lines with proper sentence structure
    if (/^[A-Z].*[.!?]$/.test(line)) score += 2;
    
    // Prefer lines with descriptive words
    if (/contains|made|with|from|features|includes|perfect|ideal|great|delicious/.test(line.toLowerCase())) score += 2;
    
    return { line, score };
  });

  // Get all lines with good scores and combine them
  const goodLines = scoredLines
    .filter(({ score }) => score >= 4)
    .map(({ line }) => line);

  if (goodLines.length > 0) {
    return goodLines.join(' ');
  }

  // If no good lines found, return the original text cleaned up
  return text
    .replace(/[^\w\s.,!?-]/g, '') // Keep basic punctuation for descriptions
    .replace(/\s+/g, ' ')
    .trim();
};

export const processFile = async (
  file: File,
  onProgress?: OCRProgressCallback
): Promise<OCRResult | null> => {
  try {
    if (file.type === 'application/pdf') {
      return await processPDF(file, onProgress);
    } else if (file.type.startsWith('image/')) {
      return await processImage(file, onProgress);
    } else {
      throw new Error('Unsupported file type. Please upload an image or PDF file.');
    }
  } catch (error) {
    console.error('File processing error:', error);
    toast({
      title: 'Processing Error',
      description: error instanceof Error ? error.message : 'Failed to process file.',
      variant: 'destructive',
    });
    return null;
  }
};

const processPDF = async (
  file: File,
  onProgress?: OCRProgressCallback
): Promise<OCRResult | null> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    
    if (onProgress) {
      onProgress('Loading PDF...', 0.1);
    }

    // Process first page only for now
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality

    // Create canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not create canvas context');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (onProgress) {
      onProgress('Rendering PDF page...', 0.3);
    }

    // Render PDF page to canvas
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;

    if (onProgress) {
      onProgress('Processing text...', 0.5);
    }

    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/jpeg', 1.0);
    });

    // Process the image using existing OCR function
    return await processImage(blob, (message, progress) => {
      if (onProgress) {
        // Adjust progress to account for PDF processing steps
        onProgress(message, 0.5 + (progress * 0.5));
      }
    });

  } catch (error) {
    console.error('PDF processing error:', error);
    toast({
      title: 'PDF Processing Error',
      description: 'Failed to process PDF file. Please try a different file.',
      variant: 'destructive',
    });
    return null;
  }
}; 