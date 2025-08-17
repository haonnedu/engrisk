import { lessonsService } from '../services/lessons.service'
import { useInfiniteQuery } from '@tanstack/react-query'

export function useInfiniteLessons(pageSize = 10) {
  return useInfiniteQuery({
    queryKey: ['lessons', 'infinite'],
    queryFn: ({ pageParam = 1 }) => 
      lessonsService.getLessons(),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.length === pageSize ? allPages.length + 1 : undefined
    },
    initialPageParam: 1,
  })
} 