import axios from "@/utils/axios";

export function articleSearch(data:any){
    return axios.post('/articles/search',data,{
        headers:{
            'Content-Type':'application/json'
        }
    })
}
export function toggleLike(id:number){
    return axios.post(`/articles/${id}/like`,id,{
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}

export function toggleCollect(id:number){
    return axios.post(`/articles/${id}/collect`,id,{
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}
export function getArticleById(id:number){
    return axios.get(`/articles/${id}`,{
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}
export function getCategories(){
    return axios.get(`/article/categories`,{
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}

export function getTags(){
    return axios.get(`/article/tags`,{
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
} 

export function getCommentsApi(config){
    const {articleId,params}=config
    return axios.get(`/articles/${articleId}/comments`,{
        params:{
            ...params,
            articleId
        }
    })
}

export function addCommentApi(params:any,articleId:number){
    return axios.post(`/articles/${articleId}/comments`,params,{
        headers:{
            'Content-Type':'application/json'
        }
    })
   
}

export function publishArticle(params:any){
    return axios.post(`/articles/publish`,params,{
        headers:{
            'Content-Type':'application/json'
        }
    })
}

export function getOwnArticle(params:any){
    return axios.get('/articles/my',params)
}

export function draftArticleLast(params:any){
    return axios.post('/articles/draft',params,{
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}

export function draftArticle(params:any){
    return axios.patch('/articles/draft',params,{
        headers:{
            'Content-Type':'application/json'
        }
    })
}

export function deleteArticle(id:number){
    return axios.delete(`/articles/${id}`,{
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}