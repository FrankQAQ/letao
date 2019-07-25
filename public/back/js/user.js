$(function(){

    // 1.一进入页面，需立即发送ajax请求数据，通过模板引擎渲染页面

    var currentPage = 1;//表示当前页
    var pageSize= 5; //表示每页多少条

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

    

});