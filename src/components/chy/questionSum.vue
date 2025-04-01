<template>
    <main>
        <!-- 分类组件 -->
        <questionSort></questionSort>
        <!-- 题目内容组件 -->
        <questionContent></questionContent>
        <!-- 分页组件 -->
        <questionSwitchPage></questionSwitchPage>
    </main>
</template>

<script>
import questionSort from './questionSort.vue';
import questionContent from './questionContent.vue';
import questionSwitchPage from './questionSwitchPage.vue';
export default {
    data(){
        
    },
    components:{
        questionSort,
        questionContent,
        questionSwitchPage
    },
}
</script>

<style>

</style>