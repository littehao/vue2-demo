<template>
  <div>
    子组件
    <input type="text" :value="name" @input="changeName" />
  </div>
</template>
<script>
export default {
  name: "ChildTestVue",
  model: {
    prop: "name",
    event: "changeName",
  },
  props: {
    name: String,
  },
  data() {
    return {
      num: 0,
    };
  },
  created() {
    console.log(this.name);
    console.log(this.$attrs);
  },
  methods: {
    changeName(e) {
      this.$emit("changeName", e.target.value);
    },
  },
};
</script>
<style lang="scss" scoped></style>
