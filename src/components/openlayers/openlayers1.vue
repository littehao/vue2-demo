<template>
  <div>
    <!--设置地图容器挂载点-->
    <div id="map">
      <div id="mouse-position"></div>
    </div>
  </div>
</template>
<script>
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Point } from "ol/geom";
import { Feature } from "ol";
import { Fill, Stroke, Style, Circle } from "ol/style";
import { XYZ, Vector as VectorSource } from "ol/source";
import * as olCoordinate from "ol/coordinate";
import { defaults, MousePosition } from "ol/control";
export default {
  name: "OpenLayers",
  data() {
    return {
      map: null,
      center: [104.063793, 30.564528], // 北京
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
          zoom: 10,
          projection: "EPSG:4326",
        }),
        // 设置图层
        layers: [gaode],
        controls: defaults().extend([
          new MousePosition({
            coordinateFormat: olCoordinate.createStringXY(4),
            projection: "EPSG:4326",
            target: document.getElementById("mouse-position"),
          }),
        ]),
      });
      //=================
      // 1，通过样式信息盒几何信息构建点要素
      // 几何
      const point = new Feature({
        geometry: new Point([104.063793, 30.564528]),
      });
      const pointStyle = new Style({
        // image属性设置 点要素的样式
        image: new Circle({
          radius: 10,
          fill: new Fill({
            color: "#ffcc33",
          }),
          stroke: new Stroke({
            width: 2,
            color: "#333",
          }),
        }),
      });
      point.setStyle(pointStyle);
      // 2，将要素添加到矢量数据源
      let source = new VectorSource({
        features: [point],
      });
      // 3,将矢量数据源添加到矢量图层
      let layer = new VectorLayer({
        source,
      });
      // 4,添加矢量图层到地图容器
      this.map.addLayer(layer);
    },
  },
};
</script>
<style lang="scss" scoped>
#mouse-position {
  position: absolute;
  bottom: 5px;
  right: 0px;
  width: 330px;
  height: 20px;
  /*在地图容器中的层，要设置z-index的值让其显示在地图上层*/
  z-index: 2000;
}
</style>
