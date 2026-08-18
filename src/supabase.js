import { createClient } from "@supabase/supabase-js";

// 1. Pega aquí tu URL del proyecto (entre las comillas)
const supabaseUrl = "https://aavkbjajwwjubqacfzxj.supabase.co";

// 2. Pega aquí tu Clave publicable (entre las comillas)
const supabaseAnonKey = "sb_publishable_gIgVQb8AkxTQcvCL3i_3iQ_YuZd-SXk";

// Creamos el cliente de conexión para usarlo en toda la app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
