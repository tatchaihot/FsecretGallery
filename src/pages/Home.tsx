import { Link } from '../lib/router';
import { Button } from '../components/ui/button';
import { ArrowRight, Sparkles, Image, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const features = [
  {
    icon: Image,
    title: 'ภาพคุณภาพสูง',
    description: 'สร้างภาพ AI ความละเอียดสูง สวยงาม ทุกรายละเอียด',
  },
  {
    icon: Zap,
    title: 'รวดเร็ว',
    description: 'ได้รับภาพในเวลาอันรวดเร็ว ตอบสนองทุกความต้องการ',
  },
  {
    icon: Shield,
    title: 'ลิขสิทธิ์เป็นของคุณ',
    description: 'ภาพที่สร้างทั้งหมดเป็นทรัพย์สินของลูกค้า 100%',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
                <Sparkles className="w-4 h-4" />
                AI Image Generation Service
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6"
            >
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                F-Secret AI Art
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto"
            >
              บริการรับสร้างภาพ AI คุณภาพสูง สร้างสรรค์ผลงานศิลปะดิจิทัลที่เป็นเอกลักษณ์
              ตอบโจทย์ทุกความต้องการ ไม่ว่าจะเป็นงานส่วนตัวหรือธุรกิจ
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/gallery">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-background font-semibold px-8 h-12 text-base shadow-lg shadow-orange-500/20"
                >
                  ดูผลงานทั้งหมด
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base border-border/60 hover:bg-muted/50"
                >
                  ติดต่อเรา
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">ทำไมต้อง F-Secret AI Art?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              เรามุ่งมั่นสร้างผลงานที่ดีที่สุด ด้วยเทคโนโลยี AI ล่าสุด
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-background border border-amber-500/20 p-8 sm:p-12 text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400/5 via-transparent to-transparent" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                พร้อมสร้างภาพในฝันของคุณ?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                ดูผลงานทั้งหมดของเราในแกลเลอรี่ หรือติดต่อเราผ่าน Line ได้เลย
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/gallery">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-background font-semibold px-8 h-12 text-base shadow-lg shadow-orange-500/20"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    เข้าสู่แกลเลอรี่
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 text-base border-border/60 hover:bg-muted/50"
                  >
                    ติดต่อผ่าน Line
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
