window.__mapConfig__ = {
  onlineMap: true, // 在线地图
  vectorLayer: {
    //矢量图 含路网，含注记
    source:
      "http://webrd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&style=7&lang=zh_cn&size=1&scale=1",
    option: {},
  },
  satelliteLayer: {
    //影像底图 不含路网，不含注记
    source:
      "http://webst0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&style=6",
    option: { visible: false },
  },
  satelliteMarkLayer: {
    //影像路网 含路网，含注记
    source:
      "http://webst0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&style=8",
    option: { visible: false },
  },
  offlineLayer: {
    //离线瓦片图
    source: "http://192.168.55.221/res/map/gaode/vector/{z}/{x}/{y}.png",
    option: {},
  },
};
