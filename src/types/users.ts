export interface LoginParams{
    username:string,
    password:string
}

export interface LoginUser{
    id:number,
    username:string,
    phone:string,
    mail:string,
    avatar:string,
    nickname:string,
    profile:string,
    role:string,
    status:number,
    editTime:string,
    createTime:string
}