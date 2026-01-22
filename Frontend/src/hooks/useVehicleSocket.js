import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { getToken } from '../services/authService'

export default function useVehicleSocket(routeId, onPositions) {
  const sockRef = useRef(null)

  useEffect(() => {
    if (!routeId) return
    const token = getToken()
    const url = (import.meta.env.VITE_API_BASE || 'http://localhost:5000')
    const socket = io(`${url}/vehicles`, { auth: { token: token ? `Bearer ${token}` : '' } })
    sockRef.current = socket
    socket.on('connect', () => {
      socket.emit('subscribe', routeId)
    })
    socket.on('positions', (data) => {
      if (typeof onPositions === 'function') onPositions(data)
    })
    socket.on('connect_error', (err) => {
      console.error('WS connect error', err)
    })

    return () => {
      try { socket.emit('unsubscribe', routeId) } catch(e){}
      socket.disconnect()
    }
  }, [routeId, onPositions])
}
