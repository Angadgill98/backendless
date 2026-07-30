package redis

import (
	"context"

	"fmt"
	"log"
	"os"
	"strconv"

	"validation/error"

	"github.com/google/uuid"
	
	"github.com/redis/go-redis/v9"
)

func SetupRedis() *Rdb{
	redis:=RedisConfig()

	
	return &Rdb{
		Redis: redis,
	}
}
type Rdb struct{
	Redis *redis.Client
}

func RedisConfig() *redis.Client{
	db, err := strconv.Atoi(os.Getenv("REDIS_DB"))

	if err != nil {
		log.Println("faieled in config of redis")
		panic(err)
	}
	addr := fmt.Sprintf(
		"%s:%s",
		os.Getenv("REDIS_HOST"),
		os.Getenv("REDIS_PORT"),
	)
	var redis=redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: os.Getenv("REDIS_PASSWORD"),
		DB: db,
	})



	// abc, err := redis.Ping(context.Background()).Result()
	// if err != nil {
	// 	panic(err)
	// }
	// log.Println("Redis coonected")
	// log.Println(abc)

	return redis
}

func (*Rdb)GetTableSchema(redis *redis.Client,table_name string,tenant_id uuid.UUID,ctx context.Context)(error,map[string]string){
	key :=fmt.Sprintf(`schema:tenant_id:%s:table_name:%s`,tenant_id.String(),table_name)
	
	value,err:=redis.HGetAll(ctx,key).Result()
	if err!=nil{
		println("error occured while get thte table schema %v",err);
		return err,nil
	}

	if len(value)==0{
		println("data not found in redsis db")
		return custom_error.AppError{Err: custom_error.NoRowsInRedis{}},nil
	}
	
	return nil,value
}

func (*Rdb)SetTableSchema(data *map[string]string,redis *redis.Client,table_name string,tenant_id uuid.UUID,ctx context.Context)(error){
	key := fmt.Sprintf(
        `schema:tenant_id:%s:table_name:%s`,
        tenant_id.String(),
        table_name,
    )

    if err := redis.HSet(ctx, key, *data).Err(); err != nil {
        return err
    }

    // if err := redis.Expire(ctx, key, 10*time.Minute).Err(); err != nil {
    //     return err
    // }
	return nil
}

func (*Rdb)SetTable(redis *redis.Client,table_id,tenant_id uuid.UUID,ctx context.Context)error{
	key := fmt.Sprintf("tenant_id:%s", tenant_id.String())

	err := redis.SAdd(ctx, key, table_id).Err()
	if err != nil {
		return err
	}

	return nil
}

func (*Rdb)GetTables(rdb *redis.Client,tenantID uuid.UUID,ctx context.Context,) (error,[]string ) {

	key := fmt.Sprintf("tenant_id:%s", tenantID.String())

	values, err := rdb.SMembers(ctx, key).Result()
	if err != nil {
		return err,nil
	}

	return nil,values
}

func (*Rdb)IsTableInTenantSet(rdb *redis.Client,tenantID uuid.UUID,table_name string,ctx context.Context,) (bool, error) {

	key := fmt.Sprintf("schema:tenant_id:%s:table_name:%s", tenantID.String(),table_name)

	exists, err := rdb.Exists(ctx,key).Result()
	if err != nil {
		return false, err
	}
	if exists==1 {
    // Member not found (or the set doesn't exist)
    	return true, nil
	}
	
	return false, nil
}
