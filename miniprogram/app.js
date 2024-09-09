// app.js
App({
  globalData: {
    // 在这里提供全局变量 models 数据模型方法，方便给页面使用
    models: null
  },

  onLaunch: async function () {
    const {
      init
    } = require('@cloudbase/wx-cloud-client-sdk')
    // 指定云开发环境 ID，这里需要替换给你的环境 id
    wx.cloud.init({
      env: "ju-9g1guvph88886b02",
    });
    const client = init(wx.cloud);
    this.globalData.models = client.models;

    // 可以取消注释查看效果
    // const { data } = await models.stapleFood.list({
    //   filter: {
    //     where: {}
    //   },
    //   pageSize: 10,
    //   pageNumber: 1,
    //   getCount: true,
    // });

    // console.log('当前的主食数据：');
    // console.log(data.records);
  }
});