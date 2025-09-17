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
    name: '数据库 (JS SDK)',
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
            name: 'column_filter',
            type: 'string',
            required: false,
            description: '列过滤条件，直接作为查询参数，格式：column=operator.value',
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
          },
          {
            name: 'range',
            type: 'string',
            required: false,
            description: '范围查询，格式：start-end',
            example: '0-9'
          },
          {
            name: 'prefer',
            type: 'string',
            required: false,
            description: '首选项设置，如返回格式',
            example: 'return=representation'
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
          },
          {
            name: 'select',
            type: 'string',
            required: false,
            description: '选择要返回的列',
            example: 'id,name,email'
          },
          {
            name: 'count',
            type: 'string',
            required: false,
            description: '返回计数类型',
            example: 'exact'
          },
          {
            name: 'prefer',
            type: 'string',
            required: false,
            description: '首选项设置，如返回格式',
            example: 'return=representation'
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
          },
          {
            name: 'column_filter',
            type: 'string',
            required: true,
            description: '过滤条件（必需），格式：column=operator.value',
            example: 'id=eq.1'
          },
          {
            name: 'select',
            type: 'string',
            required: false,
            description: '选择要返回的列',
            example: 'id,name,email'
          },
          {
            name: 'count',
            type: 'string',
            required: false,
            description: '返回计数类型',
            example: 'exact'
          },
          {
            name: 'prefer',
            type: 'string',
            required: false,
            description: '首选项设置，如返回格式',
            example: 'return=representation'
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
          },
          {
            name: 'onConflict',
            type: 'string',
            required: false,
            description: '冲突时的处理列，指定唯一约束列',
            example: 'email'
          },
          {
            name: 'ignoreDuplicates',
            type: 'boolean',
            required: false,
            description: '是否忽略重复数据',
            example: 'false'
          },
          {
            name: 'count',
            type: 'string',
            required: false,
            description: '返回计数类型',
            example: 'exact'
          },
          {
            name: 'select',
            type: 'string',
            required: false,
            description: '选择要返回的列',
            example: 'id,name,email'
          },
          {
            name: 'prefer',
            type: 'string',
            required: false,
            description: '首选项设置，如返回格式和冲突解决',
            example: 'return=representation'
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
            title: '指定冲突列的 Upsert',
            description: '基于邮箱唯一约束进行upsert操作',
            request: `const { data, error } = await supabase
  .from('users')
  .upsert({ 
    name: 'John Smith', 
    email: 'john@example.com',
    age: 30
  }, { 
    onConflict: 'email' 
  })
  .select()`,
            response: `[
  {
    "id": 1,
    "name": "John Smith",
    "email": "john@example.com",
    "age": 30,
    "updated_at": "2023-01-01T12:00:00.000Z"
  }
]`
          },
          {
            title: '忽略重复数据的 Upsert',
            description: '当数据重复时忽略插入',
            request: `const { data, error } = await supabase
  .from('users')
  .upsert([
    { email: 'john@example.com', name: 'John' },
    { email: 'jane@example.com', name: 'Jane' }
  ], { 
    onConflict: 'email',
    ignoreDuplicates: true 
  })
  .select()`,
            response: `[
  {
    "id": 2,
    "name": "Jane",
    "email": "jane@example.com",
    "created_at": "2023-01-01T12:00:00.000Z"
  }
]`
          },
          {
            title: '批量 Upsert 带计数',
            description: '批量插入或更新多条记录并返回计数',
            request: `const { data, error, count } = await supabase
  .from('users')
  .upsert([
    { id: 1, name: 'John Updated' },
    { id: 2, name: 'Alice Updated' },
    { name: 'New User', email: 'new@example.com' }
  ], { count: 'exact' })
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
          },
          {
            name: 'column_filter',
            type: 'string',
            required: true,
            description: '过滤条件（必需），格式：column=operator.value',
            example: 'id=eq.1'
          },
          {
            name: 'select',
            type: 'string',
            required: false,
            description: '选择要返回的列',
            example: 'id,name,email'
          },
          {
            name: 'count',
            type: 'string',
            required: false,
            description: '返回计数类型',
            example: 'exact'
          },
          {
            name: 'prefer',
            type: 'string',
            required: false,
            description: '首选项设置，如返回格式',
            example: 'return=representation'
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
          },
          {
            name: 'count',
            type: 'string',
            required: false,
            description: '返回计数类型',
            example: 'exact'
          },
          {
            name: 'prefer',
            type: 'string',
            required: false,
            description: '首选项设置',
            example: 'return=representation'
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
    name: '认证 (JS SDK)',
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
          },
          {
            name: 'scopes',
            type: 'string',
            required: false,
            description: '请求的权限范围',
            example: 'repo user'
          },
          {
            name: 'query_params',
            type: 'object',
            required: false,
            description: '额外的查询参数',
            example: '{"access_type": "offline"}'
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
          },
          {
            name: 'cacheControl',
            type: 'string',
            required: false,
            description: '缓存控制头',
            example: '3600'
          },
          {
            name: 'contentType',
            type: 'string',
            required: false,
            description: '文件MIME类型',
            example: 'image/jpeg'
          },
          {
            name: 'upsert',
            type: 'boolean',
            required: false,
            description: '是否覆盖已存在的文件',
            example: 'false'
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
        method: 'GET',
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
  },
  // REST API Categories
  {
    id: 'rest-analytics',
    name: '分析学 (REST API)',
    description: 'Supabase 管理 API - 项目分析和统计数据',
    officialDocs: 'https://supabase.com/docs/reference/api/introduction',
    endpoints: [
      {
        id: 'rest-get-function-stats',
        name: '获取项目的函数组合统计信息',
        method: 'GET',
        path: '/v1/projects/{ref}/analytics/endpoints/functions.combined-stats',
        description: '获取项目中边缘函数的组合统计信息，包括调用次数、执行时间等指标',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-project-function-combined-stats',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "data": {
                "total_invocations": 1250,
                "total_execution_time_ms": 45000,
                "average_execution_time_ms": 36,
                "error_rate": 0.02
              }
            }
          },
          {
            status: 401,
            description: '未授权访问',
            example: {
              "error": "Unauthorized",
              "message": "Invalid API key"
            }
          }
        ],
        examples: [
          {
            title: '获取函数统计',
            description: '获取项目中所有边缘函数的统计信息',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/analytics/endpoints/functions.combined-stats' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "data": {
    "total_invocations": 1250,
    "total_execution_time_ms": 45000,
    "average_execution_time_ms": 36,
    "error_rate": 0.02
  }
}`
          }
        ]
      },
      {
        id: 'rest-get-project-logs',
        name: '获取项目日志',
        method: 'GET',
        path: '/v1/projects/{ref}/analytics/endpoints/logs.all',
        description: '获取项目的所有日志记录，包括数据库、认证、存储等服务的日志',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-project-logs',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          },
          {
            name: 'start_time',
            type: 'string',
            required: false,
            description: '开始时间 (ISO 8601)',
            example: '2023-01-01T00:00:00Z'
          },
          {
            name: 'end_time',
            type: 'string',
            required: false,
            description: '结束时间 (ISO 8601)',
            example: '2023-01-02T00:00:00Z'
          },
          {
            name: 'limit',
            type: 'number',
            required: false,
            description: '返回记录数限制',
            example: '100'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "data": [
                {
                  "timestamp": "2023-01-01T12:00:00Z",
                  "level": "info",
                  "service": "auth",
                  "message": "User signed in successfully"
                }
              ]
            }
          }
        ],
        examples: [
          {
            title: '获取项目日志',
            description: '获取最近的项目日志记录',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/analytics/endpoints/logs.all?limit=100' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "data": [
    {
      "timestamp": "2023-01-01T12:00:00Z",
      "level": "info",
      "service": "auth",
      "message": "User signed in successfully"
    }
  ]
}`
          }
        ]
      },
      {
        id: 'rest-get-usage-api-count',
        name: '获取项目的使用 API 计数',
        method: 'GET',
        path: '/v1/projects/{ref}/analytics/endpoints/usage.api-counts',
        description: '获取项目的 API 使用计数统计信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-project-usage-api-count',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "data": {
                "total_requests": 15000,
                "auth_requests": 3000,
                "database_requests": 10000,
                "storage_requests": 2000
              }
            }
          }
        ],
        examples: [
          {
            title: '获取 API 使用计数',
            description: '获取项目的 API 调用统计',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/analytics/endpoints/usage.api-counts' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "data": {
    "total_requests": 15000,
    "auth_requests": 3000,
    "database_requests": 10000,
    "storage_requests": 2000
  }
}`
          }
        ]
      },
      {
        id: 'rest-get-usage-request-count',
        name: '获取项目的使用 API 请求计数',
        method: 'GET',
        path: '/v1/projects/{ref}/analytics/endpoints/usage.api-requests-count',
        description: '获取项目的 API 请求计数详细统计',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-project-usage-request-count',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "data": {
                "daily_requests": 500,
                "monthly_requests": 15000,
                "peak_requests_per_hour": 100
              }
            }
          }
        ],
        examples: [
          {
            title: '获取请求计数统计',
            description: '获取项目的详细请求统计信息',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/analytics/endpoints/usage.api-requests-count' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "data": {
    "daily_requests": 500,
    "monthly_requests": 15000,
    "peak_requests_per_hour": 100
  }
}`
          }
        ]
      }
    ]
  },
  {
    id: 'rest-auth',
    name: '认证 (REST API)',
    description: 'Supabase 管理 API - 认证服务配置和管理',
    officialDocs: 'https://supabase.com/docs/reference/api/introduction',
    endpoints: [
      {
        id: 'rest-get-auth-config',
        name: '获取身份验证服务配置',
        method: 'GET',
        path: '/v1/projects/{ref}/config/auth',
        description: '获取项目的身份验证服务配置信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-auth-service-config',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "site_url": "https://yourapp.com",
              "jwt_exp": 3600,
              "disable_signup": false,
              "external_providers": {
                "google": {
                  "enabled": true,
                  "client_id": "your-google-client-id"
                }
              }
            }
          }
        ],
        examples: [
          {
            title: '获取认证配置',
            description: '获取项目的认证服务配置',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/auth' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "site_url": "https://yourapp.com",
  "jwt_exp": 3600,
  "disable_signup": false,
  "external_providers": {
    "google": {
      "enabled": true,
      "client_id": "your-google-client-id"
    }
  }
}`
          }
        ]
      },
      {
        id: 'rest-update-auth-config',
        name: '更新身份验证服务配置',
        method: 'PATCH',
        path: '/v1/projects/{ref}/config/auth',
        description: '更新项目的身份验证服务配置',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-update-auth-service-config',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '认证配置更新数据',
          schema: {
            type: 'object',
            properties: {
              site_url: { type: 'string' },
              jwt_exp: { type: 'number' },
              disable_signup: { type: 'boolean' }
            }
          },
          example: {
            "site_url": "https://newdomain.com",
            "jwt_exp": 7200,
            "disable_signup": false
          }
        },
        responses: [
          {
            status: 200,
            description: '更新成功',
            example: {
              "message": "Auth config updated successfully"
            }
          }
        ],
        examples: [
          {
            title: '更新认证配置',
            description: '更新项目的认证服务配置',
            request: `curl -X PATCH \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/auth' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "site_url": "https://newdomain.com",
    "jwt_exp": 7200,
    "disable_signup": false
  }'`,
            response: `{
  "message": "Auth config updated successfully"
}`
          }
        ]
      },
      {
        id: 'rest-create-sso-provider',
        name: '创建 SSO 提供程序',
        method: 'POST',
        path: '/v1/projects/{ref}/config/auth/sso/providers',
        description: '为项目创建新的 SSO 身份提供程序',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-create-a-sso-provider',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: 'SSO 提供程序配置',
          schema: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              metadata_url: { type: 'string' },
              domains: { type: 'array' }
            },
            required: ['type']
          },
          example: {
            "type": "saml",
            "metadata_url": "https://example.com/saml/metadata",
            "domains": ["example.com"]
          }
        },
        responses: [
          {
            status: 201,
            description: '创建成功',
            example: {
              "id": "sso-provider-123",
              "type": "saml",
              "created_at": "2023-01-01T00:00:00Z"
            }
          }
        ],
        examples: [
          {
            title: '创建 SAML SSO 提供程序',
            description: '为企业用户创建 SAML SSO 配置',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/auth/sso/providers' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "type": "saml",
    "metadata_url": "https://example.com/saml/metadata",
    "domains": ["example.com"]
  }'`,
            response: `{
  "id": "sso-provider-123",
  "type": "saml",
  "created_at": "2023-01-01T00:00:00Z"
}`
          }
        ]
      },
      {
        id: 'rest-list-sso-providers',
        name: '列出所有 SSO 提供程序',
        method: 'GET',
        path: '/v1/projects/{ref}/config/auth/sso/providers',
        description: '获取项目中配置的所有 SSO 提供程序列表',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-list-all-sso-provider',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: [
              {
                "id": "sso-provider-123",
                "type": "saml",
                "domains": ["example.com"],
                "created_at": "2023-01-01T00:00:00Z"
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取 SSO 提供程序列表',
            description: '列出项目中所有配置的 SSO 提供程序',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/auth/sso/providers' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": "sso-provider-123",
    "type": "saml",
    "domains": ["example.com"],
    "created_at": "2023-01-01T00:00:00Z"
  }
]`
          }
        ]
      },
      {
        id: 'rest-get-sso-provider',
        name: '获取 SSO 提供商',
        method: 'GET',
        path: '/v1/projects/{ref}/config/auth/sso/providers/{provider_id}',
        description: '获取指定 SSO 提供程序的详细配置信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-a-sso-provider',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          },
          {
            name: 'provider_id',
            type: 'string',
            required: true,
            description: 'SSO 提供程序ID',
            example: 'sso-provider-123'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "id": "sso-provider-123",
              "type": "saml",
              "metadata_url": "https://example.com/saml/metadata",
              "domains": ["example.com"],
              "created_at": "2023-01-01T00:00:00Z"
            }
          }
        ],
        examples: [
          {
            title: '获取 SSO 提供程序详情',
            description: '获取指定 SSO 提供程序的配置信息',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/auth/sso/providers/sso-provider-123' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "id": "sso-provider-123",
  "type": "saml",
  "metadata_url": "https://example.com/saml/metadata",
  "domains": ["example.com"],
  "created_at": "2023-01-01T00:00:00Z"
}`
          }
        ]
      },
      {
        id: 'rest-delete-sso-provider',
        name: '删除 SSO 提供程序',
        method: 'DELETE',
        path: '/v1/projects/{ref}/config/auth/sso/providers/{provider_id}',
        description: '删除指定的 SSO 提供程序配置',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-delete-a-sso-provider',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          },
          {
            name: 'provider_id',
            type: 'string',
            required: true,
            description: 'SSO 提供程序ID',
            example: 'sso-provider-123'
          }
        ],
        responses: [
          {
            status: 200,
            description: '删除成功',
            example: {
              "message": "SSO provider deleted successfully"
            }
          }
        ],
        examples: [
          {
            title: '删除 SSO 提供程序',
            description: '删除不再需要的 SSO 提供程序',
            request: `curl -X DELETE \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/auth/sso/providers/sso-provider-123' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "message": "SSO provider deleted successfully"
}`
          }
        ]
      },
      {
        id: 'rest-update-sso-provider',
        name: '更新 SSO 提供程序',
        method: 'PATCH',
        path: '/v1/projects/{ref}/config/auth/sso/providers/{provider_id}',
        description: '更新指定 SSO 提供程序的配置',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-update-a-sso-provider',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          },
          {
            name: 'provider_id',
            type: 'string',
            required: true,
            description: 'SSO 提供程序ID',
            example: 'sso-provider-123'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: 'SSO 提供程序更新配置',
          schema: {
            type: 'object',
            properties: {
              metadata_url: { type: 'string' },
              domains: { type: 'array' }
            }
          },
          example: {
            "metadata_url": "https://updated.example.com/saml/metadata",
            "domains": ["example.com", "subdomain.example.com"]
          }
        },
        responses: [
          {
            status: 200,
            description: '更新成功',
            example: {
              "message": "SSO provider updated successfully"
            }
          }
        ],
        examples: [
          {
            title: '更新 SSO 提供程序',
            description: '更新 SSO 提供程序的配置信息',
            request: `curl -X PATCH \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/auth/sso/providers/sso-provider-123' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "metadata_url": "https://updated.example.com/saml/metadata",
    "domains": ["example.com", "subdomain.example.com"]
  }'`,
            response: `{
  "message": "SSO provider updated successfully"
}`
          }
        ]
      },
      {
        id: 'rest-create-legacy-signing-key',
        name: '创建旧签名密钥',
        method: 'POST',
        path: '/v1/projects/{ref}/config/auth/signing-keys/legacy',
        description: '为项目创建旧版签名密钥',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-create-legacy-signing-key',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 201,
            description: '创建成功',
            example: {
              "id": "legacy-key-123",
              "created_at": "2023-01-01T00:00:00Z"
            }
          }
        ],
        examples: [
          {
            title: '创建旧版签名密钥',
            description: '为项目创建旧版签名密钥',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/auth/signing-keys/legacy' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "id": "legacy-key-123",
  "created_at": "2023-01-01T00:00:00Z"
}`
          }
        ]
      },
      {
        id: 'rest-get-legacy-signing-key',
        name: '获取旧签名密钥',
        method: 'GET',
        path: '/v1/projects/{ref}/config/auth/signing-keys/legacy',
        description: '获取项目的旧版签名密钥信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-legacy-signing-key',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "id": "legacy-key-123",
              "key": "-----BEGIN PUBLIC KEY-----...",
              "created_at": "2023-01-01T00:00:00Z"
            }
          }
        ],
        examples: [
          {
            title: '获取旧版签名密钥',
            description: '获取项目的旧版签名密钥',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/auth/signing-keys/legacy' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "id": "legacy-key-123",
  "key": "-----BEGIN PUBLIC KEY-----...",
  "created_at": "2023-01-01T00:00:00Z"
}`
          }
        ]
      },
      {
        id: 'rest-create-project-signing-key',
        name: '创建项目签名密钥',
        method: 'POST',
        path: '/v1/projects/{ref}/config/auth/signing-keys',
        description: '为项目创建新的签名密钥',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-create-project-signing-key',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 201,
            description: '创建成功',
            example: {
              "id": "signing-key-123",
              "created_at": "2023-01-01T00:00:00Z"
            }
          }
        ],
        examples: [
          {
            title: '创建项目签名密钥',
            description: '为项目创建新的签名密钥',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/auth/signing-keys' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "id": "signing-key-123",
  "created_at": "2023-01-01T00:00:00Z"
}`
          }
        ]
      },
      {
        id: 'rest-get-project-signing-keys',
        name: '获取项目签名密钥',
        method: 'GET',
        path: '/v1/projects/{ref}/config/auth/signing-keys',
        description: '获取项目的所有签名密钥列表',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-project-signing-keys',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: [
              {
                "id": "signing-key-123",
                "key": "-----BEGIN PUBLIC KEY-----...",
                "created_at": "2023-01-01T00:00:00Z"
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取项目签名密钥列表',
            description: '获取项目的所有签名密钥',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/auth/signing-keys' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": "signing-key-123",
    "key": "-----BEGIN PUBLIC KEY-----...",
    "created_at": "2023-01-01T00:00:00Z"
  }
]`
          }
        ]
      },
      {
        id: 'rest-get-project-signing-key',
        name: '获取项目签名密钥',
        method: 'GET',
        path: '/v1/projects/{ref}/config/auth/signing-keys/{id}',
        description: '获取指定的项目签名密钥详细信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-project-signing-key',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          },
          {
            name: 'id',
            type: 'string',
            required: true,
            description: '签名密钥ID',
            example: 'signing-key-123'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "id": "signing-key-123",
              "key": "-----BEGIN PUBLIC KEY-----...",
              "created_at": "2023-01-01T00:00:00Z"
            }
          }
        ],
        examples: [
          {
            title: '获取指定签名密钥',
            description: '获取指定ID的签名密钥详情',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/auth/signing-keys/signing-key-123' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "id": "signing-key-123",
  "key": "-----BEGIN PUBLIC KEY-----...",
  "created_at": "2023-01-01T00:00:00Z"
}`
          }
        ]
      },
      {
        id: 'rest-update-project-signing-key',
        name: '更新项目签名密钥',
        method: 'PATCH',
        path: '/v1/projects/{ref}/config/auth/signing-keys/{id}',
        description: '更新指定的项目签名密钥',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-update-project-signing-key',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          },
          {
            name: 'id',
            type: 'string',
            required: true,
            description: '签名密钥ID',
            example: 'signing-key-123'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '签名密钥更新信息',
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' }
            }
          },
          example: {
            "name": "Updated Signing Key"
          }
        },
        responses: [
          {
            status: 200,
            description: '更新成功',
            example: {
              "message": "Signing key updated successfully"
            }
          }
        ],
        examples: [
          {
            title: '更新签名密钥',
            description: '更新指定签名密钥的信息',
            request: `curl -X PATCH \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/auth/signing-keys/signing-key-123' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "Updated Signing Key"
  }'`,
            response: `{
  "message": "Signing key updated successfully"
}`
          }
        ]
      },
      {
        id: 'rest-remove-project-signing-key',
        name: '删除项目签名密钥',
        method: 'DELETE',
        path: '/v1/projects/{ref}/config/auth/signing-keys/{id}',
        description: '删除指定的项目签名密钥',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-remove-project-signing-key',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          },
          {
            name: 'id',
            type: 'string',
            required: true,
            description: '签名密钥ID',
            example: 'signing-key-123'
          }
        ],
        responses: [
          {
            status: 200,
            description: '删除成功',
            example: {
              "message": "Signing key removed successfully"
            }
          }
        ],
        examples: [
          {
            title: '删除签名密钥',
            description: '删除指定的项目签名密钥',
            request: `curl -X DELETE \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/auth/signing-keys/signing-key-123' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "message": "Signing key removed successfully"
}`
          }
        ]
      },
      {
        id: 'rest-create-project-tpa-integration',
        name: '创建项目 TPA 集成',
        method: 'POST',
        path: '/v1/projects/{ref}/config/auth/third-party-auth',
        description: '为项目创建第三方认证集成',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-create-project-tpa-integration',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: 'TPA 集成配置',
          schema: {
            type: 'object',
            properties: {
              provider: { type: 'string' },
              client_id: { type: 'string' },
              client_secret: { type: 'string' }
            },
            required: ['provider', 'client_id', 'client_secret']
          },
          example: {
            "provider": "google",
            "client_id": "your-google-client-id",
            "client_secret": "your-google-client-secret"
          }
        },
        responses: [
          {
            status: 201,
            description: '创建成功',
            example: {
              "id": "tpa-123",
              "provider": "google",
              "created_at": "2023-01-01T00:00:00Z"
            }
          }
        ],
        examples: [
          {
            title: '创建 Google TPA 集成',
            description: '为项目创建 Google 第三方认证集成',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/auth/third-party-auth' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "provider": "google",
    "client_id": "your-google-client-id",
    "client_secret": "your-google-client-secret"
  }'`,
            response: `{
  "id": "tpa-123",
  "provider": "google",
  "created_at": "2023-01-01T00:00:00Z"
}`
          }
        ]
      },
      {
        id: 'rest-list-project-tpa-integrations',
        name: '列出项目 TPA 集成',
        method: 'GET',
        path: '/v1/projects/{ref}/config/auth/third-party-auth',
        description: '获取项目的所有第三方认证集成列表',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-list-project-tpa-integrations',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: [
              {
                "id": "tpa-123",
                "provider": "google",
                "client_id": "your-google-client-id",
                "created_at": "2023-01-01T00:00:00Z"
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取 TPA 集成列表',
            description: '列出项目的所有第三方认证集成',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/auth/third-party-auth' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": "tpa-123",
    "provider": "google",
    "client_id": "your-google-client-id",
    "created_at": "2023-01-01T00:00:00Z"
  }
]`
          }
        ]
      },
      {
        id: 'rest-get-project-tpa-integration',
        name: '获取项目 TPA 集成',
        method: 'GET',
        path: '/v1/projects/{ref}/config/auth/third-party-auth/{tpa_id}',
        description: '获取指定的第三方认证集成详细信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-project-tpa-integration',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          },
          {
            name: 'tpa_id',
            type: 'string',
            required: true,
            description: 'TPA 集成ID',
            example: 'tpa-123'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "id": "tpa-123",
              "provider": "google",
              "client_id": "your-google-client-id",
              "redirect_uri": "https://yourapp.com/auth/callback",
              "created_at": "2023-01-01T00:00:00Z"
            }
          }
        ],
        examples: [
          {
            title: '获取 TPA 集成详情',
            description: '获取指定第三方认证集成的详细信息',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/auth/third-party-auth/tpa-123' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "id": "tpa-123",
  "provider": "google",
  "client_id": "your-google-client-id",
  "redirect_uri": "https://yourapp.com/auth/callback",
  "created_at": "2023-01-01T00:00:00Z"
}`
          }
        ]
      },
      {
        id: 'rest-delete-project-tpa-integration',
        name: '删除项目 TPA 集成',
        method: 'DELETE',
        path: '/v1/projects/{ref}/config/auth/third-party-auth/{tpa_id}',
        description: '删除指定的第三方认证集成',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-delete-project-tpa-integration',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          },
          {
            name: 'tpa_id',
            type: 'string',
            required: true,
            description: 'TPA 集成ID',
            example: 'tpa-123'
          }
        ],
        responses: [
          {
            status: 200,
            description: '删除成功',
            example: {
              "message": "TPA integration deleted successfully"
            }
          }
        ],
        examples: [
          {
            title: '删除 TPA 集成',
            description: '删除指定的第三方认证集成',
            request: `curl -X DELETE \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/auth/third-party-auth/tpa-123' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "message": "TPA integration deleted successfully"
}`
          }
        ]
      }
    ]
  },
  {
    id: 'rest-database',
    name: '数据库 (REST API)',
    description: 'Supabase 管理 API - 数据库配置和管理',
    officialDocs: 'https://supabase.com/docs/reference/api/introduction',
    endpoints: [
      {
        id: 'rest-get-postgres-config',
        name: '获取 Postgres 配置',
        method: 'GET',
        path: '/v1/projects/{ref}/config/database/postgres',
        description: '获取项目的 PostgreSQL 数据库配置信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-postgres-config',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "max_connections": 100,
              "shared_buffers": "256MB",
              "effective_cache_size": "1GB",
              "maintenance_work_mem": "64MB"
            }
          }
        ],
        examples: [
          {
            title: '获取数据库配置',
            description: '获取 PostgreSQL 数据库的配置参数',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/database/postgres' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "max_connections": 100,
  "shared_buffers": "256MB",
  "effective_cache_size": "1GB",
  "maintenance_work_mem": "64MB"
}`
          }
        ]
      },
      {
        id: 'rest-run-query',
        name: '运行查询 (测试版)',
        method: 'POST',
        path: '/v1/projects/{ref}/database/query',
        description: '在项目数据库中执行 SQL 查询',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-run-a-query',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: 'SQL 查询请求',
          schema: {
            type: 'object',
            properties: {
              query: { type: 'string' }
            },
            required: ['query']
          },
          example: {
            "query": "SELECT * FROM users LIMIT 10;"
          }
        },
        responses: [
          {
            status: 200,
            description: '查询执行成功',
            example: {
              "result": [
                {
                  "id": 1,
                  "name": "John Doe",
                  "email": "john@example.com"
                }
              ]
            }
          }
        ],
        examples: [
          {
            title: '执行 SQL 查询',
            description: '在数据库中执行自定义 SQL 查询',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/database/query' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "query": "SELECT * FROM users LIMIT 10;"
  }'`,
            response: `{
  "result": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}`
          }
        ]
      },
      {
        id: 'rest-get-pooler-config',
        name: '获取池程序配置',
        method: 'GET',
        path: '/v1/projects/{ref}/config/database/pooler',
        description: '获取项目的数据库连接池配置信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-pooler-config',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "pool_mode": "transaction",
              "default_pool_size": 25,
              "max_client_conn": 200
            }
          }
        ],
        examples: [
          {
            title: '获取连接池配置',
            description: '获取数据库连接池的配置参数',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/database/pooler' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "pool_mode": "transaction",
  "default_pool_size": 25,
  "max_client_conn": 200
}`
          }
        ]
      },
      {
        id: 'rest-generate-typescript-types',
        name: '生成 TypeScript 类型',
        method: 'GET',
        path: '/v1/projects/{ref}/types/typescript',
        description: '根据数据库架构生成 TypeScript 类型定义',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-generate-typescript-types',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '生成成功',
            example: {
              "types": "export interface Database {\n  public: {\n    Tables: {\n      users: {\n        Row: {\n          id: number\n          name: string\n        }\n      }\n    }\n  }\n}"
            }
          }
        ],
        examples: [
          {
            title: '生成 TypeScript 类型',
            description: '为数据库架构生成类型定义文件',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/types/typescript' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "types": "export interface Database {\\n  public: {\\n    Tables: {\\n      users: {\\n        Row: {\\n          id: number\\n          name: string\\n        }\\n      }\\n    }\\n  }\\n}"
}`
          }
        ]
      },
      {
        id: 'rest-list-all-backups',
        name: '列出所有备份',
        method: 'GET',
        path: '/v1/projects/{ref}/database/backups',
        description: '获取项目数据库的所有备份列表',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-list-all-backups',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: [
              {
                "id": "backup-123",
                "created_at": "2023-01-01T00:00:00Z",
                "size_bytes": 1048576,
                "status": "completed"
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取备份列表',
            description: '列出项目的所有数据库备份',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/database/backups' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": "backup-123",
    "created_at": "2023-01-01T00:00:00Z",
    "size_bytes": 1048576,
    "status": "completed"
  }
]`
          }
        ]
      },
      {
        id: 'rest-update-pooler-config',
        name: '更新池程序配置',
        method: 'PATCH',
        path: '/v1/projects/{ref}/config/database/pooler',
        description: '更新项目的数据库连接池配置',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-update-pooler-config',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '连接池配置更新数据',
          schema: {
            type: 'object',
            properties: {
              pool_mode: { type: 'string' },
              default_pool_size: { type: 'number' },
              max_client_conn: { type: 'number' }
            }
          },
          example: {
            "pool_mode": "session",
            "default_pool_size": 30,
            "max_client_conn": 300
          }
        },
        responses: [
          {
            status: 200,
            description: '更新成功',
            example: {
              "message": "Pooler config updated successfully"
            }
          }
        ],
        examples: [
          {
            title: '更新连接池配置',
            description: '修改数据库连接池的配置参数',
            request: `curl -X PATCH \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/database/pooler' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "pool_mode": "session",
    "default_pool_size": 30,
    "max_client_conn": 300
  }'`,
            response: `{
  "message": "Pooler config updated successfully"
}`
          }
        ]
      },
      {
        id: 'rest-update-postgres-config',
        name: '更新 Postgres 配置',
        method: 'PATCH',
        path: '/v1/projects/{ref}/config/database/postgres',
        description: '更新项目的 PostgreSQL 数据库配置',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-update-postgres-config',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: 'PostgreSQL 配置更新数据',
          schema: {
            type: 'object',
            properties: {
              max_connections: { type: 'number' },
              shared_buffers: { type: 'string' },
              effective_cache_size: { type: 'string' }
            }
          },
          example: {
            "max_connections": 150,
            "shared_buffers": "512MB",
            "effective_cache_size": "2GB"
          }
        },
        responses: [
          {
            status: 200,
            description: '更新成功',
            example: {
              "message": "Postgres config updated successfully"
            }
          }
        ],
        examples: [
          {
            title: '更新 PostgreSQL 配置',
            description: '修改数据库的配置参数',
            request: `curl -X PATCH \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/database/postgres' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "max_connections": 150,
    "shared_buffers": "512MB",
    "effective_cache_size": "2GB"
  }'`,
            response: `{
  "message": "Postgres config updated successfully"
}`
          }
        ]
      },
      {
        id: 'rest-get-project-pgbouncer-config',
        name: '获取项目 PgBouncer 配置',
        method: 'GET',
        path: '/v1/projects/{ref}/config/database/pgbouncer',
        description: '获取项目的 PgBouncer 连接池配置信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-project-pgbouncer-config',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "pool_mode": "transaction",
              "default_pool_size": 25,
              "max_client_conn": 200,
              "ignore_startup_parameters": "extra_float_digits"
            }
          }
        ],
        examples: [
          {
            title: '获取 PgBouncer 配置',
            description: '获取 PgBouncer 连接池的配置参数',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/database/pgbouncer' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "pool_mode": "transaction",
  "default_pool_size": 25,
  "max_client_conn": 200,
  "ignore_startup_parameters": "extra_float_digits"
}`
          }
        ]
      },
      {
        id: 'rest-apply-migration',
        name: '应用迁移',
        method: 'POST',
        path: '/v1/projects/{ref}/database/migrations',
        description: '应用数据库迁移到项目',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-apply-a-migration',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '迁移信息',
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              statements: { type: 'array' }
            },
            required: ['name', 'statements']
          },
          example: {
            "name": "add_users_table",
            "statements": [
              "CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT NOT NULL);"
            ]
          }
        },
        responses: [
          {
            status: 200,
            description: '应用成功',
            example: {
              "message": "Migration applied successfully"
            }
          }
        ],
        examples: [
          {
            title: '应用数据库迁移',
            description: '执行数据库结构变更',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/database/migrations' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "add_users_table",
    "statements": [
      "CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT NOT NULL);"
    ]
  }'`,
            response: `{
  "message": "Migration applied successfully"
}`
          }
        ]
      },
      {
        id: 'rest-list-migration-history',
        name: '列出迁移历史记录 (测试版)',
        method: 'GET',
        path: '/v1/projects/{ref}/database/migrations',
        description: '获取项目的数据库迁移历史记录',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-list-migration-history',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: [
              {
                "id": "migration-123",
                "name": "add_users_table",
                "applied_at": "2023-01-01T00:00:00Z",
                "status": "applied"
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取迁移历史',
            description: '列出项目的所有数据库迁移记录',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/database/migrations' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": "migration-123",
    "name": "add_users_table",
    "applied_at": "2023-01-01T00:00:00Z",
    "status": "applied"
  }
]`
          }
        ]
      },
      {
        id: 'rest-upsert-migration',
        name: '更新插入迁移 (测试版)',
        method: 'PUT',
        path: '/v1/projects/{ref}/database/migrations',
        description: '创建或更新数据库迁移',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-upsert-a-migration',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '迁移更新信息',
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              statements: { type: 'array' }
            },
            required: ['name', 'statements']
          },
          example: {
            "name": "update_users_table",
            "statements": [
              "ALTER TABLE users ADD COLUMN email TEXT UNIQUE;"
            ]
          }
        },
        responses: [
          {
            status: 200,
            description: '更新成功',
            example: {
              "message": "Migration upserted successfully"
            }
          }
        ],
        examples: [
          {
            title: '更新插入迁移',
            description: '创建或更新数据库迁移',
            request: `curl -X PUT \\
  'https://api.supabase.com/v1/projects/your-project-ref/database/migrations' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "update_users_table",
    "statements": [
      "ALTER TABLE users ADD COLUMN email TEXT UNIQUE;"
    ]
  }'`,
            response: `{
  "message": "Migration upserted successfully"
}`
          }
        ]
      },
      {
        id: 'rest-get-readonly-mode-status',
        name: '获取只读模式状态',
        method: 'GET',
        path: '/v1/projects/{ref}/readonly',
        description: '获取项目的只读模式状态',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-readonly-mode-status',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "readonly_mode": false,
              "reason": null
            }
          }
        ],
        examples: [
          {
            title: '获取只读模式状态',
            description: '检查项目是否处于只读模式',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/readonly' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "readonly_mode": false,
  "reason": null
}`
          }
        ]
      },
      {
        id: 'rest-disable-readonly-mode-temporarily',
        name: '暂时禁用只读模式',
        method: 'POST',
        path: '/v1/projects/{ref}/readonly/temporary-disable',
        description: '暂时禁用项目的只读模式',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-disable-readonly-mode-temporarily',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '禁用成功',
            example: {
              "message": "Readonly mode temporarily disabled"
            }
          }
        ],
        examples: [
          {
            title: '暂时禁用只读模式',
            description: '临时禁用项目的只读模式',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/readonly/temporary-disable' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "message": "Readonly mode temporarily disabled"
}`
          }
        ]
      },
      {
        id: 'rest-get-ssl-enforcement-config',
        name: '获取 SSL 强制配置',
        method: 'GET',
        path: '/v1/projects/{ref}/ssl-enforcement',
        description: '获取项目的 SSL 强制配置状态',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-ssl-enforcement-config',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "ssl_enforcement": true,
              "updated_at": "2023-01-01T00:00:00Z"
            }
          }
        ],
        examples: [
          {
            title: '获取 SSL 强制配置',
            description: '检查项目的 SSL 强制状态',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/ssl-enforcement' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "ssl_enforcement": true,
  "updated_at": "2023-01-01T00:00:00Z"
}`
          }
        ]
      },
      {
        id: 'rest-update-ssl-enforcement-config',
        name: '更新 SSL 强制配置 (测试版)',
        method: 'PATCH',
        path: '/v1/projects/{ref}/ssl-enforcement',
        description: '更新项目的 SSL 强制配置',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-update-ssl-enforcement-config',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: 'SSL 强制配置',
          schema: {
            type: 'object',
            properties: {
              ssl_enforcement: { type: 'boolean' }
            },
            required: ['ssl_enforcement']
          },
          example: {
            "ssl_enforcement": true
          }
        },
        responses: [
          {
            status: 200,
            description: '更新成功',
            example: {
              "message": "SSL enforcement config updated successfully"
            }
          }
        ],
        examples: [
          {
            title: '更新 SSL 强制配置',
            description: '启用或禁用 SSL 强制连接',
            request: `curl -X PATCH \\
  'https://api.supabase.com/v1/projects/your-project-ref/ssl-enforcement' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "ssl_enforcement": true
  }'`,
            response: `{
  "message": "SSL enforcement config updated successfully"
}`
          }
        ]
      },
      {
        id: 'rest-enable-database-webhook',
        name: '启用数据库 Webhook',
        method: 'POST',
        path: '/v1/projects/{ref}/database/webhooks/enable',
        description: '为项目启用数据库 Webhook 功能',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-enable-database-webhook',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '启用成功',
            example: {
              "message": "Database webhook enabled successfully"
            }
          }
        ],
        examples: [
          {
            title: '启用数据库 Webhook',
            description: '为项目启用数据库变更通知功能',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/database/webhooks/enable' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "message": "Database webhook enabled successfully"
}`
          }
        ]
      },
      {
        id: 'rest-get-snippet',
        name: '获取代码段',
        method: 'GET',
        path: '/v1/snippets/{id}',
        description: '获取指定的代码段内容',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-a-snippet',
        parameters: [
          {
            name: 'id',
            type: 'string',
            required: true,
            description: '代码段ID',
            example: 'snippet-123'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "id": "snippet-123",
              "name": "User Query",
              "content": "SELECT * FROM users WHERE active = true;",
              "language": "sql",
              "created_at": "2023-01-01T00:00:00Z"
            }
          }
        ],
        examples: [
          {
            title: '获取代码段',
            description: '获取指定ID的代码段内容',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/snippets/snippet-123' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "id": "snippet-123",
  "name": "User Query",
  "content": "SELECT * FROM users WHERE active = true;",
  "language": "sql",
  "created_at": "2023-01-01T00:00:00Z"
}`
          }
        ]
      },
      {
        id: 'rest-list-all-snippets',
        name: '列出所有代码段',
        method: 'GET',
        path: '/v1/snippets',
        description: '获取所有可用的代码段列表',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-list-all-snippets',
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: [
              {
                "id": "snippet-123",
                "name": "User Query",
                "language": "sql",
                "created_at": "2023-01-01T00:00:00Z"
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取代码段列表',
            description: '列出所有可用的代码段',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/snippets' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": "snippet-123",
    "name": "User Query",
    "language": "sql",
    "created_at": "2023-01-01T00:00:00Z"
  }
]`
          }
        ]
      }
    ]
  },
  {
    id: 'rest-projects',
    name: '项目 (REST API)',
    description: 'Supabase 管理 API - 项目管理和配置',
    officialDocs: 'https://supabase.com/docs/reference/api/introduction',
    endpoints: [
      {
        id: 'rest-list-projects',
        name: '列出所有项目',
        method: 'GET',
        path: '/v1/projects',
        description: '获取当前用户或组织下的所有项目列表',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-list-all-projects',
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: [
              {
                "id": "project-123",
                "ref": "your-project-ref",
                "name": "My Project",
                "status": "ACTIVE_HEALTHY",
                "region": "us-east-1",
                "created_at": "2023-01-01T00:00:00Z"
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取项目列表',
            description: '获取所有可访问的项目',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": "project-123",
    "ref": "your-project-ref",
    "name": "My Project",
    "status": "ACTIVE_HEALTHY",
    "region": "us-east-1",
    "created_at": "2023-01-01T00:00:00Z"
  }
]`
          }
        ]
      },
      {
        id: 'rest-get-project',
        name: '获取项目',
        method: 'GET',
        path: '/v1/projects/{ref}',
        description: '获取指定项目的详细信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-project',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "id": "project-123",
              "ref": "your-project-ref",
              "name": "My Project",
              "status": "ACTIVE_HEALTHY",
              "region": "us-east-1",
              "database": {
                "host": "db.your-project-ref.supabase.co",
                "version": "15.1"
              },
              "created_at": "2023-01-01T00:00:00Z"
            }
          }
        ],
        examples: [
          {
            title: '获取项目详情',
            description: '获取指定项目的详细信息',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "id": "project-123",
  "ref": "your-project-ref",
  "name": "My Project",
  "status": "ACTIVE_HEALTHY",
  "region": "us-east-1",
  "database": {
    "host": "db.your-project-ref.supabase.co",
    "version": "15.1"
  },
  "created_at": "2023-01-01T00:00:00Z"
}`
          }
        ]
      },
      {
        id: 'rest-create-project',
        name: '创建项目',
        method: 'POST',
        path: '/v1/projects',
        description: '创建新的 Supabase 项目',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-create-a-project',
        requestBody: {
          type: 'application/json',
          description: '项目创建信息',
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              organization_id: { type: 'string' },
              plan: { type: 'string', enum: ['free', 'pro', 'team', 'enterprise'] },
              region: { type: 'string' },
              db_pass: { type: 'string' }
            },
            required: ['name', 'organization_id', 'db_pass']
          },
          example: {
            "name": "My New Project",
            "organization_id": "org-123",
            "plan": "free",
            "region": "us-east-1",
            "db_pass": "your-secure-password"
          }
        },
        responses: [
          {
            status: 201,
            description: '创建成功',
            example: {
              "id": "project-456",
              "ref": "new-project-ref",
              "name": "My New Project",
              "status": "COMING_UP",
              "region": "us-east-1"
            }
          }
        ],
        examples: [
          {
            title: '创建新项目',
            description: '创建一个新的 Supabase 项目',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "My New Project",
    "organization_id": "org-123",
    "plan": "free",
    "region": "us-east-1",
    "db_pass": "your-secure-password"
  }'`,
            response: `{
  "id": "project-456",
  "ref": "new-project-ref",
  "name": "My New Project",
  "status": "COMING_UP",
  "region": "us-east-1"
}`
          }
        ]
      },
      {
        id: 'rest-get-project-api-keys',
        name: '获取项目 API 密钥',
        method: 'GET',
        path: '/v1/projects/{ref}/api-keys',
        description: '获取项目的所有 API 密钥信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-project-api-keys',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: [
              {
                "name": "anon",
                "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "tags": "anon"
              },
              {
                "name": "service_role", 
                "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "tags": "service_role"
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取项目密钥',
            description: '获取项目的匿名密钥和服务密钥',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/api-keys' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "name": "anon",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tags": "anon"
  },
  {
    "name": "service_role", 
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tags": "service_role"
  }
]`
          }
        ]
      },
      {
        id: 'rest-get-services-health',
        name: '获取服务运行状况',
        method: 'GET',
        path: '/v1/projects/{ref}/health',
        description: '获取项目各个服务的运行状况和健康检查信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-services-health',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "database": {
                "status": "healthy",
                "last_check": "2023-01-01T12:00:00Z"
              },
              "auth": {
                "status": "healthy", 
                "last_check": "2023-01-01T12:00:00Z"
              },
              "storage": {
                "status": "healthy",
                "last_check": "2023-01-01T12:00:00Z"
              }
            }
          }
        ],
        examples: [
          {
            title: '检查服务状态',
            description: '获取项目所有服务的健康状况',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/health' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "database": {
    "status": "healthy",
    "last_check": "2023-01-01T12:00:00Z"
  },
  "auth": {
    "status": "healthy", 
    "last_check": "2023-01-01T12:00:00Z"
  },
  "storage": {
    "status": "healthy",
    "last_check": "2023-01-01T12:00:00Z"
  }
}`
          }
        ]
      },
      {
        id: 'rest-delete-project',
        name: '删除项目',
        method: 'DELETE',
        path: '/v1/projects/{ref}',
        description: '删除指定的 Supabase 项目（不可恢复）',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-delete-a-project',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '删除成功',
            example: {
              "message": "Project deleted successfully"
            }
          }
        ],
        examples: [
          {
            title: '删除项目',
            description: '永久删除 Supabase 项目',
            request: `curl -X DELETE \\
  'https://api.supabase.com/v1/projects/your-project-ref' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "message": "Project deleted successfully"
}`
          }
        ]
      },
      {
        id: 'rest-pause-project',
        name: '暂停项目',
        method: 'POST',
        path: '/v1/projects/{ref}/pause',
        description: '暂停项目以节省资源和费用',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-pause-a-project',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '暂停成功',
            example: {
              "message": "Project paused successfully"
            }
          }
        ],
        examples: [
          {
            title: '暂停项目',
            description: '暂停项目运行以节省费用',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/pause' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "message": "Project paused successfully"
}`
          }
        ]
      },
      {
        id: 'rest-restore-project',
        name: '还原项目',
        method: 'POST',
        path: '/v1/projects/{ref}/restore',
        description: '从备份还原项目数据',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-restore-a-project',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '还原配置信息',
          schema: {
            type: 'object',
            properties: {
              backup_id: { type: 'string' }
            },
            required: ['backup_id']
          },
          example: {
            "backup_id": "backup-123"
          }
        },
        responses: [
          {
            status: 200,
            description: '还原开始',
            example: {
              "message": "Project restore initiated"
            }
          }
        ],
        examples: [
          {
            title: '还原项目',
            description: '从指定备份还原项目',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/restore' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "backup_id": "backup-123"
  }'`,
            response: `{
  "message": "Project restore initiated"
}`
          }
        ]
      },
      {
        id: 'rest-cancel-project-restoration',
        name: '取消项目恢复',
        method: 'POST',
        path: '/v1/projects/{ref}/restore/cancel',
        description: '取消正在进行的项目恢复操作',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-cancel-a-project-restoration',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '取消成功',
            example: {
              "message": "Project restoration cancelled successfully"
            }
          }
        ],
        examples: [
          {
            title: '取消项目恢复',
            description: '取消正在进行的项目恢复操作',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/restore/cancel' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "message": "Project restoration cancelled successfully"
}`
          }
        ]
      },
      {
        id: 'rest-list-available-restore-versions',
        name: '列出可用的还原版本',
        method: 'GET',
        path: '/v1/projects/{ref}/restore',
        description: '获取项目可用的还原版本列表',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-list-available-restore-versions',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: [
              {
                "id": "restore-123",
                "created_at": "2023-01-01T00:00:00Z",
                "size_bytes": 1048576,
                "type": "full_backup"
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取可用还原版本',
            description: '列出项目的所有可用还原点',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/restore' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": "restore-123",
    "created_at": "2023-01-01T00:00:00Z",
    "size_bytes": 1048576,
    "type": "full_backup"
  }
]`
          }
        ]
      },
      {
        id: 'rest-get-network-restrictions',
        name: '获取网络限制 (测试版)',
        method: 'GET',
        path: '/v1/projects/{ref}/network-restrictions',
        description: '获取项目的网络访问限制配置',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-network-restrictions',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "allowed_cidrs": ["192.168.1.0/24", "10.0.0.0/8"],
              "restriction_mode": "allow_list"
            }
          }
        ],
        examples: [
          {
            title: '获取网络限制',
            description: '查看项目的网络访问限制配置',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/network-restrictions' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "allowed_cidrs": ["192.168.1.0/24", "10.0.0.0/8"],
  "restriction_mode": "allow_list"
}`
          }
        ]
      },
      {
        id: 'rest-update-network-restrictions',
        name: '更新网络限制 (测试版)',
        method: 'POST',
        path: '/v1/projects/{ref}/network-restrictions/apply',
        description: '更新项目的网络访问限制配置',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-update-network-restrictions',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '网络限制配置',
          schema: {
            type: 'object',
            properties: {
              allowed_cidrs: { type: 'array' },
              restriction_mode: { type: 'string' }
            }
          },
          example: {
            "allowed_cidrs": ["192.168.1.0/24", "10.0.0.0/8"],
            "restriction_mode": "allow_list"
          }
        },
        responses: [
          {
            status: 200,
            description: '更新成功',
            example: {
              "message": "Network restrictions updated successfully"
            }
          }
        ],
        examples: [
          {
            title: '更新网络限制',
            description: '配置项目的网络访问限制',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/network-restrictions/apply' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "allowed_cidrs": ["192.168.1.0/24", "10.0.0.0/8"],
    "restriction_mode": "allow_list"
  }'`,
            response: `{
  "message": "Network restrictions updated successfully"
}`
          }
        ]
      },
      {
        id: 'rest-get-postgres-upgrade-eligibility',
        name: '获得 Postgres 升级资格 (测试版)',
        method: 'GET',
        path: '/v1/projects/{ref}/upgrade/eligibility',
        description: '检查项目是否符合 PostgreSQL 版本升级条件',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-postgres-upgrade-eligibility',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "eligible": true,
              "current_version": "14.9",
              "target_version": "15.4",
              "reasons": []
            }
          }
        ],
        examples: [
          {
            title: '检查升级资格',
            description: '检查项目是否可以升级 PostgreSQL 版本',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/upgrade/eligibility' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "eligible": true,
  "current_version": "14.9",
  "target_version": "15.4",
  "reasons": []
}`
          }
        ]
      },
      {
        id: 'rest-get-postgres-upgrade-status',
        name: '获取 Postgres 升级状态 (测试版)',
        method: 'GET',
        path: '/v1/projects/{ref}/upgrade/status',
        description: '获取项目 PostgreSQL 升级的当前状态',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-postgres-upgrade-status',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "status": "completed",
              "started_at": "2023-01-01T00:00:00Z",
              "completed_at": "2023-01-01T01:00:00Z",
              "from_version": "14.9",
              "to_version": "15.4"
            }
          }
        ],
        examples: [
          {
            title: '获取升级状态',
            description: '查看 PostgreSQL 升级的进度状态',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/upgrade/status' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "status": "completed",
  "started_at": "2023-01-01T00:00:00Z",
  "completed_at": "2023-01-01T01:00:00Z",
  "from_version": "14.9",
  "to_version": "15.4"
}`
          }
        ]
      },
      {
        id: 'rest-upgrade-postgres-version',
        name: '升级 Postgres 版本 (测试版)',
        method: 'POST',
        path: '/v1/projects/{ref}/upgrade',
        description: '启动项目的 PostgreSQL 版本升级',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-upgrade-postgres-version',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '升级配置',
          schema: {
            type: 'object',
            properties: {
              target_version: { type: 'string' }
            },
            required: ['target_version']
          },
          example: {
            "target_version": "15.4"
          }
        },
        responses: [
          {
            status: 200,
            description: '升级开始',
            example: {
              "message": "PostgreSQL upgrade initiated"
            }
          }
        ],
        examples: [
          {
            title: '升级 PostgreSQL 版本',
            description: '启动数据库版本升级过程',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/upgrade' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "target_version": "15.4"
  }'`,
            response: `{
  "message": "PostgreSQL upgrade initiated"
}`
          }
        ]
      }
    ]
  },
  {
    id: 'rest-functions',
    name: '边缘函数 (REST API)',
    description: 'Supabase 管理 API - 边缘函数管理和部署',
    officialDocs: 'https://supabase.com/docs/reference/api/introduction',
    endpoints: [
      {
        id: 'rest-list-functions',
        name: '列出所有函数',
        method: 'GET',
        path: '/v1/projects/{ref}/functions',
        description: '获取项目中所有边缘函数的列表',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-list-all-functions',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: [
              {
                "id": "function-123",
                "slug": "hello-world",
                "name": "hello-world",
                "status": "ACTIVE",
                "version": 1,
                "created_at": "2023-01-01T00:00:00Z",
                "updated_at": "2023-01-01T12:00:00Z"
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取函数列表',
            description: '获取项目中所有边缘函数',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/functions' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": "function-123",
    "slug": "hello-world",
    "name": "hello-world",
    "status": "ACTIVE",
    "version": 1,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T12:00:00Z"
  }
]`
          }
        ]
      },
      {
        id: 'rest-deploy-function',
        name: '部署函数',
        method: 'POST',
        path: '/v1/projects/{ref}/functions/deploy',
        description: '部署边缘函数到项目中',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-deploy-a-function',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '函数部署信息',
          schema: {
            type: 'object',
            properties: {
              slug: { type: 'string' },
              body: { type: 'string' },
              import_map: { type: 'object' }
            },
            required: ['slug', 'body']
          },
          example: {
            "slug": "hello-world",
            "body": "export default function handler(req) { return new Response('Hello World!') }",
            "import_map": {}
          }
        },
        responses: [
          {
            status: 200,
            description: '部署成功',
            example: {
              "id": "function-123",
              "slug": "hello-world",
              "status": "ACTIVE",
              "version": 2
            }
          }
        ],
        examples: [
          {
            title: '部署边缘函数',
            description: '部署一个新的边缘函数',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/functions/deploy' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "slug": "hello-world",
    "body": "export default function handler(req) { return new Response(\"Hello World!\") }",
    "import_map": {}
  }'`,
            response: `{
  "id": "function-123",
  "slug": "hello-world",
  "status": "ACTIVE",
  "version": 2
}`
          }
        ]
      },
      {
        id: 'rest-get-function',
        name: '获取函数',
        method: 'GET',
        path: '/v1/projects/{ref}/functions/{function_slug}',
        description: '获取指定边缘函数的详细信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-a-function',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          },
          {
            name: 'function_slug',
            type: 'string',
            required: true,
            description: '函数标识符',
            example: 'hello-world'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "id": "function-123",
              "slug": "hello-world",
              "name": "hello-world",
              "status": "ACTIVE",
              "version": 1,
              "created_at": "2023-01-01T00:00:00Z",
              "updated_at": "2023-01-01T12:00:00Z"
            }
          }
        ],
        examples: [
          {
            title: '获取函数详情',
            description: '获取指定边缘函数的详细信息',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/functions/hello-world' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "id": "function-123",
  "slug": "hello-world",
  "name": "hello-world",
  "status": "ACTIVE",
  "version": 1,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T12:00:00Z"
}`
          }
        ]
      },
      {
        id: 'rest-delete-function',
        name: '删除函数',
        method: 'DELETE',
        path: '/v1/projects/{ref}/functions/{function_slug}',
        description: '删除指定的边缘函数',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-delete-a-function',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          },
          {
            name: 'function_slug',
            type: 'string',
            required: true,
            description: '函数标识符',
            example: 'hello-world'
          }
        ],
        responses: [
          {
            status: 200,
            description: '删除成功',
            example: {
              "message": "Function deleted successfully"
            }
          }
        ],
        examples: [
          {
            title: '删除边缘函数',
            description: '删除不再需要的边缘函数',
            request: `curl -X DELETE \\
  'https://api.supabase.com/v1/projects/your-project-ref/functions/hello-world' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "message": "Function deleted successfully"
}`
          }
        ]
      },
      {
        id: 'rest-update-function',
        name: '更新函数',
        method: 'PATCH',
        path: '/v1/projects/{ref}/functions/{function_slug}',
        description: '更新指定边缘函数的配置',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-update-a-function',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          },
          {
            name: 'function_slug',
            type: 'string',
            required: true,
            description: '函数标识符',
            example: 'hello-world'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '函数更新信息',
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              verify_jwt: { type: 'boolean' }
            }
          },
          example: {
            "name": "hello-world-updated",
            "verify_jwt": false
          }
        },
        responses: [
          {
            status: 200,
            description: '更新成功',
            example: {
              "message": "Function updated successfully"
            }
          }
        ],
        examples: [
          {
            title: '更新函数配置',
            description: '修改边缘函数的设置',
            request: `curl -X PATCH \\
  'https://api.supabase.com/v1/projects/your-project-ref/functions/hello-world' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "hello-world-updated",
    "verify_jwt": false
  }'`,
            response: `{
  "message": "Function updated successfully"
}`
          }
        ]
      },
      {
        id: 'rest-get-function-body',
        name: '获取函数体',
        method: 'GET',
        path: '/v1/projects/{ref}/functions/{function_slug}/body',
        description: '获取指定边缘函数的源代码内容',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-a-function-body',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          },
          {
            name: 'function_slug',
            type: 'string',
            required: true,
            description: '函数标识符',
            example: 'hello-world'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "body": "export default function handler(req) {\n  return new Response('Hello World!')\n}",
              "import_map": {}
            }
          }
        ],
        examples: [
          {
            title: '获取函数源代码',
            description: '获取指定边缘函数的完整源代码',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/functions/hello-world/body' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "body": "export default function handler(req) {\\n  return new Response('Hello World!')\\n}",
  "import_map": {}
}`
          }
        ]
      },
      {
        id: 'rest-bulk-update-functions',
        name: '批量更新功能',
        method: 'PATCH',
        path: '/v1/projects/{ref}/functions',
        description: '批量更新项目中的多个边缘函数',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-bulk-update-functions',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '批量更新配置',
          schema: {
            type: 'object',
            properties: {
              functions: { type: 'array' }
            },
            required: ['functions']
          },
          example: {
            "functions": [
              {
                "slug": "hello-world",
                "verify_jwt": false
              },
              {
                "slug": "goodbye-world",
                "verify_jwt": true
              }
            ]
          }
        },
        responses: [
          {
            status: 200,
            description: '更新成功',
            example: {
              "message": "Functions updated successfully"
            }
          }
        ],
        examples: [
          {
            title: '批量更新函数配置',
            description: '一次性更新多个边缘函数的配置',
            request: `curl -X PATCH \\
  'https://api.supabase.com/v1/projects/your-project-ref/functions' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "functions": [
      {
        "slug": "hello-world",
        "verify_jwt": false
      },
      {
        "slug": "goodbye-world",
        "verify_jwt": true
      }
    ]
  }'`,
            response: `{
  "message": "Functions updated successfully"
}`
          }
        ]
      },
      {
        id: 'rest-create-function-deprecated',
        name: '创建函数 (已弃用)',
        method: 'POST',
        path: '/v1/projects/{ref}/functions',
        description: '创建新的边缘函数（此接口已弃用，建议使用部署接口）',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-create-a-function',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '函数创建信息',
          schema: {
            type: 'object',
            properties: {
              slug: { type: 'string' },
              name: { type: 'string' },
              body: { type: 'string' }
            },
            required: ['slug', 'body']
          },
          example: {
            "slug": "new-function",
            "name": "New Function",
            "body": "export default function handler(req) { return new Response('New Function!') }"
          }
        },
        responses: [
          {
            status: 201,
            description: '创建成功',
            example: {
              "id": "function-456",
              "slug": "new-function",
              "status": "ACTIVE"
            }
          }
        ],
        examples: [
          {
            title: '创建新函数 (已弃用)',
            description: '使用已弃用的接口创建边缘函数',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/functions' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "slug": "new-function",
    "name": "New Function",
    "body": "export default function handler(req) { return new Response(\"New Function!\") }"
  }'`,
            response: `{
  "id": "function-456",
  "slug": "new-function",
  "status": "ACTIVE"
}`
          }
        ]
      }
    ]
  },
  {
    id: 'rest-organizations',
    name: '组织 (REST API)',
    description: 'Supabase 管理 API - 组织管理',
    officialDocs: 'https://supabase.com/docs/reference/api/introduction',
    endpoints: [
      {
        id: 'rest-list-organizations',
        name: '列出所有组织',
        method: 'GET',
        path: '/v1/organizations',
        description: '获取当前用户可访问的所有组织列表',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-list-all-organizations',
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: [
              {
                "id": "org-123",
                "slug": "my-organization",
                "name": "My Organization",
                "billing_email": "billing@example.com",
                "created_at": "2023-01-01T00:00:00Z"
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取组织列表',
            description: '获取所有可访问的组织',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/organizations' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": "org-123",
    "slug": "my-organization", 
    "name": "My Organization",
    "billing_email": "billing@example.com",
    "created_at": "2023-01-01T00:00:00Z"
  }
]`
          }
        ]
      },
      {
        id: 'rest-get-organization',
        name: '获取组织',
        method: 'GET',
        path: '/v1/organizations/{slug}',
        description: '获取指定组织的详细信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-an-organization',
        parameters: [
          {
            name: 'slug',
            type: 'string',
            required: true,
            description: '组织标识符',
            example: 'my-organization'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "id": "org-123",
              "slug": "my-organization",
              "name": "My Organization", 
              "billing_email": "billing@example.com",
              "tier": "free",
              "created_at": "2023-01-01T00:00:00Z"
            }
          }
        ],
        examples: [
          {
            title: '获取组织详情',
            description: '获取指定组织的详细信息',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/organizations/my-organization' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "id": "org-123",
  "slug": "my-organization",
  "name": "My Organization", 
  "billing_email": "billing@example.com",
  "tier": "free",
  "created_at": "2023-01-01T00:00:00Z"
}`
          }
        ]
      }
    ]
  },
  {
    id: 'rest-billing',
    name: '计费 (REST API)',
    description: 'Supabase 管理 API - 项目计费和插件管理',
    officialDocs: 'https://supabase.com/docs/reference/api/introduction',
    endpoints: [
      {
        id: 'rest-list-project-addons',
        name: '列出项目插件',
        method: 'GET',
        path: '/v1/projects/{ref}/billing/addons',
        description: '获取项目当前启用的所有插件列表',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-list-project-addons',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: [
              {
                "variant": "compute_addon_c4_2x",
                "name": "Compute Add-on",
                "status": "active",
                "price": 10.00
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取项目插件',
            description: '列出项目的所有计费插件',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/billing/addons' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "variant": "compute_addon_c4_2x",
    "name": "Compute Add-on",
    "status": "active",
    "price": 10.00
  }
]`
          }
        ]
      },
      {
        id: 'rest-apply-project-addon',
        name: '应用项目插件',
        method: 'POST',
        path: '/v1/projects/{ref}/billing/addons',
        description: '为项目启用新的计费插件',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-apply-project-addon',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '插件配置信息',
          schema: {
            type: 'object',
            properties: {
              variant: { type: 'string' }
            },
            required: ['variant']
          },
          example: {
            "variant": "compute_addon_c4_2x"
          }
        },
        responses: [
          {
            status: 200,
            description: '应用成功',
            example: {
              "message": "Addon applied successfully"
            }
          }
        ],
        examples: [
          {
            title: '启用计算插件',
            description: '为项目启用额外的计算资源',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/billing/addons' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "variant": "compute_addon_c4_2x"
  }'`,
            response: `{
  "message": "Addon applied successfully"
}`
          }
        ]
      },
      {
        id: 'rest-remove-project-addon',
        name: '删除项目插件',
        method: 'DELETE',
        path: '/v1/projects/{ref}/billing/addons/{addon_variant}',
        description: '删除项目的指定计费插件',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-remove-project-addon',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          },
          {
            name: 'addon_variant',
            type: 'string',
            required: true,
            description: '插件变体标识符',
            example: 'compute_addon_c4_2x'
          }
        ],
        responses: [
          {
            status: 200,
            description: '删除成功',
            example: {
              "message": "Addon removed successfully"
            }
          }
        ],
        examples: [
          {
            title: '删除计算插件',
            description: '删除项目的计算资源插件',
            request: `curl -X DELETE \\
  'https://api.supabase.com/v1/projects/your-project-ref/billing/addons/compute_addon_c4_2x' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "message": "Addon removed successfully"
}`
          }
        ]
      }
    ]
  },
  {
    id: 'rest-domains',
    name: '域名 (REST API)',
    description: 'Supabase 管理 API - 自定义域名和子域名管理',
    officialDocs: 'https://supabase.com/docs/reference/api/introduction',
    endpoints: [
      {
        id: 'rest-get-hostname-config',
        name: '获取主机名配置 (测试版)',
        method: 'GET',
        path: '/v1/projects/{ref}/custom-hostname',
        description: '获取项目的自定义主机名配置信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-hostname-config',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "custom_hostname": "api.example.com",
              "status": "active",
              "ssl_status": "active"
            }
          }
        ],
        examples: [
          {
            title: '获取自定义域名配置',
            description: '查看项目的自定义域名设置',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/custom-hostname' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "custom_hostname": "api.example.com",
  "status": "active",
  "ssl_status": "active"
}`
          }
        ]
      },
      {
        id: 'rest-update-hostname-config',
        name: '更新主机名配置 (测试版)',
        method: 'POST',
        path: '/v1/projects/{ref}/custom-hostname/initialize',
        description: '初始化或更新项目的自定义主机名配置',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-update-hostname-config',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '主机名配置信息',
          schema: {
            type: 'object',
            properties: {
              custom_hostname: { type: 'string' }
            },
            required: ['custom_hostname']
          },
          example: {
            "custom_hostname": "api.example.com"
          }
        },
        responses: [
          {
            status: 200,
            description: '配置成功',
            example: {
              "message": "Custom hostname configured successfully"
            }
          }
        ],
        examples: [
          {
            title: '配置自定义域名',
            description: '为项目设置自定义域名',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/custom-hostname/initialize' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "custom_hostname": "api.example.com"
  }'`,
            response: `{
  "message": "Custom hostname configured successfully"
}`
          }
        ]
      },
      {
        id: 'rest-activate-custom-hostname',
        name: '激活自定义主机名 (测试版)',
        method: 'POST',
        path: '/v1/projects/{ref}/custom-hostname/activate',
        description: '激活项目的自定义主机名配置',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-activate-custom-hostname',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '激活成功',
            example: {
              "message": "Custom hostname activated successfully"
            }
          }
        ],
        examples: [
          {
            title: '激活自定义域名',
            description: '激活已配置的自定义域名',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/custom-hostname/activate' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "message": "Custom hostname activated successfully"
}`
          }
        ]
      },
      {
        id: 'rest-verify-dns-config',
        name: '验证 DNS 配置 (测试版)',
        method: 'POST',
        path: '/v1/projects/{ref}/custom-hostname/reverify',
        description: '验证自定义域名的 DNS 配置',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-verify-dns-config',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '验证成功',
            example: {
              "message": "DNS configuration verified successfully",
              "status": "verified"
            }
          }
        ],
        examples: [
          {
            title: '验证 DNS 配置',
            description: '验证自定义域名的 DNS 设置是否正确',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/custom-hostname/reverify' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "message": "DNS configuration verified successfully",
  "status": "verified"
}`
          }
        ]
      },
      {
        id: 'rest-get-vanity-subdomain-config',
        name: '获取虚属性子域配置 (测试版)',
        method: 'GET',
        path: '/v1/projects/{ref}/vanity-subdomain',
        description: '获取项目的虚属性子域配置信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-vanity-subdomain-config',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "vanity_subdomain": "myapp",
              "status": "active",
              "full_domain": "myapp.supabase.co"
            }
          }
        ],
        examples: [
          {
            title: '获取虚属性子域配置',
            description: '查看项目的虚属性子域设置',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/vanity-subdomain' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "vanity_subdomain": "myapp",
  "status": "active",
  "full_domain": "myapp.supabase.co"
}`
          }
        ]
      },
      {
        id: 'rest-check-vanity-subdomain-availability',
        name: '检查虚名子域可用性 (测试版)',
        method: 'GET',
        path: '/v1/projects/{ref}/vanity-subdomain/check-availability',
        description: '检查虚属性子域名是否可用',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-check-vanity-subdomain-availability',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          },
          {
            name: 'subdomain',
            type: 'string',
            required: true,
            description: '要检查的子域名',
            example: 'myapp'
          }
        ],
        responses: [
          {
            status: 200,
            description: '检查完成',
            example: {
              "available": true,
              "subdomain": "myapp"
            }
          }
        ],
        examples: [
          {
            title: '检查子域名可用性',
            description: '检查指定的虚属性子域名是否可用',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/vanity-subdomain/check-availability?subdomain=myapp' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "available": true,
  "subdomain": "myapp"
}`
          }
        ]
      },
      {
        id: 'rest-activate-vanity-subdomain-config',
        name: '激活虚属性子域配置 (测试版)',
        method: 'POST',
        path: '/v1/projects/{ref}/vanity-subdomain/activate',
        description: '激活项目的虚属性子域配置',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-activate-vanity-subdomain-config',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '虚属性子域配置',
          schema: {
            type: 'object',
            properties: {
              subdomain: { type: 'string' }
            },
            required: ['subdomain']
          },
          example: {
            "subdomain": "myapp"
          }
        },
        responses: [
          {
            status: 200,
            description: '激活成功',
            example: {
              "message": "Vanity subdomain activated successfully"
            }
          }
        ],
        examples: [
          {
            title: '激活虚属性子域',
            description: '激活项目的虚属性子域配置',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/vanity-subdomain/activate' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "subdomain": "myapp"
  }'`,
            response: `{
  "message": "Vanity subdomain activated successfully"
}`
          }
        ]
      },
      {
        id: 'rest-deactivate-vanity-subdomain-config',
        name: '停用虚名子域配置 (测试版)',
        method: 'DELETE',
        path: '/v1/projects/{ref}/vanity-subdomain',
        description: '停用项目的虚属性子域配置',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-deactivate-vanity-subdomain-config',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '停用成功',
            example: {
              "message": "Vanity subdomain deactivated successfully"
            }
          }
        ],
        examples: [
          {
            title: '停用虚属性子域',
            description: '停用项目的虚属性子域配置',
            request: `curl -X DELETE \\
  'https://api.supabase.com/v1/projects/your-project-ref/vanity-subdomain' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "message": "Vanity subdomain deactivated successfully"
}`
          }
        ]
      }
    ]
  },
  {
    id: 'rest-secrets',
    name: '密钥 (REST API)',
    description: 'Supabase 管理 API - 项目密钥和机密管理',
    officialDocs: 'https://supabase.com/docs/reference/api/introduction',
    endpoints: [
      {
        id: 'rest-list-secrets',
        name: '列出所有机密',
        method: 'GET',
        path: '/v1/projects/{ref}/secrets',
        description: '获取项目中配置的所有环境变量和机密',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-list-all-secrets',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: [
              {
                "name": "DATABASE_URL",
                "value": "postgresql://...",
                "created_at": "2023-01-01T00:00:00Z"
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取项目机密',
            description: '列出项目的所有环境变量',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/secrets' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "name": "DATABASE_URL",
    "value": "postgresql://...",
    "created_at": "2023-01-01T00:00:00Z"
  }
]`
          }
        ]
      },
      {
        id: 'rest-bulk-create-secrets',
        name: '批量创建机密',
        method: 'POST',
        path: '/v1/projects/{ref}/secrets',
        description: '批量创建或更新项目的环境变量和机密',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-bulk-create-secrets',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '机密配置列表',
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                value: { type: 'string' }
              }
            }
          },
          example: [
            {
              "name": "API_KEY",
              "value": "your-secret-api-key"
            },
            {
              "name": "DATABASE_URL",
              "value": "postgresql://user:pass@host:port/db"
            }
          ]
        },
        responses: [
          {
            status: 200,
            description: '创建成功',
            example: {
              "message": "Secrets created successfully"
            }
          }
        ],
        examples: [
          {
            title: '批量创建环境变量',
            description: '一次性创建多个项目环境变量',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/secrets' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '[
    {
      "name": "API_KEY",
      "value": "your-secret-api-key"
    },
    {
      "name": "DATABASE_URL", 
      "value": "postgresql://user:pass@host:port/db"
    }
  ]'`,
            response: `{
  "message": "Secrets created successfully"
}`
          }
        ]
      },
      {
        id: 'rest-bulk-delete-secrets',
        name: '批量删除机密',
        method: 'DELETE',
        path: '/v1/projects/{ref}/secrets',
        description: '批量删除项目的环境变量和机密',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-bulk-delete-secrets',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '要删除的机密名称列表',
          schema: {
            type: 'array',
            items: { type: 'string' }
          },
          example: ["API_KEY", "DATABASE_URL"]
        },
        responses: [
          {
            status: 200,
            description: '删除成功',
            example: {
              "message": "Secrets deleted successfully"
            }
          }
        ],
        examples: [
          {
            title: '批量删除环境变量',
            description: '一次性删除多个项目环境变量',
            request: `curl -X DELETE \\
  'https://api.supabase.com/v1/projects/your-project-ref/secrets' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '["API_KEY", "DATABASE_URL"]'`,
            response: `{
  "message": "Secrets deleted successfully"
}`
          }
        ]
      },
      {
        id: 'rest-create-project-api-key',
        name: '创建项目 API 密钥',
        method: 'POST',
        path: '/v1/projects/{ref}/api-keys',
        description: '为项目创建新的 API 密钥',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-create-project-api-key',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: 'API 密钥创建信息',
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              tags: { type: 'string' }
            },
            required: ['name', 'tags']
          },
          example: {
            "name": "custom-key",
            "tags": "custom"
          }
        },
        responses: [
          {
            status: 201,
            description: '创建成功',
            example: {
              "id": "key-123",
              "name": "custom-key",
              "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              "tags": "custom"
            }
          }
        ],
        examples: [
          {
            title: '创建自定义 API 密钥',
            description: '为项目创建新的自定义 API 密钥',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/api-keys' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "custom-key",
    "tags": "custom"
  }'`,
            response: `{
  "id": "key-123",
  "name": "custom-key",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tags": "custom"
}`
          }
        ]
      },
      {
        id: 'rest-get-project-api-key',
        name: '获取项目 API 密钥',
        method: 'GET',
        path: '/v1/projects/{ref}/api-keys/{id}',
        description: '获取指定的项目 API 密钥详细信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-project-api-key',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          },
          {
            name: 'id',
            type: 'string',
            required: true,
            description: 'API 密钥ID',
            example: 'key-123'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "id": "key-123",
              "name": "custom-key",
              "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              "tags": "custom",
              "created_at": "2023-01-01T00:00:00Z"
            }
          }
        ],
        examples: [
          {
            title: '获取 API 密钥详情',
            description: '获取指定 API 密钥的详细信息',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/api-keys/key-123' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "id": "key-123",
  "name": "custom-key",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tags": "custom",
  "created_at": "2023-01-01T00:00:00Z"
}`
          }
        ]
      },
      {
        id: 'rest-update-project-api-key',
        name: '更新项目 API 密钥',
        method: 'PATCH',
        path: '/v1/projects/{ref}/api-keys/{id}',
        description: '更新指定的项目 API 密钥',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-update-project-api-key',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          },
          {
            name: 'id',
            type: 'string',
            required: true,
            description: 'API 密钥ID',
            example: 'key-123'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: 'API 密钥更新信息',
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' }
            }
          },
          example: {
            "name": "updated-custom-key"
          }
        },
        responses: [
          {
            status: 200,
            description: '更新成功',
            example: {
              "message": "API key updated successfully"
            }
          }
        ],
        examples: [
          {
            title: '更新 API 密钥',
            description: '更新指定 API 密钥的信息',
            request: `curl -X PATCH \\
  'https://api.supabase.com/v1/projects/your-project-ref/api-keys/key-123' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "updated-custom-key"
  }'`,
            response: `{
  "message": "API key updated successfully"
}`
          }
        ]
      },
      {
        id: 'rest-delete-project-api-key',
        name: '删除项目 API 密钥',
        method: 'DELETE',
        path: '/v1/projects/{ref}/api-keys/{id}',
        description: '删除指定的项目 API 密钥',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-delete-project-api-key',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          },
          {
            name: 'id',
            type: 'string',
            required: true,
            description: 'API 密钥ID',
            example: 'key-123'
          }
        ],
        responses: [
          {
            status: 200,
            description: '删除成功',
            example: {
              "message": "API key deleted successfully"
            }
          }
        ],
        examples: [
          {
            title: '删除 API 密钥',
            description: '删除指定的项目 API 密钥',
            request: `curl -X DELETE \\
  'https://api.supabase.com/v1/projects/your-project-ref/api-keys/key-123' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "message": "API key deleted successfully"
}`
          }
        ]
      },
      {
        id: 'rest-get-project-legacy-api-keys',
        name: '获取项目旧版 API 密钥',
        method: 'GET',
        path: '/v1/projects/{ref}/api-keys/legacy',
        description: '获取项目的旧版 API 密钥信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-project-legacy-api-keys',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: [
              {
                "name": "anon",
                "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "tags": "anon"
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取旧版 API 密钥',
            description: '获取项目的旧版 API 密钥列表',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/api-keys/legacy' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "name": "anon",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tags": "anon"
  }
]`
          }
        ]
      },
      {
        id: 'rest-update-project-legacy-api-keys',
        name: '更新项目旧版 API 密钥',
        method: 'PATCH',
        path: '/v1/projects/{ref}/api-keys/legacy',
        description: '更新项目的旧版 API 密钥',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-update-project-legacy-api-keys',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '旧版 API 密钥更新信息',
          schema: {
            type: 'object',
            properties: {
              rotate: { type: 'boolean' }
            }
          },
          example: {
            "rotate": true
          }
        },
        responses: [
          {
            status: 200,
            description: '更新成功',
            example: {
              "message": "Legacy API keys updated successfully"
            }
          }
        ],
        examples: [
          {
            title: '轮换旧版 API 密钥',
            description: '轮换项目的旧版 API 密钥',
            request: `curl -X PATCH \\
  'https://api.supabase.com/v1/projects/your-project-ref/api-keys/legacy' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "rotate": true
  }'`,
            response: `{
  "message": "Legacy API keys updated successfully"
}`
          }
        ]
      },
      {
        id: 'rest-get-pgsodium-config',
        name: '获取 PgSodium 配置 (测试版)',
        method: 'GET',
        path: '/v1/projects/{ref}/pgsodium',
        description: '获取项目的 PgSodium 加密配置信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-pgsodium-config',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "root_key": "your-root-key-id",
              "enabled": true
            }
          }
        ],
        examples: [
          {
            title: '获取 PgSodium 配置',
            description: '获取项目的加密配置信息',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/pgsodium' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "root_key": "your-root-key-id",
  "enabled": true
}`
          }
        ]
      },
      {
        id: 'rest-update-pgsodium-config',
        name: '更新 PgSodium 配置 (测试版)',
        method: 'PATCH',
        path: '/v1/projects/{ref}/pgsodium',
        description: '更新项目的 PgSodium 加密配置',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-update-pgsodium-config',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: 'PgSodium 配置更新信息',
          schema: {
            type: 'object',
            properties: {
              root_key: { type: 'string' }
            }
          },
          example: {
            "root_key": "new-root-key-id"
          }
        },
        responses: [
          {
            status: 200,
            description: '更新成功',
            example: {
              "message": "PgSodium config updated successfully"
            }
          }
        ],
        examples: [
          {
            title: '更新 PgSodium 配置',
            description: '更新项目的加密配置',
            request: `curl -X PATCH \\
  'https://api.supabase.com/v1/projects/your-project-ref/pgsodium' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "root_key": "new-root-key-id"
  }'`,
            response: `{
  "message": "PgSodium config updated successfully"
}`
          }
        ]
      }
    ]
  },
  {
    id: 'rest-storage',
    name: '存储 (REST API)',
    description: 'Supabase 管理 API - 存储服务配置和管理',
    officialDocs: 'https://supabase.com/docs/reference/api/introduction',
    endpoints: [
      {
        id: 'rest-get-storage-config',
        name: '获取存储配置',
        method: 'GET',
        path: '/v1/projects/{ref}/config/storage',
        description: '获取项目的存储服务配置信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-storage-config',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "file_size_limit": 52428800,
              "features": {
                "image_transformation": true
              }
            }
          }
        ],
        examples: [
          {
            title: '获取存储配置',
            description: '查看项目的存储服务设置',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/storage' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "file_size_limit": 52428800,
  "features": {
    "image_transformation": true
  }
}`
          }
        ]
      },
      {
        id: 'rest-list-storage-buckets',
        name: '列出所有存储桶',
        method: 'GET',
        path: '/v1/projects/{ref}/storage/buckets',
        description: '获取项目中创建的所有存储桶列表',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-list-all-buckets',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: [
              {
                "id": "avatars",
                "name": "avatars",
                "public": true,
                "created_at": "2023-01-01T00:00:00Z"
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取存储桶列表',
            description: '列出项目的所有存储桶',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/storage/buckets' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": "avatars",
    "name": "avatars", 
    "public": true,
    "created_at": "2023-01-01T00:00:00Z"
  }
]`
          }
        ]
      },
      {
        id: 'rest-update-storage-config',
        name: '更新存储配置',
        method: 'PATCH',
        path: '/v1/projects/{ref}/config/storage',
        description: '更新项目的存储服务配置',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-update-storage-config',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '存储配置更新数据',
          schema: {
            type: 'object',
            properties: {
              file_size_limit: { type: 'number' },
              features: { type: 'object' }
            }
          },
          example: {
            "file_size_limit": 104857600,
            "features": {
              "image_transformation": true
            }
          }
        },
        responses: [
          {
            status: 200,
            description: '更新成功',
            example: {
              "message": "Storage config updated successfully"
            }
          }
        ],
        examples: [
          {
            title: '更新存储配置',
            description: '修改项目的存储服务设置',
            request: `curl -X PATCH \\
  'https://api.supabase.com/v1/projects/your-project-ref/config/storage' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "file_size_limit": 104857600,
    "features": {
      "image_transformation": true
    }
  }'`,
            response: `{
  "message": "Storage config updated successfully"
}`
          }
        ]
      }
    ]
  },
  {
    id: 'rest-organizations',
    name: '组织 (REST API)',
    description: 'Supabase 管理 API - 组织管理',
    officialDocs: 'https://supabase.com/docs/reference/api/introduction',
    endpoints: [
      {
        id: 'rest-list-organizations',
        name: '列出所有组织',
        method: 'GET',
        path: '/v1/organizations',
        description: '获取当前用户可访问的所有组织列表',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-list-all-organizations',
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: [
              {
                "id": "org-123",
                "slug": "my-organization",
                "name": "My Organization",
                "billing_email": "billing@example.com",
                "created_at": "2023-01-01T00:00:00Z"
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取组织列表',
            description: '获取所有可访问的组织',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/organizations' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": "org-123",
    "slug": "my-organization", 
    "name": "My Organization",
    "billing_email": "billing@example.com",
    "created_at": "2023-01-01T00:00:00Z"
  }
]`
          }
        ]
      },
      {
        id: 'rest-get-organization',
        name: '获取组织',
        method: 'GET',
        path: '/v1/organizations/{slug}',
        description: '获取指定组织的详细信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-an-organization',
        parameters: [
          {
            name: 'slug',
            type: 'string',
            required: true,
            description: '组织标识符',
            example: 'my-organization'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "id": "org-123",
              "slug": "my-organization",
              "name": "My Organization", 
              "billing_email": "billing@example.com",
              "tier": "free",
              "created_at": "2023-01-01T00:00:00Z"
            }
          }
        ],
        examples: [
          {
            title: '获取组织详情',
            description: '获取指定组织的详细信息',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/organizations/my-organization' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "id": "org-123",
  "slug": "my-organization",
  "name": "My Organization", 
  "billing_email": "billing@example.com",
  "tier": "free",
  "created_at": "2023-01-01T00:00:00Z"
}`
          }
        ]
      },
      {
        id: 'rest-list-organization-members',
        name: '列出组织成员',
        method: 'GET',
        path: '/v1/organizations/{slug}/members',
        description: '获取指定组织的所有成员列表',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-list-organization-members',
        parameters: [
          {
            name: 'slug',
            type: 'string',
            required: true,
            description: '组织标识符',
            example: 'my-organization'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: [
              {
                "id": "user-123",
                "email": "user@example.com",
                "role": "owner",
                "joined_at": "2023-01-01T00:00:00Z"
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取组织成员',
            description: '列出组织的所有成员及其角色',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/organizations/my-organization/members' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": "user-123",
    "email": "user@example.com",
    "role": "owner",
    "joined_at": "2023-01-01T00:00:00Z"
  }
]`
          }
        ]
      },
      {
        id: 'rest-create-organization',
        name: '创建组织',
        method: 'POST',
        path: '/v1/organizations',
        description: '创建新的组织',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-create-an-organization',
        requestBody: {
          type: 'application/json',
          description: '组织创建信息',
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              billing_email: { type: 'string' }
            },
            required: ['name']
          },
          example: {
            "name": "My New Organization",
            "billing_email": "billing@example.com"
          }
        },
        responses: [
          {
            status: 201,
            description: '创建成功',
            example: {
              "id": "org-456",
              "slug": "my-new-organization",
              "name": "My New Organization",
              "created_at": "2023-01-01T00:00:00Z"
            }
          }
        ],
        examples: [
          {
            title: '创建新组织',
            description: '创建一个新的 Supabase 组织',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/organizations' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "My New Organization",
    "billing_email": "billing@example.com"
  }'`,
            response: `{
  "id": "org-456",
  "slug": "my-new-organization",
  "name": "My New Organization",
  "created_at": "2023-01-01T00:00:00Z"
}`
          }
        ]
      }
    ]
  },
  {
    id: 'rest-environments',
    name: '环境 (REST API)',
    description: 'Supabase 管理 API - 分支和环境管理',
    officialDocs: 'https://supabase.com/docs/reference/api/introduction',
    endpoints: [
      {
        id: 'rest-create-branch',
        name: '创建分支',
        method: 'POST',
        path: '/v1/projects/{ref}/branches',
        description: '为项目创建新的预览分支',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-create-a-branch',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: '分支创建信息',
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              git_branch: { type: 'string' }
            },
            required: ['name']
          },
          example: {
            "name": "feature-branch",
            "git_branch": "feature/new-feature"
          }
        },
        responses: [
          {
            status: 201,
            description: '创建成功',
            example: {
              "id": "branch-123",
              "name": "feature-branch",
              "status": "creating"
            }
          }
        ],
        examples: [
          {
            title: '创建预览分支',
            description: '为项目创建新的预览分支环境',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/projects/your-project-ref/branches' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "feature-branch",
    "git_branch": "feature/new-feature"
  }'`,
            response: `{
  "id": "branch-123",
  "name": "feature-branch",
  "status": "creating"
}`
          }
        ]
      },
      {
        id: 'rest-list-all-branches',
        name: '列出所有分支',
        method: 'GET',
        path: '/v1/projects/{ref}/branches',
        description: '获取项目的所有预览分支列表',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-list-all-branches',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: [
              {
                "id": "branch-123",
                "name": "feature-branch",
                "status": "active",
                "created_at": "2023-01-01T00:00:00Z"
              }
            ]
          }
        ],
        examples: [
          {
            title: '获取分支列表',
            description: '列出项目的所有预览分支',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/branches' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `[
  {
    "id": "branch-123",
    "name": "feature-branch",
    "status": "active",
    "created_at": "2023-01-01T00:00:00Z"
  }
]`
          }
        ]
      },
      {
        id: 'rest-get-branch',
        name: '获取分支',
        method: 'GET',
        path: '/v1/projects/{ref}/branches/{name}',
        description: '获取指定预览分支的详细信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-a-branch',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          },
          {
            name: 'name',
            type: 'string',
            required: true,
            description: '分支名称',
            example: 'feature-branch'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "id": "branch-123",
              "name": "feature-branch",
              "status": "active",
              "git_branch": "feature/new-feature",
              "created_at": "2023-01-01T00:00:00Z"
            }
          }
        ],
        examples: [
          {
            title: '获取分支详情',
            description: '获取指定预览分支的详细信息',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/branches/feature-branch' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "id": "branch-123",
  "name": "feature-branch",
  "status": "active",
  "git_branch": "feature/new-feature",
  "created_at": "2023-01-01T00:00:00Z"
}`
          }
        ]
      },
      {
        id: 'rest-delete-branch',
        name: '删除分支',
        method: 'DELETE',
        path: '/v1/branches/{branch_id_or_ref}',
        description: '删除指定的预览分支',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-delete-a-branch',
        parameters: [
          {
            name: 'branch_id_or_ref',
            type: 'string',
            required: true,
            description: '分支ID或引用',
            example: 'branch-123'
          }
        ],
        responses: [
          {
            status: 200,
            description: '删除成功',
            example: {
              "message": "Branch deleted successfully"
            }
          }
        ],
        examples: [
          {
            title: '删除预览分支',
            description: '删除不再需要的预览分支',
            request: `curl -X DELETE \\
  'https://api.supabase.com/v1/branches/branch-123' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "message": "Branch deleted successfully"
}`
          }
        ]
      },
      {
        id: 'rest-merge-branch',
        name: '合并分支',
        method: 'POST',
        path: '/v1/branches/{branch_id_or_ref}/merge',
        description: '将预览分支的更改合并到主分支',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-merge-a-branch',
        parameters: [
          {
            name: 'branch_id_or_ref',
            type: 'string',
            required: true,
            description: '分支ID或引用',
            example: 'branch-123'
          }
        ],
        responses: [
          {
            status: 200,
            description: '合并成功',
            example: {
              "message": "Branch merged successfully"
            }
          }
        ],
        examples: [
          {
            title: '合并预览分支',
            description: '将预览分支的更改合并到主分支',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/branches/branch-123/merge' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "message": "Branch merged successfully"
}`
          }
        ]
      }
    ]
  },
  {
    id: 'rest-oauth',
    name: 'OAuth (REST API)',
    description: 'Supabase 管理 API - OAuth 令牌管理',
    officialDocs: 'https://supabase.com/docs/reference/api/introduction',
    endpoints: [
      {
        id: 'rest-authorize-user',
        name: '授权用户 (测试版)',
        method: 'GET',
        path: '/v1/oauth/authorize',
        description: '启动 OAuth 授权流程',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-authorize-user',
        parameters: [
          {
            name: 'client_id',
            type: 'string',
            required: true,
            description: '客户端ID',
            example: 'your-client-id'
          },
          {
            name: 'redirect_uri',
            type: 'string',
            required: true,
            description: '重定向URI',
            example: 'https://yourapp.com/callback'
          },
          {
            name: 'response_type',
            type: 'string',
            required: true,
            description: '响应类型',
            example: 'code'
          },
          {
            name: 'scope',
            type: 'string',
            required: false,
            description: '权限范围',
            example: 'read write'
          }
        ],
        responses: [
          {
            status: 302,
            description: '重定向到授权页面'
          }
        ],
        examples: [
          {
            title: 'OAuth 授权',
            description: '启动 OAuth 授权流程',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/oauth/authorize?client_id=your-client-id&redirect_uri=https://yourapp.com/callback&response_type=code&scope=read+write' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `// 重定向到授权页面`
          }
        ]
      },
      {
        id: 'rest-exchange-oauth-token',
        name: '交换 OAuth 令牌 (测试版)',
        method: 'POST',
        path: '/v1/oauth/token',
        description: '使用授权码交换访问令牌',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-exchange-oauth-token',
        requestBody: {
          type: 'application/json',
          description: '令牌交换信息',
          schema: {
            type: 'object',
            properties: {
              grant_type: { type: 'string' },
              code: { type: 'string' },
              redirect_uri: { type: 'string' },
              client_id: { type: 'string' }
            },
            required: ['grant_type', 'code']
          },
          example: {
            "grant_type": "authorization_code",
            "code": "auth-code-123",
            "redirect_uri": "https://yourapp.com/callback",
            "client_id": "your-client-id"
          }
        },
        responses: [
          {
            status: 200,
            description: '交换成功',
            example: {
              "access_token": "access-token-123",
              "token_type": "Bearer",
              "expires_in": 3600,
              "refresh_token": "refresh-token-123"
            }
          }
        ],
        examples: [
          {
            title: '交换访问令牌',
            description: '使用授权码获取访问令牌',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/oauth/token' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "grant_type": "authorization_code",
    "code": "auth-code-123",
    "redirect_uri": "https://yourapp.com/callback",
    "client_id": "your-client-id"
  }'`,
            response: `{
  "access_token": "access-token-123",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "refresh-token-123"
}`
          }
        ]
      },
      {
        id: 'rest-revoke-token',
        name: '撤销令牌 (测试版)',
        method: 'POST',
        path: '/v1/oauth/revoke',
        description: '撤销指定的访问令牌或刷新令牌',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-revoke-token',
        requestBody: {
          type: 'application/json',
          description: '令牌撤销信息',
          schema: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              token_type_hint: { type: 'string' }
            },
            required: ['token']
          },
          example: {
            "token": "access-token-123",
            "token_type_hint": "access_token"
          }
        },
        responses: [
          {
            status: 200,
            description: '撤销成功',
            example: {
              "message": "Token revoked successfully"
            }
          }
        ],
        examples: [
          {
            title: '撤销访问令牌',
            description: '撤销不再需要的访问令牌',
            request: `curl -X POST \\
  'https://api.supabase.com/v1/oauth/revoke' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "token": "access-token-123",
    "token_type_hint": "access_token"
  }'`,
            response: `{
  "message": "Token revoked successfully"
}`
          }
        ]
      }
    ]
  },
  {
    id: 'rest-postgrest',
    name: 'PostgREST (REST API)',
    description: 'Supabase 管理 API - PostgREST 服务配置',
    officialDocs: 'https://supabase.com/docs/reference/api/introduction',
    endpoints: [
      {
        id: 'rest-get-postgrest-service-config',
        name: '获取 PostgREST 服务配置',
        method: 'GET',
        path: '/v1/projects/{ref}/postgrest',
        description: '获取项目的 PostgREST 服务配置信息',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-get-postgrest-service-config',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        responses: [
          {
            status: 200,
            description: '获取成功',
            example: {
              "db_schema": "public",
              "db_anon_role": "anon",
              "db_use_legacy_gucs": false,
              "max_rows": 1000
            }
          }
        ],
        examples: [
          {
            title: '获取 PostgREST 配置',
            description: '获取 PostgREST 服务的配置参数',
            request: `curl -X GET \\
  'https://api.supabase.com/v1/projects/your-project-ref/postgrest' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
            response: `{
  "db_schema": "public",
  "db_anon_role": "anon",
  "db_use_legacy_gucs": false,
  "max_rows": 1000
}`
          }
        ]
      },
      {
        id: 'rest-update-postgrest-service-config',
        name: '更新 PostgREST 服务配置',
        method: 'PATCH',
        path: '/v1/projects/{ref}/postgrest',
        description: '更新项目的 PostgREST 服务配置',
        officialDocs: 'https://supabase.com/docs/reference/api/v1-update-postgrest-service-config',
        parameters: [
          {
            name: 'ref',
            type: 'string',
            required: true,
            description: '项目引用ID',
            example: 'your-project-ref'
          }
        ],
        requestBody: {
          type: 'application/json',
          description: 'PostgREST 配置更新数据',
          schema: {
            type: 'object',
            properties: {
              db_schema: { type: 'string' },
              max_rows: { type: 'number' },
              db_use_legacy_gucs: { type: 'boolean' }
            }
          },
          example: {
            "db_schema": "public,api",
            "max_rows": 2000,
            "db_use_legacy_gucs": false
          }
        },
        responses: [
          {
            status: 200,
            description: '更新成功',
            example: {
              "message": "PostgREST config updated successfully"
            }
          }
        ],
        examples: [
          {
            title: '更新 PostgREST 配置',
            description: '修改 PostgREST 服务的配置参数',
            request: `curl -X PATCH \\
  'https://api.supabase.com/v1/projects/your-project-ref/postgrest' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "db_schema": "public,api",
    "max_rows": 2000,
    "db_use_legacy_gucs": false
  }'`,
            response: `{
  "message": "PostgREST config updated successfully"
}`
          }
        ]
      }
    ]
  }
]