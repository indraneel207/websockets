import { useEffect, useState } from 'react'
import { w3cwebsocket } from 'websocket'
import './App.css'

// Define the WebSocket client
const client = new w3cwebsocket('ws://localhost:3000')

function App() {
  const [userID, setUserID] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  // Connect to the WebSocket server
  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected')
    }

    client.onmessage = (data) => {
      const { userID, message } = JSON.parse(data.data)
      if (message === 'Welcome!') {
        setIsConnected(true)
        setUserID(userID)
      } else {
        setMessages((messages) => [...messages, {
          userID,
          message
        }])
      }
      console.log('Received message:', message, 'from userID:', userID)
    }

    client.onerror = (error) => {
      console.log('Connection Error:', error)
    }

    client.onclose = () => {
      console.log('echo-protocol Client Closed')
    }
  }, [])

  const handleMessageChange = (event) => {
    setMessage(event.target.value)
  }

  // Send a message to the WebSocket server
  const handleSendMessage = () => {
    client.send(message)
    setMessage('')
  }

  return (
    <div className='App'>
      <h1>WebSocket Chat</h1>
      <p>{isConnected ? 'Connected' : 'Disconnected'}</p>
      <p>{userID ? `Your userID is ${userID}` : 'Connecting...'}</p>
      <div>
        <input type='text' placeholder='Type a message...' onChange={handleMessageChange} value={message}/>
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <p>{message.userID}: {message.message}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
