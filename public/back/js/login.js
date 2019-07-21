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
                    },
                     callback: {
                        message: "用户名不存在"
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
                    },
                    callback: {
                        message: "密码错误"
                      }
                }

            }
        }

    });


  // 2. 进行登录请求
  //    通过 ajax 进行登录请求

  // 表单校验插件有一个特点, 在表单提交的时候进行校验
  // 如果校验成功, 继续提交, 需要阻止这次默认的提交, 通过 ajax 进行请求提交
  // 如果校验失败, 默认会阻止提交
    $('#form').on("success.form.bv",function( e ){
         // 阻止默认的表单提交
        e.preventDefault();
        // 通过 ajax 进行登录请求
        $.ajax({
            type:"post",
            url:"/employee/employeeLogin",
            //通过表单序列化获取表单数据
            data:$("#form").serialize(),
            datatype:"json",
            success: function( info ) {
                // 
                if(info.success ){
                    //登录成功，跳转到首页
                    location.href = "index.html";
                }
                if(info.error===1000){
                    // alert("用户名不存在");
                    $('#form').data("bootstrapValidator").updateStatus("username", "INVALID", "callback");



                }
                if(info.error===1001){
                    // alert("密码错误");
                // updateStatus
                // 参数1: 字段名称
                // 参数2: 校验状态  NOT_VALIDATED 未检验的, VALIDATING 校验中, INVALID 失败 or VALID 成功
                // 参数3: 校验规则, 配置提示信息
                $('#form').data("bootstrapValidator").updateStatus("password", "INVALID", "callback")

                }


            }
  
        })
    });

    //3.添加重置功能
    $('[type="reset"]').click(function(){
        //调用插件的方法
        //resetForm(boolean)
        //1.ture 表示将内容和状态都重置 2.false 表示只重置表单状态
        $('#form').data("bootstrapValidator").resetForm();


        
    })






});

