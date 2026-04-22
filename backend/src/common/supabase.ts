import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

// console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
// console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? '***' : 'NOT SET');

export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string,
);
