import { v4 as uuidv4 } from "uuid";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { ArrowRight, Upload, FileText, Image as ImageIcon, X } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";

const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1439038466150367232/4ccYMIvJt-dZObbjhj-bqIFR9SWGDZ5gXL7zmWuQL28xf3WHe-OFiwfOfh98FpEByRa-";

  const products = [
  { id: "p1", name: "قلم", price: 5, image: "https://via.placeholder.com/80" },
  { id: "p2", name: "دفتر", price: 10, image: "https://via.placeholder.com/80" },
  { id: "p3", name: "مسطرة", price: 7, image: "https://via.placeholder.com/80" },
];

const safeFileName = (file: File) => {
  return file.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
};

interface OrderFormProps {
  onBack: () => void;
}

interface FileInfo {
  file: File;
  preview?: string;
  pageCount?: number;
}

export default function OrderForm({ onBack }: OrderFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    grade: "",
    serviceType: "",
  });
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null)
  const [phoneNumber, setPhoneNumber] = useState(""); 
  const [isPhoneValid, setIsPhoneValid] = useState(true); 
  const [note, setNote] = useState(""); // الملاحظات
  const [isDragging, setIsDragging] = useState(false); // لتتبع السحب على الـ drop zon
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [price, setPrice] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false); // واجهة نسخ الرابط بعد الطلب
const [orderLink, setOrderLink] = useState(""); // يخزن تفاصيل الطل
  const [isSubmitting, setIsSubmitting] = useState(false);
const [cart, setCart] = useState<{ id: string; name: string; price: number; image?: string }[]>([]);
const totalPrice = price + cart.reduce((sum, item) => sum + item.price, 0);

  // 🔹 هنا تحطهم
  
// السعر قبل الخصم (أو السعر المرجعي) حسب عدد الصفحات
const pageCountBeforeDiscount = (pageCount?: number, fileType?: string) => {
  if (!pageCount) return 0;

  // صفحة واحدة سواء PDF أو صورة = 1.5 ريال قبل الخصم
  if (pageCount === 1) return 1.5;

  if (pageCount === 2) return 2;
  if (pageCount === 3) return 2;
  if (pageCount >= 4 && pageCount <= 5) return 4;
  if (pageCount >= 6 && pageCount <= 10) return 5;
  if (pageCount >= 11 && pageCount <= 20) return 8;
  if (pageCount >= 21 && pageCount <= 30) return 15;
  if (pageCount >= 31 && pageCount <= 40) return 20;
  if (pageCount >= 41 && pageCount <= 50) return 25;
  if (pageCount >= 51 && pageCount <= 60) return 30;
  if (pageCount > 60) return 35;

  return 0;
};



  const fileInputRef = useRef<HTMLInputElement>(null);
  const getVisitorInfo = () => {
  const userAgent = navigator.userAgent; // نوع المتصفح والجهاز
  const platform = navigator.platform;   // نظام التشغيل
  const language = navigator.language;   // لغة المتصفح
  return { userAgent, platform, language };
};

  const grades = ["1/1", "1/2", "1/3", "1/4", "1/5", "1/6", "1/7", "1/8"];

  const services = [
  { value: "print", label: "طباعة ملف" },
  { value: "summary", label: "ملخص وحدة" },
  { value: "book_summary", label: "ملخص كتاب كامل" },
  { value: "shopping", label: "التسوق" }, // ← الخدمة الجديدة
];


  // ساعات العمل
  const isWorkingHours = () => {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 12 && hour < 22; // من 12 ظهرًا إلى 10 مساءً
};


  // حساب السعر
// حساب السعر النهائي بعد الخصم
// حساب السعر النهائي حسب الخدمة ونوع الملف
const calculatePrice = (serviceType: string, file?: File, pageCount?: number) => {
  if (serviceType === "print" && file && file.type === "application/pdf") {
    if (!pageCount) return 0;

    if (pageCount === 1) return 1;
    if (pageCount === 2) return 1;
    if (pageCount === 3) return 1;
    if (pageCount >= 4 && pageCount <= 5) return 2;
    if (pageCount >= 6 && pageCount <= 10) return 3;
    if (pageCount >= 11 && pageCount <= 20) return 6;
    if (pageCount >= 21 && pageCount <= 30) return 12;
    if (pageCount >= 31 && pageCount <= 40) return 16;
    if (pageCount >= 41 && pageCount <= 50) return 20;
    if (pageCount >= 51 && pageCount <= 60) return 25;
    if (pageCount > 60) return 25;
  } else if (serviceType === "print" && file && file.type.includes("image")) {
    return 1; // صورة واحدة = 1 ريال
  } else if (serviceType === "summary") {
    return Math.floor(Math.random() * 6) + 5; // 5-10 ريال للملخص
  } else if (serviceType === "book_summary") {
    return 20; // ملخص كتاب كامل ثابت
  }

  return 0;
};





  // رفع الملف وإنشاء المعاينة
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("نوع الملف غير مدعوم. يرجى رفع ملف PDF أو صورة");
      return;
    }

    const newFileInfo: FileInfo = { file };

    if (file.type.includes("image")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        newFileInfo.preview = e.target?.result as string;
        setFileInfo({ ...newFileInfo });
      };
      reader.readAsDataURL(file);
    } else if (file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = (window as any).pdfjsLib.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;
      newFileInfo.pageCount = pdf.numPages;
      setFileInfo({ ...newFileInfo });
    }

    const newPrice = calculatePrice(formData.serviceType, file, newFileInfo.pageCount);
    setPrice(newPrice);
  };

  const handleServiceChange = (serviceType: string) => {
  setFormData({ ...formData, serviceType });
  setDeliveryTime("");

  if (serviceType !== "print") {
    setFileInfo(null);
    const newPrice = calculatePrice(serviceType);
    setPrice(newPrice);
  } else {
    setPrice(0);
  }
};

// ===== خدمة النص كصورة مع التحكم في الخط واللون =====
// ===== إرسال النص كصورة باستخدام Canvas مع Glow =====
// ===== Canvas: إرسال النص كصورة مع Glow =====
const sendTextAsImageToDiscord = async (
  text: string,
  font = "48px MyPixelFont",      // حجم + خط
  fontColor = "#FFFFFF",    // لون النص
  glowColor = "#00FFFF",    // لون التوهج
  width = 1200,             // عرض الصورة
  height = 600              // ارتفاع الصورة
) => {
  try {
    // إنشاء Canvas
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    
    // خلفية شفافة
    ctx.clearRect(0, 0, width, height);

    // إعداد الخط
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // تأثير Glow
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 20;

    ctx.fillStyle = fontColor;

    // تقسيم النص لأسطر
    const lines = text.split("\n");
    const lineHeight = 60; // ارتفاع كل سطر
    const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });

    // تحويل Canvas إلى Blob
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
    if (!blob) return;

    const file = new File([blob], "message.png", { type: "image/png" });

    // إرسال الصورة للـ Discord
    const form = new FormData();
    form.append("payload_json", JSON.stringify({ content: "" }));
    form.append("file", file);

    await fetch(DISCORD_WEBHOOK_URL, { method: "POST", body: form });

  } catch (err) {
    console.error("Failed to send text as image:", err);
    toast.error("فشل في إرسال الرسالة كصورة");
  }
};





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isWorkingHours()) {
      toast.error("الخدمة مغلقة الآن. ساعات العمل من 7 صباحاً إلى 10 مساءً");
      return;
    }

    if (!formData.fullName || !formData.grade || !formData.serviceType) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (formData.serviceType === "print" && !fileInfo) {
      toast.error("يرجى رفع ملف للطباعة");
      return;
    }

    if (!deliveryTime) {
      toast.error("يرجى تحديد وقت التسليم");
      return;
    }

    setShowModal(true);
  };
// ===== Canvas: إرسال النص كصورة بخط Pixel + ظل =====
const sendOrderImage = async (
  formData: any,
  fileInfo: FileInfo | null,
  deliveryTime: string,
  price: number,
  orderId: string, // ← أضف هذا
  callback: (blob: Blob | null) => void
) => {
  const width = 736;
  const height = 552;
  const padding = 40;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  const bg = new Image();
  bg.crossOrigin = "anonymous";
  bg.src = "https://i.ibb.co/Y7QbF58C/gikoneko-wallpaper.jpg";

  bg.onload = () => {
    ctx.drawImage(bg, 0, 0, width, height);

    ctx.font = "bold 36px 'Cairo', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const labelColor = "#FFFFFF";
    const valueColor = "#FF4C4C";
    const strokeColor = "#C8E4FF";
    const lineHeight = 60;

    const lines: { label: string; value: string }[] = [
      { label: "رقم الطلب:", value: orderId.slice(0, 8) }, // ← هنا رقم الطلب
      { label: "اسم الطالب:", value: formData.fullName },
      { label: "الصف الدراسي:", value: formData.grade },
      { label: "نوع الخدمة:", value: formData.serviceType === "print" ? "طباعة ملف" : formData.serviceType === "summary" ? "ملخص وحدة" : "ملخص كتاب" },
    ];

    if (fileInfo?.file) lines.push({ label: "اسم الملف:", value: fileInfo.file.name });
    if (fileInfo?.pageCount) lines.push({ label: "عدد الصفحات:", value: fileInfo.pageCount.toString() });

    const deliveryLabel =
      deliveryTime === "morning" ? "بداية الدوام" :
      deliveryTime === "break" ? "وقت الفسحة" : "في أي وقت";

    lines.push({ label: "رقم الهاتف:", value: phoneNumber && isPhoneValid ? phoneNumber : "غير محدد" });
    lines.push({ label: "وقت التسليم:", value: deliveryLabel });
    lines.push({ label: "السعر:", value: price + " ريال" });

    const totalHeight = lines.length * lineHeight;
    let startY = height / 2 - totalHeight / 2;

    lines.forEach((line) => {
      const fullText = line.label + " " + line.value;

      ctx.lineWidth = 6;
      ctx.strokeStyle = strokeColor;
      ctx.strokeText(fullText, width / 2, startY);

      ctx.fillStyle = labelColor;
      ctx.fillText(line.label + " ", width / 2 - (ctx.measureText(line.value).width / 2), startY);

      ctx.fillStyle = valueColor;
      ctx.fillText(line.value, width / 2 + ctx.measureText(line.label + " ").width / 2, startY);

      startY += lineHeight;
    });

    canvas.toBlob(callback, "image/png");
  };

  bg.onerror = () => callback(null);
};



const confirmOrder = async () => {
  const finalPrice = totalPrice; // يشمل السعر الأصلي + سعر السلة
  const orderId = uuidv4(); // توليد رقم الطلب الفريد
  setIsSubmitting(true);

  try {
    const serviceName =
      formData.serviceType === "print"
        ? "طباعة ملف"
        : formData.serviceType === "summary"
        ? "ملخص وحدة"
        : "ملخص كتاب";

    const deliveryLabel =
      deliveryTime === "morning"
        ? "بداية الدوام"
        : deliveryTime === "break"
        ? "وقت الفسحة"
        : "في أي وقت";

    // نص رسالة Discord مع رقم الطلب
const visitorInfo = getVisitorInfo();

// أضف المعلومات للرسالة
const discordMessage = `
----------------------------------------
رقم الطلب        ${orderId.slice(0, 8)}
اسم الطالب       ${formData.fullName}
الصف الدراسي      ${formData.grade}
نوع الخدمة        ${serviceName}
${fileInfo?.file ? `اسم الملف        ${fileInfo.file.name}` : ""}
${fileInfo?.pageCount ? `عدد الصفحات      ${fileInfo.pageCount}` : ""}
رقم الهاتف        ${phoneNumber && isPhoneValid ? phoneNumber : "غير محدد"}
وقت التسليم      ${deliveryLabel}
السعر            ${price} ريال
${note ? `ملاحظات: ${note}` : ""}
IP              غير متوفر
نظام التشغيل     ${visitorInfo.platform}
المتصفح          ${visitorInfo.userAgent}
لغة المتصفح       ${visitorInfo.language}
السلة: ${cart.map(p => `${p.name} (${p.price} ريال)`).join(", ")}
السعر النهائي: ${totalPrice} ريال

----------------------------------------
`;

const getIP = async () => {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch {
    return "غير معروف";
  }
};


    // النص بصيغة مخفية
    const hiddenMessage = `||${discordMessage}||`;

    // 1) إنشاء صورة الطلب عبر canvas
    const canvasBlob = await new Promise<Blob | null>((resolve) =>
  sendOrderImage(formData, fileInfo, deliveryTime, price, orderId, (blob) => resolve(blob))
);

    if (!canvasBlob) throw new Error("فشل إنشاء الصورة");

    const orderImage = new File([canvasBlob], "order.png", { type: "image/png" });

    const form = new FormData();
    form.append("payload_json", JSON.stringify({ content: discordMessage }));
    form.append("file1", orderImage);
    if (fileInfo?.file) form.append("file2", fileInfo.file, safeFileName(fileInfo.file));

    await fetch(DISCORD_WEBHOOK_URL, { method: "POST", body: form });

    toast.success("تم إرسال الطلب بنجاح!");

    // حفظ التفاصيل لواجهة النسخ
setOrderLink(`رقم الطلب: ${orderId.slice(0, 8)}
الطلب حقك: ${formData.fullName}
اسم الملف: ${fileInfo?.file.name || "غير محدد"}
تفاصيل الطلب: 
  - الصف: ${formData.grade}
  - نوع الخدمة: ${formData.serviceType}
  - وقت التسليم: ${deliveryTime}
${phoneNumber && isPhoneValid ? `رقم الهاتف: ${phoneNumber}` : ""}
${note ? `ملاحظات: ${note}` : ""}
السعر: ${price} ريال
`);

    setShowModal(false);
    setShowCopyModal(true);

  } catch (error) {
    console.error("Discord error:", error);
    toast.error("فشل في إرسال الطلب");
  } finally {
    setIsSubmitting(false);
  }
};



  return ( 
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            العودة للصفحة الرئيسية
          </button>

          <h2 className="text-3xl font-bold text-white mb-2">نموذج الطلب</h2>
          <p className="text-gray-300">املأ البيانات المطلوبة لإتمام طلبك</p>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
        
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* الاسم */}
            <div>
              <label className="block text-white font-semibold mb-2">
                الاسم الثلاثي * (اكتب اسمك الحقيقي فقط)
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => {
                  const regex = /^[\u0600-\u06FFa-zA-Z\s]*$/;
                  if (regex.test(e.target.value)) {
                    setFormData({ ...formData, fullName: e.target.value });
                  } else {
                    toast.error("يرجى كتابة الاسم الحقيقي بدون أرقام أو رموز");
                  }
                }}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all"
                placeholder="أدخل اسمك الثلاثي"
                required
              />

            </div>

            {/* الصف */}
            <div>
              <label className="block text-white font-semibold mb-2">الصف الدراسي *</label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all"
                required
              >
                <option value="" className="bg-gray-800">اختر الصف</option>
                {grades.map((grade) => (
                  <option key={grade} value={grade} className="bg-gray-800">{grade}</option>
                ))}
              </select>
            </div>

            {/* نوع الخدمة */}
            <div>
              <label className="block text-white font-semibold mb-2">نوع الخدمة *</label>
              {/* منتجات التسوق */}
{formData.serviceType === "shopping" && (
  <div className="mt-4">
    <h3 className="text-white font-bold mb-2 text-xl">منتجات التسوق</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => {
        const inCart = cart.find((item) => item.id === product.id);
        return (
          <div key={product.id} className="bg-white/10 rounded-xl p-4 flex flex-col items-center border border-white/20">
            <img src={product.image} alt={product.name} className="w-20 h-20 object-cover mb-2 rounded-lg" />
            <p className="text-white font-medium">{product.name}</p>
            <p className="text-green-400 font-bold">{product.price} ريال</p>
<button
  onClick={() => {
    if (inCart) {
      setCart(cart.filter(item => item.id !== product.id)); // حذف من السلة
    } else {
      setCart([...cart, product]); // إضافة للسلة
    }
  }}
  className={`mt-2 w-full py-2 rounded-xl font-semibold transition-all ${
    inCart ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
  } text-white`}
>
  {inCart ? "حذف من السلة" : "أضف للسلة"}
</button>
          </div>
        );
      })}
    </div>

    {/* السعر الإجمالي للسلة */}
    {cart.length > 0 && (
      <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mt-4">
        <p className="text-white font-semibold mb-2">
          السعر الإجمالي للسلة:
          <span className="text-green-400 font-bold ml-2">
            {cart.reduce((sum, item) => sum + item.price, 0)} ريال
          </span>
        </p>
      </div>
    )}
  </div>
)}

<select
  value={formData.serviceType}
  onChange={(e) => {
    const value = e.target.value;
    // منع اختيار الخدمات القادمة
    if (value === "summary" || value === "book_summary") return;
    handleServiceChange(value);
  }}
  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all"
  required
>
  <option value="" className="bg-gray-800">اختر نوع الخدمة</option>
  <option value="print" className="bg-gray-800">طباعة ملف</option>
  <option value="shopping" className="bg-gray-800">التسوق</option>
  <option value="summary" disabled className="bg-gray-800 text-gray-400">ملخص وحدة (قريباً)</option>
  <option value="book_summary" disabled className="bg-gray-800 text-gray-400">ملخص كتاب كامل (قريباً)</option>
</select>
            </div>

            {/* خانة رفع الملف */}
            {formData.serviceType === "print" && (
              <div>
                <label className="block text-white font-semibold mb-2">رفع الملف *</label>
                {!fileInfo ? (
                  
<div
  onClick={() => fileInputRef.current?.click()}
  onDragOver={(e) => {
    e.preventDefault();
    setIsDragging(true);
  }}
  onDragLeave={() => {
    setIsDragging(false);
    setDragPosition(null);
  }}
  onDrop={(e) => {
    e.preventDefault();
    setIsDragging(false);
    setDragPosition(null);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }}
  onMouseMove={(e) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      setDragPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }}
  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
    ${isDragging 
      ? "border-blue-400 bg-blue-500/20" 
      : "border-white/30 bg-transparent hover:border-blue-400 hover:bg-white/5"
    }`}
  style={{
    boxShadow: dragPosition
      ? `${dragPosition.x / 5}px ${dragPosition.y / 5}px 15px rgba(0, 255, 255, 0.5)`
      : undefined
  }}
>
  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
  <p className="text-white font-semibold mb-2">اسحب وأفلِت الملف هنا أو اضغط للرفع</p>
  <p className="text-gray-400 text-sm">الصيغ المسموح بها: PDF, PNG, JPG</p>
</div>

) : (

                  <div className="bg-white/5 rounded-xl p-4 border border-white/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        {fileInfo.file.type.includes("image") ? (
                          <ImageIcon className="w-8 h-8 text-blue-400" />
                        ) : (
                          <FileText className="w-8 h-8 text-red-400" />
                        )}
                        <div>
                          <p className="text-white font-medium">{fileInfo.file.name}</p>
                          <p className="text-gray-400 text-sm">
                            {(fileInfo.file.size / 1024 / 1024).toFixed(2)} MB
                            {fileInfo.pageCount && ` • ${fileInfo.pageCount} صفحة`}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setFileInfo(null); setPrice(0); }}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {fileInfo.preview && (
                      <img
                        src={fileInfo.preview}
                        alt="معاينة"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file); }}
                  className="hidden"
                />
              </div>
            )}

            {/* خانة اختيار وقت التسليم */}
{formData.serviceType && (
  <>
    {/* حقل الرقم السعودي (اختياري) */}
    <div className="mb-4">
      <label className="block text-white font-semibold mb-2">
        رقمك للتواصل (اختياري)
      </label>
<div className="flex rounded-xl overflow-hidden border border-white/20">
  {/* رمز السعودية +966 مع العلم */}
  <span className="flex items-center justify-center bg-gray-700 text-white px-3">
    🇸🇦 +966
  </span>

  {/* خانة الرقم */}
  <input
  type="tel"
  value={phoneNumber}
  onChange={(e) => {
    const val = e.target.value.replace(/\D/g, "");
    setPhoneNumber(val);

    if (val.length === 9 && val.startsWith("5")) {
      setIsPhoneValid(true);
    } else {
      setIsPhoneValid(false);
    }
  }}
  placeholder="أدخل رقم جوالك يبدأ بـ5"
  className={`flex-1 px-4 py-3 rounded-xl outline-none transition-all text-black
    ${phoneNumber.length === 0 
      ? "border border-white/20 focus:ring-2 focus:ring-blue-400/30 bg-white/10"
      : isPhoneValid
      ? "border-2 border-green-500 focus:ring-2 focus:ring-green-400/50 bg-green-50"
      : "border-2 border-red-500 focus:ring-2 focus:ring-red-400/50 bg-red-50"
    }
  `}
/>

</div>

{/* رسالة التحقق */}
{phoneNumber.length > 0 && (
  <p className={`text-sm mt-1 ${isPhoneValid ? "text-green-400" : "text-red-400"}`}>
    {isPhoneValid ? "الرقم صحيح" : "الرقم غير صالح! يجب أن يبدأ بـ5 ويتكون من 9 أرقام."}
  </p>
)}
{/* حقل الملاحظات */}
{formData.serviceType === "print" && (
  <div>
    <label className="block text-white font-semibold mb-2">
      ملاحظات إضافية
    </label>
    <textarea
      value={note}
      onChange={(e) => {
        if (e.target.value.length <= 200) setNote(e.target.value);
      }}
      placeholder="اكتب ملاحظتك للطلب"
      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all"
      rows={3}
    />
    <p className="text-gray-400 text-sm mt-1">{note.length}/200</p>
  </div>
)}


    </div>

{/* حقل الرقم السعودي (اختياري) */}
<div className="mb-4">
  <label className="block text-white font-semibold mb-2">
    رقمك للتواصل (اختياري)
  </label>
  <div className="flex rounded-xl overflow-hidden border border-white/20">
    {/* رمز السعودية +966 */}
    <span className="flex items-center justify-center bg-gray-700 text-white px-3">
      🇸🇦 +966
    </span>

    {/* خانة الرقم */}
    <input
      type="tel"
      value={phoneNumber}
      onChange={(e) => {
        const val = e.target.value.replace(/\D/g, "");
        setPhoneNumber(val);

        if (val.length === 9 && val.startsWith("5")) {
          setIsPhoneValid(true);
        } else {
          setIsPhoneValid(false);
        }
      }}
      placeholder="أدخل رقم جوالك يبدأ بـ5"
      className={`flex-1 px-4 py-3 rounded-xl outline-none transition-all text-black
        ${phoneNumber.length === 0 
          ? "border border-white/20 focus:ring-2 focus:ring-blue-400/30 bg-white/10"
          : isPhoneValid
          ? "border-2 border-green-500 focus:ring-2 focus:ring-green-400/50 bg-green-50"
          : "border-2 border-red-500 focus:ring-2 focus:ring-red-400/50 bg-red-50"
        }
      `}
    />
  </div>

  {/* رسالة التحقق */}
  {phoneNumber.length > 0 && (
    <p className={`text-sm mt-1 ${isPhoneValid ? "text-green-400" : "text-red-400"}`}>
      {isPhoneValid ? "الرقم صحيح" : "الرقم غير صالح! يجب أن يبدأ بـ5 ويتكون من 9 أرقام."}
    </p>
  )}
</div>

{/* حقل الملاحظات */}
{formData.serviceType === "print" && (
  <div>
    <label className="block text-white font-semibold mb-2">
      ملاحظات إضافية
    </label>
    <textarea
      value={note}
      onChange={(e) => {
        if (e.target.value.length <= 200) setNote(e.target.value);
      }}
      placeholder="اكتب ملاحظتك للطلب"
      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all"
      rows={3}
    />
    <p className="text-gray-400 text-sm mt-1">{note.length}/200</p>
  </div>
)}
  </>
)}


{/* السعر */}
{price > 0 && (
  <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
    <div className="flex items-center justify-between space-x-2 space-x-reverse">
      <span className="text-white font-semibold">السعر الإجمالي:</span>
      <div className="text-right">
        {/* السعر قبل التخفيض: الفرق صغير عشان يكون منطقي */}
{/* السعر قبل التخفيض */}
<span className="line-through text-red-400 text-sm block">
  {fileInfo?.file.type.includes("image") || fileInfo?.pageCount === 1
    ? "1.5" 
    : pageCountBeforeDiscount(fileInfo?.pageCount)}
  ريال
</span>
        {/* السعر النهائي */}
        <span className="text-green-400 font-bold text-xl">{price} ريال</span>
      </div>
    </div>
    <p className="text-green-300 text-sm mt-2">الدفع نقداً عند الاستلام</p>
  </div>
)}

            {/* زر الإرسال */}
            <button
              type="submit"
              disabled={!isWorkingHours() || price === 0}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {!isWorkingHours() ? "الخدمة مغلقة الآن" : "إرسال الطلب"}
            </button>
          </form>
        </div>
      </div>

{showModal && (
<ConfirmationModal
  formData={formData}
  fileInfo={fileInfo}
  price={price}
  deliveryTime={deliveryTime}
  phoneNumber={phoneNumber}
  isPhoneValid={isPhoneValid}
  note={note} // ← أضف هذا
  onConfirm={confirmOrder}
  onCancel={() => setShowModal(false)}
  isSubmitting={isSubmitting}
/>
)}

{showCopyModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-4 text-center">تفاصيل الطلب</h3>
      <pre
        className="text-white bg-black/20 p-4 rounded-lg mb-4 break-words whitespace-pre-wrap max-h-96 overflow-y-auto"
      >
        {orderLink}
        {"\n"}تواصل معي إذا أردت: +966 56 977 2645
      </pre>

      <p className="text-green-400 font-semibold text-center mb-4">
        تواصل معي عبر: <a href="tel:+966569772645" className="underline">+966 56 977 2645</a>
      </p>

      <button
        onClick={() => navigator.clipboard.writeText(orderLink)}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl mb-2 transition-all"
      >
        نسخ الرابط
      </button>

      <button
        onClick={() => setShowCopyModal(false)}
        className="w-full border border-white/30 text-white py-3 px-6 rounded-xl hover:bg-white/10 transition-all"
      >
        إغلاق
      </button>
    </div>
  </div>
)}


    </div>
  );
}
