import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useLogoUpload = () => {
  const { toast } = useToast();

  const uploadLogo = async (file: File, brandName: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo_${brandName.replace(/\s+/g, '_')}_${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { uploadLogo };
};
