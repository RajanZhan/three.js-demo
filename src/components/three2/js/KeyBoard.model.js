/**
 * Created by Administrator on 2017/7/19.
 */
/*
* 键盘操作处理模块
* */

export  default  {

  keyStatus:{down:new Map(),up:new Map()}, //  记录 按键按键的状态
  init(emit)
  {

    var _this = this;
    document.onkeydown = function (e) {
      _this.keyStatus.down.set(e.keyCode,'key');
      _this.keyStatus.up.delete( e.keyCode);
      emit('down',_this.keyStatus)
    };

    document.onkeyup = function (e) {
      _this.keyStatus.up.set(e.keyCode,'key');
      _this.keyStatus.down.delete( e.keyCode);
      emit('up',_this.keyStatus)
    };


  }

}
