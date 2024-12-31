<template>
  <div>
    <h2>{{ I18N.common.zhiWenHuoQu }}</h2>
    <div>
      <button @click="hasTouchId">{{ I18N.common.huoQu }}</button>
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
import I18N from "@/utils/I18N";

import { touchIDRegistered } from "@/utils/TouchIDLogin";
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
          I18N.common.huHao,
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
