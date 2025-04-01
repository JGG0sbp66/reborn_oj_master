<template>
  <!-- <showtitle text="这里是登陆页面" />
  <navlinks /> -->
  <headerheader />
  <LoginForm />
  <foot />
</template>


<script setup lang="ts">
import { ref, reactive } from "vue"
import showtitle from "@/components/test/showtitle.vue"
import navlinks from "@/components/test/navlinks.vue";
import LoginForm from "@/components/LoginForm.vue";
import headerheader from "@/components/headerheader.vue";
import foot from "@/components/foot.vue";
</script>


<style scoped>

</style>
