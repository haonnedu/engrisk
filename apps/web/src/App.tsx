
import { useState } from 'react'
import { Button } from './components/ui/button'
import { appConfig, apiConfig } from './config'


export default function App() {
  const [count, setCount] = useState(0)
  
  async function ping() {
    const res = await fetch(`${appConfig.api.baseUrl}${apiConfig.endpoints.lessons.list}`)
    const data = await res.json()
    console.log(data)
  }
  
  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-4">{appConfig.name} — Starter</h1>
      <p className="mb-4">shadcn/ui + Tailwind + React is ready.</p>
      <div className="flex items-center gap-3">
        <Button onClick={ping}>Click me</Button>
        <span>Count: {count}</span>
      </div>
    </div>
  )
}