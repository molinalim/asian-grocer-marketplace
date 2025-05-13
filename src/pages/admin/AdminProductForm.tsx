
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products, categories } from '@/data/products';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, ScanBarcode } from "lucide-react";

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

      // Create a video element to show the camera feed
      const videoElement = document.createElement('video');
      videoElement.setAttribute('autoplay', 'true');
      videoElement.srcObject = mediaStream;
      videoElement.onloadedmetadata = () => {
        videoElement.play();
        captureBarcode(videoElement);
      };
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Could not access the camera. Please check your permissions.",
        variant: "destructive"
      });
    }
  };

  const captureBarcode = (videoElement: HTMLVideoElement) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // This is a simplified approach to demonstrate the concept
    // In a real app, you would use a proper barcode scanning library
    const checkForBarcode = setInterval(() => {
      if (!context || !videoElement.videoWidth) return;
      
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      // Simulate barcode detection (in reality, you'd use a proper library)
      // For demo purposes, we'll wait 3 seconds and generate a fake barcode
      setTimeout(() => {
        stopScanner();
        // Generate a random barcode number for demonstration
        const demoBarcode = Math.floor(Math.random() * 9000000000) + 1000000000;
        setForm(prev => ({ ...prev, barcode: demoBarcode.toString() }));
        toast({
          title: "Barcode Detected",
          description: `Barcode ${demoBarcode} has been scanned successfully.`
        });
        clearInterval(checkForBarcode);
      }, 3000);
    }, 500);
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
            Barcode
          </label>
          <div className="flex items-center space-x-2">
            <Input
              id="barcode"
              name="barcode"
              value={form.barcode}
              onChange={handleChange}
              placeholder="Scan or enter barcode"
              className="flex-1"
            />
            <Button 
              type="button" 
              onClick={startScanner}
              disabled={showScanner}
              variant="outline" 
              className="bg-[#F58634] hover:bg-[#e07a30] text-white"
            >
              {showScanner ? <ScanBarcode /> : <Camera />}
            </Button>
          </div>
        </div>
        
        {showScanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="bg-white p-4 rounded-lg w-full max-w-lg">
              <h3 className="text-lg font-medium mb-2">Scan Barcode</h3>
              <div className="aspect-video bg-gray-100 mb-4 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-1 bg-red-500 animate-pulse"></div>
                </div>
                <video id="scanner-video" className="w-full h-full" autoPlay playsInline></video>
              </div>
              <p className="text-sm text-gray-500 mb-4">Position the barcode within the frame to scan</p>
              <div className="flex justify-end">
                <Button type="button" onClick={stopScanner} variant="outline">
                  Cancel
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
