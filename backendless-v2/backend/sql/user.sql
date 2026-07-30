create table  IF NOT EXISTS users(
	id SERIAL PRIMARY KEY,
	user_id uuid unique DEFAULT gen_random_uuid(),
	user_name varchar(50) not null,
	pass_word varchar(80)  not null,
	email varchar(50) not null,
	is_active boolean default true,
    refresh_token varchar(300),
    access_token varchar(300),
    read_only_refresh_token varchar(300),
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);



CREATE EXTENSION IF NOT EXISTS "pgcrypto";


create table if not exists users_tables(
    user_id uuid not null references users(user_id),
    table_id uuid unique DEFAULT gen_random_uuid(),
    table_name varchar(60) not null,
    columns JSONB NOT NULL DEFAULT '{}'::jsonb,
    

    constraint unique_user_table_name
    unique(user_id, table_name)
);
 

create table if not exists table_row(
    id SERIAL PRIMARY KEY,
    table_id uuid not null references users_tables(table_id),
    column_name varchar(60) not null,
    tenant_user_identifier varchar(100) not null,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.table_row
DROP COLUMN column_name;

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