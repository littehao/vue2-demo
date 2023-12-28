<template>
  <div class="main">
    <router-link to="/">指纹</router-link>
    <router-link to="/directive">自定义指令</router-link>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
    };
  },
};
</script>

<style scoped>
.main a {
  margin: 0 10px;
}
</style>
