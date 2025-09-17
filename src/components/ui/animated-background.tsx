import React, { useEffect, useRef } from 'react'

interface AnimatedBackgroundProps {
  children: React.ReactNode
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ children }) => {
  const particlesRef = useRef<HTMLDivElement>(null)
  const flowingLinesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 创建发光粒子
    const createParticles = () => {
      if (!particlesRef.current) return

      const particleCount = 80
      particlesRef.current.innerHTML = ''

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div')
        particle.className = 'particle'
        
        // 随机分布在整个屏幕
        particle.style.left = Math.random() * 100 + '%'
        particle.style.top = Math.random() * 100 + '%'
        
        // 随机动画延迟和持续时间
        particle.style.animationDelay = Math.random() * 20 + 's'
        particle.style.animationDuration = (12 + Math.random() * 8) + 's'
        
        // 添加随机的移动方向
        const randomX = (Math.random() - 0.5) * 400
        const randomY = (Math.random() - 0.5) * 400
        particle.style.setProperty('--random-x', randomX + 'px')
        particle.style.setProperty('--random-y', randomY + 'px')
        
        // 随机选择动画类型
        const animationType = Math.random()
        if (animationType < 0.4) {
          particle.style.animation = `float-random ${particle.style.animationDuration} linear infinite`
        } else if (animationType < 0.7) {
          particle.style.animation = `float-up ${particle.style.animationDuration} linear infinite`
        } else {
          particle.style.animation = `float-diagonal ${particle.style.animationDuration} linear infinite`
        }
        particle.style.animationDelay = Math.random() * 15 + 's'
        
        particlesRef.current.appendChild(particle)
      }
    }

    // 创建流动线条
    const createFlowingLines = () => {
      if (!flowingLinesRef.current) return

      const lineCount = 10
      flowingLinesRef.current.innerHTML = ''

      for (let i = 0; i < lineCount; i++) {
        const line = document.createElement('div')
        const lineType = Math.random()

        if (lineType < 0.3) {
          // 流星效果
          line.className = 'flowing-line meteor'
          line.style.left = Math.random() * 100 + '%'
          line.style.top = Math.random() * 50 + '%'
        } else if (lineType < 0.5) {
          // 对角线
          line.className = 'flowing-line diagonal'
          line.style.left = Math.random() * 100 + '%'
          line.style.top = Math.random() * 100 + '%'
        } else if (lineType < 0.7) {
          // 垂直线
          line.className = 'flowing-line vertical'
          line.style.left = Math.random() * 100 + '%'
          line.style.top = '0%'
        } else {
          // 水平线
          line.className = 'flowing-line'
          line.style.top = Math.random() * 100 + '%'
          line.style.left = '0%'
        }

        line.style.animationDelay = Math.random() * 15 + 's'
        flowingLinesRef.current.appendChild(line)
      }
    }

    // 创建星空效果
    const createStars = () => {
      const starCount = 100
      const container = document.createElement('div')
      container.style.position = 'fixed'
      container.style.top = '0'
      container.style.left = '0'
      container.style.width = '100%'
      container.style.height = '100%'
      container.style.pointerEvents = 'none'
      container.style.zIndex = '1'

      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div')
        star.className = 'star'
        star.style.left = Math.random() * 100 + '%'
        star.style.top = Math.random() * 100 + '%'
        star.style.animationDelay = Math.random() * 3 + 's'
        star.style.animationDuration = (2 + Math.random() * 4) + 's'
        container.appendChild(star)
      }

      document.body.appendChild(container)

      return () => {
        if (document.body.contains(container)) {
          document.body.removeChild(container)
        }
      }
    }

    createParticles()
    createFlowingLines()
    const cleanupStars = createStars()

    // 定期重新创建粒子以保持动效活跃
    const particleInterval = setInterval(createParticles, 30000)
    const lineInterval = setInterval(createFlowingLines, 20000)

    return () => {
      clearInterval(particleInterval)
      clearInterval(lineInterval)
      cleanupStars()
    }
  }, [])

  return (
    <>
      {/* 发光粒子容器 */}
      <div ref={particlesRef} className="particles-container" />
      
      {/* 流动线条容器 */}
      <div ref={flowingLinesRef} className="flowing-lines" />
      
      {/* 脉冲光环 */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div className="pulse-ring" style={{ 
          width: '150px', 
          height: '150px', 
          top: '25%', 
          left: '15%' 
        }} />
        <div className="pulse-ring" style={{ 
          width: '100px', 
          height: '100px', 
          top: '65%', 
          right: '20%' 
        }} />
      </div>

      {/* 内容 */}
      <div className="relative" style={{ zIndex: 10 }}>
        {children}
      </div>
    </>
  )
}