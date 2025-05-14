import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products, categories } from '@/data/products';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, X, ScanText, Loader2, Upload } from "lucide-react";
import { processImage, extractProductName, extractBarcode, extractDescription, processFile } from '@/services/ocrService';
import { LoadingOverlay } from '@/components/ui/loading-overlay';

const AdminProductForm: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = productId !== undefined;
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    barcode: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showScanner, setShowScanner] = useState(false);
  const [scanTarget, setScanTarget] = useState<'name' | 'description' | 'barcode'>('barcode');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load product data if editing
  useEffect(() => {
    if (isEditing) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setForm({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          imageUrl: product.imageUrl,
          category: product.category,
          barcode: product.barcode || ''
        });
      } else {
        // Product not found
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive"
        });
        navigate('/admin/products');
      }
    }
  }, [isEditing, productId, navigate]);
  
  useEffect(() => {
    return () => {
      // Clean up the camera stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!form.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!form.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!form.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    }
    
    if (!form.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    // In a real app, this would save to a database
    // For demo purposes, just show success message and navigate back
    
    toast({
      title: isEditing ? "Product updated" : "Product created",
      description: `${form.name} has been successfully ${isEditing ? 'updated' : 'added'}.`
    });
    
    navigate('/admin/products');
  };

  const startScanner = async (target: 'name' | 'description' | 'barcode') => {
    setScanTarget(target);
    setIsProcessing(false);
    setIsCameraReady(false);
    
    try {
      // First check if getUserMedia is supported
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera access is not supported in your browser');
      }

      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }

      // Show scanner UI first
      setShowScanner(true);

      // Wait for video element to be mounted
      await new Promise(resolve => setTimeout(resolve, 100));

      if (!videoRef.current) {
        throw new Error('Camera initialization failed. Please try again.');
      }

      const constraints = {
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        },
        audio: false
      };

      // Try to get the camera stream
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Set up video element
      videoRef.current.srcObject = mediaStream;
      videoRef.current.muted = true;

      // Wait for video to be ready
      await new Promise((resolve, reject) => {
        if (!videoRef.current) return reject('Video element not found');
        
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play();
            setIsCameraReady(true);
            resolve(true);
          } catch (error) {
            reject(error);
          }
        };
        
        videoRef.current.onerror = () => {
          reject('Failed to load video');
        };
      });

      setStream(mediaStream);
      console.log('Camera initialized successfully');

    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: "Camera Error",
        description: error instanceof Error 
          ? error.message 
          : "Could not access the camera. Please check your permissions.",
        variant: "destructive"
      });
      stopScanner();
    }
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    setIsProcessing(true);
    setProcessingMessage('Preparing image...');

    try {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current video frame onto the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/jpeg', 1.0); // Use maximum quality
      });

      // Process image with OCR
      const result = await processImage(
        blob,
        (message, progress) => {
          setProcessingMessage(message);
        }
      );

      if (result) {
        if (scanTarget === 'name') {
          const productName = extractProductName(result.text, result.words);
          if (productName) {
            setForm(prev => ({ ...prev, name: productName }));
            
            // Show confidence information
            const avgConfidence = Math.round(
              result.words
                .filter(w => productName.includes(w.text))
                .reduce((sum, w) => sum + w.confidence, 0) / 
              result.words.filter(w => productName.includes(w.text)).length
            );

            toast({
              title: "Text Detected",
              description: `Product name "${productName}" captured with ${avgConfidence}% confidence.`,
            });
          } else {
            toast({
              title: "No Text Found",
              description: "Could not detect a clear product name. Try adjusting the angle or lighting.",
              variant: "destructive"
            });
          }
        } else if (scanTarget === 'description') {
          const description = extractDescription(result.text, result.words);
          if (description) {
            setForm(prev => ({ ...prev, description }));
            
            // Show confidence information for the description
            const avgConfidence = Math.round(
              result.words
                .filter(w => description.includes(w.text))
                .reduce((sum, w) => sum + w.confidence, 0) / 
              result.words.filter(w => description.includes(w.text)).length
            );

            toast({
              title: "Description Detected",
              description: `Product description captured with ${avgConfidence}% confidence.`,
            });
          } else {
            toast({
              title: "No Description Found",
              description: "Could not detect clear text. Try adjusting the angle or lighting.",
              variant: "destructive"
            });
          }
        } else {
          const barcode = extractBarcode(result.text, result.words);
          if (barcode) {
            setForm(prev => ({ ...prev, barcode }));
            
            // Find the confidence of the detected barcode
            const barcodeWord = result.words.find(w => w.text === barcode);
            const confidence = barcodeWord ? Math.round(barcodeWord.confidence) : 'unknown';

            toast({
              title: "Number Detected",
              description: `Number ${barcode} captured with ${confidence}% confidence.`,
            });
          } else {
            toast({
              title: "No Number Found",
              description: "Could not detect a clear number. Try holding the camera more steady.",
              variant: "destructive"
            });
          }
        }
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
      stopScanner();
    }
  };

  const stopScanner = () => {
    setIsCameraReady(false);
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setShowScanner(false);
    setIsProcessing(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProcessingMessage('Processing file...');

    try {
      const result = await processFile(
        file,
        (message, progress) => {
          setProcessingMessage(message);
        }
      );

      if (result) {
        if (scanTarget === 'name') {
          const productName = extractProductName(result.text, result.words);
          if (productName) {
            setForm(prev => ({ ...prev, name: productName }));
            toast({
              title: "Text Detected",
              description: `Product name "${productName}" extracted from file.`,
            });
          }
        } else if (scanTarget === 'description') {
          const description = extractDescription(result.text, result.words);
          if (description) {
            setForm(prev => ({ ...prev, description }));
            toast({
              title: "Description Detected",
              description: "Product description extracted from file.",
            });
          }
        } else {
          const barcode = extractBarcode(result.text, result.words);
          if (barcode) {
            setForm(prev => ({ ...prev, barcode }));
            toast({
              title: "Number Detected",
              description: `Number ${barcode} extracted from file.`,
            });
          }
        }
      }
    } catch (error) {
      console.error('File processing error:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process the file. Please try a different file.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
      setShowScanner(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <div className="flex items-center space-x-2">
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`flex-1 ${errors.name ? 'border-red-500' : ''}`}
            />
            <Button 
              type="button" 
              onClick={() => startScanner('name')}
              disabled={showScanner}
              variant="outline" 
              className="bg-[#F58634] hover:bg-[#e07a30] text-white"
            >
              <ScanText size={18} />
            </Button>
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <div className="flex space-x-2">
            <Textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className={`flex-1 ${errors.description ? 'border-red-500' : ''}`}
            />
            <Button 
              type="button" 
              onClick={() => startScanner('description')}
              disabled={showScanner}
              variant="outline" 
              className="bg-[#F58634] hover:bg-[#e07a30] text-white h-10"
            >
              <ScanText size={18} />
            </Button>
          </div>
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleChange}
              className={errors.price ? 'border-red-500' : ''}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">{errors.price}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 mb-1">
            Number/ID
          </label>
          <div className="flex items-center space-x-2">
            <Input
              id="barcode"
              name="barcode"
              value={form.barcode}
              onChange={handleChange}
              placeholder="Scan or enter number/ID"
              className="flex-1"
            />
            <Button 
              type="button" 
              onClick={() => startScanner('barcode')}
              disabled={showScanner}
              variant="outline" 
              className="bg-[#F58634] hover:bg-[#e07a30] text-white"
            >
              <Camera size={18} />
            </Button>
          </div>
        </div>
        
        {showScanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="bg-white p-4 rounded-lg w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  {scanTarget === 'name' ? 'Scan Product Name' : 
                   scanTarget === 'description' ? 'Scan Product Description' :
                   'Scan Text/Number'}
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={stopScanner} 
                  className="h-8 w-8 p-0 rounded-full"
                  disabled={isProcessing}
                >
                  <X size={18} />
                </Button>
              </div>
              
              <div className="flex justify-center space-x-4 mb-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                />
              </div>
              
              <div className="relative bg-black mb-4 rounded-lg overflow-hidden">
                <div className="aspect-video relative">
                  {!isCameraReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                      <LoadingOverlay message="Initializing camera..." />
                    </div>
                  )}
                  <video 
                    ref={videoRef} 
                    className="absolute inset-0 w-full h-full object-cover" 
                    autoPlay 
                    playsInline
                    muted
                  />
                  <canvas 
                    ref={canvasRef} 
                    className="hidden" 
                  />
                  {isCameraReady && !isProcessing && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-[20%] border-2 border-green-500 opacity-70 rounded-lg">
                        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-green-500 opacity-70 transform -translate-y-1/2"></div>
                        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-green-500 opacity-70 transform -translate-x-1/2"></div>
                      </div>
                    </div>
                  )}
                  {isProcessing && (
                    <LoadingOverlay message={processingMessage || 'Processing image...'} />
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  {isProcessing ? processingMessage :
                   !isCameraReady ? 'Setting up camera...' :
                   scanTarget === 'name' ? 'Position the product name within the green box or upload a file' :
                   scanTarget === 'description' ? 'Position the product description within the green box or upload a file' :
                   'Position the number/barcode within the green box or upload a file'
                  }
                </p>
                
                <div className="flex justify-center space-x-2">
                  <Button 
                    onClick={captureImage} 
                    className="bg-primary hover:bg-primary/90"
                    disabled={isProcessing || !isCameraReady}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : !isCameraReady ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Waiting for camera...
                      </>
                    ) : (
                      'Capture'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="text"
            value={form.imageUrl}
            onChange={handleChange}
            className={errors.imageUrl ? 'border-red-500' : ''}
          />
          {errors.imageUrl && (
            <p className="mt-1 text-sm text-red-500">{errors.imageUrl}</p>
          )}
          
          {form.imageUrl && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Preview:</p>
              <img 
                src={form.imageUrl} 
                alt="Product preview" 
                className="h-32 w-32 object-cover rounded-md border border-gray-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/200?text=Image+Error';
                }}
              />
            </div>
          )}
        </div>
        
        <div className="pt-4 flex justify-end space-x-4">
          <Button
            type="button"
            onClick={() => navigate('/admin/products')}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary text-white"
          >
            {isEditing ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
