import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { CodeBlock } from '@/components/ui/code-block'
import { JsonEditor } from '@/components/ui/json-editor'
import { UnifiedConfig } from '@/components/ui/unified-config'
import { ConfigStatus } from '@/components/ui/config-status'
import { MessageContainer, message } from '@/components/ui/message'
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
  HelpCircle,
  Shield,
  AlertTriangle,
  Info
} from 'lucide-react'
import axios from 'axios'

interface TestConfig {
  supabaseUrl: string
  anonKey: string
  serviceRoleKey?: string
}

interface RestAuthConfig {
  accessToken: string
  supabaseManagementUrl: string
}

interface UserAuthState {
  isAuthenticated: boolean
  accessToken: string | null
  user: any | null
  email: string
  password: string
}

interface TestRequest {
  endpoint: ApiEndpoint
  parameters: Record<string, string>
  requestBody: string
  headers: Record<string, string>
  selectedKeyType?: 'anon' | 'service_role' | 'rest_token'
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
    anonKey: '',
    serviceRoleKey: ''
  })
  
  const [restConfig, setRestConfig] = useState<RestAuthConfig>({
    accessToken: '',
    supabaseManagementUrl: 'https://api.supabase.com'
  })
  
  const [showSettings, setShowSettings] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(apiCategories[0]?.id || '')
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null)
  const [testRequest, setTestRequest] = useState<TestRequest>({
    endpoint: null as any,
    parameters: {},
    requestBody: '{}',
    headers: {},
    selectedKeyType: undefined
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [testResponse, setTestResponse] = useState<TestResponse | null>(null)
  const [testHistory, setTestHistory] = useState<Array<{ id: string; request: TestRequest; response: TestResponse; timestamp: Date }>>([])
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<{ request: TestRequest; response: TestResponse; timestamp: Date } | null>(null)
  const [tempServiceKey, setTempServiceKey] = useState('')
  const [showTempServiceKeyInput, setShowTempServiceKeyInput] = useState(false)
  
  // 用户认证状态
  const [userAuth, setUserAuth] = useState<UserAuthState>({
    isAuthenticated: false,
    accessToken: null,
    user: null,
    email: '',
    password: ''
  })
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [showTokenInput, setShowTokenInput] = useState(false)
  const [manualToken, setManualToken] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)

  // 判断是否为 REST API 接口
  const isRestApiEndpoint = (endpoint: ApiEndpoint): boolean => {
    const category = apiCategories.find(cat => 
      cat.endpoints.some(ep => ep.id === endpoint.id)
    )
    return category?.id.startsWith('rest-') || false
  }

  // 判断接口是否需要用户认证（受RLS保护）
  const requiresUserAuth = (endpoint: ApiEndpoint): boolean => {
    const path = endpoint.path.toLowerCase()
    const name = endpoint.name.toLowerCase()
    const description = endpoint.description.toLowerCase()
    
    // REST API 接口不需要用户认证
    if (isRestApiEndpoint(endpoint)) {
      return false
    }
    
    // 数据库操作通常受RLS保护，需要用户认证
    if (path.includes('/rest/v1/') && !path.includes('/rpc/')) {
      return true
    }
    
    // 存储操作受RLS保护
    if (path.includes('/storage/v1/object/') && endpoint.method !== 'GET') {
      return true
    }
    
    // 用户相关操作（非管理员操作）
    if (path.includes('/auth/v1/user') || path.includes('/auth/v1/token')) {
      return false // 这些是认证接口本身，不需要预先认证
    }
    
    return false
  }

  // 根据接口路径和功能判断所需的密钥类型
  const getRequiredKeyType = (endpoint: ApiEndpoint): 'anon' | 'service_role' | 'both' | 'rest_token' => {
    // REST API 接口需要个人访问令牌
    if (isRestApiEndpoint(endpoint)) {
      return 'rest_token'
    }
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

  const getKeyTypeInfo = (keyType: 'anon' | 'service_role' | 'both' | 'rest_token') => {
    switch (keyType) {
      case 'anon':
        return {
          label: '匿名密钥 (anon key)',
          color: 'success',
          icon: Key,
          description: '客户端安全，受RLS保护',
          warning: null
        }
      case 'service_role':
        return {
          label: '服务密钥 (service_role key)',
          color: 'error',
          icon: Shield,
          description: '服务端专用，完全访问权限',
          warning: '⚠️ 此接口需要服务密钥，请确保在服务端环境中使用'
        }
      case 'both':
        return {
          label: '两种密钥均可',
          color: 'warning',
          icon: Key,
          description: '匿名密钥或服务密钥均可使用',
          warning: null
        }
      case 'rest_token':
        return {
          label: '个人访问令牌 (Personal Access Token)',
          color: 'error',
          icon: Shield,
          description: 'REST API 管理接口专用',
          warning: '⚠️ 此接口需要个人访问令牌，具有完整账户访问权限，请在安全环境中使用'
        }
      default:
        return {
          label: '匿名密钥 (anon key)',
          color: 'success',
          icon: Key,
          description: '客户端安全，受RLS保护',
          warning: null
        }
    }
  }

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

    // Load REST config
    const savedRestConfig = localStorage.getItem('supabase-rest-api-config')
    if (savedRestConfig) {
      try {
        const parsedRestConfig = JSON.parse(savedRestConfig)
        setRestConfig(parsedRestConfig)
      } catch (error) {
        console.error('Failed to parse saved REST config:', error)
      }
    }

    // Load user auth state
    const savedUserAuth = localStorage.getItem('supabase-user-auth')
    if (savedUserAuth) {
      try {
        const parsedUserAuth = JSON.parse(savedUserAuth)
        setUserAuth(parsedUserAuth)
      } catch (error) {
        console.error('Failed to parse saved user auth:', error)
      }
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

  // Save REST config to localStorage
  const saveRestConfig = (newConfig: RestAuthConfig) => {
    setRestConfig(newConfig)
    localStorage.setItem('supabase-rest-api-config', JSON.stringify(newConfig))
  }

  // Save user auth state to localStorage
  const saveUserAuth = (newAuth: UserAuthState) => {
    setUserAuth(newAuth)
    localStorage.setItem('supabase-user-auth', JSON.stringify(newAuth))
  }

  // 用户登录
  const handleUserLogin = async () => {
    if (!config.supabaseUrl || !config.anonKey) {
      console.error('请先配置Supabase URL和API Key')
      return
    }

    if (!userAuth.email || !userAuth.password) {
      console.error('请输入邮箱和密码')
      return
    }

    setAuthLoading(true)
    try {
      const response = await axios.post(
        `${config.supabaseUrl.replace(/\/$/, '')}/auth/v1/token?grant_type=password`,
        {
          email: userAuth.email,
          password: userAuth.password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': config.anonKey,
            'Authorization': `Bearer ${config.anonKey}`
          }
        }
      )

      const { access_token, user } = response.data
      const newAuth = {
        ...userAuth,
        isAuthenticated: true,
        accessToken: access_token,
        user: user
      }
      
      saveUserAuth(newAuth)
      setShowAuthModal(false)
      message.success('登录成功！')
    } catch (error: any) {
      console.error('Login failed:', error)
      
      // 检查是否是邮箱确认相关的错误
      const errorMessage = error.response?.data?.error_description || error.response?.data?.msg || error.message
      const errorCode = error.response?.data?.error
      
      if (errorCode === 'email_not_confirmed' || 
          errorMessage?.includes('email not confirmed') ||
          errorMessage?.includes('confirm your email') ||
          errorMessage?.includes('verification')) {
        message.warning(
          `您的邮箱尚未验证，系统已向 ${userAuth.email} 发送确认邮件。

请按以下步骤操作：
1. 检查您的邮箱收件箱（包括垃圾邮件文件夹）
2. 点击确认邮件中的验证链接
3. 验证完成后，返回此页面重新登录

如果没有收到邮件，请检查邮箱地址是否正确，或稍后重试。`,
          '邮箱验证提醒',
          8000
        )
      } else if (errorCode === 'invalid_credentials' || 
                 errorMessage?.includes('Invalid login credentials') ||
                 errorMessage?.includes('invalid credentials')) {
        message.error('邮箱或密码错误，请检查后重试', '登录失败')
      } else if (errorMessage?.includes('too many requests') || 
                 errorMessage?.includes('rate limit')) {
        message.error('请求过于频繁，请稍后再试', '登录失败')
      } else {
        message.error(errorMessage, '登录失败')
      }
    } finally {
      setAuthLoading(false)
    }
  }

  // 用户登出
  const handleUserLogout = () => {
    const newAuth = {
      isAuthenticated: false,
      accessToken: null,
      user: null,
      email: '',
      password: ''
    }
    saveUserAuth(newAuth)
    setManualToken('')
    setShowTokenInput(false)
  }

  // 手动输入访问令牌
  const handleManualTokenLogin = () => {
    if (!manualToken.trim()) {
      message.error('请输入访问令牌')
      return
    }

    // 简单验证令牌格式（JWT通常以ey开头）
    if (!manualToken.startsWith('ey')) {
      message.error('访问令牌格式不正确，请检查后重试')
      return
    }

    try {
      // 尝试解析JWT payload来获取用户信息
      const payload = JSON.parse(atob(manualToken.split('.')[1]))
      const user = {
        id: payload.sub,
        email: payload.email || userAuth.email || '用户',
        exp: payload.exp
      }

      // 检查令牌是否过期
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        message.error('访问令牌已过期，请重新获取')
        return
      }

      const newAuth = {
        ...userAuth,
        isAuthenticated: true,
        accessToken: manualToken,
        user: user
      }
      
      saveUserAuth(newAuth)
      setShowAuthModal(false)
      setManualToken('')
      setShowTokenInput(false)
      message.success('令牌登录成功！')
    } catch (error) {
      console.error('Token parsing failed:', error)
      message.error('访问令牌解析失败，请检查令牌是否正确')
    }
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
      
      // REST API 接口会在配置状态中显示相应提示
      
      // 根据接口需求选择合适的密钥
      const keyType = getRequiredKeyType(endpoint)
      let selectedKey = config.anonKey
      
      if (keyType === 'rest_token') {
        selectedKey = restConfig.accessToken
        setShowTempServiceKeyInput(false)
      } else if (keyType === 'service_role' && config.serviceRoleKey) {
        selectedKey = config.serviceRoleKey
        setShowTempServiceKeyInput(false)
      } else if (keyType === 'service_role' && !config.serviceRoleKey) {
        setShowTempServiceKeyInput(true)
      } else {
        setShowTempServiceKeyInput(false)
      }
      
      // 根据用户选择的密钥类型覆盖默认选择
      if (testRequest.selectedKeyType) {
        if (testRequest.selectedKeyType === 'service_role' && config.serviceRoleKey) {
          selectedKey = config.serviceRoleKey
        } else if (testRequest.selectedKeyType === 'rest_token' && restConfig.accessToken) {
          selectedKey = restConfig.accessToken
        }
      }
      
      // 设置请求头
      let headers: Record<string, string>
      if (isRestApiEndpoint(endpoint)) {
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${selectedKey}`
        }
      } else {
        // 对于需要用户认证的接口，优先使用用户的访问令牌
        const authToken = (requiresUserAuth(endpoint) && userAuth.isAuthenticated) 
          ? userAuth.accessToken 
          : selectedKey
        
        headers = {
          'Content-Type': 'application/json',
          'apikey': selectedKey,
          'Authorization': `Bearer ${authToken}`
        }
      }
      
      // 设置初始的密钥类型
      let initialKeyType: 'anon' | 'service_role' | 'rest_token' = 'anon'
      if (keyType === 'rest_token') {
        initialKeyType = 'rest_token'
      } else if (keyType === 'service_role') {
        initialKeyType = 'service_role'
      } else if (keyType === 'both') {
        // 如果支持两种密钥，默认使用匿名密钥
        initialKeyType = 'anon'
      }
      
      setTestRequest({
        endpoint,
        parameters: {},
        requestBody: endpoint.requestBody?.example ? JSON.stringify(endpoint.requestBody.example, null, 2) : '{}',
        headers,
        selectedKeyType: initialKeyType
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

  // Validate parameter based on type and constraints
  const validateParameter = (param: any, value: string): { isValid: boolean; error?: string } => {
    if (!value && param.required) {
      return { isValid: false, error: '此参数为必填项' }
    }
    
    if (!value) return { isValid: true }
    
    // Type-specific validation
    switch (param.type) {
      case 'number':
        if (isNaN(Number(value))) {
          return { isValid: false, error: '请输入有效的数字' }
        }
        break
      case 'boolean':
        if (!['true', 'false', '1', '0'].includes(value.toLowerCase())) {
          return { isValid: false, error: '请输入 true/false 或 1/0' }
        }
        break
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return { isValid: false, error: '请输入有效的邮箱地址' }
        }
        break
    }
    
    // Special parameter validation
    if (param.name === 'filter' || param.name === 'column_filter' || param.description.includes('过滤条件')) {
      return validateFilterParameter(value)
    }
    
    return { isValid: true }
  }

  const buildRequestUrl = () => {
    if (!selectedEndpoint) return ''
    
    // 判断是否为 REST API 接口
    if (isRestApiEndpoint(selectedEndpoint)) {
      if (!restConfig.supabaseManagementUrl) return ''
      let url = restConfig.supabaseManagementUrl.replace(/\/$/, '') + selectedEndpoint.path
      
      // Replace path parameters
      Object.entries(testRequest.parameters).forEach(([key, value]) => {
        if (value && selectedEndpoint.path.includes(`{${key}}`)) {
          url = url.replace(`{${key}}`, encodeURIComponent(value))
        }
      })
      
      // Add query parameters for REST API
      const queryParams = new URLSearchParams()
      Object.entries(testRequest.parameters).forEach(([key, value]) => {
        if (value && !selectedEndpoint.path.includes(`{${key}}`)) {
          queryParams.append(key, value)
        }
      })
      
      const queryString = queryParams.toString()
      if (queryString) {
        url += '?' + queryString
      }
      
      return url
    }
    
    // JS SDK 接口处理
    if (!config.supabaseUrl) return ''
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
          if (key === 'filter' || key === 'column_filter') {
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
    if (!selectedEndpoint) {
      message.error('请先选择接口')
      return
    }

    // 检查配置
    if (isRestApiEndpoint(selectedEndpoint)) {
      if (!restConfig.supabaseManagementUrl || !restConfig.accessToken) {
        message.error('请先配置 REST API 认证信息')
        return
      }
    } else {
      if (!config.supabaseUrl) {
        message.error('请先配置Supabase URL')
        return
      }
    }

    // 检查密钥配置
    // 优先使用用户选择的密钥类型，否则使用接口推荐的密钥类型
    const keyType = testRequest.selectedKeyType || getRequiredKeyType(selectedEndpoint)
    let currentApiKey = config.anonKey

    if (keyType === 'rest_token') {
      if (!restConfig.accessToken) {
        message.error('此接口需要个人访问令牌，请在 REST API 配置中设置')
        return
      }
      currentApiKey = restConfig.accessToken
    } else if (keyType === 'service_role') {
      if (config.serviceRoleKey) {
        currentApiKey = config.serviceRoleKey
      } else if (tempServiceKey) {
        currentApiKey = tempServiceKey
      } else {
        message.error('此接口需要服务端密钥，请在设置中配置或使用临时密钥输入框')
        return
      }
    } else if (keyType === 'anon') {
      if (!config.anonKey) {
        message.error('请先配置匿名密钥')
        return
      }
      currentApiKey = config.anonKey
    } else if (!config.anonKey) {
      message.error('请先配置API Key')
      return
    }

    // Validate parameters before sending request
    const parameterErrors: string[] = []
    if (selectedEndpoint.parameters) {
      selectedEndpoint.parameters.forEach(param => {
        const value = testRequest.parameters[param.name] || ''
        const validation = validateParameter(param, value)
        
        if (!validation.isValid && validation.error) {
          parameterErrors.push(`参数 "${param.name}": ${validation.error}`)
        }
      })
    }

    if (parameterErrors.length > 0) {
      message.error(
        parameterErrors.join('\n'),
        '参数验证失败',
        6000
      )
      return
    }

    setIsLoading(true)
    const startTime = Date.now()

    try {
      const url = buildRequestUrl()
      let headers: Record<string, string>
      
      if (isRestApiEndpoint(selectedEndpoint)) {
        // REST API 使用 Bearer token 认证
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentApiKey}`
        }
      } else {
        // JS SDK 接口使用 apikey 和 Authorization
        // 对于需要用户认证的接口，优先使用用户的访问令牌
        const authToken = (requiresUserAuth(selectedEndpoint) && userAuth.isAuthenticated) 
          ? userAuth.accessToken 
          : currentApiKey
        
        headers = {
          ...testRequest.headers,
          'apikey': currentApiKey,
          'Authorization': `Bearer ${authToken}`
        }
      }

      let requestData = undefined
      if (['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method)) {
        try {
          requestData = JSON.parse(testRequest.requestBody)
        } catch (e) {
          message.error('请求体JSON格式错误，请检查JSON语法')
          setIsLoading(false)
          return
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

      // 针对403错误提供RLS相关的解决建议
      if (error.response?.status === 403 && selectedEndpoint) {
        const needsAuth = requiresUserAuth(selectedEndpoint)
        const keyType = getRequiredKeyType(selectedEndpoint)
        
        let suggestion = '403 Forbidden - 可能的解决方案:\n'
        
        if (needsAuth && !userAuth.isAuthenticated) {
          suggestion += '• 此接口受RLS策略保护，需要用户登录认证\n'
          suggestion += '• 请点击"用户登录"按钮进行认证\n'
        } else if (keyType === 'service_role' && !config.serviceRoleKey && !tempServiceKey) {
          suggestion += '• 此接口需要服务端密钥来绕过RLS策略\n'
          suggestion += '• 请配置服务端密钥或使用临时密钥输入\n'
        } else if (needsAuth && userAuth.isAuthenticated) {
          suggestion += '• 用户已认证但仍被拒绝，可能原因:\n'
          suggestion += '  - RLS策略不允许当前用户访问此资源\n'
          suggestion += '  - 访问令牌已过期，请重新登录\n'
          suggestion += '  - 数据库表未启用RLS或策略配置错误\n'
        } else {
          suggestion += '• 检查API密钥是否正确\n'
          suggestion += '• 确认数据库RLS策略配置\n'
          suggestion += '• 验证用户权限设置\n'
        }
        
        errorResponse.error = suggestion
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

  const isConfigValid = !!(config.supabaseUrl && config.anonKey)
  const isRestConfigValid = !!(restConfig.supabaseManagementUrl && restConfig.accessToken)

  // 检查当前选择的接口是否有足够的密钥配置
  const hasRequiredKey = () => {
    if (!selectedEndpoint) return true
    
    const keyType = getRequiredKeyType(selectedEndpoint)
    if (keyType === 'rest_token') {
      return restConfig.accessToken
    }
    if (keyType === 'service_role') {
      return config.serviceRoleKey || tempServiceKey || showTempServiceKeyInput
    }
    return config.anonKey
  }

  // 获取当前接口类型的配置状态
  const getCurrentConfigStatus = () => {
    if (!selectedEndpoint) return { isValid: false, type: 'none' }
    
    if (isRestApiEndpoint(selectedEndpoint)) {
      return { isValid: isRestConfigValid, type: 'rest' }
    } else {
      return { isValid: isConfigValid, type: 'sdk' }
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg pt-16">
      <MessageContainer />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Configuration Status */}
        <div className="mb-6">
          <ConfigStatus
            isJsSdkConfigValid={isConfigValid}
            isRestConfigValid={isRestConfigValid}
            selectedEndpointType={
              selectedEndpoint 
                ? (isRestApiEndpoint(selectedEndpoint) ? 'rest-api' : 'js-sdk')
                : null
            }
            isUserAuthenticated={userAuth.isAuthenticated}
            userEmail={userAuth.user?.email}
            onOpenSettings={() => setShowSettings(true)}
            onLogin={() => setShowAuthModal(true)}
            onLogout={handleUserLogout}
            onOpenHistory={() => setShowHistoryModal(true)}
            hasHistory={testHistory.length > 0}
          />
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
                      
                      {/* API Key Requirement and RLS Info */}
                      {(() => {
                        const keyType = getRequiredKeyType(selectedEndpoint)
                        const keyInfo = getKeyTypeInfo(keyType)
                        const IconComponent = keyInfo.icon
                        const configStatus = getCurrentConfigStatus()
                        const needsAuth = requiresUserAuth(selectedEndpoint)
                        
                        return (
                          <div className="mb-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <IconComponent className="w-4 h-4 text-cyber-gray" />
                              <span className="text-xs text-cyber-gray">所需密钥:</span>
                              <Badge variant={keyInfo.color as "success" | "error" | "warning" | "default" | "info"} className="flex items-center space-x-1 text-xs">
                                <IconComponent className="w-3 h-3" />
                                <span>{keyInfo.label}</span>
                              </Badge>
                              {keyType === 'rest_token' && (
                                <Badge variant={configStatus.isValid ? "success" : "error"} className="text-xs">
                                  {configStatus.isValid ? "已配置" : "未配置"}
                                </Badge>
                              )}
                              {needsAuth && (
                                <Badge variant={userAuth.isAuthenticated ? "success" : "warning"} className="text-xs">
                                  <Shield className="w-3 h-3 mr-1" />
                                  {userAuth.isAuthenticated ? "已认证" : "需认证"}
                                </Badge>
                              )}
                            </div>
                            
                            {/* RLS Protection Notice */}
                            {needsAuth && (
                              <div className={`flex items-start space-x-2 mt-2 p-3 rounded text-xs ${
                                userAuth.isAuthenticated 
                                  ? 'bg-green-500/10 border border-green-500/30 text-green-300'
                                  : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-300'
                              }`}>
                                <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="font-medium mb-2 flex items-center space-x-2">
                                    <span>此接口受RLS策略保护</span>
                                    <Badge variant={userAuth.isAuthenticated ? "success" : "warning"} className="text-xs">
                                      {userAuth.isAuthenticated ? "✓ 已认证" : "⚠ 需认证"}
                                    </Badge>
                                  </div>
                                  {userAuth.isAuthenticated ? (
                                    <div className="space-y-1">
                                      <div className="flex items-center space-x-2">
                                        <CheckCircle className="w-3 h-3" />
                                        <span>已使用用户访问令牌 ({userAuth.user?.email})</span>
                                      </div>
                                      <div className="text-green-200">将遵循RLS策略限制，只能访问用户有权限的数据</div>
                                    </div>
                                  ) : (
                                    <div className="space-y-1">
                                      <div className="flex items-center space-x-2">
                                        <AlertTriangle className="w-3 h-3" />
                                        <span>需要用户登录认证才能访问受保护的数据</span>
                                      </div>
                                      <div className="text-yellow-200">
                                        请点击右上角"用户登录"按钮进行认证，或使用服务密钥绕过RLS
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {keyInfo.warning && (
                              <div className="flex items-start space-x-2 mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-300">
                                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                <span>{keyInfo.warning}</span>
                              </div>
                            )}
                            {keyType === 'both' && (
                              <div className="flex items-start space-x-2 mt-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-blue-300">
                                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                <span>此接口支持匿名密钥和服务密钥。使用匿名密钥时受RLS策略保护，使用服务密钥时拥有完全访问权限。</span>
                              </div>
                            )}
                            {keyType === 'rest_token' && (
                              <div className="flex items-start space-x-2 mt-2 p-2 bg-orange-500/10 border border-orange-500/30 rounded text-xs text-orange-300">
                                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                <span>此接口使用 Supabase 管理 API，需要个人访问令牌进行认证。请确保在安全环境中使用。</span>
                              </div>
                            )}
                          </div>
                        )
                      })()}
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-cyber-gray">请求URL:</span>
                          <code className="block text-neon-green text-sm break-all">{buildRequestUrl()}</code>
                        </div>
                      </div>

                      {/* 密钥类型选择器 */}
                      {(() => {
                        const currentKeyType = getRequiredKeyType(selectedEndpoint)
                        return (currentKeyType === 'both' || currentKeyType === 'anon' || currentKeyType === 'service_role') && (
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <label className="text-sm font-medium text-cyber-light">认证密钥类型</label>
                              <div className="relative group">
                                <HelpCircle className="w-4 h-4 text-cyber-gray hover:text-neon-green cursor-help" />
                                <div className="absolute left-0 top-6 hidden group-hover:block z-10 bg-dark-surface border border-dark-border rounded-lg p-3 shadow-lg min-w-[300px]">
                                  <div className="text-xs text-cyber-gray">
                                    <div className="mb-2 font-medium">密钥类型说明:</div>
                                    <div className="space-y-2">
                                      <div>
                                        <span className="font-medium text-neon-green">匿名密钥</span>
                                        <span className="text-cyber-gray"> - 客户端安全，受RLS策略保护</span>
                                      </div>
                                      <div>
                                        <span className="font-medium text-orange-400">服务端密钥</span>
                                        <span className="text-cyber-gray"> - 服务端专用，完全访问权限</span>
                                      </div>
                                      <div>
                                        <span className="font-medium text-blue-400">个人访问令牌</span>
                                        <span className="text-cyber-gray"> - REST API管理接口专用</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const selectedKey = config.anonKey
                                  const authToken = (requiresUserAuth(selectedEndpoint) && userAuth.isAuthenticated) 
                                    ? userAuth.accessToken 
                                    : selectedKey
                                  
                                  setTestRequest(prev => ({
                                    ...prev, 
                                    selectedKeyType: 'anon',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'apikey': selectedKey,
                                      'Authorization': `Bearer ${authToken}`
                                    }
                                  }))
                                }}
                                className={`p-2 rounded-lg border text-sm text-center transition-all ${
                                  testRequest.selectedKeyType === 'anon' 
                                    ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
                                    : 'bg-dark-surface/50 border-dark-border text-cyber-gray hover:border-blue-500/50'
                                }`}
                              >
                                <Key className="w-4 h-4 mx-auto mb-1" />
                                <div>匿名密钥</div>
                                <div className="text-xs opacity-70">安全推荐</div>
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  const selectedKey = config.serviceRoleKey || tempServiceKey
                                  const authToken = (requiresUserAuth(selectedEndpoint) && userAuth.isAuthenticated) 
                                    ? userAuth.accessToken 
                                    : selectedKey
                                  
                                  setTestRequest(prev => ({
                                    ...prev, 
                                    selectedKeyType: 'service_role',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'apikey': selectedKey,
                                      'Authorization': `Bearer ${authToken}`
                                    }
                                  }))
                                }}
                                className={`p-2 rounded-lg border text-sm text-center transition-all ${
                                  testRequest.selectedKeyType === 'service_role' 
                                    ? 'bg-orange-500/20 border-orange-500 text-orange-400' 
                                    : 'bg-dark-surface/50 border-dark-border text-cyber-gray hover:border-orange-500/50'
                                }`}
                                disabled={!config.serviceRoleKey && !tempServiceKey}
                              >
                                <Shield className="w-4 h-4 mx-auto mb-1" />
                                <div>服务端密钥</div>
                                <div className="text-xs opacity-70">
                                  {config.serviceRoleKey ? '已配置' : tempServiceKey ? '临时密钥' : '未配置'}
                                </div>
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  const selectedKey = restConfig.accessToken
                                  
                                  setTestRequest(prev => ({
                                    ...prev, 
                                    selectedKeyType: 'rest_token',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${selectedKey}`
                                    }
                                  }))
                                }}
                                className={`p-2 rounded-lg border text-sm text-center transition-all ${
                                  testRequest.selectedKeyType === 'rest_token' 
                                    ? 'bg-purple-500/20 border-purple-500 text-purple-400' 
                                    : 'bg-dark-surface/50 border-dark-border text-cyber-gray hover:border-purple-500/50'
                                }`}
                                disabled={!restConfig.accessToken}
                              >
                                <Globe className="w-4 h-4 mx-auto mb-1" />
                                <div>个人令牌</div>
                                <div className="text-xs opacity-70">
                                  {restConfig.accessToken ? '已配置' : '未配置'}
                                </div>
                              </button>
                            </div>
                          </div>
                        )
                      })()}
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
                            const validation = validateParameter(param, currentValue)
                            
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
                                {/* Parameter-specific help text */}
                                {(param.name === 'filter' || param.name === 'column_filter') && (
                                  <div className="mt-1 text-xs text-cyber-gray">
                                    格式: column=operator.value (如: name=eq.John, age=gt.18, status=in.(active,pending))
                                  </div>
                                )}
                                {param.name === 'select' && (
                                  <div className="mt-1 text-xs text-cyber-gray">
                                    选择字段: id,name,email 或关联查询: id,name,profiles(avatar_url)
                                  </div>
                                )}
                                {param.name === 'order' && (
                                  <div className="mt-1 text-xs text-cyber-gray">
                                    排序格式: column_name.asc 或 column_name.desc
                                  </div>
                                )}
                                {param.name === 'range' && (
                                  <div className="mt-1 text-xs text-cyber-gray">
                                    范围格式: start-end (如: 0-9 表示前10条记录)
                                  </div>
                                )}
                                {param.name === 'onConflict' && (
                                  <div className="mt-1 text-xs text-cyber-gray">
                                    指定冲突解决的列名 (如: email, id)
                                  </div>
                                )}
                                {param.name === 'count' && (
                                  <div className="mt-1 text-xs text-cyber-gray">
                                    计数选项: exact (精确计数) 或 planned (估算计数)
                                  </div>
                                )}
                                {param.name === 'prefer' && (
                                  <div className="mt-1 text-xs text-cyber-gray">
                                    首选项: return=representation (返回数据) 或 return=minimal (仅返回状态)
                                  </div>
                                )}
                                {param.type === 'boolean' && (
                                  <div className="mt-1 text-xs text-cyber-gray">
                                    布尔值: true/false 或 1/0
                                  </div>
                                )}
                                {!validation.isValid && validation.error && (
                                  <div className="mt-1 text-xs text-red-400">
                                    {validation.error}
                                  </div>
                                )}
                                {param.description && !['filter', 'column_filter', 'select', 'order', 'range', 'onConflict', 'count', 'prefer'].includes(param.name) && param.type !== 'boolean' && (
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

                    {/* Temporary Service Key Input */}
                    {showTempServiceKeyInput && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span className="text-sm font-medium text-red-400">需要服务端密钥</span>
                        </div>
                        <p className="text-xs text-red-300 mb-3">
                          此接口需要服务端密钥才能访问。您可以在设置中配置服务端密钥，或在下方临时输入：
                        </p>
                        <div>
                          <label className="block text-xs font-medium text-cyber-light mb-2">
                            <Shield className="w-3 h-3 inline mr-1" />
                            临时服务端密钥
                          </label>
                          <Input
                            type="password"
                            placeholder="输入服务端密钥进行测试"
                            value={tempServiceKey}
                            onChange={(e) => {
                              setTempServiceKey(e.target.value)
                              // 更新请求头中的密钥和密钥类型
                              if (selectedEndpoint) {
                                const authToken = (requiresUserAuth(selectedEndpoint) && userAuth.isAuthenticated) 
                                  ? userAuth.accessToken 
                                  : e.target.value
                                
                                setTestRequest(prev => ({
                                  ...prev,
                                  selectedKeyType: 'service_role',
                                  headers: {
                                    ...prev.headers,
                                    'apikey': e.target.value,
                                    'Authorization': `Bearer ${authToken}`
                                  }
                                }))
                              }
                            }}
                            className="text-sm"
                          />
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-cyber-gray">
                              ⚠️ 仅用于测试，请勿在生产环境的客户端使用
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setShowTempServiceKeyInput(false)
                                setTempServiceKey('')
                                // 恢复使用匿名密钥
                                if (selectedEndpoint) {
                                  const authToken = (requiresUserAuth(selectedEndpoint) && userAuth.isAuthenticated) 
                                    ? userAuth.accessToken 
                                    : config.anonKey
                                  
                                  setTestRequest(prev => ({
                                    ...prev,
                                    selectedKeyType: 'anon',
                                    headers: {
                                      ...prev.headers,
                                      'apikey': config.anonKey,
                                      'Authorization': `Bearer ${authToken}`
                                    }
                                  }))
                                }
                              }}
                              className="text-xs text-cyber-gray hover:text-cyber-light"
                            >
                              取消
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={executeTest}
                      disabled={!isConfigValid || isLoading || !hasRequiredKey()}
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

      {/* User Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-surface rounded-lg border border-dark-border w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-dark-border">
              <div className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-neon-green" />
                <h2 className="text-xl font-bold text-cyber-light">用户登录</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAuthModal(false)}
                className="text-cyber-light hover:text-neon-green"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="text-sm text-cyber-gray mb-4">
                登录后可以测试受RLS策略保护的接口，系统将使用您的用户访问令牌进行认证。
              </div>

              {!showTokenInput ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-cyber-light mb-2">邮箱</label>
                    <Input
                      type="email"
                      placeholder="输入您的邮箱地址"
                      value={userAuth.email}
                      onChange={(e) => setUserAuth(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-cyber-light mb-2">密码</label>
                    <Input
                      type="password"
                      placeholder="输入您的密码"
                      value={userAuth.password}
                      onChange={(e) => setUserAuth(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 text-xs text-blue-300">
                    <div className="font-medium mb-1">📧 邮箱确认提醒</div>
                    <div>如果您是首次注册或邮箱未验证，系统会发送确认邮件。请先验证邮箱后再登录。</div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex flex-col space-y-1">
                      <div className="text-xs text-cyber-gray">
                        确保您已在Supabase项目中注册此账户
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowTokenInput(true)}
                        className="text-xs text-neon-green hover:text-neon-green/80 self-start p-0 h-auto"
                      >
                        已有访问令牌？点击直接输入
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAuthModal(false)}
                        className="text-cyber-light hover:text-cyber-gray"
                      >
                        取消
                      </Button>
                      <Button
                        onClick={handleUserLogin}
                        disabled={authLoading || !userAuth.email || !userAuth.password}
                        className="min-w-[80px]"
                        variant="cyber"
                      >
                        {authLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          '登录'
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-cyber-light mb-2">访问令牌</label>
                    <Textarea
                      placeholder="粘贴您的访问令牌（JWT格式）"
                      value={manualToken}
                      onChange={(e) => setManualToken(e.target.value)}
                      rows={4}
                      className="font-mono text-xs"
                    />
                  </div>

                  <div className="bg-green-500/10 border border-green-500/30 rounded p-3 text-xs text-green-300">
                    <div className="font-medium mb-1">🔑 访问令牌说明</div>
                    <div className="space-y-1">
                      <div>• 访问令牌通常以 "ey" 开头的JWT格式</div>
                      <div>• 可从浏览器开发者工具或Supabase客户端获取</div>
                      <div>• 令牌包含用户身份信息和权限</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowTokenInput(false)
                        setManualToken('')
                      }}
                      className="text-cyber-light hover:text-cyber-gray"
                    >
                      ← 返回邮箱登录
                    </Button>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAuthModal(false)}
                        className="text-cyber-light hover:text-cyber-gray"
                      >
                        取消
                      </Button>
                      <Button
                        onClick={handleManualTokenLogin}
                        disabled={!manualToken.trim()}
                        className="min-w-[80px]"
                        variant="cyber"
                      >
                        使用令牌
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

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

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-surface rounded-lg border border-dark-border w-full max-w-5xl max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-dark-border">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-neon-green" />
                <h2 className="text-xl font-bold text-cyber-light">API 配置</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(false)}
                className="text-cyber-light hover:text-neon-green"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
              <UnifiedConfig
                config={config}
                restConfig={restConfig}
                onConfigChange={saveConfig}
                onRestConfigChange={saveRestConfig}
                isVisible={true}
                onToggleVisibility={() => setShowSettings(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}