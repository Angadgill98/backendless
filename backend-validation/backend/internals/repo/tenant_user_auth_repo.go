package repo

import (
	"context"
	"errors"
	"fmt"
	"log"
	"validation/internals/utils"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)



func CreateTenantUserAuthrepo(db *pgxpool.Pool) *Tenant_user_auth_repo{
	return &Tenant_user_auth_repo{
		Db: db,
		Util: utils.CreateUtilService(),
	}
}

type Tenant_user_auth_repo struct{
	Db *pgxpool.Pool
	Util *utils.Util
}


func (s *Tenant_user_auth_repo) Signup(ctx context.Context,username string,mail,pass string,tenant_id uuid.UUID)(error){
	query := fmt.Sprintf(`
		INSERT INTO tenant_user_auth (
			tenant_id,
			
			username,
			email,
			password_hash
		)
		VALUES (
			$1,
			$2,
			$3,
			$4
		)
		RETURNING id
		`)
	rows:=s.Db.QueryRow(ctx,query,tenant_id,username,mail,pass)

	var tenant_user_uuid uuid.UUID
	
	
	err:=rows.Scan(&tenant_user_uuid)
	if err!=nil{
		if errors.Is(err, pgx.ErrNoRows) {
			log.Printf("no id retuned as ont ableto inseet rows %v\n",err)
            return fmt.Errorf("no id returned")
        }
		log.Printf("db error or something %v\n",err)
		return fmt.Errorf("insert table_row failed: %w", err)
	}

	return nil



}

func(s *Tenant_user_auth_repo) Signin(ctx context.Context,username string,mail,pass string)(error,uuid.UUID,string){
	query:=fmt.Sprintf("Select email,password_hash,tenant_user_uuid from tenant_user_auth where username=$1 and email=$2")
	var isemail,ispass string
	var uid uuid.UUID
	err:=s.Db.QueryRow(ctx,query,username,mail).Scan(&isemail,&ispass,&uid)
	if err!=nil{
		if errors.Is(err, pgx.ErrNoRows) {
			log.Printf("no id retuned as ont ableto inseet rows %v\n",err)
            return fmt.Errorf("no id returned"),uuid.Nil,""
        }
		log.Printf("db error or something %v\n",err)
		return fmt.Errorf("insert table_row failed: %w", err),uuid.Nil,""
	}
	return nil,uid,ispass
}

func (r *Tenant_user_auth_repo) IsTenantExist(ctx context.Context,tenant_id uuid.UUID)error{
	query:="select user_id from users where user_id=$1"
	var ifexist uuid.UUID
	err:=r.Db.QueryRow(ctx,query,tenant_id).Scan(&ifexist)
	if err!=nil{
		if errors.Is(err, pgx.ErrNoRows) {
			log.Printf("no tenant for for id %v \n",tenant_id)
            return err
        }
		log.Printf("db error or something %v\n",err)
		return fmt.Errorf("istentn exist failed: %w", err)
	}
	return nil
}
