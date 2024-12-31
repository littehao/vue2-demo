<template>
  <div id="map" ref="map"></div>
</template>

<script>
import * as THREE from "three"; // 三维
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import AMapLoader from "@amap/amap-jsapi-loader";
import Pieimg from "@/assets/img/pie.png";
import greenline from "@/assets/img/greenline.png";
import afsNormal from "@/assets/img/topo/afs_normal.png";
export default {
  name: "OpenLayersMap",
  data() {
    return {
      map: null,
      camera: null,
      renderer: null,
      scene: null,
      customCoords: null,
      dataList: [],
      regionList: [
        {
          name: "站点1",
          id: 1,
          to: 2,
          from: null,
          lngLats: [116.323907, 40.0568],
        },
        {
          name: "站点2",
          id: 2,
          to: 3,
          from: 1,
          lngLats: [116.48198, 40.151074],
        },
        {
          name: "站点3",
          id: 3,
          to: 4,
          from: 2,
          lngLats: [116.400457, 40.014621],
        },
        {
          name: "站点4",
          id: 4,
          to: 5,
          from: 2,
          lngLats: [116.332666, 39.934353],
        },
        {
          name: "站点5",
          id: 5,
          to: null,
          from: 4,
          lngLats: [116.247576, 39.933799],
        },
      ],
      mapGroup: new THREE.Group(),
      cityPointGroup: new THREE.Group(),
      coneMarkGroup: new THREE.Group(),
      width: 0,
      height: 0,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const dom = document.querySelector("#map").getBoundingClientRect();
      this.width = dom.width;
      this.height = dom.height;
      this.setMap();
    },
    setMap() {
      AMapLoader.load({
        key: "8d15038ff9774eea60ff832f27f59d6b", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [""], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          this.map = new AMap.Map("map", {
            //设置地图容器id
            center: [116.323907, 40.0568],
            turboMode: true,
            zooms: [2, 20],
            zoom: 12,
            viewMode: "3D",
            pitch: 40,
            mapStyle: "amap://styles/darkblue",
            skyColor: "#020721",
          });
          // 数据转换工具
          this.customCoords = this.map.customCoords;
          this.regionList.forEach((i) => {
            i.coords = this.customCoords.lngLatsToCoords(i.lngLats);
          });
          console.log(" this.regionList-------", this.regionList);

          const gllayer = new AMap.GLCustomLayer({
            zIndex: 10,
            init: (gl) => {
              this.setGLCustomLayer(gl);
            },
            render: () => {
              this.setRender();
            },
          });
          this.map.add(gllayer);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    setGLCustomLayer(gl) {
      this.camera = new THREE.PerspectiveCamera(
        60,
        this.width / this.height,
        100,
        1 << 30
      );
      this.renderer = new THREE.WebGLRenderer({
        context: gl, // 地图的 gl 上下文
        canvas: gl.canvas,
      });
      // 自动清空画布这里必须设置为 false，否则地图底图将无法显示
      this.renderer.autoClear = false;
      // 第一步新建一个场景
      this.scene = new THREE.Scene();
      this.scene.add(this.mapGroup);
      this.mapGroup.add(this.coneMarkGroup);
      this.mapGroup.add(this.cityPointGroup);

      this.setLight();
      this.animate();
      this.createGeometry();
      this.markDo();
      this.createCatmullRomCurve3();
      this.createCSS2DRenderer();
      // this.createCircleGeometry();
      window.addEventListener("resize", this.onWindowResize);
    },
    createCSS2DRenderer() {
      this.labelRenderer = new CSS2DRenderer();
      this.labelRenderer.setSize(this.width, this.height);
      this.labelRenderer.domElement.style.position = "absolute";
      // 避免renderer.domElement影响HTMl标签定位，设置top为0px
      this.labelRenderer.domElement.style.top = "0px";
      this.labelRenderer.domElement.style.left = "0px";
      //设置.pointerEvents=none，以免模型标签HTML元素遮挡鼠标选择场景模型
      this.labelRenderer.domElement.style.pointerEvents = "none";
      document.querySelector("#map").appendChild(this.labelRenderer.domElement);
    },
    // 初始绘制其他形状
    createGeometry() {
      var mat = new THREE.MeshLambertMaterial({
        color: 0xfff0f0,
        opacity: 0.5,
        transparent: true,
      });
      var geo = new THREE.BoxGeometry(1, 1, 1);
      for (let i = 0; i < this.regionList.length; i++) {
        const pos = this.regionList[i]["coords"][0];
        const item = { name: this.regionList[i]["name"] };
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(pos[0], pos[1], 1000);
        mesh.add(this.createSpriteMaterial());
        mesh.add(this.createLableText(item));
        this.coneMarkGroup.add(mesh);
      }
    },
    //雷达扫描的实现
    createCircleGeometry() {
      const radarGeometry = new THREE.CircleGeometry(2000, 32);
      const radarMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.BackSide,
      });
      this.radarMesh = new THREE.Mesh(radarGeometry, radarMaterial);
      this.coneMarkGroup.children[0].add(this.radarMesh);
      // this.mapGroup.add(this.radarMesh);
    },
    createSpriteMaterial() {
      const map = new THREE.TextureLoader().load(afsNormal);
      const material = new THREE.SpriteMaterial({
        map: map,
        transparent: true,
      });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(1000, 1000, 1000);
      sprite.position.z = -550;
      return sprite;
    },
    createLableText(item) {
      var div = document.createElement("div");
      div.innerHTML = item.name;
      div.style.padding = "5px 10px";
      div.style.color = "#fff";
      div.style.fontSize = "14px";
      div.style.position = "absolute";
      div.style.backgroundColor = "rgba(255,255,255,0.2)";
      div.style.borderRadius = "5px";
      const label = new CSS2DObject(div);
      label.position.z = 500;
      return label;
    },
    createCatmullRomCurve3() {
      //Create a closed wavey loop
      var textureLoader = new THREE.TextureLoader(); // TextureLoader创建一个纹理加载器对象
      this.texture = textureLoader.load(greenline);
      this.texture.repeat.set(2, 1);
      this.texture.needsUpdate = true;
      this.texture.wrapS = THREE.RepeatWrapping;
      this.texture.wrapT = THREE.RepeatWrapping;
      // 定义控制点
      const points = [];
      const pots = [];
      this.regionList.forEach((item) => {
        if (item.from) {
          const region = this.regionList.find((i) => item.from === i.id);
          if (region) {
            pots.push([
              new THREE.Vector3(region.coords[0][0], region.coords[0][1], 0),
              new THREE.Vector3(item.coords[0][0], item.coords[0][1], 0),
            ]);
          }
        }
      });
      pots.forEach((item) => {
        const middle = new THREE.Vector3(0, 0, 0);
        middle.add(item[0]).add(item[1]).divideScalar(2);
        const H = 1000; //轨迹线高度，注意考虑两点距离来设置
        middle.z += H;
        points.push([item[0], middle, item[1]]);
      });
      points.forEach((item) => {
        const curve = new THREE.CatmullRomCurve3(item);
        const geometry = new THREE.TubeGeometry(curve, 100, 50, 10, false);
        const material = new THREE.MeshBasicMaterial({
          color: 0xfff000,
          map: this.texture,
          side: THREE.DoubleSide,
          transparent: true,
        });
        const curveObject = new THREE.Mesh(geometry, material);
        curveObject.position.z = 100;
        this.mapGroup.add(curveObject);
      });
    },
    markDo() {
      const size = Math.random() * 3 + 2; //2~5之间随机,表示mesh.size缩放倍数
      const mark = this.cityPointMesh();
      const coneItem = this.coneMesh(500);
      for (let i = 0; i < this.regionList.length; i++) {
        const pos = this.regionList[i]["coords"][0];
        const mesh = mark(size, pos[0], pos[1]);
        mesh.name = this.regionList[i]["name"];
        mesh._s = size; //mesh自定义一个属性表征大小
        this.cityPointGroup.add(mesh);

        const cone = coneItem(pos[0], pos[1]);
        cone.name = this.regionList[i]["name"];
        // this.coneMarkGroup.add(cone);
      }
    },
    cityPointMesh() {
      // 矩形平面网格模型设置背景透明的png贴图
      var geometry = new THREE.PlaneGeometry(500, 500); //默认在XOY平面上
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
    },
    coneMesh(size) {
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
      return function (x, y) {
        var material = new THREE.MeshLambertMaterial({
          color: 0x00ffff,
        });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, 0);
        return mesh;
      };
    },
    setLight() {
      // 环境光照和平行光
      var aLight = new THREE.AmbientLight(0xffffff, 0.3);
      var dLight = new THREE.DirectionalLight(0xffffff, 1);
      dLight.position.set(1000, -100, 900);
      this.scene.add(dLight);
      this.scene.add(aLight);

      //three.js辅助坐标系
      // var axesHelper = new THREE.AxesHelper(100);
      // this.scene.add(axesHelper);
    },
    setRender() {
      // 这里必须执行！！重新设置 three 的 gl 上下文状态。
      this.renderer.resetState();
      // this.customCoords.setCenter([116.52, 39.79]);
      const { near, far, fov, up, lookAt, position } =
        this.customCoords.getCameraParams();
      this.camera.near = near;
      this.camera.far = far;
      this.camera.fov = fov;
      this.camera.position.set(...position);
      this.camera.up.set(...up);
      this.camera.lookAt(...lookAt);
      this.camera.updateProjectionMatrix();
      this.renderer.render(this.scene, this.camera);
      // 这里必须执行！！重新设置 three 的 gl 上下文状态。
      this.renderer.resetState();
    },
    animate() {
      if (this.cityPointGroup.children.length) {
        this.cityPointGroup.children.forEach(function (mesh) {
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
      // 更新雷达扫描效果
      // if (this.radarMesh) this.radarMesh.rotation.z += 0.01;
      // if (this.coneMarkGroup.children.length) {
      //   this.coneMarkGroup.children.forEach((mesh) => {
      //     mesh.rotateZ(0.05);
      //   });
      // }
      if (this.texture) this.texture.offset.x -= 0.01;
      this.map.render();
      if (this.labelRenderer)
        this.labelRenderer.render(this.scene, this.camera);
      requestAnimationFrame(this.animate);
    },
    onWindowResize() {
      const dom = document.querySelector("#map").getBoundingClientRect();
      this.width = dom.width;
      this.height = dom.height;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    },
  },
};
</script>
<style lang="scss" scoped>
#map {
  width: 100%;
  height: 100%;
  background-color: #000;
  position: relative;
}
</style>
