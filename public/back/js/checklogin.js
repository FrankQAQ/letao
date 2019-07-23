//   4.登录拦截功能，当前没登录的用户，需要拦截到登录页
  $.ajax({
    type:"get",
    url:"/employee/checkRootLogin",
    dataType:"json",
    success:function(info){
      // console.log(info);
      if(info.error === 400){
        // 未登录，拦截
        location.href="login.html";
      }
      if(info.sucess){
        console.log("当前用户已登录");
      }
    }
  });