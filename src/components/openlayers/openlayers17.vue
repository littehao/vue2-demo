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
    this.initMap();
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
      this.map = new Map({
        target: "map",
        layers: [this.baiduLayer()],
        view: new View({
          center: olProj.fromLonLat(this.center),
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

      this.serverAreaLayer = this.creatLayerMap({ zIndex: 2 });
      this.cableLayer = this.creatLayerMap({ zIndex: 1 });
      this.tollStationLayer = this.creatLayerMap({ zIndex: 3 });

      this.getFuwuqu();
      this.getLuxian();
      this.getShoufeizhan();
    },
    getFuwuqu() {
      Geoserver.queryFuwuqu().then((res) => {
        console.log("queryFuwuqu-----------", res);
        const serverAreaNodes = res.features;
        const serverAreaData = [];
        serverAreaNodes.forEach((i) => {
          const data = {
            location: olProj.fromLonLat(i.geometry.coordinates),
            label: i.properties.name,
            type: "serverArea",
          };
          serverAreaData.push(this.createStation(data));
        });
        this.serverAreaLayer.getSource().addFeatures(serverAreaData);
        this.setCenter(
          olProj.fromLonLat(serverAreaNodes[0].geometry.coordinates)
        );
      });
    },
    getLuxian() {
      Geoserver.queryLuxian().then((res) => {
        console.log("queryLuxian-----------", res);
        const luxianList = res.features;
        const lineData = [];
        luxianList.forEach((i) => {
          const path = i.geometry.coordinates[0];
          const data = {
            id: i.id,
            path: path.map((j) => olProj.fromLonLat(j)),
            label: i.properties.NationName,
          };
          lineData.push(this.createLineString(data));
        });
        this.cableLayer.getSource().addFeatures(lineData);
      });
    },
    getShoufeizhan() {
      Geoserver.queryShoufeizhan().then((res) => {
        console.log("queryShoufeizhan-----------", res);
        const tollStations = res.features;
        const tollStationsData = [];
        tollStations.forEach((i) => {
          const data = {
            location: olProj.fromLonLat(i.geometry.coordinates),
            label: i.properties.name,
            type: "tollStation",
          };
          tollStationsData.push(this.createStation(data));
        });
        this.tollStationLayer.getSource().addFeatures(tollStationsData);
      });
    },
    setCenter(center) {
      this.map.getView().animate({
        center: center, // 平移后的像素坐标转投影坐标
        duration: 0,
        zoom: 16,
      });
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
