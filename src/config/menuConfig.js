const menuList = [
  {
    title: '首页',
    key: '/home'
  },
  {
    title: '商品',
    key: '/products',
    children: [
      {
        title: '品类管理',
        key: '/category'
      },
      {
        title: '商品管理',
        key: '/product'
      },
    ]
  },

  {
    title: '城市管理',
    key: '/city'
  },
  {
    title: '订单管理',
    key: '/order',
    btnList: [
      {
        title: '订单详情',
        key: 'detail'
      },
      {
        title: '结束订单',
        key: 'finish'
      }
    ]
  },
  {
    title: '员工管理',
    key: '/user'
  },
  {
    title: '权限设置',
    key: '/permission'
  },
  {
    title: '图形图表',
    key: '/charts',
    children: [
      {
        title: '柱形图',
        key: '/charts/bar'
      },
      {
        title: '折线图',
        key: '/charts/line'
      },
      {
        title: '饼图',
        key: '/charts/pie'
      },
    ]
  },
];
export default menuList;