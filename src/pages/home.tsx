import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Database, Zap, Shield, Globe, ArrowRight, Key, Settings, Code } from 'lucide-react'

interface HomeProps {
  onPageChange: (page: string) => void
}

export const Home: React.FC<HomeProps> = ({ onPageChange }) => {
  const features = [
    {
      icon: Database,
      title: '实时数据库',
      description: '基于PostgreSQL的实时数据库，支持实时订阅和复杂查询，为现代应用提供强大的数据存储能力。'
    },
    {
      icon: Shield,
      title: '身份认证',
      description: '内置用户认证系统，支持多种登录方式，包括邮箱、社交媒体登录和多因素认证。'
    },
    {
      icon: Zap,
      title: '边缘函数',
      description: '全球分布式边缘函数，提供低延迟的服务器端逻辑执行，支持TypeScript和JavaScript。'
    },
    {
      icon: Globe,
      title: '文件存储',
      description: '可扩展的文件存储服务，支持图片、视频等多媒体文件的上传、存储和CDN分发。'
    }
  ]

  const quickStartSteps = [
    {
      step: 1,
      title: '创建Supabase项目',
      description: '在Supabase控制台创建新项目',
      code: `// 1. 访问 https://supabase.com
// 2. 点击 "Start your project"
// 3. 创建新的组织和项目`
    },
    {
      step: 2,
      title: '获取API密钥',
      description: '从项目设置中获取API URL和密钥',
      code: `// 项目设置 > API
const supabaseUrl = 'https://your-project.supabase.co'
const supabaseKey = 'your-anon-key'`
    },
    {
      step: 3,
      title: '安装客户端库',
      description: '安装Supabase JavaScript客户端',
      code: `npm install @supabase/supabase-js

// 或使用 yarn
yarn add @supabase/supabase-js`
    },
    {
      step: 4,
      title: '初始化客户端',
      description: '在应用中初始化Supabase客户端',
      code: `import { createClient } from '@supabase/supabase-js'

const supabase = createClient(supabaseUrl, supabaseKey)

// 现在可以使用 supabase 进行数据操作
const { data, error } = await supabase
  .from('your_table')
  .select('*')`
    }
  ]

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Grid Background */}
      <div className="fixed inset-0 grid-background opacity-30 pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-cyber-light mb-6">
              Supabase API
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">
                演示平台
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-cyber-gray mb-8 max-w-3xl mx-auto leading-relaxed">
              探索 Supabase 的强大功能，学习 API 使用方法，在线测试接口调用。
              为开发者提供完整的 Supabase 学习和实践环境。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="cyber"
                size="lg"
                onClick={() => onPageChange('docs')}
                className="group"
              >
                开始探索
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onPageChange('testing')}
              >
                在线测试
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-cyber-light mb-4">
              核心特性
            </h2>
            <p className="text-lg text-cyber-gray max-w-2xl mx-auto">
              Supabase 提供了构建现代应用所需的全套后端服务
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-neon-green to-neon-blue rounded-lg flex items-center justify-center mb-4 group-hover:animate-pulse">
                    <feature.icon className="w-6 h-6 text-dark-bg" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* API Keys Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-surface/30">
=======
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-cyber-light mb-4">
              Supabase API 密钥详解
            </h2>
            <p className="text-lg text-cyber-gray max-w-3xl mx-auto">
              了解不同类型的 API 密钥及其适用场景，确保在正确的环境中使用合适的密钥
            </p>
          </div>

          {/* API Keys Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card className="border-neon-green/20">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <Key className="w-8 h-8 text-neon-green" />
                  <CardTitle className="text-2xl text-cyber-light">匿名密钥 (anon key)</CardTitle>
                </div>
                <div className="bg-neon-green/10 px-3 py-1 rounded-full inline-block">
                  <span className="text-neon-green text-sm font-medium">客户端安全</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base leading-relaxed">
                  这是一个公开的 API 密钥，可以安全地在客户端代码中使用。它受到行级安全策略 (RLS) 的保护。
                </CardDescription>
                
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-cyber-light">适用场景：</h4>
                  <ul className="space-y-2 text-cyber-gray">
                    <li className="flex items-start space-x-2">
                      <span className="text-neon-green mt-1">•</span>
                      <span>前端 Web 应用 (React, Vue, Angular)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-neon-green mt-1">•</span>
                      <span>移动应用 (React Native, Flutter)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-neon-green mt-1">•</span>
                      <span>需要用户认证的应用</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-neon-green mt-1">•</span>
                      <span>启用了 RLS 的数据库操作</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-dark-surface/50 p-4 rounded-lg">
                  <CodeBlock 
                    code={`// 客户端使用示例
const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key' // 可以公开暴露
)`}
                    language="javascript"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-neon-blue/20">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-8 h-8 text-neon-blue" />
                  <CardTitle className="text-2xl text-cyber-light">服务密钥 (service_role key)</CardTitle>
                </div>
                <div className="bg-red-500/10 px-3 py-1 rounded-full inline-block">
                  <span className="text-red-400 text-sm font-medium">服务端专用</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base leading-relaxed">
                  这是一个私有的 API 密钥，拥有完全的数据库访问权限，绕过所有 RLS 策略。仅用于服务端环境。
                </CardDescription>
                
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-cyber-light">适用场景：</h4>
                  <ul className="space-y-2 text-cyber-gray">
                    <li className="flex items-start space-x-2">
                      <span className="text-neon-blue mt-1">•</span>
                      <span>后端 API 服务器</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-neon-blue mt-1">•</span>
                      <span>数据库管理脚本</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-neon-blue mt-1">•</span>
                      <span>批量数据处理</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-neon-blue mt-1">•</span>
                      <span>管理员操作和系统集成</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-dark-surface/50 p-4 rounded-lg">
                  <CodeBlock 
                    code={`// 服务端使用示例 (Node.js)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // 保密！
)`}
                    language="javascript"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional API Keys */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center border-neon-purple/20">
              <CardHeader>
                <Database className="w-8 h-8 text-neon-purple mx-auto mb-2" />
                <CardTitle className="text-lg">数据库密码</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  直接连接 PostgreSQL 数据库的密码，用于数据库客户端工具和 ORM 连接
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-yellow-500/20">
              <CardHeader>
                <Code className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <CardTitle className="text-lg">JWT 密钥</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  用于验证和签名 JWT 令牌的密钥，通常用于自定义认证流程
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-orange-500/20">
              <CardHeader>
                <Settings className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <CardTitle className="text-lg">项目 URL</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  您的 Supabase 项目的唯一 URL，所有 API 请求的基础地址
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Security Best Practices */}
          <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-xl text-cyber-light flex items-center space-x-2">
                <Shield className="w-6 h-6 text-red-400" />
                <span>安全最佳实践</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-cyber-light mb-3">✅ 应该做的：</h4>
                  <ul className="space-y-2 text-cyber-gray text-sm">
                    <li>• 在客户端使用匿名密钥 (anon key)</li>
                    <li>• 在服务端使用服务密钥 (service_role key)</li>
                    <li>• 使用环境变量存储敏感密钥</li>
                    <li>• 启用行级安全策略 (RLS)</li>
                    <li>• 定期轮换 API 密钥</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-cyber-light mb-3">❌ 不应该做的：</h4>
                  <ul className="space-y-2 text-cyber-gray text-sm">
                    <li>• 在客户端代码中暴露服务密钥</li>
                    <li>• 将密钥硬编码在源代码中</li>
                    <li>• 在公共仓库中提交密钥</li>
                    <li>• 在不安全的环境中使用服务密钥</li>
                    <li>• 忽略 RLS 策略的配置</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <Button
              variant="cyber"
              size="lg"
              onClick={() => onPageChange('docs')}
              className="mr-4"
            >
              查看 API 文档
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onPageChange('testing')}
            >
              在线测试 API
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-cyber-light mb-4">
              快速开始
            </h2>
            <p className="text-lg text-cyber-gray max-w-2xl mx-auto">
              按照以下步骤，快速开始使用 Supabase API
            </p>
          </div>

          <div className="space-y-8">
            {quickStartSteps.map((step, index) => (
              <div key={index} className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex-shrink-0 lg:w-1/3">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-neon-green text-dark-bg rounded-full flex items-center justify-center font-bold mr-3">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-semibold text-cyber-light">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-cyber-gray leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="flex-1 lg:w-2/3">
                  <CodeBlock code={step.code} language="javascript" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="cyber"
              size="lg"
              onClick={() => onPageChange('docs')}
            >
              查看完整文档
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}