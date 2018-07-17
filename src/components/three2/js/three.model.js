/**
 * Created by Administrator on 2017/7/11.
 */
export default {

  object_selected:{color:'101'}, // 对象被选中激活的颜色

  // 定义系统内置的对象，防止选中系统对象,例如坐标，网格等等
  SYS_OBJECT:new Set(['position_helper',
    'SYS_gridHelper','X','Y','Z','YZ','XY','XZ','XYZ',
  'XYZE',
  ]),

  // 初始化
  init(callback,animate_invoke){


    var _this = this;
    var stats;
    var camera, controls, scene, renderer,raycaster,mouse,selected_obj = false,all_3d_obj = null,
    firstController,clock = new THREE.Clock(), objectOperateControls;
    init(callback);
    /*console.log(typeof animate_invoke)
    console.log( animate_invoke)*/
    animate();

    function init(callback) {
      //window.scene = scene;
      //scene
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

      //renderer
      renderer = new THREE.WebGLRenderer();
      renderer.shadowMapEnabled = true;//允许阴影映射
      renderer.setClearColor(0xe8e8e8);
      renderer.setPixelRatio( window.devicePixelRatio );
      var render_width = parseInt($("#container").css('width'));
      var render_height = parseInt($("#container").css('height'));
      renderer.setSize( render_width, render_height );
      var container = document.getElementById( 'container' );
      container.appendChild( renderer.domElement );

      // 坐标轴辅助线
      var axes = new THREE.AxisHelper(200);
      axes.name = 'position_helper';
      scene.add(axes);

      //camera
      camera = new THREE.PerspectiveCamera( 45, render_height / render_width, 1, 1000 );
      camera.position.z = 400;
      camera.position.x = 500;
      camera.position.y = 400;
      camera.lookAt({x:0,y:0,z:0});
      //camera.loo

      //mouseControl 鼠标拖拽插件
      controls = new THREE.OrbitControls( camera, renderer.domElement );

      controls.addEventListener( 'change', render );
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.enableZoom = true;


      // 模型对象操作插件
      objectOperateControls = new THREE.TransformControls( camera, renderer.domElement );
      objectOperateControls.addEventListener( 'change', render );




      // 鼠标点选物体
      // 监听鼠标点击
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
       function onMouseMove( event ) {
         selected_obj = true;
       mouse.x = ( event.clientX / render_width ) * 2 - 1;
       mouse.y = - ( event.clientY / render_height ) * 2 + 1;
       }
       window.addEventListener( 'click', onMouseMove, false );
       requestAnimationFrame(render);

      // world
      var cube = new THREE.Mesh(new THREE.CubeGeometry(60,60,60),
        new THREE.MeshLambertMaterial({
          color:0x76B610,
        })
      )

      // 设置方块的位置
      cube.position.x = 50;
      cube.position.y = 50;
      cube.position.z = 50;
      cube.castShadow = true;
      cube.name = 'my_cute';
      //scene.add(cube);

      // 生成一个平面
      //生成一个平面
      var planeGeometry = new THREE.PlaneGeometry(900, 900, 10, 10);//平面
      //生成一个材质
      var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
      //生成一个网格，将平面和材质放在一个网格中，组合在一起，组成一个物体
      var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;//将平面沿着x轴进行旋转
      plane.position.x = 0;
      plane.position.y = 0;
      plane.position.z = 0;
      plane.receiveShadow = true;//平面进行接受阴影
      //scene.add(plane);


      // 辅助网格
      var size = 400;
      var divisions = 200;

      var gridHelper = new THREE.GridHelper( size, divisions );
      gridHelper.name = "SYS_gridHelper";
      scene.add( gridHelper );

      // lights
      var light = new THREE.DirectionalLight(0xFCFCFC);
      light.position.set( 1, 1, 1 );
      //scene.add( light );
      light = new THREE.DirectionalLight(0x00d9b5);
      light.position.set( -1, -1, -1 );
      //scene.add( light );
      //light = new THREE.AmbientLight(0x00d9b5);
      //scene.add( light );

      // 灯光
      var spotLight = new THREE.SpotLight(0xffffff,10,800);
      spotLight.position.set(0, 200, 0);
      spotLight.castShadow = true;
      scene.add( spotLight );

      // 添加环境光
      var  ambient_light = new THREE.AmbientLight(0xffffff);
      scene.add(ambient_light);

      stats = new Stats();
      container.appendChild( stats.dom );


      // 第一人称控件
       /*firstController  = new THREE.FirstPersonControls(camera);
       firstController.lookSpeed = 0.1;
       firstController.movementSpeed = 5;
       firstController.noFly = true;
       firstController.lookVertical = true;
       firstController.constrainVertical = true;
       firstController.verticalMax = 2.0;
       firstController.verticalMin = 1.0;
       firstController.lon = 0;
       firstController.lat = 0;*/



      window.addEventListener( 'resize', onWindowResize, false );
    }
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    }
    function animate() {
      requestAnimationFrame( animate );
      //firstController.update(clock.getDelta());
      //controls.update();
      stats.update();
      //animate_invoke();
      //console.log(animate_invoke)
      //animate_invoke();
      /*camera.lookAt().x ++;
      camera.position.y ++;
      camera.position.z ++;*/
      render();
    }
    function render() {


      raycaster.setFromCamera( mouse, camera );

      // calculate objects intersecting the picking ray
      var intersects = raycaster.intersectObjects( scene.children ,true); // 加上true参数 才可以激活外部导入模型
      if(all_3d_obj == null)
      {
        all_3d_obj = intersects;

      }

      function checkSelect(a) {
        console.log(a.is_active);
        console.log(a);
        if(a.is_active )
        {
         return true;
        }
        return false;
      }

      if(selected_obj)
      {



        for ( var i = 0; i < intersects.length; i++ ) {

          /*console.log(intersects[ i ].object.geometry.type);
          console.log(intersects[ i ].object.name);*/

          var object_name = intersects[ i ].object.name;
          //console.log(object_name);
          /*console.log(_this.SYS_OBJECT.has(object_name));
          console.log(intersects[ i ].object.is_active);
          _this.SYS_OBJECT.forEach(function (key) {
            console.log(key)
          })*/
          if(!_this.SYS_OBJECT.has(object_name))
          {
            // 非选中状态
            if(checkSelect(intersects[ i ].object))
            {

              callback.object_active('inactive',intersects[ i ].object);
            }
            else // 选中的状态
            {
              callback.object_active('active',intersects[ i ].object);
            }
            selected_obj = false;
            return;
          }
          else if(object_name == 'SYS_gridHelper')
          {
            callback.object_active('inactive',null); // 取消所有激活的对象
          }
          else
          {
            /*console.log('未知错误')
            console.log(_this.SYS_OBJECT.has(object_name))
            console.log(object_name)
            console.log(intersects[ i ].object.is_active)*/
            /*console.log(_this.SYS_OBJECT.has(object_name))
            console.log(_this.SYS_OBJECT)*/
          }

        }

        selected_obj = false;
      }
      //console.log(scene.children);
      intersects = [];
      renderer.render( scene, camera );
    }
    return {
      scene:scene,
      camera:camera,
      objectOperateControls:objectOperateControls
     // animate:animate,
    }
  }
}
