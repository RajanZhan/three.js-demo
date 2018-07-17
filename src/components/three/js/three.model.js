/**
 * Created by Administrator on 2017/7/11.
 */
export default {

  // 初始化
  init(){
    var scene = new THREE.Scene();//生成一个场景
    //生成一个相机
    var camera = new THREE.PerspectiveCamera(90,window.innerWidth/window.innerHeight,0.1,1000);//视场，长宽比，近面，远面
    camera.position.x=20;
    camera.position.y=20;
    camera.position.z=20;
    camera.lookAt({x:0,y:0,z:0});
    //  console.log(scene.position)
    //生成一个渲染器
    var render = new THREE.WebGLRenderer({antialias:true});
    render.setClearColor(0xEEEEEE);
    render.setSize(window.innerWidth,window.innerHeight);
    render.shadowMapEnabled = true;//允许阴影映射，渲染阴影需要大量的资源，因此我们需要告诉渲染器我们需要阴影

    // 鼠标控制插件使用
    //mouseControl
    /*var controls = new THREE.OrbitControls(camera, render.domElement);
    controls.addEventListener('change', render); // add this only if there is no animation loop (requestAnimationFrame)
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;*/


    //scene.add(render);
    scene.add(camera);
    //console.log(render);

    return {
      scene:scene,
      camera:camera,
      render:render,
      //controls:controls
    }
  }
}
