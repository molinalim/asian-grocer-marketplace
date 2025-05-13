
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, X, ScanText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TextScannerProps {
  onScanComplete: (scannedText: string) => void;
  scannerType: 'name' | 'barcode';
  buttonIcon?: React.ReactNode;
}

const TextScanner: React.FC<TextScannerProps> = ({ 
  onScanComplete, 
  scannerType,
  buttonIcon = scannerType === 'name' ? <ScanText size={18} /> : <Camera size={18} />
}) => {
  const [showScanner, setShowScanner] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [processing, setProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  const startScanner = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      setShowScanner(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Could not access the camera. Please check your permissions.",
        variant: "destructive"
      });
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setProcessing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      setProcessing(false);
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get the captured image as a data URL
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageDataUrl);

    toast({
      title: "Processing Image",
      description: `Analyzing ${scannerType === 'name' ? 'product name' : 'barcode'}...`,
    });
    
    // Simulate text recognition from the image
    // In a real app, you would call an OCR API with the image data
    analyzeImage(imageDataUrl);
  };
  
  const analyzeImage = (imageData: string) => {
    // This function simulates OCR processing
    // In a real app, this would call a server-side OCR service
    
    setTimeout(() => {
      // For demo purposes, extract "text" based on image data
      // We're using a simple hash of the image data to generate predictable text
      // This ensures the same image gives the same result
      
      const hash = hashCode(imageData.substring(0, 1000));
      let result;
      
      if (scannerType === 'name') {
        const productNames = [
          "Premium Japanese Green Tea", 
          "Organic Rice Noodles", 
          "Thai Curry Paste", 
          "Korean Kimchi",
          "Asian Snack Mix"
        ];
        // Use the hash to deterministically select a product name
        result = productNames[Math.abs(hash) % productNames.length];
      } else {
        // Generate a deterministic number based on the image hash
        result = Math.abs(hash).toString().substring(0, 10);
      }
      
      onScanComplete(result);
      
      toast({
        title: "Text Detected",
        description: `${scannerType === 'name' ? 'Product name' : 'Number'}: "${result}"`,
      });
      
      setProcessing(false);
      stopScanner();
    }, 1500);
  };
  
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };

  const stopScanner = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCapturedImage(null);
    setShowScanner(false);
  };

  React.useEffect(() => {
    return () => {
      // Clean up the camera stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <>
      <Button 
        type="button" 
        onClick={startScanner}
        disabled={showScanner}
        variant="outline" 
        className="bg-[#F58634] hover:bg-[#e07a30] text-white"
      >
        {buttonIcon}
      </Button>
      
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white p-4 rounded-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {scannerType === 'name' ? 'Scan Product Name' : 'Scan Barcode'}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={stopScanner} 
                className="h-8 w-8 p-0 rounded-full"
              >
                <X size={18} />
              </Button>
            </div>
            
            <div className="relative bg-black mb-4 rounded overflow-hidden">
              {!capturedImage ? (
                <>
                  <video 
                    ref={videoRef} 
                    className="w-full h-64 object-cover" 
                    autoPlay 
                    playsInline
                    style={{ display: 'block' }}
                  />
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-green-500 opacity-70"></div>
                  <div className="absolute inset-y-0 left-1/2 w-0.5 bg-green-500 opacity-70"></div>
                </>
              ) : (
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="w-full h-64 object-cover"
                />
              )}
              <canvas 
                ref={canvasRef} 
                className="hidden" 
              />
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              {!capturedImage ? 
                `Position the ${scannerType === 'name' ? 'product name' : 'barcode'} within the frame and take a snapshot` :
                'Processing image...'
              }
            </p>
            
            <div className="flex justify-center">
              <Button 
                onClick={captureImage} 
                disabled={processing || !!capturedImage}
                className="bg-primary hover:bg-primary/90"
              >
                {processing ? 'Processing...' : 'Capture'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TextScanner;
