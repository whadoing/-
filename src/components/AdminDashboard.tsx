import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { FileText, Image as ImageIcon, Clock, CheckCircle, XCircle, RefreshCw, Download } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const orders = useQuery(api.orders.getOrders) || [];
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'cancelled'>('all');

  const getServiceLabel = (serviceType: string) => {
    switch (serviceType) {
      case "print": return "طباعة ملف";
      case "summary": return "ملخص مادة";
      case "book_summary": return "ملخص كتاب كامل";
      default: return serviceType;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'processing': return <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'processing': return 'قيد المعالجة';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const filteredOrders = orders.filter(order => 
    filter === 'all' || order.status === filter
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">لوحة تحكم الإدارة</h1>
          <p className="text-gray-300">إدارة طلبات العملاء</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {[
            { key: 'all', label: 'جميع الطلبات' },
            { key: 'pending', label: 'في الانتظار' },
            { key: 'processing', label: 'قيد المعالجة' },
            { key: 'completed', label: 'مكتمل' },
            { key: 'cancelled', label: 'ملغي' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                filter === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Orders Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 space-x-reverse">
                  {getStatusIcon(order.status)}
                  <span className="text-white font-semibold">{getStatusLabel(order.status)}</span>
                </div>
                <span className="text-green-400 font-bold">{order.price} ريال</span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-gray-300 text-sm">الاسم:</span>
                  <p className="text-white font-medium">{order.fullName}</p>
                </div>
                
                <div>
                  <span className="text-gray-300 text-sm">الصف:</span>
                  <p className="text-white">{order.grade}</p>
                </div>
                
                <div>
                  <span className="text-gray-300 text-sm">نوع الخدمة:</span>
                  <p className="text-white">{getServiceLabel(order.serviceType)}</p>
                </div>

                {order.fileName && (
                  <div>
                    <span className="text-gray-300 text-sm">الملف:</span>
                    <div className="flex items-center space-x-2 space-x-reverse mt-1">
                      {order.fileName.includes('.pdf') ? (
                        <FileText className="w-4 h-4 text-red-400" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-blue-400" />
                      )}
                      <span className="text-white text-sm">{order.fileName}</span>
                    </div>
                    {order.pageCount && (
                      <p className="text-gray-400 text-xs">{order.pageCount} صفحة</p>
                    )}
                  </div>
                )}

                <div>
                  <span className="text-gray-300 text-sm">تاريخ الطلب:</span>
                  <p className="text-white text-sm">
                    {new Date(order.createdAt).toLocaleString('ar-SA')}
                  </p>
                </div>
              </div>

              {/* File Download Button */}
              {order.fileId && (
                <div className="mt-4">
                  <a
                    href={`/api/download/${order.fileId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm transition-all"
                  >
                    <Download className="w-4 h-4 ml-1" />
                    تحميل الملف
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center text-gray-300 mt-12">
            <p className="text-xl">لا توجد طلبات {filter !== 'all' ? `بحالة "${getStatusLabel(filter)}"` : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
}
