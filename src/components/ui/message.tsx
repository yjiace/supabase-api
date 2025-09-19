import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

export type MessageType = 'success' | 'error' | 'warning' | 'info'

export interface MessageProps {
  type: MessageType
  title?: string
  content: string
  duration?: number
  onClose?: () => void
  closable?: boolean
}

export interface MessageInstance {
  id: string
  type: MessageType
  title?: string
  content: string
  duration?: number
  closable?: boolean
}

// Message 组件
export const Message: React.FC<MessageProps & { id?: string }> = ({
  type,
  title,
  content,
  duration = 4000,
  onClose,
  closable = true,
  id
}) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(() => onClose?.(), 300) // 等待动画完成
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => onClose?.(), 300)
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-300" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-300" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-300" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-300" />
    }
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900/90 border-green-500/50 text-green-100 backdrop-blur-sm'
      case 'error':
        return 'bg-red-900/90 border-red-500/50 text-red-100 backdrop-blur-sm'
      case 'warning':
        return 'bg-yellow-900/90 border-yellow-500/50 text-yellow-100 backdrop-blur-sm'
      case 'info':
        return 'bg-blue-900/90 border-blue-500/50 text-blue-100 backdrop-blur-sm'
    }
  }

  if (!visible) return null

  return (
    <div
      className={`
        relative min-w-[320px] max-w-[480px] p-4 rounded-lg border shadow-2xl
        transform transition-all duration-300 ease-in-out
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${getStyles()}
      `}
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          {title && (
            <div className="font-medium text-sm mb-1">{title}</div>
          )}
          <div className="text-sm whitespace-pre-wrap break-words">{content}</div>
        </div>
        {closable && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// Message 管理器
class MessageManager {
  private messages: MessageInstance[] = []
  private listeners: Array<(messages: MessageInstance[]) => void> = []

  subscribe(listener: (messages: MessageInstance[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.messages]))
  }

  private add(message: Omit<MessageInstance, 'id'>) {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newMessage: MessageInstance = { ...message, id }
    
    this.messages.push(newMessage)
    this.notify()

    // 自动移除消息
    if (message.duration !== 0) {
      setTimeout(() => {
        this.remove(id)
      }, message.duration || 4000)
    }

    return id
  }

  remove(id: string) {
    this.messages = this.messages.filter(m => m.id !== id)
    this.notify()
  }

  clear() {
    this.messages = []
    this.notify()
  }

  success(content: string, title?: string, duration?: number) {
    return this.add({ type: 'success', content, title, duration })
  }

  error(content: string, title?: string, duration?: number) {
    return this.add({ type: 'error', content, title, duration })
  }

  warning(content: string, title?: string, duration?: number) {
    return this.add({ type: 'warning', content, title, duration })
  }

  info(content: string, title?: string, duration?: number) {
    return this.add({ type: 'info', content, title, duration })
  }
}

export const messageManager = new MessageManager()

// Message 容器组件
export const MessageContainer: React.FC = () => {
  const [messages, setMessages] = useState<MessageInstance[]>([])

  useEffect(() => {
    const unsubscribe = messageManager.subscribe(setMessages)
    return unsubscribe
  }, [])

  return (
    <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
      <div className="flex flex-col space-y-3">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className="pointer-events-auto"
            style={{
              zIndex: 9999 - index
            }}
          >
            <Message
              {...message}
              onClose={() => messageManager.remove(message.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// 便捷的全局方法
export const message = {
  success: (content: string, title?: string, duration?: number) => 
    messageManager.success(content, title, duration),
  error: (content: string, title?: string, duration?: number) => 
    messageManager.error(content, title, duration),
  warning: (content: string, title?: string, duration?: number) => 
    messageManager.warning(content, title, duration),
  info: (content: string, title?: string, duration?: number) => 
    messageManager.info(content, title, duration),
  clear: () => messageManager.clear()
}