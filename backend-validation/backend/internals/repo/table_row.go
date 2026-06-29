package repo

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"

	"validation/graph/model"

	"validation/internals/utils"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func CreateTable_RowRepo(db *pgxpool.Pool) (*Table_row_repo){ 
	return &Table_row_repo{
		Db:db,
		Util:utils.CreateUtilService(),
	} 
}

type Table_row_repo struct {
	Db *pgxpool.Pool
	Util *utils.Util
}

func (r *Table_row_repo)VerifyTenantTable(table_name string,tenant_id uuid.UUID)(error,bool){
	query:=fmt.Sprintf(`SELECT table_id from users_tables 
	where table_name=$1 and
	user_id=$2 
	`)
	var ctx=context.Background()
	var table_id uuid.UUID
	err:=r.Db.QueryRow(ctx,query,table_name,tenant_id).Scan(&table_id)
	if err!=nil{
		if errors.Is(err,pgx.ErrNoRows){
			log.Printf("failed to find any rows in the db %v\n",err)
			return fmt.Errorf("no table found assoscated witht the tenant:%v",err),false
		}
		log.Printf("failed some db issue i think %v\n",err)
		return err,false
	}

	


	return nil,true

}

func (r * Table_row_repo)InsertTenantUserRow(ctx *context.Context,table_id *uuid.UUID,column_name *string,tenant_user_uni_identifier *string,data *map[string]any)(error,int){
	query:=fmt.Sprintf(`insert into table_row(
	table_id, column_name, tenant_user_identifier, data)
	VALUES (
	$1, $2, $3, $4)
	Returning id
	`)

	
	var row_id int
	rows:=r.Db.QueryRow(*ctx,query,table_id,column_name,tenant_user_uni_identifier,data)
	
	err:=rows.Scan(&row_id)
	if err!=nil{
		if errors.Is(err, pgx.ErrNoRows) {
			log.Printf("no id retuned as ont ableto inseet rows %v\n",err)
            return fmt.Errorf("no id returned"),-1
        }
		log.Printf("db error or something %v\n",err)
		return fmt.Errorf("insert table_row failed: %w", err),-1
	}

	return nil,row_id
}

func (r *Table_row_repo)ReadTenantUserRow(table_id uuid.UUID,column_name []string,tenant_user_uni_identifier string)(error,[]*model.TableRow){
	query:=fmt.Sprintf(`SELECT id, data
	FROM table_row 
	WHERE 
	table_id=$1 and
	column_name=any($2) and
	tenant_user_identifier=$3`)
	ctx:=context.Background()
	rows,err:=r.Db.Query(ctx,query,table_id,column_name,tenant_user_uni_identifier)
	if err!=nil{

		return fmt.Errorf("failed to execute thte query; %v",err),nil
	}
	var data []*model.TableRow
	for rows.Next(){
		var row model.TableRow
		if err := rows.Scan(&row.ID,&row.Data); err != nil {
            
			return err,nil
        }
		data = append(data, &row)
	}

	return nil,data
}

func (r *Table_row_repo)UpdateTenantUserRow(row_id int,table_id *uuid.UUID,column_name *string,tenant_user_uni_identifier *string,path []*model.Pathidk)(error,*model.TableRow){
	path_query:=r.Util.JsonbPathQueryBuilder(path)
	base_query:=fmt.Sprintf(`update table_row
	set data=%v
	where 
	id=$1 and
	table_id=$2 and
	column_name=$3 and
	tenant_user_identifier=$4
	`,path_query)
	return_query:="RETURNING id, data"
	base_query=base_query+return_query
	var ctx=context.Background()
	var row model.TableRow
	
	err:=r.Db.QueryRow(ctx,base_query,row_id,*table_id,*column_name,*tenant_user_uni_identifier).Scan(&row.ID, &row.Data)
	if err!=nil{
		log.Printf("failed to update thte tenant user data %v\n",err)
		return err,nil
	}
	
	return nil,&row
}





func (r *Table_row_repo)GetTableSchema(ctx context.Context,table_id  uuid.UUID,user_id uuid.UUID)(map[string]any,error){
	query:=fmt.Sprintf(`select columns from users_tables where 
		table_id=$1 and 
		user_id=$2`)
		
	var schema =make(map[string] any)
	err:=r.Db.QueryRow(ctx,query,table_id,user_id).Scan(&schema)
	if err!=nil{
		if err ==sql.ErrNoRows{

		}else{

		}
	}
	return schema,nil
}


