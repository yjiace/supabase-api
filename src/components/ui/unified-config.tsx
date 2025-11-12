import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Key, Shield, Globe, Eye, EyeOff, AlertTriangle, Info, CheckCircle, XCircle, Settings, HelpCircle } from 'lucide-react'

interface TestConfig {
  supabaseUrl: string
  anonKey: string
  serviceRoleKey?: string
}

interface RestAuthConfig {
  accessToken: string
  supabaseManagementUrl: string
}

interface UnifiedConfigProps {
  config: TestConfig
  restConfig: RestAuthConfig
  onConfigChange: (config: TestConfig) => void
  onRestConfigChange: (config: RestAuthConfig) => void
  isVisible: boolean
  onToggleVisibility: () => void
}

export const UnifiedConfig: React.FC<UnifiedConfigProps> = ({
  config,
  restConfig,
  onConfigChange,
  onRestConfigChange,
  isVisible,
  onToggleVisibility
}) => {
  const [showApiKey, setShowApiKey] = useState(false)
  const [showServiceKey, setShowServiceKey] = useState(false)
  const [showAccessToken, setShowAccessToken] = useState(false)
  const [activeTab, setActiveTab] = useState<'js-sdk' | 'rest-api'>('js-sdk')

  const isJsSdkConfigValid = config.supabaseUrl && config.anonKey
  const isRestConfigValid = restConfig.supabaseManagementUrl && restConfig.accessToken

  const handleConfigChange = (field: keyof TestConfig, value: string) => {
    onConfigChange({
      ...config,
      [field]: value
    })
  }

  const handleRestConfigChange = (field: keyof RestAuthConfig, value: string) => {
    onRestConfigChange({
      ...restConfig,
      [field]: value
    })
  }

  return (
    <div className="space-y-4">
          {/* Tab Navigation */}
          <div className="flex space-x-2 border-b border-dark-border pb-2">
            <button
              onClick={() => setActiveTab('js-sdk')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-all ${
                activeTab === 'js-sdk'
                  ? 'bg-neon-green/10 border-b-2 border-neon-green text-neon-green'
                  : 'text-cyber-gray hover:text-cyber-light hover:bg-dark-bg/50'
              }`}
            >
              <Key className="w-4 h-4" />
              <span className="font-medium">JS SDK</span>
              {isJsSdkConfigValid ? (
                <CheckCircle className="w-3 h-3 text-green-400" />
              ) : (
                <XCircle className="w-3 h-3 text-red-400" />
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('rest-api')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-all ${
                activeTab === 'rest-api'
                  ? 'bg-orange-400/10 border-b-2 border-orange-400 text-orange-400'
                  : 'text-cyber-gray hover:text-cyber-light hover:bg-dark-bg/50'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span className="font-medium">REST API</span>
              {isRestConfigValid ? (
                <CheckCircle className="w-3 h-3 text-green-400" />
              ) : (
                <XCircle className="w-3 h-3 text-red-400" />
              )}
            </button>
          </div>

          {/* JS SDK Configuration */}
          {activeTab === 'js-sdk' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-semibold text-cyber-light">项目配置</h3>
                  <div className="relative group">
                    <HelpCircle className="w-4 h-4 text-cyber-gray hover:text-neon-green cursor-help" />
                    <div className="absolute left-0 top-6 hidden group-hover:block z-10 bg-dark-surface border border-dark-border rounded-lg p-3 shadow-lg min-w-[280px]">
                      <div className="text-xs text-cyber-gray">
                        <div className="font-medium mb-1 text-neon-green">JS SDK 配置说明</div>
                        <div>用于直接调用 Supabase 项目的 API，包括数据库、认证、存储等功能。</div>
                      </div>
                    </div>
                  </div>
                </div>
                <Badge variant={isJsSdkConfigValid ? "success" : "error"} className="text-xs">
                  {isJsSdkConfigValid ? '✓ 已配置' : '✗ 未配置'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Project URL */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-cyber-light mb-2">
                    <Globe className="w-4 h-4 text-neon-green" />
                    <span>项目 URL</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="https://xxxxx.supabase.co"
                    value={config.supabaseUrl}
                    onChange={(e) => handleConfigChange('supabaseUrl', e.target.value)}
                    className="font-mono text-sm"
                  />
                  <div className="mt-1.5 text-xs text-cyber-gray">
                    从 Supabase Dashboard → Settings → API → Project URL 获取
                  </div>
                </div>

                {/* Anon Key */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-cyber-light mb-2">
                    <Key className="w-4 h-4 text-neon-green" />
                    <span>匿名密钥 (Anon Key)</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={config.anonKey}
                      onChange={(e) => handleConfigChange('anonKey', e.target.value)}
                      className="pr-10 font-mono text-sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="mt-1.5 text-xs text-cyber-gray">
                    客户端安全密钥，受 RLS 策略保护。从 Project Settings → API → anon public 获取
                  </div>
                </div>

                {/* Service Role Key */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-cyber-light mb-2">
                    <Shield className="w-4 h-4 text-orange-400" />
                    <span>服务端密钥</span>
                    <Badge variant="warning" className="text-xs">可选</Badge>
                  </label>
                  <div className="relative">
                    <Input
                      type={showServiceKey ? 'text' : 'password'}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={config.serviceRoleKey || ''}
                      onChange={(e) => handleConfigChange('serviceRoleKey', e.target.value)}
                      className="pr-10 font-mono text-sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowServiceKey(!showServiceKey)}
                    >
                      {showServiceKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="mt-1.5 text-xs text-cyber-gray">
                    服务端专用，管理员操作必需
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2 p-2 bg-orange-500/10 border border-orange-500/30 rounded text-xs text-orange-300">
                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">服务端密钥安全提示：</span>
                  <span className="ml-1">拥有完全访问权限，绕过所有 RLS 策略。从 Project Settings → API → service_role secret 获取</span>
                </div>
              </div>
            </div>
          )}

          {/* REST API Configuration */}
          {activeTab === 'rest-api' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-semibold text-orange-400">管理 API 配置</h3>
                  <div className="relative group">
                    <HelpCircle className="w-4 h-4 text-cyber-gray hover:text-orange-400 cursor-help" />
                    <div className="absolute left-0 top-6 hidden group-hover:block z-10 bg-dark-surface border border-dark-border rounded-lg p-3 shadow-lg min-w-[280px]">
                      <div className="text-xs text-cyber-gray">
                        <div className="font-medium mb-1 text-orange-400">REST API 配置说明</div>
                        <div>用于调用 Supabase 管理 API，管理项目、组织等资源。需要个人访问令牌。</div>
                      </div>
                    </div>
                  </div>
                </div>
                <Badge variant={isRestConfigValid ? "success" : "error"} className="text-xs">
                  {isRestConfigValid ? '✓ 已配置' : '✗ 未配置'}
                </Badge>
              </div>

              {/* Security Warning */}
              <div className="flex items-start space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-300">
                  <div className="font-medium mb-1">⚠️ 重要安全提醒</div>
                  <div className="text-xs">
                    个人访问令牌具有完整的账户访问权限，可管理所有项目和组织。请仅在安全环境中使用，切勿泄露。
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Management API URL */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-cyber-light mb-2">
                    <Globe className="w-4 h-4 text-orange-400" />
                    <span>管理 API URL</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="https://api.supabase.com"
                    value={restConfig.supabaseManagementUrl}
                    onChange={(e) => handleRestConfigChange('supabaseManagementUrl', e.target.value)}
                    className="font-mono text-sm"
                  />
                  <div className="mt-1.5 text-xs text-cyber-gray">
                    Supabase 管理 API 的基础 URL（通常为 https://api.supabase.com）
                  </div>
                </div>

                {/* Personal Access Token */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-cyber-light mb-2">
                    <Key className="w-4 h-4 text-orange-400" />
                    <span>个人访问令牌</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type={showAccessToken ? 'text' : 'password'}
                      placeholder="sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={restConfig.accessToken}
                      onChange={(e) => handleRestConfigChange('accessToken', e.target.value)}
                      className="pr-10 font-mono text-sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowAccessToken(!showAccessToken)}
                    >
                      {showAccessToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="mt-1.5 text-xs text-cyber-gray">
                    令牌以 sbp_ 开头，用于认证管理 API 请求
                  </div>
                </div>
              </div>

              {/* How to get token */}
              <div className="flex items-start space-x-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-300">
                  <div className="font-medium mb-1.5">如何获取个人访问令牌</div>
                  <div className="text-xs space-y-1">
                    <div>1. 登录 <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-200">Supabase Dashboard</a></div>
                    <div>2. 点击右上角头像 → Account Settings</div>
                    <div>3. 进入 Access Tokens 标签页</div>
                    <div>4. 点击 "Generate new token" 按钮</div>
                    <div>5. 设置令牌名称和过期时间</div>
                    <div>6. 复制生成的令牌（仅显示一次）</div>
                  </div>
                </div>
              </div>
            </div>
          )}
    </div>
  )
}