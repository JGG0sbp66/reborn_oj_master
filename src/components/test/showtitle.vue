<template>
  <div class="show"> {{ text }}</div>
  
</template>


<script setup lang="ts">
  import {ref,reactive} from "vue"
  const props = defineProps({
    text: {
        type: String,
        default: "请输入文字"
    }
  })
  
</script>


<style scoped>
    .show {
        color: black;
        font-size: larger;
        font-weight: bolder;
        text-align: center;
    }
  
</style>
