import { createAdminCrud } from '@/lib/admin-crud'

export const { GET, POST, PUT, DELETE } = createAdminCrud('content_blocks', {
  columns: ['key', 'title', 'content', 'universe', 'bg_image_url', 'bg_video_url', 'bg_overlay_opacity'],
})
