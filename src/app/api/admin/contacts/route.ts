import { createAdminCrud } from '@/lib/admin-crud'

export const { GET, POST, PUT, DELETE } = createAdminCrud('contacts', {
  columns: ['platform', 'url', 'icon', 'universe'],
  orderBy: 'platform',
  ascending: true,
})
