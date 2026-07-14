import { useState, useCallback, useEffect } from 'react'
import { Upload, X, ImagePlus, Loader2, Check } from 'lucide-react'

interface UploadingFile {
  file: File
  id: string
  status: 'uploading' | 'done' | 'error'
  title: string
  category: string
  progress: number
}

interface CloudinaryConfig {
  cloudName: string
  uploadPreset: string
}

export default function AdminUpload() {
  const [files, setFiles] = useState<UploadingFile[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [globalCategory, setGlobalCategory] = useState('ทั่วไป')
  const [config, setConfig] = useState<CloudinaryConfig | null>(null)

  useEffect(() => {
    fetch('/api/cloudinary-config')
      .then(r => r.json())
      .then(setConfig)
      .catch(() => null)
  }, [])

  const uploadToCloudinary = async (file: File, title: string, category: string): Promise<{url: string, publicId: string} | null> => {
    if (!config) return null

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', config.uploadPreset)
    formData.append('folder', 'fsecret-gallery')
    formData.append('context', `title=${title}|category=${category}`)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) return null
    const data = await res.json()
    return { url: data.secure_url, publicId: data.public_id }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    addFiles(dropped)
  }, [])

  const handleSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'))
    addFiles(selected)
  }, [])

  const addFiles = (newFiles: File[]) => {
    const uploads: UploadingFile[] = newFiles.map(file => ({
      file,
      id: Math.random().toString(36).slice(2),
      status: 'uploading',
      title: file.name.replace(/\.[^/.]+$/, ''),
      category: globalCategory,
      progress: 0,
    }))
    setFiles(prev => [...prev, ...uploads])
    uploads.forEach(uploadFile)
  }

  const uploadFile = async (item: UploadingFile) => {
    try {
      const result = await uploadToCloudinary(item.file, item.title, item.category)
      if (!result) throw new Error('Upload failed')

      // Save metadata to our backend
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/images', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          publicId: result.publicId,
          url: result.url,
          title: item.title,
          category: item.category,
        }),
      })

      if (!res.ok) throw new Error('Save metadata failed')

      setFiles(prev =>
        prev.map(f =>
          f.id === item.id ? { ...f, status: 'done' as const, progress: 100 } : f
        )
      )
    } catch {
      setFiles(prev =>
        prev.map(f =>
          f.id === item.id ? { ...f, status: 'error' as const } : f
        )
      )
    }
  }

  const updateTitle = (id: string, title: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, title } : f))
  }

  const updateCategory = (id: string, category: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, category } : f))
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">อัพโหลดรูปภาพ</h1>
        <p className="text-gray-500">ลากรูปมาวาง หรือคลิกเลือกไฟล์</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่เริ่มต้น</label>
        <input
          type="text"
          value={globalCategory}
          onChange={e => setGlobalCategory(e.target.value)}
          className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
          placeholder="หมวดหมู่"
        />
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all mb-6 ${
          dragOver
            ? 'border-brand-500 bg-brand-50'
            : 'border-gray-300 hover:border-gray-400 bg-white'
        }`}
      >
        <ImagePlus className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p className="text-lg font-medium text-gray-700">ลากรูปภาพมาวางที่นี่</p>
        <p className="text-sm text-gray-500 mt-1">หรือคลิกเพื่อเลือกไฟล์</p>
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*"
          onChange={handleSelect}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          {files.map(file => (
            <div
              key={file.id}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src={URL.createObjectURL(file.file)}
                  alt={file.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={file.title}
                  onChange={e => updateTitle(file.id, e.target.value)}
                  className="w-full text-sm font-medium text-gray-900 border-b border-transparent hover:border-gray-200 focus:border-brand-500 outline-none px-1 py-0.5"
                />
                <input
                  type="text"
                  value={file.category}
                  onChange={e => updateCategory(file.id, e.target.value)}
                  className="w-full text-xs text-gray-500 mt-1 border-b border-transparent hover:border-gray-200 focus:border-brand-500 outline-none px-1 py-0.5"
                />
                <div className="mt-2">
                  {file.status === 'uploading' && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                      </div>
                      <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
                    </div>
                  )}
                  {file.status === 'done' && (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <Check className="w-4 h-4" />
                      อัพโหลดสำเร็จ
                    </div>
                  )}
                  {file.status === 'error' && (
                    <div className="text-red-600 text-sm">อัพโหลดไม่สำเร็จ ลองใหม่</div>
                  )}
                </div>
              </div>

              <button
                onClick={() => removeFile(file.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
