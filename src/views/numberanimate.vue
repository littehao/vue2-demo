<template>
  <div id="number">{{ number }}</div>
</template>
<script>
export default {
  data() {
    return {
        number:0
    }
  },
  mounted() {
    this.animateValue1(0, 123456789, 3000)
  },
  methods: {
    animateValue1(start, end, duration) {
      let startTimestamp = null
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp
        const progress = Math.min((timestamp - startTimestamp) / duration, 1)
        this.number = Math.floor(progress * (end - start) + start)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        if (progress < 1) {
          requestAnimationFrame(step)
        }
      }
      requestAnimationFrame(step)
    },
    animateValue2() {
      // 目标数字
      const targetNumber = 12345
      // 当前数字
      let currentNumber = 0
      // 动画元素
      const numberElement = document.getElementById('number')

      function animateValue(target) {
        const range = target - currentNumber
        // 每次调用会增加或减少当前数值
        const newNumber = currentNumber + range / 20
        // 更新当前数字
        currentNumber =
          Math.abs(newNumber) >= Math.abs(range) ? target : newNumber
        // 将数字四舍五入到最接近的整数
        numberElement.textContent = Math.round(currentNumber)

        // 如果当前数字还没有达到目标数字，则继续动画
        if (currentNumber != target) {
          requestAnimationFrame(() => animateValue(target))
        }
      }

      // 触发动画
      animateValue(targetNumber)
    },
  },
}
</script>
<style lang="scss" scoped></style>
