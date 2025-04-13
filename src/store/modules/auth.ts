import { defineStore } from "pinia";
import{LoginUser,LoginParams} from "@/types/users";
import { loginByPassword } from "@/api/auth";


export const useAuthStore=defineStore('auth',{
    state:()=>({
        userInfo:null as LoginUser|null,
        touristAvatar:"@/assets/avatar.jpg"
    }),
    getters:{
        isLoggedIn:(state)=>{
            return state.userInfo!==null&&state.userInfo!==undefined;
        }
    },

    actions:{
        async login(params:LoginParams){
            try{
                const response=await loginByPassword(params);
            this.$patch({userInfo:response});
            }catch(error){
                console.log("登陆失败",error);
                throw error;
            }
            
        },
        logout(){
            this.$patch({userInfo:null});
        }
    },
    persist:true
})
