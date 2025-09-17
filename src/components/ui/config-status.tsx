import React from 'react'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertTriangle, Key, Shield } from 'lucide-react'

interface ConfigStatusProps {
  isJsSdkConfigValid: boolean
  isRestConfigValid: boolean
  selectedEndpointType?: 'js-sdk' | 'rest-api' | null
}

export const ConfigStatus: React.FC<ConfigStatusProps> = ({
  isJsSdkConfigValid,
  isRestConfigValid,
  selectedEndpointType
}) => {
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
    <div className="flex items-center space-x-4 p-3 bg-dark-surface rounded-lg border border-dark-border">
      <div className="flex items-center space-x-2">
        <IconComponent className={`w-4 h-4 ${currentStatus.color}`} />
        <span className={`text-sm font-medium ${currentStatus.color}`}>
          {currentStatus.message}
        </span>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          <Key className="w-3 h-3 text-neon-green" />
          <span className="text-xs text-cyber-gray">JS SDK:</span>
          <Badge variant={isJsSdkConfigValid ? "success" : "error"} className="text-xs px-2 py-0.5">
            {isJsSdkConfigValid ? '✓' : '✗'}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-1">
          <Shield className="w-3 h-3 text-orange-400" />
          <span className="text-xs text-cyber-gray">REST:</span>
          <Badge variant={isRestConfigValid ? "success" : "error"} className="text-xs px-2 py-0.5">
            {isRestConfigValid ? '✓' : '✗'}
          </Badge>
        </div>
      </div>
    </div>
  )
}