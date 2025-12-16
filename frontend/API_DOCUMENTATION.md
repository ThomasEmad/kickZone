# API Documentation - KickZone

## قائمة الـ Endpoints المتوفرة

### 🏟️ Stadiums (الملاعب)

#### 1. جلب جميع الملاعب
```
GET /api/stadiums
```

**Parameters (Query):**
- `city` (optional): مرشح حسب المدينة
- `search` (optional): البحث حسب الاسم أو المنطقة

**Response:**
```json
{
  "success": true,
  "data": [...],
  "total": 9
}
```

---

#### 2. جلب ملعب محدد
```
GET /api/stadiums/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Greenfield Stadium",
    "city": "اسيوط المدينه",
    "area": "سيد",
    "hourlyPrice": 100,
    "img": "/stadiums/img1.jpeg",
    "filtration": "Assiut"
  }
}
```

---

#### 3. جلب الأوقات الفاضية لملعب
```
GET /api/stadiums/:id/slots
```

**Response:**
```json
{
  "success": true,
  "stadiumId": 1,
  "data": [
    { "time": "08:00 - 09:00", "available": true },
    { "time": "09:00 - 10:00", "available": false }
  ]
}
```

---

### 📅 Bookings (الحجوزات)

#### 1. جلب الحجوزات
```
GET /api/bookings
```

**Parameters (Query):**
- `userId` (optional): معرف المستخدم
- `PitchId` (optional): معرف الملعب

**Response:**
```json
{
  "success": true,
  "data": [...],
  "total": 5
}
```

---

#### 2. إنشاء حجز جديد
```
POST /api/bookings
```

**Request Body:**
```json
{
  "stadiumId": 1,
  "userId": 1,
  "time": "10:00 - 11:00",
  "date": "2025-12-15",
  "phoneNumber": "01234567890",
  "playerName": "Ahmed mohammed "
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إنشاء الحجز بنجاح",
  "data": {
    "id": 1,
    "stadiumId": 1,
    "userId": 1,
    "time": "10:00 - 11:00",
    "date": "2025-12-15",
    "status": "confirmed",
    "createdAt": "2025-12-14T10:30:00Z"
  }
}
```

---

#### 3. حذف حجز
```
DELETE /api/bookings?bookingId=1
```

**Response:**
```json
{
  "success": true,
  "message": "تم حذف الحجز بنجاح",
  "data": { ... }
}
```

---

### 🔐 Authentication (المصادقة)

#### تسجيل الدخول
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "loll@gmail.com",
  "password": "111111"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "id": 1,
    "name": "loll",
    "email": "loll@gmail.com",
    "type": "player"
  }
}
```

---

## كيفية الاستخدام في الـ Frontend

### استيراد API Service

```javascript
import { fetchStadiums, fetchStadiumById, createBooking } from '@/app/services/apiService';

// جلب الملاعب
const result = await fetchStadiums({ city: 'اسيوط' });

// جلب ملعب محدد
const stadium = await fetchStadiumById(1);

// إنشاء حجز
const booking = await createBooking({
  stadiumId: 1,
  userId: 1,
  time: "10:00 - 11:00",
  date: "2025-12-15",
  phoneNumber: "01234567890",
  playerName: "أحمد محمد"
});
```

---

## Error Handling

جميع الـ API responses تحتوي على:
- `success`: حالة النجاح (true/false)
- `message`: رسالة توضيحية (خاصة في حالة الفشل)
- `data`: البيانات المطلوبة (null إذا فشل)

```javascript
const result = await fetchStadiums();

if (!result.success) {
  console.error(result.message);
}
```

---

## Status Codes

- `200`: OK - النجاح
- `201`: Created - تم الإنشاء بنجاح
- `400`: Bad Request - بيانات غير صحيحة
- `401`: Unauthorized - بيانات دخول غير صحيحة
- `404`: Not Found - غير موجود
- `500`: Server Error - خطأ في الخادم

---

## الملاحظات

1. **الحجوزات**: حالياً يتم تخزينها في الذاكرة، في المستقبل يجب نقلها إلى قاعدة بيانات
2. **المصادقة**: حالياً بسيطة، يجب إضافة JWT tokens في المستقبل
3. **البيانات**: يتم الحصول عليها من `dummyData.js`
