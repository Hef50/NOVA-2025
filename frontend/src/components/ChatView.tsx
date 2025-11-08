import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

interface ChatResponse {
  response: string
}

export default function ChatView() {
  const [message, setMessage] = useState('')

  const mutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const response = await axios.post<ChatResponse>(
        'http://localhost:8000/chat_streaming',
        { message: userMessage }
      )
      return response.data
    },
    onSuccess: (data) => {
      console.log(data)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      mutation.mutate(message)
      setMessage('')
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Messages container */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        marginBottom: '20px', 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        backgroundColor: 'white'
      }}>
        <p style={{ color: '#666' }}>Messages will appear here...</p>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '16px',
            outline: 'none'
          }}
        />
        <button 
          type="submit" 
          disabled={mutation.isPending}
          style={{
            padding: '10px 24px',
            backgroundColor: mutation.isPending ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: mutation.isPending ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          {mutation.isPending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}

