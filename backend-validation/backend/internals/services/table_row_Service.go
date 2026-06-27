package services

import (
	"context"
	"log"

	"validation/graph/model"
	
	"validation/internals/redis"
	"validation/internals/repo"
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
	
	err,match:=s.Repo.VerifyTenantTable(*input.TableName,input.UserID)
	if err!=nil{
		log.Printf("faield to verify the users talee %v \n",err)
		return err,false
	}
	return nil,match
}

func (s *Table_service)InsertTenantUserRow(ctx *context.Context,input *model.InsertTenantUserRow)(int,error){
	err,row_id:=s.Repo.InsertTenantUserRow(ctx,&input.TableID,&input.ColumnName,&input.TenantUserUUID,&input.Data)
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

func (s *Table_service)UpdateTenantUserRow(cts *context.Context,input *model.UpdateTenantUserRow)(*model.TableRow,error){
	err,row:=s.Repo.UpdateTenantUserRow(int(input.RowID),&input.TableID,&input.ColumnName,&input.TenantUserUUID,input.Path)
	if err!=nil{
		return nil,err
	}
	return row,nil
}
