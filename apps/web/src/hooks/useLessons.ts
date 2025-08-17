import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { LessonsService, Lesson, CreateLessonDto, UpdateLessonDto } from '../services/lessons.service'

const lessonsService = new LessonsService()

export const useLessons = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['lessons', page, limit],
    queryFn: () => lessonsService.getLessons(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useLesson = (id: string) => {
  return useQuery({
    queryKey: ['lesson', id],
    queryFn: () => lessonsService.getLessonById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useLessonsByClass = (classId: string) => {
  return useQuery({
    queryKey: ['lessons', 'class', classId],
    queryFn: () => lessonsService.getLessonsByClass(classId),
    enabled: !!classId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useLessonsByTeacher = (teacherId: string) => {
  return useQuery({
    queryKey: ['lessons', 'teacher', teacherId],
    queryFn: () => lessonsService.getLessonsByTeacher(teacherId),
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateLesson = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateLessonDto) => lessonsService.createLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
    },
  })
}

export const useUpdateLesson = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLessonDto }) =>
      lessonsService.updateLesson(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      queryClient.invalidateQueries({ queryKey: ['lesson', id] })
    },
  })
}

export const useDeleteLesson = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => lessonsService.deleteLesson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
    },
  })
}

export const usePublishLesson = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => lessonsService.publishLesson(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      queryClient.invalidateQueries({ queryKey: ['lesson', id] })
    },
  })
}

export const useUnpublishLesson = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => lessonsService.unpublishLesson(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      queryClient.invalidateQueries({ queryKey: ['lesson', id] })
    },
  })
} 