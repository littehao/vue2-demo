<template>
  <div class="openlayers10">
    <!--设置地图容器挂载点-->
    <div id="map"></div>
  </div>
</template>
<script>
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Point, LineString } from "ol/geom";
import { Feature } from "ol";
import { Style, Fill, Stroke, Text, Icon } from "ol/style";
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
      stationLayer: null,
      lineLayer: null,
      stationLis: [
        // 站点数据
        {
          name: "设备站点1",
          regionName: "丰台区",
          position: [116.2856, 39.8627],
          to: [116.4878, 39.9211],
        },
        {
          name: "设备站点2",
          regionName: "朝阳区",
          position: [116.4878, 39.9211],
          to: [],
        },
      ],
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
          zoom: 12,
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
      //创建站点图层
      this.stationLayer = this.creatLayerMap({ zIndex: 2 });
      //创建连接线图层
      this.lineLayer = this.creatLayerMap({ zIndex: 1 });
      //渲染地图
      this.renderMap();
    },
    creatLayerMap(options) {
      //矢量标注图层
      var vectorLayer = new VectorLayer({
        source: new VectorSource(),
        ...options,
      });
      this.map.addLayer(vectorLayer);
      return vectorLayer;
    },
    renderMap() {
      const stationList = [];
      const lineList = [];
      this.stationLis.forEach((item) => {
        stationList.push(this.createStation(item));
        lineList.push(this.createLine(item));
      });
      // console.log(lineList);
      this.stationLayer.getSource().addFeatures(stationList);
      this.lineLayer.getSource().addFeatures(lineList);
      // 添加事件
      this.handleClick();
    },
    // 创建站点
    createStation(station) {
      //实例化Vector要素，通过矢量图层添加到地图容器中
      var iconFeature = new Feature({
        geometry: new Point(station.position),
        name: station.name,
        layerType: "node",
        data: station,
      });
      iconFeature.setStyle(this.createLabelStyle(iconFeature));
      return iconFeature;
    },
    // 创建连线
    createLine(data) {
      const lineFeature = new Feature({
        geometry: new LineString([data.position, data.to]),
        layerType: "line",
        data: data,
      });
      lineFeature.setStyle(this.lineStyle(data));
      return lineFeature;
    },
    createLabelStyle(feature) {
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
        text: new Text({
          //位置
          textAlign: "center",
          //基准线
          textBaseline: "top",
          offsetY: 20, //垂直文本偏移量(以像素为单位)
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
    lineStyle(data) {
      // 设置标注样式
      return new Style({
        stroke: new Stroke({
          width: 3, // 线宽
          color: "#55b8ef",
        }),
        text: new Text({
          font: "bold 12px arial",
          text: data.name,
          fill: new Fill({
            color: "#55b8ef",
          }),
        }),
      });
    },
    handleClick() {
      this.map.on("click", (evt) => {
        //鼠标单击点坐标
        var point = evt.coordinate;
        console.log(point);
      });
    },
  },
};
</script>
<style lang="scss">
.openlayers10 {
  .station-detail {
    position: absolute;
    max-width: 300px;
    max-height: 300px;
    padding: 10px;
    font-size: 12px;
    line-height: 18 px;
    border-radius: 5px;
    z-index: 5;
    overflow: auto;
    color: #ddecf4;
    background: rgba(9, 29, 99, 0.8);
    border: 1px solid rgba(37, 108, 191, 1);
    box-shadow: 0px 0px 10px 0px rgba(62, 209, 255, 0.6) inset;
    .station-name {
      font-size: 14px;
    }
    .title {
      color: #56d6ff;
    }
    .detail {
      color: #ddecf4;
    }
  }
}
</style>
