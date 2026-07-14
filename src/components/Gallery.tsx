import { useState, useEffect } from 'react'
import { ImageIcon, Loader2 } from 'lucide-react'

interface GalleryImage {
  id: string
  filename: string
  url: string
  title: string
  category: string
  uploadedAt: string
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<GalleryImage | null>(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('/api/images')
      .then(r => r.json())
      .then(data => {
        setImages(data.images || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const categories = ['all', ...new Set(images.map(img => img.category || 'ทั่วไป'))]
  const filtered = filter === 'all' ? images : images.filter(img => (img.category || 'ทั่วไป') === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">แกลเลอรี่ผลงาน</h1>
        <p className="text-gray-500">เลือกชมผลงานที่คุณสนใจ แล้วติดต่อเราได้เลย</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === cat
                ? 'bg-brand-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {cat === 'all' ? 'ทั้งหมด' : cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>ยังไม่มีรูปภาพในแกลเลอรี่</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(img => (
            <div
              key={img.id}
              onClick={() => setSelected(img)}
              className="group relative aspect-square bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-medium truncate">{img.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="max-w-4xl max-h-[90vh]">
            <img
              src={selected.url}
              alt={selected.title}
              className="max-w-full max-h-[85vh] rounded-lg object-contain"
              onClick={e => e.stopPropagation()}
            />
            <p className="text-white text-center mt-3 text-lg">{selected.title}</p>
          </div>
        </div>
      )}
    </div>
  )
}
