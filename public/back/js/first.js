$(function(){

// 1.一进入页面，需立即发送ajax请求数据，通过模板引擎渲染页面
    var currentPage = 1;//表示当前页
    var pageSize= 5; //表示每页多少条

    render();

    function render(){
        
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:currentPage,
                pageSize:pageSize,
            },
            datatype:"json",
            success:function(info){
                // console.log(info);
    
                // 3.模板引擎渲染template,tpl为模板上定义的id
                var htmlStr = template("tpl",info);
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
    });

    
    // 1.使用BootstrapValidator插件，进行模态框表单校验
    $('#form').bootstrapValidator({
      // 配置图标,固定写法
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
          },

        fields: {
            categoryName: {
              //配置校验规则 
              validators:{
                  //非空校验
                  notEmpty: {
                      message:"请输入一级分类名称"
                  },
                },
            },
        },
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
        url:"/category/addTopCategory",
        //通过表单序列化获取表单数据
        data:$("#form").serialize(),
        dataType:"json",
        success:function(info){
            console.log(info);
            // 关闭模态框
            $('#addModal').modal("hide");
            // 重新渲染到第一页面
            currentPage=1;
            render();
            //表单重置：1.true 表示将内容和状态都重置 2.false 表示只重置表单状态,默认为false
            $('#form').data("bootstrapValidator").resetForm(true);
        }

    })

  });
  




});
