CREATE TABLE tenant_user_auth (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID NOT NULL,
    tenant_user_uuid UUID NOT NULL DEFAULT gen_random_uuid(),

    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT uq_tenant_user_uuid
        UNIQUE (tenant_user_uuid),

    CONSTRAINT uq_tenant_username
        UNIQUE (tenant_id, username),

    CONSTRAINT uq_tenant_email
        UNIQUE (tenant_id, email)
);