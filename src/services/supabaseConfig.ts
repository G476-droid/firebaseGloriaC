import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://sjxglinawvbosjjvfkac.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_2VVLQIjE13svfWkZhk0cfw_qRaXKoNx";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);