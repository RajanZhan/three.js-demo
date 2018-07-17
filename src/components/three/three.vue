<!---->
<template>
  <div>

    <fieldset>
      <legend>相机设置</legend>
      <span>相机位置</span>
      x :<input type="number"  v-model="camera.x">
      y :<input type="number"  v-model="camera.y">
      z :<input type="number"   v-model="camera.z">
      <br>
      <span>相机视角</span>
      x :<input type="number"  v-model="camera_look.x">
      y :<input type="number"  v-model="camera_look.y">
      z :<input type="number"   v-model="camera_look.z">
    </fieldset>
    <fieldset>
      <legend>物体设置</legend>
      <span>物体位置</span>
      x :<input type="number"  v-model="cube.pos.x">
      y :<input type="number"  v-model="cube.pos.y">
      z :<input type="number"   v-model="cube.pos.z">
    </fieldset>


    <div id="WebGL-output"></div>
  </div>
</template>

<script type="es6">

  import three  from './js/three.model'

  export default {
    data(){
      return {
        init_obj:null,

        // 相机的位置
        camera:{
          x:20,
          y:20,
          z:20,
        },

        // 相机的视角
        camera_look:{
          x:0,
          y:0,
          z:0,
        },

        // 物体位置
        cube:{
          instance:null,
          pos:{
            x:0,
            y:0,
            z:0,
          }
        }

      }
    },
    mounted()
    {
     var init_res =  three.init();

     this.work(init_res);
     //console.log(init_res);
      //this.animate();
     this.render(init_res.render,init_res.scene,init_res.camera);
     this.init_obj = init_res;
    },
    methods: {
      work(init_obj)
      {

        var spotLight = new THREE.SpotLight(0xffffff);        //生成一个坐标轴，辅助线
        var axes = new THREE.AxisHelper(30);
        //生成一个平面
        var planeGeometry = new THREE.PlaneGeometry(60, 20, 10, 10);//平面
        //生成一个材质
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        //生成一个网格，将平面和材质放在一个网格中，组合在一起，组成一个物体
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI;//将平面沿着x轴进行旋转
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;
        plane.receiveShadow = true;//平面进行接受阴影

        var cubeGeometry = new THREE.CubeGeometry(10, 10, 10);
        var planeMaterial1 = new THREE.MeshLambertMaterial({color: 0xff0000});
        var cube = new THREE.Mesh(cubeGeometry, planeMaterial1);
        //plane1.rotation.x=-0.5*Math.PI;//将平面沿着x轴进行旋转
        cube.position.x = 0;
        cube.position.y = 0;
        cube.position.z = 0;
        cube.castShadow = true;//需要阴影，方块进行投射阴影

        this.cube.instance = cube;// 缓存立方体对象




        spotLight.position.set(-40, 40, 0);
        spotLight.castShadow = true;
        init_obj.scene.add(axes);
        init_obj.scene.add(plane);
        init_obj.scene.add(cube);
        init_obj.scene.add(spotLight);
        document.getElementById("WebGL-output").appendChild(init_obj.render.domElement);

      },

      animate()
      {
        requestAnimationFrame( this.animate );
        //this.init_obj.controls.update();
        //stats.update();
        this.render(this.init_obj.render,this.init_obj.scene,this.init_obj.camera);
      },
      render(render,scene,camera)
      {
        //scene.add(render);
        render.render(scene,camera);
      },
      rerender(){

        this.render(this.init_obj.render,this.init_obj.scene,this.init_obj.camera)
      },
      // 相机位置更改回调
      camera_pos_chage(){
        this.init_obj.camera.position.x = this.camera.x;
        this.init_obj.camera.position.y = this.camera.y;
        this.init_obj.camera.position.z = this.camera.z;
        this.init_obj.scene.add(this.init_obj.camera);
        this.rerender();
      },
      // 相机视角更改回调
      camera_look_change(){
        this.init_obj.camera.lookAt({x:this.camera_look.x,y:this.camera_look.y,z:this.camera_look.z});
        this.rerender();
      },
      // 物体位置的更改
      cube_pos_change(){
        this.cube.instance.position.x = this.cube.pos.x;
        this.cube.instance.position.y = this.cube.pos.y;
        this.cube.instance.position.z = this.cube.pos.z;
        this.init_obj.scene.add(this.cube.instance);
        console.log('cube change');
        this.rerender();
      },
    },
    watch:
    {
      "camera":{
        handler:function (c,o) {
         this.camera_pos_chage();// 相机位置的更改
        },
        deep: true,
      },
      "camera_look":{
        handler:function (c,o) {
          this.camera_look_change();// 相机位置的更改
        },
        deep: true,
      },
      "cube.pos":{
        handler:function (c,o) {
          this.cube_pos_change();// 物体位置的更改
        },
        deep: true,
      },
    }


  }
</script>

<style scoped>

</style>
