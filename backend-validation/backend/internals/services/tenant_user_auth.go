package services

import (
	"context"
	"validation/internals/redis"
	"validation/internals/repo"
	"validation/internals/utils"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

func CreateAuthService(auth *repo.Tenant_user_auth_repo,db *pgxpool.Pool,redis *redis.Rdb,util *utils.Util) *Tenant_user_auth {
	return &Tenant_user_auth{
		Db:db,
		Redis: redis,
		Util: util,
		Repo: auth,
	}
}

type Tenant_user_auth struct{
	Db *pgxpool.Pool
	Util *utils.Util
	Redis *redis.Rdb 
	Repo *repo.Tenant_user_auth_repo
}

func(s * Tenant_user_auth) Signup(ctx context.Context,username string,pass string,mail string,tenanat_id uuid.UUID) (error,bool){
	err:=s.Repo.IsTenantExist(ctx,tenanat_id)
	if err!=nil{
		return err,false
	}
	hashpass,err:=s.HashPass(pass)
	if err!=nil{

	}
	err=s.Repo.Signup(ctx,username,mail,hashpass,tenanat_id)

	return err,true	

}

func (s * Tenant_user_auth)HashPass(password string)(string,error){
	hash, err := bcrypt.GenerateFromPassword(
        []byte(password),
        bcrypt.DefaultCost,
    )
    if err != nil {
        return "", err
    }

    return string(hash), nil
}

func (s * Tenant_user_auth) Signin(ctx context.Context,username string,pass string,mail string,tenanat_id uuid.UUID)(error,uuid.UUID){
	err,id,hashpass:=s.Repo.Signin(ctx,username,mail,pass)
	if(err!=nil){
		return err,uuid.Nil
	}
	ismatch:=s.CheckPassword(pass,hashpass);
	if !ismatch{
		return err,uuid.Nil
	}
	return nil,id
}

func (s * Tenant_user_auth) CheckPassword(password string, hash string) bool {
    err := bcrypt.CompareHashAndPassword(
        []byte(hash),
        []byte(password),
    )

    return err == nil
}