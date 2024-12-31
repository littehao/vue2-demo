<template>
  <div>
    {{ I18N.common.fuZuJian }}
    <div>{{ obj.name }}</div>
    <Child v-model="obj.name"></Child>
  </div>
</template>
<script>
import Child from "@/components/test/child";
export default {
  name: "TestVue",
  components: { Child },
  data() {
    return {
      count: 0,
      obj: {
        name: "Lee",
        age: 18,
        height: 180,
      },
    };
  },
  methods: {
    changeCount(val) {
      this.count = val;
    },
  },
};
</script>
<style lang="scss" scoped></style>
