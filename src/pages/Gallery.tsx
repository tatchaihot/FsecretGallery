import { useState, useEffect } from 'react';
import { ImageIcon, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Skeleton } from '../components/ui/skeleton';

interface GalleryImage {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl?: string;
  title: string;
  category: string;
  uploadedAt: string;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/images')
      .then(r => r.json())
      .then(data => {
        setImages(data.images || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const categories = ['all', ...new Set(images.map(img => img.category || 'ทั่วไป'))];
  const filtered = filter === 'all' ? images : images.filter(img => (img.category || 'ทั่วไป') === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 border border-primary/20">
              <FolderOpen className="w-3.5 h-3.5" />
              รวมผลงานทั้งหมด
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">แกลเลอรี่</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              รวบรวมผลงานภาพ AI คุณภาพสูงจาก F-Secret AI Art แบ่งตามหมวดหมู่
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30'
                }`}
              >
                {cat === 'all' ? 'ทั้งหมด' : cat}
              </button>
            ))}
          </div>

          {/* Image Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => setSelected(img)}
                  className="group cursor-pointer"
                >
                  <div className="relative rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img
                        src={img.thumbnailUrl || img.url}
                        alt={img.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {img.title}
                        </h3>
                        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full shrink-0 ml-2">
                          {img.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(img.uploadedAt).toLocaleDateString('th-TH')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <FolderOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                ยังไม่มีรูปภาพ
              </h3>
              <p className="text-sm text-muted-foreground/60">
                รูปภาพจะปรากฏที่นี่เมื่อมีการอัพโหลดจากระบบ Admin
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-5xl max-h-[90vh]"
          >
            <img
              src={selected.url}
              alt={selected.title}
              className="max-w-full max-h-[85vh] rounded-lg object-contain"
              onClick={e => e.stopPropagation()}
            />
            <p className="text-white text-center mt-4 text-lg font-medium">{selected.title}</p>
            <p className="text-white/60 text-center text-sm">{selected.category}</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
