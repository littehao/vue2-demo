<template>
  <div>
    <div class="sliderBox">
      <div class="slider_runway">
        <div class="slider_bar" :style="barStyle"></div>
        <div class="leftbtn" :style="leftStyle" @mousedown="handleDown"></div>
        <div class="rightbtn" :style="rightStyle" @mousedown="handleDown"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "SliderTest",
  data() {
    return {
      maxValue: 574,
      curLeftValue: 0, // 左边按钮位置
      curRightValue: 574, // 右边按钮位置
      dragging: false,
      startX: 0,
      isClick: false,
      currentX: 0,
      startLeftPosition: 0, // 左边开始
      startRightPosition: 574, // 右边开始
      newPosition: null,
      oldValue: 0,
      curClassName: "",
    };
  },
  computed: {
    barStyle() {
      return { width: this.curBarWith, left: this.curLeftPosition };
    },
    leftStyle() {
      return { left: this.curLeftPosition };
    },
    rightStyle() {
      return { left: this.curRightPosition };
    },
    curBarWith() {
      return `${
        ((this.maxValue -
          this.curLeftValue -
          (this.maxValue - this.curRightValue)) /
          this.maxValue) *
        100
      }%`;
    },
    curLeftPosition() {
      return `${(this.curLeftValue / this.maxValue) * 100}%`;
    },
    curRightPosition() {
      return `${(this.curRightValue / this.maxValue) * 100}%`;
    },
  },
  methods: {
    handleDown(evt) {
      evt.preventDefault();
      this.onDragStart(evt);
      window.addEventListener("mousemove", this.onDragging);
      window.addEventListener("mouseup", this.onDragEnd);
      window.addEventListener("contextmenu", this.onDragEnd);
    },
    onDragStart(event) {
      this.dragging = true;
      this.isClick = true;
      this.startX = event.clientX;
      const className = event.target.className;
      if (className === "leftbtn") {
        this.curClassName = "leftbtn";
        this.startLeftPosition = parseFloat(this.curLeftPosition);
        this.newPosition = this.startLeftPosition;
      }
      if (className === "rightbtn") {
        this.curClassName = "rightbtn";
        this.startRightPosition = parseFloat(this.curRightPosition);
        this.newPosition = this.startRightPosition;
      }
    },
    onDragging(event) {
      if (this.dragging) {
        this.isClick = false;
        let diff = 0;
        this.currentX = event.clientX;
        diff = ((this.currentX - this.startX) / this.maxValue) * 100;
        if (this.curClassName === "leftbtn") {
          this.newPosition = this.startLeftPosition + diff;
          this.setPosition(this.newPosition);
        }
        if (this.curClassName === "rightbtn") {
          this.newPosition = this.startRightPosition + diff;
          this.setPosition(this.newPosition);
        }
      }
    },
    onDragEnd() {
      if (this.dragging) {
        setTimeout(() => {
          this.dragging = false;
          if (!this.isClick) {
            this.setPosition(this.newPosition);
          }
        }, 0);
        window.removeEventListener("mousemove", this.onDragging);
        window.removeEventListener("mouseup", this.onDragEnd);
        window.removeEventListener("contextmenu", this.onDragEnd);
      }
    },
    setPosition(newPosition) {
      if (newPosition === null || isNaN(newPosition)) return;
      if (newPosition < 0) {
        newPosition = 0;
      } else if (newPosition > 100) {
        newPosition = 100;
      }
      let value = (newPosition / 100) * this.maxValue;
      if (this.curClassName === "leftbtn") {
        this.curLeftValue = value;
      }
      if (this.curClassName === "rightbtn") {
        this.curRightValue = value;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.sliderBox {
  width: 574px;
  height: 38px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  .slider_runway {
    width: 100%;
    height: 20px;
    background-color: #e4e7ed;
    position: relative;
    .slider_bar {
      height: 20px;
      background-color: #409eff;
      position: absolute;
    }
    .leftbtn,
    .rightbtn {
      width: 5px;
      height: 100%;
      position: absolute;
      background-color: red;
      cursor: e-resize;
    }
    .leftbtn {
      cursor: w-resize;
    }
  }
}
</style>
