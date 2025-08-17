# Database Setup Guide

## Vấn đề đã gặp

### 🚨 **Lỗi chính:**
- **Lỗi:** `cannot drop column type of table activities because other objects depend on it`
- **Nguyên nhân:** TypeORM với `synchronize: true` cố gắng tạo lại database mỗi lần khởi động
- **Hậu quả:** Xung đột với cấu trúc database hiện tại

### 🔍 **Tại sao mỗi lần chạy lại khởi tạo database?**

1. **`synchronize: true`** trong development mode
2. **TypeORM tự động sync** entities với database
3. **Cố gắng thay đổi cấu trúc** bảng đã tồn tại
4. **Gây ra xung đột** với dữ liệu hiện tại

## Giải pháp

### ✅ **Bước 1: Tắt synchronize**

Đã cập nhật `database.config.ts`:
```typescript
synchronize: false, // Tắt synchronize để tránh tạo lại database
```

### ✅ **Bước 2: Thiết lập database một lần duy nhất**

**Chạy script setup database:**
```bash
cd engrisk/apps/api
npm run setup:database
```

**Script này sẽ:**
- ✅ Tạo enum type cho cột `type`
- ✅ Sửa cấu trúc cột `type` trong bảng `activities`
- ✅ Tạo bảng `student_enrollments`
- ✅ Tạo bảng `activity_results`
- ✅ Tạo các indexes cần thiết
- ✅ Kiểm tra và hiển thị kết quả

### ✅ **Bước 3: Khởi động API**

**Sau khi setup xong:**
```bash
npm run start:dev
```

**API sẽ:**
- ✅ Không cố gắng tạo lại database
- ✅ Sử dụng cấu trúc database đã có
- ✅ Hoạt động bình thường với cột `type`

## Các script có sẵn

### 🛠️ **Scripts chính:**

1. **`npm run setup:database`** - Thiết lập database một lần duy nhất
2. **`npm run fix:activities:type`** - Sửa cột type (nếu cần)

### 📋 **Scripts khác:**

- `npm run start:dev` - Khởi động API development
- `npm run build` - Build production
- `npm run lint` - Kiểm tra code style

## Lưu ý quan trọng

### ⚠️ **Chỉ chạy setup một lần:**
- Script `setup:database` chỉ chạy **MỘT LẦN DUY NHẤT**
- Không chạy lại trừ khi cần thiết
- Database sẽ được thiết lập đúng cấu trúc

### 🔒 **Bảo mật:**
- `synchronize: false` đảm bảo database không bị thay đổi
- Dữ liệu hiện tại được bảo toàn
- Cấu trúc database ổn định

### 🚀 **Sau khi setup:**
- API sẽ khởi động bình thường
- Không còn lỗi database sync
- Cột `type` hoạt động đúng
- Tất cả endpoints hoạt động

## Troubleshooting

### ❌ **Nếu gặp lỗi setup:**
1. Kiểm tra kết nối database
2. Kiểm tra quyền user database
3. Chạy lại script setup

### 🔄 **Nếu cần thay đổi cấu trúc:**
1. Tạo migration script mới
2. Chạy migration thủ công
3. Không bật `synchronize: true`

### 📊 **Kiểm tra kết quả:**
Script setup sẽ hiển thị:
- Cấu trúc bảng hiện tại
- Số lượng records
- Trạng thái các bảng
- Thông báo hoàn thành

## Kết luận

**Giải pháp hoàn chỉnh:**
1. ✅ Tắt `synchronize: true`
2. ✅ Setup database một lần duy nhất
3. ✅ Khởi động API bình thường
4. ✅ Không còn lỗi database sync

**Database sẽ ổn định và API hoạt động bình thường!** 🎉
