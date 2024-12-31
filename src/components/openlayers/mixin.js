import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Fill, Stroke, Style, Icon, Text } from "ol/style";
import { Feature } from "ol";
import { LineString, Point } from "ol/geom";
export default {
  methods: {
    creatLayerMap(option = {}, source, isOverview = false) {
      source = source || new VectorSource();
      const layer = new VectorLayer({
        source: source,
        ...option,
      });
      !isOverview && this.map.addLayer(layer);
      return layer;
    },
    // 站点单元
    createStation(data) {
      // 用于充当标注的要素
      const stationFeature = new Feature({
        geometry: new Point(data.location),
        layerType: "node",
        data: data,
      });
      // 添加标注的样式
      stationFeature.setStyle(this.stationStyle(data));
      stationFeature.setId(data.nodeId);
      return stationFeature;
    },
    // 标点颜色样式
    stationStyle(data) {
      // 设置标注样式
      const _this = this;
      if (data.properties) {
        data.label = `${data.properties.name}` || "";
      }
      let img = require("@/assets/img/fuwuqu.png");
      let color = "#00A084";
      switch (data.type) {
        case "serverArea":
          img = require("@/assets/img/fuwuqu.png");
          color = "#00A084";
          break;
        case "tollStation":
          img = require("@/assets/img/shoufeizhan.png");
          color = "#F26849";
          break;
      }
      return new Style({
        text: new Text({
          font: "bold 14px arial",
          text: data.label,
          fill: new Fill({
            color: color,
          }),
          stroke: new Stroke({
            color: _this.textStroke,
          }),
          offsetY: 30,
        }),
        image: new Icon({
          src: img,
          scale: 0.3,
        }),
        zIndex: 1,
      });
    },
    lineStyle(data) {
      // 设置标注样式
      return new Style({
        stroke: new Stroke({
          width: 4,
          color: "#00A084",
        }),
        text: new Text({
          font: "bold 14px arial",
          text: data.label,
          offsetY: -14,
          fill: new Fill({
            color: "#00A084",
          }),
        }),
      });
    },
    // 创建连线
    createLineString(data) {
      // 创建一个 线元素
      const lineFeature = new Feature({
        geometry: new LineString(data.path),
        data: data,
        layerType: "edge",
      });
      // 添加标注的样式
      lineFeature.setStyle(this.lineStyle(data));
      lineFeature.setId(data.id);
      return lineFeature;
    },
  },
};
