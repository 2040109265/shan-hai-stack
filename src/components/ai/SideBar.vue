<!-- components/Sidebar.vue -->
<template>
    <div class="sidebar-container">
      <button class="new-chat-btn" @click="$emit('new-chat')">+ 新建对话</button>
      <div class="chat-list">
        <div
          v-for="chat in conversations"
          :key="chat.id"
          class="chat-item"
          :class="{ active: chat.id === activeId }"
          @click="$emit('select-chat', chat.id)"
        >
          {{ chat.title || '新对话' }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    conversations: Array,
    activeId: String
  })
  
  defineEmits(['new-chat', 'select-chat'])
  </script>
  
  <style scoped>
 
  .sidebar-container {
    width: 260px;
    background: linear-gradient(45deg,#8fc88e,#7bc7de);
    padding: 20px;
    color: white;
    display: flex;
    flex-direction: column;
    position: sticky;
    left: 0;
    top: 0;
  
  }
  
  .new-chat-btn {
    padding: 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid white;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    margin-bottom: 24px;
  }
  
  .chat-list {
    flex: 1;
    overflow-y: auto;
  }
  
  .chat-item {
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 8px;
    border:1px solid white;
  }
  
  .chat-item.active {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .chat-item:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  </style>