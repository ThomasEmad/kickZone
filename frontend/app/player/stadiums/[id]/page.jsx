"use client";

import React, { useState, useEffect } from "react";
import { stadiums, availableSlots } from "../../../data/dummyData";

export default function StadiumDetail({ params }) {
  const [stadium, setStadium] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStadium = async () => {
      const { id } = await params;
      const foundStadium = stadiums.find((s) => s.id === parseInt(id));
      const foundSlots = availableSlots[parseInt(id)] || [];

      setStadium(foundStadium);
      setSlots(foundSlots);
      setLoading(false);
    };

    getStadium();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!stadium) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <h2 className="text-2xl text-red-600 font-bold">⚠️ الملعب غير موجود</h2>
      </div>
    );
  }

  const handleBooking = () => {
    if (selectedTime) {
      alert(`تم حجز الملعب في الساعة: ${selectedTime}`);
      setShowBookingModal(false);
      setSelectedTime(null);
    } else {
      alert("من فضلك اختر وقت");
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-100 to-blue-100 py-6 px-4 dir-rtl"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto">
        {/* صورة الملعب */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8">
          <img
            src={stadium.img}
            alt={stadium.name}
            className="w-full h-96 object-cover"
          />
          <div className="absolute top-6 left-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
            ${stadium.hourlyPrice}/ساعة
          </div>
        </div>

        {/* معلومات الملعب */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-right">
            {stadium.name}
          </h1>

          {/* بطاقات المعلومات */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* الموقع */}
            <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-r-4 border-blue-600">
              <span className="text-3xl">📍</span>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-gray-600 font-semibold">
                  الموقع
                </p>
                <p className="text-lg text-gray-900 font-medium mt-1">
                  {stadium.city} / {stadium.area}
                </p>
              </div>
            </div>

            {/* المنطقة */}
            <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-r-4 border-green-600">
              <span className="text-3xl">🏟️</span>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-gray-600 font-semibold">
                  المنطقة
                </p>
                <p className="text-lg text-gray-900 font-medium mt-1">
                  {stadium.filtration}
                </p>
              </div>
            </div>
          </div>

          {/* زرار الحجز */}
          <button
            onClick={() => setShowBookingModal(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-lg"
          >
            🎫 احجز الملعب الآن
          </button>
        </div>

        {/* جدول الأوقات الفاضية */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right">
            📅 الأوقات الفاضية اليوم
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {slots.map((slot, index) => (
              <div
                key={index}
                onClick={() => slot.available && setSelectedTime(slot.time)}
                className={`p-4 rounded-lg border-2 text-center cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  slot.available
                    ? `border-green-500 bg-green-50 hover:bg-green-100 hover:shadow-lg ${
                        selectedTime === slot.time
                          ? "bg-green-200 border-green-700 ring-2 ring-green-400"
                          : ""
                      }`
                    : "border-red-500 bg-red-50 cursor-not-allowed opacity-50"
                }`}
              >
                <div className="font-bold text-sm text-gray-900">
                  {slot.time}
                </div>
                <div className="text-xs mt-2 text-gray-700">
                  {slot.available ? "✅ متاح" : "❌ محجوز"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal الحجز */}
      {showBookingModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowBookingModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-right animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* زرار الإغلاق */}
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl transition"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-5">
              تأكيد الحجز
            </h3>

            <div className="space-y-4 mb-6">
              <div className="border-b border-gray-200 pb-3">
                <p className="text-sm text-gray-600">الملعب:</p>
                <p className="font-bold text-gray-900">{stadium.name}</p>
              </div>

              <div className="border-b border-gray-200 pb-3">
                <p className="text-sm text-gray-600">الموقع:</p>
                <p className="font-bold text-gray-900">
                  {stadium.city} - {stadium.area}
                </p>
              </div>

              <div className="border-b border-gray-200 pb-3">
                <p className="text-sm text-gray-600">السعر:</p>
                <p className="font-bold text-gray-900">
                  ${stadium.hourlyPrice}
                </p>
              </div>

              {selectedTime && (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
                  <p className="text-sm text-gray-600">الوقت المختار:</p>
                  <p className="text-lg font-bold text-green-600">
                    {selectedTime}
                  </p>
                </div>
              )}
            </div>

            {/* أزرار المودال */}
            <div className="flex gap-3">
              <button
                onClick={handleBooking}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                ✅ تأكيد الحجز
              </button>
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-all duration-300"
              >
                ❌ إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
