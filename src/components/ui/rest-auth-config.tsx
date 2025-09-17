import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Key, Shield, Globe, Eye, EyeOff, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'

interface RestAuthConfig {
  accessToken: string
  supabaseManagementUrl: string
}

interface RestAuthConfigProps {
  config: RestAuthConfig
  onConfigChange: (config: RestAuthConfig) => void
  isVisible: boolean
  onToggleVisibility: () => void
}

export const RestAuthConfig: React.FC<RestAuthConfigProps> = ({
  config,
  onConfigChange,
  isVisible,
  onToggleVisibility
}) => {
  const [showToken, setShowToken] = useState(false)

  const isConfigValid = config.accessToken && config.supabaseManagementUrl

  const handleConfigChange = (field: keyof RestAuthConfig, value: string) => {
    onConfigChange({
      ...config,
      [field]: value
    })
  }

  return (
    <Card className="border-orange-500/30 bg-orange-500/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-orange-400" />
            <div>
              <CardTitle className="text-orange-400">REST API 认证配置</CardTitle>
              <CardDescription>
                配置 Supabase 管理 API 的访问凭据
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {isConfigValid ? (
                <Badge variant="success" className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>已配置</span>
                </Badge>
              ) : (
                <Badge variant="error" className="flex items-center space-x-1">
                  <XCircle className="w-3 h-3" />
                  <span>未配置</span>
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleVisibility}
            className="text-orange-400 hover:text-orange-300"
          >
            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="ml-2">{isVisible ? '隐藏' : '显示'}</span>
          </Button>
        </div>
      </CardHeader>

      {isVisible && (
        <CardContent className="space-y-4">
          {/* Warning Notice */}
          <div className="flex items-start space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-300">
              <div className="font-medium mb-1">重要安全提醒</div>
              <div className="text-xs space-y-1">
                <div>• REST API 需要个人访问令牌，具有完整的账户访问权限</div>
                <div>• 请确保在安全环境中使用，不要在客户端代码中暴露令牌</div>
                <div>• 建议仅在开发和测试环境中使用此功能</div>
              </div>
            </div>
          </div>

          {/* Configuration Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cyber-light mb-2">
                <Globe className="w-4 h-4 inline mr-2" />
                管理 API URL
              </label>
              <Input
                placeholder="https://api.supabase.com"
                value={config.supabaseManagementUrl}
                onChange={(e) => handleConfigChange('supabaseManagementUrl', e.target.value)}
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
                  type={showToken ? 'text' : 'password'}
                  placeholder="sbp_your-personal-access-token"
                  value={config.accessToken}
                  onChange={(e) => handleConfigChange('accessToken', e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <div className="mt-1 text-xs text-cyber-gray">
                从 Supabase Dashboard → Settings → Access Tokens 获取
              </div>
            </div>
          </div>

          {/* How to get token */}
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

          {/* Test Connection Button */}
          {isConfigValid && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="text-orange-400 border-orange-400 hover:bg-orange-400 hover:text-dark-bg"
              >
                测试连接
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}