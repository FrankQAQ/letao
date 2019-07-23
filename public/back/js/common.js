// 需求: 在发送第一个ajax的时候, 开启进度条, 在全部的ajax回来的时候, 结束进度条
$(document).ajaxStart(function() {
    // 开启进度条
    NProgress.start();
  });
  
  $(document).ajaxStop(function() {
    // 模拟网络延迟
    setTimeout(function() {
      // 关闭进度条
      NProgress.done();
    }, 500);
  });


  // 1. 二级分类切换功能
  // 2. 顶部菜单栏切换显示功能
  // 3.退出按钮, 点击事件
$(function(){

// 1. 二级分类切换功能
  $('.lt_aside .category').click(function(){

    $('.lt_aside .child').stop().slideToggle();

  });

  // 2. 顶部菜单栏切换显示功能
  $('.icon_menu ').click(function(){
    $('.lt_aside').toggleClass("hidemenu");
    $('.lt_topbar').toggleClass("hidemenu");
    $('.lt_main').toggleClass("hidemenu");

  });

 // 3.退出按钮, 点击显示退出模态框
  $('.icon_logout').click(function(){
    $('#logoutModal').modal("show");
  })


});


