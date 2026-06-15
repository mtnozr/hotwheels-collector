import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jfenxnajwcsdentxeakr.supabase.co'
const supabaseKey = 'sb_publishable_mraBpAoKDDrQvb7V-dXhZw_TkWBHHEb'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase.from('cars').select('*').limit(1)
  console.log("Error:", error)
  console.log("Data:", data)
}
test()
