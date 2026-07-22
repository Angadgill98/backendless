package services

import (
	"context"
	"fmt"
	"log"
	"reflect"

	"validation/graph/model"

	"validation/internals/redis"
	"validation/internals/repo"
	"validation/internals/routines"

	"validation/internals/utils"

	"github.com/jackc/pgx/v5/pgxpool"
)

func CreateTable_RowService(table_row_repo *repo.Table_row_repo,db *pgxpool.Pool,redis *redis.Rdb,util *utils.Util) *Table_service {
	return &Table_service{
		Db:db,
		Redis: redis,
		Util: util,
		Repo: table_row_repo,
	}
}

type Table_service struct {
	Db *pgxpool.Pool
	Util *utils.Util
	Redis *redis.Rdb 
	Repo *repo.Table_row_repo
}


func (s *Table_service)VerifyTenantTable(ctx *context.Context,input *model.VerifyTenantTable)(error,bool){
	match,err:=s.Redis.IsTableInTenantSet(s.Redis.Redis,*input.TableID,*input.TableName,*ctx)
	if err!=nil{

	}
	if !match {
		err,match=s.Repo.VerifyTenantTable(*input.TableName,input.UserID)
		if err!=nil{
			log.Printf("faield to verify the users talee %v \n",err)
			return err,false
		}
		schema,err:=s.Repo.GetTableSchema(*ctx,*input.TableID,input.UserID)
		if err!=nil{
			log.Printf("failed to ge thte table schema for flattening: %v \n",err)

		}
		flatten_schema:=s.FlattenSchema(schema,"",make(map[string]string))

		routines.PushSchema(&flatten_schema,s.Redis,*input.TableID,input.UserID,*ctx)

		
	return nil,match
	}

	return nil,match
	
}

func (s *Table_service)InsertTenantUserRow(ctx *context.Context,input *model.InsertTenantUserRow)(int,error){
	rows := make([]repo.Table_row, 0, len(input.Rows))

	for _, r := range input.Rows {
		rows = append(rows, repo.Table_row{
			Table_id:                   r.TableID,
			// tablename:                 r.TableName,
			Column_name:                r.ColumnName,
			Tenant_user_uni_identifier: input.TenantUserUUID,
			Data:                       r.Data,
		})
	}
	

	err,row_id:=s.Repo.InsertTenantUserRow(ctx,rows)
	if err!=nil{
		return -1,err
	}
	return row_id,nil
}

func (s *Table_service)ReadTenantUserRow(ctx *context.Context,input *model.ReadTenantUserRow)([]*model.TableRow,error){
	err,rows:=s.Repo.ReadTenantUserRow(input.TableID,input.ColumnName,input.TenantUserUUID)
	if err!=nil{
		return nil,err
	}
	return rows,nil
}

func (s *Table_service)UpdateTenantUserRow(ctx *context.Context,input *model.UpdateTenantUserRow)(*model.TableRow,error){
	match,err:=s.Redis.IsTableInTenantSet(s.Redis.Redis,input.UserID,input.TableID.String(),*ctx)
	if err!=nil{
		log.Printf("error occured while verifying the table belong to tenant in redis %v \n",err)
		return nil,err
	}
	if !match{
		err,match=s.Repo.VerifyTenantTable(*&input.TableName,input.UserID)
		if err!=nil{
			log.Printf("faield to verify the  table o ftenant in db %v \n",err)
			return nil,err
		}
	}

	s.Redis.GetTableSchema(s.Redis.Redis,input.TableID,input.UserID,*ctx)

	err,row:=s.Repo.UpdateTenantUserRow(int(input.RowID),&input.TableID,&input.ColumnName,&input.TenantUserUUID,input.Path)
	if err!=nil{
		return nil,err
	}
	return row,nil
}

func (s *Table_service)FlattenSchema(schema map[string]any, prefix string, flatten map[string]string) map[string]string {
    for key, value := range schema {

        fullKey := key
        if prefix != "" {
            fullKey = prefix + "." + key
        }

        if reflect.ValueOf(value).Kind() == reflect.Map {
            m, ok := value.(map[string]any)
            if !ok {
                continue
            }

           s. FlattenSchema(m, fullKey, flatten)
        } else {
            flatten[fullKey] = fmt.Sprint(value)
        }
    }
 
    return flatten
}