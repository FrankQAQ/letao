$(function(){
    // 1.一进入页面，需立即发送ajax请求数据，通过模板引擎渲染页面
    var currentPage = 1;//表示当前页
    var pageSize= 5; //表示每页多少条

    render();

    function render(){
        
        $.ajax({
            type:"get",
            url: "/category/querySecondCategoryPaging",
            data:{
                page:currentPage,
                pageSize:pageSize,
            },
            datatype:"json",
            success:function(info){
                console.log(info);
    
                // 3.模板引擎渲染template,secondTpl为模板上定义的id
                var htmlStr = template("secondTpl",info);
                // 4.根据生成的 htmlStr 模板，渲染tbody
                $('tbody').html(htmlStr);
                

                // 2.分页插件初始化
            $('#paginator').bootstrapPaginator({
            // a.版本号 3
            bootstrapMajorVersion:3,
             //b.总页数
             totalPages:Math.ceil( info.total/info.size), 
             //c.当前页
             currentPage:info.page,  
             // d.给分页按钮添加点击事件
             onPageClicked:function(a,b,c,page){
                 console.log(page);
    
                 //更新当前页
                 currentPage = page;
    
                //根据点击后的页码再次重新渲染
                render();
            }
            });
        },  
        });
    };

    // 点击添加分类按钮，并注册点击事件，显示添加模态框
    $('#addBtn').click(function(){
        // 显示模态框
        $('#addModal').modal("show");

        // 因为文档缺一个接口，所以此处用分页接口进行模拟AJAX请求
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:1,
                pageSize:100
            },
            dataType:"json",
            success:function(info){
                console.log(info);
              // 3.模板引擎渲染template,tpl为模板上定义的id
              var htmlStr = template("dropdownTpl",info);
              // 4.根据生成的 htmlStr 模板，渲染tbody
              $('.dropdown-menu').html(htmlStr);
            }
        })


    });

    // 给分类按钮的下拉框中的a标签添加点击事件（动态选软的元素用事件委托），获取a中的文本并设置给按钮
    $('.dropdown-menu').on("click","a",function(){
         // 选中的文本
        var txt = $(this).text();
        // 修改文本内容
        $('#dropdownText').text( txt );
        //获取当前a中存储的id， 
        var id=$(this).data("id");
        // 设置给name="categoryId"的input
        $('[name = "categoryId"]').val(id);

        //选择一级分类后，将此校验状态改为成功
        // updateStatus
        // 参数1: 字段名称
        // 参数2: 校验状态： NOT_VALIDATED 未检验的, 
        //                  VALIDATING 校验中, 
        //                  INVALID 失败 or VALID 成功
        // 参数3: 校验规则, 配置校验错误的提示信息，如果成功，不需要配置
        $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");
    });

    // 文件上传初始化
    $("#fileupload").fileupload({
        dataType:"json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done:function (e, data) {
          console.log(data);
        //   获取图片地址
        var picUrl = data.result.picAddr;
        // 设置给图片src地址
        $('#imgBox img').attr("src", picUrl);

        // 将上传的图片地址设置给name="brandLogo"的input，用于提交
        $('[name="brandLogo"]').val(picUrl);
        
        //选择图片后，将此校验状态改为成功
        // updateStatus
        // 参数1: 字段名称
        // 参数2: 校验状态： NOT_VALIDATED 未检验的, 
        //                  VALIDATING 校验中, 
        //                  INVALID 失败 or VALID 成功
        // 参数3: 校验规则, 配置校验错误的提示信息，如果成功，不需要配置
        $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");

        }

  });

    // 表单校验初始化
        //进行表单校验配置
        $('#form').bootstrapValidator({

            // 注意：因为我们有隐藏的INPUT需要校验，所以将默认的排除项, 
            //       重置掉 (默认会对 ':hidden', ':disabled'等进行排除)
            excluded: [],


            // 配置图标,固定写法
            feedbackIcons: {
              valid: 'glyphicon glyphicon-ok',
              invalid: 'glyphicon glyphicon-remove',
              validating: 'glyphicon glyphicon-refresh'
            },
        
                //配置校验字段
                fields: {
                    categoryId: {
                        //配置校验规则 
                        validators:{
                            //非空校验
                            notEmpty: {
                                message:"请选择一级分类"
                            },
                        }       
                    },
                    brandName:{
                        validators:{
                            notEmpty:{
                                message:"请输入二级分类"
                            },       
                        }
                    },
                    brandLogo:{
                        validators:{
                            notEmpty:{
                                message:"请选择图片"
                            },       
                        }
                    }
                }
        
        });

//阻止这次默认的提交, 通过 ajax 进行请求提交
  // 表单校验插件有一个特点, 在表单提交的时候进行校验
  // 如果校验成功, 继续提交, 需要阻止这次默认的提交, 通过 ajax 进行请求提交
  // 如果校验失败, 默认会阻止提交
    $('#form').on("success.form.bv",function( e ){
        // 阻止默认的表单提交
       e.preventDefault();
       // 通过 ajax 进行请求提交
       $.ajax({
           type:"post",
           url:"/category/addSecondCategory",
           //通过表单序列化获取表单数据
           data:$("#form").serialize(),
           datatype:"json",
           success: function( info ) {

               console.log(info);
               if(info.success ){
                //提交成功，关闭模态框
                $('#addModal').modal("hide");
                // 重新渲染到第一页
                currentPage=1;
                render();

                // 表单重置
                //调用插件的方法只能重置表单元素，按钮和下拉框需要手动重置
                //resetForm(boolean)
                //1.true 表示将内容和状态都重置 2.false 表示只重置表单状态,默认为false
                $('#form').data("bootstrapValidator").resetForm(true);
                // 按钮和下拉框需要手动重置
                $('#dropdownText').text( "请选择一级分类" );
                $('#imgBox img').attr("src", "images/none.png");
               }
           }
 
       })
   });
       


});