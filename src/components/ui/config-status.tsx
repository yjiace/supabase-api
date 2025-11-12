import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertTriangle, Key, Shield, User, LogOut, History } from 'lucide-react'

interface ConfigStatusProps {
  isJsSdkConfigValid: boolean
  isRestConfigValid: boolean
  selectedEndpointType?: 'js-sdk' | 'rest-api' | null
  isUserAuthenticated?: boolean
  userEmail?: string
  onOpenSettings?: () => void
  onLogin?: () => void
  onLogout?: () => void
  onOpenHistory?: () => void
  hasHistory?: boolean
}

export const ConfigStatus: React.FC<ConfigStatusProps> = ({
  isJsSdkConfigValid,
  isRestConfigValid,
  selectedEndpointType,
  isUserAuthenticated = false,
  userEmail,
  onOpenSettings,
  onLogin,
  onLogout,
  onOpenHistory,
  hasHistory = false
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const getStatusForEndpoint = () => {
    if (!selectedEndpointType) {
      return {
        status: 'neutral',
        message: '请选择接口进行测试',
        icon: AlertTriangle,
        color: 'text-cyber-gray'
      }
    }

    if (selectedEndpointType === 'js-sdk') {
      return {
        status: isJsSdkConfigValid ? 'success' : 'error',
        message: isJsSdkConfigValid ? 'JS SDK 配置完整' : 'JS SDK 配置不完整',
        icon: isJsSdkConfigValid ? CheckCircle : XCircle,
        color: isJsSdkConfigValid ? 'text-green-400' : 'text-red-400'
      }
    }

    if (selectedEndpointType === 'rest-api') {
      return {
        status: isRestConfigValid ? 'success' : 'error',
        message: isRestConfigValid ? 'REST API 配置完整' : 'REST API 配置不完整',
        icon: isRestConfigValid ? CheckCircle : XCircle,
        color: isRestConfigValid ? 'text-green-400' : 'text-red-400'
      }
    }

    return {
      status: 'neutral',
      message: '未知接口类型',
      icon: AlertTriangle,
      color: 'text-cyber-gray'
    }
  }

  const currentStatus = getStatusForEndpoint()
  const IconComponent = currentStatus.icon

  return (
    <div className="flex items-center justify-between p-3 bg-dark-surface rounded-lg border border-dark-border">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <IconComponent className={`w-4 h-4 ${currentStatus.color}`} />
          <span className={`text-sm font-medium ${currentStatus.color}`}>
            {currentStatus.message}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1 hover:bg-dark-bg/50 px-2 py-1 rounded transition-colors cursor-pointer"
            title="点击配置 JS SDK"
          >
            <Key className="w-3 h-3 text-neon-green" />
            <span className="text-xs text-cyber-gray">JS SDK:</span>
            <Badge variant={isJsSdkConfigValid ? "success" : "error"} className="text-xs px-2 py-0.5">
              {isJsSdkConfigValid ? '✓' : '✗'}
            </Badge>
          </button>
          
          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1 hover:bg-dark-bg/50 px-2 py-1 rounded transition-colors cursor-pointer"
            title="点击配置 REST API"
          >
            <Shield className="w-3 h-3 text-orange-400" />
            <span className="text-xs text-cyber-gray">REST:</span>
            <Badge variant={isRestConfigValid ? "success" : "error"} className="text-xs px-2 py-0.5">
              {isRestConfigValid ? '✓' : '✗'}
            </Badge>
          </button>

          {isUserAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-1 hover:bg-dark-bg/50 px-2 py-1 rounded transition-colors cursor-pointer"
                title="点击查看用户菜单"
              >
                <User className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-cyber-gray">用户:</span>
                <Badge variant="success" className="text-xs px-2 py-0.5">
                  已登录
                </Badge>
                {userEmail && (
                  <span className="text-xs text-cyber-gray ml-1">({userEmail})</span>
                )}
              </button>
              
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-dark-surface border border-dark-border rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="p-3 border-b border-dark-border">
                      <div className="text-xs text-cyber-gray mb-1">已登录为</div>
                      <div className="text-sm text-cyber-light font-medium truncate">
                        {userEmail || '用户'}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onLogout?.()
                        setShowUserMenu(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>退出登录</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center space-x-1 hover:bg-dark-bg/50 px-2 py-1 rounded transition-colors cursor-pointer"
              title="点击登录"
            >
              <User className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-cyber-gray">用户:</span>
              <Badge variant="warning" className="text-xs px-2 py-0.5">
                未登录
              </Badge>
            </button>
          )}
        </div>
      </div>

      <button
        onClick={onOpenHistory}
        className={`flex items-center justify-center hover:bg-dark-bg/50 p-2 rounded transition-colors cursor-pointer ${
          !hasHistory ? 'opacity-50' : ''
        }`}
        title={hasHistory ? "查看测试历史" : "暂无测试历史"}
      >
        <History className="w-4 h-4 text-purple-400" />
      </button>
    </div>
  )
}