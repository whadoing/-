import { MessageCircle, FileText, BookOpen, Printer, Settings } from "lucide-react";
import { useState } from "react";

interface HomePageProps {
  onStartOrder: () => void;
  onAdminAccess: () => void;
}

export default function HomePage({ onStartOrder, onAdminAccess }: HomePageProps) {
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleStartOrder = () => {
    setShowAgreement(true);
  };

  const confirmAgreement = () => {
    setShowAgreement(false);
    setAgreed(false);
    onStartOrder();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-5xl mx-auto text-center relative">
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
            <p className="text-gray-300">طباعة ملفات PDF والصور بجودة عالية ليزر </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <BookOpen className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">ملخص وحدة</h3>
            <p className="text-gray-300">ملخص مختصر لكل وحدة دراسية على حدة</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <BookOpen className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">ملخص كتاب كامل</h3>
            <p className="text-gray-300">ملخص كامل يغطي الكتاب بأكمله</p>
          </div>
        </div>

        {/* Prices + Order Button */}
        <p className="text-yellow-400 text-xl font-bold mb-4 drop-shadow-lg">
          أسعارنا أرخص من المكاتب 🔥
        </p>
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-12">
          {/* جدول الأسعار */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 w-full md:w-1/3">
            <h4 className="text-white font-semibold mb-2 text-lg text-center">الأسعار قبل وبعد الخصم</h4>
            <table className="w-full text-white text-center border-collapse">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-2">عدد الصفحات</th>
                  <th className="py-2">السعر قبل الخصم</th>
                  <th className="py-2">السعر بعد الخصم</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/20"><td>1</td><td>1.5</td><td>1</td></tr>
                <tr className="border-b border-white/20"><td>2</td><td>2</td><td>1</td></tr>
                <tr className="border-b border-white/20"><td>3</td><td>2</td><td>1</td></tr>
                <tr className="border-b border-white/20"><td>5</td><td>4</td><td>2</td></tr>
                <tr className="border-b border-white/20"><td>10</td><td>5</td><td>3</td></tr>
                <tr className="border-b border-white/20"><td>20</td><td>8</td><td>6</td></tr>
                <tr className="border-b border-white/20"><td>30</td><td>15</td><td>12</td></tr>
                <tr className="border-b border-white/20"><td>40</td><td>20</td><td>16</td></tr>
                <tr className="border-b border-white/20"><td>50</td><td>25</td><td>20</td></tr>
                <tr className="border-b border-white/20"><td>60</td><td>30</td><td>25</td></tr>
              </tbody>
            </table>
          </div>

          {/* زر الطلب */}
          <div className="flex flex-col items-center justify-center w-full md:w-2/3">
            <button
              onClick={handleStartOrder}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-2xl text-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 glow-button"
            >
              ابدأ الطلب الآن
            </button>
          </div>
        </div>

        {/* Working Hours + Contact */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
          <p className="text-gray-300 mb-2">
            <span className="text-green-400 font-semibold">ساعات العمل:</span> من الساعة 12 ظهرًا إلى ال 10 مساءً
          </p>
          <p className="text-green-400 font-semibold">
            تواصل معي إذا أردت: <a href="tel:+966569772645" className="underline hover:text-green-300">+966 56 977 2645</a>
          </p>
        </div>

        {/* Modal الشروط والقواعد */}
        {/* Modal الشروط والقواعد */}
{showAgreement && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 w-full max-w-lg text-white">
      <h2 className="text-2xl font-bold mb-6">شروط وقواعد الطلب</h2>
      <ul className="list-decimal list-inside mb-6 space-y-4 text-gray-200 text-base leading-relaxed">
        <li>الرجاء استخدام اسم صحيح عند تقديم الطلب، أي اسم شخص حقيقي فقط.</li>
        <li>يجب دفع قيمة الطلب كاملة قبل تنفيذه.</li>
        <li>عدم تكرار الطلبات بشكل متعمد (سبام)، سيتم احتساب ثمن الطلبات المكررة.</li>
        <li>أي محتوى غير لائق أو مخالف سيتم رفض الطلب فوراً.</li>
        <li>لا يتحمل الفريق أي مسؤولية عن المعلومات غير الصحيحة المقدمة من المستخدم.</li>
        <li>يتم التعامل مع أي مخالفة للقواعد بجدية وفق النظام الداخلي.</li>
      </ul>

      <div className="flex items-start mb-6">
        <input
          type="checkbox"
          id="agree"
          checked={agreed}
          onChange={() => setAgreed(!agreed)}
          className="mt-1 w-6 h-6 mr-3"
        />
        <label htmlFor="agree" className="text-gray-300 text-lg leading-snug">
          أقر بأنني قرأت الشروط والقواعد وأوافق عليها
        </label>
      </div>

      <button
        disabled={!agreed}
        onClick={confirmAgreement}
        className={`w-full py-3 rounded-xl text-white font-bold text-lg transition-all duration-300 ${
          agreed ? "bg-green-500 hover:bg-green-600" : "bg-gray-600 cursor-not-allowed"
        }`}
      >
        ابدأ الطلب
      </button>
    </div>
  </div>
)}

      </div>
    </div>
  );
}
