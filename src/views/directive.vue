<template>
  <div>
    <button v-copy="copyText">复制</button>
  </div>
</template>
<script>
export default {
  name: "myDirective",
  data() {
    return {
      copyText: "这是复制的内容",
    };
  },
};
</script>
<style lang="scss" scoped></style>
