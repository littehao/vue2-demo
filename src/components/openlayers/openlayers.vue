<template>
  <div id="map"></div>
</template>

<script>
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";

export default {
  name: "OpenLayersMap",
  data() {
    return {
      map: null,
      center: [116.397083, 39.874531], // 北京
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      const map = new Map({
        target: "map", // 将OpenLayers地图渲染到Vue组件的div元素中
        layers: [
          new TileLayer({
            source: new XYZ({
              //图层的数据来源
              url: "http://webrd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&style=7&lang=zh_cn&size=1&scale=1",
            }),
          }),
        ],
        view: new View({
          // 设置地图视图参数
          center: this.center, // 地图中心点坐标
          zoom: 12, // 初始缩放级别为12
          projection: "EPSG:4326", //坐标系 有EPSG:4326和EPSG:3857两种
        }),
      });
      this.map = map; // 将地图对象保存到组件的data中，以便在其他方法中使用
    },
  },
};
</script>
<style lang="scss" scoped></style>
