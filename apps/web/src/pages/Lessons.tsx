import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Plus } from 'lucide-react'
import { LessonsTable } from '../components/LessonsTable'
import { useCreateLesson } from '@/hooks/useLessons'

export function Lessons() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newLesson, setNewLesson] = useState({ title: '', classId: '' })
  
  const createLessonMutation = useCreateLesson()

  const handleCreate = async () => {
    if (!newLesson.title.trim() || !newLesson.classId.trim()) return
    
    try {
      await createLessonMutation.mutateAsync(newLesson)
      setNewLesson({ title: '', classId: '' })
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create lesson:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Lessons</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Lesson
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="text-lg font-semibold mb-4">Create New Lesson</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Lesson title"
              value={newLesson.title}
              onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
              className="flex-1 px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Class ID"
              value={newLesson.classId}
              onChange={(e) => setNewLesson(prev => ({ ...prev, classId: e.target.value }))}
              className="flex-1 px-3 py-2 border rounded"
            />
            <Button 
              onClick={handleCreate}
              disabled={createLessonMutation.isPending}
            >
              {createLessonMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <LessonsTable />
    </div>
  )
} 