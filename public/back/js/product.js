$(function(){
// 全局变量
    var currentPage = 1;//表示当前页
    var pageSize= 2; //表示每页多少条
    var picArr = [];  // 维护所有用于提交的图片
// 一：一进入页面，需立即发送ajax请求数据，通过模板引擎渲染页面
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
                // console.log(info);
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
                    },
                    
                    // 修改分页插件按钮显示的文字
                    // itemTexts 是一个函数, 每个按钮在初始化的时候, 都会调用该函数
                    // 将该函数的返回值, 作为按钮的文本
                    // type: 按钮的类型, page, first, last, prev, next
                    // page: 表示点击按钮跳转的页码
                    // current: 当前页
                    itemTexts:function(type,page,current){
                        switch ( type ){
                            case "page":
                              return page;
                            case "first":
                              return "首页";
                            case "last":
                              return "尾页";
                            case "prev":
                              return "上一页";
                            case "next":
                              return "下一页";
                        }
                    },

                    // 给分页组件添加hover时的提示文本：每个按钮在初始化的时候, 都会调用一次该函数
                    // 将该函数的返回值, 作为按钮的 title 提示文本
                    tooltipTitles: function(type, page, current) {
                      switch ( type ) {
                        case "page":
                          return "前往第" + page + "页";
                        case "first":
                          return "首页";
                        case "last":
                          return "尾页";
                        case "prev":
                          return "上一页";
                        case "next":
                          return "下一页";
                      }
                    },

                    // 使用 bootstrap 的内置提示框组件
                    useBootstrapTooltip: true

                })
            }
        });
    };

    //二。点击添加商品按钮，显示模态框
    $('#addBtn').click(function(){
      $('#addModal').modal("show");

      // 发送 ajax 请求, 获取全部的二级分类数据, 进行渲染下拉框
      // 通过分页接口模拟,获取全部数据的接口, 传page:1, pageSize:100
      $.ajax({
        type:"get",
        url:"/category/querySecondCategoryPaging",
        data:{
          page:1,
          pageSize:100,
        },
        dataType:"json",
        success:function(info){
          console.log(info);
          var htmlStr= template("dropdownTpl",info);
          $('.dropdown-menu').html(htmlStr);
        }
      })
    });

  // 3. 给下拉列表的 a 标签添加点击事件(通过事件委托注册)
  // 优点:(1) 可以给动态生成的元素, 添加点击事件
  //      (2) 可以批量注册事件, 且执行效率高, 给大量子元素注册事件, 只需要给父元素注册一次即可
  $('.dropdown-menu').on("click","a",function(){
    // 获取文本, 设置给按钮
    var txt = $(this).text();
    $('#dropdownTxt').text( txt );
    // 获取 id, 设置给隐藏域
    var id = $(this).data("id");
    $('[name="brandId"]').val( id );

  });

  // 进行文件上传初始化
  $('#fileupload').fileupload({
    dataType:"json",
    // 文件上传, 响应回来时调用的回调函数
    done:function(e,data){
      // 后台返回的结果
      console.log(data.result);
      // 将图片对象(名称和地址)存储在数组中, 往前面追加
      picArr.unshift( data.result);
      // 图片地址
      var picUrl = data.result.picAddr;

      // 一旦响应得到图片地址, 就将图片渲染给用户看
      $('#imgBox').prepend('<img src="'+ picUrl +'" width="100" height="100" alt="">');
      // 如果数组长度大于 3, 就需要移除最后一张
      // (1) dom 结构中, 移除最后一张图片
      // (2) 数组中, 移除最后一项
      if ( picArr.length > 3 ) {
        // 找imgBox中最后一个img类型的元素, 让其自杀
        $('#imgBox img:last-of-type').remove();
        // 数组移除最后一项
        picArr.pop();
      }
    }
  });

});