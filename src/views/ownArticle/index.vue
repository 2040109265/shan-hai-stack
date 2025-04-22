<script setup lang="ts">
import { ref, computed ,onMounted} from 'vue'
import { ElTag, ElButton, ElMessageBox, ElMessage } from 'element-plus'
import headerBar from '@/layouts/headerBar/index.vue'
import { getOwnArticle,deleteArticle } from '@/api/article'
import { useAuthStore } from '@/store'
import { dayjs } from 'element-plus'
import { useRouter } from 'vue-router'
const authStore=useAuthStore()
const router=useRouter()
let name=authStore.userInfo?.username||'游客'

enum ArticleStatus {
  DRAFT = 0,
  PUBLISHED = 2
}

// 文章接口类型
interface Article {
  id: number
  title: string
  cover:string
  categoryId:string
  tagList:[]
  readTime:number
  isOriginal:number
  originalUrl:string
  publishTime:string
  editTime:string
  status:number
  reviewerId:number
  reviewMessage:string
  viewCount:number
  likeCount:number
  commentCount:number
  collectCount:number
  categoryName:string
  collected:boolean
  liked:boolean
  
}

const articles = ref<Article[]>([])

// 当前选中状态
const activeStatus = ref<ArticleStatus>(ArticleStatus.PUBLISHED)

// 过滤后的文章列表
const filteredArticles = computed(() => {
  return articles.value.filter(
    article => article.status === activeStatus.value
  )
})

// 状态标签显示
const statusMap = {
  [ArticleStatus.DRAFT]: { text: '草稿', type: 'info' },
  [ArticleStatus.PUBLISHED]: { text: '已发布', type: 'success' }
}



const handleLook=(id:number)=>{
  router.push(`/articleDetails/${id}`)
}
// 删除文章
const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定要删除该文章吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    try{
      await deleteArticle(id);
      ElMessage.success("删除成功")
      fetchArticle()
    }catch(error){
      ElMessage.error("删除失败")
    }
  })
}

const fetchArticle=async()=>{
  const id=authStore.userInfo.id
  try{
    const data= await getOwnArticle({
    userId:id
  })
    articles.value=data.records.map((article)=>({
      ...article,
      editTime:handleTime(article.editTime),
      publishTime:handleTime(article.publishTime)
      

    }))
  }catch(error){
    ElMessage.error("获取失败")
  }
  
 
  
}

const handleTime=(time:string)=>{
  return time?dayjs(time).format('YYYY-MM-DD'):'-'
}


onMounted(()=>{
  fetchArticle()
})

</script>

<template>
<headerBar/>
<div class="title">
  尊敬的{{ name }}，你好~
</div>
  <div class="article-container">
    <div class="status-tabs">
      <el-radio-group v-model="activeStatus" >
        <el-radio-button :value="ArticleStatus.PUBLISHED">已发布</el-radio-button>
        <el-radio-button :value="ArticleStatus.DRAFT">草稿箱</el-radio-button>
      </el-radio-group>
    </div>

    <el-table :data="filteredArticles" style="width: 100%" hover>
      <el-table-column prop="title" label="标题" width="200" />
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="statusMap[row.status].type" effect="dark">
            {{ statusMap[row.status].text }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isOriginal" label="是否原创" width="120">
        <template #default="{row}">
          <el-tag :type="row.isOriginal===1?'success':'danger'">
            {{ row.isOriginal===1?`原创`:`非原创`}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="likeCount" label="点赞数" width="60" />
      <el-table-column prop="commentCount" label="评论数" width="60" />
      <el-table-column prop="collectCount" label="收藏数" width="60" />
      <el-table-column prop="editTime" label="最后更新" width="180" />
      <el-table-column prop="readTime" label="预计阅读时间(min)" width="120" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button v-if="row.status === ArticleStatus.DRAFT" type="primary" link>
            编辑
          </el-button>
          <el-button type="primary" link @click="handleLook(row.id)">
            查看
          </el-button>
          <el-button type="danger" link @click="handleDelete(row.id)">
            删除
          </el-button>
          <el-button 
            v-if="row.status === ArticleStatus.DRAFT"
            type="success" 
            link
          >
            发布
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.title{
  margin-top:40px;
  margin-left:40%;
  font-size: 30px;
  background: linear-gradient(90deg ,rgb(166, 97, 97),rgb(125, 214, 103),rgb(109, 173, 191),rgb(212, 127, 215));
  background-clip:text;
  -webkit-text-fill-color: transparent;
  animation:gradient-move 5s  linear infinite;

}
@keyframes gradient-move{
  0%{background-position: 0% 50%}
  100%{background-position: 100% 50%}
}
.article-container {
  margin-top:80px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);

  .status-tabs {
    position:relative;
    left:10%;
    
    

    :deep(.el-radio-group) {
      width: 100%;
      
      .el-radio-button {
        flex: 1;
        
        :deep(.el-radio-button__inner) {
          width: 100%;
        }
      }
    }
  }

  .el-table {
    margin-top: 20px;
    margin-left:10%;

    :deep(.el-table__cell) {
      padding: 30px 0;
    }
  }
}
</style>