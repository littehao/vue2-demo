<template>
  <div class="container">
    <div v-for="(item,index) in jbList" :key="index" class="coin"  style="--toY: 400px;":style="{'--toX':`${item.x}px`,'--delay': `${item.delay}s`}">
      <img class="coin-img" src="@/assets/img/money2.png" alt="">
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      jbList:[]
    }
  },
  mounted() {
    const arr = []
    for(let i = 0; i < 20; i++){
      arr.push({x:(Math.random() * 400).toFixed(1),delay:(Math.random() * 0.5).toFixed(1)})
    }
    this.jbList = arr
    // console.log(this.jbList)
  },
}
</script>
<style lang="scss">
.container {
  position: relative;
  width: 300px;
  height: 300px;
}

.coin {
  position: absolute;
  width: 20px;
  height: 20px;
  // background-color: gold;
  color: white;
  line-height: 20px;
  text-align: center;
  animation: fly 0.5s ease-in-out forwards;
  animation-delay: var(--delay);
}
.coin-img{
  width:100%;
  height:100%;
}


@keyframes fly {
  from {
    transform: translate(var(--toX), var(--toY));
  }
  to {
    transform: translate(0, 0);
  }
}
</style>
