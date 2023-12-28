<template>
  <div>
    <h2>指纹获取</h2>
    <div>
      <button @click="hasTouchId">获取</button>
      <div>touchId:{{ touchId }}</div>
      <div>clientDataJSON:{{ clientDataJSON }}</div>
      <img
        src="data:image/jpg;base64,dNUnSW9jiAmbgN81ienyK8KrIxADYICSU3qHsgxYuCQ="
        alt=""
      />
    </div>
  </div>
</template>
<script>
import { touchIDRegistered } from "@/uilts/TouchIDLogin";
export default {
  name: "fingerPrint",
  data() {
    return {
      touchId: "",
      clientDataJSON: "",
    };
  },
  mounted() {},
  methods: {
    async hasTouchId() {
      // 校验设备是否支持touchID
      const hasTouchID =
        await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      console.log(hasTouchID);
      if (hasTouchID) {
        const data = await touchIDRegistered(
          "胡浩",
          window.btoa(1),
          window.btoa("abc")
        );
        this.touchId = data.touchId;
        this.clientDataJSON = data.clientDataJSON;
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
