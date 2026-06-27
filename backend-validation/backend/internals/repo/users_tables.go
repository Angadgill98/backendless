package repo

import (
	"context"
	"errors"
	"fmt"
	"validation/internals/utils"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func CreateUsers_TableRepo(db *pgxpool.Pool) *users_table_repo {
	return &users_table_repo{
		Db:   db,
		Util: utils.CreateUtilService(),
	}
}
type users_table_repo struct{
	Db *pgxpool.Pool
	Util *utils.Util
}

func (r *users_table_repo)GetTableScehma(tenant_id uuid.UUID,table_id uuid.UUID,table_name string)(error,map[string]any){
	query:=fmt.Sprintf(`select columns from users_tables where 
	user_id=$1 and
	table_id=$2 and 
	table_name=$3 
	`)
	var ctx=context.Background()
	var schema map[string]any
	err:=r.Db.QueryRow(ctx,query,tenant_id,table_id,table_name).Scan(&schema)
	if err!=nil{
		if errors.Is(err,pgx.ErrNoRows){

			return fmt.Errorf(`no matching rows found: %v`,err),nil
		}
		return err,nil
	}

	return nil,schema
}


type ColumnSchema map[string]interface{}

func FlattenSchema(schema map[string]map[string]interface{},prefix string,result map[string]string,) {

	for key, node := range schema {

		fullKey := key
		if prefix != "" {
			fullKey = prefix + "." + key
		}

		for k, v := range node {

			// case 1: nested object → recurse
			if child, ok := v.(map[string]interface{}); ok {
				FlattenSchema(
					map[string]map[string]interface{}{
						k: child,
					},
					fullKey,
					result,
				)
				continue
			}

			// case 2: leaf value → store
			finalKey := fullKey + "." + k

			// convert value to string safely
			result[finalKey] = fmt.Sprintf("%v", v)
		}
	}
}