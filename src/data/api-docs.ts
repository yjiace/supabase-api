export interface ApiEndpoint {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'WebSocket'
  path: string
  description: string
  parameters?: Parameter[]
  requestBody?: RequestBody
  responses: Response[]
  examples: Example[]
}

export interface Parameter {
  name: string
  type: string
  required: boolean
  description: string
  example?: string
}

export interface RequestBody {
  type: string
  description: string
  schema: any
  example: any
}

export interface Response {
  status: number
  description: string
  schema?: any
  example?: any
}

export interface Example {
  title: string
  description: string
  request: string
  response: string
}

export interface ApiCategory {
  id: string
  name: string
  description: string
  endpoints: ApiEndpoint[]
}

export const apiCategories: ApiCategory[] = [
  {
    id: 'auth',
    name: '身份认证',
    description: '用户注册、登录、登出等认证相关接口',
    endpoints: [
      {
        id: 'auth-signup',
        name: '用户注册',
        method: 'POST',
        path: '/auth/v1/signup',
        description: '创建新用户账户',
        requestBody: {
          type: 'application/json',
          description: '用户注册信息',
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string', minLength: 6 }
            }
          },
          example: {
            email: 'user@example.com',
            password: 'password123'
          }
        },
        responses: [
          {
            status: 200,
            description: '注册成功',
            example: {
              user: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                email: 'user@example.com',
                created_at: '2023-01-01T00:00:00.000Z'
              },
              session: {
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                expires_in: 3600
              }
            }
          },
          {
            status: 400,
            description: '请求参数错误',
            example: {
              error: 'Invalid email format'
            }
          }
        ],
        examples: [
          {
            title: '基本注册',
            description: '使用邮箱和密码注册新用户',
            request: `curl -X POST 'https://your-project.supabase.co/auth/v1/signup' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "email": "user@example.com",
  "password": "password123"
}'`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "created_at": "2023-01-01T00:00:00.000Z"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
  }
}`
          }
        ]
      },
      {
        id: 'auth-signin',
        name: '用户登录',
        method: 'POST',
        path: '/auth/v1/token?grant_type=password',
        description: '用户登录获取访问令牌',
        requestBody: {
          type: 'application/json',
          description: '登录凭据',
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string' }
            }
          },
          example: {
            email: 'user@example.com',
            password: 'password123'
          }
        },
        responses: [
          {
            status: 200,
            description: '登录成功',
            example: {
              access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              expires_in: 3600,
              user: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                email: 'user@example.com'
              }
            }
          }
        ],
        examples: [
          {
            title: '邮箱密码登录',
            description: '使用邮箱和密码登录',
            request: `curl -X POST 'https://your-project.supabase.co/auth/v1/token?grant_type=password' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "email": "user@example.com",
  "password": "password123"
}'`,
            response: `{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com"
  }
}`
          }
        ]
      }
    ]
  },
  {
    id: 'database',
    name: '数据库操作',
    description: '数据的增删改查操作',
    endpoints: [
      {
        id: 'db-select',
        name: '查询数据',
        method: 'GET',
        path: '/rest/v1/{table}',
        description: '从指定表中查询数据',
        parameters: [
          {
            name: 'table',
            type: 'string',
            required: true,
            description: '表名',
            example: 'users'
          },
          {
            name: 'select',
            type: 'string',
            required: false,
            description: '要查询的字段，用逗号分隔',
            example: 'id,name,email'
          },
          {
            name: 'limit',
            type: 'integer',
            required: false,
            description: '限制返回的记录数',
            example: '10'
          },
          {
            name: 'offset',
            type: 'integer',
            required: false,
            description: '跳过的记录数',
            example: '0'
          }
        ],
        responses: [
          {
            status: 200,
            description: '查询成功',
            example: [
              {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                created_at: '2023-01-01T00:00:00.000Z'
              },
              {
                id: 2,
                name: 'Jane Smith',
                email: 'jane@example.com',
                created_at: '2023-01-02T00:00:00.000Z'
              }
            ]
          }
        ],
        examples: [
          {
            title: '查询所有用户',
            description: '获取用户表中的所有记录',
            request: `curl -X GET 'https://your-project.supabase.co/rest/v1/users' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2023-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "created_at": "2023-01-02T00:00:00.000Z"
  }
]`
          }
        ]
      },
      {
        id: 'db-insert',
        name: '插入数据',
        method: 'POST',
        path: '/rest/v1/{table}',
        description: '向指定表中插入新数据',
        parameters: [
          {
            name: 'table',
            type: 'string',
            required: true,
            description: '表名',
            example: 'users'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '要插入的数据',
          schema: {
            type: 'object'
          },
          example: {
            name: 'New User',
            email: 'newuser@example.com'
          }
        },
        responses: [
          {
            status: 201,
            description: '插入成功',
            example: [
              {
                id: 3,
                name: 'New User',
                email: 'newuser@example.com',
                created_at: '2023-01-03T00:00:00.000Z'
              }
            ]
          }
        ],
        examples: [
          {
            title: '创建新用户',
            description: '在用户表中插入新记录',
            request: `curl -X POST 'https://your-project.supabase.co/rest/v1/users' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
-H 'Content-Type: application/json' \\
-d '{
  "name": "New User",
  "email": "newuser@example.com"
}'`,
            response: `[
  {
    "id": 3,
    "name": "New User",
    "email": "newuser@example.com",
    "created_at": "2023-01-03T00:00:00.000Z"
  }
]`
          }
        ]
      }
    ]
  },
  {
    id: 'storage',
    name: '文件存储',
    description: '文件上传、下载和管理',
    endpoints: [
      {
        id: 'storage-upload',
        name: '上传文件',
        method: 'POST',
        path: '/storage/v1/object/{bucket}/{path}',
        description: '上传文件到指定存储桶',
        parameters: [
          {
            name: 'bucket',
            type: 'string',
            required: true,
            description: '存储桶名称',
            example: 'avatars'
          },
          {
            name: 'path',
            type: 'string',
            required: true,
            description: '文件路径',
            example: 'user1/avatar.jpg'
          }
        ],
        requestBody: {
          type: 'multipart/form-data',
          description: '要上传的文件',
          schema: {
            type: 'object',
            properties: {
              file: { type: 'string', format: 'binary' }
            }
          },
          example: 'Binary file data'
        },
        responses: [
          {
            status: 200,
            description: '上传成功',
            example: {
              Key: 'avatars/user1/avatar.jpg',
              Id: '123e4567-e89b-12d3-a456-426614174000'
            }
          }
        ],
        examples: [
          {
            title: '上传头像',
            description: '上传用户头像到avatars存储桶',
            request: `curl -X POST 'https://your-project.supabase.co/storage/v1/object/avatars/user1/avatar.jpg' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
-H 'Content-Type: image/jpeg' \\
--data-binary @avatar.jpg`,
            response: `{
  "Key": "avatars/user1/avatar.jpg",
  "Id": "123e4567-e89b-12d3-a456-426614174000"
}`
          }
        ]
      }
    ]
  },
  {
    id: 'realtime',
    name: '实时订阅',
    description: '实时数据变化监听',
    endpoints: [
      {
        id: 'realtime-subscribe',
        name: '订阅数据变化',
        method: 'WebSocket',
        path: '/realtime/v1/websocket',
        description: '通过WebSocket订阅数据库表的实时变化',
        parameters: [
          {
            name: 'table',
            type: 'string',
            required: true,
            description: '要订阅的表名',
            example: 'messages'
          },
          {
            name: 'event',
            type: 'string',
            required: false,
            description: '要监听的事件类型：INSERT, UPDATE, DELETE, *',
            example: '*'
          }
        ],
        responses: [
          {
            status: 200,
            description: '连接成功，开始接收实时数据',
            example: {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              commit_timestamp: '2023-01-01T00:00:00.000Z',
              new: {
                id: 1,
                content: 'Hello World',
                user_id: 123,
                created_at: '2023-01-01T00:00:00.000Z'
              }
            }
          }
        ],
        examples: [
          {
            title: 'JavaScript订阅示例',
            description: '使用Supabase客户端订阅消息表变化',
            request: `import { createClient } from '@supabase/supabase-js'

const supabase = createClient(supabaseUrl, supabaseKey)

const subscription = supabase
  .channel('messages')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'messages'
  }, (payload) => {
    console.log('Change received!', payload)
  })
  .subscribe()`,
            response: `// 当有新消息插入时收到：
{
  "event": "INSERT",
  "schema": "public",
  "table": "messages",
  "commit_timestamp": "2023-01-01T00:00:00.000Z",
  "new": {
    "id": 1,
    "content": "Hello World",
    "user_id": 123,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}`
          }
        ]
      }
    ]
  }
]