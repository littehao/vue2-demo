<template>
  <div>
    <button v-copy="copyText">{{ I18N.common.fuZhi }}</button>
    <button v-longpress="longpress">{{ I18N.common.changAn }}</button>
    <button v-debounce="debounceClick">{{ I18N.common.fangDou }}</button>
  </div>
</template>
<script>
import I18N from "@/utils/I18N";

export default {
  name: "myDirective",
  data() {
    return {
      copyText: I18N.common.zheShiFuZhiDe,
    };
  },
  methods: {
    longpress() {
      console.log(I18N.common.changAnLe);
    },
    debounceClick() {
      console.log(I18N.common.zhiChuFaYiCi);
    },
  },
};
</script>
<style lang="scss" scoped></style>
