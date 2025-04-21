<!-- ChatWindow.vue -->
<template>
    <div class="chat-container">
      <div class="message-list" ref="messageListRef">
        <MessageItem
          v-for="(message, index) in messagesState"
          :key="index"
          :message="message"
        />
        <div v-if="followUps.length" class="follow-up-container">
          <button
            v-for="item in followUps"
            :key="item.id"
            class="follow-up-bubble"
            @click="handleFollowUp(item)"
          >
            {{ item.content }}
          </button>
        </div>
      </div>
      <div class="status-bar">
        <div v-if="ChatStatus === 'in_progress'" class="loading-indicator">
          <span class="spinner">⏳</span> 正在生成回复...
        </div>
        <div v-if="ChatStatus === 'failed'" class="error-indicator">
          <span class="error-icon">❌</span>
          请求失败：{{ errorInfo?.msg || '未知错误' }}
          <button @click="retrySubmit">重试</button>
        </div>
      </div>
      <div class="input-area">
        <div class="input-wrapper">
          <FileUpload @file-select="handleFileSelect" />
          <textarea
            v-model="input"
            @keyup.enter="handleSubmit"
            :disabled="isStreaming"
            placeholder="输入您的问题..."
          ></textarea>
          <button class="send-btn" @click="handleSubmit" :disabled="isStreaming">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue'
  import MarkdownIt from 'markdown-it'
  import MessageItem from './MessageItem.vue'
  import { ChatStatus } from '@coze/api'

  
  const props = defineProps({
    messages: {
      type: Array,
      required: true
    }
  })
  
  const emit = defineEmits(['messages-update'])
  
  const messagesState = ref([...props.messages])
  const input = ref('')
  const isStreaming = ref(false)
  const followUps = ref([])
  const messageListRef = ref(null)
  
  watch(() => props.messages, (newVal) => {
    messagesState.value = [...newVal]
  })
  
  const filterContent = (content) => {
    return content
      .replace(/豆包呀/g, "紫云真人")
      .replace(/机器人/g, "紫云真人")
  }
  
  const retrySubmit = () => {
  if (input.value.trim()) {
    handleSubmit()
  }
}

  const handleSubmit = async () => {
    let context=input.value
    if(!input.value.trim()&&!hasFiles){
      alert('输入内容不能为空');
      return;
    }
  
    const userMessage = { role: 'user', content: input.value }
    const newMessages = [...messagesState.value, userMessage]
    messagesState.value = newMessages
    emit('messages-update', newMessages)
    input.value = ''
    isStreaming.value = true
  
    try {

      const response = await fetch('https://api.coze.cn/v3/chat', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer pat_A7W6hPhAmTVZ6nBzfYSrYJzHE8HCMamyk1JxDGxUhYiddljf5sbXpafxH1Ekhmpd',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bot_id: "7475374859183456256",
          user_id: '123',
          stream: true,
          auto_save_history: true,
          additional_messages: [{
            role: 'user',
            type:'question',
            content: context,
            content_type:'text'
          }]
        })
      })
     

      const decoder = new TextDecoder()
      
      const reader = response.body?.getReader()
   
      let assistantMessage = { role: 'assistant', content: '' }
  
      while(true) {
        const { done, value } = await reader.read()
        if (done) break
  
        const text = decoder.decode(value)
        const events = text.split('\n\n').filter(Boolean)
       
        for (const event of events) {
          console.log(event)
          if(event.includes('conversation.message.completed')){
            
            const data = JSON.parse(event.split('data:')[1])
            if(data.type === 'follow_up'){
              followUps.value = [
                ...followUps.value,
                {
                  content: data.content,
                  id: data.id
                }
              ]
            }
          }
          if (event.startsWith('event:conversation.message.delta')) {
            try {
              const dataStr = event.split('data:')[1]
              const data = JSON.parse(dataStr)
              
              if (data.content && data.type === 'answer') {
                assistantMessage.content += data.content
                const updatedMessages = [...newMessages, { 
                  ...assistantMessage,
                  content: filterContent(assistantMessage.content)
                }]
                messagesState.value = updatedMessages
                emit('messages-update', updatedMessages)
              }
            } catch (e) {
              console.error('解析事件数据失败:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      isStreaming.value = false
    }
  }
  
  const handleFileSelect = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const fileUrl = URL.createObjectURL(file)
      const fileType = file.type.startsWith('image/') ? 'image' : 'pdf'
      
      const message = {
        role: 'user',
        content: file.name,
        type: fileType,
        fileUrl
      }
      
      messagesState.value = [...messagesState.value, message]
    } catch (error) {
      console.error('File upload failed:', error)
    }
  }
  
  const handleFollowUp = (item) => {
    input.value = item.content
    handleSubmit()
    followUps.value = []
  }
  
  onMounted(() => {
    watch(messagesState, () => {
      if (messageListRef.value) {
        messageListRef.value.scrollTop = messageListRef.value.scrollHeight
      }
    }, { deep: true })
  })
  </script>
  
  <style scoped>
  .chat-container {
    scrollbar-width: none;
    display: flex;
    flex-direction: column;
    height: 99%;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
  
  .message-list {
    scrollbar-width: none;
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    scroll-behavior: smooth;
  }
  
  .input-area {
    padding: 24px 200px;
    background: #fff;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    position: relative;
  }
  
  .input-wrapper {
    position: relative;
    display: flex;
    align-items: flex-end;
    gap: 12px;
  }
  
  textarea {
    flex: 1;
    padding: 12px 16px;
    padding-right: 48px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    resize: none;
    font-size: 14px;
    line-height: 1.5;
    min-height: 48px;
    max-height: 200px;
    transition: all 0.3s;
  }
  
  textarea:focus {
    outline: none;
    border-color: #4e83fd;
    box-shadow: 0 0 0 2px rgba(78, 131, 253, 0.1);
  }
  
  .follow-up-container {
    padding: 16px;
    background: white;
    margin-top: -40px;
    margin-left: 80px;
    display: flex;
    flex-direction: column;
    max-width: 333px;
  }
  
  .follow-up-bubble {
    display: inline-block;
    margin: 4px;
    padding: 8px 16px;
    background: #fff;
    border: 1px solid white;
    border-radius: 20px;
    color: #4e83fd;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .follow-up-bubble:hover {
    background: linear-gradient(to right, orange, pink);
    color: white;
  }
  
  .send-btn {
    position: absolute;
    right: 12px;
    bottom: 12px;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    cursor: pointer;
    color: #4e83fd;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  
  .send-btn:hover {
    transform: scale(1.1);
  }
  
  .send-btn svg {
    width: 20px;
    height: 20px;
  }
  .status-bar {
    padding: 8px 20px;
    min-height: 40px;
  }
  
  .loading-indicator {
    color: #666;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .error-indicator {
    color: #dc3545;
    background: #f8d7da;
    padding: 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .error-indicator button {
    margin-left: auto;
    padding: 4px 8px;
    background: #fff;
    border: 1px solid #dc3545;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>