<template>
  <div>
    <img id="clickableImage" src="@/assets/logo.png" alt="" />
    <div id="score">积分：0</div>
    <div id="pointsContainer"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  mounted() {
    document
      .getElementById('clickableImage')
      .addEventListener('click', function (event) {
        // 获取点击位置
        const x = event.clientX
        const y = event.clientY

        // 创建飘动的积分元素
        const point = document.createElement('div')
        point.textContent = '+10'
        point.className = 'point'
        point.style.left = `${x}px`
        point.style.top = `${y}px`
        document.body.appendChild(point)

        // 更新积分
        const scoreElement = document.getElementById('score')
        let score = parseInt(scoreElement.textContent.split('：')[1], 10)
        score += 10
        scoreElement.textContent = `积分：${score}`

        // 动画结束后移除元素
        point.addEventListener('animationend', function () {
          point.remove()
        })
      })
  },
}
</script>
<style lang="scss" scoped></style>
