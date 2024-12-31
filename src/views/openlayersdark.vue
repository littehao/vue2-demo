<template>
  <div id="map" ref="map"></div>
</template>

<script>
// import Map from "ol/Map";
// import View from "ol/View";
// import TileLayer from "ol/layer/Tile";
// import { XYZ as XYZSource } from "ol/source";

export default {
  name: "OpenLayersMap",
  data() {
    return {
      map: null,
      center: [116.397083, 39.874531], // 北京
    };
  },
  mounted() {
    // this.initMap();
  },
  methods: {
    initMap() {
      const newLayer = new TileLayer(
        Object.assign({
          source: new XYZSource({
            url: "http://webrd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&style=7&lang=zh_cn&size=1&scale=1",
            tileLoadFunction: (imageTile, src) => {
              // console.log(imageTile, src)
              // 使用滤镜 将白色修改为深色
              const img = new Image();
              // img.crossOrigin = ''
              // 设置图片不从缓存取，从缓存取可能会出现跨域，导致加载失败
              img.setAttribute("crossOrigin", "anonymous");
              img.onload = () => {
                const canvas = document.createElement("canvas");
                const w = img.width;
                const h = img.height;
                canvas.width = w;
                canvas.height = h;
                const context = canvas.getContext("2d");
                context.filter =
                  "grayscale(98%) invert(100%) sepia(20%) hue-rotate(180deg) saturate(1600%) brightness(80%) contrast(90%)";
                context.drawImage(img, 0, 0, w, h, 0, 0, w, h);
                imageTile.getImage().src = canvas.toDataURL("image/png");
              };
              img.src = src;
            },
          }),
          renderMode: "vector",
        })
      );
      const map = new Map({
        target: "map", // 将OpenLayers地图渲染到Vue组件的div元素中
        layers: [newLayer],
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
<style lang="scss" scoped>
#map {
  width: 100vw;
  height: 100vh;
  position: relative;
}
</style>
