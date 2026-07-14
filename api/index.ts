import { Hono } from 'hono'
import { cors } from 'hono/cors'
import fs from 'fs'
import path from 'path'
import { signToken, validateCredentials, requireAuth } from './auth'
import { getImages, addImage, type ImageRecord } from './data'

const app = new Hono()

app.use('/*', cors())

// Vercel: use /tmp for uploads
const UPLOAD_DIR = process.env.VERCEL ? '/tmp/uploads' : path.join(process.cwd(), 'public', 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

// Login
app.post('/api/login', async (c) => {
  const body = await c.req.json()
  const { username, password } = body

  if (!validateCredentials(username, password)) {
    return c.json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, 401)
  }

  const token = await signToken({ username, role: 'admin' })
  return c.json({ token })
})

// Verify token
app.get('/api/admin/verify', async (c) => {
  const user = await requireAuth(c.req.raw.headers)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  return c.json({ user })
})

// Get images (public)
app.get('/api/images', (c) => {
  const images = getImages()
  return c.json({ images })
})

// Upload image (admin only)
app.post('/api/upload', async (c) => {
  const user = await requireAuth(c.req.raw.headers)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const body = await c.req.parseBody()
  const imageFile = body['image'] as File
  const title = (body['title'] as string) || 'ไม่มีชื่อ'
  const category = (body['category'] as string) || 'ทั่วไป'

  if (!imageFile) {
    return c.json({ error: 'No image provided' }, 400)
  }

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const ext = imageFile.name.split('.').pop() || 'jpg'
  const filename = `${id}.${ext}`
  const filepath = path.join(UPLOAD_DIR, filename)

  const buffer = Buffer.from(await imageFile.arrayBuffer())
  fs.writeFileSync(filepath, buffer)

  const image: ImageRecord = {
    id,
    filename,
    url: `/api/file/${filename}`,
    title,
    category,
    uploadedAt: new Date().toISOString(),
  }

  addImage(image)
  return c.json({ success: true, image })
})

// Delete image (admin only)
app.delete('/api/images/:id', async (c) => {
  const user = await requireAuth(c.req.raw.headers)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const id = c.req.param('id')
  const images = getImages()
  const image = images.find(img => img.id === id)

  if (!image) return c.json({ error: 'Not found' }, 404)

  try {
    const filepath = path.join(UPLOAD_DIR, image.filename)
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
  } catch (e) {
    console.error('Failed to delete file:', e)
  }

  const dataFile = process.env.VERCEL ? '/tmp/images.json' : path.join(process.cwd(), 'data', 'images.json')
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
  data.images = data.images.filter((img: ImageRecord) => img.id !== id)
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2))

  return c.json({ success: true })
})

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok' }))

// Serve uploaded files (Vercel)
app.get('/api/file/:filename', async (c) => {
  const filename = c.req.param('filename')
  const filepath = path.join(UPLOAD_DIR, filename)

  if (!fs.existsSync(filepath)) {
    return c.notFound()
  }

  const file = fs.readFileSync(filepath)
  const ext = path.extname(filepath).toLowerCase()
  const contentType =
    ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
    ext === '.png' ? 'image/png' :
    ext === '.gif' ? 'image/gif' :
    ext === '.webp' ? 'image/webp' :
    'application/octet-stream'

  return new Response(file, {
    headers: { 'Content-Type': contentType },
  })
})

// For Vercel serverless
export default app
