import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Copy, Check } from 'lucide-react'
import Prism from 'prismjs'

// Import Prism themes and languages
import '../../styles/prism-custom.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-python'

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
  showCopy?: boolean
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'javascript',
  className,
  showCopy = true
}) => {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current) {
      // Set the code content
      codeRef.current.textContent = code
      
      // Apply syntax highlighting
      try {
        Prism.highlightElement(codeRef.current)
      } catch (error) {
        console.error('Prism highlighting error:', error)
      }
    }
  }, [code, language])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  return (
    <div className={cn(
      'relative bg-gray-900 rounded-lg border border-gray-700 overflow-hidden',
      className
    )}>
      <pre className="p-4 overflow-x-auto bg-gray-900 text-sm">
        <code 
          ref={codeRef}
          className={`language-${language} block`}
        >
          {code}
        </code>
      </pre>
    </div>
  )
}