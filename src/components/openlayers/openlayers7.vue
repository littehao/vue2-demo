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
import { Style, Icon } from "ol/style";
import { XYZ, Vector as VectorSource } from "ol/source";
import * as olCoordinate from "ol/coordinate";
import { defaults, MousePosition } from "ol/control";
import afsIcon from "@/assets/img/topo/afs_alarm_4.png";
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
      });
      iconFeature.setStyle(this.createLabelStyle());
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
    createLabelStyle() {
      return new Style({
        image: new Icon({
          anchor: [0.5, 60], //锚。默认值是图标中心 默认值是[0.5,0.5]
          anchorOrigin: "top-right", //锚的原点:左下角、右下角、左上方或右上方。默认是左上
          anchorXUnits: "fraction", //指定锚点x值的单位。'fraction'的值表示x值是图标的'fraction'。'pixels'的值表示像素中的x值,默认为'fraction'
          anchorYUnits: "pixels", //指定锚点y值的单位。
          offsetOrigin: "top-right", //偏移量的原点，bottom-left, bottom-right, top-left or top-right. 默认是`top-left`
          //图标缩放比例
          scale: 0.5,
          //透明度
          opacity: 0.75,
          //图标的url
          src: afsIcon,
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
        });
        //设置要素的样式
        newFeature.setStyle(this.createLabelStyle());
        //将新要素添加到数据源中
        this.vectorSource.addFeature(newFeature);
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
