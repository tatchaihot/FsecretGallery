import fs from 'fs'
import path from 'path'

const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'images.json')

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ images: [] }))
}

export interface ImageRecord {
  id: string
  filename: string
  url: string
  title: string
  category: string
  uploadedAt: string
}

export interface DataStore {
  images: ImageRecord[]
}

function readData(): DataStore {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { images: [] }
  }
}

function writeData(data: DataStore): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

export function getImages(): ImageRecord[] {
  return readData().images.sort((a, b) =>
    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  )
}

export function addImage(image: ImageRecord): void {
  const data = readData()
  data.images.push(image)
  writeData(data)
}

export function deleteImage(id: string): boolean {
  const data = readData()
  const idx = data.images.findIndex(img => img.id === id)
  if (idx === -1) return false
  data.images.splice(idx, 1)
  writeData(data)
  return true
}
