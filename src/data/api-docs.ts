export interface ApiEndpoint {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'WebSocket'
  path: string
  description: string
  officialDocs?: string
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
  officialDocs?: string
  endpoints: ApiEndpoint[]
}

export const apiCategories: ApiCategory[] = [
  {
    id: 'database',
    name: '数据库',
    description: 'Supabase 数据库操作 - 数据的增删改查和存储过程调用',
    officialDocs: 'https://supabase.com/docs/reference/javascript',
    endpoints: [
      {
        id: 'db-select',
        name: '获取数据',
        method: 'GET',
        path: '/rest/v1/{table}',
        description: '从指定表中查询数据，支持复杂的过滤、排序和分页操作',
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
            description: '选择要返回的列，支持嵌套关系查询',
            example: 'id,name,email,profiles(avatar_url)'
          },
          {
            name: 'filter',
            type: 'string',
            required: false,
            description: '过滤条件，格式：column=operator.value',
            example: 'name=eq.John'
          },
          {
            name: 'order',
            type: 'string',
            required: false,
            description: '排序字段和方向',
            example: 'created_at.desc'
          },
          {
            name: 'limit',
            type: 'number',
            required: false,
            description: '限制返回记录数',
            example: '10'
          },
          {
            name: 'offset',
            type: 'number',
            required: false,
            description: '跳过的记录数',
            example: '20'
          }
        ],
        responses: [
          {
            status: 200,
            description: '查询成功',
            example: [
              {
                "id": 1,
                "name": "John Doe",
                "email": "john@example.com",
                "created_at": "2023-01-01T00:00:00.000Z"
              }
            ]
          },
          {
            status: 400,
            description: '请求参数错误',
            example: {
              "code": "PGRST102",
              "details": "relation \"nonexistent_table\" does not exist",
              "message": "relation \"nonexistent_table\" does not exist"
            }
          }
        ],
        examples: [
          {
            title: '基础查询',
            description: '获取用户表中的所有记录',
            request: `const { data, error } = await supabase
  .from('users')
  .select('*')`,
            response: `[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
]`
          },
          {
            title: '条件查询',
            description: '查询特定条件的用户',
            request: `const { data, error } = await supabase
  .from('users')
  .select('id,name,email')
  .eq('status', 'active')
  .order('created_at', { ascending: false })
  .limit(10)`,
            response: `[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
]`
          },
          {
            title: '关联查询',
            description: '查询用户及其关联的个人资料',
            request: `const { data, error } = await supabase
  .from('users')
  .select(\`
    id,
    name,
    email,
    profiles (
      avatar_url,
      bio
    )
  \`)`,
            response: `[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "profiles": {
      "avatar_url": "https://example.com/avatar.jpg",
      "bio": "Software Developer"
    }
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
        description: '向指定表中插入新数据，支持单条或批量插入',
        officialDocs: 'https://supabase.com/docs/reference/javascript/insert',
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
          description: '要插入的数据，可以是单个对象或对象数组',
          schema: {
            oneOf: [
              { type: 'object' },
              { type: 'array', items: { type: 'object' } }
            ]
          },
          example: {
            "name": "John Doe",
            "email": "john@example.com",
            "age": 30
          }
        },
        responses: [
          {
            status: 201,
            description: '插入成功',
            example: [
              {
                "id": 1,
                "name": "John Doe",
                "email": "john@example.com",
                "age": 30,
                "created_at": "2023-01-01T00:00:00.000Z"
              }
            ]
          },
          {
            status: 409,
            description: '数据冲突（违反唯一约束）',
            example: {
              "code": "23505",
              "details": "Key (email)=(john@example.com) already exists.",
              "message": "duplicate key value violates unique constraint \"users_email_key\""
            }
          }
        ],
        examples: [
          {
            title: '插入单条记录',
            description: '在用户表中插入一条新记录',
            request: `const { data, error } = await supabase
  .from('users')
  .insert({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  })
  .select()`,
            response: `[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
]`
          },
          {
            title: '批量插入',
            description: '一次插入多条记录',
            request: `const { data, error } = await supabase
  .from('users')
  .insert([
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
    { name: 'Charlie', email: 'charlie@example.com' }
  ])
  .select()`,
            response: `[
  {
    "id": 2,
    "name": "Alice",
    "email": "alice@example.com",
    "created_at": "2023-01-01T00:00:00.000Z"
  },
  {
    "id": 3,
    "name": "Bob",
    "email": "bob@example.com",
    "created_at": "2023-01-01T00:00:00.000Z"
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
        description: '更新指定表中的数据，需要配合过滤条件使用',
        officialDocs: 'https://supabase.com/docs/reference/javascript/update',
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
          description: '要更新的数据',
          schema: { type: 'object' },
          example: {
            "name": "Updated Name",
            "email": "updated@example.com"
          }
        },
        responses: [
          {
            status: 200,
            description: '更新成功',
            example: [
              {
                "id": 1,
                "name": "Updated Name",
                "email": "updated@example.com",
                "updated_at": "2023-01-01T12:00:00.000Z"
              }
            ]
          }
        ],
        examples: [
          {
            title: '更新用户信息',
            description: '更新指定ID的用户信息',
            request: `const { data, error } = await supabase
  .from('users')
  .update({ name: 'Updated Name' })
  .eq('id', 1)
  .select()`,
            response: `[
  {
    "id": 1,
    "name": "Updated Name",
    "email": "john@example.com",
    "updated_at": "2023-01-01T12:00:00.000Z"
  }
]`
          },
          {
            title: '批量更新',
            description: '根据条件批量更新多条记录',
            request: `const { data, error } = await supabase
  .from('users')
  .update({ status: 'inactive' })
  .lt('last_login', '2023-01-01')
  .select()`,
            response: `[
  {
    "id": 2,
    "name": "Alice",
    "status": "inactive",
    "updated_at": "2023-01-01T12:00:00.000Z"
  }
]`
          }
        ]
      },
      {
        id: 'db-upsert',
        name: '更新插入数据',
        method: 'POST',
        path: '/rest/v1/{table}',
        description: '插入新数据或更新已存在的数据（基于主键或唯一约束）',
        officialDocs: 'https://supabase.com/docs/reference/javascript/upsert',
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
          description: '要插入或更新的数据',
          schema: {
            oneOf: [
              { type: 'object' },
              { type: 'array', items: { type: 'object' } }
            ]
          },
          example: {
            "id": 1,
            "name": "John Updated",
            "email": "john.updated@example.com"
          }
        },
        responses: [
          {
            status: 201,
            description: '插入或更新成功'
          }
        ],
        examples: [
          {
            title: 'Upsert用户数据',
            description: '插入新用户或更新已存在的用户',
            request: `const { data, error } = await supabase
  .from('users')
  .upsert({ 
    id: 1, 
    name: 'John Updated', 
    email: 'john.updated@example.com' 
  })
  .select()`,
            response: `[
  {
    "id": 1,
    "name": "John Updated",
    "email": "john.updated@example.com",
    "updated_at": "2023-01-01T12:00:00.000Z"
  }
]`
          },
          {
            title: '批量 Upsert',
            description: '批量插入或更新多条记录',
            request: `const { data, error } = await supabase
  .from('users')
  .upsert([
    { id: 1, name: 'John Updated' },
    { id: 2, name: 'Alice Updated' },
    { name: 'New User', email: 'new@example.com' }
  ])
  .select()`,
            response: `[
  {
    "id": 1,
    "name": "John Updated",
    "updated_at": "2023-01-01T12:00:00.000Z"
  },
  {
    "id": 3,
    "name": "New User",
    "email": "new@example.com",
    "created_at": "2023-01-01T12:00:00.000Z"
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
        description: '删除指定表中的数据，需要配合过滤条件使用',
        officialDocs: 'https://supabase.com/docs/reference/javascript/delete',
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
            description: '删除成功'
          }
        ],
        examples: [
          {
            title: '删除用户',
            description: '删除指定ID的用户',
            request: `const { data, error } = await supabase
  .from('users')
  .delete()
  .eq('id', 1)
  .select()`,
            response: `[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
]`
          },
          {
            title: '批量删除',
            description: '根据条件批量删除记录',
            request: `const { data, error } = await supabase
  .from('users')
  .delete()
  .lt('last_login', '2022-01-01')
  .select()`,
            response: `[
  {
    "id": 2,
    "name": "Inactive User",
    "last_login": "2021-12-01T00:00:00.000Z"
  }
]`
          }
        ]
      },
      {
        id: 'db-rpc',
        name: '调用 Postgres 函数',
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
            example: 'hello_world'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '函数参数',
          schema: { type: 'object' },
          example: {
            "name": "World"
          }
        },
        responses: [
          {
            status: 200,
            description: '调用成功'
          }
        ],
        examples: [
          {
            title: '调用Hello World函数',
            description: '调用简单的问候函数',
            request: `const { data, error } = await supabase
  .rpc('hello_world', { name: 'World' })`,
            response: `"Hello World!"`
          },
          {
            title: '调用复杂函数',
            description: '调用带有多个参数的复杂函数',
            request: `const { data, error } = await supabase
  .rpc('calculate_user_stats', {
    user_id: 123,
    start_date: '2023-01-01',
    end_date: '2023-12-31'
  })`,
            response: `{
  "total_orders": 25,
  "total_amount": 1250.50,
  "avg_order_value": 50.02
}`
          }
        ]
      }
    ]
  },  {

    id: 'auth',
    name: '认证',
    description: 'Supabase Auth API - 用户注册、登录、登出等认证相关接口',
    officialDocs: 'https://supabase.com/docs/reference/javascript/auth-signup',
    endpoints: [
      {
        id: 'auth-signup',
        name: '创建新用户',
        method: 'POST',
        path: '/auth/v1/signup',
        description: '创建新用户账户，支持邮箱密码注册和第三方OAuth注册',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-signup',
        requestBody: {
          type: 'application/json',
          description: '注册信息',
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string', minLength: 6 },
              phone: { type: 'string' },
              data: { type: 'object', description: '用户元数据' }
            }
          },
          example: {
            "email": "user@example.com",
            "password": "password123",
            "options": {
              "data": {
                "first_name": "John",
                "last_name": "Doe"
              }
            }
          }
        },
        responses: [
          {
            status: 200,
            description: '注册成功',
            example: {
              "user": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "email": "user@example.com",
                "email_confirmed_at": null,
                "created_at": "2023-01-01T00:00:00.000Z"
              },
              "session": null
            }
          },
          {
            status: 422,
            description: '用户已存在',
            example: {
              "error": "signup_disabled",
              "error_description": "User already registered"
            }
          }
        ],
        examples: [
          {
            title: '邮箱密码注册',
            description: '使用邮箱和密码注册新用户',
            request: `const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "email_confirmed_at": null,
    "created_at": "2023-01-01T00:00:00.000Z"
  },
  "session": null
}`
          },
          {
            title: '带用户元数据注册',
            description: '注册时包含额外的用户信息',
            request: `const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      first_name: 'John',
      last_name: 'Doe',
      age: 30
    }
  }
})`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "user_metadata": {
      "first_name": "John",
      "last_name": "Doe",
      "age": 30
    },
    "created_at": "2023-01-01T00:00:00.000Z"
  },
  "session": null
}`
          }
        ]
      },
      {
        id: 'auth-onauthstatechange',
        name: '监听身份验证事件',
        method: 'WebSocket',
        path: '/auth/v1/events',
        description: '监听用户身份验证状态变化，如登录、登出、令牌刷新等',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-onauthstatechange',
        responses: [
          {
            status: 200,
            description: '事件监听成功'
          }
        ],
        examples: [
          {
            title: '监听认证状态变化',
            description: '监听用户登录、登出等状态变化',
            request: `const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    console.log(event, session)
    
    if (event === 'SIGNED_IN') {
      console.log('用户已登录')
    }
    
    if (event === 'SIGNED_OUT') {
      console.log('用户已登出')
    }
  }
)

// 取消监听
subscription.unsubscribe()`,
            response: `// 登录时触发
{
  "event": "SIGNED_IN",
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com"
    }
  }
}

// 登出时触发
{
  "event": "SIGNED_OUT",
  "session": null
}`
          }
        ]
      },
      {
        id: 'auth-signinanonymously',
        name: '创建匿名用户',
        method: 'POST',
        path: '/auth/v1/signup',
        description: '创建匿名用户账户，无需提供邮箱或密码',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-signinanonymously',
        responses: [
          {
            status: 200,
            description: '匿名用户创建成功'
          }
        ],
        examples: [
          {
            title: '创建匿名用户',
            description: '创建临时匿名用户账户',
            request: `const { data, error } = await supabase.auth.signInAnonymously()`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "is_anonymous": true,
    "created_at": "2023-01-01T00:00:00.000Z"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "v1:refresh_token_here",
    "expires_in": 3600,
    "token_type": "bearer"
  }
}`
          }
        ]
      },
      {
        id: 'auth-signinwithpassword',
        name: '登录用户',
        method: 'POST',
        path: '/auth/v1/token?grant_type=password',
        description: '使用邮箱/手机号和密码登录获取访问令牌',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-signinwithpassword',
        requestBody: {
          type: 'application/json',
          description: '登录凭据',
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              phone: { type: 'string' },
              password: { type: 'string' }
            },
            required: ['password']
          },
          example: {
            "email": "user@example.com",
            "password": "password123"
          }
        },
        responses: [
          {
            status: 200,
            description: '登录成功',
            example: {
              "user": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "email": "user@example.com",
                "last_sign_in_at": "2023-01-01T12:00:00.000Z"
              },
              "session": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "refresh_token": "v1:refresh_token_here",
                "expires_in": 3600,
                "token_type": "bearer"
              }
            }
          },
          {
            status: 400,
            description: '登录凭据无效',
            example: {
              "error": "invalid_grant",
              "error_description": "Invalid login credentials"
            }
          }
        ],
        examples: [
          {
            title: '邮箱密码登录',
            description: '使用邮箱和密码登录',
            request: `const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "last_sign_in_at": "2023-01-01T12:00:00.000Z"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "v1:refresh_token_here",
    "expires_in": 3600,
    "token_type": "bearer"
  }
}`
          },
          {
            title: '手机号密码登录',
            description: '使用手机号和密码登录',
            request: `const { data, error } = await supabase.auth.signInWithPassword({
  phone: '+1234567890',
  password: 'password123'
})`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "phone": "+1234567890",
    "last_sign_in_at": "2023-01-01T12:00:00.000Z"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "v1:refresh_token_here",
    "expires_in": 3600,
    "token_type": "bearer"
  }
}`
          }
        ]
      },
      {
        id: 'auth-signinwithidtoken',
        name: '使用 ID 令牌登录（本机登录）',
        method: 'POST',
        path: '/auth/v1/token?grant_type=id_token',
        description: '使用第三方 ID 令牌进行本机登录，适用于移动应用',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-signinwithidtoken',
        requestBody: {
          type: 'application/json',
          description: 'ID 令牌信息',
          schema: {
            type: 'object',
            properties: {
              provider: { type: 'string', enum: ['apple', 'google', 'azure', 'facebook'] },
              token: { type: 'string' },
              nonce: { type: 'string' }
            },
            required: ['provider', 'token']
          },
          example: {
            "provider": "apple",
            "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
            "nonce": "random_nonce_123"
          }
        },
        responses: [
          {
            status: 200,
            description: 'ID 令牌登录成功'
          }
        ],
        examples: [
          {
            title: 'Apple ID 令牌登录',
            description: '使用 Apple ID 令牌进行本机登录',
            request: `const { data, error } = await supabase.auth.signInWithIdToken({
  provider: 'apple',
  token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  nonce: 'random_nonce_123'
})`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@privaterelay.appleid.com",
    "app_metadata": {
      "provider": "apple"
    }
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "v1:refresh_token_here"
  }
}`
          },
          {
            title: 'Google ID 令牌登录',
            description: '使用 Google ID 令牌进行本机登录',
            request: `const { data, error } = await supabase.auth.signInWithIdToken({
  provider: 'google',
  token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...'
})`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@gmail.com",
    "app_metadata": {
      "provider": "google"
    }
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}`
          }
        ]
      },
      {
        id: 'auth-signinwithotp',
        name: '通过 OTP 登录用户',
        method: 'POST',
        path: '/auth/v1/otp',
        description: '通过一次性密码登录用户，支持邮箱和短信OTP',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-signinwithotp',
        requestBody: {
          type: 'application/json',
          description: 'OTP 请求信息',
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              phone: { type: 'string' },
              create_user: { type: 'boolean', default: true }
            }
          },
          example: {
            "email": "user@example.com",
            "options": {
              "should_create_user": true
            }
          }
        },
        responses: [
          {
            status: 200,
            description: 'OTP 发送成功'
          }
        ],
        examples: [
          {
            title: '发送邮箱 OTP',
            description: '向用户邮箱发送一次性密码',
            request: `const { data, error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    should_create_user: true
  }
})`,
            response: `{}`
          },
          {
            title: '发送短信 OTP',
            description: '向用户手机发送一次性密码',
            request: `const { data, error } = await supabase.auth.signInWithOtp({
  phone: '+1234567890',
  options: {
    should_create_user: true
  }
})`,
            response: `{}`
          },
          {
            title: '验证 OTP',
            description: '验证用户输入的一次性密码',
            request: `const { data, error } = await supabase.auth.verifyOtp({
  email: 'user@example.com',
  token: '123456',
  type: 'email'
})`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}`
          }
        ]
      },
      {
        id: 'auth-signinwithoauth',
        name: '通过 OAuth 登录用户',
        method: 'GET',
        path: '/auth/v1/authorize',
        description: '通过第三方OAuth提供商登录，如Google、GitHub、Facebook等',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-signinwithoauth',
        parameters: [
          {
            name: 'provider',
            type: 'string',
            required: true,
            description: 'OAuth提供商',
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
            request: `const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://yourapp.com/dashboard'
  }
})`,
            response: `// 重定向到 Google OAuth 页面`
          },
          {
            title: 'GitHub OAuth登录',
            description: '使用GitHub账号登录',
            request: `const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    redirectTo: 'https://yourapp.com/dashboard',
    scopes: 'repo user'
  }
})`,
            response: `// 重定向到 GitHub OAuth 页面`
          },
          {
            title: 'Discord OAuth登录',
            description: '使用Discord账号登录',
            request: `const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'discord',
  options: {
    redirectTo: 'https://yourapp.com/dashboard'
  }
})`,
            response: `// 重定向到 Discord OAuth 页面`
          }
        ]
      },
      {
        id: 'auth-signinwithsso',
        name: '通过 SSO 登录用户',
        method: 'POST',
        path: '/auth/v1/sso',
        description: '通过单点登录（SSO）登录用户，适用于企业环境',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-signinwithsso',
        requestBody: {
          type: 'application/json',
          description: 'SSO 登录信息',
          schema: {
            type: 'object',
            properties: {
              provider_id: { type: 'string' },
              domain: { type: 'string' }
            }
          },
          example: {
            "provider_id": "sso_provider_123",
            "domain": "company.com"
          }
        },
        responses: [
          {
            status: 200,
            description: 'SSO 登录重定向'
          }
        ],
        examples: [
          {
            title: 'SSO 登录',
            description: '通过企业 SSO 提供商登录',
            request: `const { data, error } = await supabase.auth.signInWithSSO({
  providerId: 'sso_provider_123',
  options: {
    redirectTo: 'https://yourapp.com/dashboard'
  }
})`,
            response: `{
  "url": "https://sso-provider.com/login?..."
}`
          }
        ]
      },
      {
        id: 'auth-signinwithweb3',
        name: '通过 Web3（Solana、以太坊）登录用户',
        method: 'POST',
        path: '/auth/v1/token?grant_type=web3',
        description: '通过 Web3 钱包登录用户，支持以太坊和Solana钱包',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-signinwithweb3',
        requestBody: {
          type: 'application/json',
          description: 'Web3 登录信息',
          schema: {
            type: 'object',
            properties: {
              provider: { type: 'string', enum: ['ethereum', 'solana'] },
              address: { type: 'string' },
              signature: { type: 'string' },
              message: { type: 'string' }
            },
            required: ['provider', 'address', 'signature', 'message']
          },
          example: {
            "provider": "ethereum",
            "address": "0x1234567890123456789012345678901234567890",
            "signature": "0xabcdef...",
            "message": "Sign in to MyApp"
          }
        },
        responses: [
          {
            status: 200,
            description: 'Web3 登录成功'
          }
        ],
        examples: [
          {
            title: '以太坊钱包登录',
            description: '使用以太坊钱包签名登录',
            request: `const { data, error } = await supabase.auth.signInWithWeb3({
  provider: 'ethereum',
  address: '0x1234567890123456789012345678901234567890',
  signature: '0xabcdef...',
  message: 'Sign in to MyApp'
})`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "wallet_address": "0x1234567890123456789012345678901234567890",
    "app_metadata": {
      "provider": "ethereum"
    }
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}`
          },
          {
            title: 'Solana钱包登录',
            description: '使用Solana钱包签名登录',
            request: `const { data, error } = await supabase.auth.signInWithWeb3({
  provider: 'solana',
  address: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
  signature: 'base58_signature...',
  message: 'Sign in to MyApp'
})`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "wallet_address": "DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK",
    "app_metadata": {
      "provider": "solana"
    }
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}`
          }
        ]
      },
      {
        id: 'auth-getclaims',
        name: '从经过验证的 JWT 获取用户声明',
        method: 'GET',
        path: '/auth/v1/user/claims',
        description: '从当前用户的 JWT 令牌中获取声明信息',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-getclaims',
        responses: [
          {
            status: 200,
            description: '用户声明获取成功'
          }
        ],
        examples: [
          {
            title: '获取用户 JWT 声明',
            description: '获取当前用户的 JWT 令牌声明信息',
            request: `const { data, error } = await supabase.auth.getClaims()`,
            response: `{
  "sub": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "role": "authenticated",
  "aal": "aal1",
  "amr": [{"method": "password", "timestamp": 1672531200}],
  "session_id": "session_123",
  "iss": "https://your-project.supabase.co/auth/v1",
  "aud": "authenticated",
  "exp": 1672534800,
  "iat": 1672531200
}`
          }
        ]
      },
      {
        id: 'auth-signout',
        name: '注销用户',
        method: 'POST',
        path: '/auth/v1/logout',
        description: '用户登出并撤销访问令牌',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-signout',
        parameters: [
          {
            name: 'scope',
            type: 'string',
            required: false,
            description: '登出范围：global（所有设备）或 local（当前设备）',
            example: 'global'
          }
        ],
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
            request: `const { error } = await supabase.auth.signOut()`,
            response: `// 204 No Content`
          },
          {
            title: '全局登出',
            description: '撤销用户在所有设备上的访问令牌',
            request: `const { error } = await supabase.auth.signOut({ 
  scope: 'global' 
})`,
            response: `// 204 No Content`
          }
        ]
      },
      {
        id: 'auth-resetpasswordforemail',
        name: '发送密码重置请求',
        method: 'POST',
        path: '/auth/v1/recover',
        description: '发送密码重置邮件到用户邮箱',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail',
        requestBody: {
          type: 'application/json',
          description: '密码重置请求',
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              redirect_to: { type: 'string' }
            },
            required: ['email']
          },
          example: {
            "email": "user@example.com",
            "options": {
              "redirectTo": "https://yourapp.com/reset-password"
            }
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
            request: `const { data, error } = await supabase.auth.resetPasswordForEmail(
  'user@example.com',
  {
    redirectTo: 'https://yourapp.com/reset-password'
  }
)`,
            response: `{}`
          }
        ]
      },
      {
        id: 'auth-verifyotp',
        name: '通过 OTP 验证并登录',
        method: 'POST',
        path: '/auth/v1/verify',
        description: '验证一次性密码并完成登录',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-verifyotp',
        requestBody: {
          type: 'application/json',
          description: 'OTP 验证信息',
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              phone: { type: 'string' },
              token: { type: 'string' },
              type: { type: 'string', enum: ['signup', 'email_change', 'sms', 'phone_change', 'recovery', 'invite', 'magiclink', 'email'] }
            },
            required: ['token', 'type']
          },
          example: {
            "email": "user@example.com",
            "token": "123456",
            "type": "email"
          }
        },
        responses: [
          {
            status: 200,
            description: 'OTP 验证成功'
          }
        ],
        examples: [
          {
            title: '验证邮箱 OTP',
            description: '验证邮箱收到的一次性密码',
            request: `const { data, error } = await supabase.auth.verifyOtp({
  email: 'user@example.com',
  token: '123456',
  type: 'email'
})`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "email_confirmed_at": "2023-01-01T12:00:00.000Z"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "v1:refresh_token_here"
  }
}`
          },
          {
            title: '验证短信 OTP',
            description: '验证短信收到的一次性密码',
            request: `const { data, error } = await supabase.auth.verifyOtp({
  phone: '+1234567890',
  token: '123456',
  type: 'sms'
})`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "phone": "+1234567890",
    "phone_confirmed_at": "2023-01-01T12:00:00.000Z"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}`
          }
        ]
      },
      {
        id: 'auth-getsession',
        name: '检索会话',
        method: 'GET',
        path: '/auth/v1/user',
        description: '获取当前用户的会话信息',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-getsession',
        responses: [
          {
            status: 200,
            description: '会话获取成功'
          }
        ],
        examples: [
          {
            title: '获取当前会话',
            description: '获取当前用户的会话信息',
            request: `const { data: { session } } = await supabase.auth.getSession()`,
            response: `{
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "v1:refresh_token_here",
    "expires_in": 3600,
    "expires_at": 1672574400,
    "token_type": "bearer",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "last_sign_in_at": "2023-01-01T12:00:00.000Z"
    }
  }
}`
          }
        ]
      },
      {
        id: 'auth-refreshsession',
        name: '检索新会话',
        method: 'POST',
        path: '/auth/v1/token?grant_type=refresh_token',
        description: '使用刷新令牌获取新的访问令牌',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-refreshsession',
        responses: [
          {
            status: 200,
            description: '会话刷新成功'
          }
        ],
        examples: [
          {
            title: '刷新会话',
            description: '使用刷新令牌获取新的访问令牌',
            request: `const { data, error } = await supabase.auth.refreshSession()`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "v1:new_refresh_token_here",
    "expires_in": 3600,
    "token_type": "bearer"
  }
}`
          },
          {
            title: '使用特定刷新令牌',
            description: '使用指定的刷新令牌刷新会话',
            request: `const { data, error } = await supabase.auth.refreshSession({
  refresh_token: 'v1:specific_refresh_token'
})`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "v1:new_refresh_token_here"
  }
}`
          }
        ]
      },
      {
        id: 'auth-getuser',
        name: '检索用户',
        method: 'GET',
        path: '/auth/v1/user',
        description: '获取当前登录用户的详细信息',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-getuser',
        responses: [
          {
            status: 200,
            description: '用户信息获取成功'
          }
        ],
        examples: [
          {
            title: '获取当前用户',
            description: '获取当前登录用户的详细信息',
            request: `const { data: { user } } = await supabase.auth.getUser()`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "aud": "authenticated",
    "role": "authenticated",
    "email": "user@example.com",
    "email_confirmed_at": "2023-01-01T00:00:00.000Z",
    "phone": "",
    "confirmed_at": "2023-01-01T00:00:00.000Z",
    "last_sign_in_at": "2023-01-01T12:00:00.000Z",
    "app_metadata": {
      "provider": "email",
      "providers": ["email"]
    },
    "user_metadata": {
      "first_name": "John",
      "last_name": "Doe"
    },
    "identities": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "user_id": "123e4567-e89b-12d3-a456-426614174000",
        "identity_data": {
          "email": "user@example.com",
          "sub": "123e4567-e89b-12d3-a456-426614174000"
        },
        "provider": "email",
        "last_sign_in_at": "2023-01-01T12:00:00.000Z",
        "created_at": "2023-01-01T00:00:00.000Z",
        "updated_at": "2023-01-01T12:00:00.000Z"
      }
    ],
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T12:00:00.000Z"
  }
}`
          },
          {
            title: '使用JWT获取用户',
            description: '使用指定的JWT令牌获取用户信息',
            request: `const { data: { user } } = await supabase.auth.getUser(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
)`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "role": "authenticated"
  }
}`
          }
        ]
      },
      {
        id: 'auth-updateuser',
        name: '更新用户',
        method: 'PUT',
        path: '/auth/v1/user',
        description: '更新当前用户的信息，如邮箱、密码、元数据等',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-updateuser',
        requestBody: {
          type: 'application/json',
          description: '用户更新信息',
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string' },
              phone: { type: 'string' },
              data: { type: 'object', description: '用户元数据' }
            }
          },
          example: {
            "email": "newemail@example.com",
            "data": {
              "first_name": "John Updated",
              "last_name": "Doe"
            }
          }
        },
        responses: [
          {
            status: 200,
            description: '用户更新成功'
          }
        ],
        examples: [
          {
            title: '更新用户邮箱',
            description: '更新当前用户的邮箱地址',
            request: `const { data, error } = await supabase.auth.updateUser({
  email: 'newemail@example.com'
})`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "newemail@example.com",
    "email_confirmed_at": null,
    "updated_at": "2023-01-01T12:00:00.000Z"
  }
}`
          },
          {
            title: '更新用户密码',
            description: '更新当前用户的密码',
            request: `const { data, error } = await supabase.auth.updateUser({
  password: 'new_password_123'
})`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "updated_at": "2023-01-01T12:00:00.000Z"
  }
}`
          },
          {
            title: '更新用户元数据',
            description: '更新用户的自定义元数据',
            request: `const { data, error } = await supabase.auth.updateUser({
  data: {
    first_name: 'John Updated',
    last_name: 'Doe',
    avatar_url: 'https://example.com/new-avatar.jpg'
  }
})`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "user_metadata": {
      "first_name": "John Updated",
      "last_name": "Doe",
      "avatar_url": "https://example.com/new-avatar.jpg"
    },
    "updated_at": "2023-01-01T12:00:00.000Z"
  }
}`
          }
        ]
      },
      {
        id: 'auth-getuseridentities',
        name: '检索链接到用户的身份',
        method: 'GET',
        path: '/auth/v1/user/identities',
        description: '获取链接到当前用户的所有身份提供商',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-getuseridentities',
        responses: [
          {
            status: 200,
            description: '用户身份获取成功'
          }
        ],
        examples: [
          {
            title: '获取用户身份',
            description: '获取当前用户关联的所有身份提供商',
            request: `const { data: { user } } = await supabase.auth.getUser()
console.log(user.identities)`,
            response: `[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "identity_data": {
      "email": "user@example.com",
      "sub": "123e4567-e89b-12d3-a456-426614174000"
    },
    "provider": "email",
    "last_sign_in_at": "2023-01-01T12:00:00.000Z",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T12:00:00.000Z"
  },
  {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "identity_data": {
      "email": "user@gmail.com",
      "name": "John Doe",
      "sub": "google_user_id_123"
    },
    "provider": "google",
    "last_sign_in_at": "2023-01-02T12:00:00.000Z",
    "created_at": "2023-01-02T00:00:00.000Z",
    "updated_at": "2023-01-02T12:00:00.000Z"
  }
]`
          }
        ]
      },
      {
        id: 'auth-linkidentity',
        name: '将标识链接到用户',
        method: 'POST',
        path: '/auth/v1/user/identities/link',
        description: '将新的身份提供商链接到当前用户账户',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-linkidentity',
        requestBody: {
          type: 'application/json',
          description: '身份链接信息',
          schema: {
            type: 'object',
            properties: {
              provider: { type: 'string' }
            },
            required: ['provider']
          },
          example: {
            "provider": "google"
          }
        },
        responses: [
          {
            status: 200,
            description: '身份链接成功'
          }
        ],
        examples: [
          {
            title: '链接Google身份',
            description: '将Google账号链接到当前用户',
            request: `const { data, error } = await supabase.auth.linkIdentity({
  provider: 'google'
})`,
            response: `{
  "url": "https://accounts.google.com/oauth/authorize?..."
}`
          },
          {
            title: '链接GitHub身份',
            description: '将GitHub账号链接到当前用户',
            request: `const { data, error } = await supabase.auth.linkIdentity({
  provider: 'github'
})`,
            response: `{
  "url": "https://github.com/login/oauth/authorize?..."
}`
          }
        ]
      },
      {
        id: 'auth-unlinkidentity',
        name: '取消身份与用户的链接',
        method: 'DELETE',
        path: '/auth/v1/user/identities/{identity_id}',
        description: '取消身份提供商与当前用户的链接',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-unlinkidentity',
        parameters: [
          {
            name: 'identity_id',
            type: 'string',
            required: true,
            description: '身份ID',
            example: '456e7890-e89b-12d3-a456-426614174001'
          }
        ],
        responses: [
          {
            status: 200,
            description: '身份取消链接成功'
          }
        ],
        examples: [
          {
            title: '取消链接身份',
            description: '取消指定身份提供商的链接',
            request: `const { data, error } = await supabase.auth.unlinkIdentity({
  identity_id: '456e7890-e89b-12d3-a456-426614174001'
})`,
            response: `{}`
          }
        ]
      },
      {
        id: 'auth-reauthentication',
        name: '发送密码重新身份验证随机数',
        method: 'POST',
        path: '/auth/v1/reauthenticate',
        description: '发送重新身份验证的随机数，用于敏感操作前的身份确认',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-reauthentication',
        responses: [
          {
            status: 200,
            description: '重新身份验证随机数发送成功'
          }
        ],
        examples: [
          {
            title: '发送重新身份验证随机数',
            description: '为敏感操作发送身份验证随机数',
            request: `const { data, error } = await supabase.auth.reauthenticate()`,
            response: `{}`
          }
        ]
      },
      {
        id: 'auth-resend',
        name: '重新发送一次性密码',
        method: 'POST',
        path: '/auth/v1/resend',
        description: '重新发送确认邮件或短信验证码',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-resend',
        requestBody: {
          type: 'application/json',
          description: '重发请求信息',
          schema: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['signup', 'email_change', 'sms', 'phone_change'] },
              email: { type: 'string', format: 'email' },
              phone: { type: 'string' }
            },
            required: ['type']
          },
          example: {
            "type": "signup",
            "email": "user@example.com"
          }
        },
        responses: [
          {
            status: 200,
            description: '重发成功'
          }
        ],
        examples: [
          {
            title: '重发注册确认邮件',
            description: '重新发送注册确认邮件',
            request: `const { data, error } = await supabase.auth.resend({
  type: 'signup',
  email: 'user@example.com'
})`,
            response: `{}`
          },
          {
            title: '重发短信验证码',
            description: '重新发送短信验证码',
            request: `const { data, error } = await supabase.auth.resend({
  type: 'sms',
  phone: '+1234567890'
})`,
            response: `{}`
          }
        ]
      },
      {
        id: 'auth-setsession',
        name: '设置会话数据',
        method: 'POST',
        path: '/auth/v1/token',
        description: '手动设置用户会话，通常用于服务端渲染或跨域场景',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-setsession',
        requestBody: {
          type: 'application/json',
          description: '会话信息',
          schema: {
            type: 'object',
            properties: {
              access_token: { type: 'string' },
              refresh_token: { type: 'string' }
            },
            required: ['access_token', 'refresh_token']
          },
          example: {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "refresh_token": "v1:refresh_token_here"
          }
        },
        responses: [
          {
            status: 200,
            description: '会话设置成功'
          }
        ],
        examples: [
          {
            title: '设置会话',
            description: '手动设置用户会话令牌',
            request: `const { data, error } = await supabase.auth.setSession({
  access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  refresh_token: 'v1:refresh_token_here'
})`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "v1:refresh_token_here",
    "expires_in": 3600,
    "token_type": "bearer"
  }
}`
          }
        ]
      },
      {
        id: 'auth-exchangecodeforsession',
        name: '交换会话的身份验证代码',
        method: 'POST',
        path: '/auth/v1/token?grant_type=pkce',
        description: '使用PKCE授权码交换访问令牌',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-exchangecodeforsession',
        requestBody: {
          type: 'application/json',
          description: 'PKCE交换信息',
          schema: {
            type: 'object',
            properties: {
              auth_code: { type: 'string' },
              code_verifier: { type: 'string' }
            },
            required: ['auth_code']
          },
          example: {
            "auth_code": "authorization_code_123",
            "code_verifier": "code_verifier_123"
          }
        },
        responses: [
          {
            status: 200,
            description: '代码交换成功'
          }
        ],
        examples: [
          {
            title: '交换授权码',
            description: '使用授权码获取访问令牌',
            request: `const { data, error } = await supabase.auth.exchangeCodeForSession(
  'authorization_code_123'
)`,
            response: `{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "v1:refresh_token_here"
  }
}`
          }
        ]
      },
      {
        id: 'auth-startautorefresh',
        name: '启动自动刷新会话（非浏览器）',
        method: 'POST',
        path: '/auth/v1/token/refresh',
        description: '在非浏览器环境中启动自动令牌刷新',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-startautorefresh',
        responses: [
          {
            status: 200,
            description: '自动刷新启动成功'
          }
        ],
        examples: [
          {
            title: '启动自动刷新',
            description: '在Node.js等环境中启动自动令牌刷新',
            request: `supabase.auth.startAutoRefresh()`,
            response: `// 自动刷新已启动`
          }
        ]
      },
      {
        id: 'auth-stopautorefresh',
        name: '停止自动刷新会话（非浏览器）',
        method: 'POST',
        path: '/auth/v1/token/refresh/stop',
        description: '在非浏览器环境中停止自动令牌刷新',
        officialDocs: 'https://supabase.com/docs/reference/javascript/auth-stopautorefresh',
        responses: [
          {
            status: 200,
            description: '自动刷新停止成功'
          }
        ],
        examples: [
          {
            title: '停止自动刷新',
            description: '在Node.js等环境中停止自动令牌刷新',
            request: `supabase.auth.stopAutoRefresh()`,
            response: `// 自动刷新已停止`
          }
        ]
      }
    ]
  },  {
 
   id: 'edge-functions',
    name: '边缘功能',
    description: 'Supabase Edge Functions - 在边缘运行的无服务器函数',
    officialDocs: 'https://supabase.com/docs/reference/javascript/functions-invoke',
    endpoints: [
      {
        id: 'functions-invoke',
        name: '调用 Supabase 边缘函数',
        method: 'POST',
        path: '/functions/v1/{function_name}',
        description: '调用部署在Supabase边缘的无服务器函数',
        officialDocs: 'https://supabase.com/docs/reference/javascript/functions-invoke',
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
          description: '传递给函数的参数',
          schema: { type: 'object' },
          example: {
            "name": "World",
            "message": "Hello from client"
          }
        },
        responses: [
          {
            status: 200,
            description: '函数调用成功'
          },
          {
            status: 400,
            description: '请求参数错误'
          },
          {
            status: 404,
            description: '函数不存在'
          },
          {
            status: 500,
            description: '函数执行错误'
          }
        ],
        examples: [
          {
            title: '调用Hello World函数',
            description: '调用简单的问候函数',
            request: `const { data, error } = await supabase.functions.invoke('hello-world', {
  body: { name: 'World' }
})`,
            response: `{
  "message": "Hello World!"
}`
          },
          {
            title: '调用带认证的函数',
            description: '调用需要用户认证的函数',
            request: `const { data, error } = await supabase.functions.invoke('protected-function', {
  body: { 
    action: 'get_user_data',
    user_id: '123'
  },
  headers: {
    Authorization: \`Bearer \${session.access_token}\`
  }
})`,
            response: `{
  "user_data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}`
          },
          {
            title: '调用文件处理函数',
            description: '调用处理文件上传的函数',
            request: `const { data, error } = await supabase.functions.invoke('process-image', {
  body: {
    image_url: 'https://example.com/image.jpg',
    operations: ['resize', 'compress']
  }
})`,
            response: `{
  "processed_url": "https://example.com/processed-image.jpg",
  "operations_applied": ["resize", "compress"],
  "file_size": 1024000
}`
          },
          {
            title: '调用数据分析函数',
            description: '调用进行数据分析的函数',
            request: `const { data, error } = await supabase.functions.invoke('analytics', {
  body: {
    event_type: 'page_view',
    page: '/dashboard',
    user_id: '123',
    timestamp: new Date().toISOString()
  }
})`,
            response: `{
  "status": "recorded",
  "event_id": "evt_123456789",
  "processed_at": "2023-01-01T12:00:00.000Z"
}`
          }
        ]
      }
    ]
  },
  {
    id: 'realtime',
    name: '实时',
    description: 'Supabase Realtime - 实时数据订阅和广播功能',
    officialDocs: 'https://supabase.com/docs/reference/javascript/subscribe',
    endpoints: [
      {
        id: 'realtime-subscribe',
        name: '订阅频道',
        method: 'WebSocket',
        path: '/realtime/v1/websocket',
        description: '订阅实时频道，监听数据库变化、广播消息等',
        officialDocs: 'https://supabase.com/docs/reference/javascript/subscribe',
        parameters: [
          {
            name: 'channel',
            type: 'string',
            required: true,
            description: '频道名称',
            example: 'public:users'
          },
          {
            name: 'event',
            type: 'string',
            required: false,
            description: '监听的事件类型',
            example: 'INSERT'
          },
          {
            name: 'schema',
            type: 'string',
            required: false,
            description: '数据库模式',
            example: 'public'
          },
          {
            name: 'table',
            type: 'string',
            required: false,
            description: '表名',
            example: 'users'
          }
        ],
        responses: [
          {
            status: 200,
            description: '订阅成功'
          }
        ],
        examples: [
          {
            title: '订阅表变化',
            description: '监听用户表的所有变化',
            request: `const channel = supabase
  .channel('public:users')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'users' 
    }, 
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()`,
            response: `// 当用户表有变化时触发
{
  "eventType": "INSERT",
  "new": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2023-01-01T12:00:00.000Z"
  },
  "old": {},
  "schema": "public",
  "table": "users",
  "commit_timestamp": "2023-01-01T12:00:00.000Z"
}`
          },
          {
            title: '订阅特定事件',
            description: '只监听插入事件',
            request: `const channel = supabase
  .channel('user-inserts')
  .on('postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'users'
    },
    (payload) => {
      console.log('New user created:', payload.new)
    }
  )
  .subscribe()`,
            response: `// 新用户创建时触发
{
  "eventType": "INSERT",
  "new": {
    "id": 2,
    "name": "Alice Smith",
    "email": "alice@example.com"
  },
  "schema": "public",
  "table": "users"
}`
          },
          {
            title: '订阅行级变化',
            description: '监听特定行的变化',
            request: `const channel = supabase
  .channel('user-123-changes')
  .on('postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'users',
      filter: 'id=eq.123'
    },
    (payload) => {
      console.log('User 123 changed:', payload)
    }
  )
  .subscribe()`,
            response: `// 用户ID为123的记录变化时触发
{
  "eventType": "UPDATE",
  "new": {
    "id": 123,
    "name": "John Updated",
    "email": "john.updated@example.com"
  },
  "old": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  }
}`
          },
          {
            title: '订阅广播消息',
            description: '监听自定义广播消息',
            request: `const channel = supabase
  .channel('room-1')
  .on('broadcast', 
    { event: 'message' }, 
    (payload) => {
      console.log('Broadcast received:', payload)
    }
  )
  .subscribe()`,
            response: `// 收到广播消息时触发
{
  "event": "message",
  "payload": {
    "user": "John",
    "message": "Hello everyone!",
    "timestamp": "2023-01-01T12:00:00.000Z"
  }
}`
          },
          {
            title: '订阅在线状态',
            description: '监听用户在线状态变化',
            request: `const channel = supabase
  .channel('online-users', {
    config: {
      presence: {
        key: 'user-123'
      }
    }
  })
  .on('presence', { event: 'sync' }, () => {
    const newState = channel.presenceState()
    console.log('Online users:', newState)
  })
  .on('presence', { event: 'join' }, ({ key, newPresences }) => {
    console.log('User joined:', key, newPresences)
  })
  .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    console.log('User left:', key, leftPresences)
  })
  .subscribe()`,
            response: `// 用户上线时触发
{
  "event": "join",
  "key": "user-456",
  "newPresences": [
    {
      "user_id": "456",
      "username": "Alice",
      "online_at": "2023-01-01T12:00:00.000Z"
    }
  ]
}`
          }
        ]
      },
      {
        id: 'realtime-removechannel',
        name: '取消订阅频道',
        method: 'WebSocket',
        path: '/realtime/v1/websocket',
        description: '取消订阅指定的实时频道',
        officialDocs: 'https://supabase.com/docs/reference/javascript/removechannel',
        responses: [
          {
            status: 200,
            description: '取消订阅成功'
          }
        ],
        examples: [
          {
            title: '取消订阅频道',
            description: '取消订阅指定的频道',
            request: `const channel = supabase.channel('public:users')

// 订阅频道
channel.subscribe()

// 取消订阅
supabase.removeChannel(channel)`,
            response: `// 频道已取消订阅`
          },
          {
            title: '取消订阅并清理',
            description: '取消订阅频道并清理相关资源',
            request: `const channel = supabase.channel('room-1')

channel.subscribe()

// 取消订阅
await supabase.removeChannel(channel)

console.log('Channel removed')`,
            response: `// 频道已移除并清理资源`
          }
        ]
      },
      {
        id: 'realtime-removeallchannels',
        name: '取消订阅所有频道',
        method: 'WebSocket',
        path: '/realtime/v1/websocket',
        description: '取消订阅所有当前活跃的实时频道',
        officialDocs: 'https://supabase.com/docs/reference/javascript/removeallchannels',
        responses: [
          {
            status: 200,
            description: '取消所有订阅成功'
          }
        ],
        examples: [
          {
            title: '取消所有订阅',
            description: '一次性取消所有频道订阅',
            request: `// 订阅多个频道
const channel1 = supabase.channel('public:users').subscribe()
const channel2 = supabase.channel('public:posts').subscribe()
const channel3 = supabase.channel('room-1').subscribe()

// 取消所有订阅
await supabase.removeAllChannels()

console.log('All channels removed')`,
            response: `// 所有频道已取消订阅`
          }
        ]
      },
      {
        id: 'realtime-getchannels',
        name: '检索所有通道',
        method: 'GET',
        path: '/realtime/v1/channels',
        description: '获取当前所有活跃的实时频道列表',
        officialDocs: 'https://supabase.com/docs/reference/javascript/getchannels',
        responses: [
          {
            status: 200,
            description: '频道列表获取成功'
          }
        ],
        examples: [
          {
            title: '获取所有频道',
            description: '获取当前活跃的所有频道',
            request: `const channels = supabase.getChannels()

console.log('Active channels:', channels)`,
            response: `[
  {
    "topic": "realtime:public:users",
    "ref": "1",
    "joinRef": "1",
    "state": "joined"
  },
  {
    "topic": "realtime:room-1",
    "ref": "2", 
    "joinRef": "2",
    "state": "joined"
  }
]`
          }
        ]
      },
      {
        id: 'realtime-broadcast',
        name: '广播消息',
        method: 'WebSocket',
        path: '/realtime/v1/websocket',
        description: '向频道中的所有订阅者广播消息',
        officialDocs: 'https://supabase.com/docs/reference/javascript/broadcastmessage',
        parameters: [
          {
            name: 'event',
            type: 'string',
            required: true,
            description: '事件名称',
            example: 'message'
          },
          {
            name: 'payload',
            type: 'object',
            required: true,
            description: '消息内容',
            example: '{ "text": "Hello World" }'
          }
        ],
        responses: [
          {
            status: 200,
            description: '消息广播成功'
          }
        ],
        examples: [
          {
            title: '发送聊天消息',
            description: '在聊天室中广播消息',
            request: `const channel = supabase.channel('room-1')

// 发送消息
channel.send({
  type: 'broadcast',
  event: 'message',
  payload: {
    user: 'John',
    message: 'Hello everyone!',
    timestamp: new Date().toISOString()
  }
})`,
            response: `// 消息已广播给所有订阅者`
          },
          {
            title: '发送系统通知',
            description: '广播系统通知消息',
            request: `const channel = supabase.channel('notifications')

channel.send({
  type: 'broadcast',
  event: 'system_notification',
  payload: {
    type: 'maintenance',
    message: 'System will be under maintenance in 10 minutes',
    severity: 'warning',
    timestamp: new Date().toISOString()
  }
})`,
            response: `// 系统通知已广播`
          },
          {
            title: '发送游戏状态更新',
            description: '在游戏中广播状态更新',
            request: `const gameChannel = supabase.channel('game-room-123')

gameChannel.send({
  type: 'broadcast',
  event: 'game_update',
  payload: {
    player_id: 'player-456',
    action: 'move',
    position: { x: 100, y: 200 },
    timestamp: Date.now()
  }
})`,
            response: `// 游戏状态更新已广播`
          },
          {
            title: '更新在线状态',
            description: '广播用户在线状态变化',
            request: `const presenceChannel = supabase.channel('online-users')

// 跟踪用户在线状态
presenceChannel.track({
  user_id: '123',
  username: 'John',
  status: 'online',
  last_seen: new Date().toISOString()
})`,
            response: `// 在线状态已更新并广播`
          }
        ]
      }
    ]
  },  {
 
   id: 'storage',
    name: '存储',
    description: 'Supabase Storage - 文件存储和管理功能',
    officialDocs: 'https://supabase.com/docs/reference/javascript/storage-createbucket',
    endpoints: [
      {
        id: 'storage-createbucket',
        name: '创建存储桶',
        method: 'POST',
        path: '/storage/v1/bucket',
        description: '创建新的存储桶用于文件存储',
        officialDocs: 'https://supabase.com/docs/reference/javascript/storage-createbucket',
        requestBody: {
          type: 'application/json',
          description: '存储桶配置',
          schema: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              public: { type: 'boolean', default: false },
              file_size_limit: { type: 'number' },
              allowed_mime_types: { type: 'array', items: { type: 'string' } }
            },
            required: ['id']
          },
          example: {
            "id": "avatars",
            "name": "User Avatars",
            "public": true,
            "file_size_limit": 1048576,
            "allowed_mime_types": ["image/png", "image/jpeg"]
          }
        },
        responses: [
          {
            status: 200,
            description: '存储桶创建成功'
          }
        ],
        examples: [
          {
            title: '创建公共存储桶',
            description: '创建用于存储用户头像的公共存储桶',
            request: `const { data, error } = await supabase.storage.createBucket('avatars', {
  public: true,
  fileSizeLimit: 1024 * 1024, // 1MB
  allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif']
})`,
            response: `{
  "name": "avatars"
}`
          },
          {
            title: '创建私有存储桶',
            description: '创建用于存储私人文档的存储桶',
            request: `const { data, error } = await supabase.storage.createBucket('documents', {
  public: false,
  fileSizeLimit: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: ['application/pdf', 'application/msword']
})`,
            response: `{
  "name": "documents"
}`
          }
        ]
      },
      {
        id: 'storage-getbucket',
        name: '检索存储桶',
        method: 'GET',
        path: '/storage/v1/bucket/{bucket_id}',
        description: '获取指定存储桶的详细信息',
        officialDocs: 'https://supabase.com/docs/reference/javascript/storage-getbucket',
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
            description: '存储桶信息获取成功'
          }
        ],
        examples: [
          {
            title: '获取存储桶信息',
            description: '获取指定存储桶的详细配置',
            request: `const { data, error } = await supabase.storage.getBucket('avatars')`,
            response: `{
  "id": "avatars",
  "name": "avatars",
  "owner": "project_owner_id",
  "public": true,
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z",
  "file_size_limit": 1048576,
  "allowed_mime_types": ["image/png", "image/jpeg", "image/gif"]
}`
          }
        ]
      },
      {
        id: 'storage-listbuckets',
        name: '列出所有存储桶',
        method: 'GET',
        path: '/storage/v1/bucket',
        description: '获取项目中所有存储桶的列表',
        officialDocs: 'https://supabase.com/docs/reference/javascript/storage-listbuckets',
        responses: [
          {
            status: 200,
            description: '存储桶列表获取成功'
          }
        ],
        examples: [
          {
            title: '列出所有存储桶',
            description: '获取项目中的所有存储桶',
            request: `const { data, error } = await supabase.storage.listBuckets()`,
            response: `[
  {
    "id": "avatars",
    "name": "avatars",
    "public": true,
    "created_at": "2023-01-01T00:00:00.000Z"
  },
  {
    "id": "documents",
    "name": "documents", 
    "public": false,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
]`
          }
        ]
      },
      {
        id: 'storage-updatebucket',
        name: '更新存储桶',
        method: 'PUT',
        path: '/storage/v1/bucket/{bucket_id}',
        description: '更新存储桶的配置信息',
        officialDocs: 'https://supabase.com/docs/reference/javascript/storage-updatebucket',
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
          description: '更新的存储桶配置',
          schema: {
            type: 'object',
            properties: {
              public: { type: 'boolean' },
              file_size_limit: { type: 'number' },
              allowed_mime_types: { type: 'array', items: { type: 'string' } }
            }
          },
          example: {
            "public": false,
            "file_size_limit": 2097152,
            "allowed_mime_types": ["image/png", "image/jpeg", "image/webp"]
          }
        },
        responses: [
          {
            status: 200,
            description: '存储桶更新成功'
          }
        ],
        examples: [
          {
            title: '更新存储桶配置',
            description: '修改存储桶的公开性和文件大小限制',
            request: `const { data, error } = await supabase.storage.updateBucket('avatars', {
  public: false,
  fileSizeLimit: 2 * 1024 * 1024, // 2MB
  allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
})`,
            response: `{
  "message": "Successfully updated"
}`
          }
        ]
      },
      {
        id: 'storage-deletebucket',
        name: '删除存储桶',
        method: 'DELETE',
        path: '/storage/v1/bucket/{bucket_id}',
        description: '删除指定的存储桶（必须为空）',
        officialDocs: 'https://supabase.com/docs/reference/javascript/storage-deletebucket',
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
            description: '存储桶删除成功'
          }
        ],
        examples: [
          {
            title: '删除存储桶',
            description: '删除空的存储桶',
            request: `const { data, error } = await supabase.storage.deleteBucket('old-bucket')`,
            response: `{
  "message": "Successfully deleted"
}`
          }
        ]
      },
      {
        id: 'storage-emptybucket',
        name: '清空一个桶',
        method: 'POST',
        path: '/storage/v1/bucket/{bucket_id}/empty',
        description: '删除存储桶中的所有文件',
        officialDocs: 'https://supabase.com/docs/reference/javascript/storage-emptybucket',
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
            description: '存储桶清空成功'
          }
        ],
        examples: [
          {
            title: '清空存储桶',
            description: '删除存储桶中的所有文件',
            request: `const { data, error } = await supabase.storage.emptyBucket('temp-files')`,
            response: `{
  "message": "Successfully emptied"
}`
          }
        ]
      },
      {
        id: 'storage-upload',
        name: '上传文件',
        method: 'POST',
        path: '/storage/v1/object/{bucket_id}/{file_path}',
        description: '上传文件到指定存储桶',
        officialDocs: 'https://supabase.com/docs/reference/javascript/storage-from-upload',
        parameters: [
          {
            name: 'bucket_id',
            type: 'string',
            required: true,
            description: '存储桶ID',
            example: 'avatars'
          },
          {
            name: 'file_path',
            type: 'string',
            required: true,
            description: '文件路径',
            example: 'user123/avatar.jpg'
          }
        ],
        requestBody: {
          type: 'multipart/form-data',
          description: '文件数据',
          schema: {
            type: 'object',
            properties: {
              file: { type: 'string', format: 'binary' }
            }
          },
          example: 'File binary data'
        },
        responses: [
          {
            status: 200,
            description: '文件上传成功'
          }
        ],
        examples: [
          {
            title: '上传用户头像',
            description: '上传图片文件作为用户头像',
            request: `const file = event.target.files[0]
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(\`user123/avatar_\${Date.now()}.jpg\`, file, {
    cacheControl: '3600',
    upsert: false
  })`,
            response: `{
  "path": "user123/avatar_1672531200000.jpg"
}`
          },
          {
            title: '上传文档文件',
            description: '上传PDF文档到私有存储桶',
            request: `const file = document.getElementById('fileInput').files[0]
const { data, error } = await supabase.storage
  .from('documents')
  .upload(\`contracts/\${file.name}\`, file, {
    cacheControl: '3600',
    upsert: true
  })`,
            response: `{
  "path": "contracts/contract_2023.pdf"
}`
          },
          {
            title: '上传Base64图片',
            description: '上传Base64编码的图片',
            request: `const base64Data = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...'
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('user456/profile.png', 
    decode(base64Data.split(',')[1]), {
    contentType: 'image/png'
  })`,
            response: `{
  "path": "user456/profile.png"
}`
          }
        ]
      },
      {
        id: 'storage-download',
        name: '下载文件',
        method: 'GET',
        path: '/storage/v1/object/{bucket_id}/{file_path}',
        description: '从存储桶下载文件',
        officialDocs: 'https://supabase.com/docs/reference/javascript/storage-from-download',
        parameters: [
          {
            name: 'bucket_id',
            type: 'string',
            required: true,
            description: '存储桶ID',
            example: 'avatars'
          },
          {
            name: 'file_path',
            type: 'string',
            required: true,
            description: '文件路径',
            example: 'user123/avatar.jpg'
          }
        ],
        responses: [
          {
            status: 200,
            description: '文件下载成功'
          }
        ],
        examples: [
          {
            title: '下载用户头像',
            description: '下载用户的头像文件',
            request: `const { data, error } = await supabase.storage
  .from('avatars')
  .download('user123/avatar.jpg')

if (data) {
  const url = URL.createObjectURL(data)
  // 使用 url 显示图片或下载文件
}`,
            response: `// Blob 对象包含文件数据`
          },
          {
            title: '下载文档',
            description: '下载PDF文档文件',
            request: `const { data, error } = await supabase.storage
  .from('documents')
  .download('contracts/contract_2023.pdf')

if (data) {
  const url = URL.createObjectURL(data)
  const a = document.createElement('a')
  a.href = url
  a.download = 'contract_2023.pdf'
  a.click()
}`,
            response: `// 文件开始下载`
          }
        ]
      },
      {
        id: 'storage-list',
        name: '列出存储桶中的所有文件',
        method: 'POST',
        path: '/storage/v1/object/list/{bucket_id}',
        description: '列出存储桶中指定路径下的所有文件',
        officialDocs: 'https://supabase.com/docs/reference/javascript/storage-from-list',
        parameters: [
          {
            name: 'bucket_id',
            type: 'string',
            required: true,
            description: '存储桶ID',
            example: 'avatars'
          },
          {
            name: 'path',
            type: 'string',
            required: false,
            description: '文件夹路径',
            example: 'user123/'
          },
          {
            name: 'limit',
            type: 'number',
            required: false,
            description: '返回文件数量限制',
            example: '100'
          },
          {
            name: 'offset',
            type: 'number',
            required: false,
            description: '跳过的文件数量',
            example: '0'
          }
        ],
        responses: [
          {
            status: 200,
            description: '文件列表获取成功'
          }
        ],
        examples: [
          {
            title: '列出所有文件',
            description: '获取存储桶中的所有文件',
            request: `const { data, error } = await supabase.storage
  .from('avatars')
  .list()`,
            response: `[
  {
    "name": "user123",
    "id": null,
    "updated_at": null,
    "created_at": null,
    "last_accessed_at": null,
    "metadata": null
  },
  {
    "name": "user456",
    "id": null,
    "updated_at": null,
    "created_at": null,
    "last_accessed_at": null,
    "metadata": null
  }
]`
          },
          {
            title: '列出指定文件夹的文件',
            description: '获取特定用户文件夹中的文件',
            request: `const { data, error } = await supabase.storage
  .from('avatars')
  .list('user123/', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' }
  })`,
            response: `[
  {
    "name": "avatar.jpg",
    "id": "file_id_123",
    "updated_at": "2023-01-01T12:00:00.000Z",
    "created_at": "2023-01-01T12:00:00.000Z",
    "last_accessed_at": "2023-01-01T12:00:00.000Z",
    "metadata": {
      "eTag": "\"abc123\"",
      "size": 1024000,
      "mimetype": "image/jpeg",
      "cacheControl": "max-age=3600"
    }
  }
]`
          }
        ]
      },
      {
        id: 'storage-update',
        name: '替换现有文件',
        method: 'PUT',
        path: '/storage/v1/object/{bucket_id}/{file_path}',
        description: '替换存储桶中的现有文件',
        officialDocs: 'https://supabase.com/docs/reference/javascript/storage-from-update',
        parameters: [
          {
            name: 'bucket_id',
            type: 'string',
            required: true,
            description: '存储桶ID',
            example: 'avatars'
          },
          {
            name: 'file_path',
            type: 'string',
            required: true,
            description: '文件路径',
            example: 'user123/avatar.jpg'
          }
        ],
        requestBody: {
          type: 'multipart/form-data',
          description: '新的文件数据',
          schema: {
            type: 'object',
            properties: {
              file: { type: 'string', format: 'binary' }
            }
          },
          example: 'New file binary data'
        },
        responses: [
          {
            status: 200,
            description: '文件替换成功'
          }
        ],
        examples: [
          {
            title: '更新用户头像',
            description: '替换用户的头像文件',
            request: `const newFile = event.target.files[0]
const { data, error } = await supabase.storage
  .from('avatars')
  .update('user123/avatar.jpg', newFile, {
    cacheControl: '3600',
    upsert: true
  })`,
            response: `{
  "path": "user123/avatar.jpg"
}`
          }
        ]
      },
      {
        id: 'storage-move',
        name: '移动现有文件',
        method: 'POST',
        path: '/storage/v1/object/move',
        description: '移动或重命名存储桶中的文件',
        officialDocs: 'https://supabase.com/docs/reference/javascript/storage-from-move',
        requestBody: {
          type: 'application/json',
          description: '移动操作信息',
          schema: {
            type: 'object',
            properties: {
              bucketId: { type: 'string' },
              sourceKey: { type: 'string' },
              destinationKey: { type: 'string' }
            },
            required: ['bucketId', 'sourceKey', 'destinationKey']
          },
          example: {
            "bucketId": "avatars",
            "sourceKey": "user123/old_avatar.jpg",
            "destinationKey": "user123/new_avatar.jpg"
          }
        },
        responses: [
          {
            status: 200,
            description: '文件移动成功'
          }
        ],
        examples: [
          {
            title: '重命名文件',
            description: '重命名用户头像文件',
            request: `const { data, error } = await supabase.storage
  .from('avatars')
  .move('user123/old_avatar.jpg', 'user123/new_avatar.jpg')`,
            response: `{
  "message": "Successfully moved"
}`
          },
          {
            title: '移动文件到新文件夹',
            description: '将文件移动到不同的文件夹',
            request: `const { data, error } = await supabase.storage
  .from('documents')
  .move('temp/document.pdf', 'archived/2023/document.pdf')`,
            response: `{
  "message": "Successfully moved"
}`
          }
        ]
      },
      {
        id: 'storage-copy',
        name: '复制现有文件',
        method: 'POST',
        path: '/storage/v1/object/copy',
        description: '复制存储桶中的文件到新位置',
        officialDocs: 'https://supabase.com/docs/reference/javascript/storage-from-copy',
        requestBody: {
          type: 'application/json',
          description: '复制操作信息',
          schema: {
            type: 'object',
            properties: {
              bucketId: { type: 'string' },
              sourceKey: { type: 'string' },
              destinationKey: { type: 'string' }
            },
            required: ['bucketId', 'sourceKey', 'destinationKey']
          },
          example: {
            "bucketId": "avatars",
            "sourceKey": "user123/avatar.jpg",
            "destinationKey": "user123/avatar_backup.jpg"
          }
        },
        responses: [
          {
            status: 200,
            description: '文件复制成功'
          }
        ],
        examples: [
          {
            title: '备份文件',
            description: '创建文件的备份副本',
            request: `const { data, error } = await supabase.storage
  .from('avatars')
  .copy('user123/avatar.jpg', 'user123/avatar_backup.jpg')`,
            response: `{
  "path": "user123/avatar_backup.jpg"
}`
          },
          {
            title: '复制模板文件',
            description: '复制模板文件给新用户使用',
            request: `const { data, error } = await supabase.storage
  .from('documents')
  .copy('templates/default_contract.pdf', \`users/\${userId}/contract.pdf\`)`,
            response: `{
  "path": "users/user456/contract.pdf"
}`
          }
        ]
      },
      {
        id: 'storage-remove',
        name: '删除存储桶中的文件',
        method: 'DELETE',
        path: '/storage/v1/object/{bucket_id}',
        description: '删除存储桶中的一个或多个文件',
        officialDocs: 'https://supabase.com/docs/reference/javascript/storage-from-remove',
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
          description: '要删除的文件路径列表',
          schema: {
            type: 'array',
            items: { type: 'string' }
          },
          example: ["user123/avatar.jpg", "user123/old_avatar.jpg"]
        },
        responses: [
          {
            status: 200,
            description: '文件删除成功'
          }
        ],
        examples: [
          {
            title: '删除单个文件',
            description: '删除用户的头像文件',
            request: `const { data, error } = await supabase.storage
  .from('avatars')
  .remove(['user123/avatar.jpg'])`,
            response: `[
  {
    "name": "user123/avatar.jpg"
  }
]`
          },
          {
            title: '批量删除文件',
            description: '删除多个文件',
            request: `const { data, error } = await supabase.storage
  .from('temp-files')
  .remove([
    'temp/file1.txt',
    'temp/file2.txt',
    'temp/file3.txt'
  ])`,
            response: `[
  {
    "name": "temp/file1.txt"
  },
  {
    "name": "temp/file2.txt"
  },
  {
    "name": "temp/file3.txt"
  }
]`
          }
        ]
      },
      {
        id: 'storage-createsignedurl',
        name: '创建签名 URL',
        method: 'POST',
        path: '/storage/v1/object/sign/{bucket_id}/{file_path}',
        description: '为私有文件创建临时访问的签名URL',
        officialDocs: 'https://supabase.com/docs/reference/javascript/storage-from-createsignedurl',
        parameters: [
          {
            name: 'bucket_id',
            type: 'string',
            required: true,
            description: '存储桶ID',
            example: 'documents'
          },
          {
            name: 'file_path',
            type: 'string',
            required: true,
            description: '文件路径',
            example: 'user123/contract.pdf'
          },
          {
            name: 'expires_in',
            type: 'number',
            required: true,
            description: 'URL过期时间（秒）',
            example: '3600'
          }
        ],
        responses: [
          {
            status: 200,
            description: '签名URL创建成功'
          }
        ],
        examples: [
          {
            title: '创建文档访问链接',
            description: '为私有文档创建1小时有效的访问链接',
            request: `const { data, error } = await supabase.storage
  .from('documents')
  .createSignedUrl('user123/contract.pdf', 3600)`,
            response: `{
  "signedUrl": "https://your-project.supabase.co/storage/v1/object/sign/documents/user123/contract.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`
          },
          {
            title: '创建图片预览链接',
            description: '为私有图片创建临时预览链接',
            request: `const { data, error } = await supabase.storage
  .from('private-images')
  .createSignedUrl('gallery/image123.jpg', 1800, {
    download: false
  })`,
            response: `{
  "signedUrl": "https://your-project.supabase.co/storage/v1/object/sign/private-images/gallery/image123.jpg?token=..."
}`
          }
        ]
      },
      {
        id: 'storage-createsignedurls',
        name: '创建签名 URL（批量）',
        method: 'POST',
        path: '/storage/v1/object/sign/{bucket_id}',
        description: '批量为多个私有文件创建签名URL',
        officialDocs: 'https://supabase.com/docs/reference/javascript/storage-from-createsignedurls',
        parameters: [
          {
            name: 'bucket_id',
            type: 'string',
            required: true,
            description: '存储桶ID',
            example: 'documents'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '文件路径和过期时间',
          schema: {
            type: 'object',
            properties: {
              paths: { type: 'array', items: { type: 'string' } },
              expires_in: { type: 'number' }
            },
            required: ['paths', 'expires_in']
          },
          example: {
            "paths": ["user123/doc1.pdf", "user123/doc2.pdf"],
            "expires_in": 3600
          }
        },
        responses: [
          {
            status: 200,
            description: '批量签名URL创建成功'
          }
        ],
        examples: [
          {
            title: '批量创建文档链接',
            description: '为多个文档创建访问链接',
            request: `const { data, error } = await supabase.storage
  .from('documents')
  .createSignedUrls([
    'user123/contract.pdf',
    'user123/invoice.pdf',
    'user123/receipt.pdf'
  ], 3600)`,
            response: `[
  {
    "path": "user123/contract.pdf",
    "signedUrl": "https://your-project.supabase.co/storage/v1/object/sign/documents/user123/contract.pdf?token=..."
  },
  {
    "path": "user123/invoice.pdf", 
    "signedUrl": "https://your-project.supabase.co/storage/v1/object/sign/documents/user123/invoice.pdf?token=..."
  },
  {
    "path": "user123/receipt.pdf",
    "signedUrl": "https://your-project.supabase.co/storage/v1/object/sign/documents/user123/receipt.pdf?token=..."
  }
]`
          }
        ]
      },
      {
        id: 'storage-createsigneduploadurl',
        name: '创建签名上传 URL',
        method: 'POST',
        path: '/storage/v1/object/upload/sign/{bucket_id}/{file_path}',
        description: '创建用于直接上传文件的签名URL',
        officialDocs: 'https://supabase.com/docs/reference/javascript/storage-from-createsigneduploadurl',
        parameters: [
          {
            name: 'bucket_id',
            type: 'string',
            required: true,
            description: '存储桶ID',
            example: 'avatars'
          },
          {
            name: 'file_path',
            type: 'string',
            required: true,
            description: '文件路径',
            example: 'user123/avatar.jpg'
          }
        ],
        responses: [
          {
            status: 200,
            description: '签名上传URL创建成功'
          }
        ],
        examples: [
          {
            title: '创建上传链接',
            description: '为客户端直接上传创建签名URL',
            request: `const { data, error } = await supabase.storage
  .from('avatars')
  .createSignedUploadUrl(\`user123/avatar_\${Date.now()}.jpg\`)`,
            response: `{
  "signedUrl": "https://your-project.supabase.co/storage/v1/object/upload/sign/avatars/user123/avatar_1672531200000.jpg?token=...",
  "path": "user123/avatar_1672531200000.jpg",
  "token": "upload_token_123"
}`
          }
        ]
      },
      {
        id: 'storage-uploadtosignedurl',
        name: '上传到签名的 URL',
        method: 'PUT',
        path: '{signed_upload_url}',
        description: '使用签名URL直接上传文件',
        officialDocs: 'https://supabase.com/docs/reference/javascript/storage-from-uploadtosignedurl',
        requestBody: {
          type: 'multipart/form-data',
          description: '文件数据和令牌',
          schema: {
            type: 'object',
            properties: {
              file: { type: 'string', format: 'binary' },
              token: { type: 'string' }
            }
          },
          example: 'File binary data with upload token'
        },
        responses: [
          {
            status: 200,
            description: '文件上传成功'
          }
        ],
        examples: [
          {
            title: '使用签名URL上传',
            description: '使用预签名URL直接上传文件',
            request: `// 首先创建签名上传URL
const { data: uploadData, error: uploadError } = await supabase.storage
  .from('avatars')
  .createSignedUploadUrl('user123/avatar.jpg')

if (uploadData) {
  const file = event.target.files[0]
  
  // 使用签名URL上传文件
  const { data, error } = await supabase.storage
    .from('avatars')
    .uploadToSignedUrl(uploadData.path, uploadData.token, file)
}`,
            response: `{
  "path": "user123/avatar.jpg"
}`
          }
        ]
      },
      {
        id: 'storage-getpublicurl',
        name: '检索公共 URL',
        method: 'GET',
        path: '/storage/v1/object/public/{bucket_id}/{file_path}',
        description: '获取公共存储桶中文件的公共访问URL',
        officialDocs: 'https://supabase.com/docs/reference/javascript/storage-from-getpublicurl',
        parameters: [
          {
            name: 'bucket_id',
            type: 'string',
            required: true,
            description: '存储桶ID',
            example: 'avatars'
          },
          {
            name: 'file_path',
            type: 'string',
            required: true,
            description: '文件路径',
            example: 'user123/avatar.jpg'
          }
        ],
        responses: [
          {
            status: 200,
            description: '公共URL获取成功'
          }
        ],
        examples: [
          {
            title: '获取头像公共链接',
            description: '获取用户头像的公共访问URL',
            request: `const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('user123/avatar.jpg')

console.log('Public URL:', data.publicUrl)`,
            response: `{
  "publicUrl": "https://your-project.supabase.co/storage/v1/object/public/avatars/user123/avatar.jpg"
}`
          },
          {
            title: '获取带变换的图片URL',
            description: '获取经过图片变换的公共URL',
            request: `const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('user123/avatar.jpg', {
    transform: {
      width: 200,
      height: 200,
      resize: 'cover'
    }
  })`,
            response: `{
  "publicUrl": "https://your-project.supabase.co/storage/v1/object/public/avatars/user123/avatar.jpg?width=200&height=200&resize=cover"
}`
          }
        ]
      }
    ]
  }
]