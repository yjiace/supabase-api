import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CodeBlock } from '@/components/ui/code-block'
import { Input } from '@/components/ui/input'
import { Footer } from '@/components/layout/footer'
import { apiCategories, ApiEndpoint } from '@/data/api-docs'
import {
  Search,
  ChevronRight,
  ChevronDown,
  Globe,
  Database,
  Shield,
  HardDrive,
  Code,
  Webhook,
  BarChart3,
  Server,
  FileText,
  GitBranch,
  Archive,
  Award,
  ExternalLink,
  Key,
  AlertTriangle,
  Users,
  Cloud,
  Radio,
  ShieldCheck,
  Package,
  Settings,
  TrendingUp,
  Building,
  Building2,
  Layers,
  Monitor,
  Activity,
  Briefcase,
  Cpu,
  Folder,
  Lock,
  Globe2,
  PieChart,
  CreditCard,
  MapPin,
  UserX,
  Cog,
  Zap
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
    // 1. JS SDK 主要分类 (5个)
    auth: Users,               // 身份认证
    database: Database,        // 数据库操作
    'edge-functions': Cloud,   // 边缘函数
    realtime: Radio,           // 实时订阅
    storage: Folder,           // 文件存储

    // 2. 高级功能分类 (11个)
    schema: FileText,          // 数据库模式
    'rls-policies': ShieldCheck, // RLS策略管理
    'database-functions': Code, // 数据库函数
    extensions: Package,       // PostgreSQL扩展
    migrations: GitBranch,     // 数据库迁移
    admin: Settings,           // 管理接口
    webhooks: Webhook,         // Webhook
    'backup-restore': Archive, // 备份恢复
    'ssl-certificates': Award, // SSL证书管理
    'custom-domains': Globe,   // 自定义域名
    analytics: TrendingUp,     // 分析统计

    // 3. REST API 分类 (12个) - 使用不同的图标
    'rest-analytics': BarChart3,     // REST分析
    'rest-auth': Shield,             // REST认证
    'rest-database': Layers,         // REST数据库
    'rest-projects': Briefcase,      // 项目管理
    'rest-functions': Cpu,           // REST函数
    'rest-storage': HardDrive,       // REST存储
    'rest-organizations': Building,  // 组织管理
    'rest-organizations-management': Building2, // 组织高级管理
    'rest-secrets': Key,             // 密钥管理
    'rest-ssl': Lock,                // SSL证书
    'rest-vanity-subdomains': Globe2, // 自定义域名
    'rest-branches': Server,         // 分支管理

    // 4. 其他分类 (8个)
    monitoring: Monitor,       // 监控
    activity: Activity,        // 活动日志
    'user-management': PieChart, // 用户管理
    'rest-billing': CreditCard, // 计费 - 信用卡图标
    'rest-domains': MapPin,     // 域名 - 地图标记图标
    'rest-environments': Zap,      // 环境 - 闪电图标表示动态环境
    'rest-oauth': UserX,        // OAuth - 用户X图标
    'rest-postgrest': Cog       // PostgREST - 齿轮图标
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
  const getRequiredKeyType = (endpoint: ApiEndpoint): 'anon' | 'service_role' | 'both' | 'pat' => {
    const path = endpoint.path.toLowerCase()
    const name = endpoint.name.toLowerCase()
    const description = endpoint.description.toLowerCase()

    // REST API 管理接口需要使用 Personal Access Token (PAT)
    // 包括项目管理、组织管理、分析统计、配置管理等
    if (path.startsWith('/v1/') || 
        path.includes('/v1/projects/') ||
        path.includes('/v1/organizations/') ||
        path.includes('/v1/snippets/') ||
        path.match(/^\/v\d+\//)) {
      return 'pat'
    }

    // 管理员操作需要服务密钥（仅限于 Supabase SDK 内部管理操作）
    if (path.includes('/admin/') ||
      (name.includes('管理') && !path.startsWith('/v1/')) ||
      name.includes('删除用户') ||
      name.includes('重置密码') ||
      description.includes('管理员') ||
      description.includes('服务端') ||
      (endpoint.method === 'DELETE' && path.includes('/auth/'))) {
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

    // 数据库操作（通过 PostgREST）通常两种密钥都可以，但有RLS保护
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

  const getKeyTypeInfo = (keyType: 'anon' | 'service_role' | 'both' | 'pat') => {
    switch (keyType) {
      case 'anon':
        return {
          label: '匿名密钥',
          color: 'success' as const,
          icon: Key,
          description: '客户端安全，受RLS保护'
        }
      case 'service_role':
        return {
          label: '服务密钥',
          color: 'error' as const,
          icon: Shield,
          description: '服务端专用，完全访问权限'
        }
      case 'both':
        return {
          label: '两种密钥',
          color: 'warning' as const,
          icon: Key,
          description: '匿名密钥或服务密钥均可'
        }
      case 'pat':
        return {
          label: 'PAT 密钥',
          color: 'default' as const,
          icon: Key,
          description: 'Personal Access Token，用于 REST API'
        }
      default:
        return {
          label: '未知密钥',
          color: 'default' as const,
          icon: Key,
          description: '未知密钥类型'
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
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Sidebar - API Navigation */}
        <div className="w-full lg:w-80 xl:w-96 bg-dark-surface lg:rounded-2xl lg:border lg:border-dark-border lg:shadow-2xl lg:shadow-dark-border/20 lg:m-4 lg:mr-0 flex-shrink-0 lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto backdrop-blur-sm">
          <div className="p-4 lg:p-6">
            <h2 className="text-xl lg:text-2xl font-bold text-cyber-light mb-4">API 文档</h2>

            {/* Search */}
            <div className="relative mb-6">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyber-gray">
                <Search className="w-4 h-4" />
              </div>
              <Input
                placeholder="搜索接口..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 rounded-xl bg-dark-surface/50 border-dark-border/50 focus:border-neon-green/50 focus:bg-dark-surface/80 transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            {/* API Categories */}
            <div className="space-y-3">
              {filteredCategories.map((category) => {
                const IconComponent = categoryIcons[category.id as keyof typeof categoryIcons] || Server
                const isExpanded = expandedCategories.has(category.id)

                return (
                  <div key={category.id} className="bg-dark-surface/30 rounded-xl border border-dark-border/50 overflow-hidden backdrop-blur-sm">
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="flex-1 flex items-center justify-between p-4 hover:bg-dark-border/50 transition-all duration-300 text-left group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-xl bg-neon-green/10 group-hover:bg-neon-green/20 transition-colors duration-300">
                            <IconComponent className="w-5 h-5 text-neon-green" />
                          </div>
                          <div>
                            <div className="font-semibold text-cyber-light group-hover:text-white transition-colors duration-300">{category.name}</div>
                            <div className="text-xs text-cyber-gray group-hover:text-cyber-light transition-colors duration-300">{category.endpoints.length} 个接口</div>
                          </div>
                        </div>
                        <div className="p-1 rounded-lg group-hover:bg-dark-border/30 transition-colors duration-300">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-cyber-gray group-hover:text-cyber-light transition-colors duration-300" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-cyber-gray group-hover:text-cyber-light transition-colors duration-300" />
                          )}
                        </div>
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-3 space-y-1.5 bg-dark-surface/20">
                        {category.endpoints.map((endpoint) => (
                          <button
                            key={endpoint.id}
                            onClick={() => setSelectedEndpoint(endpoint)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-300 group ${selectedEndpoint?.id === endpoint.id
                              ? 'bg-gradient-to-r from-neon-green/15 to-neon-green/5 border border-neon-green/30 text-neon-green shadow-lg shadow-neon-green/10'
                              : 'hover:bg-dark-border/40 text-cyber-gray hover:text-cyber-light hover:shadow-md'
                              }`}
                          >
                            <div className="flex items-center space-x-3">
                              <Badge 
                                variant={methodColors[endpoint.method]} 
                                className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-all duration-300 ${
                                  selectedEndpoint?.id === endpoint.id ? 'shadow-sm' : ''
                                }`}
                              >
                                {endpoint.method}
                              </Badge>
                              <span className={`text-sm font-medium transition-all duration-300 ${
                                selectedEndpoint?.id === endpoint.id ? 'text-neon-green' : 'group-hover:text-white'
                              }`}>
                                {endpoint.name}
                              </span>
                            </div>
                            {selectedEndpoint?.id === endpoint.id && (
                              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
                            )}
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
        <div className="flex-1 flex flex-col">
          {selectedEndpoint ? (
            <div className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-12">
              <div className="max-w-none xl:max-w-6xl 2xl:max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                    <div className="flex items-center space-x-3">
                      <Badge variant={methodColors[selectedEndpoint.method]} className="text-sm">
                        {selectedEndpoint.method}
                      </Badge>
                      <h1 className="text-2xl lg:text-3xl font-bold text-cyber-light">{selectedEndpoint.name}</h1>
                    </div>
                    {selectedEndpoint.officialDocs && (
                      <a
                        href={selectedEndpoint.officialDocs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-neon-green/10 hover:bg-neon-green/20 border border-neon-green/30 rounded-lg transition-colors group w-fit"
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
                        <Badge variant={keyInfo.color} className="flex items-center space-x-1">
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

                  <p className="text-base lg:text-lg text-cyber-gray mb-6">{selectedEndpoint.description}</p>
                  <div className="bg-dark-surface rounded-lg p-4 lg:p-6 border border-dark-border">
                    <code className="text-neon-green font-mono text-sm lg:text-base break-all">
                      {selectedEndpoint.method} {selectedEndpoint.path}
                    </code>
                  </div>
                </div>

                {/* Content Layout - Responsive */}
                <div className="space-y-8">
                  {/* Parameters */}
                  {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>请求参数</CardTitle>
                        <CardDescription>接口所需的参数信息</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-dark-border">
                                <th className="text-left py-2 text-cyber-light font-medium text-sm">参数名</th>
                                <th className="text-left py-2 text-cyber-light font-medium text-sm">类型</th>
                                <th className="text-left py-2 text-cyber-light font-medium text-sm">必填</th>
                                <th className="text-left py-2 text-cyber-light font-medium text-sm">说明</th>
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
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {/* Parameter Examples */}
                        <div className="mt-4 space-y-2">
                          <h5 className="text-sm font-medium text-cyber-light">参数示例</h5>
                          <div className="bg-dark-bg rounded-md p-3 space-y-1">
                            {selectedEndpoint.parameters.map((param, index) => (
                              <div key={index} className="text-sm font-mono text-cyber-gray">
                                <span className="text-neon-green">{param.name}</span>: {param.example}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Request Body */}
                  {selectedEndpoint.requestBody && (
                    <Card>
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
                  <Card>
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
                              <span className="text-cyber-light font-medium text-sm">{response.description}</span>
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
                </div>

                {/* Examples - Full Width */}
                {selectedEndpoint.examples && selectedEndpoint.examples.length > 0 && (
                  <Card className="mt-8">
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

                            <div className="space-y-6 xl:grid xl:grid-cols-2 xl:gap-6 xl:space-y-0">
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
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="bg-dark-surface rounded-full p-8 mb-6 mx-auto w-fit">
                  <Globe className="w-16 h-16 text-cyber-gray mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-cyber-light mb-4">选择一个接口</h3>
                <p className="text-cyber-gray leading-relaxed">从左侧导航中选择要查看的API接口，查看详细的参数说明、请求示例和响应格式</p>
                <div className="mt-8 p-4 bg-dark-surface/50 rounded-lg border border-dark-border">
                  <p className="text-sm text-cyber-gray">
                    💡 提示：使用搜索功能快速找到需要的接口
                  </p>
                </div>
              </div>
            </div>
          )}
          <Footer />
        </div>
      </div>
    </div>
  )
}