<template>
  <div>
    <!--设置地图容器挂载点-->
    <div id="map">
      <div id="mouse-position"></div>
    </div>
    <button class="btn" @click="resetSite">复位</button>
  </div>
</template>
<script>
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Feature } from "ol";
import * as olCoordinate from "ol/coordinate";
import { defaults, MousePosition } from "ol/control";
// import { Fill, Stroke, Style } from "ol/style";
import { XYZ, Vector as VectorSource } from "ol/source";
import { Point } from "ol/geom";
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
        controls: defaults().extend([
          new MousePosition({
            coordinateFormat: olCoordinate.createStringXY(4),
            projection: "EPSG:4326",
            target: document.getElementById("mouse-position"),
          }),
        ]),
      });
      //
      let source = new VectorSource({});
      let layer = new VectorLayer({
        source,
      });
      this.map.addLayer(layer);
      // 给地图绑定事件 点击添加点要素
      this.map.on("click", (evt) => {
        console.log(evt, this.map);
        const { coordinate } = evt;
        let point = new Feature({
          geometry: new Point(coordinate),
        });
        source.addFeature(point);

        //实现飞行视角-漫游
        const view = this.map.getView();
        view.animate({
          center: coordinate,
        });
      });
    },
    resetSite() {
      this.map.getView().animate({
        center: this.center,
        zoom: 14,
        duration: 2000,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
/* 鼠标位置控件层样式设置 */
#mouse-position {
  float: left;
  position: absolute;
  bottom: 5px;
  width: 330px;
  height: 20px;
  /*在地图容器中的层，要设置z-index的值让其显示在地图上层*/
  z-index: 2000;
}
.btn {
  position: fixed;
  right: 10px;
  top: 30px;
  z-index: 10;
  cursor: pointer;
}
</style>
