import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { CodeBlock } from '@/components/ui/code-block'
import { JsonEditor } from '@/components/ui/json-editor'
import { apiCategories, ApiEndpoint } from '@/data/api-docs'
import { 
  Settings, 
  Play, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock,
  Key,
  Globe,
  Code,
  Send,
  History,
  Trash2,
  X,
  HelpCircle
} from 'lucide-react'
import axios from 'axios'

interface TestConfig {
  supabaseUrl: string
  apiKey: string
}

interface TestRequest {
  endpoint: ApiEndpoint
  parameters: Record<string, string>
  requestBody: string
  headers: Record<string, string>
}

interface TestResponse {
  status: number
  statusText: string
  data: any
  headers: Record<string, string>
  duration: number
  error?: string
}

export const ApiTesting: React.FC = () => {
  const [config, setConfig] = useState<TestConfig>({
    supabaseUrl: '',
    apiKey: ''
  })
  
  const [showSettings, setShowSettings] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(apiCategories[0]?.id || '')
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null)
  const [testRequest, setTestRequest] = useState<TestRequest>({
    endpoint: null as any,
    parameters: {},
    requestBody: '{}',
    headers: {}
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [testResponse, setTestResponse] = useState<TestResponse | null>(null)
  const [testHistory, setTestHistory] = useState<Array<{ id: string; request: TestRequest; response: TestResponse; timestamp: Date }>>([])
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<{ request: TestRequest; response: TestResponse; timestamp: Date } | null>(null)

  // Load config and history from localStorage on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('supabase-api-config')
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig)
        setConfig(parsedConfig)
        // If config exists, hide settings by default
        setShowSettings(false)
      } catch (error) {
        console.error('Failed to parse saved config:', error)
      }
    } else {
      // If no config exists, show settings by default
      setShowSettings(true)
    }

    // Load test history from localStorage
    const savedHistory = localStorage.getItem('supabase-api-test-history')
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        // Convert timestamp strings back to Date objects
        const historyWithDates = parsedHistory.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }))
        setTestHistory(historyWithDates)
      } catch (error) {
        console.error('Failed to parse saved history:', error)
      }
    }
  }, [])



  // Save config to localStorage whenever it changes
  const saveConfig = (newConfig: TestConfig) => {
    setConfig(newConfig)
    localStorage.setItem('supabase-api-config', JSON.stringify(newConfig))
  }

  const categoryOptions = apiCategories.map(cat => ({
    value: cat.id,
    label: cat.name
  }))

  const endpointOptions = apiCategories
    .find(cat => cat.id === selectedCategory)?.endpoints
    .map(endpoint => ({
      value: endpoint.id,
      label: `${endpoint.method} ${endpoint.name}`
    })) || []

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedEndpoint(null)
    setTestResponse(null)
  }

  const handleEndpointChange = (endpointId: string) => {
    const category = apiCategories.find(cat => cat.id === selectedCategory)
    const endpoint = category?.endpoints.find(ep => ep.id === endpointId)
    
    if (endpoint) {
      setSelectedEndpoint(endpoint)
      setTestRequest({
        endpoint,
        parameters: {},
        requestBody: endpoint.requestBody?.example ? JSON.stringify(endpoint.requestBody.example, null, 2) : '{}',
        headers: {
          'Content-Type': 'application/json',
          'apikey': config.apiKey,
          'Authorization': `Bearer ${config.apiKey}`
        }
      })
      setTestResponse(null)
    }
  }

  const handleParameterChange = (paramName: string, value: string) => {
    setTestRequest(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [paramName]: value
      }
    }))
  }

  // Validate Supabase filter parameter format
  const validateFilterParameter = (value: string): { isValid: boolean; error?: string } => {
    if (!value) return { isValid: true }
    
    // Check if it's a valid Supabase filter format: column=operator.value
    const filterRegex = /^[a-zA-Z_][a-zA-Z0-9_]*=(eq|neq|gt|gte|lt|lte|like|ilike|match|imatch|in|is|fts|plfts|phfts|wfts)\..+$/
    const simpleFilterRegex = /^[a-zA-Z_][a-zA-Z0-9_]*=(eq|neq|gt|gte|lt|lte|like|ilike|is)\.[^=]*$/
    
    if (filterRegex.test(value) || simpleFilterRegex.test(value)) {
      return { isValid: true }
    }
    
    return { 
      isValid: false, 
      error: '过滤器格式应为: column=operator.value (如: name=eq.John, age=gt.18)' 
    }
  }

  const buildRequestUrl = () => {
    if (!selectedEndpoint || !config.supabaseUrl) return ''
    
    let url = config.supabaseUrl.replace(/\/$/, '') + selectedEndpoint.path
    
    // Replace path parameters (parameters that appear in the URL path with {})
    Object.entries(testRequest.parameters).forEach(([key, value]) => {
      if (value && selectedEndpoint.path.includes(`{${key}}`)) {
        url = url.replace(`{${key}}`, encodeURIComponent(value))
      }
    })
    
    // Add query parameters for GET, PATCH, DELETE requests (Supabase REST API)
    if (['GET', 'PATCH', 'DELETE'].includes(selectedEndpoint.method)) {
      const queryParams = new URLSearchParams()
      
      Object.entries(testRequest.parameters).forEach(([key, value]) => {
        if (value && !selectedEndpoint.path.includes(`{${key}}`)) {
          // Handle special Supabase parameters
          if (key === 'filter') {
            // Filter parameter should be in format: column=operator.value
            // Split by first '=' to get column name and operator.value
            const filterParts = value.split('=')
            if (filterParts.length >= 2) {
              const columnName = filterParts[0].trim()
              const operatorValue = filterParts.slice(1).join('=').trim() // Handle cases where value contains '='
              queryParams.append(columnName, operatorValue)
            }
          } else if (['select', 'order', 'limit', 'offset', 'range', 'prefer'].includes(key)) {
            // Standard Supabase query parameters
            queryParams.append(key, value)
          } else {
            // Check if this is a column filter (contains Supabase operators)
            const supabaseOperators = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike', 'match', 'imatch', 'in', 'is', 'fts', 'plfts', 'phfts', 'wfts', 'not']
            const hasOperator = supabaseOperators.some(op => value.startsWith(`${op}.`))
            
            if (hasOperator) {
              // This is a column filter: column_name=operator.value
              queryParams.append(key, value)
            } else if (value.includes('=') && value.split('=').length >= 2) {
              // This might be a filter parameter in format: column=operator.value
              const filterParts = value.split('=')
              const columnName = filterParts[0].trim()
              const operatorValue = filterParts.slice(1).join('=').trim()
              
              // Validate if it looks like a Supabase filter
              const operatorPart = operatorValue.split('.')[0]
              if (supabaseOperators.includes(operatorPart)) {
                queryParams.append(columnName, operatorValue)
              } else {
                // Regular parameter
                queryParams.append(key, value)
              }
            } else {
              // Regular parameter
              queryParams.append(key, value)
            }
          }
        }
      })
      
      const queryString = queryParams.toString()
      if (queryString) {
        url += '?' + queryString
      }
    }
    
    return url
  }

  const executeTest = async () => {
    if (!selectedEndpoint || !config.supabaseUrl || !config.apiKey) {
      alert('请先配置Supabase URL和API Key')
      return
    }

    // Validate parameters before sending request
    const parameterErrors: string[] = []
    if (selectedEndpoint.parameters) {
      selectedEndpoint.parameters.forEach(param => {
        const value = testRequest.parameters[param.name] || ''
        
        // Check required parameters
        if (param.required && !value) {
          parameterErrors.push(`参数 "${param.name}" 是必需的`)
        }
        
        // Validate filter parameters
        if (value && (param.name === 'filter' || param.description.includes('过滤条件'))) {
          const validation = validateFilterParameter(value)
          if (!validation.isValid && validation.error) {
            parameterErrors.push(`参数 "${param.name}": ${validation.error}`)
          }
        }
      })
    }

    if (parameterErrors.length > 0) {
      alert('参数验证失败:\
' + parameterErrors.join('\
'))
      return
    }

    setIsLoading(true)
    const startTime = Date.now()

    try {
      const url = buildRequestUrl()
      const headers = {
        ...testRequest.headers,
        'apikey': config.apiKey,
        'Authorization': `Bearer ${config.apiKey}`
      }

      let requestData = undefined
      if (['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method)) {
        try {
          requestData = JSON.parse(testRequest.requestBody)
        } catch (e) {
          throw new Error('请求体JSON格式错误')
        }
      }

      const response = await axios({
        method: selectedEndpoint.method.toLowerCase() as any,
        url,
        headers,
        data: requestData,
        timeout: 30000
      })

      const duration = Date.now() - startTime
      const testResult: TestResponse = {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers as Record<string, string>,
        duration
      }

      setTestResponse(testResult)
      
      // Add to history with unique ID
      const historyItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        request: { ...testRequest },
        response: testResult,
        timestamp: new Date()
      }
      
      const newHistory = [historyItem, ...testHistory.slice(0, 19)] // Keep last 20 tests
      setTestHistory(newHistory)
      
      // Save to localStorage
      localStorage.setItem('supabase-api-test-history', JSON.stringify(newHistory))

    } catch (error: any) {
      const duration = Date.now() - startTime
      const errorResponse: TestResponse = {
        status: error.response?.status || 0,
        statusText: error.response?.statusText || 'Network Error',
        data: error.response?.data || null,
        headers: error.response?.headers || {},
        duration,
        error: error.message
      }

      setTestResponse(errorResponse)
      
      // Add error to history as well
      const historyItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        request: { ...testRequest },
        response: errorResponse,
        timestamp: new Date()
      }
      
      const newHistory = [historyItem, ...testHistory.slice(0, 19)] // Keep last 20 tests
      setTestHistory(newHistory)
      
      // Save to localStorage
      localStorage.setItem('supabase-api-test-history', JSON.stringify(newHistory))
    } finally {
      setIsLoading(false)
    }
  }

  // Delete history item
  const deleteHistoryItem = (id: string) => {
    const newHistory = testHistory.filter(item => item.id !== id)
    setTestHistory(newHistory)
    localStorage.setItem('supabase-api-test-history', JSON.stringify(newHistory))
  }

  // Clear all history
  const clearAllHistory = () => {
    setTestHistory([])
    localStorage.removeItem('supabase-api-test-history')
    setShowHistoryModal(false)
  }

  // View history item details
  const viewHistoryItem = (item: { request: TestRequest; response: TestResponse; timestamp: Date }) => {
    // 找到对应的分类
    const category = apiCategories.find(cat => 
      cat.endpoints.some(ep => ep.id === item.request.endpoint.id)
    )
    
    if (category) {
      // 先设置分类
      setSelectedCategory(category.id)
      
      // 延迟设置其他状态，确保endpointOptions已经更新
      setTimeout(() => {
        setSelectedEndpoint(item.request.endpoint)
        setTestRequest(item.request)
        setTestResponse(item.response)
        setSelectedHistoryItem(item)
      }, 200)
    }
    
    // 关闭历史弹框
    setShowHistoryModal(false)
  }

  const isConfigValid = config.supabaseUrl && config.apiKey

  return (
    <div className="min-h-screen bg-dark-bg pt-16">
      {/* Header Panel */}
      <div className={`bg-dark-surface border-b border-dark-border ${showSettings ? 'p-6' : 'px-6 py-4'}`}>
        <div className="max-w-7xl mx-auto">
          <div className={`flex items-center justify-between ${showSettings ? 'mb-6' : 'mb-0'}`}>
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-neon-green" />
              <h1 className="text-2xl font-bold text-cyber-light">接口测试</h1>
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
            
            {/* Settings Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center space-x-2 text-cyber-light hover:text-neon-green"
            >
              <Settings className="w-4 h-4" />
              <span>{showSettings ? '隐藏设置' : '显示设置'}</span>
            </Button>
          </div>

          {/* Configuration Panel - Conditionally Rendered */}
          {showSettings && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-cyber-light mb-2">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Supabase URL
                </label>
                <Input
                  placeholder="https://your-project.supabase.co"
                  value={config.supabaseUrl}
                  onChange={(e) => saveConfig({ ...config, supabaseUrl: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyber-light mb-2">
                  <Key className="w-4 h-4 inline mr-2" />
                  API Key
                </label>
                <Input
                  type="password"
                  placeholder="your-supabase-anon-key"
                  value={config.apiKey}
                  onChange={(e) => saveConfig({ ...config, apiKey: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header with History Button */}
        <div className="flex items-center justify-end mb-6">
          {testHistory.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center space-x-2 text-cyber-light hover:text-neon-green"
            >
              <History className="w-4 h-4" />
              <span className="text-sm">测试历史</span>
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Configuration */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="w-5 h-5" />
                  <span>请求配置</span>
                </CardTitle>
                <CardDescription>选择要测试的API接口并配置参数</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-cyber-light mb-2">API分类</label>
                  <Select
                    key={`category-${selectedCategory}`}
                    options={categoryOptions}
                    value={selectedCategory}
                    onValueChange={handleCategoryChange}
                    placeholder="选择API分类"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cyber-light mb-2">接口</label>
                  <Select
                    key={`endpoint-${selectedCategory}-${selectedEndpoint?.id || 'none'}`}
                    options={endpointOptions}
                    value={selectedEndpoint?.id || ''}
                    onValueChange={handleEndpointChange}
                    placeholder="选择接口"
                  />
                </div>

                {selectedEndpoint && (
                  <>
                    <div className="bg-dark-surface rounded-lg p-4 border border-dark-border">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={selectedEndpoint.method === 'GET' ? 'success' : 'info'}>
                          {selectedEndpoint.method}
                        </Badge>
                        <span className="text-cyber-light font-medium">{selectedEndpoint.name}</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-cyber-gray">请求URL:</span>
                          <code className="block text-neon-green text-sm break-all">{buildRequestUrl()}</code>
                        </div>

                      </div>
                    </div>

                    {/* Parameters */}
                    {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <label className="text-sm font-medium text-cyber-light">参数</label>
                          {selectedEndpoint.path.includes('/rest/v1/') && (
                            <div className="relative group">
                              <HelpCircle className="w-4 h-4 text-cyber-gray hover:text-neon-green cursor-help" />
                              <div className="absolute left-0 top-6 hidden group-hover:block z-10 bg-dark-surface border border-dark-border rounded-lg p-3 shadow-lg min-w-[300px]">
                                <div className="text-xs text-cyber-gray border-t border-dark-border pt-2">
                                  <div className="mb-1 font-medium">常用参数示例:</div>
                                  <div className="space-y-1">
                                    <div>• select: id,name,email (选择字段)</div>
                                    <div>• limit: 10 (限制数量)</div>
                                    <div>• offset: 20 (跳过记录)</div>
                                    <div>• order: created_at.desc (排序)</div>
                                    <div>• filter: name=eq.John 或直接用列名: name=eq.John</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          {selectedEndpoint.parameters.map((param) => {
                            const currentValue = testRequest.parameters[param.name] || ''
                            const isFilterParam = param.name === 'filter' || param.description.includes('过滤条件')
                            const validation = isFilterParam ? validateFilterParameter(currentValue) : { isValid: true }
                            
                            return (
                              <div key={param.name}>
                                <label className="block text-xs text-cyber-gray mb-1">
                                  {param.name} 
                                  {param.required && <span className="text-red-400 ml-1">*</span>}
                                  <span className="ml-2 text-cyber-gray">({param.type})</span>
                                </label>
                                <Input
                                  placeholder={param.example || param.description}
                                  value={currentValue}
                                  onChange={(e) => handleParameterChange(param.name, e.target.value)}
                                  className={!validation.isValid ? 'border-red-500 focus:border-red-500' : ''}
                                />
                                {isFilterParam && (
                                  <div className="mt-1 text-xs text-cyber-gray">
                                    格式: column=operator.value (如: name=eq.John, age=gt.18, status=in.(active,pending))
                                  </div>
                                )}
                                {!validation.isValid && validation.error && (
                                  <div className="mt-1 text-xs text-red-400">
                                    {validation.error}
                                  </div>
                                )}
                                {param.description && !isFilterParam && (
                                  <div className="mt-1 text-xs text-cyber-gray">
                                    {param.description}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Request Body */}
                    {['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && (
                      <JsonEditor
                        value={testRequest.requestBody}
                        onChange={(value) => setTestRequest(prev => ({ ...prev, requestBody: value }))}
                        rows={8}
                        placeholder="{}"
                      />
                    )}

                    <Button
                      onClick={executeTest}
                      disabled={!isConfigValid || isLoading}
                      className="w-full"
                      variant="cyber"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          发送中...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          发送请求
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Response Display */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>响应结果</span>
                  </div>
                  {testResponse && (
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={testResponse.status >= 200 && testResponse.status < 300 ? 'success' : 'error'}
                      >
                        {testResponse.status} {testResponse.statusText}
                      </Badge>
                      <div className="flex items-center space-x-1 text-cyber-gray text-sm">
                        <Clock className="w-3 h-3" />
                        <span>{testResponse.duration}ms</span>
                      </div>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testResponse ? (
                  <div className="space-y-4">
                    {testResponse.error && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <div className="text-red-400 font-medium mb-2">错误信息</div>
                        <div className="text-red-300 text-sm">{testResponse.error}</div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-sm font-medium text-cyber-light mb-2">响应数据</h4>
                      <CodeBlock
                        code={JSON.stringify(testResponse.data, null, 2)}
                        language="json"
                      />
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-cyber-light mb-2">响应头</h4>
                      <CodeBlock
                        code={JSON.stringify(testResponse.headers, null, 2)}
                        language="json"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Send className="w-12 h-12 text-cyber-gray mx-auto mb-4" />
                    <p className="text-cyber-gray">配置接口参数并发送请求查看响应结果</p>
                  </div>
                )}
              </CardContent>
            </Card>


          </div>
        </div>
      </div>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-surface rounded-lg border border-dark-border w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-dark-border">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-neon-green" />
                <h2 className="text-xl font-bold text-cyber-light">测试历史</h2>
                <Badge variant="info" className="text-xs">
                  {testHistory.length} 条记录
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                {testHistory.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllHistory}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    清空全部
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistoryModal(false)}
                  className="text-cyber-light hover:text-neon-green"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {testHistory.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-cyber-gray mx-auto mb-4" />
                  <p className="text-cyber-gray">暂无测试历史记录</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {testHistory.map((test) => (
                    <div
                      key={test.id}
                      className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-border hover:border-neon-green/30 transition-colors"
                    >
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => viewHistoryItem(test)}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge 
                            variant={test.response.status >= 200 && test.response.status < 300 ? 'success' : 'error'}
                            className="text-xs"
                          >
                            {test.request.endpoint.method}
                          </Badge>
                          <span className="text-cyber-light font-medium">{test.request.endpoint.name}</span>
                          <Badge 
                            variant={test.response.status >= 200 && test.response.status < 300 ? 'success' : 'error'}
                            className="text-xs"
                          >
                            {test.response.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-cyber-gray space-y-1">
                          <div>时间: {test.timestamp.toLocaleString()}</div>
                          <div>耗时: {test.response.duration}ms</div>
                          {Object.keys(test.request.parameters).length > 0 && (
                            <div>参数: {Object.entries(test.request.parameters).map(([k, v]) => `${k}=${v}`).join(', ')}</div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteHistoryItem(test.id)
                        }}
                        className="text-red-400 hover:text-red-300 ml-4"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}