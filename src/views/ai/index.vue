
<template>
    <HeaderBar/>
    <div class="app-container">
      <Sidebar
        :conversations="conversations"
        :active-id="activeId"
        @new-chat="handleNewChat"
        @select-chat="setActiveId"
      />
      <main class="main-content">
        <ChatWindow
          v-if="activeConversation"
          :messages="activeConversation.messages"
          @messages-update="handleMessageUpdate"
        />
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { v4 as uuidv4 } from 'uuid'
  import Sidebar from '@/components/ai/SideBar.vue'
  import ChatWindow from '@/components/ai/ChatWindow.vue'
  import HeaderBar from '@/layouts/headerBar/index.vue'
  
  const conversations = ref([
    {
      id: uuidv4(),
      title: '新对话',
      messages: [
        {
          role: 'assistant',
          content: '你好，我是紫云真人，测星座算命运，驱鬼镇邪，斩妖除魔，无所不知，无所不晓，窥探天机，尽管来问！'
        }
      ]
    }
  ])
  
  const activeId = ref(conversations.value[0].id)
  
  const activeConversation = computed(() => 
    conversations.value.find(conv => conv.id === activeId.value)
  )
  
  const handleNewChat = () => {
    const newChat = {
      id: uuidv4(),
      title: '新对话',
      messages: [
        {
          role: 'assistant',
          content: '有完没完，算命不给钱还改天又来算？'
        }
      ]
    }
    conversations.value = [...conversations.value, newChat]
    activeId.value = newChat.id
  }
  
  const handleMessageUpdate = (messages) => {
    conversations.value = conversations.value.map(conv => 
      conv.id === activeId.value
        ? { ...conv, messages, title: messages[0]?.content.slice(0, 20) || '新对话' }
        : conv
    )
  }
  
  const setActiveId = (id) => {
    activeId.value = id
  }
  </script>
  
  <style scoped>
  .app-container {
    display: flex;
    height:96vh;
    overflow: hidden;
    background: #f0f6ff;
    
  }
  
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    
  }
  </style>