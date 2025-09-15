export interface ApiEndpoint {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'WebSocket'
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
    description: '数据的增删改查操作',
    officialDocs: 'https://supabase.com/docs/reference/javascript/select',
    endpoints: [
      {
        id: 'db-select',
        name: '查询数据',
        method: 'GET',
        path: '/rest/v1/{table}',
        description: '从指定表中查询数据',
        officialDocs: 'https://supabase.com/docs/reference/javascript/select',
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
          },
          {
            name: 'filter',
            type: 'string',
            required: false,
            description: '过滤条件，如 eq.value, gt.10, like.*pattern*',
            example: 'name=eq.John'
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
        officialDocs: 'https://supabase.com/docs/reference/javascript/insert',
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
            title: '创建新用户',
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
        officialDocs: 'https://supabase.com/docs/reference/javascript/update',
        parameters: [
          {
            name: 'table',
            type: 'string',
            required: true,
            description: '表名',
            example: 'users'
          },
          {
            name: 'filter',
            type: 'string',
            required: true,
            description: '更新条件，如 id=eq.1',
            example: 'id=eq.1'
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
        officialDocs: 'https://supabase.com/docs/reference/javascript/delete',
        parameters: [
          {
            name: 'table',
            type: 'string',
            required: true,
            description: '表名',
            example: 'users'
          },
          {
            name: 'filter',
            type: 'string',
            required: true,
            description: '删除条件，如 id=eq.1',
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
        officialDocs: 'https://supabase.com/docs/reference/javascript/upsert',
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
        officialDocs: 'https://supabase.com/docs/reference/javascript/rpc',
        parameters: [
          {
            name: 'function_name',
            type: 'string',
            required: true,
            description: '函数名称',
            example: 'get_user_stats'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '函数参数',
          schema: {
            type: 'object'
          },
          example: {
            user_id: 123,
            start_date: '2023-01-01',
            end_date: '2023-12-31'
          }
        },
        responses: [
          {
            status: 200,
            description: '调用成功',
            example: {
              total_posts: 25,
              total_likes: 150,
              avg_rating: 4.2
            }
          }
        ],
        examples: [
          {
            title: '调用用户统计函数',
            description: '获取用户在指定时间范围内的统计数据',
            request: `curl -X POST 'https://your-project.supabase.co/rest/v1/rpc/get_user_stats' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
-H 'Content-Type: application/json' \\
-d '{
  "user_id": 123,
  "start_date": "2023-01-01",
  "end_date": "2023-12-31"
}'`,
            response: `{
  "total_posts": 25,
  "total_likes": 150,
  "avg_rating": 4.2
}`
          }
        ]
      },
      {
        id: 'db-bulk-insert',
        name: '批量插入',
        method: 'POST',
        path: '/rest/v1/{table}',
        description: '批量插入多条记录',
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
          description: '要批量插入的数据数组',
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
            description: '批量插入成功',
            example: [
              { id: 1, name: 'User 1', email: 'user1@example.com' },
              { id: 2, name: 'User 2', email: 'user2@example.com' },
              { id: 3, name: 'User 3', email: 'user3@example.com' }
            ]
          }
        ],
        examples: [
          {
            title: '批量创建用户',
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
        id: 'db-count',
        name: '计数查询',
        method: 'GET',
        path: '/rest/v1/{table}',
        description: '获取表中记录的数量',
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
            required: true,
            description: '必须设置为count',
            example: 'count'
          },
          {
            name: 'filter',
            type: 'string',
            required: false,
            description: '过滤条件',
            example: 'status=eq.active'
          }
        ],
        responses: [
          {
            status: 200,
            description: '计数成功',
            example: [
              { count: 150 }
            ]
          }
        ],
        examples: [
          {
            title: '统计活跃用户数',
            description: '获取状态为活跃的用户总数',
            request: `curl -X GET 'https://your-project.supabase.co/rest/v1/users?select=count&status=eq.active' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {"count": 150}
]`
          }
        ]
      },

      {
        id: 'db-join-query',
        name: '关联查询',
        method: 'GET',
        path: '/rest/v1/{table}',
        description: '执行表关联查询',
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
            required: true,
            description: '包含关联表的字段选择',
            example: 'id,name,posts(id,title,created_at)'
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
                  { id: 1, title: 'First Post', created_at: '2023-01-01T00:00:00.000Z' },
                  { id: 2, title: 'Second Post', created_at: '2023-01-02T00:00:00.000Z' }
                ]
              }
            ]
          }
        ],
        examples: [
          {
            title: '用户及其文章',
            description: '查询用户信息及其发布的文章',
            request: `curl -X GET 'https://your-project.supabase.co/rest/v1/users?select=id,name,posts(id,title,created_at)' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": 1,
    "name": "John Doe",
    "posts": [
      {"id": 1, "title": "First Post", "created_at": "2023-01-01T00:00:00.000Z"},
      {"id": 2, "title": "Second Post", "created_at": "2023-01-02T00:00:00.000Z"}
    ]
  }
]`
          }
        ]
      }
    ]
  },
  {
    id: 'auth',
    name: '身份认证',
    description: '用户注册、登录、登出等认证相关接口',
    officialDocs: 'https://supabase.com/docs/reference/javascript/auth-signup',
    endpoints: [
      {
        id: 'auth-signup',
        name: '用户注册',
        method: 'POST',
        path: '/auth/v1/signup',
        description: '创建新用户账户',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-signup',
        requestBody: {
          type: 'application/json',
          description: '用户注册信息',
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string', minLength: 6 },
              data: { type: 'object', description: '用户元数据' }
            }
          },
          example: {
            email: 'user@example.com',
            password: 'password123',
            data: { name: 'John Doe', age: 30 }
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
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-signinwithpassword',
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
      },
      {
        id: 'auth-signout',
        name: '用户登出',
        method: 'POST',
        path: '/auth/v1/logout',
        description: '用户登出并撤销访问令牌',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-signout',
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
      },
      {
        id: 'auth-sso',
        name: 'SSO登录',
        method: 'GET',
        path: '/auth/v1/sso',
        description: '单点登录(SSO)认证',
        parameters: [
          {
            name: 'provider_id',
            type: 'string',
            required: true,
            description: 'SSO提供商ID',
            example: 'sso-provider-uuid'
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
            description: '重定向到SSO提供商',
            example: {
              location: 'https://sso-provider.com/auth?...'
            }
          }
        ],
        examples: [
          {
            title: 'SAML SSO登录',
            description: '通过SAML提供商进行单点登录',
            request: `curl -X GET 'https://your-project.supabase.co/auth/v1/sso?provider_id=sso-provider-uuid&redirect_to=https://yourapp.com/dashboard' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY'`,
            response: `HTTP/1.1 302 Found
Location: https://sso-provider.com/auth?...`
          }
        ]
      },
      {
        id: 'auth-callback',
        name: 'OAuth回调',
        method: 'GET',
        path: '/auth/v1/callback',
        description: 'OAuth提供商的回调处理',
        parameters: [
          {
            name: 'code',
            type: 'string',
            required: true,
            description: 'OAuth授权码',
            example: 'oauth_code_123'
          },
          {
            name: 'state',
            type: 'string',
            required: false,
            description: 'OAuth状态参数',
            example: 'random_state_string'
          }
        ],
        responses: [
          {
            status: 302,
            description: '重定向到应用并携带令牌',
            example: {
              location: 'https://yourapp.com/auth/callback#access_token=...'
            }
          }
        ],
        examples: [
          {
            title: 'GitHub OAuth回调',
            description: 'GitHub OAuth认证完成后的回调处理',
            request: `curl -X GET 'https://your-project.supabase.co/auth/v1/callback?code=oauth_code_123&state=random_state_string' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY'`,
            response: `HTTP/1.1 302 Found
Location: https://yourapp.com/auth/callback#access_token=...`
          }
        ]
      },
      {
        id: 'auth-resend',
        name: '重发确认邮件',
        method: 'POST',
        path: '/auth/v1/resend',
        description: '重新发送确认邮件或OTP',
        requestBody: {
          type: 'application/json',
          description: '重发请求信息',
          schema: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['signup', 'email_change'] },
              email: { type: 'string', format: 'email' }
            }
          },
          example: {
            type: 'signup',
            email: 'user@example.com'
          }
        },
        responses: [
          {
            status: 200,
            description: '邮件发送成功',
            example: {
              message: 'Confirmation email sent'
            }
          }
        ],
        examples: [
          {
            title: '重发注册确认邮件',
            description: '为未确认的用户重新发送确认邮件',
            request: `curl -X POST 'https://your-project.supabase.co/auth/v1/resend' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "type": "signup",
  "email": "user@example.com"
}'`,
            response: `{
  "message": "Confirmation email sent"
}`
          }
        ]
      }
    ]
  },
  {
    id: 'schema',
    name: '数据库模式',
    description: '数据库结构和元数据管理',
    endpoints: [
      {
        id: 'db-schema',
        name: '获取表结构',
        method: 'GET',
        path: '/rest/v1/',
        description: '获取数据库表结构和元数据',
        parameters: [
          {
            name: 'apikey',
            type: 'string',
            required: true,
            description: 'API密钥',
            example: 'YOUR_SUPABASE_ANON_KEY'
          }
        ],
        responses: [
          {
            status: 200,
            description: '表结构获取成功',
            example: {
              definitions: {
                users: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    created_at: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          }
        ],
        examples: [
          {
            title: '获取API模式',
            description: '获取数据库的OpenAPI规范',
            request: `curl -X GET 'https://your-project.supabase.co/rest/v1/' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY'`,
            response: `{
  "definitions": {
    "users": {
      "type": "object",
      "properties": {
        "id": {"type": "integer"},
        "name": {"type": "string"},
        "email": {"type": "string"},
        "created_at": {"type": "string", "format": "date-time"}
      }
    }
  }
}`
          }
        ]
      },
      {
        id: 'db-explain',
        name: '查询执行计划',
        method: 'GET',
        path: '/rest/v1/{table}',
        description: '获取查询的执行计划（用于性能分析）',
        parameters: [
          {
            name: 'table',
            type: 'string',
            required: true,
            description: '表名',
            example: 'users'
          },
          {
            name: 'Accept-Profile',
            type: 'string',
            required: false,
            description: '数据库模式（请求头）',
            example: 'public'
          },
          {
            name: 'Prefer',
            type: 'string',
            required: true,
            description: '必须设置为explain（请求头）',
            example: 'explain'
          }
        ],
        responses: [
          {
            status: 200,
            description: '执行计划获取成功',
            example: [
              {
                plan: {
                  'Node Type': 'Seq Scan',
                  'Relation Name': 'users',
                  'Total Cost': 25.00,
                  'Rows': 1000
                }
              }
            ]
          }
        ],
        examples: [
          {
            title: '分析查询性能',
            description: '获取查询的执行计划以优化性能',
            request: `curl -X GET 'https://your-project.supabase.co/rest/v1/users?select=*&limit=10' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
-H 'Prefer: explain'`,
            response: `[
  {
    "plan": {
      "Node Type": "Seq Scan",
      "Relation Name": "users",
      "Total Cost": 25.00,
      "Rows": 1000
    }
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
        parameters: [
          {
            name: 'table',
            type: 'string',
            required: true,
            description: '表名',
            example: 'posts'
          },
          {
            name: 'column',
            type: 'string',
            required: true,
            description: '搜索字段和关键词',
            example: 'title.fts.javascript'
          }
        ],
        responses: [
          {
            status: 200,
            description: '搜索结果',
            example: [
              {
                id: 1,
                title: 'JavaScript Tutorial',
                content: 'Learn JavaScript basics...',
                created_at: '2023-01-01T00:00:00.000Z'
              }
            ]
          }
        ],
        examples: [
          {
            title: '搜索文章',
            description: '在文章标题中搜索包含JavaScript的内容',
            request: `curl -X GET 'https://your-project.supabase.co/rest/v1/posts?title=fts.javascript' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": 1,
    "title": "JavaScript Tutorial",
    "content": "Learn JavaScript basics...",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
]`
          }
        ]
      }
    ]
  },
  {
    id: 'rls-policies',
    name: 'RLS策略管理',
    description: '行级安全策略的创建和管理',
    endpoints: [
      {
        id: 'rls-enable',
        name: '启用RLS',
        method: 'POST',
        path: '/rest/v1/rpc/enable_rls',
        description: '为表启用行级安全(RLS)',
        requestBody: {
          type: 'application/json',
          description: '表名和RLS配置',
          schema: {
            type: 'object',
            properties: {
              table_name: { type: 'string' },
              schema_name: { type: 'string' }
            }
          },
          example: {
            table_name: 'users',
            schema_name: 'public'
          }
        },
        responses: [
          {
            status: 200,
            description: 'RLS启用成功',
            example: {
              success: true,
              message: 'RLS enabled for table users'
            }
          }
        ],
        examples: [
          {
            title: '为用户表启用RLS',
            description: '启用用户表的行级安全策略',
            request: `curl -X POST 'https://your-project.supabase.co/rest/v1/rpc/enable_rls' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "table_name": "users",
  "schema_name": "public"
}'`,
            response: `{
  "success": true,
  "message": "RLS enabled for table users"
}`
          }
        ]
      },
      {
        id: 'rls-create-policy',
        name: '创建RLS策略',
        method: 'POST',
        path: '/rest/v1/rpc/create_policy',
        description: '创建行级安全策略',
        requestBody: {
          type: 'application/json',
          description: '策略配置',
          schema: {
            type: 'object',
            properties: {
              policy_name: { type: 'string' },
              table_name: { type: 'string' },
              command: { type: 'string', enum: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'ALL'] },
              expression: { type: 'string' }
            }
          },
          example: {
            policy_name: 'users_own_data',
            table_name: 'users',
            command: 'ALL',
            expression: 'auth.uid() = id'
          }
        },
        responses: [
          {
            status: 200,
            description: '策略创建成功',
            example: {
              success: true,
              policy_name: 'users_own_data'
            }
          }
        ],
        examples: [
          {
            title: '创建用户数据访问策略',
            description: '用户只能访问自己的数据',
            request: `curl -X POST 'https://your-project.supabase.co/rest/v1/rpc/create_policy' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "policy_name": "users_own_data",
  "table_name": "users",
  "command": "ALL",
  "expression": "auth.uid() = id"
}'`,
            response: `{
  "success": true,
  "policy_name": "users_own_data"
}`
          }
        ]
      }
    ]
  },
  {
    id: 'database-functions',
    name: '数据库函数',
    description: '数据库函数和触发器管理',
    endpoints: [
      {
        id: 'create-function',
        name: '创建数据库函数',
        method: 'POST',
        path: '/rest/v1/rpc/create_function',
        description: '创建PostgreSQL函数',
        requestBody: {
          type: 'application/json',
          description: '函数定义',
          schema: {
            type: 'object',
            properties: {
              function_name: { type: 'string' },
              function_body: { type: 'string' },
              return_type: { type: 'string' },
              parameters: { type: 'array' }
            }
          },
          example: {
            function_name: 'get_user_posts_count',
            function_body: 'SELECT COUNT(*) FROM posts WHERE user_id = $1',
            return_type: 'integer',
            parameters: ['user_id uuid']
          }
        },
        responses: [
          {
            status: 200,
            description: '函数创建成功',
            example: {
              success: true,
              function_name: 'get_user_posts_count'
            }
          }
        ],
        examples: [
          {
            title: '创建用户文章计数函数',
            description: '创建统计用户文章数量的函数',
            request: `curl -X POST 'https://your-project.supabase.co/rest/v1/rpc/create_function' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "function_name": "get_user_posts_count",
  "function_body": "SELECT COUNT(*) FROM posts WHERE user_id = $1",
  "return_type": "integer",
  "parameters": ["user_id uuid"]
}'`,
            response: `{
  "success": true,
  "function_name": "get_user_posts_count"
}`
          }
        ]
      },
      {
        id: 'create-trigger',
        name: '创建触发器',
        method: 'POST',
        path: '/rest/v1/rpc/create_trigger',
        description: '创建数据库触发器',
        requestBody: {
          type: 'application/json',
          description: '触发器配置',
          schema: {
            type: 'object',
            properties: {
              trigger_name: { type: 'string' },
              table_name: { type: 'string' },
              function_name: { type: 'string' },
              timing: { type: 'string', enum: ['BEFORE', 'AFTER', 'INSTEAD OF'] },
              events: { type: 'array' }
            }
          },
          example: {
            trigger_name: 'update_modified_time',
            table_name: 'users',
            function_name: 'set_updated_at',
            timing: 'BEFORE',
            events: ['UPDATE']
          }
        },
        responses: [
          {
            status: 200,
            description: '触发器创建成功',
            example: {
              success: true,
              trigger_name: 'update_modified_time'
            }
          }
        ],
        examples: [
          {
            title: '创建更新时间触发器',
            description: '自动更新记录的修改时间',
            request: `curl -X POST 'https://your-project.supabase.co/rest/v1/rpc/create_trigger' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "trigger_name": "update_modified_time",
  "table_name": "users",
  "function_name": "set_updated_at",
  "timing": "BEFORE",
  "events": ["UPDATE"]
}'`,
            response: `{
  "success": true,
  "trigger_name": "update_modified_time"
}`
          }
        ]
      }
    ]
  },
  {
    id: 'extensions',
    name: 'PostgreSQL扩展',
    description: 'PostgreSQL扩展管理',
    endpoints: [
      {
        id: 'list-extensions',
        name: '列出扩展',
        method: 'GET',
        path: '/rest/v1/rpc/list_extensions',
        description: '获取已安装的PostgreSQL扩展列表',
        responses: [
          {
            status: 200,
            description: '扩展列表获取成功',
            example: [
              {
                name: 'uuid-ossp',
                version: '1.1',
                installed: true,
                description: 'UUID generation functions'
              },
              {
                name: 'postgis',
                version: '3.1.4',
                installed: false,
                description: 'PostGIS geometry and geography spatial types and functions'
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取扩展列表',
            description: '查看数据库中可用和已安装的扩展',
            request: `curl -X GET 'https://your-project.supabase.co/rest/v1/rpc/list_extensions' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY'`,
            response: `[
  {
    "name": "uuid-ossp",
    "version": "1.1",
    "installed": true,
    "description": "UUID generation functions"
  },
  {
    "name": "postgis",
    "version": "3.1.4",
    "installed": false,
    "description": "PostGIS geometry and geography spatial types and functions"
  }
]`
          }
        ]
      },
      {
        id: 'enable-extension',
        name: '启用扩展',
        method: 'POST',
        path: '/rest/v1/rpc/enable_extension',
        description: '启用PostgreSQL扩展',
        requestBody: {
          type: 'application/json',
          description: '扩展名称',
          schema: {
            type: 'object',
            properties: {
              extension_name: { type: 'string' },
              schema_name: { type: 'string' }
            }
          },
          example: {
            extension_name: 'uuid-ossp',
            schema_name: 'public'
          }
        },
        responses: [
          {
            status: 200,
            description: '扩展启用成功',
            example: {
              success: true,
              extension: 'uuid-ossp'
            }
          }
        ],
        examples: [
          {
            title: '启用UUID扩展',
            description: '启用UUID生成函数扩展',
            request: `curl -X POST 'https://your-project.supabase.co/rest/v1/rpc/enable_extension' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "extension_name": "uuid-ossp",
  "schema_name": "public"
}'`,
            response: `{
  "success": true,
  "extension": "uuid-ossp"
}`
          }
        ]
      }
    ]
  },
  {
    id: 'migrations',
    name: '数据库迁移',
    description: '数据库结构迁移管理',
    endpoints: [
      {
        id: 'run-migration',
        name: '执行迁移',
        method: 'POST',
        path: '/rest/v1/rpc/run_migration',
        description: '执行数据库迁移脚本',
        requestBody: {
          type: 'application/json',
          description: '迁移脚本',
          schema: {
            type: 'object',
            properties: {
              migration_name: { type: 'string' },
              sql_script: { type: 'string' },
              rollback_script: { type: 'string' }
            }
          },
          example: {
            migration_name: '20231201_add_user_profile',
            sql_script: 'ALTER TABLE users ADD COLUMN profile_image TEXT;',
            rollback_script: 'ALTER TABLE users DROP COLUMN profile_image;'
          }
        },
        responses: [
          {
            status: 200,
            description: '迁移执行成功',
            example: {
              success: true,
              migration_id: 'mig_123456',
              executed_at: '2023-12-01T10:00:00.000Z'
            }
          }
        ],
        examples: [
          {
            title: '添加用户头像字段',
            description: '为用户表添加头像字段的迁移',
            request: `curl -X POST 'https://your-project.supabase.co/rest/v1/rpc/run_migration' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "migration_name": "20231201_add_user_profile",
  "sql_script": "ALTER TABLE users ADD COLUMN profile_image TEXT;",
  "rollback_script": "ALTER TABLE users DROP COLUMN profile_image;"
}'`,
            response: `{
  "success": true,
  "migration_id": "mig_123456",
  "executed_at": "2023-12-01T10:00:00.000Z"
}`
          }
        ]
      },
      {
        id: 'migration-history',
        name: '迁移历史',
        method: 'GET',
        path: '/rest/v1/rpc/migration_history',
        description: '获取数据库迁移历史记录',
        responses: [
          {
            status: 200,
            description: '迁移历史获取成功',
            example: [
              {
                id: 'mig_123456',
                name: '20231201_add_user_profile',
                executed_at: '2023-12-01T10:00:00.000Z',
                status: 'completed'
              },
              {
                id: 'mig_123455',
                name: '20231130_create_posts_table',
                executed_at: '2023-11-30T15:30:00.000Z',
                status: 'completed'
              }
            ]
          }
        ],
        examples: [
          {
            title: '查看迁移历史',
            description: '获取所有已执行的数据库迁移记录',
            request: `curl -X GET 'https://your-project.supabase.co/rest/v1/rpc/migration_history' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY'`,
            response: `[
  {
    "id": "mig_123456",
    "name": "20231201_add_user_profile",
    "executed_at": "2023-12-01T10:00:00.000Z",
    "status": "completed"
  },
  {
    "id": "mig_123455",
    "name": "20231130_create_posts_table",
    "executed_at": "2023-11-30T15:30:00.000Z",
    "status": "completed"
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
    officialDocs: 'https://supabase.com/docs/reference/javascript/storage-from-upload',
    endpoints: [
      {
        id: 'storage-upload',
        name: '上传文件',
        method: 'POST',
        path: '/storage/v1/object/{bucket}/{path}',
        description: '上传文件到指定存储桶',
        officialDocs: 'https://supabase.com/docs/reference/javascript/storage-from-upload',
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
        officialDocs: 'https://supabase.com/docs/reference/javascript/storage-from-download',
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
            properties: {
              limit: { type: 'integer' },
              offset: { type: 'integer' },
              sortBy: { type: 'object' },
              search: { type: 'string' }
            }
          },
          example: {
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
                last_accessed_at: '2023-01-01T00:00:00.000Z',
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
    "last_accessed_at": "2023-01-01T00:00:00.000Z",
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
              },
              {
                id: 'documents',
                name: 'documents',
                public: false,
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
  },
  {
    "id": "documents",
    "name": "documents",
    "public": false,
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
      }
    ]
  },
  {
    id: 'realtime',
    name: '实时订阅',
    description: '实时数据变化监听',
    officialDocs: 'https://supabase.com/docs/reference/javascript/subscribe',
    endpoints: [
      {
        id: 'realtime-subscribe',
        name: '订阅数据变化',
        method: 'WebSocket',
        path: '/realtime/v1/websocket',
        description: '通过WebSocket订阅数据库表的实时变化',
        officialDocs: 'https://supabase.com/docs/reference/javascript/subscribe',
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
          },
          {
            name: 'schema',
            type: 'string',
            required: false,
            description: '数据库模式名',
            example: 'public'
          },
          {
            name: 'filter',
            type: 'string',
            required: false,
            description: '过滤条件',
            example: 'user_id=eq.123'
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
      },
      {
        id: 'realtime-presence',
        name: '在线状态',
        method: 'WebSocket',
        path: '/realtime/v1/websocket',
        description: '跟踪用户在线状态和实时协作',
        parameters: [
          {
            name: 'channel',
            type: 'string',
            required: true,
            description: '频道名称',
            example: 'room:123'
          }
        ],
        responses: [
          {
            status: 200,
            description: '在线状态更新',
            example: {
              event: 'presence',
              type: 'join',
              key: 'user-123',
              currentPresences: {
                'user-123': {
                  user_id: 123,
                  username: 'john_doe',
                  status: 'online'
                }
              },
              newPresences: {
                'user-123': {
                  user_id: 123,
                  username: 'john_doe',
                  status: 'online'
                }
              }
            }
          }
        ],
        examples: [
          {
            title: '在线状态跟踪',
            description: '跟踪房间内用户的在线状态',
            request: `const channel = supabase.channel('room:123')

channel
  .on('presence', { event: 'sync' }, () => {
    const newState = channel.presenceState()
    console.log('sync', newState)
  })
  .on('presence', { event: 'join' }, ({ key, newPresences }) => {
    console.log('join', key, newPresences)
  })
  .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    console.log('leave', key, leftPresences)
  })
  .subscribe(async (status) => {
    if (status !== 'SUBSCRIBED') { return }
    
    await channel.track({
      user_id: 123,
      username: 'john_doe',
      status: 'online'
    })
  })`,
            response: `// 当用户加入时收到：
{
  "event": "presence",
  "type": "join",
  "key": "user-123",
  "currentPresences": {
    "user-123": {
      "user_id": 123,
      "username": "john_doe",
      "status": "online"
    }
  }
}`
          }
        ]
      },
      {
        id: 'realtime-broadcast',
        name: '广播消息',
        method: 'WebSocket',
        path: '/realtime/v1/websocket',
        description: '向频道内的所有客户端广播消息',
        parameters: [
          {
            name: 'channel',
            type: 'string',
            required: true,
            description: '频道名称',
            example: 'chat:123'
          },
          {
            name: 'event',
            type: 'string',
            required: true,
            description: '事件名称',
            example: 'message'
          }
        ],
        responses: [
          {
            status: 200,
            description: '广播消息接收',
            example: {
              event: 'message',
              type: 'broadcast',
              payload: {
                message: 'Hello everyone!',
                user_id: 123,
                timestamp: '2023-01-01T00:00:00.000Z'
              }
            }
          }
        ],
        examples: [
          {
            title: '聊天消息广播',
            description: '在聊天频道中广播消息',
            request: `const channel = supabase.channel('chat:123')

// 监听广播消息
channel
  .on('broadcast', { event: 'message' }, (payload) => {
    console.log('Received message:', payload)
  })
  .subscribe()

// 发送广播消息
channel.send({
  type: 'broadcast',
  event: 'message',
  payload: {
    message: 'Hello everyone!',
    user_id: 123,
    timestamp: new Date().toISOString()
  }
})`,
            response: `// 其他客户端收到：
{
  "event": "message",
  "type": "broadcast",
  "payload": {
    "message": "Hello everyone!",
    "user_id": 123,
    "timestamp": "2023-01-01T00:00:00.000Z"
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
    description: 'Serverless函数调用',
    endpoints: [
      {
        id: 'edge-function-invoke',
        name: '调用边缘函数',
        method: 'POST',
        path: '/functions/v1/{function_name}',
        description: '调用部署的边缘函数',
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
      },
      {
        id: 'edge-function-invoke-get',
        name: '调用边缘函数(GET)',
        method: 'GET',
        path: '/functions/v1/{function_name}',
        description: '通过GET请求调用边缘函数',
        parameters: [
          {
            name: 'function_name',
            type: 'string',
            required: true,
            description: '函数名称',
            example: 'get-user-data'
          },
          {
            name: 'user_id',
            type: 'string',
            required: false,
            description: '查询参数示例',
            example: '123'
          }
        ],
        responses: [
          {
            status: 200,
            description: '函数执行成功',
            example: {
              user: {
                id: 123,
                name: 'John Doe',
                email: 'john@example.com'
              }
            }
          }
        ],
        examples: [
          {
            title: '获取用户数据',
            description: '通过GET请求获取用户数据',
            request: `curl -X GET 'https://your-project.supabase.co/functions/v1/get-user-data?user_id=123' \\
-H 'apikey: YOUR_SUPABASE_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  }
}`
          }
        ]
      }
    ]
  },
  {
    id: 'admin',
    name: '管理接口',
    description: '项目管理和配置接口',
    endpoints: [
      {
        id: 'admin-users',
        name: '管理用户',
        method: 'GET',
        path: '/auth/v1/admin/users',
        description: '获取所有用户列表（需要service_role权限）',
        parameters: [
          {
            name: 'page',
            type: 'integer',
            required: false,
            description: '页码',
            example: '1'
          },
          {
            name: 'per_page',
            type: 'integer',
            required: false,
            description: '每页数量',
            example: '50'
          }
        ],
        responses: [
          {
            status: 200,
            description: '用户列表获取成功',
            example: {
              users: [
                {
                  id: '123e4567-e89b-12d3-a456-426614174000',
                  email: 'user@example.com',
                  created_at: '2023-01-01T00:00:00.000Z',
                  last_sign_in_at: '2023-01-01T00:00:00.000Z'
                }
              ],
              total: 1,
              page: 1,
              per_page: 50
            }
          }
        ],
        examples: [
          {
            title: '获取用户列表',
            description: '获取项目中的所有用户',
            request: `curl -X GET 'https://your-project.supabase.co/auth/v1/admin/users' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY'`,
            response: `{
  "users": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "created_at": "2023-01-01T00:00:00.000Z",
      "last_sign_in_at": "2023-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 50
}`
          }
        ]
      },
      {
        id: 'admin-create-user',
        name: '创建用户',
        method: 'POST',
        path: '/auth/v1/admin/users',
        description: '管理员创建用户（需要service_role权限）',
        requestBody: {
          type: 'application/json',
          description: '用户信息',
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string' },
              email_confirm: { type: 'boolean' },
              user_metadata: { type: 'object' }
            }
          },
          example: {
            email: 'newuser@example.com',
            password: 'password123',
            email_confirm: true,
            user_metadata: {
              name: 'New User'
            }
          }
        },
        responses: [
          {
            status: 200,
            description: '用户创建成功',
            example: {
              user: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                email: 'newuser@example.com',
                created_at: '2023-01-01T00:00:00.000Z'
              }
            }
          }
        ],
        examples: [
          {
            title: '管理员创建用户',
            description: '使用管理员权限创建新用户',
            request: `curl -X POST 'https://your-project.supabase.co/auth/v1/admin/users' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "email": "newuser@example.com",
  "password": "password123",
  "email_confirm": true,
  "user_metadata": {
    "name": "New User"
  }
}'`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "newuser@example.com",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}`
          }
        ]
      },
      {
        id: 'admin-delete-user',
        name: '删除用户',
        method: 'DELETE',
        path: '/auth/v1/admin/users/{user_id}',
        description: '管理员删除用户（需要service_role权限）',
        parameters: [
          {
            name: 'user_id',
            type: 'string',
            required: true,
            description: '用户ID',
            example: '123e4567-e89b-12d3-a456-426614174000'
          }
        ],
        responses: [
          {
            status: 200,
            description: '用户删除成功'
          }
        ],
        examples: [
          {
            title: '删除用户',
            description: '管理员删除指定用户',
            request: `curl -X DELETE 'https://your-project.supabase.co/auth/v1/admin/users/123e4567-e89b-12d3-a456-426614174000' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY'`,
            response: `{}`
          }
        ]
      },
      {
        id: 'admin-invite-user',
        name: '邀请用户',
        method: 'POST',
        path: '/auth/v1/admin/users',
        description: '管理员邀请用户注册（需要service_role权限）',
        requestBody: {
          type: 'application/json',
          description: '邀请信息',
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              data: { type: 'object' }
            }
          },
          example: {
            email: 'invite@example.com',
            data: {
              name: 'Invited User',
              role: 'member'
            }
          }
        },
        responses: [
          {
            status: 200,
            description: '邀请发送成功',
            example: {
              user: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                email: 'invite@example.com',
                invited_at: '2023-01-01T00:00:00.000Z'
              }
            }
          }
        ],
        examples: [
          {
            title: '邀请新用户',
            description: '管理员发送用户邀请邮件',
            request: `curl -X POST 'https://your-project.supabase.co/auth/v1/admin/users' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "email": "invite@example.com",
  "data": {
    "name": "Invited User",
    "role": "member"
  }
}'`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "invite@example.com",
    "invited_at": "2023-01-01T00:00:00.000Z"
  }
}`
          }
        ]
      }
    ]
  },
  {
    id: 'webhooks',
    name: 'Webhook',
    description: '数据库事件Webhook配置和管理',
    endpoints: [
      {
        id: 'webhook-create',
        name: '创建Webhook',
        method: 'POST',
        path: '/database/webhooks',
        description: '创建数据库事件Webhook',
        requestBody: {
          type: 'application/json',
          description: 'Webhook配置',
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              events: { type: 'array' },
              config: { type: 'object' }
            }
          },
          example: {
            name: 'user_signup_webhook',
            events: ['INSERT'],
            config: {
              url: 'https://yourapp.com/webhooks/user-signup',
              method: 'POST',
              headers: {
                'Authorization': 'Bearer your-webhook-secret'
              }
            }
          }
        },
        responses: [
          {
            status: 201,
            description: 'Webhook创建成功',
            example: {
              id: 'webhook_123',
              name: 'user_signup_webhook',
              events: ['INSERT'],
              created_at: '2023-01-01T00:00:00.000Z'
            }
          }
        ],
        examples: [
          {
            title: '用户注册Webhook',
            description: '当有新用户注册时触发Webhook',
            request: `curl -X POST 'https://your-project.supabase.co/database/webhooks' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "name": "user_signup_webhook",
  "events": ["INSERT"],
  "config": {
    "url": "https://yourapp.com/webhooks/user-signup",
    "method": "POST",
    "headers": {
      "Authorization": "Bearer your-webhook-secret"
    }
  }
}'`,
            response: `{
  "id": "webhook_123",
  "name": "user_signup_webhook",
  "events": ["INSERT"],
  "created_at": "2023-01-01T00:00:00.000Z"
}`
          }
        ]
      },
      {
        id: 'webhook-list',
        name: '列出Webhook',
        method: 'GET',
        path: '/database/webhooks',
        description: '获取所有Webhook列表',
        responses: [
          {
            status: 200,
            description: 'Webhook列表获取成功',
            example: [
              {
                id: 'webhook_123',
                name: 'user_signup_webhook',
                events: ['INSERT'],
                created_at: '2023-01-01T00:00:00.000Z',
                updated_at: '2023-01-01T00:00:00.000Z'
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取Webhook列表',
            description: '列出项目中配置的所有Webhook',
            request: `curl -X GET 'https://your-project.supabase.co/database/webhooks' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY'`,
            response: `[
  {
    "id": "webhook_123",
    "name": "user_signup_webhook",
    "events": ["INSERT"],
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
]`
          }
        ]
      },
      {
        id: 'webhook-delete',
        name: '删除Webhook',
        method: 'DELETE',
        path: '/database/webhooks/{webhook_id}',
        description: '删除指定的Webhook',
        parameters: [
          {
            name: 'webhook_id',
            type: 'string',
            required: true,
            description: 'Webhook ID',
            example: 'webhook_123'
          }
        ],
        responses: [
          {
            status: 200,
            description: 'Webhook删除成功'
          }
        ],
        examples: [
          {
            title: '删除Webhook',
            description: '删除指定的Webhook配置',
            request: `curl -X DELETE 'https://your-project.supabase.co/database/webhooks/webhook_123' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY'`,
            response: `{}`
          }
        ]
      }
    ]
  },
  {
    id: 'backup-restore',
    name: '备份恢复',
    description: '数据库备份和恢复管理',
    endpoints: [
      {
        id: 'create-backup',
        name: '创建备份',
        method: 'POST',
        path: '/platform/database/backups',
        description: '创建数据库备份',
        requestBody: {
          type: 'application/json',
          description: '备份配置',
          schema: {
            type: 'object',
            properties: {
              backup_name: { type: 'string' },
              description: { type: 'string' },
              include_data: { type: 'boolean' }
            }
          },
          example: {
            backup_name: 'daily_backup_20231201',
            description: 'Daily automated backup',
            include_data: true
          }
        },
        responses: [
          {
            status: 200,
            description: '备份创建成功',
            example: {
              backup_id: 'backup_123456',
              status: 'in_progress',
              created_at: '2023-12-01T10:00:00.000Z'
            }
          }
        ],
        examples: [
          {
            title: '创建每日备份',
            description: '创建包含数据的完整数据库备份',
            request: `curl -X POST 'https://your-project.supabase.co/platform/database/backups' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "backup_name": "daily_backup_20231201",
  "description": "Daily automated backup",
  "include_data": true
}'`,
            response: `{
  "backup_id": "backup_123456",
  "status": "in_progress",
  "created_at": "2023-12-01T10:00:00.000Z"
}`
          }
        ]
      },
      {
        id: 'list-backups',
        name: '列出备份',
        method: 'GET',
        path: '/platform/database/backups',
        description: '获取所有数据库备份列表',
        responses: [
          {
            status: 200,
            description: '备份列表获取成功',
            example: [
              {
                backup_id: 'backup_123456',
                name: 'daily_backup_20231201',
                status: 'completed',
                size_bytes: 1048576,
                created_at: '2023-12-01T10:00:00.000Z'
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取备份列表',
            description: '查看所有可用的数据库备份',
            request: `curl -X GET 'https://your-project.supabase.co/platform/database/backups' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY'`,
            response: `[
  {
    "backup_id": "backup_123456",
    "name": "daily_backup_20231201",
    "status": "completed",
    "size_bytes": 1048576,
    "created_at": "2023-12-01T10:00:00.000Z"
  }
]`
          }
        ]
      },
      {
        id: 'restore-backup',
        name: '恢复备份',
        method: 'POST',
        path: '/platform/database/restore',
        description: '从备份恢复数据库',
        requestBody: {
          type: 'application/json',
          description: '恢复配置',
          schema: {
            type: 'object',
            properties: {
              backup_id: { type: 'string' },
              target_database: { type: 'string' }
            }
          },
          example: {
            backup_id: 'backup_123456',
            target_database: 'staging'
          }
        },
        responses: [
          {
            status: 200,
            description: '恢复任务启动成功',
            example: {
              restore_id: 'restore_789012',
              status: 'in_progress',
              started_at: '2023-12-01T11:00:00.000Z'
            }
          }
        ],
        examples: [
          {
            title: '恢复到测试环境',
            description: '将生产备份恢复到测试数据库',
            request: `curl -X POST 'https://your-project.supabase.co/platform/database/restore' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "backup_id": "backup_123456",
  "target_database": "staging"
}'`,
            response: `{
  "restore_id": "restore_789012",
  "status": "in_progress",
  "started_at": "2023-12-01T11:00:00.000Z"
}`
          }
        ]
      }
    ]
  },
  {
    id: 'ssl-certificates',
    name: 'SSL证书管理',
    description: 'SSL证书配置和管理',
    endpoints: [
      {
        id: 'upload-ssl-cert',
        name: '上传SSL证书',
        method: 'POST',
        path: '/platform/ssl/certificates',
        description: '上传自定义SSL证书',
        requestBody: {
          type: 'application/json',
          description: 'SSL证书信息',
          schema: {
            type: 'object',
            properties: {
              certificate: { type: 'string' },
              private_key: { type: 'string' },
              certificate_chain: { type: 'string' },
              domain: { type: 'string' }
            }
          },
          example: {
            certificate: '-----BEGIN CERTIFICATE-----\
...\
-----END CERTIFICATE-----',
            private_key: '-----BEGIN PRIVATE KEY-----\
...\
-----END PRIVATE KEY-----',
            certificate_chain: '-----BEGIN CERTIFICATE-----\
...\
-----END CERTIFICATE-----',
            domain: 'api.yourdomain.com'
          }
        },
        responses: [
          {
            status: 200,
            description: 'SSL证书上传成功',
            example: {
              certificate_id: 'cert_123456',
              domain: 'api.yourdomain.com',
              status: 'active',
              expires_at: '2024-12-01T00:00:00.000Z'
            }
          }
        ],
        examples: [
          {
            title: '上传自定义域名证书',
            description: '为自定义API域名上传SSL证书',
            request: `curl -X POST 'https://your-project.supabase.co/platform/ssl/certificates' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "certificate": "-----BEGIN CERTIFICATE-----\
...\
-----END CERTIFICATE-----",
  "private_key": "-----BEGIN PRIVATE KEY-----\
...\
-----END PRIVATE KEY-----",
  "certificate_chain": "-----BEGIN CERTIFICATE-----\
...\
-----END CERTIFICATE-----",
  "domain": "api.yourdomain.com"
}'`,
            response: `{
  "certificate_id": "cert_123456",
  "domain": "api.yourdomain.com",
  "status": "active",
  "expires_at": "2024-12-01T00:00:00.000Z"
}`
          }
        ]
      },
      {
        id: 'list-ssl-certs',
        name: '列出SSL证书',
        method: 'GET',
        path: '/platform/ssl/certificates',
        description: '获取所有SSL证书列表',
        responses: [
          {
            status: 200,
            description: 'SSL证书列表获取成功',
            example: [
              {
                certificate_id: 'cert_123456',
                domain: 'api.yourdomain.com',
                status: 'active',
                issued_at: '2023-12-01T00:00:00.000Z',
                expires_at: '2024-12-01T00:00:00.000Z'
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取SSL证书列表',
            description: '查看所有已配置的SSL证书',
            request: `curl -X GET 'https://your-project.supabase.co/platform/ssl/certificates' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY'`,
            response: `[
  {
    "certificate_id": "cert_123456",
    "domain": "api.yourdomain.com",
    "status": "active",
    "issued_at": "2023-12-01T00:00:00.000Z",
    "expires_at": "2024-12-01T00:00:00.000Z"
  }
]`
          }
        ]
      }
    ]
  },
  {
    id: 'custom-domains',
    name: '自定义域名',
    description: '自定义域名配置和管理',
    endpoints: [
      {
        id: 'add-custom-domain',
        name: '添加自定义域名',
        method: 'POST',
        path: '/platform/custom-domains',
        description: '添加自定义API域名',
        requestBody: {
          type: 'application/json',
          description: '域名配置',
          schema: {
            type: 'object',
            properties: {
              domain: { type: 'string' },
              subdomain: { type: 'string' },
              certificate_id: { type: 'string' }
            }
          },
          example: {
            domain: 'yourdomain.com',
            subdomain: 'api',
            certificate_id: 'cert_123456'
          }
        },
        responses: [
          {
            status: 200,
            description: '自定义域名添加成功',
            example: {
              domain_id: 'domain_123456',
              full_domain: 'api.yourdomain.com',
              status: 'pending_verification',
              verification_record: {
                type: 'CNAME',
                name: 'api.yourdomain.com',
                value: 'your-project.supabase.co'
              }
            }
          }
        ],
        examples: [
          {
            title: '添加API自定义域名',
            description: '为项目配置自定义API域名',
            request: `curl -X POST 'https://your-project.supabase.co/platform/custom-domains' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "domain": "yourdomain.com",
  "subdomain": "api",
  "certificate_id": "cert_123456"
}'`,
            response: `{
  "domain_id": "domain_123456",
  "full_domain": "api.yourdomain.com",
  "status": "pending_verification",
  "verification_record": {
    "type": "CNAME",
    "name": "api.yourdomain.com",
    "value": "your-project.supabase.co"
  }
}`
          }
        ]
      },
      {
        id: 'verify-domain',
        name: '验证域名',
        method: 'POST',
        path: '/platform/custom-domains/{domain_id}/verify',
        description: '验证自定义域名配置',
        parameters: [
          {
            name: 'domain_id',
            type: 'string',
            required: true,
            description: '域名ID',
            example: 'domain_123456'
          }
        ],
        responses: [
          {
            status: 200,
            description: '域名验证成功',
            example: {
              domain_id: 'domain_123456',
              status: 'active',
              verified_at: '2023-12-01T12:00:00.000Z'
            }
          }
        ],
        examples: [
          {
            title: '验证域名配置',
            description: '验证DNS记录是否正确配置',
            request: `curl -X POST 'https://your-project.supabase.co/platform/custom-domains/domain_123456/verify' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY'`,
            response: `{
  "domain_id": "domain_123456",
  "status": "active",
  "verified_at": "2023-12-01T12:00:00.000Z"
}`
          }
        ]
      }
    ]
  },
  {
    id: 'project-settings',
    name: '项目设置',
    description: '项目配置和设置管理',
    endpoints: [
      {
        id: 'get-project-settings',
        name: '获取项目设置',
        method: 'GET',
        path: '/platform/projects/{project_id}/settings',
        description: '获取项目配置信息',
        parameters: [
          {
            name: 'project_id',
            type: 'string',
            required: true,
            description: '项目ID',
            example: 'your-project-id'
          }
        ],
        responses: [
          {
            status: 200,
            description: '项目设置获取成功',
            example: {
              project_id: 'your-project-id',
              name: 'My Supabase Project',
              region: 'us-east-1',
              database_version: '14.6',
              created_at: '2023-01-01T00:00:00.000Z',
              settings: {
                auth: {
                  enable_signup: true,
                  jwt_expiry: 3600,
                  site_url: 'https://yourapp.com'
                },
                database: {
                  max_connections: 100,
                  statement_timeout: '30s'
                }
              }
            }
          }
        ],
        examples: [
          {
            title: '获取项目配置',
            description: '查看项目的详细配置信息',
            request: `curl -X GET 'https://your-project.supabase.co/platform/projects/your-project-id/settings' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY'`,
            response: `{
  "project_id": "your-project-id",
  "name": "My Supabase Project",
  "region": "us-east-1",
  "database_version": "14.6",
  "created_at": "2023-01-01T00:00:00.000Z",
  "settings": {
    "auth": {
      "enable_signup": true,
      "jwt_expiry": 3600,
      "site_url": "https://yourapp.com"
    },
    "database": {
      "max_connections": 100,
      "statement_timeout": "30s"
    }
  }
}`
          }
        ]
      },
      {
        id: 'update-project-settings',
        name: '更新项目设置',
        method: 'PATCH',
        path: '/platform/projects/{project_id}/settings',
        description: '更新项目配置',
        parameters: [
          {
            name: 'project_id',
            type: 'string',
            required: true,
            description: '项目ID',
            example: 'your-project-id'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '要更新的设置',
          schema: {
            type: 'object',
            properties: {
              settings: { type: 'object' }
            }
          },
          example: {
            settings: {
              auth: {
                enable_signup: false,
                jwt_expiry: 7200
              }
            }
          }
        },
        responses: [
          {
            status: 200,
            description: '项目设置更新成功',
            example: {
              success: true,
              updated_at: '2023-12-01T12:00:00.000Z'
            }
          }
        ],
        examples: [
          {
            title: '更新认证设置',
            description: '修改项目的认证配置',
            request: `curl -X PATCH 'https://your-project.supabase.co/platform/projects/your-project-id/settings' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "settings": {
    "auth": {
      "enable_signup": false,
      "jwt_expiry": 7200
    }
  }
}'`,
            response: `{
  "success": true,
  "updated_at": "2023-12-01T12:00:00.000Z"
}`
          }
        ]
      }
    ]
  },
  {
    id: 'analytics',
    name: '分析统计',
    description: '项目使用情况和性能分析',
    endpoints: [
      {
        id: 'analytics-usage',
        name: '使用统计',
        method: 'GET',
        path: '/platform/usage',
        description: '获取项目的使用统计信息',
        parameters: [
          {
            name: 'start_date',
            type: 'string',
            required: false,
            description: '开始日期',
            example: '2023-01-01'
          },
          {
            name: 'end_date',
            type: 'string',
            required: false,
            description: '结束日期',
            example: '2023-01-31'
          }
        ],
        responses: [
          {
            status: 200,
            description: '使用统计获取成功',
            example: {
              database: {
                size_bytes: 1048576,
                requests: 15000,
                bandwidth_bytes: 5242880
              },
              auth: {
                users: 250,
                sessions: 1500
              },
              storage: {
                size_bytes: 10485760,
                requests: 500
              },
              edge_functions: {
                invocations: 2000,
                execution_time_ms: 45000
              }
            }
          }
        ],
        examples: [
          {
            title: '获取月度使用统计',
            description: '查看项目在指定月份的使用情况',
            request: `curl -X GET 'https://your-project.supabase.co/platform/usage?start_date=2023-01-01&end_date=2023-01-31' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY'`,
            response: `{
  "database": {
    "size_bytes": 1048576,
    "requests": 15000,
    "bandwidth_bytes": 5242880
  },
  "auth": {
    "users": 250,
    "sessions": 1500
  },
  "storage": {
    "size_bytes": 10485760,
    "requests": 500
  },
  "edge_functions": {
    "invocations": 2000,
    "execution_time_ms": 45000
  }
}`
          }
        ]
      },
      {
        id: 'analytics-logs',
        name: '日志查询',
        method: 'GET',
        path: '/platform/logs',
        description: '查询项目日志',
        parameters: [
          {
            name: 'level',
            type: 'string',
            required: false,
            description: '日志级别：error, warn, info, debug',
            example: 'error'
          },
          {
            name: 'source',
            type: 'string',
            required: false,
            description: '日志来源：api, auth, realtime, storage',
            example: 'api'
          },
          {
            name: 'limit',
            type: 'integer',
            required: false,
            description: '返回条数限制',
            example: '100'
          }
        ],
        responses: [
          {
            status: 200,
            description: '日志查询成功',
            example: [
              {
                timestamp: '2023-01-01T00:00:00.000Z',
                level: 'error',
                source: 'api',
                message: 'Database connection failed',
                metadata: {
                  request_id: 'req_123',
                  user_id: 'user_456'
                }
              }
            ]
          }
        ],
        examples: [
          {
            title: '查询API错误日志',
            description: '获取最近的API错误日志',
            request: `curl -X GET 'https://your-project.supabase.co/platform/logs?level=error&source=api&limit=100' \\
-H 'apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY' \\
-H 'Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY'`,
            response: `[
  {
    "timestamp": "2023-01-01T00:00:00.000Z",
    "level": "error",
    "source": "api",
    "message": "Database connection failed",
    "metadata": {
      "request_id": "req_123",
      "user_id": "user_456"
    }
  }
]`
          }
        ]
      }
    ]
  }
]