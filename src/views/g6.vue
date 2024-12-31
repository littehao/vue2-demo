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
import g6one from "@/components/g6/g6-1.vue";
export default {
  name: "TestG6",
  components: {
    g6one,
  },
  data() {
    return {
      tabPosition: "left",
      activeName: "g6one",
      tabList: [{ label: "初次使用", component: "g6one" }],
    };
  },
  mounted() {
    this.activeName = this.$route.query.name || "g6one";
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
