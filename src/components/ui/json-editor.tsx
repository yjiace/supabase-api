import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Code2, Check, AlertCircle } from 'lucide-react'
import { Button } from './button'
import Prism from 'prismjs'

// Import JSON language support
import 'prismjs/components/prism-json'

interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  rows?: number
}

export const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  className,
  placeholder = '{}',
  rows = 8
}) => {
  const [isValid, setIsValid] = useState(true)
  const [formatted, setFormatted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLPreElement>(null)

  // Validate JSON
  const validateJson = (jsonString: string): boolean => {
    if (!jsonString.trim()) return true
    try {
      JSON.parse(jsonString)
      return true
    } catch {
      return false
    }
  }

  // Format JSON
  const formatJson = () => {
    try {
      const parsed = JSON.parse(value)
      const formatted = JSON.stringify(parsed, null, 2)
      onChange(formatted)
      setFormatted(true)
      setTimeout(() => setFormatted(false), 1000)
    } catch (error) {
      // If parsing fails, don't format
      console.error('JSON format error:', error)
    }
  }

  // Update syntax highlighting
  const updateHighlight = () => {
    if (highlightRef.current) {
      const code = value || ''
      highlightRef.current.textContent = code
      
      if (code) {
        try {
          Prism.highlightElement(highlightRef.current)
        } catch (error) {
          console.error('Prism highlighting error:', error)
        }
      }
    }
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setIsValid(validateJson(newValue))
  }

  // Sync scroll between textarea and highlight
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      const textarea = textareaRef.current
      const highlight = highlightRef.current.parentElement
      if (highlight) {
        highlight.scrollTop = textarea.scrollTop
        highlight.scrollLeft = textarea.scrollLeft
      }
    }
  }

  // Handle tab key for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newValue)
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }
  }

  useEffect(() => {
    setIsValid(validateJson(value))
    updateHighlight()
  }, [value, placeholder])

  return (
    <div className={cn('relative', className)}>
      {/* Header with format button */}
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-cyber-light">
          请求体 (JSON)
        </label>
        <div className="flex items-center space-x-2">
          {!isValid && (
            <div className="flex items-center space-x-1 text-red-400 text-xs">
              <AlertCircle className="w-3 h-3" />
              <span>JSON 格式错误</span>
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={formatJson}
            disabled={!isValid || !value.trim()}
            className="h-6 px-2 text-xs"
          >
            {formatted ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                已格式化
              </>
            ) : (
              <>
                <Code2 className="w-3 h-3 mr-1" />
                格式化
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Editor container */}
      <div className="relative">
        {/* Background layer */}
        <div className="absolute inset-0 bg-dark-surface border border-dark-border rounded-md" />
        
        {/* Syntax highlighting layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-md">
          <pre 
            className="h-full w-full p-3 m-0 overflow-auto bg-transparent"
            style={{ 
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              fontFamily: "'Fira Code', 'Monaco', 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
              fontSize: '14px',
              lineHeight: '1.5'
            }}
          >
            <code 
              ref={highlightRef}
              className="language-json block"
              style={{ background: 'transparent' }}
            />
          </pre>
        </div>

        {/* Placeholder layer */}
        {!value && (
          <div 
            className="absolute inset-0 pointer-events-none p-3 text-cyber-gray"
            style={{ 
              fontFamily: "'Fira Code', 'Monaco', 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
              fontSize: '14px',
              lineHeight: '1.5'
            }}
          >
            {placeholder}
          </div>
        )}

        {/* Textarea input */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          rows={rows}
          className={cn(
            "relative z-10 w-full p-3 resize-none overflow-auto",
            "bg-transparent border-0 outline-none",
            "focus:ring-2 focus:ring-neon-green focus:ring-offset-2 focus:ring-offset-dark-bg rounded-md",
            "disabled:cursor-not-allowed disabled:opacity-50",
            // Make text transparent so syntax highlighting shows through
            "text-transparent selection:bg-neon-green/20"
          )}
          style={{ 
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            fontFamily: "'Fira Code', 'Monaco', 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
            fontSize: '14px',
            lineHeight: '1.5',
            caretColor: '#00ff88'
          }}
        />
        
        {/* Border overlay for validation state */}
        <div className={cn(
          "absolute inset-0 pointer-events-none rounded-md border-2",
          isValid ? "border-transparent" : "border-red-500"
        )} />
      </div>

      {/* Validation message */}
      {!isValid && value.trim() && (
        <div className="mt-1 text-xs text-red-400">
          请输入有效的 JSON 格式
        </div>
      )}
    </div>
  )
}