package repo

import (
	
	"validation/internals/utils"

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


func (s *tenant_user_auth_repo) Signup(name string,mail,pass string){
	//query:=fmt.Sprintf(`INSERT into table_row)()`)
}

func(s *tenant_user_auth_repo) Signin(name string,mail,pass string){

}	
