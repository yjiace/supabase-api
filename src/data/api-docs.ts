export interface ApiEndpoint {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'WebSocket'
  path: string
  description: string
  officialDocs?: string // 官方文档链接
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
  officialDocs?: string // 分类官方文档链接
  endpoints: ApiEndpoint[]
}

export const apiCategories: ApiCategory[] = [
  {
    id: 'database',
    name: '数据库操作',
    description: 'PostgREST API - 数据的增删改查操作',
    officialDocs: 'https://supabase.com/docs/guides/api/rest/introduction',
    endpoints: [
      {
        id: 'db-select',
        name: '查询数据',
        method: 'GET',
        path: '/rest/v1/{table}',
        description: '从指定表中查询数据',
        officialDocs: 'https://supabase.com/docs/guides/api/rest/reading-data',
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
          },
          {
            name: 'order',
            type: 'string',
            required: false,
            description: '排序字段和方向',
            example: 'created_at.desc'
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
              }
            ]
          }
        ],
        examples: [
          {
            title: '基础查询',
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
        officialDocs: 'https://supabase.com/docs/guides/api/rest/creating-data',
        parameters: [
          {
            name: 'table',
            type: 'string',
            required: true,
            description: '表名',
            example: 'users'
          },
          {
            name: 'Prefer',
            type: 'string',
            required: false,
            description: '返回偏好设置：return=minimal|representation',
            example: 'return=representation'
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
            title: '插入新用户',
            description: '在用户表中插入新记录',
            request: `curl -X POST 'https://your-project.supabase.co/rest/v1/users' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
-H 'Content-Type: application/json' \\
-H 'Prefer: return=representation' \\
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
      },
      {
        id: 'db-update',
        name: '更新数据',
        method: 'PATCH',
        path: '/rest/v1/{table}',
        description: '更新指定表中的数据',
        officialDocs: 'https://supabase.com/docs/guides/api/rest/updating-data',
        parameters: [
          {
            name: 'table',
            type: 'string',
            required: true,
            description: '表名',
            example: 'users'
          },
          {
            name: 'id',
            type: 'string',
            required: false,
            description: 'ID过滤条件，格式：id=eq.值',
            example: 'id=eq.1'
          },
          {
            name: 'Prefer',
            type: 'string',
            required: false,
            description: '返回偏好设置：return=minimal|representation',
            example: 'return=representation'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '要更新的数据',
          schema: {
            type: 'object'
          },
          example: {
            name: 'Updated Name',
            email: 'updated@example.com'
          }
        },
        responses: [
          {
            status: 200,
            description: '更新成功',
            example: [
              {
                id: 1,
                name: 'Updated Name',
                email: 'updated@example.com',
                created_at: '2023-01-01T00:00:00.000Z'
              }
            ]
          }
        ],
        examples: [
          {
            title: '更新用户信息',
            description: '更新指定ID的用户信息',
            request: `curl -X PATCH 'https://your-project.supabase.co/rest/v1/users?id=eq.1' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
-H 'Content-Type: application/json' \\
-H 'Prefer: return=representation' \\
-d '{
  "name": "Updated Name",
  "email": "updated@example.com"
}'`,
            response: `[
  {
    "id": 1,
    "name": "Updated Name",
    "email": "updated@example.com",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
]`
          }
        ]
      },
      {
        id: 'db-delete',
        name: '删除数据',
        method: 'DELETE',
        path: '/rest/v1/{table}',
        description: '删除指定表中的数据',
        officialDocs: 'https://supabase.com/docs/guides/api/rest/deleting-data',
        parameters: [
          {
            name: 'table',
            type: 'string',
            required: true,
            description: '表名',
            example: 'users'
          },
          {
            name: 'id',
            type: 'string',
            required: false,
            description: 'ID过滤条件，格式：id=eq.值',
            example: 'id=eq.1'
          }
        ],
        responses: [
          {
            status: 200,
            description: '删除成功',
            example: []
          }
        ],
        examples: [
          {
            title: '删除用户',
            description: '删除指定ID的用户',
            request: `curl -X DELETE 'https://your-project.supabase.co/rest/v1/users?id=eq.1' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[]`
          }
        ]
      },
      {
        id: 'db-upsert',
        name: '插入或更新',
        method: 'POST',
        path: '/rest/v1/{table}',
        description: '插入新数据或更新已存在的数据',
        officialDocs: 'https://supabase.com/docs/guides/api/rest/upsert',
        parameters: [
          {
            name: 'table',
            type: 'string',
            required: true,
            description: '表名',
            example: 'users'
          },
          {
            name: 'Prefer',
            type: 'string',
            required: true,
            description: '必须设置为 resolution=merge-duplicates',
            example: 'resolution=merge-duplicates'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '要插入或更新的数据',
          schema: {
            type: 'object'
          },
          example: {
            id: 1,
            name: 'John Updated',
            email: 'john.updated@example.com'
          }
        },
        responses: [
          {
            status: 201,
            description: '插入或更新成功',
            example: [
              {
                id: 1,
                name: 'John Updated',
                email: 'john.updated@example.com',
                created_at: '2023-01-01T00:00:00.000Z'
              }
            ]
          }
        ],
        examples: [
          {
            title: 'Upsert用户数据',
            description: '插入新用户或更新已存在的用户',
            request: `curl -X POST 'https://your-project.supabase.co/rest/v1/users' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
-H 'Content-Type: application/json' \\
-H 'Prefer: resolution=merge-duplicates,return=representation' \\
-d '{
  "id": 1,
  "name": "John Updated",
  "email": "john.updated@example.com"
}'`,
            response: `[
  {
    "id": 1,
    "name": "John Updated",
    "email": "john.updated@example.com",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
]`
          }
        ]
      },
      {
        id: 'db-rpc',
        name: '调用存储过程',
        method: 'POST',
        path: '/rest/v1/rpc/{function_name}',
        description: '调用数据库中的存储过程或函数',
        officialDocs: 'https://supabase.com/docs/guides/api/rest/rpc',
        parameters: [
          {
            name: 'function_name',
            type: 'string',
            required: true,
            description: '函数名称',
            example: 'hello_world'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '函数参数',
          schema: {
            type: 'object'
          },
          example: {
            name: 'World'
          }
        },
        responses: [
          {
            status: 200,
            description: '调用成功',
            example: 'Hello World!'
          }
        ],
        examples: [
          {
            title: '调用Hello World函数',
            description: '调用简单的问候函数',
            request: `curl -X POST 'https://your-project.supabase.co/rest/v1/rpc/hello_world' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
-H 'Content-Type: application/json' \\
-d '{
  "name": "World"
}'`,
            response: `"Hello World!"`
          }
        ]
      },
      {
        id: 'db-head',
        name: '获取表头信息',
        method: 'HEAD',
        path: '/rest/v1/{table}',
        description: '获取表的元数据信息，不返回数据内容',
        officialDocs: 'https://postgrest.org/en/stable/references/api/tables_views.html#head',
        parameters: [
          {
            name: 'table',
            type: 'string',
            required: true,
            description: '表名',
            example: 'users'
          }
        ],
        responses: [
          {
            status: 200,
            description: '表头信息获取成功',
            example: 'Headers only, no body content'
          }
        ],
        examples: [
          {
            title: '获取表元数据',
            description: '检查表是否存在并获取基本信息',
            request: `curl -I 'https://your-project.supabase.co/rest/v1/users' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `HTTP/1.1 200 OK
Content-Range: 0-*/100
Content-Type: application/json`
          }
        ]
      },
      {
        id: 'db-options',
        name: '获取允许的HTTP方法',
        method: 'OPTIONS',
        path: '/rest/v1/{table}',
        description: '获取表支持的HTTP方法',
        officialDocs: 'https://postgrest.org/en/stable/references/api/tables_views.html#options',
        parameters: [
          {
            name: 'table',
            type: 'string',
            required: true,
            description: '表名',
            example: 'users'
          }
        ],
        responses: [
          {
            status: 200,
            description: '支持的方法列表',
            example: {
              allow: 'GET, POST, PATCH, DELETE, OPTIONS'
            }
          }
        ],
        examples: [
          {
            title: '检查表支持的操作',
            description: '获取表允许的HTTP方法',
            request: `curl -X OPTIONS 'https://your-project.supabase.co/rest/v1/users' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY'`,
            response: `{
  "allow": "GET, POST, PATCH, DELETE, OPTIONS, HEAD"
}`
          }
        ]
      },
      {
        id: 'db-openapi',
        name: '获取OpenAPI规范',
        method: 'GET',
        path: '/rest/v1/',
        description: '获取数据库的完整OpenAPI规范文档',
        officialDocs: 'https://postgrest.org/en/stable/references/api/openapi.html',
        responses: [
          {
            status: 200,
            description: 'OpenAPI规范文档',
            example: {
              openapi: '3.0.0',
              info: {
                title: 'PostgREST API',
                version: '1.0.0'
              }
            }
          }
        ],
        examples: [
          {
            title: '获取API规范文档',
            description: '获取完整的OpenAPI 3.0规范',
            request: `curl -X GET 'https://your-project.supabase.co/rest/v1/' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Accept: application/openapi+json'`,
            response: `{
  "openapi": "3.0.0",
  "info": {
    "title": "PostgREST API",
    "version": "1.0.0",
    "description": "Auto-generated API from PostgreSQL schema"
  },
  "paths": {
    "/users": {
      "get": {...},
      "post": {...}
    }
  }
}`
          }
        ]
      }
    ]
  },
  {
    id: 'auth',
    name: '身份认证',
    description: 'GoTrue Auth API - 用户注册、登录、登出等认证相关接口',
    officialDocs: 'https://supabase.com/docs/guides/auth',
    endpoints: [
      {
        id: 'auth-signup',
        name: '用户注册',
        method: 'POST',
        path: '/auth/v1/signup',
        description: '创建新用户账户',
        officialDocs: 'https://supabase.com/docs/guides/auth/auth-signup',
        requestBody: {
          type: 'application/json',
          description: '用户注册信息',
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string', minLength: 6 },
              data: { type: 'object', description: '用户元数据' }
            }
          },
          example: {
            email: 'user@example.com',
            password: 'password123',
            data: { name: 'John Doe' }
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
          }
        ],
        examples: [
          {
            title: '用户注册',
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
        officialDocs: 'https://supabase.com/docs/guides/auth/auth-signin',
        requestBody: {
          type: 'application/json',
          description: '登录凭据',
          schema: {
            type: 'object',
            required: ['email', 'password'],
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
      },
      {
        id: 'auth-signout',
        name: '用户登出',
        method: 'POST',
        path: '/auth/v1/logout',
        description: '用户登出并撤销访问令牌',
        officialDocs: 'https://supabase.com/docs/guides/auth/auth-signout',
        responses: [
          {
            status: 204,
            description: '登出成功'
          }
        ],
        examples: [
          {
            title: '用户登出',
            description: '撤销当前用户的访问令牌',
            request: `curl -X POST 'https://your-project.supabase.co/auth/v1/logout' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `// 204 No Content`
          }
        ]
      },
      {
        id: 'auth-refresh',
        name: '刷新令牌',
        method: 'POST',
        path: '/auth/v1/token?grant_type=refresh_token',
        description: '使用刷新令牌获取新的访问令牌',
        officialDocs: 'https://supabase.com/docs/guides/auth/auth-refresh',
        requestBody: {
          type: 'application/json',
          description: '刷新令牌',
          schema: {
            type: 'object',
            properties: {
              refresh_token: { type: 'string' }
            }
          },
          example: {
            refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
          }
        },
        responses: [
          {
            status: 200,
            description: '刷新成功',
            example: {
              access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              expires_in: 3600
            }
          }
        ],
        examples: [
          {
            title: '刷新访问令牌',
            description: '使用刷新令牌获取新的访问令牌',
            request: `curl -X POST 'https://your-project.supabase.co/auth/v1/token?grant_type=refresh_token' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}'`,
            response: `{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}`
          }
        ]
      },
      {
        id: 'auth-user',
        name: '获取用户信息',
        method: 'GET',
        path: '/auth/v1/user',
        description: '获取当前登录用户的信息',
        officialDocs: 'https://supabase.com/docs/guides/auth/auth-user',
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              id: '123e4567-e89b-12d3-a456-426614174000',
              email: 'user@example.com',
              created_at: '2023-01-01T00:00:00.000Z',
              user_metadata: {
                name: 'John Doe'
              }
            }
          }
        ],
        examples: [
          {
            title: '获取用户信息',
            description: '获取当前登录用户的详细信息',
            request: `curl -X GET 'https://your-project.supabase.co/auth/v1/user' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "created_at": "2023-01-01T00:00:00.000Z",
  "user_metadata": {
    "name": "John Doe"
  }
}`
          }
        ]
      },
      {
        id: 'auth-update-user',
        name: '更新用户信息',
        method: 'PUT',
        path: '/auth/v1/user',
        description: '更新当前登录用户的信息',
        officialDocs: 'https://supabase.com/docs/guides/auth/auth-update-user',
        requestBody: {
          type: 'application/json',
          description: '要更新的用户信息',
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string' },
              data: { type: 'object' }
            }
          },
          example: {
            data: {
              name: 'Jane Doe',
              avatar_url: 'https://example.com/avatar.jpg'
            }
          }
        },
        responses: [
          {
            status: 200,
            description: '更新成功',
            example: {
              id: '123e4567-e89b-12d3-a456-426614174000',
              email: 'user@example.com',
              user_metadata: {
                name: 'Jane Doe',
                avatar_url: 'https://example.com/avatar.jpg'
              }
            }
          }
        ],
        examples: [
          {
            title: '更新用户元数据',
            description: '更新用户的自定义数据',
            request: `curl -X PUT 'https://your-project.supabase.co/auth/v1/user' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
-H 'Content-Type: application/json' \\
-d '{
  "data": {
    "name": "Jane Doe",
    "avatar_url": "https://example.com/avatar.jpg"
  }
}'`,
            response: `{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "user_metadata": {
    "name": "Jane Doe",
    "avatar_url": "https://example.com/avatar.jpg"
  }
}`
          }
        ]
      },
      {
        id: 'auth-reset-password',
        name: '重置密码',
        method: 'POST',
        path: '/auth/v1/recover',
        description: '发送密码重置邮件',
        officialDocs: 'https://supabase.com/docs/guides/auth/auth-password-reset',
        requestBody: {
          type: 'application/json',
          description: '用户邮箱',
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' }
            }
          },
          example: {
            email: 'user@example.com'
          }
        },
        responses: [
          {
            status: 200,
            description: '重置邮件已发送'
          }
        ],
        examples: [
          {
            title: '发送密码重置邮件',
            description: '向用户邮箱发送密码重置链接',
            request: `curl -X POST 'https://your-project.supabase.co/auth/v1/recover' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "email": "user@example.com"
}'`,
            response: `{}`
          }
        ]
      },
      {
        id: 'auth-oauth',
        name: 'OAuth登录',
        method: 'GET',
        path: '/auth/v1/authorize',
        description: '通过第三方OAuth提供商登录',
        officialDocs: 'https://supabase.com/docs/guides/auth/social-login',
        parameters: [
          {
            name: 'provider',
            type: 'string',
            required: true,
            description: 'OAuth提供商：google, github, facebook, apple等',
            example: 'google'
          },
          {
            name: 'redirect_to',
            type: 'string',
            required: false,
            description: '登录成功后的重定向URL',
            example: 'https://yourapp.com/dashboard'
          }
        ],
        responses: [
          {
            status: 302,
            description: '重定向到OAuth提供商'
          }
        ],
        examples: [
          {
            title: 'Google OAuth登录',
            description: '使用Google账号登录',
            request: `curl -X GET 'https://your-project.supabase.co/auth/v1/authorize?provider=google&redirect_to=https://yourapp.com/dashboard' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY'`,
            response: `// 302 重定向到 Google OAuth 页面`
          }
        ]
      },
      {
        id: 'auth-magic-link',
        name: '魔法链接登录',
        method: 'POST',
        path: '/auth/v1/magiclink',
        description: '发送无密码登录的魔法链接',
        officialDocs: 'https://supabase.com/docs/guides/auth/auth-magic-link',
        requestBody: {
          type: 'application/json',
          description: '用户邮箱',
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' }
            }
          },
          example: {
            email: 'user@example.com'
          }
        },
        responses: [
          {
            status: 200,
            description: '魔法链接已发送'
          }
        ],
        examples: [
          {
            title: '发送魔法链接',
            description: '向用户邮箱发送无密码登录链接',
            request: `curl -X POST 'https://your-project.supabase.co/auth/v1/magiclink' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "email": "user@example.com"
}'`,
            response: `{}`
          }
        ]
      },
      {
        id: 'auth-verify-otp',
        name: '验证OTP',
        method: 'POST',
        path: '/auth/v1/verify',
        description: '验证一次性密码或令牌',
        officialDocs: 'https://supabase.com/docs/guides/auth/auth-otp',
        requestBody: {
          type: 'application/json',
          description: 'OTP验证信息',
          schema: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['signup', 'magiclink', 'recovery', 'invite'] },
              token: { type: 'string' },
              email: { type: 'string', format: 'email' }
            }
          },
          example: {
            type: 'magiclink',
            token: '123456',
            email: 'user@example.com'
          }
        },
        responses: [
          {
            status: 200,
            description: '验证成功',
            example: {
              access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              user: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                email: 'user@example.com'
              }
            }
          }
        ],
        examples: [
          {
            title: '验证魔法链接令牌',
            description: '验证用户点击魔法链接后的令牌',
            request: `curl -X POST 'https://your-project.supabase.co/auth/v1/verify' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "type": "magiclink",
  "token": "123456",
  "email": "user@example.com"
}'`,
            response: `{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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
    id: 'storage',
    name: '文件存储',
    description: 'Supabase Storage API - 文件上传、下载和管理',
    officialDocs: 'https://supabase.com/docs/guides/storage',
    endpoints: [
      {
        id: 'storage-upload',
        name: '上传文件',
        method: 'POST',
        path: '/storage/v1/object/{bucket}/{path}',
        description: '上传文件到指定存储桶',
        officialDocs: 'https://supabase.com/docs/guides/storage/uploads',
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
          },
          {
            name: 'upsert',
            type: 'boolean',
            required: false,
            description: '是否覆盖已存在的文件',
            example: 'true'
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
      },
      {
        id: 'storage-download',
        name: '下载文件',
        method: 'GET',
        path: '/storage/v1/object/{bucket}/{path}',
        description: '从存储桶下载文件',
        officialDocs: 'https://supabase.com/docs/guides/storage/downloads',
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
        responses: [
          {
            status: 200,
            description: '下载成功，返回文件二进制数据'
          }
        ],
        examples: [
          {
            title: '下载头像',
            description: '从avatars存储桶下载用户头像',
            request: `curl -X GET 'https://your-project.supabase.co/storage/v1/object/avatars/user1/avatar.jpg' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `// 返回文件的二进制数据`
          }
        ]
      },
      {
        id: 'storage-delete',
        name: '删除文件',
        method: 'DELETE',
        path: '/storage/v1/object/{bucket}/{path}',
        description: '从存储桶删除文件',
        officialDocs: 'https://supabase.com/docs/guides/storage/deleting',
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
        responses: [
          {
            status: 200,
            description: '删除成功',
            example: {
              message: 'Successfully deleted'
            }
          }
        ],
        examples: [
          {
            title: '删除头像',
            description: '从avatars存储桶删除用户头像',
            request: `curl -X DELETE 'https://your-project.supabase.co/storage/v1/object/avatars/user1/avatar.jpg' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "message": "Successfully deleted"
}`
          }
        ]
      },
      {
        id: 'storage-list',
        name: '列出文件',
        method: 'POST',
        path: '/storage/v1/object/list/{bucket}',
        description: '列出存储桶中的文件',
        officialDocs: 'https://supabase.com/docs/guides/storage/list',
        parameters: [
          {
            name: 'bucket',
            type: 'string',
            required: true,
            description: '存储桶名称',
            example: 'avatars'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '列表选项',
          schema: {
            type: 'object',
            required: ['prefix'],
            properties: {
              prefix: { type: 'string', description: '文件路径前缀' },
              limit: { type: 'integer' },
              offset: { type: 'integer' },
              sortBy: { type: 'object' }
            }
          },
          example: {
            prefix: '',
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' }
          }
        },
        responses: [
          {
            status: 200,
            description: '列表获取成功',
            example: [
              {
                name: 'user1/avatar.jpg',
                id: '123e4567-e89b-12d3-a456-426614174000',
                updated_at: '2023-01-01T00:00:00.000Z',
                created_at: '2023-01-01T00:00:00.000Z',
                metadata: {
                  eTag: '"abc123"',
                  size: 1024,
                  mimetype: 'image/jpeg'
                }
              }
            ]
          }
        ],
        examples: [
          {
            title: '列出头像文件',
            description: '获取avatars存储桶中的所有文件',
            request: `curl -X POST 'https://your-project.supabase.co/storage/v1/object/list/avatars' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
-H 'Content-Type: application/json' \\
-d '{
  "prefix": "",
  "limit": 100,
  "offset": 0,
  "sortBy": {"column": "name", "order": "asc"}
}'`,
            response: `[
  {
    "name": "user1/avatar.jpg",
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "updated_at": "2023-01-01T00:00:00.000Z",
    "created_at": "2023-01-01T00:00:00.000Z",
    "metadata": {
      "eTag": "\\"abc123\\"",
      "size": 1024,
      "mimetype": "image/jpeg"
    }
  }
]`
          }
        ]
      },
      {
        id: 'storage-move',
        name: '移动文件',
        method: 'POST',
        path: '/storage/v1/object/move',
        description: '移动或重命名文件',
        officialDocs: 'https://supabase.com/docs/guides/storage/move',
        requestBody: {
          type: 'application/json',
          description: '移动操作参数',
          schema: {
            type: 'object',
            properties: {
              bucketId: { type: 'string' },
              sourceKey: { type: 'string' },
              destinationKey: { type: 'string' }
            }
          },
          example: {
            bucketId: 'avatars',
            sourceKey: 'user1/old_avatar.jpg',
            destinationKey: 'user1/new_avatar.jpg'
          }
        },
        responses: [
          {
            status: 200,
            description: '移动成功',
            example: {
              message: 'Successfully moved'
            }
          }
        ],
        examples: [
          {
            title: '重命名头像文件',
            description: '将头像文件重命名',
            request: `curl -X POST 'https://your-project.supabase.co/storage/v1/object/move' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
-H 'Content-Type: application/json' \\
-d '{
  "bucketId": "avatars",
  "sourceKey": "user1/old_avatar.jpg",
  "destinationKey": "user1/new_avatar.jpg"
}'`,
            response: `{
  "message": "Successfully moved"
}`
          }
        ]
      },
      {
        id: 'storage-copy',
        name: '复制文件',
        method: 'POST',
        path: '/storage/v1/object/copy',
        description: '复制文件到新位置',
        officialDocs: 'https://supabase.com/docs/guides/storage/copy',
        requestBody: {
          type: 'application/json',
          description: '复制操作参数',
          schema: {
            type: 'object',
            properties: {
              bucketId: { type: 'string' },
              sourceKey: { type: 'string' },
              destinationKey: { type: 'string' }
            }
          },
          example: {
            bucketId: 'avatars',
            sourceKey: 'user1/avatar.jpg',
            destinationKey: 'user1/avatar_backup.jpg'
          }
        },
        responses: [
          {
            status: 200,
            description: '复制成功',
            example: {
              Key: 'avatars/user1/avatar_backup.jpg'
            }
          }
        ],
        examples: [
          {
            title: '备份头像文件',
            description: '创建头像文件的备份副本',
            request: `curl -X POST 'https://your-project.supabase.co/storage/v1/object/copy' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
-H 'Content-Type: application/json' \\
-d '{
  "bucketId": "avatars",
  "sourceKey": "user1/avatar.jpg",
  "destinationKey": "user1/avatar_backup.jpg"
}'`,
            response: `{
  "Key": "avatars/user1/avatar_backup.jpg"
}`
          }
        ]
      },
      {
        id: 'storage-create-signed-url',
        name: '创建签名URL',
        method: 'POST',
        path: '/storage/v1/object/sign/{bucket}/{path}',
        description: '为文件创建临时访问的签名URL',
        officialDocs: 'https://supabase.com/docs/guides/storage/signed-urls',
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
          type: 'application/json',
          description: '签名URL选项',
          schema: {
            type: 'object',
            properties: {
              expiresIn: { type: 'integer', description: '过期时间（秒）' }
            }
          },
          example: {
            expiresIn: 3600
          }
        },
        responses: [
          {
            status: 200,
            description: '签名URL创建成功',
            example: {
              signedURL: 'https://your-project.supabase.co/storage/v1/object/sign/avatars/user1/avatar.jpg?token=...'
            }
          }
        ],
        examples: [
          {
            title: '创建头像访问链接',
            description: '为头像文件创建1小时有效的访问链接',
            request: `curl -X POST 'https://your-project.supabase.co/storage/v1/object/sign/avatars/user1/avatar.jpg' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
-H 'Content-Type: application/json' \\
-d '{
  "expiresIn": 3600
}'`,
            response: `{
  "signedURL": "https://your-project.supabase.co/storage/v1/object/sign/avatars/user1/avatar.jpg?token=..."
}`
          }
        ]
      },
      {
        id: 'storage-create-bucket',
        name: '创建存储桶',
        method: 'POST',
        path: '/storage/v1/bucket',
        description: '创建新的存储桶',
        officialDocs: 'https://supabase.com/docs/guides/storage/buckets',
        requestBody: {
          type: 'application/json',
          description: '存储桶配置',
          schema: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              public: { type: 'boolean' },
              file_size_limit: { type: 'integer' },
              allowed_mime_types: { type: 'array' }
            }
          },
          example: {
            id: 'documents',
            name: 'Documents',
            public: false,
            file_size_limit: 52428800,
            allowed_mime_types: ['application/pdf', 'image/*']
          }
        },
        responses: [
          {
            status: 200,
            description: '存储桶创建成功',
            example: {
              name: 'documents'
            }
          }
        ],
        examples: [
          {
            title: '创建文档存储桶',
            description: '创建用于存储文档的私有存储桶',
            request: `curl -X POST 'https://your-project.supabase.co/storage/v1/bucket' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "id": "documents",
  "name": "Documents",
  "public": false,
  "file_size_limit": 52428800,
  "allowed_mime_types": ["application/pdf", "image/*"]
}'`,
            response: `{
  "name": "documents"
}`
          }
        ]
      },
      {
        id: 'storage-list-buckets',
        name: '列出存储桶',
        method: 'GET',
        path: '/storage/v1/bucket',
        description: '获取所有存储桶列表',
        officialDocs: 'https://supabase.com/docs/guides/storage/buckets',
        responses: [
          {
            status: 200,
            description: '存储桶列表获取成功',
            example: [
              {
                id: 'avatars',
                name: 'avatars',
                public: true,
                created_at: '2023-01-01T00:00:00.000Z',
                updated_at: '2023-01-01T00:00:00.000Z'
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取存储桶列表',
            description: '列出项目中的所有存储桶',
            request: `curl -X GET 'https://your-project.supabase.co/storage/v1/bucket' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": "avatars",
    "name": "avatars",
    "public": true,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
]`
          }
        ]
      },
      {
        id: 'storage-delete-bucket',
        name: '删除存储桶',
        method: 'DELETE',
        path: '/storage/v1/bucket/{bucket_id}',
        description: '删除指定的存储桶',
        officialDocs: 'https://supabase.com/docs/guides/storage/buckets',
        parameters: [
          {
            name: 'bucket_id',
            type: 'string',
            required: true,
            description: '存储桶ID',
            example: 'documents'
          }
        ],
        responses: [
          {
            status: 200,
            description: '存储桶删除成功',
            example: {
              message: 'Successfully deleted'
            }
          }
        ],
        examples: [
          {
            title: '删除存储桶',
            description: '删除指定的存储桶及其所有文件',
            request: `curl -X DELETE 'https://your-project.supabase.co/storage/v1/bucket/documents' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY'`,
            response: `{
  "message": "Successfully deleted"
}`
          }
        ]
      },
      {
        id: 'storage-get-bucket',
        name: '获取存储桶详情',
        method: 'GET',
        path: '/storage/v1/bucket/{bucket_id}',
        description: '获取指定存储桶的详细信息',
        officialDocs: 'https://supabase.com/docs/guides/storage/buckets',
        parameters: [
          {
            name: 'bucket_id',
            type: 'string',
            required: true,
            description: '存储桶ID',
            example: 'avatars'
          }
        ],
        responses: [
          {
            status: 200,
            description: '存储桶详情获取成功',
            example: {
              id: 'avatars',
              name: 'avatars',
              public: true,
              created_at: '2023-01-01T00:00:00.000Z'
            }
          }
        ],
        examples: [
          {
            title: '获取存储桶详情',
            description: '获取指定存储桶的配置和统计信息',
            request: `curl -X GET 'https://your-project.supabase.co/storage/v1/bucket/avatars' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "id": "avatars",
  "name": "avatars", 
  "public": true,
  "file_size_limit": 52428800,
  "allowed_mime_types": ["image/jpeg", "image/png"],
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}`
          }
        ]
      },
      {
        id: 'storage-update-bucket',
        name: '更新存储桶',
        method: 'PUT',
        path: '/storage/v1/bucket/{bucket_id}',
        description: '更新存储桶配置',
        officialDocs: 'https://supabase.com/docs/guides/storage/buckets',
        parameters: [
          {
            name: 'bucket_id',
            type: 'string',
            required: true,
            description: '存储桶ID',
            example: 'avatars'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '存储桶更新参数',
          schema: {
            type: 'object',
            properties: {
              public: { type: 'boolean' },
              file_size_limit: { type: 'integer' },
              allowed_mime_types: { type: 'array' }
            }
          },
          example: {
            public: false,
            file_size_limit: 10485760,
            allowed_mime_types: ['image/jpeg', 'image/png']
          }
        },
        responses: [
          {
            status: 200,
            description: '存储桶更新成功',
            example: {
              message: 'Successfully updated'
            }
          }
        ],
        examples: [
          {
            title: '更新存储桶配置',
            description: '修改存储桶的访问权限和文件限制',
            request: `curl -X PUT 'https://your-project.supabase.co/storage/v1/bucket/avatars' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SERVICE_ROLE_TOKEN' \\
-H 'Content-Type: application/json' \\
-d '{
  "public": false,
  "file_size_limit": 10485760,
  "allowed_mime_types": ["image/jpeg", "image/png"]
}'`,
            response: `{
  "message": "Successfully updated",
  "bucket": {
    "id": "avatars",
    "public": false,
    "file_size_limit": 10485760
  }
}`
          }
        ]
      }
    ]
  },
  {
    id: 'edge-functions',
    name: '边缘函数',
    description: 'Supabase Edge Functions - Serverless函数调用',
    officialDocs: 'https://supabase.com/docs/guides/functions',
    endpoints: [
      {
        id: 'edge-function-invoke',
        name: '调用边缘函数',
        method: 'POST',
        path: '/functions/v1/{function_name}',
        description: '调用部署的边缘函数',
        officialDocs: 'https://supabase.com/docs/guides/functions/invoke',
        parameters: [
          {
            name: 'function_name',
            type: 'string',
            required: true,
            description: '函数名称',
            example: 'hello-world'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '函数参数',
          schema: {
            type: 'object'
          },
          example: {
            name: 'World',
            message: 'Hello from client'
          }
        },
        responses: [
          {
            status: 200,
            description: '函数执行成功',
            example: {
              message: 'Hello World!',
              timestamp: '2023-01-01T00:00:00.000Z'
            }
          }
        ],
        examples: [
          {
            title: '调用Hello World函数',
            description: '调用简单的问候函数',
            request: `curl -X POST 'https://your-project.supabase.co/functions/v1/hello-world' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
-H 'Content-Type: application/json' \\
-d '{
  "name": "World",
  "message": "Hello from client"
}'`,
            response: `{
  "message": "Hello World!",
  "timestamp": "2023-01-01T00:00:00.000Z"
}`
          }
        ]
      }
    ]
  },
  {
    id: 'realtime',
    name: '实时订阅',
    description: 'Supabase Realtime - WebSocket实时数据订阅',
    officialDocs: 'https://supabase.com/docs/guides/realtime',
    endpoints: [
      {
        id: 'realtime-websocket',
        name: 'WebSocket连接',
        method: 'WebSocket',
        path: '/realtime/v1/websocket',
        description: '建立WebSocket连接进行实时数据订阅',
        officialDocs: 'https://supabase.com/docs/guides/realtime/quickstart',
        parameters: [
          {
            name: 'apikey',
            type: 'string',
            required: true,
            description: 'Supabase API密钥',
            example: 'YOUR_SUPABASE_ANON_KEY'
          },
          {
            name: 'vsn',
            type: 'string',
            required: true,
            description: '协议版本',
            example: '1.0.0'
          }
        ],
        responses: [
          {
            status: 101,
            description: 'WebSocket连接建立成功'
          }
        ],
        examples: [
          {
            title: '建立WebSocket连接',
            description: '连接到Supabase实时服务',
            request: `// JavaScript WebSocket连接示例
const socket = new WebSocket(
  'wss://your-project.supabase.co/realtime/v1/websocket?apikey=YOUR_SUPABASE_ANON_KEY&vsn=1.0.0'
)

socket.onopen = () => {
  console.log('WebSocket连接已建立')
}`,
            response: `// WebSocket连接成功建立`
          }
        ]
      },
      {
        id: 'realtime-subscribe-table',
        name: '订阅表变化',
        method: 'WebSocket',
        path: '/realtime/v1/websocket',
        description: '订阅数据库表的实时变化（INSERT、UPDATE、DELETE）',
        officialDocs: 'https://supabase.com/docs/guides/realtime/postgres-changes',
        examples: [
          {
            title: '订阅表变化',
            description: '监听users表的所有变化',
            request: `// 通过WebSocket发送订阅消息
const subscribeMessage = {
  topic: 'realtime:public:users',
  event: 'phx_join',
  payload: {
    config: {
      postgres_changes: [
        {
          event: '*',
          schema: 'public',
          table: 'users'
        }
      ]
    }
  },
  ref: '1'
}

socket.send(JSON.stringify(subscribeMessage))`,
            response: `{
  "event": "postgres_changes",
  "payload": {
    "data": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "eventType": "INSERT",
    "schema": "public",
    "table": "users",
    "commit_timestamp": "2023-01-01T00:00:00.000Z"
  }
}`
          }
        ]
      },
      {
        id: 'realtime-subscribe-broadcast',
        name: '订阅广播消息',
        method: 'WebSocket',
        path: '/realtime/v1/websocket',
        description: '订阅自定义广播消息',
        officialDocs: 'https://supabase.com/docs/guides/realtime/broadcast',
        examples: [
          {
            title: '订阅广播频道',
            description: '监听自定义广播消息',
            request: `// 订阅广播频道
const subscribeMessage = {
  topic: 'realtime:chat-room',
  event: 'phx_join',
  payload: {
    config: {
      broadcast: { self: true }
    }
  },
  ref: '1'
}

socket.send(JSON.stringify(subscribeMessage))

// 发送广播消息
const broadcastMessage = {
  topic: 'realtime:chat-room',
  event: 'broadcast',
  payload: {
    type: 'broadcast',
    event: 'message',
    payload: {
      user: 'John',
      message: 'Hello everyone!'
    }
  },
  ref: '2'
}

socket.send(JSON.stringify(broadcastMessage))`,
            response: `{
  "event": "broadcast",
  "payload": {
    "event": "message",
    "payload": {
      "user": "John",
      "message": "Hello everyone!"
    }
  }
}`
          }
        ]
      },
      {
        id: 'realtime-subscribe-presence',
        name: '订阅在线状态',
        method: 'WebSocket',
        path: '/realtime/v1/websocket',
        description: '订阅用户在线状态变化',
        officialDocs: 'https://supabase.com/docs/guides/realtime/presence',
        examples: [
          {
            title: '订阅在线状态',
            description: '监听用户上线/下线状态',
            request: `// 订阅在线状态频道
const subscribeMessage = {
  topic: 'realtime:online-users',
  event: 'phx_join',
  payload: {
    config: {
      presence: { key: 'user_id' }
    }
  },
  ref: '1'
}

socket.send(JSON.stringify(subscribeMessage))

// 跟踪用户在线状态
const trackMessage = {
  topic: 'realtime:online-users',
  event: 'presence',
  payload: {
    type: 'presence',
    event: 'track',
    payload: {
      user_id: '123',
      name: 'John Doe',
      status: 'online'
    }
  },
  ref: '2'
}

socket.send(JSON.stringify(trackMessage))`,
            response: `{
  "event": "presence_state",
  "payload": {
    "123": {
      "metas": [
        {
          "user_id": "123",
          "name": "John Doe",
          "status": "online",
          "phx_ref": "abc123"
        }
      ]
    }
  }
}`
          }
        ]
      }
    ]
  },
  {
    id: 'management',
    name: '管理API',
    description: 'Supabase Management API - 项目和资源管理',
    officialDocs: 'https://supabase.com/docs/reference/api/management-api',
    endpoints: [
      {
        id: 'mgmt-list-projects',
        name: '列出项目',
        method: 'GET',
        path: '/v1/projects',
        description: '获取用户的所有项目列表',
        officialDocs: 'https://supabase.com/docs/reference/api/management-api#list-all-projects',
        responses: [
          {
            status: 200,
            description: '项目列表获取成功',
            example: [
              {
                id: 'abc123def456',
                name: 'My Project',
                organization_id: 'org_123',
                region: 'us-east-1',
                created_at: '2023-01-01T00:00:00.000Z',
                status: 'ACTIVE_HEALTHY'
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取项目列表',
            description: '列出用户账户下的所有项目',
            request: `curl -X GET 'https://api.supabase.com/v1/projects' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": "abc123def456",
    "name": "My Project",
    "organization_id": "org_123",
    "region": "us-east-1",
    "created_at": "2023-01-01T00:00:00.000Z",
    "status": "ACTIVE_HEALTHY"
  }
]`
          }
        ]
      },
      {
        id: 'mgmt-get-project',
        name: '获取项目详情',
        method: 'GET',
        path: '/v1/projects/{project_id}',
        description: '获取指定项目的详细信息',
        officialDocs: 'https://supabase.com/docs/reference/api/management-api#retrieve-a-project',
        parameters: [
          {
            name: 'project_id',
            type: 'string',
            required: true,
            description: '项目ID',
            example: 'abc123def456'
          }
        ],
        responses: [
          {
            status: 200,
            description: '项目详情获取成功',
            example: {
              id: 'abc123def456',
              name: 'My Project',
              organization_id: 'org_123',
              region: 'us-east-1',
              database: {
                host: 'db.abc123def456.supabase.co',
                version: '15.1.0.147'
              },
              status: 'ACTIVE_HEALTHY'
            }
          }
        ],
        examples: [
          {
            title: '获取项目详情',
            description: '获取指定项目的完整信息',
            request: `curl -X GET 'https://api.supabase.com/v1/projects/abc123def456' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "id": "abc123def456",
  "name": "My Project",
  "organization_id": "org_123",
  "region": "us-east-1",
  "database": {
    "host": "db.abc123def456.supabase.co",
    "version": "15.1.0.147"
  },
  "status": "ACTIVE_HEALTHY"
}`
          }
        ]
      },
      {
        id: 'mgmt-create-project',
        name: '创建项目',
        method: 'POST',
        path: '/v1/projects',
        description: '创建新的Supabase项目',
        officialDocs: 'https://supabase.com/docs/reference/api/management-api#create-a-project',
        requestBody: {
          type: 'application/json',
          description: '项目创建参数',
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              organization_id: { type: 'string' },
              plan: { type: 'string' },
              region: { type: 'string' },
              db_pass: { type: 'string' }
            }
          },
          example: {
            name: 'New Project',
            organization_id: 'org_123',
            plan: 'free',
            region: 'us-east-1',
            db_pass: 'secure_password_123'
          }
        },
        responses: [
          {
            status: 201,
            description: '项目创建成功',
            example: {
              id: 'new123project456',
              name: 'New Project',
              organization_id: 'org_123',
              region: 'us-east-1',
              status: 'COMING_UP'
            }
          }
        ],
        examples: [
          {
            title: '创建新项目',
            description: '在指定组织下创建新的Supabase项目',
            request: `curl -X POST 'https://api.supabase.com/v1/projects' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
-H 'Content-Type: application/json' \\
-d '{
  "name": "New Project",
  "organization_id": "org_123",
  "plan": "free",
  "region": "us-east-1",
  "db_pass": "secure_password_123"
}'`,
            response: `{
  "id": "new123project456",
  "name": "New Project",
  "organization_id": "org_123",
  "region": "us-east-1",
  "status": "COMING_UP"
}`
          }
        ]
      },
      {
        id: 'mgmt-delete-project',
        name: '删除项目',
        method: 'DELETE',
        path: '/v1/projects/{project_id}',
        description: '删除指定的项目',
        officialDocs: 'https://supabase.com/docs/reference/api/management-api#delete-a-project',
        parameters: [
          {
            name: 'project_id',
            type: 'string',
            required: true,
            description: '项目ID',
            example: 'abc123def456'
          }
        ],
        responses: [
          {
            status: 200,
            description: '项目删除成功',
            example: {
              message: 'Project deleted successfully'
            }
          }
        ],
        examples: [
          {
            title: '删除项目',
            description: '永久删除指定的项目及其所有数据',
            request: `curl -X DELETE 'https://api.supabase.com/v1/projects/abc123def456' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "message": "Project deleted successfully"
}`
          }
        ]
      },
      {
        id: 'mgmt-get-project-api-keys',
        name: '获取项目API密钥',
        method: 'GET',
        path: '/v1/projects/{project_id}/api-keys',
        description: '获取项目的API密钥信息',
        officialDocs: 'https://supabase.com/docs/reference/api/management-api#get-project-api-keys',
        parameters: [
          {
            name: 'project_id',
            type: 'string',
            required: true,
            description: '项目ID',
            example: 'abc123def456'
          }
        ],
        responses: [
          {
            status: 200,
            description: 'API密钥获取成功',
            example: [
              {
                name: 'anon',
                api_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
              },
              {
                name: 'service_role',
                api_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取API密钥',
            description: '获取项目的anon和service_role密钥',
            request: `curl -X GET 'https://api.supabase.com/v1/projects/abc123def456/api-keys' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "name": "anon",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  {
    "name": "service_role", 
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
]`
          }
        ]
      },
      {
        id: 'mgmt-get-project-config',
        name: '获取项目配置',
        method: 'GET',
        path: '/v1/projects/{project_id}/config',
        description: '获取项目的配置信息',
        officialDocs: 'https://supabase.com/docs/reference/api/management-api#get-project-configuration',
        parameters: [
          {
            name: 'project_id',
            type: 'string',
            required: true,
            description: '项目ID',
            example: 'abc123def456'
          }
        ],
        responses: [
          {
            status: 200,
            description: '项目配置获取成功',
            example: {
              db_host: 'db.abc123def456.supabase.co',
              db_name: 'postgres',
              db_port: 5432,
              db_user: 'postgres',
              jwt_secret: 'your-jwt-secret',
              anon_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              service_role_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        ],
        examples: [
          {
            title: '获取项目配置',
            description: '获取项目的数据库连接和密钥配置',
            request: `curl -X GET 'https://api.supabase.com/v1/projects/abc123def456/config' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "db_host": "db.abc123def456.supabase.co",
  "db_name": "postgres",
  "db_port": 5432,
  "db_user": "postgres",
  "jwt_secret": "your-jwt-secret",
  "anon_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "service_role_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`
          }
        ]
      }
    ]
  },
  {
    id: 'advanced-database',
    name: '高级数据库操作',
    description: 'PostgREST高级功能 - 复杂查询、过滤、聚合等',
    officialDocs: 'https://postgrest.org/en/stable/references/api.html',
    endpoints: [
      {
        id: 'db-filter-operators',
        name: '过滤操作符',
        method: 'GET',
        path: '/rest/v1/{table}',
        description: '使用各种过滤操作符查询数据',
        officialDocs: 'https://supabase.com/docs/guides/api/rest/filtering',
        parameters: [
          {
            name: 'table',
            type: 'string',
            required: true,
            description: '表名',
            example: 'users'
          },
          {
            name: 'column',
            type: 'string',
            required: false,
            description: '过滤条件，支持eq、neq、gt、gte、lt、lte、like、ilike、in、is等',
            example: 'age=gte.18&name=ilike.*john*'
          }
        ],
        responses: [
          {
            status: 200,
            description: '过滤查询成功',
            example: [
              {
                id: 1,
                name: 'John Doe',
                age: 25,
                email: 'john@example.com'
              }
            ]
          }
        ],
        examples: [
          {
            title: '复杂过滤查询',
            description: '使用多种过滤操作符查询数据',
            request: `curl -X GET 'https://your-project.supabase.co/rest/v1/users?age=gte.18&name=ilike.*john*&status=in.(active,pending)' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": 1,
    "name": "John Doe",
    "age": 25,
    "email": "john@example.com",
    "status": "active"
  }
]`
          }
        ]
      },
      {
        id: 'db-join-tables',
        name: '表关联查询',
        method: 'GET',
        path: '/rest/v1/{table}',
        description: '查询关联表数据',
        officialDocs: 'https://supabase.com/docs/guides/api/rest/joins-and-nesting',
        parameters: [
          {
            name: 'table',
            type: 'string',
            required: true,
            description: '主表名',
            example: 'users'
          },
          {
            name: 'select',
            type: 'string',
            required: false,
            description: '选择字段，包括关联表字段',
            example: 'id,name,posts(id,title,content)'
          }
        ],
        responses: [
          {
            status: 200,
            description: '关联查询成功',
            example: [
              {
                id: 1,
                name: 'John Doe',
                posts: [
                  {
                    id: 1,
                    title: 'First Post',
                    content: 'Hello World'
                  }
                ]
              }
            ]
          }
        ],
        examples: [
          {
            title: '查询用户及其文章',
            description: '获取用户信息及其关联的文章数据',
            request: `curl -X GET 'https://your-project.supabase.co/rest/v1/users?select=id,name,email,posts(id,title,created_at)' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "posts": [
      {
        "id": 1,
        "title": "First Post",
        "created_at": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
]`
          }
        ]
      },
      {
        id: 'db-aggregate-functions',
        name: '聚合函数',
        method: 'GET',
        path: '/rest/v1/{table}',
        description: '使用聚合函数进行统计查询',
        officialDocs: 'https://supabase.com/docs/guides/api/rest/aggregate-functions',
        parameters: [
          {
            name: 'table',
            type: 'string',
            required: true,
            description: '表名',
            example: 'orders'
          },
          {
            name: 'select',
            type: 'string',
            required: false,
            description: '聚合函数：count、sum、avg、min、max等',
            example: 'count(),sum(amount),avg(amount)'
          }
        ],
        responses: [
          {
            status: 200,
            description: '聚合查询成功',
            example: [
              {
                count: 100,
                sum: 50000,
                avg: 500
              }
            ]
          }
        ],
        examples: [
          {
            title: '订单统计查询',
            description: '统计订单数量、总金额和平均金额',
            request: `curl -X GET 'https://your-project.supabase.co/rest/v1/orders?select=count(),sum(amount),avg(amount)' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "count": 100,
    "sum": 50000,
    "avg": 500
  }
]`
          }
        ]
      },
      {
        id: 'db-full-text-search',
        name: '全文搜索',
        method: 'GET',
        path: '/rest/v1/{table}',
        description: '使用PostgreSQL全文搜索功能',
        officialDocs: 'https://supabase.com/docs/guides/api/rest/full-text-search',
        parameters: [
          {
            name: 'table',
            type: 'string',
            required: true,
            description: '表名',
            example: 'articles'
          },
          {
            name: 'column',
            type: 'string',
            required: false,
            description: '全文搜索条件，使用fts、plfts、phfts、wfts操作符',
            example: 'title=fts.javascript&content=plfts.tutorial'
          }
        ],
        responses: [
          {
            status: 200,
            description: '全文搜索成功',
            example: [
              {
                id: 1,
                title: 'JavaScript Tutorial',
                content: 'Learn JavaScript basics...'
              }
            ]
          }
        ],
        examples: [
          {
            title: '文章全文搜索',
            description: '在文章标题和内容中搜索关键词',
            request: `curl -X GET 'https://your-project.supabase.co/rest/v1/articles?title=fts.javascript&content=plfts.tutorial' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": 1,
    "title": "JavaScript Tutorial",
    "content": "Learn JavaScript basics and advanced concepts...",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
]`
          }
        ]
      },
      {
        id: 'db-json-operations',
        name: 'JSON操作',
        method: 'GET',
        path: '/rest/v1/{table}',
        description: '对JSON/JSONB字段进行查询和操作',
        officialDocs: 'https://supabase.com/docs/guides/api/rest/json-columns',
        parameters: [
          {
            name: 'table',
            type: 'string',
            required: true,
            description: '表名',
            example: 'products'
          },
          {
            name: 'json_column',
            type: 'string',
            required: false,
            description: 'JSON字段查询，使用->、->>、@>、<@等操作符',
            example: 'metadata->color=eq.red&tags@>["electronics"]'
          }
        ],
        responses: [
          {
            status: 200,
            description: 'JSON查询成功',
            example: [
              {
                id: 1,
                name: 'Red Phone',
                metadata: { color: 'red', brand: 'Apple' },
                tags: ['electronics', 'mobile']
              }
            ]
          }
        ],
        examples: [
          {
            title: 'JSON字段查询',
            description: '查询JSON字段中的特定值',
            request: `curl -X GET 'https://your-project.supabase.co/rest/v1/products?metadata->>color=eq.red&tags@>["electronics"]' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": 1,
    "name": "Red Phone",
    "metadata": {
      "color": "red",
      "brand": "Apple"
    },
    "tags": ["electronics", "mobile"]
  }
]`
          }
        ]
      },
      {
        id: 'db-bulk-operations',
        name: '批量操作',
        method: 'POST',
        path: '/rest/v1/{table}',
        description: '批量插入、更新或删除数据',
        officialDocs: 'https://supabase.com/docs/guides/api/rest/bulk-operations',
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
          description: '批量数据数组',
          schema: {
            type: 'array',
            items: { type: 'object' }
          },
          example: [
            { name: 'User 1', email: 'user1@example.com' },
            { name: 'User 2', email: 'user2@example.com' },
            { name: 'User 3', email: 'user3@example.com' }
          ]
        },
        responses: [
          {
            status: 201,
            description: '批量操作成功',
            example: [
              { id: 1, name: 'User 1', email: 'user1@example.com' },
              { id: 2, name: 'User 2', email: 'user2@example.com' },
              { id: 3, name: 'User 3', email: 'user3@example.com' }
            ]
          }
        ],
        examples: [
          {
            title: '批量插入用户',
            description: '一次性插入多个用户记录',
            request: `curl -X POST 'https://your-project.supabase.co/rest/v1/users' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
-H 'Content-Type: application/json' \\
-H 'Prefer: return=representation' \\
-d '[
  {"name": "User 1", "email": "user1@example.com"},
  {"name": "User 2", "email": "user2@example.com"},
  {"name": "User 3", "email": "user3@example.com"}
]'`,
            response: `[
  {"id": 1, "name": "User 1", "email": "user1@example.com"},
  {"id": 2, "name": "User 2", "email": "user2@example.com"},
  {"id": 3, "name": "User 3", "email": "user3@example.com"}
]`
          }
        ]
      },
      {
        id: 'db-transactions',
        name: '事务操作',
        method: 'POST',
        path: '/rest/v1/rpc/{function_name}',
        description: '通过存储过程执行事务操作',
        officialDocs: 'https://supabase.com/docs/guides/api/rest/transactions',
        parameters: [
          {
            name: 'function_name',
            type: 'string',
            required: true,
            description: '事务函数名称',
            example: 'transfer_funds'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '事务参数',
          schema: {
            type: 'object'
          },
          example: {
            from_account: 1,
            to_account: 2,
            amount: 100
          }
        },
        responses: [
          {
            status: 200,
            description: '事务执行成功',
            example: {
              success: true,
              transaction_id: 'txn_123456'
            }
          }
        ],
        examples: [
          {
            title: '资金转账事务',
            description: '执行账户间资金转账的原子操作',
            request: `curl -X POST 'https://your-project.supabase.co/rest/v1/rpc/transfer_funds' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
-H 'Content-Type: application/json' \\
-d '{
  "from_account": 1,
  "to_account": 2,
  "amount": 100
}'`,
            response: `{
  "success": true,
  "transaction_id": "txn_123456",
  "from_balance": 900,
  "to_balance": 1100
}`
          }
        ]
      }
    ]
  }
]