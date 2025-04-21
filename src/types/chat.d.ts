declare module '@/types/chat' {
    export interface Message {
      role: 'user' | 'assistant'
      content: string
      type?: 'text' | 'image' | 'pdf'
      fileUrl?: string
    }
    
    export interface Conversation {
      id: string
      title: string
      messages: Message[]
    }
    
    export interface FollowUp {
      content: string
      id: number
    }
  }