package services

import "github.com/google/uuid"

func CreateAuuthService() *tenant_user_auth{
	return  &tenant_user_auth{}
}

type tenant_user_auth struct{

}

func Signup(ctx,username string,pass string,mail string,table_id uuid.UUID,tenanat_id uuid.UUID){
	

}

func Signin(ctx,username string,pass string,mail string,table_id uuid.UUID,tenanat_id uuid.UUID){
	
}

