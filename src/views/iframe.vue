<template>
  <div>
    <div class="btn" @click="navTo">按钮</div>
    <iframe :src="url" width="1000px" height="800px"></iframe>
  </div>
</template>
<script>
export default {
  name: "iFrame",
  data() {
    return {
      url: "",
    };
  },
  methods: {
    navTo() {
      this.url =
        "http://192.168.3.158:1025/#/index?key=EX7nIsj15N5Z8ZGuOZ68Pt8nA%2B922nzKZHtnRJAFm0A%3D";
    },
  },
};
</script>
<style lang="scss" scoped>
.btn {
  cursor: pointer;
}
</style>
