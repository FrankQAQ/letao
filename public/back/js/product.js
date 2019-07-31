$(function(){
    // 一：一进入页面，需立即发送ajax请求数据，通过模板引擎渲染页面
    var currentPage = 1;//表示当前页
    var pageSize= 5; //表示每页多少条
    
    render();
    function render(){
        $.ajax({
            type:"get",
            url: "/product/queryProductDetailList",
            data:{
                page:currentPage,
                pageSize:pageSize,
            },
            datatype:"json",
            success:function(info){
                console.log(info);
                // 3.模板引擎渲染template,secondTpl为模板上定义的id
                var htmlStr = template("productTpl",info);
                // 4.根据生成的 htmlStr 模板，渲染tbody
                $('tbody').html(htmlStr);

                // 分页插件初始化
                $('#paginator').bootstrapPaginator({
                    // a.版本号 3
                    bootstrapMajorVersion: 3,
                    //b.总页数
                    totalPages:Math.ceil(info.total/info.size),
                    //c.当前页
                    currentPage:info.page,
                    // d.给分页按钮添加点击事件
                    onPageClicked:function(a,b,c,page){
                        // console.log(page);
                    //更新当前页
                    currentPage = page;
    
                    //根据点击后的页码再次重新渲染
                    render();
                    }
                })
            }
        });
    };

});