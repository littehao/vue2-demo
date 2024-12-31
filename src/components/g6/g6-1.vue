<template>
  <div id="mountNode"></div>
</template>
<script>
import G6 from "@antv/g6";
export default {
  name: "TestG6one",
  data() {
    return {};
  },
  mounted() {
    const data = {
      nodes: [
        {
          id: "node1",
          x: 250,
          y: 150,
          comboId: "child-comboId",
        },
        {
          id: "node2",
          x: 350,
          y: 150,
          comboId: "child-comboId",
        },
        {
          id: "node3",
          x: 250,
          y: 300,
          comboId: "child-comboId",
        },
        {
          id: "node4",
          x: 450,
          y: 300,
          comboId: "child-comboId",
        },
      ],
      edges: [
        {
          source: "node1",
          target: "node2",
        },
        {
          source: "node2",
          target: "node3",
        },
        {
          source: "node3",
          target: "node4",
        },
      ],
      combos: [
        {
          id: "comboId1",
        },
        {
          id: "comboId2",
        },
        {
          id: "comboId3",
        },
        {
          id: "child-comboId",
          label: "Combo1",
          parentId: "comboId1",
        },
      ],
    };

    const width = document.getElementById("mountNode").scrollWidth;
    const height = document.getElementById("mountNode").scrollHeight || 500;
    const graph = new G6.Graph({
      container: "mountNode",
      width,
      height,
      fitCenter: true,
      groupByTypes: false,
      modes: {
        default: ["drag-canvas", "drag-node", "drag-combo"],
      },
      defaultCombo: {
        type: "rect",
        padding: [30, 30, 30, 30],
        labelCfg: {
          style: {
            fontSize: 18,
          },
        },
      },
    });

    graph.data(data);
    graph.render();

    graph.on("combo:mouseenter", (evt) => {
      const { item } = evt;
      graph.setItemState(item, "active", true);
    });

    graph.on("combo:mouseleave", (evt) => {
      const { item } = evt;
      graph.setItemState(item, "active", false);
    });
    graph.on("combo:click", (evt) => {
      const { item } = evt;
      graph.setItemState(item, "selected", true);
    });
    graph.on("canvas:click", () => {
      graph.getCombos().forEach((combo) => {
        graph.clearItemStates(combo);
      });
    });
  },
};
</script>
<style lang="scss" scoped>
#mountNode {
  width: 1000px;
  height: 800px;
}
</style>
