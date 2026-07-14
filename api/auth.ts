import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fsecret-gallery-secret-key-2024'
)

const ADMIN_USER = process.env.ADMIN_USER || 'tatchaihot'
const ADMIN_PASS = process.env.ADMIN_PASS || '741852963'

export async function signToken(payload: object): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, { clockTolerance: 60 })
    return payload
  } catch {
    return null
  }
}

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_USER && password === ADMIN_PASS
}

export async function requireAuth(headers: Headers): Promise<any | null> {
  const auth = headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return null
  const token = auth.slice(7)
  return verifyToken(token)
}
