<template>
    <div class="leftBar">
        <div class="first-area">
            <div class="greeting">
                <h1>{{greeting}}</h1>
                <p>山留鸿爪皆成帖，</p>
                <p>海纳潮声即是歌~</p>
            </div>
            <el-button class="daily-attendance">签到</el-button>
        </div>
        <div class="second-area">
            <div class="article-header">
                <div class="header-left">
                    <svg t="1742921058891" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3683"  height="20px"><path d="M0 0h1024v1024H0z" fill="#1296db" p-id="3684"></path><path d="M334.3 209.9c6.1-2.1 10.9-3 14.3-2.7 3.4 0.3 8.7 2.5 15.9 6.6l13.4 7.8-10.1 12.5c-6.7 7.8-12.9 17.4-18.4 28.9-6.2 12-16.8 29.1-31.9 51.5-8.4 12.5-14.8 23.2-19.3 32-4.5 8.9-9.2 16.9-14.3 24.2-5.6 7.8-13.1 20.4-22.6 37.9-9.5 17.4-14.3 27.5-14.3 30.1 0 3.1-3.1 7.4-9.2 12.9-6.2 5.5-11.2 8.2-15.1 8.2-4.5 0-10.3-2.6-17.6-7.8-7.3-5.2-10.2-9-8.8-11.3 1.4-2.3 1-3.5-1.3-3.5-2.2 0-7-6.5-14.3-19.5L169.8 399l9.2-17.2c5-9.9 22.6-32.6 52.8-68.3 30.2-35.6 53.9-61.8 71.3-78.4 15.2-14.7 25.6-23.1 31.2-25.2z m166.8 210c24-8.3 37.3-12.6 39.8-12.9 2.5-0.3 9.9 2.5 22.2 8.2 21.8 10.4 21 18.2-2.5 23.4-11.7 2.6-18.6 5.6-20.5 9-2 3.4-5.2 4.3-9.6 2.7-4.5-1.6-10.1-0.8-16.8 2.3-6.7 3.1-10.9 7-12.6 11.7-1.7 5.7-4.8 13.3-9.2 22.6-5 11.5-5.3 16.9-0.8 16.4 1.7 0 4.7-1.3 9.2-3.9 7.3-4.7 16.5-6.2 27.7-4.7 19 2.6 30.9 5.6 35.6 9 4.7 3.4 8.2 10.8 10.5 22.2 1.7 10.9 6.3 18.9 13.8 23.8 7.5 5 13 11.1 16.3 18.3 3.9 6.8 9.9 14.3 18 22.6s13.8 12.5 17.2 12.5c2.8 0 7.8 4 15.1 12.1s10.6 16.5 10.1 25.4v1.6c-0.6 5.7-3.6 10-9.2 12.9-5.6 2.9-24.6 9.5-57 19.9l-7.5 2.3c-27.4 8.9-45.6 13.3-54.5 13.3-8.9 0-25.7 3.4-50.3 10.1l-36.9 10.1 3.4 15.6c1.1 6.2 3.1 16.4 5.9 30.4 4.5 25.5 15.1 40.1 31.9 43.7 8.9 1.6 29.2 1.7 60.8 0.4 31.6-1.3 56.6-2.1 75-2.3 18.4-0.3 27.7-1.4 27.7-3.5s2-3.1 5.9-3.1c10.1 0 21.9-5.7 35.6-17.2 13.7-11.5 23.9-23.9 30.6-37.5 3.9-7.3 7-13.1 9.2-17.6 2.2-4.4 3.4-8.5 3.4-12.1 0-3.6 2-9.6 5.9-18 10.6-25 14.3-37.5 10.9-37.5-2.2 0-5 3.4-8.4 10.1-0.6 2.1-1.3 3.8-2.1 5.1-0.8 1.3-1.7 2.2-2.5 2.7s-1.5 0.8-2.1 0.8c-1.1-1 1.1-6.5 6.7-16.4 5.6-9.9 8.4-16.4 8.4-19.5s8.7-23.1 26-60.1c5-10.4 10.9-25.5 17.6-45.3 10.1-31.7 15.6-51.2 16.8-58.5 0.5-1 1.7 0 3.4 3.1l1.7 1.6c2.8 4.2 3.1 7.8 0.8 10.9-5.6 8.3-6.4 13.8-2.5 16.4 0.5 0.5 1.7 0.5 3.4 0s2.8-0.4 3.4 0.4c0.6 0.8 1 3.1 1.3 7 0.3 3.9 0.4 9 0.4 15.2 0 6.2-0.3 15.4-0.8 27.3-1.1 34.3-0.4 57.1 2.1 68.3 2.5 11.2 2.4 18.9-0.4 23-1.7 4.2-2 7.8-0.8 10.9 1.1 3.1 3.5 4.7 7.1 4.7 3.6 0 5.7 4.7 6.3 14 0.6 12 1.1 19.1 1.7 21.5 0.6 2.3 2.5 3.3 5.9 2.7 2.2-0.5 3.5-0.5 3.8 0 0.3 0.5-0.7 1.8-2.9 3.9-6.2 5.7-7.3 9.9-3.4 12.5 1.1 0.5 2.5 0.5 4.2 0 1.7-1 2.8 0 3.4 3.1 0.5 3.1 0.8 9.9 0.8 20.3-0.6 16.1-1.8 27.7-3.8 34.7-2 7-6 14.7-12.2 23-6.7 8.8-10.1 15.6-10.1 20.3 0 3.6-4.2 8.1-12.6 13.3-8.4 5.2-19 10.1-31.9 14.8-21.2 6.8-36.3 12.2-45.3 16.4-4.5 2.1-14.4 5.1-29.8 9-15.4 3.9-23.9 5.9-25.6 5.9-2.2-0.5-11.5 0.3-27.7 2.3-41.4 5.2-79.1 2.6-113.2-7.8-21.2-6.2-33.8-9.4-37.7-9.4-10.1 0-23.5-7-40.2-21.1-16.8-14-29.6-28.9-38.6-44.5-5.6-10.4-9.5-16.4-11.7-18-5-3.6-11.7-17.7-20.1-42.1-2.2-6.8-4.2-10.5-5.9-11.3s-5.6-0.4-11.7 1.2c-15.7 4.2-35.4 8.3-59.1 12.5-23.8 4.2-41.8 6.8-54.1 7.8-21.8 1-39-2.1-51.6-9.4-12.6-7.3-18-17.7-16.3-31.2 0.5-5.7 3.5-10.7 8.8-14.8 5.3-4.2 15.8-9.9 31.4-17.2 3.9-1.6 13.1-6.8 27.7-15.6l22.6-12.5-14.3 10.9c-31.3 25.5-45 40.1-41.1 43.7 1.7 1.6 11.4 0.9 29.3-2s34.1-6.4 48.6-10.5c6.7-2.1 21.8-6 45.3-11.7 19-4.7 30-8.6 33.1-11.7 3.1-3.1 6-13 8.8-29.7 1.1-8.8 3.6-20 7.5-33.6 3.9-13.5 5.3-21.5 4.2-23.8-1.1-2.3-5.9-1.4-14.3 2.7-19.6 9.4-37.7 11.2-54.5 5.5-16.8-5.7-23.2-15.9-19.3-30.4 1.1-4.7 9.4-10.7 24.7-18 15.4-7.3 30.6-15.6 45.7-25 16.8-10.4 25.2-14.6 25.2-12.5 0.5 1-1.4 3.9-5.9 8.6-6.2 6.2-10.3 9.4-12.6 9.4-2.2 0-11.2 5.2-26.8 15.6L347 547.2l15.9-3.1c11.2-1.6 24.9-4.9 41.1-10.1 12.3-3.6 20.1-7 23.5-10.1s8.4-10.7 15.1-22.6c9.5-16.6 14.5-25.5 15.1-26.5 1.7-4.2-10.3-2.6-36.1 4.7-14.5 4.2-29.6 6.2-45.3 6.2-10.1 0-16.9-0.5-20.5-1.6-3.6-1-6.6-3.4-8.8-7-3.9-6.2-5.3-11.2-4.2-14.8 1.1-2.6 13.3-9.4 36.5-20.3s37-16.4 41.5-16.4c2.2 0 6.7-2.6 13.4-7.8 10.6-7.8 15.9-9.1 15.9-3.9 0 2.6-1.1 3.9-3.4 3.9-1.7 0-13 5.5-34 16.4s-32.6 17.4-34.8 19.5c-4.5 4.2 7.5 2.1 36.1-6.2 20-5.7 49.1-15.1 87.1-27.6zM290.7 638.5c3.4-1 8.1-3.9 14.3-8.6 6.1-4.7 11.9-7.1 17.2-7.4 5.3-0.3 1.4 3.5-11.7 11.3-13.1 7.8-20.5 10.8-22.2 9-1.8-1.9-1-3.3 2.4-4.3z m47.8-345c2.8-3.6 13.4-0.3 31.9 10.1 10.1 6.2 17.9 8.6 23.5 7 2.8-1 4.7-1.2 5.9-0.4 1.1 0.8 1.7 3 1.7 6.6 0 5.2 2 9.9 5.9 14 3.9 4.2 7.3 11.3 10.1 21.5 2.8 10.1 3.1 16.3 0.8 18.3-4.5 4.2-11.3 3.8-20.5-1.2-9.2-4.9-17.8-12.6-25.6-23-10.1-14.1-15.1-22.5-15.1-25.4 0-2.9-3.4-7.7-10.1-14.4-6.9-6.6-9.7-11-8.5-13.1z m263.2-149.1c4.5-1.6 10.8-1.4 18.9 0.4 8.1 1.8 14.9 4.6 20.5 8.2 6.7 4.7 12 14.3 15.9 28.9 2.8 10.9 3.8 18.7 2.9 23.4-0.8 4.7-4.6 13.3-11.3 25.8-2.2 3.6-2.8 6.1-1.7 7.4 1.1 1.3 7 4.3 17.6 9 21.2 9.9 36.6 25 46.1 45.3 8.9 19.3 7.5 31.7-4.2 37.5-6.2 2.6-15.4 3.4-27.7 2.3-12.3-1-20.8-3.4-25.6-7-4.8-3.6-21.1-8.8-49-15.6-3.4-1-4.2-0.5-2.5 1.6 1.7 2.1 6.1 5.7 13.4 10.9 14.5 9.9 24.6 18.2 30.2 25 3.4 4.2 5.2 7 5.4 8.6 0.3 1.6-1 3.6-3.8 6.2-3.9 3.1-10.9 3.1-21 0-21.8-7.3-45.8-4.9-72.1 7-15.7 6.8-24.9 9.6-27.7 8.6-1.1-1 1.4-3.4 7.5-7 3.9-2.6 8.7-5.2 14.3-7.8 7.8-4.2 14.3-7.5 19.3-10.1 5-2.6 8.9-5.1 11.7-7.4 2.8-2.3 4.3-4.3 4.6-5.9 0.3-1.6-0.4-3.1-2.1-4.7-3.4-3.6-17.9 2.1-43.6 17.2-16.2 9.4-33.8 9.9-52.8 1.6-17.9-8.3-26.8-24.7-26.8-49.2 0-5.2-0.6-8.3-1.7-9.4-1.1-1-3.9-1.3-8.4-0.8-6.7 1.6-10.8 1.2-12.2-1.2-1.4-2.3-0.1-6.6 3.8-12.9 3.9-7.3 5-12 3.4-14.1-2.2-3.6-10.2-7.5-23.9-11.7-13.7-4.2-25.6-6.2-35.6-6.2l-21-0.8 16.8-5.5c14-4.7 31-4.7 51.1 0s34.9 12 44.4 21.9c4.5 4.7 8.5 6.6 12.2 5.9 3.6-0.8 10.8-5.9 21.4-15.2 12.9-10.4 25.4-20 37.7-28.9 10.6-7.8 23.6-19.9 39-36.3 15.4-16.4 23.1-26.7 23.1-30.8 0-3.1-2-4.7-5.9-4.7-3.9 0-5.9-1.2-5.9-3.5 0.3-2.5 2-4.5 5.3-6zM426.5 486.3c4.5-2.6 6.8-3.8 7.1-3.5 0.3 0.3-1 2-3.8 5.1-3.4 4.2-5.9 5.5-7.5 3.9-1.7-1.6-0.3-3.5 4.2-5.5zM569 547.1c-2.2-10.9-4.6-16.8-7.1-17.6-2.5-0.8-14.7 2.6-36.5 10.1s-35.9 12.1-42.3 13.7c-6.4 1.6-12.3 8.1-17.6 19.5-5.3 11.5-8.8 25.8-10.5 42.9-2.2 18.2-2.8 28.1-1.7 29.7 2.8 2.6 20.1-1.3 52-11.7 31.9-10.4 51.7-18.7 59.5-25 7.8-7.2 9.2-27.7 4.2-61.6z m-84.7-147.5c-1.1 0-1.7-1.3-1.7-3.9 0-2.6 1.4-3.9 4.2-3.9 2.8 0 3.4 1.3 1.7 3.9-1.7 2.6-3.1 3.9-4.2 3.9z m166-138.9c-6.2-4.2-10.6-5.5-13.4-3.9-2.8 1.6-6.2 7.3-10.1 17.2-3.9 7.8-7.3 11.7-10.1 11.7s-4.2 1.6-4.2 4.7c0.5 1.6 2.6 2.3 6.3 2.3 3.6 0 8.4-0.8 14.3-2.3 5.9-1.6 10.8-3.6 14.7-6.2 5.6-3.6 8.5-7.5 8.8-11.7 0.3-4.3-1.8-8.2-6.3-11.8z" fill="#FFFFFF" p-id="3685"></path></svg>
                    <div class="article">文章榜</div>
                </div>
                <div class="header-right">
                    <el-icon><RefreshRight/></el-icon>
                    <div class="refresh">换一下</div>
                </div>
            </div>
            <hr class="hr1">
            <div class="article-main">
                <div class="article-item">1.东秦超越清北！</div>
                <div class="article-item">2.print("hello")能获诺奖</div>
                <div class="article-item">3.蓝桥杯今年考1+1</div>
                <div class="article-item">4.字节打开限制,会开启电脑就招</div>
                <div class="article-item">5.不知道了，啊啊啊</div>
            </div>
            <hr class="hr2">
            <div class="article-more">
                <div class="article-more-item">查看详情</div>
                <el-icon><Right/></el-icon>
            </div>
        </div>
        <div class="third-area">
            <div class="advertisement">
                <swiper
                :modules="[Navigation, Pagination, Autoplay]"
               
                :autoplay="{ delay: 3000 }"
                :pagination="{ clickable: true }"
                 navigation
                 class="my-swiper"
                >
       
        <swiper-slide>
          <img src="@/assets/advertisement.jpg" alt="广告1" class="slide-image" />
        </swiper-slide>
        <swiper-slide>
          <img src="@/assets/avatar.jpg" alt="广告2" class="slide-image" />
        </swiper-slide>
        <swiper-slide>
          <img src="@/assets/logo.jpg" alt="广告3" class="slide-image" />
        </swiper-slide>
        
      </swiper>
            </div>
            
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref ,onMounted } from 'vue';
import {RefreshRight,Right } from '@element-plus/icons-vue'
import {Swiper,SwiperSlide} from 'swiper/vue';
import {Navigation,Pagination,Autoplay} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination' 
import 'swiper/css/autoplay'
const greeting=ref('')

const getGreeting=()=>{
    let date=new Date()
    let time=date.getHours();
    if(time<=5){
        greeting.value=`凌晨好`
    }
    else if(time<=11){
        greeting.value=`上午好!`
    }
    else if(time<=14){
        greeting.value=`中午好!`
    }
    else if(time<=18){
        greeting.value=`下午好!`
    }
    else{
        greeting.value=`晚上好!`
    }
}

onMounted(()=>{
    getGreeting()
})
</script>
<style lang="scss" scoped>
    .leftBar{
        position:absolute;
        left:50px;
      
        max-width:260px;
        height:90vh;
        
        display: grid;
        grid-template-rows: 120px 1fr 140px;
        @media(max-width:1240px){
            .leftBar{
               display: none;
            }
        }
    }
  




    .first-area{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        width:260px;
       
        background-color: white;
        border-radius: 5%;
        box-shadow: 0 0 20px rgba(215, 213, 213, 0.8);
    }
    .greeting{
    width:135px;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
   
    
   
    }
    .greeting h1{
        font-weight:600;
        font-size: 18px;
        margin-bottom: -5px;
        margin-top: -5px;
        padding-left: 25px;
        letter-spacing: 2px;
    }
    .greeting p{
      margin-bottom: -5px;
        font-size: 16px;
        font-family: 仿宋;
       
    }
    .daily-attendance{
        background-color: rgb(227, 246, 229);
        height:40px;
        width:70px;
        margin-bottom: -20px;
        color:rgb(35, 147, 21);
        border:1px solid rgb(77, 190, 89)
    }
    .daily-attendance :hover{
       box-shadow: 0 0 50px rgb(88, 223, 47);
    }




    .second-area{
        position: relative;
        
        width:100%;
        margin:20px 0 ;
        background-color: white;
        border-radius: 5%;
        box-shadow: 0 0 20px rgba(215, 213, 213, 0.8);
    }
    .article-header{
        position: absolute;
        display:flex ;
        justify-content: space-between;
        align-items: center;
        width:100%;
        height:20%;
        
    }
    hr{
        width:100%;
        color:rgb(209, 208, 203)
    }
    .hr1{
        position: absolute;
        top:15%;
    }
    .hr2{
        position: absolute;
        top:80%;
    }
    .header-left{
        display: flex;
        flex-direction: row;
        padding-left: 10px;
    }
    .icon{
        border-radius: 50%;
        margin-right: 5px;
    }
    .article{
        font-weight:600;
        font-size:15px;
        font-family: 宋体;
        letter-spacing: 2px;
    }
    .header-right{
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-right: 10px;
        cursor: pointer;
    }
    .refresh{
        font-size:13px;
        font-weight: 200;
    }
    .article-main{
        position: absolute;
        top:18%;
        display: grid;
        width:100%;
        height:65%;
        grid-template-rows: repeat(5,1fr);
      

    }
    .article-item{
      
        letter-spacing: 1px;
        cursor: pointer;
       padding:0;
       width:100%;
       height:100%;
       display: flex;
       align-items: center;
       text-indent: 10px;
      
    }
    .article-item:hover{
        background-color: rgba(194, 199, 191, 0.7);
    }
    .article-more{
        position: absolute;
        top:80%;
        width:100%;
        height:20%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        
    }
    .article-more-item{
        font-size: 14px;
        margin-right: 10px;
        color:rgb(118, 117, 117);
        cursor: pointer;
    }

    .third-area{
        position:relative;
        background-color: white;
        border-radius:5%;
        
       max-width:260px;
        box-shadow: 0 0 20px rgba(215, 213, 213, 0.8);
    }
    .advertisement{
        display: flex;
        justify-content: center;
    }
    .slide-image{
        max-width:260px;
        max-height:140px;
    }
    :deep(.swiper-button-next,.swiper-button-prev) {
       

    }
</style>