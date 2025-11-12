# Supabase 管理 API (REST API)

官网：https://supabase.com/docs/reference/api/introduction

**重要说明：**
- 所有 REST API 端点需要使用**个人访问令牌 (Personal Access Token)** 进行身份验证
- HTTP 头格式：`Authorization: Bearer {your_personal_access_token}`
- 个人访问令牌可在 Supabase Dashboard 的 Account Settings > Access Tokens 中生成
- 这些 API 仅用于管理操作，不应在客户端代码中使用

# 分析学
## 获取项目的函数组合统计信息
文档：https://supabase.com/docs/reference/api/v1-get-project-function-combined-stats
方法：GET
URL：/v1/projects/{ref}/analytics/endpoints/functions.combined-stats
密钥类型：个人访问令牌
HTTP 头：Authorization: Bearer {your_personal_access_token}

## 获取项目日志
文档：https://supabase.com/docs/reference/api/v1-get-project-logs
方法：GET
URL：/v1/projects/{ref}/analytics/endpoints/logs.all
密钥类型：个人访问令牌
HTTP 头：Authorization: Bearer {your_personal_access_token}

## 获取项目的使用 API 计数
文档：https://supabase.com/docs/reference/api/v1-get-project-usage-api-count
方法：GET
URL：/v1/projects/{ref}/analytics/endpoints/usage.api-counts
密钥类型：个人访问令牌
HTTP 头：Authorization: Bearer {your_personal_access_token}

## 获取项目的使用 API 请求计数
文档：https://supabase.com/docs/reference/api/v1-get-project-usage-request-count
方法：GET
URL：/v1/projects/{ref}/analytics/endpoints/usage.api-requests-count
密钥类型：个人访问令牌
HTTP 头：Authorization: Bearer {your_personal_access_token}

# 认证配置
**说明：** 所有认证配置接口需要个人访问令牌，HTTP 头：`Authorization: Bearer {token}`

## 创建 SSO 提供程序
文档：https://supabase.com/docs/reference/api/v1-create-a-sso-provider
方法：POST
URL：/v1/projects/{ref}/config/auth/sso/providers

## 创建旧签名密钥
文档：https://supabase.com/docs/reference/api/v1-create-legacy-signing-key
方法：POST
URL：/v1/projects/{ref}/config/auth/signing-keys/legacy

## 创建项目签名密钥
文档：https://supabase.com/docs/reference/api/v1-create-project-signing-key
方法：POST
URL：/v1/projects/{ref}/config/auth/signing-keys

## 创建项目 tpa 集成
文档：https://supabase.com/docs/reference/api/v1-create-project-tpa-integration
方法：POST
URL：/v1/projects/{ref}/config/auth/third-party-auth

## 删除 SSO 提供程序
文档：https://supabase.com/docs/reference/api/v1-delete-a-sso-provider
方法：DELETE
URL：/v1/projects/{ref}/config/auth/sso/providers/{provider_id}

## 删除项目 tpa 集成
文档：https://supabase.com/docs/reference/api/v1-delete-project-tpa-integration
方法：DELETE
URL：/v1/projects/{ref}/config/auth/third-party-auth/{tpa_id}

## 获取 SSO 提供商
文档：https://supabase.com/docs/reference/api/v1-get-a-sso-provider
方法：GET
URL：/v1/projects/{ref}/config/auth/sso/providers/{provider_id}

## 获取身份验证服务配置
文档：https://supabase.com/docs/reference/api/v1-get-auth-service-config
方法：GET
URL：/v1/projects/{ref}/config/auth

## 获取旧签名密钥
文档：https://supabase.com/docs/reference/api/v1-get-legacy-signing-key
方法：GET
URL：/v1/projects/{ref}/config/auth/signing-keys/legacy

## 获取项目签名密钥
文档：https://supabase.com/docs/reference/api/v1-get-project-signing-key
方法：GET
URL：/v1/projects/{ref}/config/auth/signing-keys/{id}

## 获取所有项目签名密钥
文档：https://supabase.com/docs/reference/api/v1-get-project-signing-keys
方法：GET
URL：/v1/projects/{ref}/config/auth/signing-keys

## 获取项目 tpa 集成
文档：https://supabase.com/docs/reference/api/v1-get-project-tpa-integration
方法：GET
URL：/v1/projects/{ref}/config/auth/third-party-auth/{tpa_id}

## 列出所有 SSO 提供程序
文档：https://supabase.com/docs/reference/api/v1-list-all-sso-provider
方法：GET
URL：/v1/projects/{ref}/config/auth/sso/providers

## 列出项目 tpa 集成
文档：https://supabase.com/docs/reference/api/v1-list-project-tpa-integrations
方法：GET
URL：/v1/projects/{ref}/config/auth/third-party-auth

## 删除项目签名密钥
文档：https://supabase.com/docs/reference/api/v1-remove-project-signing-key
方法：DELETE
URL：/v1/projects/{ref}/config/auth/signing-keys/{id}

## 更新 SSO 提供程序
文档：https://supabase.com/docs/reference/api/v1-update-a-sso-provider
方法：PATCH
URL：/v1/projects/{ref}/config/auth/sso/providers/{provider_id}

## 更新身份验证服务配置
文档：https://supabase.com/docs/reference/api/v1-update-auth-service-config
方法：PATCH
URL：/v1/projects/{ref}/config/auth

## 更新项目签名密钥
文档：https://supabase.com/docs/reference/api/v1-update-project-signing-key
方法：PATCH
URL：/v1/projects/{ref}/config/auth/signing-keys/{id}

# 计费
## 应用项目插件
文档：https://supabase.com/docs/reference/api/v1-apply-project-addon
url：/v1/projects/{ref}/billing/addons

## 列出项目插件
文档：https://supabase.com/docs/reference/api/v1-list-project-addons
url：/v1/projects/{ref}/billing/addons

## 删除项目插件
文档：https://supabase.com/docs/reference/api/v1-remove-project-addon
url：/v1/projects/{ref}/billing/addons/{addon_variant}

# 数据库
## 应用迁移
文档：https://supabase.com/docs/reference/api/v1-apply-a-migration
url：/v1/projects/{ref}/database/migrations

## 授权 jit 访问
文档：https://supabase.com/docs/reference/api/v1-authorize-jit-access
url：/v1/projects/{ref}/database/jit

## 创建登录角色
文档：https://supabase.com/docs/reference/api/v1-create-login-role
url：/v1/projects/{ref}/cli/login-role

## 删除 jit 访问权限
文档：https://supabase.com/docs/reference/api/v1-delete-jit-access
url：/v1/projects/{ref}/database/jit/{user_id}

## 删除登录角色
文档：https://supabase.com/docs/reference/api/v1-delete-login-roles
url：/v1/projects/{ref}/cli/login-role

## 暂时禁用只读模式
文档：https://supabase.com/docs/reference/api/v1-disable-readonly-mode-temporarily
url：/v1/projects/{ref}/readonly/temporary-disable

## 启用数据库 Webhook
文档：https://supabase.com/docs/reference/api/v1-enable-database-webhook
url：/v1/projects/{ref}/database/webhooks/enable

## 生成 typescript 类型
文档：https://supabase.com/docs/reference/api/v1-generate-typescript-types
url：/v1/projects/{ref}/types/typescript

## 获取代码段
文档：https://supabase.com/docs/reference/api/v1-get-a-snippet
url：/v1/snippets/{id}

## 获取数据库元数据（已弃用）
文档：https://supabase.com/docs/reference/api/v1-get-database-metadata
url：/v1/projects/{ref}/database/context

## 获取 jit 访问权限
文档：https://supabase.com/docs/reference/api/v1-get-jit-access
url：/v1/projects/{ref}/database/jit

## 获取池程序配置
文档：https://supabase.com/docs/reference/api/v1-get-pooler-config
url：/v1/projects/{ref}/config/database/pooler

## 获取 postgres 配置
文档：https://supabase.com/docs/reference/api/v1-get-postgres-config
url：/v1/projects/{ref}/config/database/postgres

## 获取项目 pgbouncer 配置
文档：https://supabase.com/docs/reference/api/v1-get-project-pgbouncer-config
url：/v1/projects/{ref}/config/database/pgbouncer

## 获取只读模式状态
文档：https://supabase.com/docs/reference/api/v1-get-readonly-mode-status
url：/v1/projects/{ref}/readonly

## 获取 SSL 强制配置
文档：https://supabase.com/docs/reference/api/v1-get-ssl-enforcement-config
url：/v1/projects/{ref}/ssl-enforcement

## 列出所有备份
文档：https://supabase.com/docs/reference/api/v1-list-all-backups
url：/v1/projects/{ref}/database/backups

## 列出所有代码段
文档：https://supabase.com/docs/reference/api/v1-list-all-snippets
url：/v1/snippets

## 列出 jit 访问
文档：https://supabase.com/docs/reference/api/v1-list-jit-access
url：/v1/projects/{ref}/database/jit/list

## 列出迁移历史记录（测试版）
文档：https://supabase.com/docs/reference/api/v1-list-migration-history
url：/v1/projects/{ref}/database/migrations

## 删除只读副本（测试版）
文档：https://supabase.com/docs/reference/api/v1-remove-a-read-replica
url：/v1/projects/{ref}/read-replicas/remove

## 恢复 pitr 备份
文档：https://supabase.com/docs/reference/api/v1-restore-pitr-backup
url：/v1/projects/{ref}/database/backups/restore-pitr

## 运行查询（测试版）
文档：https://supabase.com/docs/reference/api/v1-run-a-query
url：/v1/projects/{ref}/database/query

## 设置只读副本（测试版）
文档：https://supabase.com/docs/reference/api/v1-setup-a-read-replica
url：/v1/projects/{ref}/read-replicas/setup

## 更新 jit 访问
文档：https://supabase.com/docs/reference/api/v1-update-jit-access
url：/v1/projects/{ref}/database/jit

## 更新池程序配置
文档：https://supabase.com/docs/reference/api/v1-update-pooler-config
url：/v1/projects/{ref}/config/database/pooler

## 更新 postgres 配置
文档：https://supabase.com/docs/reference/api/v1-update-postgres-config
url：/v1/projects/{ref}/config/database/postgres

## 更新 SSL 强制配置（测试版）
文档：https://supabase.com/docs/reference/api/v1-update-ssl-enforcement-config
url：/v1/projects/{ref}/ssl-enforcement

## 更新插入迁移（测试版）
文档：https://supabase.com/docs/reference/api/v1-upsert-a-migration
url：/v1/projects/{ref}/database/migrations

# 域名
## 激活自定义主机名（测试版）
文档：https://supabase.com/docs/reference/api/v1-activate-custom-hostname
url：/v1/projects/{ref}/custom-hostname/activate

## 激活虚属性子域配置（测试版）
文档：https://supabase.com/docs/reference/api/v1-activate-vanity-subdomain-config
url：/v1/projects/{ref}/vanity-subdomain/activate

## 检查虚名子域可用性（测试版）
文档：https://supabase.com/docs/reference/api/v1-check-vanity-subdomain-availability
url：/v1/projects/{ref}/vanity-subdomain/check-availability

## 停用虚名子域配置（测试版）
文档：https://supabase.com/docs/reference/api/v1-deactivate-vanity-subdomain-config
url：/v1/projects/{ref}/vanity-subdomain

## 获取主机名配置（测试版）
文档：https://supabase.com/docs/reference/api/v1-get-hostname-config
url：/v1/projects/{ref}/custom-hostname

## 获取虚属性子域配置（测试版）
文档：https://supabase.com/docs/reference/api/v1-get-vanity-subdomain-config
url：/v1/projects/{ref}/vanity-subdomain

## 更新主机名配置（测试版）
文档：https://supabase.com/docs/reference/api/v1-update-hostname-config
url：/v1/projects/{ref}/custom-hostname/initialize

## 验证 DNS 配置（测试版）
文档：https://supabase.com/docs/reference/api/v1-verify-dns-config
url：/v1/projects/{ref}/custom-hostname/reverify

# 边缘函数
## 批量更新功能
文档：https://supabase.com/docs/reference/api/v1-bulk-update-functions
url：/v1/projects/{ref}/functions

## 创建函数（已弃用）
文档：https://supabase.com/docs/reference/api/v1-create-a-function
url：/v1/projects/{ref}/functions

## 删除函数
文档：https://supabase.com/docs/reference/api/v1-delete-a-function
url：/v1/projects/{ref}/functions/{function_slug}

## 部署函数
文档：https://supabase.com/docs/reference/api/v1-deploy-a-function
url：/v1/projects/{ref}/functions/deploy

## 获取函数
文档：https://supabase.com/docs/reference/api/v1-get-a-function
url：/v1/projects/{ref}/functions/{function_slug}

## 获取函数体
文档：https://supabase.com/docs/reference/api/v1-get-a-function-body
url：/v1/projects/{ref}/functions/{function_slug}/body

## 列出所有功能
文档：https://supabase.com/docs/reference/api/v1-list-all-functions
url：/v1/projects/{ref}/functions

## 更新函数
文档：https://supabase.com/docs/reference/api/v1-update-a-function
url：/v1/projects/{ref}/functions/{function_slug}

# 环境
## 创建分支
文档：https://supabase.com/docs/reference/api/v1-create-a-branch
url：/v1/projects/{ref}/branches

## 删除分支
文档：https://supabase.com/docs/reference/api/v1-delete-a-branch
url：/v1/branches/{branch_id_or_ref}

## 差异分支
文档：https://supabase.com/docs/reference/api/v1-diff-a-branch
url：/v1/branches/{branch_id_or_ref}/diff

## 禁用预览分支
文档：https://supabase.com/docs/reference/api/v1-disable-preview-branching
url：/v1/projects/{ref}/branches

## 获取分支
文档：https://supabase.com/docs/reference/api/v1-get-a-branch
url：/v1/projects/{ref}/branches/{name}

## 获取分支配置
文档：https://supabase.com/docs/reference/api/v1-get-a-branch-config
url：/v1/branches/{branch_id_or_ref}

## 列出所有分支
文档：https://supabase.com/docs/reference/api/v1-list-all-branches
url：/v1/projects/{ref}/branches

## 合并分支
文档：https://supabase.com/docs/reference/api/v1-merge-a-branch
url：/v1/branches/{branch_id_or_ref}/merge

## 推送分支
文档：https://supabase.com/docs/reference/api/v1-push-a-branch
url：/v1/branches/{branch_id_or_ref}/push

## 重置分支
文档：https://supabase.com/docs/reference/api/v1-reset-a-branch
url：/v1/branches/{branch_id_or_ref}/reset

## 更新分支配置
文档：https://supabase.com/docs/reference/api/v1-update-a-branch-config
url：/v1/branches/{branch_id_or_ref}

# OAuth
## 授权用户（测试版）
文档：https://supabase.com/docs/reference/api/v1-authorize-user
url：/v1/oauth/authorize

## 交换 oauth 令牌（测试版）
文档：https://supabase.com/docs/reference/api/v1-exchange-oauth-token
url：/v1/oauth/token

## 撤销令牌（测试版）
文档：https://supabase.com/docs/reference/api/v1-revoke-token
url：/v1/oauth/revoke

# 组织
## 创建组织
文档：https://supabase.com/docs/reference/api/v1-create-an-organization
url：/v1/organizations

## 获取组织
文档：https://supabase.com/docs/reference/api/v1-get-an-organization
url：/v1/organizations/{slug}

## 列出所有组织
文档：https://supabase.com/docs/reference/api/v1-list-all-organizations
url：/v1/organizations

## 列出组织成员
文档：https://supabase.com/docs/reference/api/v1-list-organization-members
url：/v1/organizations/{slug}/members

# 项目
## 取消项目恢复
文档：https://supabase.com/docs/reference/api/v1-cancel-a-project-restoration
url：/v1/projects/{ref}/restore/cancel

## 创建项目
文档：https://supabase.com/docs/reference/api/v1-create-a-project
url：/v1/projects

## 删除项目
文档：https://supabase.com/docs/reference/api/v1-delete-a-project
url：/v1/projects/{ref}

## 删除网络禁令（测试版）
文档：https://supabase.com/docs/reference/api/v1-delete-network-bans
url：/v1/projects/{ref}/network-bans

## 获取网络限制（测试版）
文档：https://supabase.com/docs/reference/api/v1-get-network-restrictions
url：/v1/projects/{ref}/network-restrictions

## 获得 postgres 升级资格（测试版）
文档：https://supabase.com/docs/reference/api/v1-get-postgres-upgrade-eligibility
url：/v1/projects/{ref}/upgrade/eligibility

## 获取 postgres 升级状态（测试版）
文档：https://supabase.com/docs/reference/api/v1-get-postgres-upgrade-status
url：/v1/projects/{ref}/upgrade/status

## 获取项目
文档：https://supabase.com/docs/reference/api/v1-get-project
url：/v1/projects/{ref}

## 获取服务运行状况
文档：https://supabase.com/docs/reference/api/v1-get-services-health
url：/v1/projects/{ref}/health

## 列出所有网络禁令（测试版）
文档：https://supabase.com/docs/reference/api/v1-list-all-network-bans
url：/v1/projects/{ref}/network-bans/retrieve

## 列出所有扩充的网络禁令（测试版）
文档：https://supabase.com/docs/reference/api/v1-list-all-network-bans-enriched
url：/v1/projects/{ref}/network-bans/retrieve/enriched

## 列出所有项目
文档：https://supabase.com/docs/reference/api/v1-list-all-projects
url：/v1/projects

## 列出可用的还原版本
文档：https://supabase.com/docs/reference/api/v1-list-available-restore-versions
url：/v1/projects/{ref}/restore

## 修补网络限制（Alpha）
文档：https://supabase.com/docs/reference/api/v1-patch-network-restrictions
url：/v1/projects/{ref}/network-restrictions

## 暂停项目
文档：https://supabase.com/docs/reference/api/v1-pause-a-project
url：/v1/projects/{ref}/pause

## 还原项目
文档：https://supabase.com/docs/reference/api/v1-restore-a-project
url：/v1/projects/{ref}/restore

## 更新网络限制（测试版）
文档：https://supabase.com/docs/reference/api/v1-update-network-restrictions
url：/v1/projects/{ref}/network-restrictions/apply

## 升级 postgres 版本（测试版）
文档：https://supabase.com/docs/reference/api/v1-upgrade-postgres-version
url：/v1/projects/{ref}/upgrade

# Rest
## 获取 postgrest 服务配置
文档：https://supabase.com/docs/reference/api/v1-get-postgrest-service-config
url：/v1/projects/{ref}/postgrest

## 更新 postgrest 服务配置
文档：https://supabase.com/docs/reference/api/v1-update-postgrest-service-config
url：/v1/projects/{ref}/postgrest

# 密钥
## 批量创建机密
文档：https://supabase.com/docs/reference/api/v1-bulk-create-secrets
url：/v1/projects/{ref}/secrets

## 批量删除机密
文档：https://supabase.com/docs/reference/api/v1-bulk-delete-secrets
url：/v1/projects/{ref}/secrets

## 创建项目 API 密钥
文档：https://supabase.com/docs/reference/api/v1-create-project-api-key
url：/v1/projects/{ref}/api-keys

## 删除项目 API 密钥
文档：https://supabase.com/docs/reference/api/v1-delete-project-api-key
url：/v1/projects/{ref}/api-keys/{id}

## 获取 pgsodium 配置（测试版）
文档：https://supabase.com/docs/reference/api/v1-get-pgsodium-config
url：/v1/projects/{ref}/pgsodium

## 获取项目 API 密钥
文档：https://supabase.com/docs/reference/api/v1-get-project-api-key
url：/v1/projects/{ref}/api-keys/{id}

## 获取项目 API 密钥
文档：https://supabase.com/docs/reference/api/v1-get-project-api-keys
url：/v1/projects/{ref}/api-keys

## 获取项目旧版 API 密钥
文档：https://supabase.com/docs/reference/api/v1-get-project-legacy-api-keys
url：/v1/projects/{ref}/api-keys/legacy

## 列出所有机密
文档：https://supabase.com/docs/reference/api/v1-list-all-secrets
url：/v1/projects/{ref}/secrets

## 更新 pgsodium 配置（测试版）
文档：https://supabase.com/docs/reference/api/v1-update-pgsodium-config
url：/v1/projects/{ref}/pgsodium

## 更新项目 API 密钥
文档：https://supabase.com/docs/reference/api/v1-update-project-api-key
url：/v1/projects/{ref}/api-keys/{id}

## 更新项目旧版 API 密钥
文档：https://supabase.com/docs/reference/api/v1-update-project-legacy-api-keys
url：/v1/projects/{ref}/api-keys/legacy

# 存储
## 获取存储配置
文档：https://supabase.com/docs/reference/api/v1-get-storage-config
url：/v1/projects/{ref}/config/storage

## 列出所有存储桶
文档：https://supabase.com/docs/reference/api/v1-list-all-buckets
url：/v1/projects/{ref}/storage/buckets

## 更新存储配置
文档：https://supabase.com/docs/reference/api/v1-update-storage-config
url：/v1/projects/{ref}/config/storage



