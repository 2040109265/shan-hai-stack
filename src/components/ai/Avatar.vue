<template>
    <div class="avatar-wrapper">
      <img 
        v-if="src" 
        :src="src" 
        class="avatar-image" 
        :alt="isUser ? '用户头像' : 'AI头像'"
      >
      <div v-else class="default-avatar">
        {{ isUser ? 'U' : 'AI' }}
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    src: {
      type: String,
      default: ''
    },
    isUser: {
      type: Boolean,
      default: false
    }
  })
  </script>
  
  <style scoped>
  .avatar-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 12px;
    flex-shrink: 0;
  }
  
  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .default-avatar {
    width: 100%;
    height: 100%;
    background: #4e83fd;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
  }
  
  /* 可选：添加用户头像的特殊样式 */
  .default-avatar.user-avatar {
    background: #3d6bcc;
  }
  </style>