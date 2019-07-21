$(function() {

    //进行表单校验配置
    $('#form').bootstrapValidator({


    // 配置图标,固定写法
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

        //配置校验字段
        fields: {
            username: {
                //配置校验规则 
                validators:{
                    //非空校验
                    notEmpty: {
                        message:"当前用户名不能为空"
                    },
                    //长度校验
                    stringLength: {
                        min:2,
                        max:6,
                        message: "用户名长度必须是2-6位"
                    }
                }

            },
            password:{
                validators:{
                    notEmpty:{
                        message:"密码不能为空"
                    },
                    stringLength: {
                        min:6,
                        max:12,
                        message:"密码长度必须是6-12位"
                    }
                }

            }
        }

    });

});

