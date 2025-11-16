import { MessageCircle, FileText, BookOpen, Printer, Settings, ShoppingCart } from "lucide-react";
import { useState } from "react";

interface HomePageProps {
  onStartOrder: () => void;
  onAdminAccess: () => void;
}

export default function HomePage({ onStartOrder, onAdminAccess }: HomePageProps) {
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleStartOrder = () => setShowAgreement(true);
  const confirmAgreement = () => {
    setShowAgreement(false);
    setAgreed(false);
    onStartOrder();
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-5xl w-full mx-auto text-center relative">

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

        {/* Logo & Header */}
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

        {/* Services */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: ShoppingCart, title: "خدمة السوق أونلاين", color: "text-yellow-400", desc: "توصيل المستلزمات والملفات للطالب داخل المدرسة" },
            { icon: FileText, title: "طباعة ملف", color: "text-blue-400", desc: "طباعة ملفات PDF والصور بجودة عالية ليزر" },
            { icon: BookOpen, title: "ملخص وحدة", color: "text-purple-400", desc: "ملخص مختصر لكل وحدة دراسية على حدة" },
            { icon: BookOpen, title: "ملخص كتاب كامل", color: "text-green-400", desc: "ملخص كامل يغطي الكتاب بأكمله" },
          ].map((service, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <service.icon className={`w-12 h-12 mx-auto mb-4 ${service.color}`} />
              <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
              <p className="text-gray-300 text-sm">{service.desc}</p>
            </div>
          ))}
        </div>

        {/* Prices + Order Button */}
        <p className="text-yellow-400 text-xl font-bold mb-4 drop-shadow-lg">
          أسعارنا أرخص من المكاتب 🔥
        </p>
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-12">
          {/* Price Table */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 w-full md:w-1/3">
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
                {[
                  [1, 1.5, 1],
                  [2, 2, 1],
                  [3, 2, 1],
                  [5, 4, 2],
                  [10, 5, 3],
                  [20, 8, 6],
                  [30, 15, 12],
                  [40, 20, 16],
                  [50, 25, 20],
                  [60, 30, 25],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/20">
                    {row.map((cell, j) => <td key={j} className="py-2">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

{/* Order Button */}
<div className="flex flex-col items-center justify-center w-full md:w-2/3">
  <button
    onClick={handleStartOrder}
    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
               text-white font-bold py-4 px-12 rounded-2xl text-xl shadow-2xl
               hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
  >
    ابدأ الطلب الآن
  </button>
</div>
        </div>

        {/* Working Hours + Contact */}
        <div className="mt-12 bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center">
          <p className="text-gray-300 mb-2">
            <span className="text-green-400 font-semibold">ساعات العمل:</span> من الساعة 12 ظهرًا إلى ال 10 مساءً
          </p>
          <p className="text-green-400 font-semibold">
            تواصل معي إذا أردت: <a href="tel:+966569772645" className="underline hover:text-green-300">+966 56 977 2645</a>
          </p>
        </div>

        {/* Modal الشروط والقواعد */}
        {showAgreement && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-11/12 max-w-lg text-white font-sans shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400 text-center">الشروط والقواعد</h2>
              <ul className="list-disc list-inside mb-6 space-y-2 text-gray-200 text-lg leading-relaxed">
                <li>استخدام أسماء وهمية أو غير صحيحة يؤدي لإلغاء الطلب.</li>
                <li>إرسال الطلبات بشكل متكرر يعتبر سبام.</li>
                <li>عدم دفع قيمة الطلب يعتبر مخالفة وسيتم التواصل مع الجهات المختصة.</li>
                <li>لا يتحمل الفريق أي مسؤولية عن المعلومات غير الصحيحة.</li>
                <li>يتم التعامل مع أي مخالفة للقواعد بجدية.</li>
                <li>أي محاولة لإساءة استخدام الخدمة تؤدي للحظر الدائم.</li>
                <li>أي تسريب للملخصات قد يعرضك للمسائلة القانونية.</li>
                <li>أنا لا أذهب إليك، تعال للحصول على الطلب.</li>
              </ul>

              <div className="flex items-start mb-6">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                  className="mt-1 w-6 h-6 mr-4"
                />
                <label htmlFor="agree" className="text-gray-300 text-lg leading-snug">
                  أقر بأنني قرأت جميع الشروط والقواعد وأوافق عليها
                </label>
              </div>

              <button
                disabled={!agreed}
                onClick={confirmAgreement}
                className={`w-full py-3 rounded-2xl text-white font-bold transition-all duration-300 ${
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
