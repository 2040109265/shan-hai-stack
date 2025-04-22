<template>
  
  <headerBar @search-event="handleFind"/>
  <div class="global-wrapper">
    <div class="sideBar">
      <sideBar  />
    </div>
  
  <main class="main-content">
    <el-card class="table-card">
      <el-tabs v-model="activeTab" @tab-change="switchTab">
        <el-tab-pane
          v-for="tab in ['default','hot']"
          :key="tab"
          :name="tab"
        >
          <template #label>
            <span class="sort-tab">
              <span class="tab-text" @click.stop="switchTab(tab)">
                {{ tab === 'default' ? '最新' : '最热' }}
              </span>
              <el-icon 
                v-if="activeTab === tab" 
                class="sort-icon" 
                @click.stop="handleSortClick"
              >
                <ArrowUp v-if="requestParams.asc"/>
                <ArrowDown v-else/>
              </el-icon>
            </span>
          </template>

          <el-skeleton :rows="4" animated v-if="loading" />
          <div v-if="articles.length">
            <RecycleScroller 
            class="scroller" 
            :items="articles" 
            :item-size="100" 
            key-field="id"
            :buffer="200"
            page-mode>
            <template v-slot="{item}">
          <div  class="article-item" @click="lookDetails(item.id)">
            <div class="item-details">
              <h2>{{item.title}}</h2>
              <p>{{handleSummary(item.summary)}}</p>
              <div class="item-tags">
                <div class="tags-left">
                  <span>{{item.userVO.username}}</span>
                  <i @click.stop="handleLike(item.id)">
                    <svg t="1743521001255" class="icon" :fill="item.liked?'#d81e06':'#3E3A39'" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1962" width="13px" height="13px"><path d="M760.384 64c47.808 0 91.968 11.968 132.352 35.84a264.32 264.32 0 0 1 95.872 97.152A263.68 263.68 0 0 1 1024 330.88c0 34.752-6.592 68.544-19.712 101.312a262.4 262.4 0 0 1-57.536 87.424L512 960 77.248 519.68A268.8 268.8 0 0 1 0 330.88c0-48.384 11.776-93.056 35.392-133.952A264.32 264.32 0 0 1 131.2 99.84 255.296 255.296 0 0 1 263.68 64 260.736 260.736 0 0 1 449.92 142.208l62.08 62.912 62.144-62.912a258.944 258.944 0 0 1 86.336-58.24A259.584 259.584 0 0 1 760.512 64h-0.128z m0 88.96a174.272 174.272 0 0 0-124.16 52.16L511.872 330.88 387.84 205.12a174.272 174.272 0 0 0-124.288-52.16c-32 0-61.504 7.936-88.384 23.808a175.36 175.36 0 0 0-63.808 64.64 176.32 176.32 0 0 0-23.552 89.536c0 23.168 4.352 45.632 13.056 67.392 8.704 21.824 21.504 41.28 38.4 58.432L512 834.176l372.672-377.408c16.896-17.152 29.696-36.608 38.4-58.432 8.704-21.76 13.056-44.224 13.056-67.392 0-32.448-7.808-62.336-23.488-89.536a175.36 175.36 0 0 0-63.872-64.64 170.688 170.688 0 0 0-88.32-23.808z"  p-id="1963"></path></svg>
                  </i>
                  <span>{{item.likeCount}}</span>
                  <el-icon @click.stop="handleCollect(item.id)" :style="{color:item.collected?'#faa755':'#3E3A39'}" ><Star/></el-icon>
                  <span>{{item.collectCount}}</span>
                </div>
                <div class="tags-right" >
                  <span v-for="tag in item.tagList">
                    {{ tag }}
                  </span>
                </div>
              </div>
          </div>
          <div class="item-img">
            <img :src="item.cover" alt="图片"  style="height:90px; width:160px;border-radius:10%" v-lazy-img decoding="async"/>
          </div>

          </div>
        </template>
        </RecycleScroller>
        </div>
        <div v-else class="no-articles">
          <el-empty 
            description="暂时还没有相关文章哦~" 
            
          >
            <template #description>
              <p class="empty-text">还没有人分享过相关内容</p>
              <el-button 
              class="btn"
                type="primary" 
                size="small"
                @click.stop="handleWriteArticle"
                style="margin-top:20px;"
              >
                去创作
              </el-button>
            </template>
          </el-empty>
          
        </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </main>
  <div class="rightBar">
    <rightBar @custom-event="handleChildEvent"/>
  </div>
  
</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, defineAsyncComponent } from 'vue'
import { ElMessage,ElCard,ElSkeleton } from 'element-plus'
import { articleSearch, toggleLike, toggleCollect} from "@/api/article"
import  { Article, ArticleSearchDTO } from "@/types/article"
import headerBar from '@/layouts/headerBar/index.vue'
import rightBar from '@/layouts/sideBar/rightBar.vue'
import {Star,ArrowDown,ArrowUp} from '@element-plus/icons-vue'
import { useRouter,onBeforeRouteUpdate } from 'vue-router'
import JSONBig from 'json-bigint'
import '@/css/global.scss'
import {RecycleScroller} from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
const JSONbigString =JSONBig({storeAsString:true})
const loading=ref(false)
// 响应式状态
const articles = ref<Article[]>([])
const activeTab = ref<'default' | 'hot'>('default')
const requestParams = reactive<ArticleSearchDTO>({
  cursor: {
    articled: 0,
    publishTime: '',
    likeCount: 0,
    collectCount: 0    
  },
  size: 10,
  forward: true,
  searchText: '',
  userId: 0,
  categoryId: 0,
  sortField: 'publish_time',
  asc: false,
  firstQuery: true
})

const router=useRouter()
const sideBar=defineAsyncComponent(()=>import('@/layouts/sideBar/index.vue'))
// 获取文章列表
const fetchArticles = async () => {
  try {
    loading.value=true
    const data = await articleSearch({ 
      size: 10,
      sortField: requestParams.sortField
   }
    )
    articles.value=[]
    if (requestParams.firstQuery) {
      articles.value = data.records
    } else {
      articles.value = [...articles.value, ...data.records]
    }
    
    updateCursor()
    requestParams.firstQuery = false
  } catch (error) {
    ElMessage.error("获取文章失败")
    console.error("获取失败原因", error)
    
  }
  finally{
    loading.value=false
  }
}


const handleChildEvent=async(params:any)=>{
  if(params.id===0){
    fetchArticles()
  

    return;
  }
  const id=BigInt(params.categoryId)
  const requestData=JSONbigString.stringify( {
        categoryId:id
      }  )
  try {
    const data = await articleSearch(requestData)
    articles.value=[]
    if (requestParams.firstQuery) {
      articles.value = data.records
    } else {
      articles.value = [...articles.value, ...data.records]
    }
    
    updateCursor()
    requestParams.firstQuery = false
  } catch (error) {
    ElMessage.error("获取文章失败")
    console.error("获取失败原因", error)
  }
}

// 更新分页游标
const updateCursor = () => {
  const lastArticle = articles.value[articles.value.length - 1]
  if (!lastArticle) return
  
  requestParams.cursor = {
    publishTime: lastArticle.publishTime,
    likeCount: lastArticle.likeCount,
    collectCount: lastArticle.collectCount,
    articled: lastArticle.id
  }
}
const lookDetails=(id:number)=>{
  router.push({
    path:`/articleDetails/${id}`
  })
}



// 点赞操作
const handleLike = async (articleId: number) => {
  const article = articles.value.find(a => a.id === articleId)
  if (!article) return

  const originalState = {
    liked: article.liked,
    count: article.likeCount
  }

  // 乐观更新
  article.liked = !article.liked
  article.likeCount += article.liked ? 1 : -1

  try {
    await toggleLike(articleId)
  } catch (error) {
    // 失败回滚
    article.liked = originalState.liked
    article.likeCount = originalState.count
    ElMessage.error('点赞操作失败')
  }
}

// 收藏操作（实现与点赞类似）
const handleCollect = async (articleId: number) => {
  const article = articles.value.find(a => a.id === articleId)
  if (!article) return

  const originalState = {
    collected: article.collected,
    count: article.collectCount
  }

  article.collected = !article.collected
  article.collectCount += article.collected ? 1 : -1

  try {
    await toggleCollect(articleId)
  } catch (error) {
    article.collected = originalState.collected
    article.collectCount = originalState.count
    ElMessage.error('收藏操作失败')
  }
}

// 切换标签
const switchTab = (newTab: 'default' | 'hot') => {
  activeTab.value = newTab
  requestParams.sortField = newTab === 'default' ? 'publish_time' : 'like_count'
  requestParams.firstQuery = true
  fetchArticles()
}

// 处理排序点击
const handleSortClick = async() => { 
  requestParams.asc = !requestParams.asc
  if(requestParams.sortField==='like_count'){
    requestParams.firstQuery = true
  try {
    const data = await articleSearch({ 
      size: 10,
      sortField: requestParams.sortField,
      asc:requestParams.asc
   }
    )
    articles.value=[]
    if (requestParams.firstQuery) {
      articles.value = data.records
    } else {
      articles.value = [...articles.value, ...data.records]
    }
    
    updateCursor()
    requestParams.firstQuery = false
  } catch (error) {
    ElMessage.error("获取文章失败")
    console.error("获取失败原因", error)
  }
  }
 
 
}

const handleSummary=(summary:string)=>{
  if(summary.length<=30)return summary
  return summary.substring(0,30)+'...'
}

const handleFind=async(params:string)=>{
  try {
    const data = await articleSearch({ 
      size: 10,
      sortField: requestParams.sortField,
      searchText:params
   }
    )
    articles.value=[]
    if (requestParams.firstQuery) {
      articles.value = data.records
    } else {
      articles.value = [...articles.value, ...data.records]
    }
    
    updateCursor()
    requestParams.firstQuery = false
  } catch (error) {
    ElMessage.error("获取文章失败")
    console.error("获取失败原因", error)
  }
}

const handleWriteArticle=()=>{
  router.push('/writeArticle')
}
onMounted(()=>{
   fetchArticles()
})


</script>

<style scoped>
.global-wrapper{
  background: rgb(228, 231, 228);
  display: grid;
  grid-template-columns: 350px 1fr 300px;
 position: relative;
 height:calc(90vh);
 padding-top: 20px;
}

@media (max-width:1260px){
  .global-wrapper{
    display: grid;
    grid-template-columns:1fr;
  }
}

.main-content {
  position: relative;
  background: #fff;
  border-radius: 8px;
  z-index:1;
 
  
  @media (max-width: 768px) {
    margin: 10px 0;
    width: 100%;
  }
}

.table-card{
  width:100%;
  height:100%;

}

.article-item{
  width:100%;
  height:100px;
  border-bottom: 1px solid rgb(188, 184, 184);
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  
}
  .article-item :hover{
    background-color: rgb(247, 245, 245);
  }

.item-details{
  height:100px;
  width:80%;
  margin:0;


  h2{
  font-size:16px;
  font-family:'font';
  color:#252933;
  font-weight: 600;
  font-style: normal;
}

  p{
    font-size:13px;
 
    color:#8A919F;
  }
  .item-tags{
    font-size:13px;
   
    color:#8A919F;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .tags-left{
    display: flex;
    align-items: center;

    span{
      margin: 0 10px 0 5px;
    }
  }
  .tags-right{
    span{
      margin-left:5px;
      background-color: #F2F3F5;
      padding:1px;
      
    }
    margin-right: 10px;
  }
  
}
@media screen and (max-width:1200px) {
  .item-details{
    .tags-right{
   display: none;
  }
  }
  
}


.sort-tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.tab-text {
  cursor: pointer;
  &:hover {
    color: var(--el-color-primary);
  }
}

.sort-icon {
  cursor: pointer;
  transition: transform 0.3s;
  &:hover {
    color: var(--el-color-primary);
  }
}
.no-articles {
  padding: 50px 0;
  text-align: center;
  color: #909399;
  
  &.empty-text {
    margin-top: 20px;
   
  }
  
 }


</style>