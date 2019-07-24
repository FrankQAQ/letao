$(function(){

    // 左侧柱状图
    // 基于准备好的dom，初始化echarts实例
var Histogram = echarts.init(document.getElementById('Histogram'));

// 指定图表的配置项和数据
var option1 = {
    title: {
        text: '2017年注册人数'
    },
    tooltip: {},
    legend: {
        data:['销量']
    },
    xAxis: {
        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
    },
    yAxis: {},
    series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
    }]
};

// 使用刚指定的配置项和数据显示图表。
Histogram.setOption(option1);



var echars2 = echarts.init(document.querySelector(".echarts-2"));
  option2 = {
    title : {
      text: '热门品牌销售',
      // 子标题
      subtext: '2017年6月',
      // 水平居中
      x:'center'
    },
    tooltip : {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    // 图例
    legend: {
      // 垂直排列
      orient: 'vertical',
      // 居左显示
      left: 'left',
      data: ['耐克','阿迪','新百伦','李宁','阿迪王']
    },
    series : [
      {
        name: '品牌',
        // 饼状图
        type: 'pie',
        // 圆的大小
        radius : '50%',
        // 圆心的位置
        center: ['50%', '60%'],
        data:[
          {value:335, name:'耐克'},
          {value:310, name:'阿迪'},
          {value:234, name:'新百伦'},
          {value:135, name:'李宁'},
          {value:1548, name:'阿迪王'}
        ],
        itemStyle: {
          // 设置阴影效果
          emphasis: {
            shadowBlur: 30,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 1)'
          }
        }
      }
    ]
  };
  // 使用刚指定的配置项和数据显示图表。
  echars2.setOption(option2);

});

