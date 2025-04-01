<template>
  <showtitle text="这里是竞赛页面" />
  <navlinks />
  <foot />
</template>


<script setup lang="ts">
import { ref, reactive } from "vue"
import showtitle from "@/components/test/showtitle.vue"
import navlinks from "@/components/test/navlinks.vue";
import foot from "@/components/foot.vue";

</script>


<style scoped>
footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>