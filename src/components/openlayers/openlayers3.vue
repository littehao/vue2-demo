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
import { GeoJSON } from "ol/format";
import { Fill, Stroke, Style } from "ol/style";
import { XYZ, Vector as VectorSource } from "ol/source";
import * as olCoordinate from "ol/coordinate";
import { defaults, MousePosition } from "ol/control";
export default {
  name: "OpenLayers",
  data() {
    return {
      map: null,
      center: [116.409607, 40.038162], // 北京
      layerList: [],
    };
  },
  mounted() {
    this.initMap();
    this.handleClick();
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
      // 设置line要素的geojson数据
      let data = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [116.410848, 40.035749],
                [116.409607, 40.038162],
                [116.409607, 40.038162],
                [116.409651, 40.039744],
                [116.409651, 40.039744],
                [116.406337, 40.04051],
                [116.400011, 40.036467],
              ],
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [116.4193, 39.8821],
                  [116.4101, 39.8691],
                  [116.4063, 39.8886],
                ],
              ],
            },
          },
        ],
      };
      // 设置矢量数据源读取数据
      let source = new VectorSource({
        features: new GeoJSON().readFeatures(data),
      });
      // 设置矢量图图层
      let layer = new VectorLayer({
        source,
      });
      // 给线设置样式
      let style = new Style({
        // line的颜色
        stroke: new Stroke({
          color: "#ff2d51",
          width: 2,
        }),
        // 给区要素添加颜色
        fill: new Fill({
          color: "rgba(50,50,50,0.3)",
        }),
      });
      layer.setStyle(style);
      // 添加矢量图层到地图容器
      this.map.addLayer(layer);
    },
    handleClick() {
      this.map.on("click", (evt) => {
        console.log(evt.coordinate);
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
