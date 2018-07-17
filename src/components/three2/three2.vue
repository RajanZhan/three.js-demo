<!---->
<template>
  <div id="main">
    <div id="container"></div>
    <div id="controller_panel">
      <fieldset>
        <legend>文件</legend>
        <button @click="importObj">导入模型</button>
        <br>
        <br>
        <button @click="exportObj">导出模型</button>
        <br>
        <!--<button @click="showModelNum">模型数量</button><br>-->
      </fieldset>
      <fieldset>
        <legend>编辑</legend>
        <div>对象
          <select id="add_obj">
            <option value="">请选择</option>
            <option value="Box">立方体</option>
            <option value="Sphere">球体</option>
          </select>
          <br>
          <br>
          <button @click="addObj">添加</button>
          <br>
          <br>
          <button @click="run">
            <span v-if="!is_run">run</span>
            <span v-if="is_run">stop</span>
          </button>
          <br/>
          <div class="panel">
            <span>分组列表</span> <br>
            <select @click="updateGroupList">
              <option v-for="group in group_list" :value="group.name">{{ group.name }}</option>
            </select>
          </div>

          <br/>

          <button @click="groupTest"> 分组测试</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>属性</legend>
        <div v-if="!active_obj.empty">
          <div>
            <span>对象Name:{{ active_obj.object.name }}</span><br>
            <span>对象Type:{{ active_obj.object.type }}</span><br>

          </div>
          <div class="panel">
            <span>位置</span> <br>
            x:<input type="number" v-model="active_obj.mem_obj.position.x"/> <br>
            y:<input type="number" v-model="active_obj.mem_obj.position.y"/> <br>
            z:<input type="number" v-model="active_obj.mem_obj.position.z"/> <br>
          </div>

          <div class="panel">
            <span>缩放</span> <br>
            x:<input type="number" step="0.1" v-model="active_obj.mem_obj.scale.x"/> <br>
            y:<input type="number" step="0.1" v-model="active_obj.mem_obj.scale.y"/> <br>
            z:<input type="number" step="0.1" v-model="active_obj.mem_obj.scale.z"/> <br>
          </div>

          <div class="panel">
            <span>旋转</span> <br>
            x:<input type="number" step="0.1" v-model="active_obj.mem_obj.rotate.x"/> <br>
            y:<input type="number" step="0.1" v-model="active_obj.mem_obj.rotate.y"/> <br>
            z:<input type="number" step="0.1" v-model="active_obj.mem_obj.rotate.z"/> <br>
          </div>

          <div class="panel">
            <span>编辑模式</span> <br>
            <select v-model='editor_mode'>
              <option value="translate">Position</option>
              <option value="scale">Scale</option>
              <option value="rotate">Rotation</option>
            </select>
          </div>

          <div class="panel">
            <span></span> <br>
            <button @click="delObject">删除对象</button>
            <br>
          </div>


        </div>

        <!--<div class="panel">
          <span>摄像机</span> <br>
          <fieldset>
            <legend>位置</legend>
            x:<input type="number"  v-model="camera.position.x"/> <br>
            y:<input type="number"  v-model="camera.position.y"/> <br>
            z:<input type="number"  v-model="camera.position.z"/> <br>
          </fieldset>
          <br>
          <fieldset>
            <legend>视角</legend>
            x:<input type="number"  v-model="camera.position.x"/> <br>
            y:<input type="number"  v-model="camera.position.y"/> <br>
            z:<input type="number"  v-model="camera.position.z"/> <br>
          </fieldset>
        </div>-->

      </fieldset>
    </div>
    <div id="gui_panel" style="width: 200px;height: 200px;background: red;"></div>
  </div>

</template>

<script type="es6">

  import model from './js/three.model';
  import loader from './js/Loader';
  import groupModel from './js/Group.model';
  import keyBordModel from  './js/KeyBoard.model';
  import gui from './js/GUI.model';

  export default {
    data(){
      return {
        init_obj: {render: null, camera: null},
        //当前激活的对象
        active_obj: {
          empty: true,
          group: null,
          mem_obj: {scale: {x: 0, y: 0, z: 0}, position: {x: 0, y: 0, z: 0}, rotate: {x: 0, y: 0, z: 0}},
          object: {name: ''}
        },

        // 当前被选中的对象
        selected_obj:[],

        camera: {
          position: {},
          look_at: {},
        },
        is_run: false,// 是否运行动画
        editor_mode: 'translate',// TransformControls 的 编辑模式，
        group_list: [], // 本场景模型的分组的信息
        keyStatus: {},// 缓存按键状态
        // 缓存gui相关数据
        gui:{
          options:null,
          dom:null,
        }
      }
    },
    mounted(){

      // 防止事件冒泡
      $("#controller_panel").click(function (event) {
        event.stopPropagation();
      })
      // three.js 初始化
      var _this = this;
      this.init_obj = model.init({
        object_active: function (event, obj) {

          if (event == 'active') {

            if(_this.keyStatus.down.size()  == 0){

            }
            else if(_this.keyStatus.down.get(17) == 'down' &&　(_this.keyStatus.down.size() == 1)) // 有且只有按下 按下ctr 键
            {
              console.log('control only')
            }
            else if((_this.keyStatus.down.get(18) == 'down') &&　(_this.keyStatus.down.size() == 1)) // 有且只有 按下 alt 键
            {
              if(obj.group_name) // 如果该对象是所属某个分组 那么重新 获取选中的对象为该分组
              {
                obj = _this.init_obj.scene.getObjectByName(obj.group_name);
                obj.wireframe = true;

                // 删除之前所有的坐标轴
                if(_this.active_obj.object)
                {
                  let ori_obj = _this.init_obj.scene.getObjectByName(_this.active_obj.object.name);
                  _this.init_obj.objectOperateControls.detach(ori_obj);
                  _this.init_obj.scene.remove(_this.init_obj.objectOperateControls);
                }

                console.log('active');

                _this.active_obj.object = obj;
                _this.active_obj.mem_obj.position = obj.position;
                _this.active_obj.mem_obj.scale = obj.scale;
                _this.active_obj.mem_obj.rotate = obj.rotation;
                _this.active_obj.empty = false;
                obj.is_active = true;

                // 添加辅助坐标轴
                _this.init_obj.objectOperateControls.attach(obj);
                _this.init_obj.scene.add(_this.init_obj.objectOperateControls);
              }
            }
            else  // 其他按键事件类型的监听
            {

            }
            return;
            // 识别 选中的对象的分组信息 以及 按键的状态，来判定是否选中模型分组或者模型对象
            var key_code = 18;// 监听alt 健
            var key_status = _this.keyStatus.get(key_code);
            if (key_status && (key_status == 'down') && (obj.group_name)) // 说明用户正在按下该健 此时应该是选择分组 但是还要判定该对象是否属于哪个分组
            {
              obj = _this.init_obj.scene.getObjectByName(obj.group_name);
              obj.wireframe = true;
            }
            // 删除之前所有的坐标轴
            if(_this.active_obj.object)
            {
              let ori_obj = _this.init_obj.scene.getObjectByName(_this.active_obj.object.name);
              _this.init_obj.objectOperateControls.detach(ori_obj);
              _this.init_obj.scene.remove(_this.init_obj.objectOperateControls);
            }

            console.log('active');

            _this.active_obj.object = obj;
            _this.active_obj.mem_obj.position = obj.position;
            _this.active_obj.mem_obj.scale = obj.scale;
            _this.active_obj.mem_obj.rotate = obj.rotation;
            _this.active_obj.empty = false;
            obj.is_active = true;


            // 添加辅助坐标轴
            _this.init_obj.objectOperateControls.attach(obj);
            _this.init_obj.scene.add(_this.init_obj.objectOperateControls);

          }
          else if (event == 'inactive') {
            return;
            console.log('inactive');
            _this.selected_obj = [];// 被选中的对象置为空
            if (obj == null) // 说明取消所有对象的激活 ，这个时候需要判定用户是否按下Alt 才可取消
            {
              if (_this.active_obj.object)
              {

                // 识别 选中的对象的分组信息 以及 按键的状态，来判定是否选中模型分组或者模型对象
                var key_code = 18;// 监听alt 健
                var key_status = _this.keyStatus.get(key_code);
                if (key_status && (key_status == 'down') && _this.active_obj.object) // 说明用户正在按下该健 此时应该是选择分组 但是还要判定该对象是否属于哪个分组
                {
                  _this.init_obj.objectOperateControls.detach(_this.active_obj.object);
                  _this.init_obj.scene.remove(_this.init_obj.objectOperateControls);

                  obj = _this.init_obj.scene.getObjectByName(_this.active_obj.object.name);
                  obj.is_active = false;

                  _this.active_obj = {
                    empty: true,
                    mem_obj: {rotate: {x: 0, y: 0, z: 0}, scale: {x: 0, y: 0, z: 0}, position: {x: 0, y: 0, z: 0}},
                    object: null
                  };
                }
              }
            }
            else
            {

              _this.init_obj.objectOperateControls.detach(obj);
              _this.init_obj.scene.remove(_this.init_obj.objectOperateControls);
              obj = _this.init_obj.scene.getObjectByName(obj.name);
              obj.is_active = false;
            }


          }
        }
      }, _this.animate_callback);

      // 按键监听初始化
      keyBordModel.init(this.keyEmit);

      // gui 控件初始化
      /*this.gui = gui.init();
      $("#gui_panel").append($(this.gui.dom));*/

    },
    methods: {
      // 添加对象
      addObj(){
        let obj = $("#add_obj").val();
        if (obj) {
          var name = prompt('请输入对象的名称');
          //var name = 'a';
          if (!name) {
            return;
          }
          var material = new THREE.MeshLambertMaterial({
            color: new THREE.Color(0x76B610),
          })

          var geometry = {};
          switch (obj) {
            case 'Box':
              geometry = new THREE.CubeGeometry(20, 20, 20);
              break;
            default :
              return;
          }
          var obj_3d = new THREE.Mesh(geometry, material);
           obj_3d.is_active = false;// 标志是否被选中
           /*obj_3d.name = name;*/
          obj_3d.name = 'no1';
          obj_3d.group_name = name;


          // 分组测试
          let group = new THREE.Group();
          group.is_active = false;
          group.name = name;
          group.group_name = name;

          group.add(obj_3d);
          let obj_3d_1 = new THREE.Mesh(new THREE.CubeGeometry(30, 40, 50), material);
          obj_3d_1.is_active = false;
          obj_3d_1.position.x += 20;
          obj_3d_1.position.y += 20;
          obj_3d_1.position.z += 30;

          obj_3d_1.name = 'no2';
          obj_3d_1.group_name = name;

          group.add(obj_3d_1);


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
          //this.init_obj.scene.add(obj_3d);
          //console.log(group.name);
          this.init_obj.scene.add(group);
          //console.log(obj_3d)
        }
      },

      //删除对象
      delObject(){
        if (!this.active_obj.empty) {
          if (confirm('您确定要删除name为' + this.active_obj.object.name + "的对象吗")) {
            var selectedObject = this.init_obj.scene.getObjectByName(this.active_obj.object.name);
            if (selectedObject) {
              this.init_obj.scene.remove(selectedObject);
            }
          }
        }
      },

      // 导入对象
      importObj(){
        var _this = this;
        var loader = new THREE.OBJLoader();
        var model_name = prompt('输入导入的模型名');
        //var model_name = 'm_1';
        if (!model_name) {
          return;
        }

        var objLoad = function () {
          loader.load(file_path, function (object) {
            /*object.traverse( function ( child ) {
             if ( child instanceof THREE.Mesh ) {
             child.material.map = texture;
             }
             } );*/
            object.position.needsUpdate = true;

            _this.init_obj.scene.add(object);
          });
        }

        var objJson = function () {
          var objectLoader = new THREE.ObjectLoader();
          objectLoader.load(file_path, function (object) {
            _this.init_obj.scene.add(object);
            console.log('load json ');
            console.log(object);
          });
        }


        var file_type = model_name.split('.');
        if (!file_type[1]) {
          return;
        }
        var file_path = "/static/model/" + model_name;

        switch (file_type[1]) {
          case 'obj':
            objLoad();
            break;
          case 'json':
            objJson();
            break;
        }


        //var file_path = 'file:///H:/myProject/lc/model.obj';

        return;
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.addEventListener('change', function (event) {
          /*loader.loadFile(fileInput.files[ 0 ],function (object) {
           _this.init_obj.scene.add(object);
           console.log(object);fileInput.files[ 0 ]
           })*/
          var loader = new THREE.OBJLoader();
          loader.load("file:///H:/myProject/lc/three.js/static/model/thing1.obj", function (object) {
            /*object.traverse( function ( child ) {
             if ( child instanceof THREE.Mesh ) {
             child.material.map = texture;
             }
             } );*/
            //object.position.y = - 95;
            _this.init_obj.scene.add(object);

          });
          //console.log(fileInput.files[ 0 ]);
        });
        fileInput.click();
      },

      // 导出对象
      exportObj()
      {
        var exporter = new THREE.OBJExporter();
        //alert(this.init_obj.scene.children.length);

        // 删除参考坐标系
        /*var scene = this.init_obj.scene;
         var position_helper = scene.getObjectByName('position_helper');
         if(position_helper)
         {
         scene.remove( position_helper );
         }*/

        // 导出obj
        //var result = exporter.parse( scene );

        // 导出json
        var output = this.init_obj.scene.toJSON();

        try {

          output = JSON.stringify(output, parseNumber, '\t');
          output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

        } catch (e) {

          output = JSON.stringify(output);

        }


        var link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link); // Firefox workaround, see #6594

        function save(blob, filename) {

          link.href = URL.createObjectURL(blob);
          link.download = filename || 'data.json';
          link.click();
          // URL.revokeObjectURL( url ); breaks Firefox...
        }

        function saveString(text, filename) {

          save(new Blob([text], {type: 'text/plain'}), filename);

        }

        var file_name = prompt('请输入文件名');
        if (!file_name) {
          file_name = 'model.json'
        }
        saveString(output, file_name);
        //console.log(result);
      },

      //更新分组列表
      updateGroupList(){
        this.group_list = groupModel.getGroupListByScene(this.init_obj.scene);
      },

      // 运行起来
      run(){
        if (this.is_run) {
          this.is_run = false;
          //this.init_obj.animate
        }
        else {
          this.is_run = true;
        }
      },

      // 动画播放回调
      animate_callback(){
        //this.init_obj.camera.position.x ++;
        ///console.log('c')
      },

      // 按键触发
      keyEmit(event_type,keyStatus)
      {
        console.log(keyStatus);
        this.keyStatus = keyStatus;
      },

      // 显示模型的数量
      showModelNum(){
        console.log(this.init_obj.scene.children.length)
      },

      // 分组测试
      groupTest()
      {
        /* var group =  this.init_obj.scene.getObjectByName('group');
         this.init_obj.objectOperateControls.attach( group );
         this.init_obj.scene.add( this.init_obj.objectOperateControls );*/

        console.log(this.group_list);
        console.log(this.init_obj.scene.children);
        console.log(groupModel.getGroupListByScene(this.init_obj.scene));
      }


    },
    watch: {
      // 监听位置变化
      "active_obj.mem_obj.position": {
        deep: true,
        handler: function () {
          if (this.active_obj.object) {
            var object = this.init_obj.scene.getObjectByName(this.active_obj.object.name);
            if (object) {
              object.position.x = Number(this.active_obj.mem_obj.position.x);
              object.position.y = Number(this.active_obj.mem_obj.position.y);
              object.position.z = Number(this.active_obj.mem_obj.position.z);
              //console.log(object.border_helper);
              //object.border_helper.update();
              //object.position.needsUpdate = true;
              //console.log(object);
            }
          }
        }

      },

      // 监听缩放的变化
      "active_obj.mem_obj.scale": {
        deep: true,
        handler: function () {
          if (this.active_obj.object) {
            var object = this.init_obj.scene.getObjectByName(this.active_obj.object.name);
            if (object) {
              console.log(this.active_obj.mem_obj.position);
              object.position.x = Number(this.active_obj.mem_obj.position.x);
              object.position.y = Number(this.active_obj.mem_obj.position.y);
              object.position.z = Number(this.active_obj.mem_obj.position.z);
              //object.border_helper.update();
              //this.init_obj.bbox.update();
              /*console.log(object.name);
               console.log(object.border_helper);*/
              //object.border_helper.update();
              //object.position.needsUpdate = true;
              //console.log(object);
            }
          }
        }
      },

      // 监听旋转的变化
      // 监听缩放的变化
      "active_obj.mem_obj.rotate": {
        deep: true,
        handler: function () {
          if (this.active_obj.object) {
            var object = this.init_obj.scene.getObjectByName(this.active_obj.object.name);
            if (object) {
              //console.log(this.active_obj.mem_obj.position);
              /*var temp = new THREE.Object3D();
               temp.add(object);
               temp.rotation.x = Number(this.active_obj.mem_obj.rotate.x);
               temp.rotation.y = Number(this.active_obj.mem_obj.rotate.y);
               temp.rotation.z = Number(this.active_obj.mem_obj.rotate.z);*/
              object.rotation.x = Number(this.active_obj.mem_obj.rotate.x);
              object.rotation.y = Number(this.active_obj.mem_obj.rotate.y);
              object.rotation.z = Number(this.active_obj.mem_obj.rotate.z);


              //object.border_helper.update();
              //this.init_obj.bbox.update();
              /*console.log(object.name);
               console.log(object.border_helper);*/
              //object.border_helper.update();
              //object.position.needsUpdate = true;
              //console.log(object);
            }
          }
        }
      },

      "camera.position": {
        deep: true,
        handler: function () {

        }
      },

      // 监听编辑模式的变化
      "editor_mode": function () {
        console.log(this.editor_mode);
        this.init_obj.objectOperateControls.setMode(this.editor_mode);
        //this.init_obj.objectOperateControls
        //console.log(this.init_obj.objectOperateControls);
      },
      // 监听gui控件的相关数据的变化
      "gui.options": {
        handler: function (old, new_) {
          console.log('gui data change');
          //console.log(this.gui.options);
          console.log(old);
          console.log(new_);
        },
        deep: true
      }
    }
  }
</script>

<style scoped>
  input {
    width: 80px;
    height: 20px;
  }

  #main {
    display: flex;
    height: 1000px;
    width: 100%;
    height: 100%;
  }

  #container {
    width: 1500px;
    height: 1000px;
  }
  #controller_panel {
    flex: 1;
    display: flex;
  }
  .panel {
    margin-top: 10px;
    padding: 5px;
    background: grey;
  }
  #gui_panel {
    display: none;
  }
</style>
