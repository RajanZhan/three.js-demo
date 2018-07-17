/**
 * Created by Administrator on 2017/7/21.
 */
export default  {
  options:{
    msg:'msg',
    width:12,
  },

  init(){
    var gui = new dat.GUI();
    gui.add(this.options,'msg');
    gui.add(this.options,'width');
    return {
      dom:gui.domElement,
      options:this.options
    }
  }

}
