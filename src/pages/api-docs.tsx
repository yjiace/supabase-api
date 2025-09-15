import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CodeBlock } from '@/components/ui/code-block'
import { Input } from '@/components/ui/input'
import { apiCategories, ApiEndpoint, ApiCategory } from '@/data/api-docs'
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Globe, 
  Database, 
  Shield, 
  Zap, 
  Users, 
  HardDrive, 
  Wifi, 
  Code, 
  Settings, 
  Webhook, 
  BarChart3,
  Lock,
  Server,
  Cloud,
  FileText,
  GitBranch,
  Package,
  Archive,
  Award,
  Network,
  Layers,
  Puzzle,
  History,
  FolderOpen,
  ExternalLink,
  Key,
  AlertTriangle
} from 'lucide-react'

export const ApiDocs: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(
    apiCategories.find(cat => cat.id === 'database')?.endpoints[0] || 
    apiCategories[0]?.endpoints[0] || 
    null
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const categoryIcons = {
    auth: Shield,              // 身份认证 - 盾牌图标表示安全认证
    database: Database,        // 数据库操作 - 数据库图标
    schema: FileText,          // 数据库模式 - 文档图标表示结构定义
    'rls-policies': Lock,      // RLS策略管理 - 锁图标表示权限控制
    'database-functions': Code, // 数据库函数 - 代码图标表示函数
    extensions: Puzzle,        // PostgreSQL扩展 - 拼图图标表示扩展功能
    migrations: GitBranch,     // 数据库迁移 - 分支图标表示版本迁移
    storage: HardDrive,        // 文件存储 - 硬盘图标表示存储
    realtime: Wifi,            // 实时订阅 - WiFi图标表示实时连接
    'edge-functions': Zap,     // 边缘函数 - 闪电图标表示快速执行
    admin: Settings,           // 管理接口 - 设置图标表示管理
    webhooks: Webhook,         // Webhook - 专用Webhook图标
    'backup-restore': Archive, // 备份恢复 - 归档图标表示备份
    'ssl-certificates': Award, // SSL证书管理 - 奖章图标表示证书认证
    'custom-domains': Network, // 自定义域名 - 网络图标表示域名配置
    analytics: BarChart3       // 分析统计 - 柱状图图标表示数据分析
  }

  const methodColors = {
    GET: 'success',
    POST: 'info',
    PUT: 'warning',
    PATCH: 'warning',
    DELETE: 'error',
    HEAD: 'success',
    OPTIONS: 'info',
    WebSocket: 'info'
  } as const

  // 根据接口路径和功能判断所需的密钥类型
  const getRequiredKeyType = (endpoint: ApiEndpoint): 'anon' | 'service_role' | 'both' => {
    const path = endpoint.path.toLowerCase()
    const name = endpoint.name.toLowerCase()
    const description = endpoint.description.toLowerCase()
    
    // 管理员操作需要服务密钥
    if (path.includes('/admin/') || 
        name.includes('管理') || 
        name.includes('删除用户') ||
        name.includes('重置密码') ||
        description.includes('管理员') ||
        description.includes('服务端') ||
        endpoint.method === 'DELETE' && path.includes('/auth/')) {
      return 'service_role'
    }
    
    // 数据库函数、扩展、迁移等通常需要服务密钥
    if (path.includes('/rpc/') && (name.includes('系统') || description.includes('管理'))) {
      return 'service_role'
    }
    
    // 用户认证相关的大部分操作可以用匿名密钥
    if (path.includes('/auth/') && !name.includes('管理')) {
      return 'anon'
    }
    
    // 数据库操作通常两种密钥都可以，但有RLS保护
    if (path.includes('/rest/v1/')) {
      return 'both'
    }
    
    // 存储操作通常用匿名密钥
    if (path.includes('/storage/')) {
      return 'anon'
    }
    
    // 实时订阅用匿名密钥
    if (path.includes('/realtime/')) {
      return 'anon'
    }
    
    // 边缘函数调用用匿名密钥
    if (path.includes('/functions/')) {
      return 'anon'
    }
    
    // 默认返回both
    return 'both'
  }

  const getKeyTypeInfo = (keyType: 'anon' | 'service_role' | 'both') => {
    switch (keyType) {
      case 'anon':
        return {
          label: '匿名密钥',
          color: 'success',
          icon: Key,
          description: '客户端安全，受RLS保护'
        }
      case 'service_role':
        return {
          label: '服务密钥',
          color: 'error',
          icon: Shield,
          description: '服务端专用，完全访问权限'
        }
      case 'both':
        return {
          label: '两种密钥',
          color: 'warning',
          icon: Key,
          description: '匿名密钥或服务密钥均可'
        }
    }
  }

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  // 重新排序分组，将数据库操作移到第一位
  const reorderedCategories = [...apiCategories].sort((a, b) => {
    if (a.id === 'database') return -1
    if (b.id === 'database') return 1
    if (a.id === 'auth') return b.id === 'database' ? 1 : -1
    if (b.id === 'auth') return a.id === 'database' ? -1 : 1
    return 0
  })

  const filteredCategories = reorderedCategories.map(category => ({
    ...category,
    endpoints: category.endpoints.filter(endpoint =>
      endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.endpoints.length > 0)

  return (
    <div className="min-h-screen bg-dark-bg pt-16">
      <div className="flex h-screen">
        {/* Left Sidebar - API Navigation */}
        <div className="w-80 bg-dark-surface border-r border-dark-border overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-cyber-light mb-4">API 文档</h2>
            
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyber-gray w-4 h-4" />
              <Input
                placeholder="搜索接口..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* API Categories */}
            <div className="space-y-2">
              {filteredCategories.map((category) => {
                const IconComponent = categoryIcons[category.id as keyof typeof categoryIcons] || Server
                const isExpanded = expandedCategories.has(category.id)
                
                return (
                  <div key={category.id}>
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="flex-1 flex items-center justify-between p-3 rounded-lg hover:bg-dark-border transition-colors text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-5 h-5 text-neon-green" />
                          <div>
                            <div className="font-medium text-cyber-light">{category.name}</div>
                            <div className="text-xs text-cyber-gray">{category.endpoints.length} 个接口</div>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-cyber-gray" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-cyber-gray" />
                        )}
                      </button>
                      {category.officialDocs && (
                        <a
                          href={category.officialDocs}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 p-2 hover:bg-neon-green/10 rounded-md transition-colors group"
                          title="查看官方文档"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3 h-3 text-cyber-gray group-hover:text-neon-green" />
                        </a>
                      )}
                    </div>
                    
                    {isExpanded && (
                      <div className="ml-8 mt-2 space-y-1">
                        {category.endpoints.map((endpoint) => (
                          <button
                            key={endpoint.id}
                            onClick={() => setSelectedEndpoint(endpoint)}
                            className={`w-full flex items-center justify-between p-2 rounded-md text-left transition-all duration-200 ${
                              selectedEndpoint?.id === endpoint.id
                                ? 'bg-neon-green/10 border-l-2 border-neon-green text-neon-green'
                                : 'hover:bg-dark-border text-cyber-gray hover:text-cyber-light'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <Badge variant={methodColors[endpoint.method]} className="text-xs">
                                {endpoint.method}
                              </Badge>
                              <span className="text-sm">{endpoint.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Content - API Details */}
        <div className="flex-1 overflow-y-auto">
          {selectedEndpoint ? (
            <div className="p-8">
              <div className="max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Badge variant={methodColors[selectedEndpoint.method]} className="text-sm">
                        {selectedEndpoint.method}
                      </Badge>
                      <h1 className="text-3xl font-bold text-cyber-light">{selectedEndpoint.name}</h1>
                    </div>
                    {selectedEndpoint.officialDocs && (
                      <a
                        href={selectedEndpoint.officialDocs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-neon-green/10 hover:bg-neon-green/20 border border-neon-green/30 rounded-lg transition-colors group"
                      >
                        <ExternalLink className="w-4 h-4 text-neon-green" />
                        <span className="text-neon-green font-medium">官方文档</span>
                      </a>
                    )}
                  </div>
                  
                  {/* API Key Requirement */}
                  {(() => {
                    const keyType = getRequiredKeyType(selectedEndpoint)
                    const keyInfo = getKeyTypeInfo(keyType)
                    const IconComponent = keyInfo.icon
                    
                    return (
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="w-4 h-4 text-cyber-gray" />
                          <span className="text-sm text-cyber-gray">所需密钥:</span>
                        </div>
                        <Badge variant={keyInfo.color as "success" | "error" | "warning" | "default" | "info"} className="flex items-center space-x-1">
                          <IconComponent className="w-3 h-3" />
                          <span>{keyInfo.label}</span>
                        </Badge>
                        <span className="text-xs text-cyber-gray">{keyInfo.description}</span>
                        {keyType === 'service_role' && (
                          <div className="flex items-center space-x-1 text-red-400">
                            <AlertTriangle className="w-3 h-3" />
                            <span className="text-xs">仅服务端使用</span>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                  
                  <p className="text-lg text-cyber-gray mb-4">{selectedEndpoint.description}</p>
                  <div className="bg-dark-surface rounded-lg p-4 border border-dark-border">
                    <code className="text-neon-green font-mono">
                      {selectedEndpoint.method} {selectedEndpoint.path}
                    </code>
                  </div>
                </div>

                {/* Parameters */}
                {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>请求参数</CardTitle>
                      <CardDescription>接口所需的参数信息</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-dark-border">
                              <th className="text-left py-2 text-cyber-light font-medium">参数名</th>
                              <th className="text-left py-2 text-cyber-light font-medium">类型</th>
                              <th className="text-left py-2 text-cyber-light font-medium">必填</th>
                              <th className="text-left py-2 text-cyber-light font-medium">说明</th>
                              <th className="text-left py-2 text-cyber-light font-medium">示例</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedEndpoint.parameters.map((param, index) => (
                              <tr key={index} className="border-b border-dark-border/50">
                                <td className="py-3 text-neon-green font-mono text-sm">{param.name}</td>
                                <td className="py-3 text-cyber-gray text-sm">{param.type}</td>
                                <td className="py-3">
                                  <Badge variant={param.required ? 'error' : 'default'} className="text-xs">
                                    {param.required ? '必填' : '可选'}
                                  </Badge>
                                </td>
                                <td className="py-3 text-cyber-gray text-sm">{param.description}</td>
                                <td className="py-3 text-cyber-gray text-sm font-mono">{param.example}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Request Body */}
                {selectedEndpoint.requestBody && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>请求体</CardTitle>
                      <CardDescription>{selectedEndpoint.requestBody.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <Badge variant="info" className="mb-2">
                          {selectedEndpoint.requestBody.type}
                        </Badge>
                      </div>
                      <CodeBlock
                        code={JSON.stringify(selectedEndpoint.requestBody.example, null, 2)}
                        language="json"
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Responses */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>响应</CardTitle>
                    <CardDescription>接口可能返回的响应信息</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {selectedEndpoint.responses.map((response, index) => (
                        <div key={index}>
                          <div className="flex items-center space-x-2 mb-3">
                            <Badge 
                              variant={response.status >= 200 && response.status < 300 ? 'success' : 'error'}
                              className="text-sm"
                            >
                              {response.status}
                            </Badge>
                            <span className="text-cyber-light font-medium">{response.description}</span>
                          </div>
                          {response.example && (
                            <CodeBlock
                              code={JSON.stringify(response.example, null, 2)}
                              language="json"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Examples */}
                {selectedEndpoint.examples && selectedEndpoint.examples.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>示例</CardTitle>
                      <CardDescription>完整的请求和响应示例</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        {selectedEndpoint.examples.map((example, index) => (
                          <div key={index}>
                            <h4 className="text-lg font-semibold text-cyber-light mb-2">{example.title}</h4>
                            <p className="text-cyber-gray mb-4">{example.description}</p>
                            
                            <div className="space-y-4">
                              <div>
                                <h5 className="text-sm font-medium text-cyber-light mb-2">请求示例</h5>
                                <CodeBlock code={example.request} language="bash" />
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-medium text-cyber-light mb-2">响应示例</h5>
                                <CodeBlock code={example.response} language="json" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Globe className="w-16 h-16 text-cyber-gray mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-cyber-light mb-2">选择一个接口</h3>
                <p className="text-cyber-gray">从左侧导航中选择要查看的API接口</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}