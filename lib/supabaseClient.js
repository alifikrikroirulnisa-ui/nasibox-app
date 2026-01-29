import { createClient } from '@supabase/supabase-js'

// --- MASUKKAN DATA SUPABASE ANDA DI SINI (Pakai tanda kutip) ---

// 1. Copy Project URL dari Supabase (Settings -> API)
const supabaseUrl = 'https://imfiuptcrldgnxdatuts.supabase.co' 
// (Saya menebak URL Anda dari screenshot, tapi tolong CEK ULANG di dashboard Supabase Anda pastikan sama)

// 2. Copy "anon" / "public" Key dari Supabase (Settings -> API)
const supabaseAnonKey = 'sb_publishable_CZIkMBcsb3RFCjpmONFQ0Q_OFVE48FH'

// ---------------------------------------------------------------

export const supabase = createClient(supabaseUrl, supabaseAnonKey)