import { createClient } from "@supabase/supabase-js";

const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuaWR2dWVocHZpemZweWFlbnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI1NTI4OTgsImV4cCI6MjAwODEyODg5OH0.7wVHpZ9D9NU3jt0Ha5IO1l5mtA5c4X65wmFG-YICMHQ";
export const supabase = createClient(
  "https://hnidvuehpvizfpyaenwu.supabase.co",
  API_KEY
);
