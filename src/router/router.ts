import {createRouter,createWebHistory,RouteRecordRaw} from 'vue-router'

export const constantRouter:RouteRecordRaw[]=[
    {
        path:'/',
        redirect:'/welcome'
    },
   
    {
        path:'/welcome',
        name:'welcome',
        component:()=>import('@/views/welcome/index.vue'),
        meta:{}
    }
    ,
    {
        path:'/headerBar',
        name:'header',
        component:()=>import('@/layouts/headerBar/index.vue'),
        meta:{}

    },
    {   path:'/sideBar',
        name:'sideBar',
        component:()=>import('@/layouts/sideBar/index.vue'),
        meta:{}


    },
    {   path:'/layouts',
        name:'layouts',
        component:()=>import('@/layouts/headerBar/index.vue'),
        meta:{}

    },
    {
        path:'/user',
        name:'user',
        component:()=>import('@/views/user/index.vue'),
        meta:{}
    },{
        path:'/article',
        name:'article',
        component:()=>import('@/views/article/index.vue')
    },{
        path:'/articleDetails/:id',
        name:'articleDetails',
        component:()=>import('@/views/articleDetails/index.vue')
    },{
        path:'/left',
        name:'left',
        component:()=>import('@/layouts/sideBar/index.vue')
    },{
        path:'/test',
        name:'test',
        component:()=>import('@/views/ownArticle/index.vue')
    },{
        path:'/writeArticle',
        name:'writeArticle',
        component:()=>import('@/views/editor/index.vue')
    },{
        path:'/ai',
        name:'ai',
        component:()=>import('@/views/ai/index.vue')
    }
]

const router=createRouter({
    history:createWebHistory(),
    routes:constantRouter
})

export default router;