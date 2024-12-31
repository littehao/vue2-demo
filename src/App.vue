<template>
  <div class="main">
    <!-- <div>
      <span class="btn" @click="changeLang('zh-CN')"> 中文简体 </span>
      <span class="btn" @click="changeLang('en-US')"> English </span>
      <span class="btn" @click="changeLang('zh-TW')"> 中文繁体 </span>
    </div> -->
    <!-- <router-link to="/">指纹</router-link>
    <router-link to="/directive">自定义指令</router-link>
    <router-link to="/gaodeGis">高德地图</router-link> -->
    <!-- <router-link to="/openlayers">Openlayers</router-link> -->
    <!-- <router-link to="/slider">slider</router-link> -->
    <!-- <router-link to="/web3dMap">web3dMap</router-link>
    <router-link to="/web3dMapStation">web3dMapStation</router-link>
    <router-link to="/gaode3d">gaode3d</router-link> -->
    <div class="maincontent">
      <router-view />
    </div>
  </div>
</template>

<script>
import { setLang } from "@/utils/I18N";
export default {
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    changeLang(lang) {
      setLang(lang);
    },
  },
};
</script>

<style scoped>
.maincontent {
  height: calc(100vh - 50px);
  width: 100vw;
}
.main a {
  margin: 0 10px;
}
.btn {
  cursor: pointer;
}
</style>
