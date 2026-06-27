package routines

import (
	"context"
	"validation/internals/redis"

	"github.com/google/uuid"
)

func PushSchema(data *map[string]string, redis *redis.Rdb, table_id, tenant_id uuid.UUID, columns_name string, ctx context.Context) {
	go func() {
		redis.SetTableSchema(data ,redis.Redis ,table_id,tenant_id ,columns_name ,ctx)
	}()
}