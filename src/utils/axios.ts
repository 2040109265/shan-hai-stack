import axios from "axios"
import { ElMessage } from "element-plus";

const instance =axios.create({
    baseURL:import.meta.env.VITE_BASE_API,
    timeout:5000
})

instance.interceptors.request.use(
    (config)=>{
        return config;
    },
    (error)=>{
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    (response)=>{
        const {code,data,message}=response.data;
        
        if(code!==0){
            ElMessage.error(message||"错误");
            
        }else{
            return data;
        }
    },
    (error)=>{
        ElMessage.error(error.response?.data?.message);
        
        return Promise.reject(error);
    }
)

export default instance;