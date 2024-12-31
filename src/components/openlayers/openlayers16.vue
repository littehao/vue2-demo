<template>
  <div id="map">
    <div id="mouse-position"></div>
  </div>
</template>

<script>
import Map from "ol/Map";
import View from "ol/View";
import * as olTilegrid from "ol/tilegrid";
import TileImage from "ol/source/TileImage.js";
import * as olProj from "ol/proj";
import {
  Tile as TileLayer,
  // Vector as VectorLayer
} from "ol/layer";
// import { Point } from "ol/geom";
// import { Feature } from "ol";
// import { Fill, Stroke, Style, Circle } from "ol/style";
// import { Vector as VectorSource } from "ol/source";
import * as olCoordinate from "ol/coordinate";
import { defaults, MousePosition } from "ol/control";
import Geoserver from "@/api/Geoserver";
import mixin from "./mixin";

export default {
  name: "OpenLayersMap",
  mixins: [mixin],
  data() {
    return {
      map: null,
      center: [116.403414, 39.924091], // 北京
      serviceAreaNodes: [],
    };
  },
  mounted() {
    // this.loadBaiduMapScript();
    // this.initMap();
  },
  methods: {
    baiduLayer() {
      let resolutions = [];
      for (let i = 0; i < 19; i++) {
        resolutions[i] = Math.pow(2, 18 - i);
      }
      let tilegrid = new olTilegrid.TileGrid({
        origin: [0, 0],
        resolutions: resolutions,
      });

      let baidu_source = new TileImage({
        projection: "EPSG:3857",
        tileGrid: tilegrid,
        tileUrlFunction: function (tileCoord) {
          if (!tileCoord) return "";
          let z = tileCoord[0];
          let x = tileCoord[1];
          let y = -tileCoord[2];
          // 对编号xy处理
          x = x < 0 ? "M" + -x : x;
          y = y < 0 ? "M" + -y : y;
          return (
            "http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=" +
            x +
            "&y=" +
            y +
            "&z=" +
            z +
            "&styles=pl&udt=20151021&scaler=1&p=1"
          );
        },
      });

      let baidu_layer = new TileLayer({
        source: baidu_source,
      });
      return baidu_layer;
    },
    initMap() {
      this.translatePoints(this.center, (data) => {
        this.map = new Map({
          target: "map",
          layers: [this.baiduLayer()],
          view: new View({
            center: Object.values(data.points[0]),
            // center: olProj.fromLonLat([104.063793, 30.564528]),
            zoom: 12,
            projection: "EPSG:3857",
          }),
          controls: defaults().extend([
            new MousePosition({
              coordinateFormat: olCoordinate.createStringXY(4),
              projection: "EPSG:3857",
              target: document.getElementById("mouse-position"),
            }),
          ]),
        });

        this.serverAreaLayer = this.creatLayerMap({ zIndex: 1 });
        this.serverAreaLayer.getSource().addFeatures([
          this.createServerArea({
            location: Object.values(data.points[0]),
            properties: {
              name: "故宫博物院",
            },
          }),
        ]);
        // this.getFuwuqu();
      });
    },
    getFuwuqu() {
      Geoserver.queryFuwuqu().then((res) => {
        console.log("queryFuwuqu-----------", res);
        const serverAreaNodes = res.features;
        const serverAreaData = [];
        serverAreaNodes.forEach((i) => {
          this.translatePoints(i.geometry.coordinates, (data) => {
            console.log(
              "translatePoints-----------",
              data
              // Object.values(data.points[0])
            );
            i.location = Object.values(data.points[0]);
            serverAreaData.push(this.createServerArea(i));
          });
        });
        setTimeout(() => {
          this.serverAreaLayer.getSource().addFeatures(serverAreaData);
          // this.setCenter(serverAreaNodes[0].geometry.coordinates);
        }, 1000);
      });
    },
    setCenter(center) {
      this.translatePoints(center, (data) => {
        this.map.getView().animate({
          center: Object.values(data.points[0]), // 平移后的像素坐标转投影坐标
          duration: 0,
          zoom: 16,
        });
      });
    },
    translatePoints(location, callback) {
      const BMapGL = window.BMapGL;
      console.log(BMapGL);
      var convertor = new BMapGL.Convertor();
      var pointArr = [];
      var ggPoint = new BMapGL.Point(...location);
      pointArr.push(ggPoint);
      convertor.translate(
        pointArr,
        window.COORDINATES_GCJ02,
        window.COORDINATES_BD09_MC,
        callback
      );
    },
    loadBaiduMapScript() {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "http://api.map.baidu.com/api?type=webgl&v=1.0&ak=TFKh2VTszDMhRYmixjH7zecBSqKpQFSO&callback=init";
      document.body.appendChild(script);
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
./mixin
