import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useLogoUpload = () => {
  const { toast } = useToast();

  const uploadLogo = async (file: File, brandName: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filename = `logo_${brandName.replace(/\s+/g, '_')}_${Date.now()}.${fileExt}`;

      const form = new FormData();
      form.append('file', file);
      form.append('prefix', 'logos');
      form.append('filename', filename);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: form,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Upload failed');
      }

      const { url } = await response.json();
      return url as string;
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
