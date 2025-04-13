// src/shims-vue.d.ts
declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }
  
declare module 'vue-svg-icon' {
    import { DefineComponent } from 'vue';
    const Icon: DefineComponent<{}, {}, any>;
    export default Icon;
  }
  