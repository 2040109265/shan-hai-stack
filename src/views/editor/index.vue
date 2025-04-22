<template>
    <div class="editor-container">
        <div class="editor-main">
            <!-- 顶栏布局 -->
            <div class="editor-header">
                <el-icon class="header-icon" @click="toFront"><ArrowLeft/></el-icon>
                <el-form-item class="header-title" prop="title">
                    <el-input 
                        v-model="articleForm.title" 
                        placeholder="请输入文章标题..." 
                        size="large"
                        :class="{ 'title-input': true }"
                    />
                </el-form-item>
                <div class="header-actions">
                    <el-button size="default" @click="handleBeforeSubmit('draft')">
                        <i class="fas fa-save"></i>
                        {{ loading ? '保存中...' : '保存草稿' }}
                    </el-button>
                    <el-button size="default" type="primary" @click="handleBeforeSubmit('publish')">
                        <i class="fas fa-paper-plane"></i>
                        提交审核
                    </el-button>
                </div>
            </div>
            <el-form :model="articleForm" :rules="rules" ref="articleFormRef" label-position="top" size="small">
                <div class="editor-content centered-layout">
                    <!-- Markdown 编辑器 -->
                    <div class="content-card flex-card">
                        <el-form-item label="文章内容" prop="contentMd" class="mb-20">
                            <span>预计阅读时间:{{articleForm.readTime}}min</span>
                            <mavon-editor
                                placeholder="输入文章内容..."
                                style="height: 70vh; width: 100%"
                                ref="mdRef"
                                v-model="articleForm.contentMd"
                                @imgDel="imgDel"
                                @imgAdd="imgAdd"
                                previewBackground="#ffffff"
                                toolbarsBackground="#AFE1AF"
                            />
                        </el-form-item>
                    </div>

                   

                    <!-- 补充信息弹窗 -->
                    <el-dialog
                        v-model="showSupplementDialog"
                        title="补充文章信息"
                        width="600px"
                        center
                        :close-on-click-modal="false"
                    >
                        <el-form :model="articleForm" :rules="rules" ref="supplementFormRef">
                            <el-form-item label="文章描述" prop="summary">
                                <el-input v-model="articleForm.summary" type="textarea" :rows="4" placeholder="请输入文章描述..." />
                            </el-form-item>

                            <el-form-item label="文章分类" prop="categoryId">
                                <el-select v-model="articleForm.categoryId" placeholder="请选择分类">
                                    <el-option 
                                        v-for="item in categories" 
                                        :key="item.id" 
                                        :label="item.name"
                                        :value="item.id"
                                    />
                                </el-select>
                            </el-form-item>

                            <el-form-item label="文章标签" prop="tagList">
                                <el-select 
                                    v-model="articleForm.tagList" 
                                    multiple 
                                    filterable 
                                    allow-create 
                                    default-first-option
                                    placeholder="请选择标签"
                                >
                                    <el-option 
                                        v-for="item in tags" 
                                        :key="item.id" 
                                        :label="item.name" 
                                        :value="item.name"
                                    />
                                </el-select>
                            </el-form-item>

                            <el-form-item label="封面图片" prop="cover">
                                <div class="cover-area" @click="triggerCoverUpload">
                                    <div v-if="!articleForm.cover" class="cover-placeholder">
                                        <i class="fas fa-image"></i>
                                        <span>点击上传封面图</span>
                                    </div>
                                    <div v-else class="cover-preview">
                                        <img :src="articleForm.cover" alt="文章封面">
                                        <div class="cover-actions">
                                            <el-button size="small" circle type="danger" @click.stop="removeCover">
                                                <i class="fas fa-trash"></i>
                                            </el-button>
                                        </div>
                                    </div>
                                </div>
                                <input ref="coverInput" type="file" accept="image/*" @change="handleCoverUpload" style="display: none">
                            </el-form-item>
                            <el-form-item label="是否为原创" prop="isOriginal">
                                <el-switch
                                    v-model="articleForm.isOriginal"
                                    :active-value="1"
                                    :inactive-value="0"
                                    active-text="原创文章"
                                    inactive-text="转载文章"
                                />
                            </el-form-item>
                    
                            <!-- 新增原文链接 -->
                            <el-form-item 
                                v-if="articleForm.isOriginal === 0"
                                label="原文链接" 
                                prop="originalUrl"
                            >
                                <el-input 
                                    v-model="articleForm.originalUrl" 
                                    placeholder="请输入原文地址"
                                    type="url"
                                />
                            </el-form-item>
                        </el-form>

                        <template #footer>
                            <el-button @click="showSupplementDialog = false">取消</el-button>
                            <el-button type="primary" @click="handleFinalSubmit">确认提交</el-button>
                        </template>
                    </el-dialog>
                </div>
            </el-form>
        </div>
    </div>
</template>


<script setup >
import { ref, reactive, onMounted ,watch} from 'vue'
import {ArrowLeft} from '@element-plus/icons-vue'
import { useRouter,useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {mavonEditor} from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';

import { getCategories, getTags,publishArticle,draftArticle,draftArticleLast } from '@/api/article'
import { handleImg } from '@/api/img';
import { useAuthStore } from '@/store';
import { getArticleById } from '@/api/article';

const route=useRoute()
const router = useRouter()
const authStore=useAuthStore()
// 响应式数据
const loading=ref(false)
const articleForm = reactive({
  id: 0,
  title: '',
  summary: '',
  contentHtml: '',
  contentMd: '',
  cover: '',
  readTime:0,
  isOriginal: 1,
  originalUrl: '',
  categoryId: '',
  tagList:[]
})
const categories = ref([])
const tags = ref([])
const statusList = ref([])
const isSubmitting = ref(false)
const mdRef = ref(null)
const articleFormRef = ref(null)
const coverInput = ref(null)
const showSupplementDialog = ref(false)
const supplementFormRef = ref(null)
const submitType = ref('')

const toFront=()=>{
    router.back()
}

watch(()=>
    articleForm.contentMd
,(newVal)=>{
    if(!newVal){
        articleForm.readTime=0;
        return
    }
    
    const chineseChars = newVal.match(/[\u4e00-\u9fa5]/g) || []
    const englishWords = newVal.replace(/[\u4e00-\u9fa5]/g, '').split(/\s+/).length
    const total = chineseChars.length + englishWords
    articleForm.readTime = Math.ceil(total / 400) 
  },
  { immediate: true }
)


const handleBeforeSubmit = async (type) => {
    submitType.value = type
    try {
        await articleFormRef.value.validateField(['title', 'contentMd'])
        showSupplementDialog.value = true
    } catch (error) {
        ElMessage.error('请先填写标题和文章内容')
    }
}
const handleFinalSubmit = async () => {
    try {
        // 验证补充表单
     
        await supplementFormRef.value.validate()
        
        if (submitType.value === 'draft') {
            await saveDraft()
        } else {
            await publishArticles()
        }
        
        showSupplementDialog.value = false
    } catch (error) {
        console.error('表单验证失败:', error)
    }
}
// 表单验证规则
const rules = reactive({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 5, max: 100, message: '标题长度应在5-100个字符之间', trigger: 'blur' }
  ],
  summary: [
    { required: true, message: '请输入文章描述', trigger: 'blur' },
    { min: 10, max: 500, message: '描述长度应在10-500个字符之间', trigger: 'blur' }
  ],
  contentMd: [
    { 
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入文章内容'));
          return;
        }
        if (value.length < 50) {
          callback(new Error('文章内容至少需要50个字符'));
          return;
        }
        const meaninglessPattern = /^[a-zA-Z]{10,}$/;
        if (meaninglessPattern.test(value)) {
          callback(new Error('文章内容似乎没有实际意义，请认真编写'));
          return;
        }
        callback();
      }, 
      trigger: ['blur', 'change'] 
    }
  ],
  cover: [
    { required: true, message: '请上传封面图片', trigger: 'change' }
  ],
  categoryId: [
    { required: true, message: '请选择文章分类', trigger: 'change' }
  ],
  tagList: [
    { required: true, message: '请选择文章标签', trigger: 'change' },
    { 
      validator: (rule, value, callback) => {
        value.length > 3 
          ? callback(new Error('最多只能选择3个标签')) 
          : callback()
      }, 
      trigger: 'change' 
    }
  ],
  originalUrl: [
    { required: true, message: '请输入原文地址', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL地址', trigger: 'blur' }
  ],
  isOriginal: [
    { 
      validator: (rule, value, callback) => {
        if (value === undefined || value === null) {
          callback(new Error('请选择文章类型'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  keywords: [
    { 
      validator: (rule, value, callback) => {
        value?.split(',').length > 5 
          ? callback(new Error('关键词最多不超过5个')) 
          : callback()
      }, 
      trigger: 'blur' 
    }
  ]
})

// 初始化数据
onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    fetchTags(),

  ])
  const draftId=route.query.draftId
  if(draftId){
    try{
        const data=await getArticleById(draftId)
        Object.assign(articleForm, {
        id: data.id,
        title: data.title,
        summary: data.summary,
        contentMd: data.contentMd,
        cover: data.cover,
        isOriginal: data.isOriginal,
        originalUrl: data.originalUrl,
        categoryId: data.categoryId,
        tagList: data.tagList,
        readTime: data.readTime
      })
    }catch(err){
        ElMessage.error('草稿加载失败')
    }
  }
 
})

// API 请求方法
const fetchCategories = async () => {
  const res = await getCategories()
  categories.value=res
}

const fetchTags = async () => {
  const res = await getTags()
  tags.value=res.flatMap(node=>node.children||[])
  
  }

 


// 业务逻辑方法
const saveDraft = async () => {
    loading.value=true
  if (isSubmitting.value) return
articleForm.contentHtml = mdRef.value.d_render

  const id=await draftArticleLast(1);
  articleForm.id=id
  try {
    await articleFormRef.value.validate()
    
    isSubmitting.value = true
    
    
    await draftArticle(articleForm)
    
    ElMessage.success('保存成功')
   
  } catch (error) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    loading.value=false
    isSubmitting.value = false
  }
 
}

const publishArticles = async () => {
const id=await draftArticleLast(1);
  articleForm.id=id
  await submitArticle()
}

const submitArticle = async () => {
  if (isSubmitting.value) return
  
  try {
    await articleFormRef.value.validate()
    
    isSubmitting.value = true
    articleForm.contentHtml = mdRef.value.d_render
    console.log(articleForm)
    await publishArticle(articleForm)
    
    ElMessage.success('保存成功')
    router.push('/article')
  } catch (error) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    isSubmitting.value = false
  }
}

// 图片处理方法
const imgAdd = async (pos, file) => {
  const formData = new FormData()
  formData.append("file", file)
  
  try {
    const res = await handleImg(formData)
    mdRef.value.$img2Url(pos, res.data)
  } catch (error) {
    ElMessage.error('图片上传失败')
  }
}

const imgDel = async (pos, file) => {
  try {
    await deleteFileApi(file)
    mdRef.value.$img2Url(pos, '')
  } catch (error) {
    ElMessage.error('图片删除失败')
  }
}

// 封面操作
const triggerCoverUpload = () => coverInput.value.click()

const handleCoverUpload = async (e) => {
  
  const file = e.target.files[0]
 
  if (!file) return

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type',0)
    
    const res = await handleImg(formData)

    articleForm.cover = res
    ElMessage.success('封面上传成功')
  } catch (error) {
    ElMessage.error('封面上传失败')
  } finally {
    e.target.value = ''
  }
}

const removeCover = () => articleForm.cover = ''
</script>

<style lang="scss" scoped>
.editor-header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 40px;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    z-index: 1000;
    margin-bottom: 24px;

    .header-icon{
        margin-right: 10px;
        padding:0 20px;
        height:25px;
    }

    .header-title {
        flex: 1;
        margin: 0;
        
        :deep(.el-form-item__content) {
            line-height: 1;
        }
    }

    .header-actions {
        margin-left: 24px;
        flex-shrink: 0;
        
        .el-button {
            margin-left: 12px;
            padding: 10px 20px;
            border-radius: 5px;
        }
    }
}

.title-input {
    :deep(.el-input__wrapper) {
        box-shadow: none !important;
        background: transparent;
        font-size: 18px;
        padding-left: 0;
        
        input {
            font-weight: 600;
            &::placeholder {
                color: #c0c4cc;
            }
        }
    }
}

.editor-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 !important;  // 移除原有padding
    
    .el-form {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
}

.flex-card {
    flex: 1;
    background: transparent;
    box-shadow: none;
    padding: 0 40px 40px;
    
    :deep(.v-note-wrapper) {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    span{
        position: relative;
        font-size:20px;
        top:-20px;
    }
}
.centered-layout {
    max-width: 1500px;
    margin: 0 auto;
    padding: 20px;
}

.title-section {
    margin-bottom: 24px;
}

.flex-card {
    margin-bottom: 24px;
}

.action-buttons {
    text-align: center;
    margin-top: 24px;
}
.editor-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(90deg,rgba(127, 215, 139,0.4),rgba(136, 212, 222,0.6),rgba(214, 167, 212,0.7));
}


.editor-main {
    flex: 1;
    max-width: 100vw;
    margin: 0 auto;
    padding: 24px 40px;
    width: 100%;

    .el-form {
        display: flex;
        gap: 24px;
    }
}

.editor-content {
    flex: 1;
    max-width: 75vw;

    .content-card {
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        padding: 24px;
        margin-bottom: 24px;

        &:last-child {
            margin-bottom: 0;
        }

        &.flex-card {
            flex: 1;
            display: flex;
            flex-direction: column;

            :deep(.el-form-item) {
                flex: 1;
                display: flex;
                flex-direction: column;
                margin-bottom: 0;

                .el-form-item__content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;

                    .el-textarea {
                        flex: 1;
                        display: flex;

                        textarea {
                            flex: 1;
                            resize: none;
                        }
                    }
                }
            }
        }
    }

    :deep(.el-form-item) {
        margin-bottom: 0;

        .el-form-item__label {
            padding-bottom: 12px;
            font-size: 13px;
            color: #999;
            font-weight: normal;
        }
    }

    .title-cover-layout {
        display: flex;
        gap: 24px;
        align-items: flex-start;

        .title-section {
            flex: 1;
        }

        .cover-section {
            width: 240px;
            flex-shrink: 0;
        }
    }

    .cover-area {
        width: 100%;
        height: 135px;
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
        position: relative;
        background: #ffffff;
        border: 1px dashed rgba(0,0,0,0.1);
        transition: all 0.15s;

        &:hover {
            border-color: #409EFF;
        }
    }

    .cover-placeholder {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #999;

        i {
            font-size: 24px;
        }

        span {
            font-size: 13px;
        }
    }

    .cover-preview {
        height: 100%;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .cover-actions {
            position: absolute;
            top: 12px;
            right: 12px;
            opacity: 0;
            transition: all 0.15s;
        }

        &:hover .cover-actions {
            opacity: 1;
        }
    }
}

.editor-sidebar {
    width: 320px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 24px;

    .sidebar-section {
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        padding: 24px;

        .section-title {
            font-size: 13px;
            font-weight: 500;
            color: #999;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 6px;

            i {
                font-size: 14px;
                color: #409EFF;
            }
        }

        .setting-item {
            padding: 12px 0;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);

            &:last-child {
                border-bottom: none;
                padding-bottom: 0;
            }

            &:first-child {
                padding-top: 0;
            }

            .setting-label {
                font-size: 13px;
                color: #999;
                margin-bottom: 8px;
            }

            .time{
                font-family: FangSong;
            }

            :deep(.el-form-item) {
                margin-bottom: 0;
            }
        }
    }
}

@media screen and (max-width: 1200px) {


    .editor-main {
        padding: 24px;

        .el-form {
            flex-direction: column;
        }
    }

    .editor-sidebar {
        width: 100%;
    }
}

@media screen and (max-width: 768px) {


    .editor-main {
        padding: 16px;

        .el-form {
            gap: 16px;
        }
    }

    .editor-content {
        .content-card {
            padding: 20px;
            margin-bottom: 16px;
        }

        .cover-area {
            height: 120px;
        }
    }

    .editor-sidebar {
        gap: 16px;

        .sidebar-section {
            padding: 20px;
        }
    }

    .title-cover-layout {
        flex-direction: column;
        gap: 16px;

        .cover-section {
            width: 100%;
        }
    }
}

.v-note-wrapper{
    background: #ffffff!important;
    color: var(--text-secondary)!important;
}
:deep(.content-input-wrapper){
    background: #ffffff!important;
    .auto-textarea-input,.no-border,.no-resize{
        color: var(--text-secondary)!important;
        background: #ffffff!important;
    }
}

</style>