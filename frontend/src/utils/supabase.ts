import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bishbbmefzrjrdcxhsmr.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable__xO9AhFCbW41B4Hg88o-qg_VSdv_MP7';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Format Indian mobile number to E.164 (+91XXXXXXXXXX)
 */
export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  if (phone.startsWith('+')) {
    return phone;
  }
  return `+91${digits}`;
}

/**
 * Send Phone OTP via Supabase Auth
 */
export async function sendPhoneOtp(rawPhone: string) {
  const formatted = formatPhoneNumber(rawPhone);
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: formatted,
  });

  return { data, error, formattedPhone: formatted };
}

/**
 * Verify Phone OTP via Supabase Auth
 */
export async function verifyPhoneOtp(rawPhone: string, token: string) {
  const formatted = formatPhoneNumber(rawPhone);
  const { data, error } = await supabase.auth.verifyOtp({
    phone: formatted,
    token: token.trim(),
    type: 'sms',
  });

  return { data, error, session: data?.session, user: data?.user };
}

/**
 * Sign out
 */
export async function signOutUser() {
  return await supabase.auth.signOut();
}

/**
 * Check current active session
 */
export async function getCurrentUserSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error, user: session?.user };
}
