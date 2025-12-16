/**
 * API Service - للتواصل مع الـ Backend API
 * يستخدم Fetch API مع معالجة شاملة للأخطاء
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * دالة مساعدة لإرسال الطلبات HTTP
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };

    const response = await fetch(url, defaultOptions);

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "حدث خطأ في الطلب",
        status: response.status,
        data: null,
      };
    }

    return {
      success: true,
      data: data.data || data,
      status: response.status,
    };
  } catch (error) {
    console.error("خطأ في الطلب:", error);
    return {
      success: false,
      message: error.message || "حدث خطأ في الاتصال بالخادم",
      data: null,
    };
  }
}

// ======== STADIUMS ========

/**
 * جلب جميع الملاعب
 * @param {Object} filters - مرشحات البحث { city, search }
 */
export async function fetchStadiums(filters = {}) {
  const params = new URLSearchParams();

  if (filters.city) params.append("city", filters.city);
  if (filters.search) params.append("search", filters.search);

  const queryString = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/stadiums${queryString}`);
}

/**
 * جلب تفاصيل ملعب محدد
 * @param {number} stadiumId
 */
export async function fetchStadiumById(stadiumId) {
  return apiRequest(`/stadiums/${stadiumId}`);
}

/**
 * جلب الأوقات الفاضية لملعب معين
 * @param {number} stadiumId
 */
export async function fetchStadiumSlots(stadiumId) {
  return apiRequest(`/stadiums/${stadiumId}/slots`);
}

// ======== BOOKINGS ========

/**
 * جلب الحجوزات
 * @param {Object} filters - مرشحات { userId, stadiumId }
 */
export async function fetchBookings(filters = {}) {
  const params = new URLSearchParams();

  if (filters.userId) params.append("userId", filters.userId);
  if (filters.stadiumId) params.append("stadiumId", filters.stadiumId);

  const queryString = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/bookings${queryString}`);
}

/**
 * إنشاء حجز جديد
 * @param {Object} bookingData - { stadiumId, userId, time, date, phoneNumber, playerName }
 */
export async function createBooking(bookingData) {
  return apiRequest("/bookings", {
    method: "POST",
    body: JSON.stringify(bookingData),
  });
}

/**
 * حذف حجز
 * @param {number} bookingId
 */
export async function deleteBooking(bookingId) {
  return apiRequest(`/bookings/${bookingId}`, {
    method: "DELETE",
  });
}

/**
 * تحديث حجز
 * @param {number} bookingId
 * @param {Object} updateData
 */
export async function updateBooking(bookingId, updateData) {
  return apiRequest(`/bookings/${bookingId}`, {
    method: "PUT",
    body: JSON.stringify(updateData),
  });
}

// ======== AUTHENTICATION ========

/**
 * تسجيل الدخول
 * @param {Object} credentials - { email, password }
 */
export async function login(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

/**
 * تسجيل حساب جديد
 * @param {Object} userData - { email, password, name, type }
 */
export async function register(userData) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

/**
 * تسجيل الخروج
 */
export async function logout() {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
}

/**
 * التحقق من جلسة المستخدم
 */
export async function verifySession() {
  return apiRequest("/auth/verify");
}
