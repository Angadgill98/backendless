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



func CreateTenantUserAuthrepo(db *pgxpool.Pool) *tenant_user_auth_repo{
	return &tenant_user_auth_repo{
		Db: db,
		Util: utils.CreateUtilService(),
	}
}

type tenant_user_auth_repo struct{
	Db *pgxpool.Pool
	Util *utils.Util
}


func (s *tenant_user_auth_repo) Signup(ctx context.Context,username string,mail,pass string,tenant_id uuid.UUID)(error,uuid.UUID){
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
            return fmt.Errorf("no id returned"),uuid.Nil
        }
		log.Printf("db error or something %v\n",err)
		return fmt.Errorf("insert table_row failed: %w", err),uuid.Nil
	}

	return nil,tenant_user_uuid



}


func(s *tenant_user_auth_repo) Signin(ctx context.Context,username string,mail,pass string)(error,uuid.UUID){
	query:=fmt.Sprintf("Select email,password,tenant_user_uuid from tenant_user_auth where username=$1 and password=$2")
	var isemail,ispass string
	var uid uuid.UUID
	err:=s.Db.QueryRow(ctx,query,username,mail).Scan(&isemail,&ispass,&uid)
	if err!=nil{
		if errors.Is(err, pgx.ErrNoRows) {
			log.Printf("no id retuned as ont ableto inseet rows %v\n",err)
            return fmt.Errorf("no id returned"),uuid.Nil
        }
		log.Printf("db error or something %v\n",err)
		return fmt.Errorf("insert table_row failed: %w", err),uuid.Nil
	}
	return nil,uid
}	
