<template>
    <div 
      class="message-container"
      :class="{ 'user-message': isUser }"
    >
      <Avatar v-if="!isUser" />
      <div 
        class="message-content"
        :class="{ 'user-content': isUser }"
      >
        <div v-if="message.type === 'image' && message.fileUrl" class="file-preview">
          <img :src="message.fileUrl" :alt="message.content" class="image-preview" />
        </div>
  
        <div v-else-if="message.type === 'pdf' && message.fileUrl" class="file-preview">
          <a :href="message.fileUrl" target="_blank" rel="noopener noreferrer">
            查看PDF: {{ message.content }}
          </a>
        </div>
  
        <div v-else-if="isUser" class="user-text">
          {{ message.content }}
        </div>
  
        <div 
          v-else
          class="markdown-content"
          v-html="renderedContent"
          @click="handleContentClick"
        ></div>
      </div>
      <Avatar v-if="isUser" is-user />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import MarkdownIt from 'markdown-it'
  import Avatar from './Avatar.vue'
  
  const props = defineProps({
    message: {
      type: Object,
      required: true,
      validator(value) {
        return ['user', 'assistant'].includes(value.role) &&
          typeof value.content === 'string' &&
          (!value.type || ['text', 'image', 'pdf'].includes(value.type))
      }
    }
  })
  
  const copySuccess = ref('复制')
  const customMd = new MarkdownIt()
  const isUser = computed(() => props.message.role === 'user')
  
  const renderedContent = computed(() => {
    if (props.message.type || isUser.value) return ''
  
    return customMd.render(props.message.content).replace(/豆包呀/g, '紫云真人').replace(/机器人/g, '紫云真人')
  })
  
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      copySuccess.value = '已复制！'
      setTimeout(() => copySuccess.value = '复制', 2000)
    })
  }
  
  const handleContentClick = (event) => {
    const target = event.target.closest('.copy-button')
    if (target) {
      const code = target.dataset.code || ''
      handleCopyCode(code)
    }
  }
  </script>
  
  <style scoped>
  .message-container {
    display: flex;
    margin-bottom: 32px;
    align-items: flex-start;
  }
  
  .message-container.user-message {
    justify-content: flex-end;
  }
  
  .message-content {
    max-width: 70%;
    padding: 16px;
    border-radius: 12px;
    background: #f5f5f5;
    color: #1f1f1f;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    font-size: 14px;
    line-height: 1.6;
    margin: 0 12px;
    position: relative;
  }
  
  .message-content.user-content {
    background: #4e83fd;
    color: white;
  }
  
  .message-content::before {
    content: '';
    position: absolute;
    top: 16px;
    left: -16px;
    width: 15px;
    height: 15px;
    background-color: #f5f5f5;
    clip-path: polygon(100% 0, 25% 50%, 100% 100%);
  }
  
  .message-content.user-content::after {
    content: '';
    position: absolute;
    top: 16px;
    right: -15px;
    width: 15px;
    height: 15px;
    background-color: #4e83fd;
    clip-path: polygon(0 0, 75% 50%, 0 100%);
  }
  
  .file-preview {
    max-width: 300px;
    margin: 8px 0;
  }
  
  .image-preview {
    max-width: 100%;
    border-radius: 4px;
  }
  
  .markdown-content :deep(.code-block) {
    position: relative;
    margin: 16px 0;
    background: #1e1e1e;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .markdown-content :deep(pre) {
    margin: 0;
    padding: 16px;
    overflow-x: auto;
    background: transparent;
  }
  
  .markdown-content :deep(code) {
    color: #d4d4d4;
    font-family: 'Fira Code', monospace;
  }
  
  .markdown-content :deep(.copy-button) {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 4px 8px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    color: #d4d4d4;
    font-family: Arial, sans-serif;
    transition: all 0.2s;
  }
  
  .markdown-content :deep(.copy-button:hover) {
    background: rgba(255, 255, 255, 0.2);
  }
  </style>