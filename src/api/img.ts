import axios from "@/utils/axios";

export function handleImg(params:any){
    return axios.post(`/files/upload-image`,params,{
        headers:{
            'Content-Type':'multipart/form-data'
        }
    }
    )
}