export const createLazyImgDirective=()=>({
    mounted(el:HTMLImageElement) {
        const observer=new IntersectionObserver((entries)=>{
            entries.forEach(entry=>{
                if(entry.isIntersecting){
                    const src=el.dataset.src
                    if(src){
                        el.src=src
                        observer.unobserve(el)
                    }
                }
            })
           
        },{
                rootMargin:'200px',
                threshold:0.01
            })
            observer.observe(el)
        
    },
})