import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import './App.css'

function App() {
  const health = useQuery(api.health.check)

  return (
    <main className="shell">
      <p className="eyebrow">Droplet</p>
      <h1>Water refilling, made easier.</h1>
      <p>We're exploring a simpler way to find and use water-refilling stations.</p>
      <p className="status" role="status">
        {health === undefined
          ? 'Connecting to Convex…'
          : health.ready
            ? 'Convex is ready. The early-signup experience is coming soon.'
            : 'Convex is not ready.'}
      </p>
    </main>
  )
}

export default App
