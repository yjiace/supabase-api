import React from 'react'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Bottom Section - 全部内容居中 */}
        <div className="flex flex-col items-center space-y-3 text-xs text-cyber-gray">
          <div className="text-center">
            <div className="text-cyber-gray text-sm">
              © {currentYear} Supabase API 演示平台. 保留所有权利.
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4">
            <a href="https://beian.miit.gov.cn/" target="_blank"><span className="text-center">备案号: 冀ICP备17000836号-2</span></a>
            <span className="hidden sm:inline text-dark-border">|</span>
            <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=13018102000160"><span className="text-center">冀公网安备 13018102000160号</span></a>
          </div>
        </div>
      </div>
    </footer>
  )
}