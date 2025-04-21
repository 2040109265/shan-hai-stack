<template>
  
  <headerBar/>
  <div class="article-container">
    <div class="sidebar"></div>
    <div class="sidebar-on">
      <el-tooltip content="点赞" placement="left">
        <div class="action-btn" v-throttle-click:1000="toggleLikes" >
          <svg t="1743428316475" class="toggle-icon" :fill="articleDetail.liked?'#ff0000':'#0aad12'" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1464" width="24" height="24"><path d="M797.184 518.496l-284.384 294.016-284.16-292A162.752 162.752 0 0 1 192 417.6C192 328.512 263.808 256 352 256a159.36 159.36 0 0 1 133.28 72.16L512 368.64l26.72-40.48A159.488 159.488 0 0 1 672 256c88.224 0 160 72.512 160 161.6 0 37.536-12.992 74.08-34.816 100.896M672 192a222.72 222.72 0 0 0-160 67.712A222.624 222.624 0 0 0 352 192c-123.52 0-224 101.216-224 225.6 0 52.288 18.176 103.232 52.96 145.536l285.952 293.984a62.4 62.4 0 0 0 45.088 19.168c17.12 0 33.12-6.816 45.12-19.136l287.744-296.064A226.816 226.816 0 0 0 896 417.6C896 293.216 795.52 192 672 192"  p-id="1465"></path></svg>

          <span>{{ articleDetail.likeCount }}</span>
        </div>
      </el-tooltip>

      <el-tooltip content="收藏" placement="left">
        <div class="action-btn" v-throttle-click="toggleCollects">
          <Star class="toggle-icon" :style="{color:articleDetail.collected?'#FFDEAD':'#0aad12'}" />
          <span>{{ articleDetail.collectCount }}</span>
        </div>
      </el-tooltip>

      <el-tooltip content="分享" placement="left">
        <div class="action-btn">
          <Share class="icon"/>
        </div>
      </el-tooltip>
    </div>
  

    <!-- 文章主体 -->
    <main class="article-main">
      <h1 class="article-title">{{ articleDetail.title }}</h1>
      
      <div class="article-meta">
        <div class="meta-left">
          <img :src="articleDetail.userVO.avatar==null?defaultAvatar:articleDetail.userVO.avatar" alt="头像" class="img" v-lazy-img/>
          <div class="meta-date">
            <div class="meta-name">{{articleDetail.userVO.username}}</div>
            <div class="meta-datails">
              <el-icon class="icon"><Calendar/></el-icon>
              {{handleTime(articleDetail.publishTime)}}
            </div>
          </div>
          
          <div class="meta-tags" >
            <el-icon class="icon"><Files/></el-icon>
            <span>{{ articleDetail.categoryName}}</span>
          </div>
          <div class="meta-origin" :style="{textShadow:articleDetail.isOriginal===0?'0 0 20px #0aad12':'0 0 20px red'}">{{articleDetail.isOriginal===0?'原创':'非原创'}}</div>
        </div>
        <div class="meta-right">
          <div class="meta-count">
            <el-icon class="icon"><View/></el-icon>
            <span>{{articleDetail.viewCount}}</span>
            <span>浏览</span>
          </div> 
          <div class="meta-count">
            <el-icon class="icon"><Timer/></el-icon>
            <span>{{articleDetail.readTime}}</span>
            <span>分钟</span>
          </div> 
          <div class="meta-count">
            <el-icon class="icon"><ChatDotRound/></el-icon>
            <span>{{articleDetail.commentCount}}</span>
            <span>评论</span>
          </div>
        </div>


      </div>
      <el-card class="article-summary">
        <div class="summary-logo">
          <el-icon><Management/>
          </el-icon>
          <span>文章摘要</span>
        </div>
        <span>{{articleDetail.summary}}</span>
      </el-card>
      <hr/>
     
      <article class="article-content" v-html="compiledMarkdown"  ref="articleContent">
      </article>
      <hr/>
      <el-card class="el-card">
        <div class="notice-header">
            <el-icon class="icon"><InfoFilled /></el-icon>
            <span>版权声明</span>
          </div>
        <div class="copyright-notice">
          
        <div class="notice-content">
          <i class="fas fa-info-circle"></i>
          <div class="notice-text">
            <p v-if="articleDetail.isOriginal">
              <el-icon><CircleCheck /></el-icon>
              <span>本文为原创文章</span>
            </p>
            <p v-else>
              <span>本文非原创文章，版权归原作者所有。如有侵权，请联系删除。</span>
              <a :href="articleDetail.originalUrl">{{articleDetail.originalUrl}}</a>
              
            </p>
          </div>
          <div class="notice">
            <el-icon><WarnTriangleFilled /></el-icon>
            <span>若无作者许可，禁止私自转载</span>
          </div>
        </div>
      </div>
      </el-card>
      <Comment v-if="articleDetail.id" :article-id="articleDetail.id" :comment-count="articleDetail.commentCount||0" :article-author-id="articleDetail.userVO.id"/>
    </main>
    <div class="right">
    <div class="toc-card">
      <div class="toc-header">
        <el-icon class="icon"><Collection/></el-icon>
        <span>文章目录</span>
        <span>{{ progress }}%</span>
      </div>
      <div class="toc-list">
        <div 
          v-for="item in tocItems" 
          :key="item.id"
          class="toc-item"
          :class="{active:activeId===item.id}"
          :style="{ paddingLeft: `${(item.level - 2) * 16}px` }"
          @click="scrollTo(item.id)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
   </div>
  </div>

</template>

<script setup lang="ts">
import { computed , onMounted, ref,reactive,nextTick, onUnmounted, defineAsyncComponent} from 'vue'
import { useAuthStore } from '@/store'
import { Star ,Calendar,Files,View,Timer,ChatDotRound,Collection,InfoFilled,CircleCheck,WarnTriangleFilled, Share,Management} from '@element-plus/icons-vue'
import headerBar from '@/layouts/headerBar/index.vue'
import {marked} from 'marked'
import { useRoute } from 'vue-router'
import { getArticleById } from '@/api/article'
import { ElMessage } from 'element-plus'
import { dayjs } from 'element-plus'
import '@/css/variables.scss'
import { toggleLike,toggleCollect } from '@/api/article'

import defaultAvatar from '@/assets/avatar.png'

const Comment=defineAsyncComponent(()=>import('@/components/comment/index.vue').then(m=>m.default))
const route=useRoute()
const activeId=ref('')
const authStore=useAuthStore()
let id=ref()
let articleDetail=reactive({
        showDetail:true,
        id: 0,
        userId: null,
        title: "",
        summary: "",
        cover: "",
        categoryId: null,
        tagList: [],
        contentHtml: "",
        contentMd:"",
        readTime: 0,
        isOriginal: 0,
        originalUrl: "",
        publishTime: "",
        editTime: "0",
        status: null,
        reviewerId: null,
        reviewMessage: "",
        reviewTime: "",
        viewCount: null,
        likeCount: 0,
        commentCount: null,
        collectCount: 0,
        liked:false,
        collected:false,
        userVO: {
            id: null,
            username: "",
            avatar: null,
            nickname: "R",
            profile: null,
            role: "",
            status: 0,
            editTime: "",
            createTime: ""
        },
        categoryName: ""
})


const compiledMarkdown = computed(() => {
  return marked(articleDetail.contentHtml || '')
})

const handleTime=(time:string)=>{
  return time?dayjs(time).format('YYYY-MM-DD'):'-';
}
const articleContent = ref<HTMLElement | null>(null); 
const progress = ref(0);


const calculateProgress = () => {
  if (!articleContent.value) return;

  const contentHeight = articleContent.value.offsetHeight; 
  const windowHeight = window.innerHeight; 
  const scrollTop = window.scrollY;

 
  const maxScroll = Math.max(contentHeight - windowHeight, 0);
  if (maxScroll === 0) {
    progress.value = 100; 
    return;
  }
  const scrollPercent =Math.floor((scrollTop / maxScroll) * 100) ;
  progress.value = Math.min(100, Math.max(0, scrollPercent));
};



const toggleCollects=async()=>{
  if(!authStore.isLoggedIn){
    ElMessage.error("请先登录");
    return;
  }
  const originalState = {
    collected: articleDetail.collected,
    count: articleDetail.collectCount
  }

  articleDetail.collected = !articleDetail.collected
  articleDetail.collectCount += articleDetail.collected ? 1 : -1

  try {
    await toggleCollect(articleDetail.id)
  } catch (error) {
    articleDetail.collected = originalState.collected
    articleDetail.collectCount = originalState.count
    ElMessage.error('收藏操作失败')
  }

}
const toggleLikes=async()=>{
  if(!authStore.isLoggedIn){
    ElMessage.error("请先登录");
    return;
  }
 const originalState = {
    liked: articleDetail.liked,
    count: articleDetail.likeCount
  }
 articleDetail.liked = !articleDetail.liked
  articleDetail.likeCount += articleDetail.liked ? 1 : -1
try {
    await toggleLike(articleDetail.id)
  } catch (error) {
    articleDetail.liked = originalState.liked
    articleDetail.likeCount = originalState.count
    ElMessage.error('点赞操作失败')
  }

}


const handleScroll=()=>{
  calculateProgress();
  const headers=document.querySelectorAll('.article-content h2, .article-content h3, .article-content h4')
  let activeItem=null;
  headers.forEach(header=>{
    const rect=header.getBoundingClientRect();
    for(let i=headers.length-1;i>=0;i--){
      const header=headers[i];
      if(header&&header.getBoundingClientRect().top<=130){
          activeItem=header.id;
          break;
      }
    }
  })
  activeId.value=activeItem||'';
}

  onMounted(()=>{
   id.value=BigInt(route.params.id as string)
    findById(id.value)
    window.addEventListener('scroll',handleScroll)
  })
  onUnmounted(()=>{
    window.removeEventListener('scroll',handleScroll)
  })


  interface TocItem {
  id: string
  text: string
  level: number
}

const tocItems = ref<TocItem[]>([])

const generateToc = () => {
  const headers = document.querySelectorAll('.article-content h2,.article-content h3,.article-content h4')
  const items: TocItem[] = []
  
  headers.forEach((header,index) => {
    const level = parseInt(header.tagName.substring(1))
    const text = header.textContent || ''
    let id=header.getAttribute('id');
    if(!id){
      const baseId=clean(text)
      id=baseId+(index?`-${index}`:'');
      header.id=id
    }
    
    items.push({
      id,
      text,
      level
    });
    
  })
  
  tocItems.value = items
}

const clean=(text:string)=>{
  return text.toLowerCase().replace(/[^a-z0-9]/g,'')
  .replace(/ +/g,'-').replace(/^-+|-+$/g,'');
}

const applyCodeStyle=()=>{
  const codeElements=document.querySelectorAll('.article-content code');
  codeElements.forEach(codeElement=>{
    const text=codeElement.textContent?.trim();
    const length=text?.length;
    if(length>=20){
      codeElement.classList.add('long-code');
    }
  })
  
}


const scrollTo = (id: string) => {
  const target = document.getElementById(id)
  if (target) {
    const targetPosition=target.offsetTop
    window.scrollTo({
      top:targetPosition,
      behavior:'smooth'
    })
  }
}

// 在获取文章内容后生成目录
const findById = async (id: number) => {
  try {
    Object.assign(articleDetail, await getArticleById(id))
    
    nextTick(() => {
      generateToc()
      applyCodeStyle()
    })
  } catch (error) {
  ElMessage.error("获取错误！")
  }
}


</script>

<style scoped lang="scss">

.article-container {
  min-width: 100vw;
  min-height:100vh;
  
  display: grid;
  grid-template-columns: 150px 1fr 360px;
  gap: 40px;
  position: absolute;
  top:10%;
  background-color: rgb(228, 231, 228);
}

.author-card {
  background: #fff;
  margin:10px 0 0 10px;
  height:50vh;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  .author-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;

    .author-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 2px solid #eee;
    }
  }

  .author-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    text-align: center;

    .stat-item {
      background: #f8f9fa;
      padding: 12px;
      border-radius: 6px;

      span {
        display: block;
        color: #666;
        font-size: 12px;
      }

      strong {
        font-size: 16px;
        color: #333;
        
      }
    }
  }
}

.article-main {
  margin:20px -15px 0 -35px ;
  position: relative;
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  .article-title {
    font-size: 32px;
    font-family:KaiTi;
    margin-bottom: 20px;
  }

  .article-meta {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    font-size:15px;
    font-family: 'Courier New', Courier, monospace;

    .meta-left{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width:380px;
      .img{
        height:45px;
        width:auto;
        border-radius: 50%;
      }
     
    } 
    
    .meta-right{
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;

      .meta-count{
        display: flex;
        align-items: center;
        margin:0 5px;
        
      }
    }
  }
}
.meta-name{
  color:#0aad12;
  font-weight: 500;
  font-size: 16px;
  font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  margin-bottom: 4px;
}
.meta-data{
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
.meta-datails{
      display: flex;
      flex-direction:row;
      align-items: center;
      color:rgb(30, 30, 30);
      font-size: 13px;
      
      }
.meta-tags{
  display: flex;
  align-items: center;
  .icon{
    color:#0aad12;
    margin-right: 5px;
  
  }
  span{
    color:#0aad12;
    font-weight: 600;
    margin:0 5px;}
}



.sidebar-on{
  position: fixed;
 top:300px;
 left:60px;
  transform:translateY(-50%);
  display: flex;
  flex-direction: column;
  gap:25px;
}

  .action-btn {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 10px;
    height:25px;
    width:25px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.2s;

    

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .icon {
      width: 24px;
      height: 24px;
      color:rgb(12, 148, 50);
      fill:rgb(12, 148, 50);
      
    }

    span {
      position:absolute;
      top:-4px;
      right:-4px;
      background:#ff4949;
      color:#fff;
      font-size: 10px;
      padding:2px 6px;
      border-radius: 50%;
      white-space: nowrap;
      
    }
  }


  .markdown-body {

    line-height: 1.6;
    
    h2, h3 {
      margin: 1.5em 0 1em;
    }
  
    pre {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      overflow-x: auto;
    }
  
    img {
      max-width: 100%;
      border-radius: 6px;
      margin: 1em 0;
    }
  }

  @media screen and (max-width:1114px) {
    .toc-card{
      display: none;
    }
  }
.toc-card {
  position: sticky;
  top: 100px;
  max-width:260px;
  background: #fff;
  margin: 20px 10px 0 0px;
  padding: 20px 0 20px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  min-height: 50vh;
  max-height: 70vh;
  overflow-y: auto;

  .toc-header {
    font-size: 16px;
   
    font-weight: 600;
   margin:5px 0 25px 5px;
   padding:10px 0 25px 5px;
    border-bottom: 1px solid #eee;
    .icon{
      margin:5px 5px 0 0;
      color:#0aad12;
    }
    span +span{
      margin:0 25px;
    }
  }

  .toc-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .toc-item {
    font-size: 14px;
    color: #666;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.2s;
    position: relative;

    &:hover {
      background:rgb(217, 237, 215,0.7);
      color: #282c34;
      transform: translateX(5px);
    }

    
    
  }
  .toc-item.active{
       background:linear-gradient(90deg,rgba(217, 237, 215,1),rgba(217, 237, 215,0.7))
      
    }

  .toc-item.active::before{
    position: absolute;
      content:'';
      top:10px;
      left:-15px;
      width:5px;
      height:5px;
      border-radius: 50%;
      background-color: rgb(12, 148, 50);
    }
}



.article-content {
  padding: 0 8px * 2;
  line-height: 1.8;
  color: #1f2937;
  font-size: 1.1em;

  :deep(h2) {
    font-size: 1.5em;
    font-family:宋体;
    margin: 32px 0 24px;
    padding-bottom: 8px;
    border-bottom: 2px solid rgba(rgb(12, 148, 50), 0.1);
    position: relative;
    color: #1f2937;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 50px;
      height: 2px;
      background: rgb(12, 148, 50);
    }
  }

   :deep(h3) {
    font-size: 1.2em;
    margin: 24px 0;
    color: rgba(12, 148, 50,0.6);
    position: relative;
    padding-left: 24px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 20px;
      background: rgb(12, 148, 50);
      border-radius: 4px;
    }
  }

  :deep(p) {
    text-indent: 2em;
    margin: 16px 0;
    color: #666;
    line-height: 1.8;
    font-size: 16px;
  }

  :deep(a) {
    color: rgb(12, 148, 50);
    text-decoration: none;
    border-bottom: 1px dashed rgb(12, 148, 50);
    transition: all 0.3s ease;

    &:hover {
     
      border-bottom-style: solid;
    }
  }

  :deep(blockquote) {
    margin: 24px 0;
    padding: 16px 24px;
    background: var(--hover-bg);
    border-left: 4px solid rgb(12, 148, 50);
    border-radius: 4px;
    color: #666;
    font-style: italic;

    p {
      margin: 0;
    }
  }

  :deep(ul),
  :deep(ol) {
    margin:16px 0;
    padding-left:32px;
    color: #585757;

    li {

      margin-bottom: 8px;
      position: relative;

      &::marker {
        color: rgb(12, 148, 50);
      }
    }
  }
  :deep(strong){
    font-size:16px;
    text-shadow:0 0 10px #bce5be;

  }
  :deep(code){
    font-family: 仿宋;
    font-size: 15px;
  }
  :deep(.long-code) {
    background: #2d323b;
    border-radius: 5px;
    color:#fff;
      display: block;
      padding: 1em;
      padding-top:2em;
      padding-left: 4em;
      
      margin-left: 0;
 
      overflow-x: auto;
      font-family: 'Fira Code', monospace;
      font-size: 14px;
      line-height: 1.5;
      position: relative;
 
      &::-webkit-scrollbar {
        height: 8px;
      }

      &::-webkit-scrollbar-track {
        background: #2d323b;
      }

      &::-webkit-scrollbar-thumb {
        background: #454c59;
        border-radius: 4px;

        &:hover {
          background: #5a6273;
        }
      }
    }

    
    :deep(.long-code):before {
      content: '';
      position: absolute;
      top: 12px;
      left: 12px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #ff5f56;
      box-shadow:
        20px 0 0 #ffbd2e,
        40px 0 0 #27c93f;
    }

  :deep(pre) {
    margin: 1em 0;
    position: relative;
    background: #282c34;
    border-radius: 6px;
    padding-top: 2.5em;
    overflow: hidden;
    max-height: 2000px;
    transition: max-height 0.4s ease-in-out;

    &.collapsed {
      max-height: 300px;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: linear-gradient(transparent, #282c34);
        pointer-events: none;
        z-index: 2;
      }

      .expand-button {
        display: flex !important;
      }
    }

    .expand-button {
      position: absolute;
      bottom: 15px;
      left: 50%;
      transform: translateX(-50%);
      padding: 6px 16px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      color: #abb2bf;
      cursor: pointer;
      z-index: 3;
      font-size: 0.9em;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
      white-space: nowrap;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
        transform: translateX(-50%) translateY(-2px);
      }

      i {
        font-size: 14px;
      }
    }

    /* 添加行号容器样式 */
    .line-numbers {
      position: absolute;
      left: 0;
      top: 2.5em;
      bottom: 0;
      font-size: 14px;
      padding: 1em 0;
      text-align: right;
      color: #666;
      border-right: 1px solid #404040;
      background: #2d323b;
      user-select: none;
      z-index: 1;

      span {
        display: block;
        padding: 0 0.5em;
        min-width: 2.5em;
        line-height: 1.5;
      }
    }

    /* 调整代码内容的样式 */
   
    /* 复制按钮容器 */
    .code-header {
      position: absolute;
      top: 8px;
      right: 12px;
      z-index: 2;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    /* 显示复制按钮 */
    &:hover .code-header {
      opacity: 1;
    }

    /* 复制按钮样式 */
    .copy-button {
      padding: 4px 8px;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: 4px;
      color: #abb2bf;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 4px;

      i {
        font-size: 14px;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
      }

      &.copied {
        background: #98c379;
        color: #fff;
      }
    }
  }


  :deep(table) {
    width: 100%;
    margin: 24px 0;
    border-collapse: collapse;
    border-radius: 0 4px 6px rgba(0, 0, 0, 0.1);;
    overflow: hidden;

    th,
    td {
      padding: 8px 16px;
      border: 1px solid rgba(0, 0, 0, 0.1);;
    }

    th {
      background: rgba(#98c379, 0.1);
      color: #1f2937;
      font-weight: 500;
      text-align: left;
    }

    tr:nth-child(even) {
      background: rgba(#98c379, 0.1);
    }
  }

  :deep(hr) {
    margin: 32px 0;
    border: none;
    height: 1px;
    background: rgba(0, 0, 0, 0.1);;
    position: relative;

    &::before {
      content: '§';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      padding: 0 24px;
      color: #666;
      font-size: 1.2em;
    }
  }
}
.el-card{
  margin-top: 40px;
  padding:0px ;
  .notice-header{
    margin:0;
    padding:0;
    .icon{
      color:#0aad12;
      margin: 10px 5px 0 0;
    }
  }
}

.copyright-notice {
  margin-top: 30px;
  border-radius: 10px;
  background: rgba(#98c379, 0.05);
  border: 1px solid rgba(#98c379, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(#98c379, 0.08);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(#98c379, 0.1);
  }

  .notice-content {
    padding: 16px;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;

    i {
      color: #98c379;
      font-size: 1.2em;
      margin-top: 3px;
    }

    .notice-text {
      flex: 1;
      color: var(#666);
      font-size: 0.95em;
      line-height: 1.6;

      p {
        margin: 0;
      }

      a {
        color: #98c379;
        text-decoration: none;
        border-bottom: 1px dashed #98c379;
        transition: all 0.2s ease;

        &:hover {
          border-bottom-style: solid;
        }
      }
    }
  }
}

</style>