import * as THREE from "three"; // 三维
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"; // 控制器
import Pieimg from "@/assets/img/pie.png";
class web3dMapStation {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.width = null;
    this.height = null;
    this.renderer = null;
    this.labelRenderer = null;
    this.mapGroup = new THREE.Group();
    this.cityPointGroup = new THREE.Group();
    this.coneMarkGroup = new THREE.Group();
    this.stationList = [];
    this.init();
  }
  init() {
    const dom = document.querySelector("#map").getBoundingClientRect();
    this.width = dom.width;
    this.height = dom.height;
    // 第一步新建一个场景
    this.scene = new THREE.Scene();
    // 组对象mapGroup是所有国家边界Line模型的父对象
    this.scene.add(this.mapGroup);
    this.mapGroup.add(this.cityPointGroup);
    this.mapGroup.add(this.coneMarkGroup);
    //添加相机
    this.setCamera();
    // 添加光源
    this.setLight();
    // 添加渲染器
    this.setCSS2DRenderer();
    this.setRenderer();
    // 相机控件
    this.setControls();
    // 加载地图数据
    this.loaderMap();
    //
    // this.createGeometry();
  }
  setCamera() {
    var width = this.width; //窗口宽度
    var height = this.height; //窗口高度
    var k = width / height; //窗口宽高比
    var s = 25; //根据包围盒大小(行政区域经纬度分布范围大小)设置渲染范围
    //创建相机对象
    this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
    this.camera.position.set(103, -50, 100); //沿着z轴观察
    this.camera.lookAt(104, 28, 0); //指向中国地图的几何中心
  }
  setLight() {
    // 平行光1
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(400, 200, 300);
    this.scene.add(directionalLight);
    //环境光
    var ambient = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambient);

    //three.js辅助坐标系
    var axesHelper = new THREE.AxesHelper(100);
    this.scene.add(axesHelper);
  }
  setCSS2DRenderer() {}
  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true, //开启锯齿
    });
    this.renderer.setSize(this.width, this.height); //设置渲染区域尺寸
    // this.renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
    document.querySelector("#map").appendChild(this.renderer.domElement);
    // 渲染函数
    const _this = this;
    function render() {
      if (_this.cityPointGroup.children.length) {
        _this.cityPointGroup.children.forEach(function (mesh) {
          mesh._s += 0.02;
          mesh.scale.set(mesh._s, mesh._s, mesh._s);
          if (mesh._s <= 2.6) {
            mesh.material.opacity = (mesh._s - 2.0) * 1.67; //1.67约等于1/(2.6-2.0)，保证透明度在0~1之间变化
          } else if (mesh._s > 2.6 && mesh._s <= 5) {
            mesh.material.opacity = 1 - (mesh._s - 2) / 3; //缩放5.0对应0 缩放2.0对应1
          } else {
            mesh._s = 2.0;
          }
        });
      }
      if (_this.coneMarkGroup.children.length) {
        _this.coneMarkGroup.children.forEach((mesh) => {
          mesh.rotateZ(0.01);
        });
      }
      //渲染场景中的HTMl元素包装成的CSS3模型对象
      // _this.labelRenderer.render(_this.scene, _this.camera);
      _this.renderer.render(_this.scene, _this.camera); //执行渲染操作
      requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
      // console.log(_this.camera.position);
    }
    render();
  }
  setControls() {
    var controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target.set(104, 28, 0);
    controls.update();
  }
  // 初始绘制其他形状
  createGeometry() {
    // const geometry = new THREE.BoxGeometry(10, 10, 10);
    // const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // this.scene.add(cube);
  }
  loaderMap() {
    const loader = new THREE.FileLoader();
    loader.setResponseType("json");
    const lineGroup = new THREE.Group(); //边界线组
    this.mapGroup.add(lineGroup);
    const meshGroup = new THREE.Group(); //轮廓Mesh组
    this.mapGroup.add(meshGroup);

    const stretchHeight = 1; //地图轮廓拉伸高度
    lineGroup.position.z = stretchHeight + stretchHeight * 0.1; //适当偏移解决深度冲突
    loader.load("/data/china.json", (data) => {
      // 访问所有省份边界坐标数据：data.features
      data.features.forEach((area) => {
        if (area.geometry.type === "Polygon") {
          area.geometry.coordinates = [area.geometry.coordinates];
        }
        // 解析所有封闭轮廓边界坐标area.geometry.coordinates
        const height = 1; //拉伸高度
        lineGroup.add(this.drawLine(area.geometry.coordinates)); //省份边界轮廓插入组对象mapGroup
        meshGroup.add(this.extrudeGeometry(area.geometry.coordinates, height)); //省份轮廓Mesh插入组对象mapGroup
      });
      // 地图底部边界线
      var lineGroup2 = lineGroup.clone();
      this.mapGroup.add(lineGroup2);
      lineGroup2.position.z = -stretchHeight * 0.1; //适当偏移解决深度冲突
    });
  }
  cityPointMesh() {
    // 矩形平面网格模型设置背景透明的png贴图
    var geometry = new THREE.PlaneGeometry(1, 1); //默认在XOY平面上
    var textureLoader = new THREE.TextureLoader(); // TextureLoader创建一个纹理加载器对象
    var texture = textureLoader.load(Pieimg);
    return function (size, x, y) {
      var material = new THREE.MeshBasicMaterial({
        color: 0x00ffff, //设置光圈颜色
        map: texture,
        transparent: true, //使用背景透明的png贴图，注意开启透明计算
        // side: THREE.DoubleSide, //双面可见
      });
      var mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(size, size, size); //设置mesh大小
      mesh.position.set(x, y, 0); //设置mesh位置
      return mesh;
    };
  }
  markDo(areas) {
    areas.forEach((item) => {
      // 标注出来省份的行政中心
      const pos = item.cp; //每个省份行政中心位置经纬度
      const size = Math.random() * 3 + 2; //2~5之间随机,表示mesh.size缩放倍数
      const mark = this.cityPointMesh();
      const mesh = mark(size, pos[0], pos[1]);
      mesh.position.z = 1.2;
      mesh._s = size; //mesh自定义一个属性表征大小
      this.cityPointGroup.add(mesh);

      const cone = this.coneMesh(0.5, pos[0], pos[1]);
      cone.position.z = 1;
      this.coneMarkGroup.add(cone);
    });
  }
  coneMesh(size, x, y) {
    var height = size * 4; //棱锥高度
    var radius = size; //半径
    //  ConeBufferGeometry  ConeGeometry
    // 圆锥体几何体API(ConeGeometry)圆周方向四等分实现四棱锥效果
    var geometry = new THREE.ConeGeometry(radius, height, 4);
    // 缓冲类型几何体BufferGeometry没有computeFlatVertexNormals方法
    geometry.computeVertexNormals(); //一种计算顶点法线方式，非光滑渲染
    // 可以根据需要旋转到特定角度
    // geometry.rotateX(Math.PI);
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(0, 0, height / 2);
    // MeshBasicMaterial MeshLambertMaterial
    var material = new THREE.MeshLambertMaterial({
      color: 0x00ffff,
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, 0);
    return mesh;
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
  // 绘制区域形状
  extrudeGeometry(pointsArrs, height) {
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
  drawLoopLine(pointArr) {
    var geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象
    //类型数组创建顶点数据
    var vertices = new Float32Array(pointArr);
    // 创建属性缓冲区对象
    var attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组，表示一个顶点的xyz坐标
    // 设置几何体attributes属性的位置属性
    geometry.attributes.position = attribue;
    // 线条渲染几何体顶点数据
    var material = new THREE.LineBasicMaterial({
      color: 0x00ffff, //线条颜色
    }); //材质对象
    // var line = new THREE.Line(geometry, material);//线条模型对象
    var line = new THREE.LineLoop(geometry, material); //首尾顶点连线，轮廓闭合
    return line;
  }
  changeSize() {
    this.clientWidth = this.$refs.map.clientWidth;
    this.clientHeight = this.$refs.map.clientHeight;
    // 重置渲染器输出画布canvas尺寸
    this.renderer.setSize(this.clientWidth, this.clientHeight);
    const k = this.clientWidth / this.clientHeight; // 窗口宽高比
    // 重置相机投影的相关参数
    this.camera.aspect = k;
    // 如果相机的一些属性发生了变化，
    // 需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
    this.camera.updateProjectionMatrix();
  }
}

export default web3dMapStation;
