<template>
    <canvas id="canvas"  />
</template>
<script setup lang="ts">
import { onMounted , onUnmounted, ref} from 'vue'

    interface Circle{
        x : number
        y : number
        dx : number
        dy : number
        radius : number
    }

    const props=defineProps({
        circleCount:{
            type:Number,
            default:30
        },
        circleColor:{
            type:String,
            default:'white'
        },
        lineThreshold:{
            type:Number,
            default:200
        },
        background:{
            type:String,
            default:'rgb(13,14,14)'
        }
    })

    const canvas = ref<HTMLCanvasElement|null>(null)
    const circles = ref<Circle[]>([])
    const animationFrameId = ref<number | null >(null)

    const getDistance=(circle1:Circle,circle2:Circle):number=>{
        return Math.sqrt(Math.pow(circle2.x-circle1.x,2)+Math.pow(circle2.y-circle1.y,2))
    }

    const setupCircles=()=>{
        const ctx=canvas.value?.getContext('2d')
        if(!ctx)return
        circles.value = [] 

        for(let i = 1 ; i <= props.circleCount ; i++){
            const radius = 2
            const x = Math.random() * canvas.value!.width
            const y = Math.random() * canvas.value!.height
            const dx = (Math.random() - 0.5) * 0.5
            const dy = (Math.random() - 0.5) * 0.5
            circles.value.push({x , y , dx , dy , radius})
        }
    }

    const animate=()=>{
        if(!animationFrameId.value || !canvas.value) return 
        const ctx= canvas.value.getContext('2d')
        if(!ctx) return 
        ctx.clearRect(0 , 0 , canvas.value.width , canvas.value.height)

        circles.value.forEach((circle , index)=>{
            circle.x += circle.dx
            circle.y += circle.dy

            if( circle.x + circle.radius >= canvas.value!.width || circle.x - circle.radius <= 0){
                circle.dx = - circle.dx
            }
            if( circle.y + circle.radius >= canvas.value!.height || circle.y - circle.radius <= 0){
                circle.dy = - circle.dy
            }

            ctx.beginPath()
            ctx.arc(circle.x , circle.y , circle.radius , 0 , 2*Math.PI)
            ctx.fillStyle = props.circleColor
            ctx.fill()
            ctx.stroke()

            circles.value.forEach((otherCircle,otherIndex)=>{
                if(index===otherIndex)return 
                const distance=getDistance(circle,otherCircle)
                if(distance<props.lineThreshold){
                    const opacity=(1-(distance/props.lineThreshold))*0.5
                    ctx.beginPath()
                    ctx.moveTo(circle.x , circle.y)
                    ctx.lineTo(otherCircle.x , otherCircle.y)
                    ctx.strokeStyle=`rgba(255,255,255,${opacity})`
                    ctx.lineWidth=1
                    ctx.stroke()
                }

            })
        })
        animationFrameId.value = requestAnimationFrame(animate)
    }
    let interval=null;
    const handleResize=()=>{
        if(canvas.value){
        canvas.value.width = window.innerWidth
        canvas.value.height = window.innerHeight
        if(interval){
            clearTimeout(interval)
        }

        interval=setTimeout(()=>{
            if(animationFrameId.value){
                cancelAnimationFrame(animationFrameId.value)
            }
            setupCircles()
            animate()
        },1000)
        
        }  
    }

    onMounted(()=>{
        canvas.value=document.getElementById('canvas') as HTMLCanvasElement
        if(!canvas) return 
        canvas.value!.width = window.innerWidth
        canvas.value!.height= window.innerHeight
        setupCircles()
        animationFrameId.value = requestAnimationFrame(animate)

        window.addEventListener('resize',handleResize)
    })

    onUnmounted(()=>{
        window.removeEventListener('resize',handleResize)
        if(animationFrameId.value){
            cancelAnimationFrame(animationFrameId.value)
        }
    })
   
    
</script>
<style lang="scss" scoped>
#canvas{
    background-color:v-bind(background);
    width:100vw;
    height:100vh;
}
</style>