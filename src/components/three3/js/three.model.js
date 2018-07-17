/**
 * Created by Administrator on 2017/7/11.
 */
export default {

  _init(callback){

    var camera, scene, renderer;
    var geometry, material, mesh;
    var controls;
    var load_model_ok = [false,false,false];// 标志是否全部异步加载完 模型

    var objects = [];

    var raycaster;

    var blocker = document.getElementById( 'blocker' );
    var instructions = document.getElementById( 'instructions' );

    // http://www.html5rocks.com/en/tutorials/pointerlock/intro/

    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    if ( havePointerLock ) {

      var element = document.body;

      var pointerlockchange = function ( event ) {

        if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

          controlsEnabled = true;
          controls.enabled = true;

          blocker.style.display = 'none';

        } else {

          controls.enabled = false;

          blocker.style.display = '-webkit-box';
          blocker.style.display = '-moz-box';
          blocker.style.display = 'box';
          instructions.style.display = '';
        }

      };

      var pointerlockerror = function ( event ) {

        instructions.style.display = '';

      };

      // Hook pointer lock state change events
      document.addEventListener( 'pointerlockchange', pointerlockchange, false );
      document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
      document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

      document.addEventListener( 'pointerlockerror', pointerlockerror, false );
      document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
      document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

      instructions.addEventListener( 'click', function ( event ) {

        instructions.style.display = 'none';

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();

      }, false );

    } else {

      instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

    }

    init();
    animate();

    var controlsEnabled = false;

    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    var canJump = false;

    var prevTime = performance.now();
    var velocity = new THREE.Vector3();





    function init() {

      camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

      scene = new THREE.Scene();
      scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

      var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
      light.position.set( 0.5, 1, 0.75 );
      scene.add( light );

      controls = new THREE.PointerLockControls( camera );
      scene.add( controls.getObject() );

      var onKeyDown = function ( event ) {

        //console.log(event.keyCode);
        switch ( event.keyCode ) {

          case 38: // up
          case 87: // w
            moveForward = true;
            break;

          case 37: // left
          case 65: // a
            moveLeft = true; break;

          case 40: // down
          case 83: // s
            moveBackward = true;
            break;

          case 39: // right
          case 68: // d
            moveRight = true;
            break;

          case 32: // space
            if ( canJump === true ) velocity.y += 350;
            canJump = false;
            break;

          // 加载模型的触发事件
          case 74:// J KEY
            loadModel(1);break;
          case 75:
            loadModel(2);break;
          case 76:
            loadModel(3);break;
          case 72: //  调整视野
            //console.log( velocity.z)
            //velocity.z += 500;break;
            //console.log( velocity.z)


        }

      };

      var onKeyUp = function ( event ) {

        switch( event.keyCode ) {

          case 38: // up
          case 87: // w
            moveForward = false;
            break;

          case 37: // left
          case 65: // a
            moveLeft = false;
            break;

          case 40: // down
          case 83: // s
            moveBackward = false;
            break;

          case 39: // right
          case 68: // d
            moveRight = false;
            break;

        }

      };

      document.addEventListener( 'keydown', onKeyDown, false );
      document.addEventListener( 'keyup', onKeyUp, false );

      raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

      // floor




      geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
      geometry.rotateX( - Math.PI / 2 );

      for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {

        var vertex = geometry.vertices[ i ];
        vertex.x += Math.random() * 20 - 10;
        vertex.y += Math.random() * 2;
        vertex.z += Math.random() * 20 - 10;

      }

      for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

        var face = geometry.faces[ i ];
        face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
        face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
        face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

      }

      material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

      mesh = new THREE.Mesh( geometry, material );
      scene.add( mesh );

      // objects

      geometry = new THREE.BoxGeometry( 20, 20, 20 );

      for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

        var face = geometry.faces[ i ];
        face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
        face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
        face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

      }

      for ( var i = 0; i < 1; i ++ ) {

        material = new THREE.MeshPhongMaterial( { specular: 0xffffff, flatShading: true, vertexColors: THREE.VertexColors } );

        var mesh = new THREE.Mesh( geometry, material );
        //mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 1;
        mesh.position.x =10;
       // mesh.position.y = Math.floor( Math.random() * 20 ) * 10 + 1;
        mesh.position.y = 10;
        //mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 1
        mesh.position.z = 0
        scene.add( mesh );

        material.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

        objects.push( mesh );

      }

      //

      renderer = new THREE.WebGLRenderer();
      renderer.setClearColor( 0xffffff );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( renderer.domElement );

      //

      window.addEventListener( 'resize', onWindowResize, false );


      // 将摄像机的视角调成远距离
      controls.getObject().position.x = 41;
      controls.getObject().position.z = -376;

    }

    function loadModel(num) {
      if(load_model_ok[num - 1])
      {
        return;
      }
      var loader = new THREE.OBJLoader( );
      var model_name = 'm_'+num;
      if(!model_name)
      {
        return;
      }
      var file_path = "/static/model/"+model_name+".obj";
      loader.load( file_path, function ( object ) {

        object.position.needsUpdate = true;

        object.scale.x = 0.5
        object.scale.y = 0.5
        object.scale.z = 0.5
        object.position.z = num * 50;
        object.position.x = num * 50;
        object.name = model_name;
        scene.add( object );
        console.log("加载第"+num+"模型");

      });
      load_model_ok[num - 1] = true;
    }

    // 检测视角的距离，来触发加载指定的模型
    function checkViewsAndLoadModel(pos){
      //console.log(pos);


      /*if(load_model_ok[2])
      {
        if(pos.z < -312)
        {
          for(var i = 1; i <= 3; i++)
          {
            var selectedObject = scene.getObjectByName('m_'+i);
            if(selectedObject)
            {
              scene.remove( selectedObject );
            }
          }
        }
        load_model_ok = false;// 说明移除模型完成
      }*/

      if((pos.z > -312) &&　(pos.z < -310))
      {
        loadModel(1)
      }
      else if((pos.z > -290) && (pos.z < -280))
      {
        loadModel(2)
      }
      else if((pos.z > -270) && (pos.z < -260))
      {
        loadModel(3);
        //load_model_ok = true;
      }
    }


    function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function animate() {

      requestAnimationFrame( animate );

      if ( controlsEnabled ) {
        raycaster.ray.origin.copy( controls.getObject().position );
        raycaster.ray.origin.y -= 10;

        var intersections = raycaster.intersectObjects( objects );

        var isOnObject = intersections.length > 0;

        var time = performance.now();
        var delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta;

      /* console.log(moveBackward);
       console.log(moveForward);
       console.log(delta);*/
        if ( moveForward ) {
          velocity.z -= 400.0 * delta;
          checkViewsAndLoadModel(controls.getObject().position)
        }
        if ( moveBackward ) {
          velocity.z += 400.0 * delta;
          checkViewsAndLoadModel(controls.getObject().position)
        }

        if ( moveLeft ){
          velocity.x -= 400.0 * delta ;
          checkViewsAndLoadModel(controls.getObject().position)
        }
        if ( moveRight ) {
          velocity.x += 400.0 * delta;
          checkViewsAndLoadModel(controls.getObject().position)
        }

        if ( isOnObject === true ) {
          velocity.y = Math.max( 0, velocity.y );

          canJump = true;
        }

        controls.getObject().translateX( velocity.x * delta );
        controls.getObject().translateY( velocity.y * delta );
        controls.getObject().translateZ( velocity.z * delta );

        if ( controls.getObject().position.y < 10 ) {

          velocity.y = 0;
          controls.getObject().position.y = 10;

          canJump = true;

        }

        prevTime = time;

      }

      renderer.render( scene, camera );

    }

  }
}
