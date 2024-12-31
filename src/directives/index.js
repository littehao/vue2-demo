import { copy, longpress, debounce } from "./directives";

const directives = {
  copy,
  longpress,
  debounce,
};

export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key]);
    });
  },
};
