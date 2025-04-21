<template>
    <div class="rightBar">
        <div class="tag-list">
           
            <div v-for="tag in Tag"
            :key="tag.id"
            class="tag-item"
            :class="{active:activeTag===tag.id}"
            @click="handleTagClick(tag)">
        
            <el-icon class="tag-icon"><component :is="iconMap[tag.id]"/></el-icon>
            <span>{{tag.name}}</span>
        </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import {ref,onMounted,defineEmits}from'vue'
import { getCategories } from '@/api/article'
import{House,TrendCharts,Mouse,Iphone,Cellphone,Cpu,Box,Switch} from '@element-plus/icons-vue'
interface TagType{
    name:string;
    id:number;
    categoryId:string
}
const iconMap=[
    House,
    TrendCharts,
    Mouse,
    Iphone,
    Cellphone,
    Cpu,
    Box,
    Switch
]

let Tag=ref<TagType[]>([
    {name:'默认',
        id:0,
        categoryId:''
    }
])
let activeTag=ref(0)

const handleTag=async()=>{
  const data=await getCategories()
  console.log(data)
  for(let i=0;i<data.length;i++){
    Tag.value.push({name:data[i].name,id:i+1,categoryId:data[i].id})
  }

}

const emit=defineEmits<{
    (event:'custom-event',data:any):void
}>()

const handleTagClick=(tag:any)=>{
    activeTag.value=tag.id===activeTag.value?null:tag.id;
    emit('custom-event',tag)
}

onMounted(()=>{
    handleTag()
})

</script>
<style lang="scss" scoped>
    .rightBar{
        display: block;
        position: absolute;
        right:5%;
       
        height:510px;
        width:13%;
        background:white;
        border-radius: 3%;
        box-shadow: 0 0 10px rgb(203, 201, 201);

    }
    .tag-list {
        height: 100%; 
        display: flex;
        flex-direction: column; 
        overflow: hidden; 
      }
      
      .tag-item {
        flex: 1; 
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 15px;
        cursor: pointer;
        transition: all 0.3s;
      
        &:not(:last-child) {
          border-bottom: 1px solid #ebedf0;
        }
      
        &.active {
          background-color: #f0f5ff;
          color: #409eff;
        }
      }
      
     
      .tag-icon{
        margin:0 10px 0 -10px;      }
 @media (max-width: 1200px) {
        .rightBar {
          display: none;
        }
      }


</style>