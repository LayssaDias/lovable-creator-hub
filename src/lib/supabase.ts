import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export const checkUserRole = async (userId: string): Promise<'admin' | 'subscriber' | null> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return data.role as 'admin' | 'subscriber';
};

export const checkSubscriptionStatus = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return false;
  
  const now = new Date();
  const expirationDate = new Date(data.expiration_date);
  
  return data.is_active && expirationDate > now;
};

export { supabase, type User, type Session };
