const config = {
  geoserver: "http://192.168.55.111:8090",
};
export default class {
  /**
   * 获取基础路径
   *
   * @return 基础路径
   */
  static basePath() {
    return "/geoserver/xixian/ows";
  }

  /**
   * 服务区点数据
   *
   * @param data 数据
   * @return 请求对象
   */
  static queryFuwuqu() {
    const url = `${
      config.geoserver
    }${this.basePath()}?service=WFS&version=1.0.0&request=GetFeature&typeName=xixian%3Afuwuqu&maxFeatures=50&outputFormat=application%2Fjson`;
    return fetch(url, {
      method: "GET",
    }).then((response) => response.json());
  }
  /**
   * 查询路线数据
   *
   * @param data 数据
   * @return 请求对象
   */
  static queryLuxian() {
    const url = `${
      config.geoserver
    }${this.basePath()}?service=WFS&version=1.0.0&request=GetFeature&typeName=xixian%3Aluxian&maxFeatures=50&outputFormat=application%2Fjson`;
    return fetch(url, {
      method: "GET",
    }).then((response) => response.json());
  }
  /**
   * 查询收费站数据
   *
   * @param data 数据
   * @return 请求对象
   */
  static queryShoufeizhan() {
    const url = `${
      config.geoserver
    }${this.basePath()}?service=WFS&version=1.0.0&request=GetFeature&typeName=xixian%3Ashoufeizhan&maxFeatures=50&outputFormat=application%2Fjson`;
    return fetch(url, {
      method: "GET",
    }).then((response) => response.json());
  }
}
