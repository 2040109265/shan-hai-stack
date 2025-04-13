<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const appContainer = ref(null)

const createRipple = (e) => {
  const ripple = document.createElement('div')
  ripple.className = 'ripple'
  
  let color=`rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`

  const rect = appContainer.value.getBoundingClientRect()
  const size = 20
  const x = e.clientX - 10
  const y = e.clientY - 10
  
  Object.assign(ripple.style, {
    left: `${x}px`,
    top: `${y}px`,
    transform: 'scale(0)',
    opacity: '1',
    zIndex:'9999'
  })
  
  document.body.appendChild(ripple)
  
  requestAnimationFrame(() => {
    ripple.style.background=color
    ripple.style.transform = 'scale(2)'
    ripple.style.opacity = '0'
  })

  ripple.addEventListener('transitionend', () => ripple.remove())
}

let lastTime=0
const interval=1000
const handleClick = (e) => {
  const now=Date.now();
  if(now-lastTime>=interval){
    createRipple(e);
    lastTime=now
  }
}
onMounted(() => {
  if (appContainer.value) {
    appContainer.value.addEventListener('click', handleClick)
    appContainer.value.addEventListener('touchstart', handleClick)
  }
})

onUnmounted(() => {
  if (appContainer.value) {
    appContainer.value.removeEventListener('click', handleClick)
    appContainer.value.removeEventListener('touchstart', handleClick)
  }
})
</script>

<template>
  <div ref="appContainer" class="app">
   
      <router-view>
        
      </router-view>
    
  </div>
</template>

<style>
.app {
  position: relative;
  min-height: 100vh;
}

.ripple {
  border-radius: 50%;
  width: 20px;
  height: 20px;
  position: fixed;
 
  pointer-events: none;
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(0);
  opacity: 1;
  z-index:9999!important;
}
</style>