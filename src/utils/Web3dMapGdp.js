import * as THREE from "three"; // 三维
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"; // 控制器
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
class chinaMap {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.width = null;
    this.height = null;
    this.renderer = null;
    this.labelRenderer = null;
    this.init();
  }

  init() {
    const dom = document.querySelector("#map").getBoundingClientRect();
    this.width = dom.width;
    this.height = dom.height;
    // 第一步新建一个场景
    this.scene = new THREE.Scene();
    //添加相机
    this.setCamera();
    // 添加光源
    this.setLight();
    // 添加渲染器
    this.setCSS2DRenderer();
    this.setRenderer();
    // 相机控件
    this.setControls();
    // 画正六棱柱
    this.createCylinderGeometry();
    // 加载地图数据
    this.loaderJson();
  }
  setCamera() {
    var width = this.width; //窗口宽度
    var height = this.height; //窗口高度
    var k = width / height; //窗口宽高比
    // var s = 200;
    var s = 20; //根据包围盒大小(行政区域经纬度分布范围大小)设置渲染范围
    //创建相机对象
    var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
    // camera.position.set(200, 300, 200); //设置相机位置
    // camera.position.set(104, 35, 200); //沿着z轴观察
    // 通过OrbitControls在控制台打印相机位置选择一个合适的位置
    camera.position.set(103, -105, 100);
    camera.lookAt(104, 35, 0); //指向中国地图的几何中心

    // camera.position.set(100, 200, 500);
    // camera.lookAt(0, 0, 0); //指向中国地图的几何中心
    this.camera = camera;
  }
  setLight() {
    // 平行光1
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(400, 200, 300);
    this.scene.add(directionalLight);
    // // 平行光2
    var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight2.position.set(-400, -200, -300);
    this.scene.add(directionalLight2);
    //环境光
    var ambient = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambient);

    //three.js辅助坐标系
    var axesHelper = new THREE.AxesHelper(100);
    this.scene.add(axesHelper);
  }
  setControls() {
    var controls = new OrbitControls(this.camera, this.renderer.domElement);
    // 相机控件与.lookAt()无效( .target属性 )
    controls.target.set(104, 35, 0);
    controls.update(); //update()函数内会执行camera.lookAt(controls.target)

    // controls.addEventListener("change", () => {
    //   console.log("change", this.camera.position);
    // });
  }
  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true, //开启锯齿
    });
    this.renderer.setSize(this.width, this.height); //设置渲染区域尺寸
    // renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
    document.querySelector("#map").appendChild(this.renderer.domElement);
    // 渲染函数
    const _this = this;
    function render() {
      //渲染场景中的HTMl元素包装成的CSS3模型对象
      _this.labelRenderer.render(_this.scene, _this.camera);
      _this.renderer.render(_this.scene, _this.camera); //执行渲染操作
      requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
      // console.log(_this.camera.position);
    }
    render();

    // 监听窗口尺寸变化
    window.addEventListener("resize", () => {
      this.changeSize();
    });
  }
  // 监听尺寸变化
  changeSize() {
    // 重置渲染器输出画布canvas尺寸
    const dom = document.querySelector("#map").getBoundingClientRect();
    this.width = dom.width;
    this.height = dom.height;
    this.renderer.setSize(this.width, this.height);
    this.labelRenderer.setSize(this.width, this.height);
    const k = this.width / this.height; // 窗口宽高比
    // 重置相机投影的相关参数
    this.camera.aspect = k;
    // 如果相机的一些属性发生了变化，
    // 需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
    this.camera.updateProjectionMatrix();
  }
  // 加载数据渲染
  loaderJson() {
    //three.js文件加载类FileLoader：封装了XMLHttpRequest
    var loader = new THREE.FileLoader();
    loader.setResponseType("json");
    // 组对象mapGroup是所有国家边界Line模型的父对象
    var mapGroup = new THREE.Group();
    this.scene.add(mapGroup);
    var lineGroup = new THREE.Group(); //边界线组
    mapGroup.add(lineGroup);
    var meshGroup = new THREE.Group(); //轮廓Mesh组
    mapGroup.add(meshGroup);

    var stretchHeight = 5; //地图轮廓拉伸高度
    lineGroup.position.z = stretchHeight + stretchHeight * 0.1; //适当偏移解决深度冲突
    loader.load("/data/gdp.json", (data) => {
      var gdpObj = {}; //每个省份的名字作为属性，属性值是国家对应GDP
      var gdpMax = 120000; //设置一个基准值,以最高的广州gdp为准
      data.arr.forEach(function (obj) {
        var gdp = obj.value; //当前省份GDP
        gdpObj[obj.name] = gdp; //每个省份的名字作为属性，属性值是国家对应GDP
      });
      // console.log("gdpObj---------", gdpObj);
      var prismGroup = new THREE.Group();
      prismGroup.position.z = stretchHeight; //适当偏移，以免深度冲突
      this.scene.add(prismGroup);
      loader.load("/data/china1.json", (data2) => {
        var color1 = new THREE.Color(0xffff00);
        var color2 = new THREE.Color(0xff0000); //最大数值对应柱子颜
        // 访问所有省份边界坐标数据：data.features
        data2.features.forEach((area) => {
          // "Polygon"：省份area有一个封闭轮廓
          //"MultiPolygon"：省份area有多个封闭轮廓
          if (area.geometry.type === "Polygon") {
            // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
            area.geometry.coordinates = [area.geometry.coordinates];
          }
          // 解析所有封闭轮廓边界坐标area.geometry.coordinates
          lineGroup.add(this.drawLine(area.geometry.coordinates)); //省份边界轮廓插入组对象mapGroup
          // height：根据行政区尺寸范围设置，比如高度设置为地图尺寸范围的2%、5%等，过小感觉不到高度，过大太高了
          var height = stretchHeight; //拉伸高度
          meshGroup.add(this.extrudeMesh(area.geometry.coordinates, height)); //省份轮廓拉伸Mesh插入组对象mapGroup

          var name = area.properties.name; //省份名
          if (name) {
            var gdp = gdpObj[name];
            if (gdp == undefined) console.log(area.properties);
            var center = area.properties.center; //行政区几何中心经纬度坐标
            // console.log(name, gdp, center);
            // 颜色插值计算
            var color = color1.clone().lerp(color2.clone(), gdp / gdpMax);
            var barH = (gdp / gdpMax) * 10;

            var mesh = this.prismMesh(
              center[0],
              center[1],
              0.5,
              barH,
              color.getHex()
            );
            prismGroup.add(mesh);

            // 柱子上方标注标签
            var tag2D = this.createTag(name);
            tag2D.position.set(center[0], center[1], barH + stretchHeight);
            this.scene.add(tag2D);
          }
        });
        // 地图底部边界线
        var lineGroup2 = lineGroup.clone();
        mapGroup.add(lineGroup2);
        lineGroup2.position.z = -stretchHeight * 0.1; //适当偏移解决深度冲突
      });
    });
  }
  //边界线
  drawLine(pointsArrs) {
    var group = new THREE.Group(); //一个国家多个轮廓线条line的父对象
    pointsArrs.forEach((polygon) => {
      var pointArr = []; //边界线顶点坐标
      polygon[0].forEach((elem) => {
        pointArr.push(elem[0], elem[1], 0);
      });
      group.add(this.drawLoopLine(pointArr));
    });
    return group;
  }
  //一个封闭轮廓线条
  drawLoopLine(pointArr) {
    /**
     * 通过BufferGeometry构建一个几何体，传入顶点数据
     * 通过Line模型渲染几何体，连点成线
     * LineLoop和Line功能一样，区别在于首尾顶点相连，轮廓闭合
     */
    var geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象
    //类型数组创建顶点数据
    var vertices = new Float32Array(pointArr);
    // 创建属性缓冲区对象
    var attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组，表示一个顶点的xyz坐标
    // 设置几何体attributes属性的位置属性
    geometry.attributes.position = attribue;
    // 线条渲染几何体顶点数据
    var material = new THREE.LineBasicMaterial({
      color: 0x00cccc, //线条颜色
    }); //材质对象
    // var line = new THREE.Line(geometry, material);//线条模型对象
    var line = new THREE.LineLoop(geometry, material); //首尾顶点连线，轮廓闭合
    return line;
  }
  extrudeMesh(pointsArrs, height) {
    var shapeArr = []; //轮廓形状Shape集合
    pointsArrs.forEach((pointsArr) => {
      var vector2Arr = [];
      // 转化为Vector2构成的顶点数组
      pointsArr[0].forEach((elem) => {
        vector2Arr.push(new THREE.Vector2(elem[0], elem[1]));
      });
      var shape = new THREE.Shape(vector2Arr);
      shapeArr.push(shape);
    });
    // MeshBasicMaterial:不受光照影响
    // MeshLambertMaterial：几何体表面和光线角度不同，明暗不同
    var material = new THREE.MeshLambertMaterial({
      color: 0x004444,
      // transparent: true,
      // opacity: 0.8,
    }); //材质对象
    var geometry = new THREE.ExtrudeGeometry( //拉伸造型
      shapeArr, //多个多边形二维轮廓
      //拉伸参数
      {
        // depth：根据行政区尺寸范围设置，比如高度设置为尺寸范围的2%，过小感觉不到高度，过大太高了
        depth: height, //拉伸高度
        bevelEnabled: false, //无倒角
      }
    );
    var mesh = new THREE.Mesh(geometry, material); //网格模型对象
    return mesh;
  }
  createCylinderGeometry() {
    var geometry = new THREE.CylinderGeometry(1, 1, 1, 6); //正六棱柱
    geometry.computeVertexNormals(); //一种计算顶点法线方式，非光滑渲染
    geometry.rotateX(Math.PI / 2);
    geometry.translate(0, 0, 0.5);
    this.cylinderGeometry = geometry;
  }
  prismMesh(x, y, size, height, color) {
    // MeshBasicMaterial:不受光照影响
    // MeshLambertMaterial：几何体表面和光线角度不同，明暗不同
    var material = new THREE.MeshLambertMaterial({
      color: color,
    });
    var mesh = new THREE.Mesh(this.cylinderGeometry, material); //网格模型对象
    mesh.position.set(x, y, 0); //圆圈位置设置
    mesh.scale.set(size, size, height); //柱子粗细和宽高设置
    return mesh;
  }
  createTag(name) {
    // 创建div元素(作为标签)
    var div = document.createElement("div");
    div.innerHTML = name;
    div.style.padding = "4px 10px";
    div.style.color = "#fff";
    div.style.fontSize = "16px";
    div.style.position = "absolute";
    div.style.backgroundColor = "rgba(25,25,25,0.5)";
    div.style.borderRadius = "5px";
    // div.style.marginLeft = '50px';//HTML标签偏移
    div.style.marginLeft = name.length * 8 + 20 + "px"; //HTML标签偏移
    div.style.marginTop = "-8px"; //HTML标签偏移
    // 这里无法去读宽高度，说明还未渲染导致
    console.log(div.offsetWidth);
    //div元素包装为CSS2模型对象CSS2DObject
    var label = new CSS2DObject(div);
    div.style.pointerEvents = "none"; //避免HTML标签遮挡三维场景的鼠标事件
    // 设置HTML元素标签在three.js世界坐标中位置
    // label.position.set(x, y, z);
    return label; //返回CSS2模型标签
  }
  setCSS2DRenderer() {
    // 创建一个CSS2渲染器CSS2DRenderer
    var labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(this.width, this.height);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0px";
    labelRenderer.domElement.style.left = "0px";
    // //设置.pointerEvents=none，以免模型标签HTML元素遮挡鼠标选择场景模型
    labelRenderer.domElement.style.pointerEvents = "none";
    this.labelRenderer = labelRenderer;
    document.querySelector("#map").appendChild(this.labelRenderer.domElement);
  }
}

export default chinaMap;
