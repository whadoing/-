import { useState, useEffect } from "react";
import { Check, Clock, FileText, Image as ImageIcon } from "lucide-react";

interface FileInfo {
  file: File;
  preview?: string;
  pageCount?: number;
}

interface ConfirmationModalProps {
  formData: any;
  fileInfo: FileInfo | null;
  price: number;
  deliveryTime: string;
  phoneNumber: string;
  isPhoneValid: boolean;
  note?: string; // ← أضف هذا
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}


export default function ConfirmationModal({
  formData,
  fileInfo,
  price,
  deliveryTime,
  phoneNumber,
  isPhoneValid,
  note,           // ← أضف هذا السطر
  onConfirm,
  onCancel,
  isSubmitting
}: ConfirmationModalProps) {


  const [countdown, setCountdown] = useState(5);
  const [canConfirm, setCanConfirm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanConfirm(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getServiceLabel = (serviceType: string) => {
    switch (serviceType) {
      case "print": return "طباعة ملف";
      case "summary": return "ملخص مادة";
      case "book_summary": return "ملخص كتاب كامل";
      default: return serviceType;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">تأكيد الطلب</h3>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center py-2 border-b border-white/20">
            <span className="text-gray-300">الاسم:</span>
            <span className="text-white font-semibold">{formData.fullName}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-white/20">
            <span className="text-gray-300">الصف:</span>
            <span className="text-white font-semibold">{formData.grade}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-white/20">
            <span className="text-gray-300">نوع الخدمة:</span>
            <span className="text-white font-semibold">{getServiceLabel(formData.serviceType)}</span>
          </div>

          {/* رقم الهاتف */}
          <div className="flex justify-between items-center py-2 border-b border-white/20">
            <span className="text-gray-300">رقم الهاتف:</span>
            <span className="text-white font-semibold">
              {phoneNumber && isPhoneValid ? phoneNumber : "غير محدد"}
            </span>
          </div>
          {/* ملاحظات إضافية */}
{note && (
  <div className="flex justify-between items-center py-2 border-b border-white/20">
    <span className="text-gray-300">ملاحظات:</span>
    <span className="text-white font-semibold">{note}</span>
  </div>
)}

          {fileInfo && (
            <div className="py-2 border-b border-white/20">
              <div className="flex items-center space-x-3 space-x-reverse">
                {fileInfo.file.type.includes("image") ? (
                  <ImageIcon className="w-6 h-6 text-blue-400" />
                ) : (
                  <FileText className="w-6 h-6 text-red-400" />
                )}
                <div>
                  <p className="text-white font-medium">{fileInfo.file.name}</p>
                  <p className="text-gray-400 text-sm">
                    {(fileInfo.file.size / 1024 / 1024).toFixed(2)} MB
                    {fileInfo.pageCount && ` • ${fileInfo.pageCount} صفحة`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* وقت التسليم */}
          <div className="flex justify-between items-center py-2 border-b border-white/20">
            <span className="text-gray-300">وقت التسليم:</span>
            <span className="text-white font-semibold">
              {deliveryTime === "morning"
                ? "بداية الدوام (لازم تجي بدري)"
                : deliveryTime === "break"
                ? "وقت الفسحة (صف 1/8)"
                : "في أي وقت (تعال افتح الباب وتقولي الطلب)"}
            </span>
          </div>

          {/* السعر الإجمالي */}
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-300">السعر الإجمالي:</span>
            <span className="text-green-400 font-bold text-xl">{price} ريال</span>
          </div>
        </div>

        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mb-6">
          <h4 className="text-white font-semibold mb-2">تعليمات الدفع:</h4>
          <p className="text-blue-300 text-sm">الدفع نقداً عند الاستلام</p>
          <p className="text-red-300 text-sm mt-2">أنا موجود في صف 1/8 (أولى ثامن)</p>
          <p className="text-red-400 text-sm mt-2">
            سأكون في الصف بداية الفسحة وحتى نهايتها، حوالي 5 دقائق.
          </p>
          <p className="text-red-400 text-sm mt-2">
            إذا لم تحضر في هذا الوقت، يمكنك الحضور في أي وقت يناسبك.
          </p>
          <p className="text-red-300 text-sm">اسمي سمير سيد إبراهيم</p>
        </div>

        <div className="flex space-x-4 space-x-reverse">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 transition-all disabled:opacity-50"
          >
            إلغاء
          </button>
          
          <button
            onClick={onConfirm}
            disabled={!canConfirm || isSubmitting}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : !canConfirm ? (
              <>
                <Clock className="w-4 h-4 ml-2" />
                تأكيد ({countdown})
              </>
            ) : (
              <>
                <Check className="w-4 h-4 ml-2" />
                تأكيد الطلب
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
