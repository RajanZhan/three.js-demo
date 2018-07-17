/**
 * Created by Administrator on 2017/7/19.
 */
/*
* 分组管理模块
* */


export  default {

  // 获取场景的分组列表
  getGroupListByScene(scene)
  {
    if((!scene) || (scene.children.length <= 0))
    {
     return null;
    }
    var group_list = [];
    for(let obj of scene.children)
    {
      if(obj.type == 'Group')
      {
        group_list.push(obj);
      }
    }
    return group_list;
  },


  // 根据场景，组name ，激活分组
  activeGroup(component_object,group_name){


    if((!component_object) || (!group_name))
    {
      return;
    }

    // 获取即将要激活的group
    var group =   component_object.init_obj.scene.getObjectByName(group_name);
    if(!group)
    {
      return;
    }

    // 移除原先激活的对象以及transformControl
    component_object.init_obj.objectOperateControls.detach(component_object.active_obj.object);
    component_object.init_obj.scene.remove( component_object.init_obj.objectOperateControls );

    // 激活 分组
    component_object.active_obj.object = group;
    component_object.active_obj.mem_obj.position = group.position;
    component_object.active_obj.mem_obj.scale = group.scale;
    //component_object.active_obj.mem_obj.color = group.material.color;
    component_object.active_obj.mem_obj.rotate = group.rotation;
    component_object.active_obj.empty = false;
    group.is_active = true;


    // 将transformControl 添加到分组的激活中
    component_object.init_obj.objectOperateControls.attach(component_object.active_obj.object);
    component_object.init_obj.scene.add( component_object.init_obj.objectOperateControls );



  }


}
