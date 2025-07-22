
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Plus } from "lucide-react";
import { Product } from "./AdminDashboard";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  onProductAdd: (product: Product) => void;
}

const categories = [
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Sports & Outdoors",
  "Health & Beauty",
  "Books & Media",
  "Toys & Games",
  "Automotive"
];

const suppliers = ["Supplier A", "Supplier B", "Supplier C"];

export const ImageUploader = ({ onProductAdd }: ImageUploaderProps) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
    supplier: "",
    imageFile: null as File | null
  });
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.imageFile || !formData.name || !formData.code || !formData.category || !formData.supplier) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and select an image",
        variant: "destructive"
      });
      return;
    }

    // Create a URL for the uploaded image (in a real app, you'd upload to a cloud service)
    const imageUrl = URL.createObjectURL(formData.imageFile);

    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: formData.name,
      code: formData.code,
      category: formData.category,
      supplier: formData.supplier,
      imageUrl,
      createdAt: new Date()
    };

    onProductAdd(newProduct);
    
    // Reset form
    setFormData({
      name: "",
      code: "",
      category: "",
      supplier: "",
      imageFile: null
    });
    
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    toast({
      title: "Product Added",
      description: "Product has been successfully added to your catalog",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              placeholder="Enter product name"
            />
          </div>
          
          <div>
            <Label htmlFor="code" className="text-white">Product Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              placeholder="Enter product code"
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-white">Category</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="bg-white/20 border-white/30 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="supplier" className="text-white">Supplier</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, supplier: value }))}>
              <SelectTrigger className="bg-white/20 border-white/30 text-white">
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map(supplier => (
                  <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="image-upload" className="text-white">Product Image</Label>
            <Card className="bg-white/10 border-white/30 border-dashed">
              <CardContent className="p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-white/60 mb-4" />
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="bg-white/20 border-white/30 text-white file:bg-white/20 file:border-0 file:text-white"
                  />
                  <p className="text-white/60 text-sm mt-2">Upload product image</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {formData.imageFile && (
            <Card className="bg-white/10 border-white/30">
              <CardContent className="p-4">
                <img
                  src={URL.createObjectURL(formData.imageFile)}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <p className="text-white/80 text-sm mt-2">Preview: {formData.imageFile.name}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Button type="submit" className="bg-white text-purple-600 hover:bg-white/90">
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </Button>
    </form>
  );
};
