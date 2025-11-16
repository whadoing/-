import { MessageCircle, FileText, BookOpen, Printer, Settings, ShoppingCart } from "lucide-react";
import { useState } from "react";

interface HomePageProps {
  onStartOrder: () => void;
  onAdminAccess: () => void;
}

export default function HomePage({ onStartOrder, onAdminAccess }: HomePageProps) {
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [geoAllowed, setGeoAllowed] = useState(false);
  const [geoDenied, setGeoDenied] = useState(false);

  const handleStartOrder = () => {
    if (!geoAllowed) {
      requestGeoPermission();
    } else {
      setShowAgreement(true);
    }
  };

  const confirmAgreement = () => {
    setShowAgreement(false);
    setAgreed(false);
    onStartOrder();
  };

  const requestGeoPermission = () => {
    if (!navigator.geolocation) {
      alert("متصفحك لا يدعم تحديد الموقع!");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoAllowed(true);
        setGeoDenied(false);
        setShowAgreement(true); // بعد السماح نفتح شروط الخدمة مباشرة
      },
      (error) => {
        setGeoAllowed(false);
        setGeoDenied(true);
      }
    );
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

        {/* باقي المحتوى (Logo, Services, Prices) */}

        {/* Order Button */}
        <div className="flex flex-col items-center justify-center w-full md:w-2/3 mt-6">
          {!geoAllowed && geoDenied && (
            <p className="text-red-400 mb-4">
              يجب السماح بالوصول للموقع للاستمرار بالطلب.
            </p>
          )}
          <button
            onClick={handleStartOrder}
            className="button-secondary glow-button text-xl w-full md:w-auto px-6 py-4"
          >
            ابدأ الطلب الآن
          </button>
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

