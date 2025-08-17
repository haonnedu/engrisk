import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { BookOpen, Target, Clock, Play, CheckCircle } from 'lucide-react'
import type { StudentLesson } from '../../hooks/useStudentLessons'

interface StudentLessonsListProps {
  lessons: StudentLesson[]
  onLessonSelect: (lessonId: string) => void
  onActivitySelect: (activityId: string) => void
}

export function StudentLessonsList({ lessons, onLessonSelect, onActivitySelect }: StudentLessonsListProps) {
  if (lessons.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Chưa có bài học nào</h3>
          <p className="text-gray-600">Hãy đăng ký vào một lớp học để xem các bài học</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson) => (
        <Card
          key={lesson.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onLessonSelect(lesson.id)}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{lesson.title}</h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{lesson.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {lesson.duration} phút
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {lesson.status}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {lesson.difficulty}
                  </span>
                </div>

                {/* Progress */}
                {lesson.progress && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tiến độ:</span>
                      <span className="font-medium">
                        {lesson.progress.completedActivities} / {lesson.progress.totalActivities}
                      </span>
                    </div>
                    <Progress 
                      value={lesson.progress.totalActivities > 0 ? 
                        (lesson.progress.completedActivities / lesson.progress.totalActivities) * 100 : 0
                      } 
                      className="h-2"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Điểm trung bình: {lesson.progress.averageScore.toFixed(1)}</span>
                      {lesson.progress.completedActivities > 0 && (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Đang học
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="ml-4 flex flex-col gap-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    onLessonSelect(lesson.id)
                  }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Bắt đầu học
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 