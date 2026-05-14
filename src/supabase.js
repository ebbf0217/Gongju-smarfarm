import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase 환경변수가 설정되지 않으면 null (localStorage 폴백 사용)
export const supabase = (url && key) ? createClient(url, key) : null;
