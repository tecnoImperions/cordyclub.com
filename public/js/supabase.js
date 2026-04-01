// ═══════════════════════════════════
//  js/supabase.js – CordyClub Bolivia
// ═══════════════════════════════════
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL      = "https://iqloqrnaoxuldtinneqn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_fjYtclIYb_OeECjDf023Tw_DeeMCjXY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);