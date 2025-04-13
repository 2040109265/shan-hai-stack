export interface Article {
    id: number
    title: string
    summary: string
    userVO: {
      username: string
    }
    viewCount: number
    likeCount: number
    liked: boolean
    collectCount: number
    collected: boolean
    tagList: string[]
    publishTime: string
    cover?: string
  }
  
  export interface ArticleSearchDTO {
    cursor: {
      articled: number
      publishTime: string
      likeCount: number
      collectCount: number    
    }
    size: number
    forward: boolean
    searchText: string
    userId: number
    categoryId: number
    sortField: string
    asc: boolean
    firstQuery: boolean
  }