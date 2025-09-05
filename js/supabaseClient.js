// js/supabaseClient.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const supabase = createClient(
  'https://rsquaawnsydiadbarwks.supabase.co',  // URL ของโปรเจค Supabase
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzcXVhYXduc3lkaWFkYmFyd2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NDg0NzEsImV4cCI6MjA3MTQyNDQ3MX0.hAXeJtUkdpcOHyhmkgvWqM9VWFNb5Xl3HGLMq2DBWQw'                      // anon key ของ Supabase
);
