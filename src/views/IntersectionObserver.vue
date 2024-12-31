<template>
  <div class="box" style="height: 400px; overflow-y: auto">
    <div v-for="item in dataList" :key="item.name">{{ item.name }}</div>
    <div class="loadmore"></div>
  </div>
</template>
<script>
export default {
  name: "LoadMore",
  data() {
    return {
      list: [],
      dataList: [],
      page: 1,
      size: 50,
    };
  },
  created() {
    const arr = [];
    for (let index = 0; index < 10000; index++) {
      arr.push({
        name: "张" + index,
      });
    }
    this.list = arr;
    this.dataList = arr.slice(this.page, this.size);
  },
  mounted() {
    const observer = new IntersectionObserver(
      (entries) => {
        // 创建IntersectionObserver对象
        console.log(entries);
        if (entries[0].isIntersecting) {
          this.page++;
          this.dataList = this.dataList.concat(
            this.list.slice((this.page - 1) * this.size, this.page * this.size)
          );
        }
      },
      {
        root: document.querySelector(".box"),
        threshold: 0,
      }
    );
    const portItems = document.querySelector(".loadmore");
    observer.observe(portItems);
  },
};
</script>
<style lang="scss" scoped></style>
