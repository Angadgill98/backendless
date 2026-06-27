package graph

import (
	"validation/internals/redis"
	"validation/internals/services"

	"github.com/jackc/pgx/v5/pgxpool"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require
// here.

type Resolver struct{
	Db *pgxpool.Pool
	Redis *redis.Rdb
	TableRow *services.Table_service
}
