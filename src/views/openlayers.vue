<template>
  <div class="openlayersPage">
    <el-tabs
      v-model="activeName"
      :tab-position="tabPosition"
      style="height: 100%; min-width: 200px"
    >
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item.label"
        :name="item.component"
      />
    </el-tabs>
    <div style="flex: 1; padding-right: 20px">
      <component :is="activeName"></component>
    </div>
  </div>
</template>
<script>
import I18N from "@/utils/I18N";

import openlayers from "@/components/openlayers/openlayers.vue";
import openlayers1 from "@/components/openlayers/openlayers1.vue";
import openlayers2 from "@/components/openlayers/openlayers2.vue";
import openlayers3 from "@/components/openlayers/openlayers3.vue";
import openlayers4 from "@/components/openlayers/openlayers4.vue";
import openlayers5 from "@/components/openlayers/openlayers5.vue";
import openlayers6 from "@/components/openlayers/openlayers6.vue";
import openlayers7 from "@/components/openlayers/openlayers7.vue";
import openlayers8 from "@/components/openlayers/openlayers8.vue";
import openlayers9 from "@/components/openlayers/openlayers9.vue";
import openlayers10 from "@/components/openlayers/openlayers10.vue";
import openlayers11 from "@/components/openlayers/openlayers11.vue";
import openlayers12 from "@/components/openlayers/openlayers12.vue";
import openlayers13 from "@/components/openlayers/openlayers13.vue";
import openlayers14 from "@/components/openlayers/openlayers14.vue";
import openlayers15 from "@/components/openlayers/openlayers15.vue";
import openlayers16 from "@/components/openlayers/openlayers16.vue";
import openlayers17 from "@/components/openlayers/openlayers17.vue";
import openlayers18 from "@/components/openlayers/openlayers18.vue";
export default {
  name: "OpenLayers",
  components: {
    openlayers,
    openlayers1,
    openlayers2,
    openlayers3,
    openlayers4,
    openlayers5,
    openlayers6,
    openlayers7,
    openlayers8,
    openlayers9,
    openlayers10,
    openlayers11,
    openlayers12,
    openlayers13,
    openlayers14,
    openlayers15,
    openlayers16,
    openlayers17,
    openlayers18
  },
  data() {
    return {
      tabPosition: "left",
      activeName: "openlayers18",
      tabList: [
        { label: I18N.common.chuCiShiYong, component: "openlayers" },
        { label: I18N.common.gouJianDianYaoSu, component: "openlayers1" },
        { label: I18N.common.chuangJianGEO, component: "openlayers2" },
        { label: I18N.common.jiaZaiBenDiG, component: "openlayers4" },
        { label: I18N.common.jiaZaiWangLuoG, component: "openlayers5" },
        { label: I18N.common.chuangJianXianHeQu, component: "openlayers3" },
        { label: I18N.common.feiXingShiJiaoMan, component: "openlayers6" },
        { label: I18N.common.tianJiaTuPianBiao, component: "openlayers7" },
        { label: I18N.common.tianJiaWenZiBiao, component: "openlayers8" },
        { label: I18N.common.tianJiaTuWenBiao, component: "openlayers9" },
        { label: I18N.common.zhanDianLianXian, component: "openlayers10" },
        { label: I18N.common.zhanDianHOV, component: "openlayers11" },
        { label: I18N.common.zhanDianCaoZuoXian, component: "openlayers12" },
        { label: I18N.common.tuoZhuaiCaoZuo, component: "openlayers13" },
        { label: I18N.common.juHeBiaoZhu, component: "openlayers14" },
        { label: "计算距离故障点", component: "openlayers15" },
        { label: "百度地图坐标转换", component: "openlayers16" },
        { label: "百度地图2", component: "openlayers17" },
        { label: "百度地图3", component: "openlayers18" },
      ],
    };
  },
  mounted() {
    this.activeName = this.$route.query.name || "openlayers18";
  },
  methods: {},
};
</script>
<style lang="scss">
#map {
  width: 100%;
  height: 80vh;
  position: relative;
}
.openlayersPage {
  padding-top: 20px;
  display: flex;
}
</style>
