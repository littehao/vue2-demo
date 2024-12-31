<template>
  <div id="map" ref="draw" />
</template>
<script>
import Web3dMapGdp from "@/utils/Web3dMapGdp";
export default {
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      new Web3dMapGdp();
    },
  },
};
</script>
<style lang="scss" scoped>
#map {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
