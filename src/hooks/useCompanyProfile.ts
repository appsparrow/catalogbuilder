import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface CompanyProfile {
  id: string;
  company_name: string;
  contact_person: string;
  contact_phone: string | null;
  email: string;
  website_url: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useCompanyProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load profile from database
  const loadProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error loading company profile:', error);
      toast({
        title: "Error",
        description: "Failed to load company profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Save profile to database
  const saveProfile = async (profileData: Partial<CompanyProfile>) => {
    if (!user) return;

    try {
      setSaving(true);
      
      if (profile) {
        // Update existing profile
        const { error } = await supabase
          .from('company_profiles')
          .update({
            company_name: profileData.company_name,
            contact_person: profileData.contact_person,
            contact_phone: profileData.contact_phone,
            email: profileData.email,
            website_url: profileData.website_url,
            logo_url: profileData.logo_url,
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('company_profiles')
          .insert({
            user_id: user.id,
            company_name: profileData.company_name || '',
            contact_person: profileData.contact_person || '',
            contact_phone: profileData.contact_phone || null,
            email: profileData.email || '',
            website_url: profileData.website_url || null,
            logo_url: profileData.logo_url || null,
          });

        if (error) throw error;
      }

      // Reload profile
      await loadProfile();
      
      toast({
        title: "Success",
        description: "Company profile saved successfully",
      });
    } catch (error) {
      console.error('Error saving company profile:', error);
      toast({
        title: "Error",
        description: "Failed to save company profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Load profile on mount and when user changes
  useEffect(() => {
    loadProfile();
  }, [user]);

  return {
    profile,
    loading,
    saving,
    saveProfile,
    loadProfile,
  };
};
