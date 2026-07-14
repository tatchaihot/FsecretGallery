import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, ImagePlus, Loader2, Check, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface UploadingFile {
  file: File;
  id: string;
  status: 'uploading' | 'done' | 'error';
  title: string;
  category: string;
}

interface ImageRecord {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl?: string;
  title: string;
  category: string;
  uploadedAt: string;
}

export default function AdminUpload() {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [globalCategory, setGlobalCategory] = useState('ทั่วไป');
  const [config, setConfig] = useState<{ cloudName: string; uploadPreset: string } | null>(null);
  const [images, setImages] = useState<ImageRecord[]>([]);

  useEffect(() => {
    fetch('/api/cloudinary-config')
      .then(r => r.json())
      .then(setConfig)
      .catch(() => null);
    loadImages();
  }, []);

  const loadImages = () => {
    fetch('/api/images')
      .then(r => r.json())
      .then(data => setImages(data.images || []));
  };

  const uploadToCloudinary = async (file: File, title: string, category: string): Promise<{url: string; publicId: string} | null> => {
    if (!config) return null;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);
    formData.append('folder', 'fsecret-gallery');
    formData.append('context', `title=${title}|category=${category}`);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) return null;
    const data = await res.json();
    return { url: data.secure_url, publicId: data.public_id };
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    addFiles(dropped);
  }, []);

  const handleSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    addFiles(selected);
  }, []);

  const addFiles = (newFiles: File[]) => {
    const uploads: UploadingFile[] = newFiles.map(file => ({
      file,
      id: Math.random().toString(36).slice(2),
      status: 'uploading',
      title: file.name.replace(/\.[^/.]+$/, ''),
      category: globalCategory,
    }));
    setFiles(prev => [...prev, ...uploads]);
    uploads.forEach(uploadFile);
  };

  const uploadFile = async (item: UploadingFile) => {
    try {
      const result = await uploadToCloudinary(item.file, item.title, item.category);
      if (!result) throw new Error('Upload failed');

      const token = localStorage.getItem('admin_token');
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
      });

      if (!res.ok) throw new Error('Save metadata failed');

      setFiles(prev =>
        prev.map(f =>
          f.id === item.id ? { ...f, status: 'done' as const } : f
        )
      );
      loadImages();
    } catch {
      setFiles(prev =>
        prev.map(f =>
          f.id === item.id ? { ...f, status: 'error' as const } : f
        )
      );
    }
  };

  const updateTitle = (id: string, title: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, title } : f));
  };

  const updateCategory = (id: string, category: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, category } : f));
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const deleteImage = async (id: string) => {
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`/api/images/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) loadImages();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 border border-primary/20">
                <Upload className="w-3.5 h-3.5" />
                จัดการรูปภาพ
              </div>
              <h1 className="text-3xl font-bold mb-2">อัพโหลดรูปภาพ</h1>
              <p className="text-muted-foreground">ลากรูปมาวาง หรือคลิกเลือกไฟล์</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-1">
                หมวดหมู่เริ่มต้น
              </label>
              <input
                type="text"
                value={globalCategory}
                onChange={e => setGlobalCategory(e.target.value)}
                className="w-full max-w-xs px-4 py-2 rounded-xl bg-muted/50 border border-border/50 text-foreground focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                placeholder="หมวดหมู่"
              />
            </div>

            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all mb-8 ${
                dragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-border/50 hover:border-border bg-card'
              }`}
            >
              <ImagePlus className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">ลากรูปภาพมาวางที่นี่</p>
              <p className="text-sm text-muted-foreground mt-1">หรือคลิกเพื่อเลือกไฟล์</p>
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
              <div className="space-y-3 mb-8">
                {files.map(file => (
                  <div
                    key={file.id}
                    className="bg-card rounded-xl p-4 border border-border/50 flex items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden flex-shrink-0">
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
                        className="w-full text-sm font-medium text-foreground bg-transparent border-b border-transparent hover:border-border focus:border-primary outline-none px-1 py-0.5 transition-colors"
                      />
                      <input
                        type="text"
                        value={file.category}
                        onChange={e => updateCategory(file.id, e.target.value)}
                        className="w-full text-xs text-muted-foreground mt-1 bg-transparent border-b border-transparent hover:border-border focus:border-primary outline-none px-1 py-0.5 transition-colors"
                      />
                      <div className="mt-2">
                        {file.status === 'uploading' && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
                            </div>
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          </div>
                        )}
                        {file.status === 'done' && (
                          <div className="flex items-center gap-1 text-green-400 text-sm">
                            <Check className="w-4 h-4" />
                            อัพโหลดสำเร็จ
                          </div>
                        )}
                        {file.status === 'error' && (
                          <div className="text-red-400 text-sm">อัพโหลดไม่สำเร็จ ลองใหม่</div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-2 text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Existing Images */}
            {images.length > 0 && (
              <>
                <h2 className="text-xl font-bold mb-4">รูปภาพที่อัพโหลดแล้ว ({images.length})</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map(img => (
                    <div key={img.id} className="relative group rounded-xl overflow-hidden border border-border/50 bg-card">
                      <div className="aspect-square">
                        <img
                          src={img.thumbnailUrl || img.url}
                          alt={img.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium truncate">{img.title}</p>
                        <p className="text-[10px] text-muted-foreground">{img.category}</p>
                      </div>
                      <button
                        onClick={() => deleteImage(img.id)}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500/80 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
