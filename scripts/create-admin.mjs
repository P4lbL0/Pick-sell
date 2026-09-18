// Crée (ou promeut) un compte admin Supabase.
// Usage : node scripts/create-admin.mjs email@exemple.com "MotDePasse"
// Le rôle est stocké dans app_metadata, modifiable uniquement avec la clé service.
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split(/\r?\n/)
    .filter(l => /^[A-Z_]+=/.test(l))
    .map(l => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()])
)

const [email, password] = process.argv.slice(2)
if (!email || !password) {
  console.error('Usage : node scripts/create-admin.mjs email@exemple.com "MotDePasse"')
  process.exit(1)
}
if (password.length < 10) {
  console.error('Mot de passe trop court (10 caractères minimum).')
  process.exit(1)
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const { data: list, error: listError } = await admin.auth.admin.listUsers({ perPage: 1000 })
if (listError) throw listError
const existing = list.users.find(u => u.email?.toLowerCase() === email.toLowerCase())

const { error } = existing
  ? await admin.auth.admin.updateUserById(existing.id, {
      password,
      app_metadata: { ...existing.app_metadata, role: 'admin' },
    })
  : await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role: 'admin' },
    })
if (error) throw error

console.log(existing ? `Compte ${email} promu admin (mot de passe mis à jour).` : `Compte admin ${email} créé.`)
