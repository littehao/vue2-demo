// kiwi-intl依赖
import KiwiIntl from "kiwi-intl";
// 引入生成好的国际化资源
import zhCN from "../../.kiwi/zh-CN/";
// import enUS from "../../.kiwi/en-US/";
// import zhTW from "../../.kiwi/zh-TW/";
const kiwiIntl = KiwiIntl.init(getLang(), {
  "zh-CN": { ...zhCN },
  // "en-US": { ...enUS },
  // "zh-TW": { ...zhTW },
});
export default kiwiIntl;

// 设置语言
export function setLang(value) {
  window.localStorage.setItem("kiwi-lang", value); // 重新加载
  window.location.reload();
}

// 获取当前语言
export function getLang() {
  return window.localStorage.getItem("kiwi-lang") || "zh-CN";
}
