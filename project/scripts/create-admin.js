import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from parent directory's .env file
const envPath = path.join(__dirname, '..', '.env')
dotenv.config({ path: envPath })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function updateAdminUser() {
  const email = 'tony.payet.professionnel@gmail.com'
  const password = 'admin123'

  try {
    // First, get the user
    const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers()
    
    if (getUserError) {
      console.error('Error getting users:', getUserError.message)
      return
    }

    const adminUser = users.find(u => u.email === email)
    
    if (!adminUser) {
      console.error('Admin user not found')
      return
    }

    // Update the user to confirm email and set password
    const { data: user, error: updateError } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      {
        email_confirm: true,
        password,
        user_metadata: { role: 'admin' }
      }
    )

    if (updateError) {
      console.error('Error updating admin user:', updateError.message)
      return
    }

    console.log('Admin user updated successfully:', user)

  } catch (err) {
    console.error('Error:', err)
  }
}

updateAdminUser()
