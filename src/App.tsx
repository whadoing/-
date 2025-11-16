import { useState } from "react";
import { Toaster } from "sonner";
import HomePage from "./components/HomePage";
import OrderForm from "./components/OrderForm";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'order' | 'admin'>('home');

  // Simple admin access (in production, use proper authentication)
  const handleAdminAccess = () => {
    const password = prompt("أدخل كلمة مرور الإدارة:");
    if (password === "انا سمير") {
      setCurrentPage('admin');
    } else {
      alert("كلمة مرور خاطئة");
    }
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-300 to-red-500">
      {currentPage === 'home' && (
        <HomePage 
          onStartOrder={() => setCurrentPage('order')}
          onAdminAccess={handleAdminAccess}
        />
      )}
      {currentPage === 'order' && (
        <OrderForm onBack={() => setCurrentPage('home')} />
      )}
      {currentPage === 'admin' && (
        <AdminDashboard />
      )}
      <Toaster position="top-center" />
    </div>
  );
}
