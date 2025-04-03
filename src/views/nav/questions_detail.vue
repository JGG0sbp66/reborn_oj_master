<template>
    <showtitle text="这里是题目详情页面"/>
    <navlinks/>
    
    <!-- 题目详情页页眉组件 -->
    <questions_detailHeader></questions_detailHeader>
    <!-- 题目详情组件 -->
    <questions_detailBody></questions_detailBody>
    <!-- 页脚组件 -->
    <foot></foot>

  </template>
  
  
  <script setup lang="ts">
    import {ref,reactive} from "vue"
    import showtitle from "@/components/test/showtitle.vue"
    import navlinks from "@/components/test/navlinks.vue";
    import questions_detailHeader from "@/components/chy/questions_detailHeader.vue";
    import questions_detailBody from "@/components/chy/questions_detailBody.vue";
    import foot from "@/components/foot.vue";
  </script>
  
  
  <style scoped>
    
    
  </style>
  