import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jfenxnajwcsdentxeakr.supabase.co'
const supabaseKey = 'sb_publishable_mraBpAoKDDrQvb7V-dXhZw_TkWBHHEb'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase.from('cars').insert([{ name: 'Test Car', user_id: '00000000-0000-0000-0000-000000000000' }]).select()
  console.log("Error:", error)
  console.log("Data:", data)
}
test()
