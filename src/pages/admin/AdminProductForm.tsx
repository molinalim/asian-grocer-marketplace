
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products, categories } from '@/data/products';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, X } from "lucide-react";

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
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // For a real OCR implementation, you would send this image to an OCR service
    // For this demo, we'll simulate finding text in the image with a loading state
    toast({
      title: "Processing Image",
      description: "Scanning for text...",
    });

    setTimeout(() => {
      // Simulate OCR result - in a real app, this would come from an OCR API
      // For demo purposes, we'll generate a random number
      const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
      setForm(prev => ({ ...prev, barcode: randomNum.toString() }));
      
      toast({
        title: "Text Detected",
        description: `Number ${randomNum} has been captured.`,
      });
      
      stopScanner();
    }, 1500);
  };

  const stopScanner = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowScanner(false);
  };

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
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className={errors.description ? 'border-red-500' : ''}
          />
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
              onClick={startScanner}
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
                <h3 className="text-lg font-medium">Scan Text/Number</h3>
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
                <video 
                  ref={videoRef} 
                  className="w-full h-64 object-cover" 
                  autoPlay 
                  playsInline
                  style={{ display: 'block' }}
                />
                <canvas 
                  ref={canvasRef} 
                  className="hidden" 
                />
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-green-500 opacity-70"></div>
                <div className="absolute inset-y-0 left-1/2 w-0.5 bg-green-500 opacity-70"></div>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">Position the text within the frame and take a snapshot</p>
              
              <div className="flex justify-center">
                <Button 
                  onClick={captureImage} 
                  className="bg-primary hover:bg-primary/90"
                >
                  Capture
                </Button>
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
