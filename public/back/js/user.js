$(function(){

    // 1.一进入页面，需立即发送ajax请求数据，通过模板引擎渲染页面

    var currentPage = 1;//表示当前页
    var pageSize= 5; //表示每页多少条
    var currentId;  //声明一个全局变量，保存用户ID

    render();  //一进入页面就渲染

    function render(){

        $.ajax({
            type:"get",
            url:"/user/queryUser",
            data:{
                page:currentPage,   //页码
                pageSize:pageSize,    //每页多少条
                
            },
            dataType:"json",
            success:function(info){
                //  console.log(info)
    
                // 3.模板引擎渲染template(模板id,数据对象)
                var htmlStr = template("tpl",info);
                // 4.根据生成的 htmlStr 模板，渲染tbody
                $('tbody').html( htmlStr );
    
    
                // 分页插件
            $('#paginator').bootstrapPaginator({
                bootstrapMajorVersion:3, //指定boostrap的版本
                totalPages:Math.ceil( info.total/info.size),  //总页数
                currentPage:info.page,  //当前页
                // 给分页按钮添加点击事件
                onPageClicked:function(a,b,c,page){
                    console.log(page);

                    //更新当前页
                    currentPage = page;

                    //根据点击后的页码再次重新渲染
                    render();
                }
                
            });
    
            }
        });
    
        
    }


    // A.点击启用，禁用按钮，显示模态框，通过事件委托绑定事件
    $('tbody').on("click",".btn",function(){
        // console.log('111');
        // 显示模态框
        $('#userModal').modal("show");

        //同时，获取当前按钮的用户ID
        currentId=$(this).parent().data("id");
        // console.log(currentId);
        // 点击禁用按钮的同时，获取isDelete的值：0 表示用户状态为已经禁用
        isDelete=$(this).hasClass("btn-danger") ? 0 :1;

    });

    //B.点击模态框的确定按钮，实现用户状态修改,发送ajax请求,参数文档显示为需要id和isDelete
    $('#submitBtn').on("click",function(){
        $.ajax({
            type:"post",
            url:"/user/updateUser",
            data:{
                id:currentId,
                isDelete:isDelete
            },
            dataType:"json",
            success:function(info){
                // 
                if(info.success){
                    // 关闭模态框
                    $('#userModal').modal("hide");
                    //重新渲染
                    render();
                }
            }
        })
        
    });
    

});