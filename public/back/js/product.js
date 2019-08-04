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
    // 手动将 name="brandId" 的input, 校验状态置成 VALID
    $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
  });

  //4.进行文件上传初始化
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
      // 如果数组的长度等于 3, 说明文件上传了 3张, 可以提交
      // 更新表单校验状态 picStatus 为 VALID
      if ( picArr.length === 3 ) {
        $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID");
      }
    }
  });

  // 5. 调用插件方法, 进行表单校验
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
    
    //  校验字段
    fields:{
      brandId:{
        validators:{
          notEmpty:{
            message:"请选择二级分类"
          }       
        }
      },
      proName:{
        validators:{
          notEmpty:{
            message:"请输入商品名称"
          }          
        }
      },
      proDesc:{
        validators:{
          notEmpty:{
            message:"请输入商品描述"
          }          
        }
      },
      num:{
        validators:{
          notEmpty:{
            message:"请选择商品库存"
          },
          // 正则校验
  /*
      * 正则复习, ^ 以...开头, $ 以...结尾
      * [] 内, 表示可以出现的字符
      * [1-9], 表示可以出现 1,2,3,4....9
      * \d 表示 0-9的数字
      *

        * 表示 0 个 或 多个
        + 表示 1 个 或 多个
        ? 表示 0 个 或 1个
        {n}   表示出现 n次
        {n,m} 表示出现 n-m 次

      * */

          regexp:{
            regexp:/^[1-9]\d*$/,
            message:"商品库存必须是非零开头的数字"
          }          
        }
      },
      //库存非空，尺码格式为xx-xx的数字格式
      size:{
        validators:{ 
          notEmpty:{
            message:"库存不能为空"
          },
          // 正则校验
          regexp:{
            regexp:/^\d{2}-\d{2}$/,
            message:"尺码格式为xx-xx的数字格式,例如32-40"
          } 
        },
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品现价"
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      // 标记图片是否上传满3张,是否是3张，在上传图片时进行手动验证
      picStatus:{
        validators:{
          notEmpty: {
            message: "请上传三张图片"
          }
        }
      },

    },
  });

  // 注册表单校验成功事件, 阻止默认的表单提交, 通过ajax提交
  $('#form').on("success.form.bv",function(e){
    e.preventDefault();
    // 注意：$('#form').serialize() 只能获取设置 name的表单元素的值,
    //      里面没有图片信息, 所以需要拼接
    // brandId=&statu=1&键=值&..
    // &picName1=xx&picAddr1=xx
    // &picName2=xx&picAddr2=xx
    // &picName3=xx&picAddr3=xx
    var paramsStr = $('#form').serialize();
    paramsStr += "&picName1="+ picArr[0].picName +"&picAddr1=" + picArr[0].picAddr;
    paramsStr += "&picName2="+ picArr[1].picName +"&picAddr2=" + picArr[1].picAddr;
    paramsStr += "&picName3="+ picArr[2].picName +"&picAddr3=" + picArr[2].picAddr;

    $.ajax({
      type:"post",
      url:"/product/addProduct",
      data:paramsStr,
      dataType:"json",
      success:function(info){
        //查看network,图片是否上传成功
        // console.log(info);
        if ( info.success ) {
          // 关闭模态框
          $('#addModal').modal("hide");
          // 页面重新渲染第一页
          currentPage = 1;
          render();
          // 重置表单, 内容和状态都重置
          $('#form').data("bootstrapValidator").resetForm(true);

          // 下拉框按钮和图片不是表单元素, 需要手动重置
          $('#dropdownTxt').text("请选择二级分类");
          // 移除所有的图片
          $('#imgBox img').remove();
          picArr = []; // 同步图片全局变量的数组
        }
      }
    });

  });

});