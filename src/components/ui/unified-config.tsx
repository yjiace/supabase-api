import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Key, Shield, Globe, Eye, EyeOff, AlertTriangle, Info, CheckCircle, XCircle, Settings } from 'lucide-react'

interface TestConfig {
  supabaseUrl: string
  apiKey: string
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

  const isJsSdkConfigValid = config.supabaseUrl && config.apiKey
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
    <Card className="border-dark-border bg-dark-surface">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="w-5 h-5 text-neon-green" />
            <div>
              <CardTitle className="text-cyber-light">API 配置</CardTitle>
              <CardDescription>
                配置 JS SDK 和 REST API 的认证信息
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleVisibility}
            className="text-cyber-light hover:text-neon-green"
          >
            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="ml-2">{isVisible ? '隐藏' : '显示'}</span>
          </Button>
        </div>
      </CardHeader>

      {isVisible && (
        <CardContent className="space-y-6">
          {/* JS SDK 配置部分 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-cyber-light flex items-center space-x-2">
                <Key className="w-5 h-5 text-neon-green" />
                <span>JS SDK 配置</span>
              </h3>
              <Badge variant={isJsSdkConfigValid ? "success" : "error"} className="flex items-center space-x-1">
                {isJsSdkConfigValid ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                <span>{isJsSdkConfigValid ? '已配置' : '未配置'}</span>
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-cyber-light mb-2">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Supabase URL
                </label>
                <Input
                  placeholder="https://your-project.supabase.co"
                  value={config.supabaseUrl}
                  onChange={(e) => handleConfigChange('supabaseUrl', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-cyber-light mb-2">
                  <Key className="w-4 h-4 inline mr-2" />
                  匿名密钥 (Anon Key)
                </label>
                <div className="relative">
                  <Input
                    type={showApiKey ? 'text' : 'password'}
                    placeholder="your-supabase-anon-key"
                    value={config.apiKey}
                    onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                    className="pr-10"
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
                <div className="mt-1 text-xs text-cyber-gray">
                  客户端安全，适用于大部分操作
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-cyber-light mb-2">
                  <Shield className="w-4 h-4 inline mr-2" />
                  服务端密钥 (可选)
                </label>
                <div className="relative">
                  <Input
                    type={showServiceKey ? 'text' : 'password'}
                    placeholder="your-service-role-key (可选)"
                    value={config.serviceRoleKey || ''}
                    onChange={(e) => handleConfigChange('serviceRoleKey', e.target.value)}
                    className="pr-10"
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
                <div className="mt-1 text-xs text-cyber-gray">
                  服务端专用，管理员操作必需
                </div>
              </div>
            </div>
          </div>

          {/* REST API 配置部分 */}
          <div className="space-y-4 border-t border-dark-border pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-orange-400 flex items-center space-x-2">
                <Shield className="w-5 h-5 text-orange-400" />
                <span>REST API 配置</span>
              </h3>
              <Badge variant={isRestConfigValid ? "success" : "error"} className="flex items-center space-x-1">
                {isRestConfigValid ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                <span>{isRestConfigValid ? '已配置' : '未配置'}</span>
              </Badge>
            </div>

            {/* 安全警告 */}
            <div className="flex items-start space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-300">
                <div className="font-medium mb-1">重要安全提醒</div>
                <div className="text-xs">
                  REST API 需要个人访问令牌，具有完整的账户访问权限。请确保在安全环境中使用。
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-cyber-light mb-2">
                  <Globe className="w-4 h-4 inline mr-2" />
                  管理 API URL
                </label>
                <Input
                  placeholder="https://api.supabase.com"
                  value={restConfig.supabaseManagementUrl}
                  onChange={(e) => handleRestConfigChange('supabaseManagementUrl', e.target.value)}
                />
                <div className="mt-1 text-xs text-cyber-gray">
                  Supabase 管理 API 的基础 URL
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cyber-light mb-2">
                  <Key className="w-4 h-4 inline mr-2" />
                  个人访问令牌
                </label>
                <div className="relative">
                  <Input
                    type={showAccessToken ? 'text' : 'password'}
                    placeholder="sbp_your-personal-access-token"
                    value={restConfig.accessToken}
                    onChange={(e) => handleRestConfigChange('accessToken', e.target.value)}
                    className="pr-10"
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
                <div className="mt-1 text-xs text-cyber-gray">
                  从 Supabase Dashboard → Settings → Access Tokens 获取
                </div>
              </div>
            </div>

            {/* 获取令牌说明 */}
            <div className="flex items-start space-x-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-300">
                <div className="font-medium mb-1">如何获取个人访问令牌</div>
                <div className="text-xs space-y-1">
                  <div>1. 登录 Supabase Dashboard</div>
                  <div>2. 进入 Settings → Access Tokens</div>
                  <div>3. 点击 "Generate new token"</div>
                  <div>4. 设置令牌名称和权限范围</div>
                  <div>5. 复制生成的令牌（以 sbp_ 开头）</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}