-- Script thiết lập database một lần duy nhất
-- Chạy script này một lần để sửa cấu trúc database

-- 1. Kiểm tra cấu trúc hiện tại
SELECT '=== CẤU TRÚC HIỆN TẠI ===' as info;

SELECT 
    table_name,
    column_name, 
    data_type, 
    udt_name,
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'activities' 
ORDER BY ordinal_position;

-- 2. Tạo enum type nếu chưa có
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activities_type_enum') THEN
        CREATE TYPE "public"."activities_type_enum" AS ENUM('quiz', 'matching', 'fill-blank', 'listening', 'speaking', 'reading');
        RAISE NOTICE '✅ Đã tạo enum type activities_type_enum';
    ELSE
        RAISE NOTICE 'ℹ️  Enum type activities_type_enum đã tồn tại';
    END IF;
END $$;

-- 3. Kiểm tra và sửa cột type
DO $$ 
BEGIN
    -- Kiểm tra xem cột type có tồn tại không
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'activities' AND column_name = 'type'
    ) THEN
        -- Thêm cột type mới
        ALTER TABLE "activities" ADD COLUMN "type" "public"."activities_type_enum" NOT NULL DEFAULT 'quiz';
        RAISE NOTICE '✅ Đã thêm cột type mới';
    ELSE
        -- Kiểm tra kiểu dữ liệu của cột type hiện tại
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'activities' 
            AND column_name = 'type' 
            AND data_type = 'USER-DEFINED' 
            AND udt_name = 'activities_type_enum'
        ) THEN
            RAISE NOTICE '✅ Cột type đã có đúng kiểu enum';
        ELSE
            RAISE NOTICE '⚠️  Cột type tồn tại nhưng không phải enum, cần sửa thủ công';
        END IF;
    END IF;
END $$;

-- 4. Tạo các bảng còn thiếu
-- Tạo bảng student_enrollments nếu chưa có
CREATE TABLE IF NOT EXISTS "student_enrollments" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "studentId" uuid NOT NULL,
    "classId" uuid NOT NULL,
    "status" varchar(20) NOT NULL DEFAULT 'active',
    "enrolledAt" timestamp,
    "completedAt" timestamp,
    "totalPoints" integer NOT NULL DEFAULT 0,
    "completedActivities" integer NOT NULL DEFAULT 0,
    "averageScore" decimal(5,2) NOT NULL DEFAULT 0,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now(),
    CONSTRAINT "PK_student_enrollments" PRIMARY KEY ("id"),
    CONSTRAINT "UQ_student_enrollments_student_class" UNIQUE ("studentId", "classId")
);

-- Tạo bảng activity_results nếu chưa có
CREATE TABLE IF NOT EXISTS "activity_results" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "studentId" uuid NOT NULL,
    "activityId" uuid NOT NULL,
    "status" varchar(20) NOT NULL DEFAULT 'in_progress',
    "score" integer,
    "maxScore" integer,
    "percentage" decimal(5,2),
    "timeSpent" integer,
    "timeLimit" integer,
    "answers" jsonb,
    "correctAnswers" jsonb,
    "feedback" text,
    "startedAt" timestamp,
    "completedAt" timestamp,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now(),
    CONSTRAINT "PK_activity_results" PRIMARY KEY ("id"),
    CONSTRAINT "UQ_activity_results_student_activity" UNIQUE ("studentId", "activityId")
);

-- 5. Tạo indexes
CREATE INDEX IF NOT EXISTS "IDX_activities_type" ON "activities" ("type");
CREATE INDEX IF NOT EXISTS "IDX_student_enrollments_student" ON "student_enrollments" ("studentId");
CREATE INDEX IF NOT EXISTS "IDX_student_enrollments_class" ON "student_enrollments" ("classId");
CREATE INDEX IF NOT EXISTS "IDX_activity_results_student" ON "activity_results" ("studentId");
CREATE INDEX IF NOT EXISTS "IDX_activity_results_activity" ON "activity_results" ("activityId");

-- 6. Kiểm tra kết quả cuối cùng
SELECT '=== KẾT QUẢ CUỐI CÙNG ===' as info;

-- Kiểm tra cấu trúc bảng activities
SELECT 
    'activities' as table_name,
    column_name, 
    data_type, 
    udt_name,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'activities' 
ORDER BY ordinal_position;

-- Kiểm tra các bảng đã tạo
SELECT 
    table_name,
    COUNT(*) as column_count
FROM information_schema.columns 
WHERE table_name IN ('student_enrollments', 'activity_results')
GROUP BY table_name;

-- Kiểm tra dữ liệu
SELECT 
    'Tổng số activities' as info,
    COUNT(*) as count
FROM activities
UNION ALL
SELECT 
    'Activities có type' as info,
    COUNT("type") as count
FROM activities
UNION ALL
SELECT 
    'Student enrollments' as info,
    COUNT(*) as count
FROM student_enrollments
UNION ALL
SELECT 
    'Activity results' as info,
    COUNT(*) as count
FROM activity_results;

SELECT '=== HOÀN THÀNH THIẾT LẬP DATABASE ===' as info;
