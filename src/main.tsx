import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import './index.css'
import App from './App.tsx'

const convexUrl = import.meta.env.VITE_CONVEX_URL

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {convexUrl ? (
      <ConvexProvider client={new ConvexReactClient(convexUrl)}>
        <App />
      </ConvexProvider>
    ) : (
      <main className="shell" role="alert">
        <h1>Droplet needs a Convex deployment.</h1>
        <p>Set VITE_CONVEX_URL to your cloud development deployment URL.</p>
      </main>
    )}
  </StrictMode>,
)
