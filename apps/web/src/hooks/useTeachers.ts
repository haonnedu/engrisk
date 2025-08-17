import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TeachersService, Teacher, CreateTeacherDto, UpdateTeacherDto } from '../services/teachers.service'

const teachersService = new TeachersService()

export const useTeachers = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['teachers', page, limit],
    queryFn: () => teachersService.getTeachers(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useTeachersList = () => {
  return useQuery({
    queryKey: ['teachers', 'list'],
    queryFn: () => teachersService.getTeachersList(),
    staleTime: 5 * 60 * 1000,
  })
}

export const useTeacher = (id: string) => {
  return useQuery({
    queryKey: ['teacher', id],
    queryFn: () => teachersService.getTeacherById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateTeacher = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateTeacherDto) => teachersService.createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
  })
}

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeacherDto }) =>
      teachersService.updateTeacher(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      queryClient.invalidateQueries({ queryKey: ['teacher', id] })
    },
  })
}

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => teachersService.deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
  })
}

export const useTeacherClasses = (teacherId: string) => {
  return useQuery({
    queryKey: ['teacher', teacherId, 'classes'],
    queryFn: () => teachersService.getTeacherClasses(teacherId),
    enabled: !!teacherId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useTeacherLessons = (teacherId: string) => {
  return useQuery({
    queryKey: ['teacher', teacherId, 'lessons'],
    queryFn: () => teachersService.getTeacherLessons(teacherId),
    enabled: !!teacherId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useTeacherStatistics = (teacherId: string) => {
  return useQuery({
    queryKey: ['teacher', teacherId, 'statistics'],
    queryFn: () => teachersService.getTeacherStatistics(teacherId),
    enabled: !!teacherId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
} 