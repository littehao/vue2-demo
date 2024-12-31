<template>
  <div class="openlayers12">
    <!--设置地图容器挂载点-->
    <div id="map"></div>

    <!--站点操作按钮-->
    <div
      class="operateMenu"
      v-if="mouseEvent === 'stationClick'"
      :style="clickPosition"
    >
      <ul>
        <li>
          <el-button type="primary" @click="stationClick('details')">
            站点详情
          </el-button>
        </li>
        <li>
          <el-button type="primary" @click="stationClick('edit')">
            修改站点
          </el-button>
        </li>
      </ul>
    </div>
    <!--光缆操作按钮-->
    <div
      class="operateMenu"
      v-if="mouseEvent === 'lineClick'"
      :style="clickPosition"
    >
      <ul>
        <li>
          <el-button type="primary" @click="lineClick('details')">
            关联业务
          </el-button>
        </li>
        <li>
          <el-button type="primary" @click="lineClick('other')">
            其他操作
          </el-button>
        </li>
      </ul>
    </div>
    <!--站点详情-->
    <el-dialog
      :title="stationInfo.name + '详情'"
      :visible.sync="dialogVisible"
      append-to-body
      width="30%"
    >
      <div>
        <p class="station-name">{{ stationInfo.name }}</p>
        <p>
          <span class="title">所属区域：</span>
          <span class="detail">{{ stationInfo.regionName }}</span>
        </p>
        <p>
          <span class="title">地理位置：</span>
          <span class="detail">
            经度:{{ stationInfo.position[0] }}；纬度:{{
              stationInfo.position[1]
            }}
          </span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!--关联业务-->
    <el-dialog
      :title="lineInfo.lineName + '关联业务'"
      :visible.sync="linedialogVisible"
      append-to-body
      width="30%"
    >
      <div>
        <p class="station-name">{{ lineInfo.lineName }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="linedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="linedialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
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
          formid: 1,
          toid: 3,
        },
        {
          id: 3,
          name: "设备站点3",
          regionName: "海定区",
          position: [116.3083, 39.9556],
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
      zoom: 12,
      dialogVisible: false,
      linedialogVisible: false,
    };
  },
  computed: {
    clickPosition() {
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
          zoom: this.zoom,
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
      this.moveEvent();
      this.selectEvent();
      this.pointerHover();
    },
    // 地图的移动
    moveEvent() {
      // 移动地图时清除事件页面操作效果
      this.map.on("movestart", () => {
        this.mouseEvent = "";
      });
      // 移动地图结束时
      this.map.on("moveend", () => {
        const zoom = this.map.getView().getZoom(); // 获取当前地图的缩放级别
        this.zoom = zoom;
      });
    },
    pointerHover() {
      // 鼠标在地图上的移动事件
      this.map.on("pointermove", (evt) => {
        const features = this.map.getFeaturesAtPixel(evt.pixel, {
          hitTolerance: 0,
        });
        const nodeFeature = features.find(
          (i) => i.values_.layerType === "node"
        );
        if (!nodeFeature) {
          this.mouseEvent = "";
        }
      });
    },
    selectEvent() {
      // 添加选中事件
      this.map.on("singleclick", (evt) => {
        var feature = this.map.forEachFeatureAtPixel(evt.pixel, (feature) => {
          return feature;
        });
        if (feature) {
          const { layerType } = feature.values_;
          if (layerType === "node") {
            const data = feature.values_.data;
            this.positionStyle.left = evt.pixel_[0]; // 加上右边菜单宽度
            this.positionStyle.top = evt.pixel_[1]; // 加上顶部距离
            this.stationInfo = data;
            this.mouseEvent = "stationClick";
            return;
          }
          if (layerType === "line") {
            const data = feature.values_.data;
            this.positionStyle.left = evt.pixel_[0] - 10; // 加上右边菜单宽度
            this.positionStyle.top = evt.pixel_[1]; // 加上顶部距离
            this.lineInfo = data;
            this.mouseEvent = "lineClick";
            return;
          }
        }
      });
    },
    stationClick(type) {
      switch (type) {
        case "details":
          console.log("查看详情");
          this.dialogVisible = true;
          break;
        case "edit":
          console.log("修改站点");
          break;
      }
    },
    lineClick(type) {
      switch (type) {
        case "details":
          console.log("查看详情");
          this.linedialogVisible = true;
          break;
        case "other":
          console.log("其他操作");
          break;
      }
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
  },
};
</script>
<style lang="scss">
.openlayers12 {
  position: relative;
  .operateMenu {
    color: #ddecf4;
    background: #03123a;
    border-color: #2e5a87;
    padding: 5px;
    border-radius: 4px;
    position: absolute;
    li {
      margin-bottom: 5px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .el-button--primary {
    font-size: 12px;
    color: #a2e4ff;
    background: -webkit-gradient(
      linear,
      left top,
      left bottom,
      from(#1d48ae),
      color-stop(#091941),
      to(#1d48ae)
    );
    background: linear-gradient(#1d48ae, #091941, #1d48ae);
    border-color: #2293c2;
  }
}
</style>
