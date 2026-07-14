import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getImages, addImage } from './data';
import { signToken, validateCredentials, requireAuth } from './auth';
const app = new Hono();
app.use('/*', cors());
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'pl5qo8sm';
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'fsecret_unsigned';
// Login
app.post('/api/login', async (c) => {
    const body = await c.req.json();
    const { username, password } = body;
    if (!validateCredentials(username, password)) {
        return c.json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, 401);
    }
    const token = await signToken({ username, role: 'admin' });
    return c.json({ token });
});
// Verify token
app.get('/api/admin/verify', async (c) => {
    const user = await requireAuth(c.req.raw.headers);
    if (!user)
        return c.json({ error: 'Unauthorized' }, 401);
    return c.json({ user });
});
// Get images (public)
app.get('/api/images', (c) => {
    const images = getImages();
    return c.json({ images });
});
// Get Cloudinary config (for frontend upload)
app.get('/api/cloudinary-config', (c) => {
    return c.json({
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
    });
});
// Add image metadata (after Cloudinary upload)
app.post('/api/images', async (c) => {
    const user = await requireAuth(c.req.raw.headers);
    if (!user)
        return c.json({ error: 'Unauthorized' }, 401);
    const body = await c.req.json();
    const { publicId, url, title, category } = body;
    if (!publicId || !url) {
        return c.json({ error: 'publicId and url are required' }, 400);
    }
    const image = {
        id: publicId,
        filename: publicId,
        url: url,
        thumbnailUrl: url.replace('/upload/', '/upload/w_400,h_400,c_fill/'),
        title: title || 'ไม่มีชื่อ',
        category: category || 'ทั่วไป',
        uploadedAt: new Date().toISOString(),
    };
    addImage(image);
    return c.json({ success: true, image });
});
// Delete image (admin only)
app.delete('/api/images/:id', async (c) => {
    const user = await requireAuth(c.req.raw.headers);
    if (!user)
        return c.json({ error: 'Unauthorized' }, 401);
    const id = c.req.param('id');
    const images = getImages();
    const image = images.find(img => img.id === id);
    if (!image)
        return c.json({ error: 'Not found' }, 404);
    // Delete from Cloudinary if API key exists
    if (CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
        try {
            const timestamp = Math.floor(Date.now() / 1000);
            const signature = await createSignature(`public_id=${id}&timestamp=${timestamp}`, CLOUDINARY_API_SECRET);
            await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    public_id: id,
                    api_key: CLOUDINARY_API_KEY,
                    timestamp,
                    signature,
                }),
            });
        }
        catch (e) {
            console.error('Cloudinary delete failed:', e);
        }
    }
    // Remove from local data
    const fs = await import('fs');
    const path = await import('path');
    const dataFile = process.env.VERCEL ? '/tmp/images.json' : path.join(process.cwd(), 'data', 'images.json');
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    data.images = data.images.filter((img) => img.id !== id);
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    return c.json({ success: true });
});
// Health check
app.get('/api/health', (c) => c.json({ status: 'ok' }));
async function createSignature(stringToSign, apiSecret) {
    const encoder = new TextEncoder();
    const data = encoder.encode(stringToSign + apiSecret);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
export default app.fetch;
