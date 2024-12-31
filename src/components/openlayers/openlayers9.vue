<template>
  <div>
    <div id="menu">
      选择标注类型：
      <label class="checkbox"
        ><input type="radio" name="label" value="vector" checked />Vector
        Labels</label
      >
      <label class="checkbox"
        ><input type="radio" name="label" value="overlay" />Overlay
        Labels</label
      >
    </div>
    <!--设置地图容器挂载点-->
    <div id="map"></div>
    <div id="label" style="display: none">
      <div id="marker" class="marker" title="Marker">
        <span id="address" class="address">标注点</span>
      </div>
    </div>
  </div>
</template>
<script>
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Point } from "ol/geom";
import { Feature, Overlay } from "ol";
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

      // 实例化overlay标注，添加到地图容器中
      var marker = new Overlay({
        position: [116.42112967437077, 39.8827560705331],
        positioning: "center-center",
        element: document.getElementById("marker"),
        stopEvent: false,
      });
      this.map.addOverlay(marker);
      marker.getElement().title = "天坛东门";
      var text = new Overlay({
        position: [116.42112967437077, 39.8827560705331],
        element: document.getElementById("address"),
      });
      this.map.addOverlay(text);
      text.getElement().innerText = marker.getElement().title;
      // 添加事件
      this.handleClick();
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
    handleClick() {
      this.map.on("click", (evt) => {
        //鼠标单击点坐标
        var point = evt.coordinate;
        console.log(point);
        var type = document.querySelector("input[name='label']:checked").value;
        console.log(type);
        if (type == "vector") {
          //添加一个新的标注（矢量要素）
          this.addVectorLabel(point);
        } else if (type == "overlay") {
          //添加新的图文标注（overlay标注）
          this.addOverlayLabel(point);
        }
      });
    },
    addVectorLabel(coordinate) {
      //新建一个要素 ol.Feature
      var newFeature = new Feature({
        //几何信息
        geometry: new Point(coordinate),
        //名称属性
        name: "标注点",
      });
      //设置要素的样式
      newFeature.setStyle(this.createLabelStyle(newFeature));
      //将新要素添加到数据源中
      this.vectorSource.addFeature(newFeature);
    },
    addOverlayLabel(coordinate) {
      //新增div元素
      var elementDiv = document.createElement("div");
      elementDiv.className = "marker";
      elementDiv.title = "标注点";
      // 获取id为label的元素
      var overlay = document.getElementById("label");
      // 为ID为label的div层添加div子节点
      overlay.appendChild(elementDiv);
      //新增a元素
      var elementSpan = document.createElement("span");
      elementSpan.className = "address";
      //设置文本
      this.setInnerText(elementSpan, elementDiv.title);
      // 新建的div元素添加a子节点
      elementDiv.appendChild(elementSpan);

      //实例化图文标注（图形+文本），添加到地图容器中
      var newMarker = new Overlay({
        position: coordinate,
        positioning: "center-center",
        element: elementDiv,
        stopEvent: false,
      });
      this.map.addOverlay(newMarker);
      var newText = new Overlay({
        position: coordinate,
        element: elementSpan,
      });
      this.map.addOverlay(newText);
    },
    setInnerText(element, text) {
      if (typeof element.textContent == "string") {
        element.textContent = text;
      } else {
        element.innerText = text;
      }
    },
  },
};
</script>
<style lang="scss">
.marker {
  width: 20px;
  height: 20px;
  border: 1px solid #088;
  border-radius: 10px;
  background-color: #0ff;
  opacity: 0.5;
}

.address {
  text-decoration: none;
  color: #aa3300;
  font-size: 14px;
  font-weight: bold;
  text-shadow: black 0.1em 0.1em 0.2em;
}
</style>
