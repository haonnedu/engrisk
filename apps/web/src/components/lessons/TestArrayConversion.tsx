import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export function TestArrayConversion() {
  const [objectives, setObjectives] = useState('draft,map')
  const [materials, setMaterials] = useState('Write simple sentences Use basic punctuation Create short paragraphs')
  
  const convertToArray = (input: string) => {
    return input
      ? input.split(/[\n,]+/) // Split by newline or comma
          .map(item => item.trim())
          .filter(item => item.length > 0)
      : []
  }

  const handleTest = () => {
    const objectivesArray = convertToArray(objectives)
    const materialsArray = convertToArray(materials)
    
    console.log('Original objectives:', objectives)
    console.log('Objectives array:', objectivesArray)
    console.log('Original materials:', materials)
    console.log('Materials array:', materialsArray)
    
    alert(`Objectives: [${objectivesArray.join(', ')}]\nMaterials: [${materialsArray.join(', ')}]`)
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Array Conversion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Objectives (comma or newline separated)</label>
            <Textarea
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              placeholder="Enter objectives separated by commas or new lines"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Materials (comma or newline separated)</label>
            <Textarea
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              placeholder="Enter materials separated by commas or new lines"
              rows={3}
            />
          </div>
          
          <Button onClick={handleTest} className="w-full">
            Test Conversion
          </Button>
          
          <div className="text-sm text-gray-600">
            <p>This component tests the array conversion logic used in CreateLessonForClass.</p>
            <p>Check the console for detailed output.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 