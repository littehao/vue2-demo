<template>
  <div>
    <!--设置地图容器挂载点-->
    <div id="map"></div>
  </div>
</template>
<script>
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
// import { Point } from "ol/geom";
// import { Feature } from "ol";
import { GeoJSON } from "ol/format";
import { Fill, Stroke, Style, Circle } from "ol/style";
import { XYZ, Vector as VectorSource } from "ol/source";
export default {
  name: "OpenLayers",
  data() {
    return {
      map: null,
      center: [116.397083, 39.874531], // 北京
      layerList: [],
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      //初识化地图信息
      const gaode = new TileLayer({
        source: new XYZ({
          url: "http://webrd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&style=7&lang=zh_cn&size=1&scale=1",
        }),
      });
      // 初始化地图
      this.map = new Map({
        //将初始化的地图设置到id为map的DOM元素上
        target: "map",
        // 设置视图
        view: new View({
          center: this.center,
          zoom: 14,
          projection: "EPSG:4326",
        }),
        // 设置图层
        layers: [gaode],
      });
      // 创建geojson数据
      let data = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [116.397083, 39.874531],
            },
          },
        ],
      };
      // 将数据添加到矢量数据源中
      let source = new VectorSource({
        features: new GeoJSON().readFeatures(data),
      });
      // 设置矢量图图层
      let layer = new VectorLayer({
        source,
      });
      // 给图层设置样式
      let style = new Style({
        image: new Circle({
          radius: 10,
          fill: new Fill({
            color: "#ff2d51",
          }),
          stroke: new Stroke({
            width: 2,
            color: "#333",
          }),
        }),
      });
      layer.setStyle(style);
      // 添加矢量图层到地图容器
      this.map.addLayer(layer);
    },
  },
};
</script>
<style lang="scss" scoped></style>
