import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CodeBlock } from '@/components/ui/code-block'
import { Input } from '@/components/ui/input'
import { apiCategories, ApiEndpoint, ApiCategory } from '@/data/api-docs'
import { Search, ChevronRight, ChevronDown, Globe, Database, Shield, Zap } from 'lucide-react'

export const ApiDocs: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(apiCategories[0]?.endpoints[0] || null)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['auth']))

  const categoryIcons = {
    auth: Shield,
    database: Database,
    storage: Globe,
    realtime: Zap,
    'edge-functions': Zap,
    admin: Shield,
    webhooks: Globe,
    analytics: Database
  }

  const methodColors = {
    GET: 'success',
    POST: 'info',
    PUT: 'warning',
    PATCH: 'warning',
    DELETE: 'error',
    WebSocket: 'info'
  } as const

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const filteredCategories = apiCategories.map(category => ({
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
                const IconComponent = categoryIcons[category.id as keyof typeof categoryIcons] || Database
                const isExpanded = expandedCategories.has(category.id)
                
                return (
                  <div key={category.id}>
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-dark-border transition-colors text-left"
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
                  <div className="flex items-center space-x-3 mb-4">
                    <Badge variant={methodColors[selectedEndpoint.method]} className="text-sm">
                      {selectedEndpoint.method}
                    </Badge>
                    <h1 className="text-3xl font-bold text-cyber-light">{selectedEndpoint.name}</h1>
                  </div>
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
                <Database className="w-16 h-16 text-cyber-gray mx-auto mb-4" />
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