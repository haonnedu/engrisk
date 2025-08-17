import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ClassesService, Class, CreateClassDto, UpdateClassDto } from '../services/classes.service'

const classesService = new ClassesService()

export const useClasses = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['classes', page, limit],
    queryFn: () => classesService.getClasses(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useClass = (id: string) => {
  return useQuery({
    queryKey: ['class', id],
    queryFn: () => classesService.getClassById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useClassesByTeacher = (teacherId: string) => {
  return useQuery({
    queryKey: ['classes', 'teacher', teacherId],
    queryFn: () => classesService.getClassesByTeacher(teacherId),
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateClass = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateClassDto) => classesService.createClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
    },
  })
}

export const useUpdateClass = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClassDto }) =>
      classesService.updateClass(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
      queryClient.invalidateQueries({ queryKey: ['class', id] })
    },
  })
}

export const useDeleteClass = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => classesService.deleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
    },
  })
}

export const useClassStudents = (classId: string) => {
  return useQuery({
    queryKey: ['class', classId, 'students'],
    queryFn: () => classesService.getClassStudents(classId),
    enabled: !!classId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useAddStudentToClass = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ classId, studentId }: { classId: string; studentId: string }) =>
      classesService.addStudentToClass(classId, studentId),
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ['class', classId, 'students'] })
    },
  })
}

export const useRemoveStudentFromClass = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ classId, studentId }: { classId: string; studentId: string }) =>
      classesService.removeStudentFromClass(classId, studentId),
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ['class', classId, 'students'] })
    },
  })
} 