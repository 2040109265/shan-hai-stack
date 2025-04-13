<template>
    <div class="comment-section">
      <!-- 评论输入框 -->
      <div class="comment-editor">
        <div class="editor-header">
          <img :src="userAvatar" :alt="userName" />
          <div class="user-info">
            <span class="user-name">{{ userName }}</span>
            <span class="tip">支持 Markdown 格式</span>
          </div>
        </div>
        <div class="editor-content">
          <textarea v-model="commentContent" placeholder="写下你的评论... (支持 Markdown 格式)" :rows="6" ref="commentTextarea"
            maxlength="50"></textarea>
          <div class="editor-footer">
            <div class="editor-tools" >
              <v3-emoji @click-emoji="insertEmoji"  :recent="true" size="small" fix-pos="auto"
              />
             
             
              <el-button class="tool-btn" @click="insertMarkdown('**', '**')" title="加粗">
                <i class="fas fa-bold"></i>
              </el-button>
              <el-button class="tool-btn" @click="insertMarkdown('`', '`')" title="行内代码">
                <i class="fas fa-code"></i>
              </el-button>
              <el-button class="tool-btn" @click="insertMarkdown('\n```\n', '\n```')" title="代码块">
                <i class="fas fa-file-code"></i>
              </el-button>
              <el-button class="tool-btn" @click="insertMarkdown('> ', '')" title="引用">
                <i class="fas fa-quote-right"></i>
              </el-button>
            </div>
            <button class="submit-btn" :disabled="!commentContent.trim() || !canComment" @click="submitComment">
              {{ canComment ? '发表评论' : `${countdown}秒后可评论` }}
            </button>
          </div>
        </div>
      </div>
  
      <!-- 评论列表 -->
      <div class="comments-list">
        <div class="list-header">
          <h3>
            全部评论 <span>({{ commentCount }})</span>
          </h3>
          <div class="sort-options">
            <button class="sort-btn" :class="{ active: sortBy === 'newest' }" @click="sortBy = 'newest'">
              最新
            </button>
            <button class="sort-btn" :class="{ active: sortBy === 'hottest' }" @click="sortBy = 'hottest'">
              最热
            </button>
          </div>
        </div>
  
        <template v-if="sortedComments.length">
          <div v-for="comment in sortedComments" :key="comment.id" :id="`comment-${comment.id}`" class="comment-item">
            <div class="comment-avatar">
              <img :src="comment.avatar" :alt="comment.nickname" />
            </div>
            <div class="comment-content">
              <div class="comment-header">
                <div class="comment-info">
                  <span class="nickname">{{ comment.nickname }}</span>
                  <span class="author-tag" v-if="comment.userId === articleAuthorId">作者</span>
                  <span class="ipSource">
                    IP属地:{{ formatIpSource(comment.ipSource) }}
                  </span>
                  <span class="time">{{ formatTime(comment.createTime) }}</span>
                </div>
                <div class="comment-actions">
                  <button class="action-btn" @click="replyTo(comment)">
                    <i class="far fa-comment"></i>
                    <span>回复</span>
                  </button>
                </div>
              </div>
              <div class="comment-text markdown-body" v-html="parseComment(comment.content)"></div>
  
              <!-- 回复列表 -->
              <div v-if="comment.children?.length" class="replies-list">
                <div v-for="reply in comment.children" :key="reply.id" class="reply-item">
                  <div class="reply-avatar">
                    <img :src="reply.avatar" :alt="reply.nickname" />
                  </div>
                  <div class="reply-content">
                    <div class="reply-header">
                      <div class="reply-info">
                        <span class="nickname">{{ reply.nickname }}</span>
                        <span class="author-tag" v-if="reply.userId === articleAuthorId">作者</span>
                        <span class="reply-to">
                          回复
                          <span class="target">@{{ reply.replyNickname }}</span>
                        </span>
                        <span class="ipSource">
                          IP属地:{{ formatIpSource(reply.ipSource) }}
                        </span>
                        <span class="time">{{
                          formatTime(reply.createTime)
                        }}</span>
                      </div>
                      <div class="comment-actions">
                        <button class="action-btn" @click="handleReplyChild(reply)">
                          <i class="far fa-comment"></i>
                          <span>回复</span>
                        </button>
                      </div>
                    </div>
                    <div class="reply-text markdown-body" v-html="parseComment(reply.content)"></div>
  
                    <!-- 添加子评论的回复框 -->
                    <div class="reply-box" v-if="showReplyBox && activeReplyId === reply.id">
                      <textarea v-model="childReplyContent" :placeholder="`回复 @${reply.nickname}`" rows="3"
                        ref="childReplyTextarea" maxlength="50" class="reply-textarea"></textarea>
                      <div class="editor-footer">
                        <div class="editor-tools">
                          <v3-emoji @click-emoji="insertChildReplyEmoji" :recent="true" size="small" fix-pos="auto"/>
                          <button class="tool-btn" @click="insertChildReplyMarkdown('**', '**')" title="加粗">
                            <i class="fas fa-bold"></i>
                          </button>
                          <button class="tool-btn" @click="insertChildReplyMarkdown('`', '`')" title="行内代码">
                            <i class="fas fa-code"></i>
                          </button>
                          <button class="tool-btn" @click="insertChildReplyMarkdown('\n```\n', '\n```')" title="代码块">
                            <i class="fas fa-file-code"></i>
                          </button>
                          <button class="tool-btn" @click="insertChildReplyMarkdown('> ', '')" title="引用">
                            <i class="fas fa-quote-right"></i>
                          </button>
                        </div>
                        <div class="reply-actions">
                          <button class="cancel-btn" @click="cancelReply">
                            取消
                          </button>
                          <button class="submit-btn" :disabled="!childReplyContent.trim()" @click="submitChildReply(reply,comment)">
                            回复
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- 回复框 -->
              <div v-if="replyingTo === comment.id" class="reply-editor">
                <textarea v-model="replyContent" :placeholder="`回复 @${comment.nickname}`" rows="3" ref="replyTextarea"
                  maxlength="50"></textarea>
                <div class="editor-footer">
                  <div class="editor-tools">
                    <v3-emoji @click-emoji="insertReplyEmoji" :recent="true" size="small" fix-pos="auto"/>
                  
                    <button class="tool-btn" @click="insertReplyMarkdown('**', '**')" title="加粗">
                      <i class="fas fa-bold"></i>
                    </button>
                    <button class="tool-btn" @click="insertReplyMarkdown('`', '`')" title="行内代码">
                      <i class="fas fa-code"></i>
                    </button>
                    <button class="tool-btn" @click="insertReplyMarkdown('\n```\n', '\n```')" title="代码块">
                      <i class="fas fa-file-code"></i>
                    </button>
                    <button class="tool-btn" @click="insertReplyMarkdown('> ', '')" title="引用">
                      <i class="fas fa-quote-right"></i>
                    </button>
                  </div>
                  <div class="reply-actions">
                    <button class="cancel-btn" @click="cancelReply">取消</button>
                    <button class="submit-btn" :disabled="!replyContent.trim() || !canComment"
                      @click="submitReply(comment)">
                      {{ canComment ? '回复' : `${countdown}秒后可评论` }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pagination-box">
            <el-pagination background v-if="total" @current-change="handlePageChange" :current-page="queryParams.current"
            :page-size="queryParams.size" layout="prev, pager, next" :total="total">
          </el-pagination>
          </div>
      
        </template>
        <div v-else class="empty-state">
          <i class="far fa-comments"></i>
          <p>暂无评论，快来抢吧~</p>
        </div>
      </div>
    </div>
  </template>
  

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { getCommentsApi, addCommentApi } from '@/api/article'
import { getBrowserInfo } from '@/utils/browser'
import { useAuthStore } from '@/store'
import V3Emoji from 'vue3-emoji'
import 'vue3-emoji/dist/style.css'

import JSONBig from 'json-bigint'
const JSONbigString =JSONBig({storeAsString:true})




let props = defineProps({
  articleId: {
    type: [BigInt],
    required:true
  },
  commentCount: {
    type: Number,
    default: 0
  },
  articleAuthorId: {
    type: [BigInt],
    default: ""
  }
})
// 用户存储
const userStore = useAuthStore()


// 响应式数据
let commentContent = ref("")
let replyContent = ref("")
let replyingTo = ref(null)
let comments = ref([])
let sortBy = ref('newest')
let showReplyBox = ref(false)
let activeReplyId = ref(null)
let total = ref(1)
let countdown = ref(0)
let canComment = ref(true)
let browserInfo=ref()

const queryParams = reactive({
  current:1,
  size: 10,
 
})


// DOM 引用
const commentTextarea = ref(null)
const replyTextarea = ref(null)
const childReplyTextarea = ref(null)
const childReplyContent=ref("")

// 计算属性
const userAvatar = computed(() => {
  return userStore.userInfo?.avatar|| userStore.touristAvatar
})

const userName = computed(() => 
  userStore.userInfo?.nickname || '游客'
)

const sortedComments = computed(() => {
  return [...comments.value].sort((a, b) => {
    return sortBy.value === 'newest' 
      ? new Date(b.createTime) - new Date(a.createTime)
      : b.likeCount - a.likeCount
  })
})

const replyTo=(comment)=>{
  showReplyBox.value=false;
  activeReplyId.value=null;
  replyingTo.value=comment.id;
  replyContent.value=""
}
const cancelReply=()=>{
  replyingTo.value=null;
  showReplyBox.value=false;
  activeReplyId.value=null;
  replyContent.value=""
}
const resetReplyState = () => {
  childReplyContent.value = ""
  replyingTo.value = null
  showReplyBox.value = false
  activeReplyId.value = null
  startCoolDown()
}



 const handleReplyChild=(reply)=>{
  if(!userStore.isLoggedIn){
    MessageChannel.error("请先登录")
    return;
  }
  replyingTo.value=null
  showReplyBox.value=true
  activeReplyId.value=reply.id
  replyContent.value=""
 }


// 方法
const handlePageChange = (page) => {
  queryParams.pageNum = page
  getComments()
}

const getComments = async () => {
  try {
    console.log(props.articleId)
    const  data  = await getCommentsApi({
      articleId: BigInt(props.articleId),
      params:{
        current: queryParams.current,
        size: queryParams.size,
        
      }
    
    })
    
    comments.value = data.records.map(comment => ({
      ...comment,
      children: formatNestedComments(comment.children) || []
    }))
    
    total.value = parseInt(data.total)
    highlightCode()
  } catch (error) {
    ElMessage.error("获取评论失败")
    console.log(error)
  }
}

const formatNestedComments=(children)=>{
  return children.map(child=>({
    ...child,
    children:formatNestedComments(child.children||[])
  }))
}
// 新增: 通用文本插入方法
const insertText = (contentRef, prefix, suffix, textareaRef) => {
  const textarea = textareaRef?.value
  const start = textarea?.selectionStart || 0
  const end = textarea?.selectionEnd || 0
  
  contentRef.value = 
    contentRef.value.slice(0, start) +
    prefix +
    contentRef.value.slice(start, end) +
    suffix +
    contentRef.value.slice(end)

  nextTick(() => {
    const newStart=start + prefix.length+ (end - start) + suffix.length;
    textarea.setSelectionRange(newStart,newStart)
    textarea.focus()
  })
}


const insertEmoji = (emoji) => {
 
  insertText(commentContent,emoji,'',commentTextarea);
}

// 主评论
const insertMarkdown = (prefix, suffix) => {
  insertText(commentContent, prefix, suffix, commentTextarea);
};

// 回复框
const insertReplyMarkdown = (prefix, suffix) => {
  insertText(replyContent, prefix, suffix, replyTextarea);
};

// 子回复框
const insertChildReplyMarkdown = (prefix, suffix) => {
   insertText(childReplyContent, prefix, suffix, childReplyTextarea);
};

// 回复插入方法
const insertReplyEmoji = (emoji) => {
  insertText(replyContent, emoji, '', replyTextarea);
}
// 子回复插入方法
const insertChildReplyEmoji = (emoji) => {
  insertText(childReplyContent, emoji, '', childReplyTextarea);
}


const isEmptyContent = (content) => {
  const clean = content
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/```/g, '')
    .replace(/>/g, '')
    .trim()
  return !clean
}
// 配置 marked
marked.setOptions({
  highlight: (code, lang) => {
    return hljs.highlightAuto(code).value
  },
  breaks: true
})
// 提交主评论
const submitComment = async () => {
  if (!validateComment(commentContent.value)) return

  try {
    const commentData={
        articleId: props.articleId,
      userId:userStore.userInfo.id,
      content:commentContent.value,
     
    }
    const stringifiedData=JSONbigString.stringify(commentData);
    await addCommentApi(stringifiedData,props.articleId)

    ElMessage.success("评论成功")
    commentContent.value = ""
    startCoolDown()
    await getComments()
    scrollToFirstComment()
  } catch (error) {
    handleError(error, '评论')
  }
}

// 提交回复
const submitReply = async (comment) => {
  if (!validateComment(replyContent.value)) return

  try {
    
    const commentData={
      articleId: props.articleId,
      content: replyContent.value,
      parentId: comment.id,
      replyUserId: comment.userId,
      userId:userStore.userInfo.id
    }
    console.log("一级，",commentData)
    const stringifiedData=JSONbigString.stringify(commentData);
    await addCommentApi(stringifiedData,props.articleId)

    ElMessage.success("回复成功")
    resetReplyState()
    await getComments()
    scrollToReply(comment.id)
  } catch (error) {
    handleError(error, '回复')
  }
}

// 提交子回复
const submitChildReply = async (reply,comment) => {
  if (!validateComment(childReplyContent.value)) return

  try {
    const commentData={
      articleId: props.articleId,
      content: childReplyContent.value,
      parentId: comment.id,
      replyUserId: reply.userId,
      userId:userStore.userInfo.id
    }
    console.log("子级，",commentData)
    const stringifiedData=JSONbigString.stringify(commentData);
    await addCommentApi(stringifiedData,props.articleId)

    ElMessage.success("回复成功")
    resetReplyState()
    await getComments()
  } catch (error) {
    handleError(error, '回复')
  }
}

// 通用验证方法
const validateComment = (content) => {
  if (!content.trim() || !canComment.value) return false
  if (isEmptyContent(content)) {
    ElMessage.warning('内容不能为空')
    return false
  }
  if (!userStore.isLoggedIn) {
    ElMessage.error('请先登录')
    return false
  }
  return true
}



// 倒计时逻辑
const startCoolDown = () => {
  canComment.value = false
  countdown.value = 5
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      canComment.value = true
    }
  }, 1000)
}

// 错误处理
const handleError = (error, action = '操作') => {
  console.error(`${action}失败:`, error)
  ElMessage.error(`${action}失败: ${error.message || '请稍后重试'}`)
}

// 滚动控制
const scrollToFirstComment = () => {
  nextTick(() => {
    const firstComment = document.querySelector(".comment-item")
    firstComment?.scrollIntoView({ behavior: "smooth", block: "center" })
  })
}

const scrollToReply = (commentId) => {
  nextTick(() => {
    const lastReply = document.querySelector(
      `#comment-${commentId} .reply-item:last-child`
    )
    lastReply?.scrollIntoView({ behavior: "smooth", block: "center" })
  })
}

// 其他工具方法
const parseComment = (content) => marked(content || "")

const formatTime = (time) => time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '-'

const formatIpSource = (ipSource) => ipSource?.split("|")[1] || "未知"

const highlightCode = () => {
  nextTick(() => {
    document.querySelectorAll('.comment-content pre code').forEach(block => {
      hljs.highlightElement(block)
    })
  })
}

onMounted(() => {
  getComments()
  browserInfo.value = getBrowserInfo()
})
</script>

  
  <style lang="scss" scoped>
  .comment-section {
    margin-top: 32px;
  }
  
  .comment-editor {
    background: #fff;
    overflow: hidden;
    border: 1px solid rgba(101, 185, 57, 0.7);
  
    .editor-header {
      padding: 16px 24px;
      font-family:KaiTi;
      display: flex;
      align-items: center;
      gap: 16px;
      border-bottom: 1px solid rgba(101, 185, 57, 0.7);
  
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }
  
      .user-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
  
        .user-name {
          color: #1f2937;
          font-weight: 500;
        }
  
        .tip {
          color: #666;
          font-size: 0.9em;
        }
      }
    }
  
    .editor-content {
      padding: 24px;
      min-height:240px;
  
      textarea {
        width: 100%;
        resize: vertical;
        min-height: 120px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        background: #fff;
        color: #1f2937;
        padding: 16px;
        border-radius: 8px;
        font-size: 1em;
        line-height: 1.6;
        transition: all 0.3s ease;
  
        &:focus {
          outline: none;
          border-color: #0aad12;
          box-shadow: 0 0 0 3px rgba(#0aad12, 0.1);
        }
  
        &::placeholder {
          color: #666;
        }
      }
  
      .editor-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 24px;
  
        .editor-tools {
          display: flex;
          gap: 4px;
          position: relative;
  
          .tool-btn {
            padding: 4px 8px;
            border: none;
            background: none;
            color: #666;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 4px;
  
            &:hover {
              color: #0aad12;
              background: rgba(#0aad12, 0.1);
            }
          }
        }
  
        .submit-btn {
          padding: 8px 32px;
          background: #0aad12;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
  
          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
  
          &:not(:disabled):hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(#0aad12, 0.2);
          }
        }
      }
    }
  }
  
  .comments-list {
    margin-top: 32px;
  
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding: 0 16px;
  
      h3 {
        color: #1f2937;
        font-size: 1.2em;
        font-weight: 500;
  
        span {
          color: #666;
          font-size: 0.9em;
        }
      }
  
      .sort-options {
        display: flex;
        gap: 8px;
  
        .sort-btn {
          padding: 4px 16px;
          border: none;
          background: none;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 4px;
  
          &.active {
            color: #0aad12;
            background: rgba(#0aad12, 0.1);
          }
  
          &:hover:not(.active) {
            color: #0aad12;
          }
        }
      }
    }
  
    .comment-item {
      display: flex;
      gap: 24px;
      padding: 24px;
      border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
  
      &:last-child {
        border-bottom: none;
      }
  
      // 添加作者标签样式
      .author-tag {
        display: inline-block;
        padding: 2px 6px;
        font-size: 12px;
        line-height: 1.2;
        color: #0aad12;
        background: rgba(#0aad12, 0.1);
        border: 1px solid rgba(#0aad12, 0.2);
        border-radius: 4px;
        margin: 0 4px;
      }
  
      .comment-avatar {
        flex-shrink: 0;
  
        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          object-fit: cover;
        }
      }
  
      .comment-content {
        flex: 1;
        min-width: 0;
  
        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
  
          .comment-info {
            display: flex;
            align-items: center;
            gap: 8px;
  
            .nickname {
              color: #1f2937;
              font-weight: 500;
              font-family: KaiTi;
              margin-right: 10px;
            }
  
            .time {
              color: #666;
              font-size: 0.9em;
              font-family: FangSong;
            }
  
            .ipSource {
              color: #87be8d;
              font-size: 0.9em;
              margin-right: 10px;
            }
          }
  
          .comment-actions {
            display: flex;
            gap: 16px;
  
            .action-btn {
              display: flex;
              align-items: center;
              gap: 4px;
              padding: 4px 8px;
              border: none;
              background: none;
              color: #666;
              cursor: pointer;
              transition: all 0.3s ease;
              font-size: 0.9em;
  
              i {
                transition: all 0.3s ease;
              }
  
              &:hover {
                color: #0aad12;
              }
  
              .fa-heart {
                color: #ff4757;
              }
            }
          }
        }
  
        .comment-text {
          color: #1f2937;
          line-height: 1.6;
          margin-bottom: 16px;
        }
      }
    }
  
    .replies-list {
      margin-left: 32px;
      margin-top: 16px;
      padding-left: 24px;
      border-left: 2px solid rgba(0, 0, 0, 0.1);
  
      .reply-item {
        display: flex;
        gap: 16px;
        padding: 16px 0;
  
        .reply-avatar {
          flex-shrink: 0;
  
          img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
          }
        }
  
        .reply-content {
          flex: 1;
          min-width: 0;
  
          .reply-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
  
            .reply-info {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 0.95em;
  
              .nickname {
                color: #1f2937;
                font-weight: 500;
              }
  
              .reply-to {
                color: #666;
  
                .target {
                  color: #0aad12;
                }
              }
  
              .time {
                color: #666;
                font-size: 0.9em;
              }
  
              .ipSource {
                color: #666;
                font-size: 0.9em;
              }
            }
  
            .comment-actions {
              .action-btn {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 4px 8px;
                border: none;
                background: none;
                color: #666;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9em;
  
                &:hover {
                  color: #0aad12;
                }
  
                i {
                  font-size: 14px;
                }
              }
            }
          }
  
          .reply-text {
            color: #1f2937;
            font-size: 0.95em;
            line-height: 1.6;
          }
        }
      }
    }
  
    .reply-editor {
      margin-top: 16px;
      background: rgba(#0aad12, 0.1);
      border-radius: 10px;
      padding: 16px;
  
      textarea {
        width: 97%;
        resize: vertical;
        min-height: 100px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        background: #fff;
        color: #1f2937;
        padding: 16px;
        border-radius: 8px;
        font-size: 0.95em;
        line-height: 1.6;
        transition: all 0.3s ease;
  
        &:focus {
          outline: none;
          border-color: #0aad12;
          box-shadow: 0 0 0 3px rgba(#0aad12, 0.1);
        }
  
        &::placeholder {
          color: #666;
        }
      }
  
      .editor-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16px;
  
        .editor-tools {
          display: flex;
          gap: 4px;
  
          .tool-btn {
            padding: 4px 8px;
            border: none;
            background: none;
            color: #666;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 4px;
  
            &:hover {
              color: #0aad12;
              background: rgba(#0aad12, 0.1);
            }
          }
        }
  
        .reply-actions {
          display: flex;
          gap: 8px;
  
          button {
            padding: 4px 24px;
            border: none;
            border-radius: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9em;
  
            &.cancel-btn {
              background: none;
              color: #666;
              border: 1px solid rgba(0, 0, 0, 0.1);
  
              &:hover {
                color: #0aad12;
                border-color: #0aad12;
              }
            }
  
            &.submit-btn {
              background: #0aad12;
              color: white;
  
              &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
              }
  
              &:not(:disabled):hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(#0aad12, 0.2);
              }
            }
          }
        }
      }
    }
    .pagination-box{
      display: flex;
      justify-content: center;
    }
  
    .empty-state {
      text-align: center;
      padding: 32px * 2;
      color: #666;
  
      i {
        font-size: 3em;
        margin-bottom: 16px;
        color: #0aad12;
        opacity: 0.8;
      }
  
      p {
        font-size: 1.1em;
      }
    }
  }
  
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
  
  .reply-btn {
    color: #409eff;
    cursor: pointer;
    margin-left: 10px;
    font-size: 12px;
  }
  
  .reply-btn:hover {
    color: #66b1ff;
  }
  
  .reply-box {
    margin: 10px 0;
    background: rgba(#0aad12, 0.1);
    border-radius: 10px;
    padding: 16px;
  
    .reply-textarea {
      width: 96%;
      resize: vertical;
      min-height: 80px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      background: #fff;
      color: #1f2937;
      padding: 16px;
      border-radius: 8px;
      font-size: 0.95em;
      line-height: 1.6;
      transition: all 0.3s ease;
  
      &:focus {
        outline: none;
        border-color: #0aad12;
        box-shadow: 0 0 0 3px rgba(#0aad12, 0.1);
      }
  
      &::placeholder {
        color: #666;
      }
    }
  
    .editor-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
  
      .editor-tools {
        display: flex;
        gap: 4px;
  
        .tool-btn {
          padding: 4px 8px;
          border: none;
          background: none;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 4px;
  
          &:hover {
            color: #0aad12;
            background: rgba(#0aad12, 0.1);
          }
        }
      }
  
      .reply-actions {
        display: flex;
        gap: 8px;
  
        button {
          padding: 4px 24px;
          border: none;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9em;
  
          &.cancel-btn {
            background: none;
            color: #666;
            border: 1px solid rgba(0, 0, 0, 0.1);
  
            &:hover {
              color: #0aad12;
              border-color: #0aad12;
            }
          }
  
          &.submit-btn {
            background: #0aad12;
            color: white;
  
            &:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }
  
            &:not(:disabled):hover {
              transform: translateY(-1px);
              box-shadow: 0 2px 8px rgba(#0aad12, 0.2);
            }
          }
        }
      }
    }
  }
  
  .emoji-container {
    position: absolute;
    bottom: 100%;
    left: 0;
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    margin-bottom: 8px;
  }
  
  .emoji-wrapper {
    width: 360px;
    height: 300px;
    /* 固定高度 */
    overflow-y: auto;
    /* 内容超出时显示滚动条 */
    padding: 8px;
  }
  
  .emoji-category {
    margin-bottom: 12px;
  }
  
  .emoji-category-title {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
    padding-left: 4px;
  }
  
  .emoji-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .emoji-item {
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
    font-size: 20px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .emoji-item:hover {
    background-color: #f0f0f0;
  }
  
  /* 自定义滚动条样式 */
  .emoji-wrapper::-webkit-scrollbar {
    width: 6px;
  }
  
  .emoji-wrapper::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
  
  .emoji-wrapper::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  .comment-text,
  .reply-text {
    color: #1f2937;
    line-height: 1.6;
  
    :deep(img) {
      // 使用 :deep 来处理 v-html 渲染的内容
      max-width: 200px;
      max-height: 150px;
      object-fit: cover;
      border-radius: 4px;
      vertical-align: middle;
    }
  }
  </style>
  