


export class AppError extends Error{
    code:number
    constructor(msg:string,cause:string,code:number){ 
        super(msg)
        this.name=cause
        this.code=code
    }
}


export class VerifyCredentialsError extends AppError{
    constructor(msg:string,cause:string,code:number    ){
        super(msg,cause,code)
    }
}

export class InsertUserError extends AppError{
    constructor(msg:string,cause:string,code:number){
        super(msg,cause,code)
    }
}

export class ProxyLoginError extends AppError{
    constructor(msg:string,cause:string,code:number){
        super(msg,cause,code)
    }
}

export class CreateUsersTableError extends AppError{
    constructor(msg:string,cause:string,code:number){
        super(msg,cause,code)
    }
}

export class GetTableDataError extends AppError{
    constructor(msg:string,cause:string,code:number){
        super(msg,cause,code)
    }
}




export class CreateColumnsError extends AppError{
    constructor(msg:string,cause:string,code:number){
        super(msg,cause,code)
    }
}
export class FindUserTableError extends AppError{
    constructor(msg:string,cause:string,code:number){
        super(msg,cause,code)
    }
}

