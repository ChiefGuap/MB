import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface TherapySession {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string | null;
  summary: string | null;
  emotions: string[];
  transcript: string[];
}

export const saveSession = async (session: Omit<TherapySession, 'id'>) => {
  const { data, error } = await supabase
    .from('therapy_sessions')
    .insert([session])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const getSessions = async (userId: string) => {
  const { data, error } = await supabase
    .from('therapy_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('start_time', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};