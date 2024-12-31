<template>
  <div class="openlayers11">
    <!--设置地图容器挂载点-->
    <div id="map"></div>

    <!--站点信息-->
    <div
      class="station-detail"
      v-show="mouseEvent === 'stationHover'"
      :style="hoverPosition"
    >
      <p class="station-name">{{ stationInfo.name }}</p>
      <p>
        <span class="title">所属区域：</span>
        <span class="detail">{{ stationInfo.regionName }}</span>
      </p>
      <p>
        <span class="title">地理位置：</span>
        <span class="detail">
          经度:{{ stationInfo.position[0] }}；纬度:{{ stationInfo.position[1] }}
        </span>
      </p>
    </div>
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
import afsIcon from "@/assets/img/topo/afs_normal.png";
import selecteAfsIcon from "@/assets/img/topo/afs_selected.png";
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
          id: 1,
          name: "设备站点1",
          regionName: "丰台区",
          position: [116.2856, 39.8627],
          formid: null,
          toid: 2,
        },
        {
          id: 2,
          name: "设备站点2",
          regionName: "朝阳区",
          position: [116.4878, 39.9211],
          formid: null,
          toid: null,
        },
      ],
      stationInfo: {
        name: "",
        regionName: "",
        position: "",
      },
      lineInfo: {
        lineName: "",
      },
      positionStyle: { left: 0, top: 0 },
      mouseEvent: "", //鼠标事件类型
      curNodeFeature: null,
      curLineFeature: null,
    };
  },
  computed: {
    hoverPosition() {
      return {
        left: this.positionStyle.left + "px",
        top: this.positionStyle.top + "px",
      };
    },
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
        const obj = this.stationLis.find((i) => item.toid === i.id);
        if (obj) {
          item.to = obj.position;
          lineList.push(
            this.createLine({
              ...item,
              lineName: item.name + "-" + obj.name,
            })
          );
        }
        stationList.push(this.createStation(item));
      });
      // console.log(lineList);
      this.stationLayer.getSource().addFeatures(stationList);
      this.lineLayer.getSource().addFeatures(lineList);
      // 添加事件
      this.pointerHover();
    },
    pointerHover() {
      // 鼠标在地图上的移动事件
      this.map.on("pointermove", (evt) => {
        const features = this.map.getFeaturesAtPixel(evt.pixel, {
          hitTolerance: 0,
        });
        // 移动到站点
        const nodeFeature = features.find(
          (i) => i.values_.layerType === "node"
        );
        if (nodeFeature) {
          this.curNodeFeature = nodeFeature;
          const data = nodeFeature.values_.data;
          this.stationInfo = data;
          this.mouseEvent = "stationHover";
          this.positionStyle.left = evt.pixel_[0] + 210; // 加上右边菜单宽度
          this.positionStyle.top = evt.pixel_[1] + 50; // 加上顶部距离
          nodeFeature.setStyle(this.hoverStationStyle(nodeFeature)); // 修改站点样式
          return;
        }
        // 移动到线要素
        const lineFeature = features.find(
          (i) => i.values_.layerType === "line"
        );
        if (lineFeature) {
          this.curLineFeature = lineFeature;
          const data = lineFeature.values_.data;
          this.lineInfo = data;
          this.mouseEvent = "lineHover";
          this.positionStyle.left = evt.pixel_[0] + 210; // 加上右边菜单宽度
          this.positionStyle.top = evt.pixel_[1] + 50; // 加上顶部距离
          lineFeature.setStyle(this.hoverlineStyle(lineFeature)); // 修改站点样式
          return;
        }
        if (this.curNodeFeature) {
          this.curNodeFeature.setStyle(
            this.createLabelStyle(this.curNodeFeature)
          ); // 修改站点样式
          this.curNodeFeature = null;
        }
        if (this.curLineFeature) {
          this.curLineFeature.setStyle(this.lineStyle(this.curLineFeature)); // 修改站点样式
          this.curLineFeature = null;
        }
        this.mouseEvent = "";
      });
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
        name: data.lineName,
        layerType: "line",
        data: data,
      });
      lineFeature.setStyle(this.lineStyle(lineFeature));
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
    lineStyle(feature) {
      // 设置标注样式
      return new Style({
        stroke: new Stroke({
          width: 3, // 线宽
          color: "#55b8ef",
        }),
        text: new Text({
          font: "bold 12px arial",
          text: feature.get("name"),
          fill: new Fill({
            color: "#55b8ef",
          }),
        }),
      });
    },
    hoverStationStyle(feature) {
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
          src: selecteAfsIcon,
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
          fill: new Fill({ color: "#AB49E7" }),
          stroke: new Stroke({ color: "#fff", width: 2 }),
        }),
      });
    },
    hoverlineStyle(feature) {
      // 设置标注样式
      return new Style({
        stroke: new Stroke({
          width: 3, // 线宽
          color: "#AB49E7",
        }),
        text: new Text({
          font: "bold 12px arial",
          text: feature.get("name"),
          fill: new Fill({
            color: "#AB49E7",
          }),
        }),
      });
    },
  },
};
</script>
<style lang="scss">
.openlayers11 {
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
