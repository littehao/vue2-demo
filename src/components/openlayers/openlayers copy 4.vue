<template>
  <div id="map"></div>
</template>

<script>
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import * as olTilegrid from "ol/tilegrid";
import TileImage from "ol/source/TileImage.js";
import * as olProj from "ol/proj";
// import OSM from "ol/source/OSM";

export default {
  name: "OpenLayersMap",
  data() {
    return {
      map: null,
      center: [116.402831, 39.923678], // 北京
    };
  },
  mounted() {
    this.loadBaiduMapScript();
    this.initMap();
  },
  methods: {
    initMap() {
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
          let y = -tileCoord[2] - 2;
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
      new Map({
        target: "map",
        layers: [baidu_layer],
        view: new View({
          center: olProj.fromLonLat([104.063793, 30.564528]),
          zoom: 12,
          projection: "EPSG:3857",
        }),
      });
    },
    loadBaiduMapScript() {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "http://api.map.baidu.com/api?v=2.0&ak=2CGuCyTysZtAkGK1BWBZDl2YArB1RVZZ&callback=init";
      document.body.appendChild(script);
    },
    convertToBaidu(lat, lon) {
      // 假设这是转换公式，实际情况需要使用百度提供的转换方法
      const x = lon - 105.0;
      const y = lat - 35.0;
      const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * Math.PI);
      const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * Math.PI);

      return {
        bdLat: z * Math.cos(theta) + 0.0065,
        bdLon: z * Math.sin(theta) + 0.006,
      };
    },
    getMercator(poi) {
      //[114.32894, 30.585748]
      var mercator = {};
      var earthRad = 6378137.0;
      // console.log("mercator-poi",poi);
      mercator.x = ((poi[0] * Math.PI) / 180) * earthRad;
      var a = (poi[1] * Math.PI) / 180;
      mercator.y =
        (earthRad / 2) * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
      // console.log("mercator",mercator);
      return [mercator.x, mercator.y]; //[12727039.383734727, 3579066.6894065146]
    },
  },
};
</script>
<style lang="scss" scoped></style>
