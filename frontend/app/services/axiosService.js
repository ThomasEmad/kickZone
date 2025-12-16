/**
 * Axios API Service - بديل باستخدام Axios
 * (اختياري - استخدم هذا إذا أردت axios بدلاً من fetch)
 */

import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// إنشاء instance من axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor للأخطاء
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("خطأ في الطلب:", error);
    return Promise.reject(error);
  },
);

// ======== STADIUMS ========

/**
 * جلب جميع الملاعب
 */
export async function fetchStadiumsAxios(filters = {}) {
  try {
    const response = await axiosInstance.get("/stadiums", { params: filters });
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }
}

/**
 * جلب ملعب محدد
 */
export async function fetchStadiumByIdAxios(stadiumId) {
  try {
    const response = await axiosInstance.get(`/stadiums/${stadiumId}`);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

/**
 * جلب الأوقات الفاضية
 */
export async function fetchStadiumSlotsAxios(stadiumId) {
  try {
    const response = await axiosInstance.get(`/stadiums/${stadiumId}/slots`);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }
}

// ======== BOOKINGS ========

/**
 * جلب الحجوزات
 */
export async function fetchBookingsAxios(filters = {}) {
  try {
    const response = await axiosInstance.get("/bookings", { params: filters });
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }
}

/**
 * إنشاء حجز جديد
 */
export async function createBookingAxios(bookingData) {
  try {
    const response = await axiosInstance.post("/bookings", bookingData);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

/**
 * تحديث حجز
 */
export async function updateBookingAxios(bookingId, updateData) {
  try {
    const response = await axiosInstance.put(
      `/bookings/${bookingId}`,
      updateData,
    );
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

/**
 * حذف حجز
 */
export async function deleteBookingAxios(bookingId) {
  try {
    const response = await axiosInstance.delete(`/bookings/${bookingId}`);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

// ======== AUTHENTICATION ========

/**
 * تسجيل الدخول
 */
export async function loginAxios(credentials) {
  try {
    const response = await axiosInstance.post("/auth/login", credentials);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

/**
 * تسجيل حساب جديد
 */
export async function registerAxios(userData) {
  try {
    const response = await axiosInstance.post("/auth/register", userData);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

/**
 * تسجيل الخروج
 */
export async function logoutAxios() {
  try {
    const response = await axiosInstance.post("/auth/logout");
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

export default axiosInstance;
