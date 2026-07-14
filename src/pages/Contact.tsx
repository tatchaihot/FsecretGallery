import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const lineId = 'tatchaihot';

  const handleCopyLineId = () => {
    navigator.clipboard.writeText(lineId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineAddUrl = `https://line.me/ti/p/~${encodeURIComponent(lineId)}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-xs font-medium mb-4 border border-green-500/20">
              <MessageCircle className="w-3.5 h-3.5" />
              ช่องทางติดต่อ
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">ติดต่อเรา</h1>
            <p className="text-muted-foreground">
              สอบถามหรือสั่งทำภาพ AI ติดต่อเราได้ทาง Line ได้เลยครับ
            </p>
          </motion.div>

          {/* Contact Cards */}
          <div className="space-y-6">
            {/* Line ID Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl bg-card border border-border/50 p-6 sm:p-8"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#06C755] flex items-center justify-center mb-5 shadow-lg shadow-green-500/20">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-xl font-semibold mb-2">Line ID</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  เพิ่มเพื่อนใน Line แล้วส่งข้อความมาได้เลย
                </p>

                <div className="w-full max-w-sm flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/30 mb-5">
                  <span className="flex-1 text-lg font-mono font-semibold text-foreground">
                    {lineId}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyLineId}
                    className="shrink-0 hover:bg-muted"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>

                <a
                  href={lineAddUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full max-w-sm"
                >
                  <Button
                    className="w-full h-12 bg-[#06C755] hover:bg-[#05a649] text-white font-semibold text-base gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    เพิ่มเพื่อนใน Line
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl bg-muted/30 border border-border/30 p-6"
            >
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                วิธีสั่งงาน
              </h3>
              <ol className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
                    1
                  </span>
                  เพิ่มเพื่อน Line ID: {lineId}
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
                    2
                  </span>
                  ส่งรายละเอียดภาพที่ต้องการ (แนวทาง สไตล์ ขนาด)
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
                    3
                  </span>
                  รอรับภาพตัวอย่างและยืนยันงาน
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
                    4
                  </span>
                  รับภาพสำเร็จรูปที่สวยงาม!
                </li>
              </ol>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
