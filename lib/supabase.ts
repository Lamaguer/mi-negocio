import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vvdftvvhgtxqoyfawbrd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2ZGZ0dnZoZ3R4cW95ZmF3YnJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MjY3MzIsImV4cCI6MjA5MzQwMjczMn0.aQm6COJR2JaxPrpPqPdJ9eiVmzufMSBNfe7r_lPPpjw'

export const supabase = createClient(supabaseUrl, supabaseKey)