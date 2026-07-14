import { Image, Lock, Upload, LogOut, Home } from 'lucide-react'

interface NavbarProps {
  page: string
  setPage: (page: string) => void
  isAdmin: boolean
  onLogout: () => void
}

export default function Navbar({ page, setPage, isAdmin, onLogout }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage('gallery')}>
            <Image className="w-6 h-6 text-brand-500" />
            <span className="font-bold text-lg text-gray-800">F-Secret Gallery</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage('gallery')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                page === 'gallery' ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Home className="w-4 h-4" />
              แกลเลอรี่
            </button>
            
            {isAdmin ? (
              <>
                <button
                  onClick={() => setPage('upload')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    page === 'upload' ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  อัพโหลด
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  ออก
                </button>
              </>
            ) : (
              <button
                onClick={() => setPage('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Lock className="w-4 h-4" />
                แอดมิน
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
