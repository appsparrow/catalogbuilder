import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validateImageFile } from '@/utils/imageUtils';

export const useLogoUpload = () => {
  const { toast } = useToast();

  const uploadLogo = async (file: File, brandName: string) => {
    try {
      // Validate file before upload
      const validation = validateImageFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const fileExt = file.name.split('.').pop();
      const filename = `logo_${brandName.replace(/\s+/g, '_')}_${Date.now()}.${fileExt}`;

      const form = new FormData();
      form.append('file', file);
      form.append('prefix', 'logos');
      form.append('filename', filename);

      const uploadEndpoint = (import.meta as any).env?.VITE_UPLOAD_ENDPOINT || '/api/upload-image';
      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: form,
      });

      if (!response.ok) {
        let message = 'Upload failed';
        try {
          const errJson = await response.json();
          message = errJson?.error || message;
        } catch {
          try {
            const errText = await response.text();
            message = `${message} (${response.status}): ${errText}`;
          } catch {}
        }
        throw new Error(message);
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
