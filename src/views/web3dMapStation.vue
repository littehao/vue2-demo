<template>
  <div id="map" ref="map" />
</template>
<script>
import ThreeMap from "@/utils/web3dMapStation";
export default {
  data() {
    return {
      map: null,
      stationList: [
        {
          name: "四川",
          cp: [102.9199, 30.1904],
        },
        {
          name: "北京",
          cp: [116.4551, 40.2539],
        },
        {
          name: "上海",
          cp: [121.4648, 31.2891],
        },
      ],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.map = new ThreeMap();
      this.map.markDo(this.stationList);
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
