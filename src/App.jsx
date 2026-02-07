import { useState } from 'react'
import Layout from './Layout'
import ManageSessions from './pages/ManageSessions'

function App() {
  const [count, setCount] = useState(0)

  return (
    <ManageSessions/>
  )
}

export default App
