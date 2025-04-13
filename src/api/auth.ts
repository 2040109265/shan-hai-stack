import axios from '@/utils/axios';
import { LoginParams } from '@/types/users';

export function loginByPassword(data:LoginParams){
   return  axios.post('/auth/login/password',data,{
        headers:{
            'Content-Type':'application/json'
        }
    })
}
export  function registerByPassword(data:any){
    return axios.post('/auth/register',data,{
        headers:{
            'Content-Type':'application/json'
        }
    })
}