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
import { Point } from "ol/geom";
import { Feature } from "ol";
import { Style, Fill, Stroke, Text } from "ol/style";
import { XYZ, Vector as VectorSource } from "ol/source";
import * as olCoordinate from "ol/coordinate";
import { defaults, MousePosition } from "ol/control";
export default {
  name: "OpenLayers",
  data() {
    return {
      map: null,
      center: [116.397083, 39.874531], // 北京
      vectorSource: null,
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
          }),
        ]),
      });
      //=================
      //实例化Vector要素，通过矢量图层添加到地图容器中
      var iconFeature = new Feature({
        geometry: new Point(this.center),
        name: "北京市",
      });
      iconFeature.setStyle(this.createLabelStyle(iconFeature));
      //矢量标注的数据源
      this.vectorSource = new VectorSource({
        features: [iconFeature],
      });
      //矢量标注图层
      var vectorLayer = new VectorLayer({
        source: this.vectorSource,
      });
      this.map.addLayer(vectorLayer);
      // 添加事件
      this.handleClick();
    },
    createLabelStyle(feature) {
      return new Style({
        text: new Text({
          //位置
          textAlign: "center",
          //基准线
          textBaseline: "middle",
          //文字样式
          font: "normal 14px 微软雅黑",
          //文本内容
          text: feature.get("name"),
          //文本填充样式（即文字颜色）
          fill: new Fill({ color: "#aa3300" }),
          stroke: new Stroke({ color: "#ffcc33", width: 2 }),
        }),
      });
    },
    handleClick() {
      this.map.on("click", (evt) => {
        //鼠标单击点坐标
        var point = evt.coordinate;
        //添加一个新的标注（矢量要素）
        //新建一个要素 Feature
        var newFeature = new Feature({
          //几何信息
          geometry: new Point(point),
          name: "标注点",
        });
        //设置要素的样式
        newFeature.setStyle(this.createLabelStyle(newFeature));
        //将新要素添加到数据源中
        this.vectorSource.addFeature(newFeature);
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
