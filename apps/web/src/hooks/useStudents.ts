import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { StudentsService, Student, CreateStudentDto, UpdateStudentDto } from '../services/students.service'

const studentsService = new StudentsService()

export const useStudents = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['students', page, limit],
    queryFn: () => studentsService.getStudents(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useStudentsList = () => {
  return useQuery({
    queryKey: ['students', 'list'],
    queryFn: () => studentsService.getStudentsList(),
    staleTime: 5 * 60 * 1000,
  })
}

export const useStudent = (id: string) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => studentsService.getStudentById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateStudent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateStudentDto) => studentsService.createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}

export const useUpdateStudent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentDto }) =>
      studentsService.updateStudent(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['student', id] })
    },
  })
}

export const useDeleteStudent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => studentsService.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}

export const useStudentClasses = (studentId: string) => {
  return useQuery({
    queryKey: ['student', studentId, 'classes'],
    queryFn: () => studentsService.getStudentClasses(studentId),
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useStudentActivities = (studentId: string) => {
  return useQuery({
    queryKey: ['student', studentId, 'activities'],
    queryFn: () => studentsService.getStudentActivities(studentId),
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useStudentProgress = (studentId: string) => {
  return useQuery({
    queryKey: ['student', studentId, 'progress'],
    queryFn: () => studentsService.getStudentProgress(studentId),
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useEnrollStudentInClass = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ studentId, classId }: { studentId: string; classId: string }) =>
      studentsService.enrollStudentInClass(studentId, classId),
    onSuccess: (_, { studentId, classId }) => {
      queryClient.invalidateQueries({ queryKey: ['student', studentId, 'classes'] })
      queryClient.invalidateQueries({ queryKey: ['class', classId, 'students'] })
    },
  })
}

export const useUnenrollStudentFromClass = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ studentId, classId }: { studentId: string; classId: string }) =>
      studentsService.unenrollStudentFromClass(studentId, classId),
    onSuccess: (_, { studentId, classId }) => {
      queryClient.invalidateQueries({ queryKey: ['student', studentId, 'classes'] })
      queryClient.invalidateQueries({ queryKey: ['class', classId, 'students'] })
    },
  })
} 