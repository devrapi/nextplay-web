import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [ping, setPing] = useState<string>('')

  useEffect(() => {
    axios.get('http://localhost:8000/api/ping')
      .then(res => setPing(res.data.message))
      .catch(err => setPing('Connection failed: ' + err.message))
  }, [])

  return (
    <>
      <h1 className="text-3xl font-bold text-primary underline text-center">NextPlay</h1>
      <p className="text-center mt-4">API: {ping || 'connecting...'}</p>
    </>
  )
}

export default App
