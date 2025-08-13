
import { Button } from './components/ui/button'

export default function App() {
  async function ping() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/lessons`)
    const data = await res.json()
    console.log(data)
  }
  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-4">English Class — Starter</h1>
      <p className="mb-4">shadcn/ui + Tailwind + React is ready.</p>
      <div className="flex items-center gap-3">
        <Button onClick={ping}>Click me</Button>
      </div>
    </div>
  )
}