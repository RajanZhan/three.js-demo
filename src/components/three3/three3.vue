<!---->
<template>
  <div id="main">
    <div id="blocker">
      <div id="instructions">
        <!--<span style="font-size:40px">Click to play</span>-->
        <br />
        点击激活
      </div>
    </div>

  </div>

</template>

<script type="es6">

  import model from './js/three.model';
  import loader from './js/Loader';

  export default {
    data(){
      return {
        init_obj:{render:null,camera:null},
        active_obj:{empty:true,mem_obj:{scale:{x:0,y:0,z:0},position:{x:0,y:0,z:0}},object:{name:''}},
        camera:{
          position:{},
          look_at:{},
        },
        is_run:false,// 是否运行动画
      }
    },
    mounted(){
      var _this = this;
     this.init_obj =  model._init({
       object_active:function (event,obj) {
         /*console.log(obj.is_active);
          return;*/
         //console.log(obj.scale);
         if(event == 'active')
         {
           console.log('active');
           _this.active_obj.object = obj;
           _this.active_obj.mem_obj.position = obj.position;
           _this.active_obj.mem_obj.scale = obj.scale;
           _this.active_obj.mem_obj.color = obj.material.color;
           _this.active_obj.empty = false;
           //obj.material.color.set( 0xff0000 ); // 设置选中的物体为激活时的颜色
           //console.log(obj.material.color);// 激活前的新值

           /*let selectedColor = new THREE.Color(1,0,1);
           obj.material.color.set(selectedColor);*/
           obj.is_active = true;

           var bbox = new THREE.BoundingBoxHelper( obj, 0x00ff00 );
           bbox.update();
           obj.border_helper = bbox;
           _this.init_obj.scene.add( bbox );
           //console.log(obj.material.color);// 激活后的新值

           //console.log(_this.active_obj.mem_obj.color);// 缓存的值

           //console.log(_this.active_obj.mem_obj.color);
           //console.log(_this.active_obj.mem_obj.color)
          // _this.active_obj.mem_obj.color.getHex()

         }
         else if(event == 'inactive')
         {
           console.log('inactive');
           if(_this.active_obj.object)
           {
             _this.init_obj.scene.remove( _this.active_obj.object.border_helper );
             //console.log(_this.active_obj.object)
             //console.log(_this.active_obj.object.material.color)
             // 物体改到原先的颜色状态
             //let ori_material_color = _this.active_obj.mem_obj.color;
             let ori_material_color = new THREE.Color(0,0,0);
             //ori_material_color =  new THREE.Color(ori_material_color.r,ori_material_color.g,ori_material_color.b);
             //console.log(ori_material_color);
             //obj.material.color.set (ori_material_color);
             obj.is_active = false;
             _this.active_obj = {empty:true,mem_obj:{scale:{x:0,y:0,z:0},position:{x:0,y:0,z:0}},object:null};
           }
         }
         //console.log(obj);
      }
     });
    },
    methods:{
      // 添加对象
      addObj(){
        let obj =  $("#add_obj").val();
        if(obj)
        {
          var name = prompt('请输入对象的名称');
          //var name = 'a';
          if(!name)
          {
           return;
          }

          var material =  new THREE.MeshLambertMaterial({
            color:new THREE.Color(0x76B610),
          })

          var  geometry = {};
          switch (obj)
          {
            case 'Box':
               geometry =  new THREE.CubeGeometry(60,60,60);
              break;
            default :
              return;
          }
          var obj_3d = new THREE.Mesh(geometry,material);
          obj_3d.is_active = false;// 标志是否被选中
          obj_3d.name = name;

          //var edges = new THREE.EdgesHelper( obj_3d, 0x00ff00 );
          //var edges = new THREE.BoxHelper( obj_3d, 0x00ff00 );

          // 边框辅助线
          /*var bbox = new THREE.BoundingBoxHelper( obj_3d, 0x00ff00 );
          bbox.update();
          this.init_obj.scene.add( bbox );
          obj_3d.border_helper = bbox;*/
          //this.init_obj.bbox = bbox;

          //this.init_obj.scene.add(edges);
          //obj_3d.attributes.position.needsUpdate = true;
          //this.all_objects.push(obj_3d);
          this.init_obj.scene.add(obj_3d);
          //console.log(obj_3d)
        }

      },
      //删除对象
      delObject(){
        if(!this.active_obj.empty)
        {
          if(confirm('您确定要删除name为'+this.active_obj.object.name+"的对象吗"))
          {
            var selectedObject = this.init_obj.scene.getObjectByName(this.active_obj.object.name);
            if(selectedObject)
            {
              this.init_obj.scene.remove( selectedObject );
            }
          }
        }
      },

      // 导入对象
      importObj(){
        var _this = this;
        var loader = new THREE.OBJLoader( );
        //var model_name = prompt('输入导入的模型名');
        var model_name = 'road_1';
        if(!model_name)
        {
          return;
        }
        var file_path = "/static/model/"+model_name+".obj";
        //var file_path = 'file:///H:/myProject/lc/model.obj';
        loader.load( file_path, function ( object ) {
          /*object.traverse( function ( child ) {
           if ( child instanceof THREE.Mesh ) {
           child.material.map = texture;
           }
           } );*/
          object.position.needsUpdate = true;

          // 边框辅助线
          /*var bbox = new THREE.BoundingBoxHelper( object, 0x00ff00 );
          bbox.update();
          object.border_helper = bbox;
          _this.init_obj.scene.add( bbox );*/

          //object.position.y = - 95;
          _this.init_obj.scene.add( object );
        });
        return;
        var fileInput = document.createElement( 'input' );
        fileInput.type = 'file';
        fileInput.addEventListener( 'change', function ( event ) {
          /*loader.loadFile(fileInput.files[ 0 ],function (object) {
            _this.init_obj.scene.add(object);
            console.log(object);fileInput.files[ 0 ]
          })*/
          var loader = new THREE.OBJLoader( );
          loader.load( "file:///H:/myProject/lc/three.js/static/model/thing1.obj", function ( object ) {
            /*object.traverse( function ( child ) {
             if ( child instanceof THREE.Mesh ) {
             child.material.map = texture;
             }
             } );*/
            //object.position.y = - 95;
            _this.init_obj.scene.add( object );

          });
          //console.log(fileInput.files[ 0 ]);
        } );
        fileInput.click();
      },

      // 导出对象
      exportObj()
      {
        var exporter = new THREE.OBJExporter();
        //alert(this.init_obj.scene.children.length);

        // 删除参考坐标系
        var scene = this.init_obj.scene;
        var position_helper = scene.getObjectByName('position_helper');
        if(position_helper)
        {
          scene.remove( position_helper );
        }
        var result = exporter.parse( scene );
        var link = document.createElement( 'a' );
        link.style.display = 'none';
        document.body.appendChild( link ); // Firefox workaround, see #6594

        function save( blob, filename ) {

          link.href = URL.createObjectURL( blob );
          link.download = filename || 'data.json';
          link.click();
          // URL.revokeObjectURL( url ); breaks Firefox...
        }

        function saveString( text, filename ) {

          save( new Blob( [ text ], { type: 'text/plain' } ), filename );

        }
        var file_name = prompt('请输入文件名');
        if(!file_name)
        {
          file_name = 'model'
        }
        saveString( result, file_name+'.obj' );
        //console.log(result);
      },

      // 运行起来
      run(){
        if(this.is_run)
        {
          this.is_run = false;
          //this.init_obj.animate
        }
        else
        {
          this.is_run = true;
        }
      },

      // 动画播放回调
      animate_callback(){
        //this.init_obj.camera.position.x ++;
        ///console.log('c')
      },


      // 显示模型的数量
      showModelNum(){
        console.log(this.init_obj.scene.children.length)
      },
    },
    watch: {
      "active_obj.mem_obj.position":{
        deep:true,
        handler:function () {
          if(this.active_obj.object)
          {
            var object = this.init_obj.scene.getObjectByName(this.active_obj.object.name);
            if(object)
            {
              object.position.x = Number(this.active_obj.mem_obj.position.x);
              object.position.y = Number(this.active_obj.mem_obj.position.y);
              object.position.z = Number(this.active_obj.mem_obj.position.z);
              object.border_helper.update();
              //object.position.needsUpdate = true;
              //console.log(object);
            }
          }
        }

      },
      "active_obj.mem_obj.scale":{
        deep:true,
        handler:function () {
          if(this.active_obj.object)
          {
            var object = this.init_obj.scene.getObjectByName(this.active_obj.object.name);
            if(object)
            {
              object.position.x = Number(this.active_obj.mem_obj.position.x);
              object.position.y = Number(this.active_obj.mem_obj.position.y);
              object.position.z = Number(this.active_obj.mem_obj.position.z);
              //this.init_obj.bbox.update();
              /*console.log(object.name);
              console.log(object.border_helper);*/
              object.border_helper.update();
              //object.position.needsUpdate = true;
              //console.log(object);
            }
          }
        }
      },
      "camera.position":{
        deep:true,
        handler:function () {

        }
      }
    }
  }
</script>

<style scoped>
  input{
    width:80px;
    height: 20px;
  }
  #main{
    display: flex;
    height: 1000px;
    width: 100%;
    height: 100%;
  }

  body {
    background-color: #ffffff;
    margin: 0;
    overflow: hidden;
    font-family: arial;
  }

  #blocker {

    position: absolute;

    width: 100%;
    height: 100%;

    background-color: rgba(0,0,0,0.5);

  }

  #instructions {

    width: 100%;
    height: 100%;

    display: -webkit-box;
    display: -moz-box;
    display: box;

    -webkit-box-orient: horizontal;
    -moz-box-orient: horizontal;
    box-orient: horizontal;

    -webkit-box-pack: center;
    -moz-box-pack: center;
    box-pack: center;

    -webkit-box-align: center;
    -moz-box-align: center;
    box-align: center;

    color: #ffffff;
    text-align: center;

    cursor: pointer;

  }


</style>
