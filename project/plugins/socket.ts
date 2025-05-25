import { defineNuxtPlugin } from '#app'
import { io } from 'socket.io-client'

export default defineNuxtPlugin((): { provide: { socket: null | ReturnType<typeof io> } } => {
  const config = useRuntimeConfig()
  const token = process.client ? localStorage.getItem('token') || '' : ''
  
  if (!config.public.socketUrl) {
    console.info('Socket connection skipped - server side or missing URL')
    return {
      provide: {
        socket: null
      }
    }
  }

  const socket = io(config.public.socketUrl, {
    transports: ['polling', 'websocket'],
    path: '/socket.io',
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    timeout: 20000,
    autoConnect: false,
    query: {
        token: token,
    },
  })

  socket.on('connect', () => {
    console.info('Socket connected successfully')
  })

  socket.on('connect_error', (error) => {
    console.info('Socket connection error:', error.message)
  })

  socket.on('error', (error) => {
    console.warn('Socket error:', error)
  })

  if (import.meta.client) {
    socket.connect()
  }

  return {
    provide: {
      socket
    }
  }
})