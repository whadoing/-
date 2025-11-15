import { MessageCircle, FileText, BookOpen, Printer, Settings } from "lucide-react";

interface HomePageProps {
  onStartOrder: () => void;
  onAdminAccess: () => void;
}

export default function HomePage({ onStartOrder, onAdminAccess }: HomePageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Admin Button */}
        <div className="absolute top-6 left-6">
          <button
            onClick={onAdminAccess}
            className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all"
            title="لوحة تحكم الإدارة"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Logo and Header */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <MessageCircle className="w-16 h-16 text-green-400 drop-shadow-lg" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Printer className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            روبوت خدمات
            <span className="text-green-400 glow-text"> WhatsApp</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            مرحباً بك! اختر الخدمة التي تريدها
          </p>
        </div>

        {/* Services Preview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <FileText className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">طباعة ملف</h3>
            <p className="text-gray-300">طباعة ملفات PDF والصور بجودة عالية</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <BookOpen className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">ملخص مادة</h3>
            <p className="text-gray-300">ملخصات شاملة للمواد الدراسية</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <BookOpen className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">ملخص كتاب كامل</h3>
            <p className="text-gray-300">ملخصات كاملة للكتب المدرسية</p>
          </div>
        </div>

        {/* Main CTA Button */}
        <button
          onClick={onStartOrder}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-2xl text-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 glow-button"
        >
          ابدأ الطلب الآن
        </button>

{/* Working Hours + Contact */}
<div className="mt-12 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
  <p className="text-gray-300 mb-2">
    <span className="text-green-400 font-semibold">ساعات العمل:</span> من 7 صباحاً إلى 10 مساءً
  </p>
  <p className="text-green-400 font-semibold">
    تواصل معي إذا أردت: <a href="tel:+966569772645" className="underline hover:text-green-300">+966 56 977 2645</a>
  </p>
</div>
      </div>
    </div>
  );
}
