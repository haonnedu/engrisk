import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ActivitiesService, Activity, CreateActivityDto, UpdateActivityDto } from '../services/activities.service'

const activitiesService = new ActivitiesService()

export const useActivities = () => {
  return useQuery({
    queryKey: ['activities'],
    queryFn: () => activitiesService.getActivities(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useActivity = (id: string) => {
  return useQuery({
    queryKey: ['activity', id],
    queryFn: () => activitiesService.getActivityById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useActivitiesByLesson = (lessonId: string) => {
  return useQuery({
    queryKey: ['activities', 'lesson', lessonId],
    queryFn: () => activitiesService.getActivitiesByLesson(lessonId),
    enabled: !!lessonId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useActivitiesByType = (type: string) => {
  return useQuery({
    queryKey: ['activities', 'type', type],
    queryFn: () => activitiesService.getActivitiesByType(type),
    enabled: !!type,
    staleTime: 5 * 60 * 1000,
  })
}

export const useActivitiesByDifficulty = (difficulty: string) => {
  return useQuery({
    queryKey: ['activities', 'difficulty', difficulty],
    queryFn: () => activitiesService.getActivitiesByDifficulty(difficulty),
    enabled: !!difficulty,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateActivity = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateActivityDto) => activitiesService.createActivity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
    },
  })
}

export const useUpdateActivity = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateActivityDto }) =>
      activitiesService.updateActivity(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['activity', id] })
    },
  })
}

export const useDeleteActivity = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => activitiesService.deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
    },
  })
}

export const useMarkActivityAsCompleted = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, score }: { id: string; score: number }) =>
      activitiesService.markActivityAsCompleted(id, score),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['activity', id] })
    },
  })
}

export const useQuizQuestions = (activityId: string) => {
  return useQuery({
    queryKey: ['activity', activityId, 'quiz-questions'],
    queryFn: () => activitiesService.getQuizQuestions(activityId),
    enabled: !!activityId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useMatchingPairs = (activityId: string) => {
  return useQuery({
    queryKey: ['activity', activityId, 'matching-pairs'],
    queryFn: () => activitiesService.getMatchingPairs(activityId),
    enabled: !!activityId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useFillBlanks = (activityId: string) => {
  return useQuery({
    queryKey: ['activity', activityId, 'fill-blanks'],
    queryFn: () => activitiesService.getFillBlanks(activityId),
    enabled: !!activityId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
} 