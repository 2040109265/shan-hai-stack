import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import '@/css/global.scss'
import { createLazyImgDirective } from '@/directives/createLazyImg'
import VueVirtualScroller from 'vue-virtual-scroller'


const vThrottleClick={
    mounted(el,binding){
        let isPass=true;
        const  throttleTime=binding.arg?parseInt(binding.arg,10):1000;
        el.addEventListener('click',()=>{
            if(typeof binding.value!=='function')return;
            if(isPass){
                isPass=false;
                binding.value();
                setTimeout(()=>{
                    isPass=true;
                },throttleTime);
            }
        })
    }
}

const app=createApp(App)
const pinia=createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(ElementPlus)
app.use(pinia)
app.use(VueVirtualScroller)
app.directive('throttleClick',vThrottleClick)
app.directive('lazy-img',createLazyImgDirective)
app.mount('#app')

export default pinia;