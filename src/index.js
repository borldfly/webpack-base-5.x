//入口文件
import $ from 'jquery';
import{ print } from './js/print';
import '@/css/common.css';
import '@/css/iconfont.less';

//测试js兼容性
const num = (x,y) => { //eslint-disable-line
  console.log(x + y);
};

num(2, 5);

let count = 0;
let promise = new Promise((resolve, reject) => {
  if (++count) {
    resolve('success');
  } else {
    reject('failed');
  }
});

promise.then(res => { //eslint-disable-line
  console.log(res);
});

// module.hot为true表示开启了HMR功能，会监听目标文件的变化
if (module.hot) {
  // 修改./js/print文件，则执行热更新
  module.hot.accept('./js/print.js', function () {
    print();
  });
}
