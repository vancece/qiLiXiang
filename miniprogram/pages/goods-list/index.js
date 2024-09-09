// pages/goods-list/index.js
Page({
  data: {
    // 总价格
    totalPrize: 0,
    // 选中的主食
    selectedStapleFoodName: '',
    // 选中的配菜
    selectedSideDishName: [],
    // 所有的主食
    stapleFood: [],
    // 所有的配菜
    sideDish: [],
  },

  // 加载处理
  async onLoad(options) {
    const models = getApp().globalData.models;
    console.log('models', models)

    // 加载主食，这里可以使用 promise.all 来并发，加快加载速度 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
    const stapleFood = (await models.stapleFood.list({
      filter: {
        where: {}
      },
      pageSize: 100, // 一次性加载完，
      pageNumber: 1,
      getCount: true,
    })).data.records;

    // 加载配菜
    const sideDish = (await models.sideDish.list({
      filter: {
        where: {}
      },
      pageSize: 100, // 一次性加载完，
      pageNumber: 1,
      getCount: true,
    })).data.records;

    console.log({
      stapleFood,
      sideDish
    });

    this.setData({
      stapleFood: stapleFood,
      sideDish: sideDish
    })
  },

  // 选中主食
  onSelectStapleFood(event) {
    this.setData({
      selectedStapleFoodName: event.currentTarget.dataset.data.name
    });

    this.computeTotalPrize();
  },

  // 选中配菜
  onSelectedSideDish(event) {
    console.log(event);
    // 选中配菜名字
    const sideDishName = event.currentTarget.dataset.data.name;

    // 如果已经选中，则取消选中
    if (this.data.selectedSideDishName.includes(sideDishName)) {
      this.setData({
        selectedSideDishName: this.data.selectedSideDishName.filter((name) => (name !== sideDishName))
      });
    } else {
      // 未选中，则选中
      this.setData({
        selectedSideDishName: this.data.selectedSideDishName.concat(sideDishName)
      });
    }

    this.computeTotalPrize();
  },

  // 重新计算价格
  computeTotalPrize() {
    // 计算主食价格
    let staplePrize = 0;
    if (this.data.selectedStapleFoodName) {
      staplePrize = this.data.stapleFood.find((staple) => staple.name === this.data.selectedStapleFoodName).prize;
    }

    // 计算配菜价格
    let sideDish = 0;
    this.data.selectedSideDishName.forEach((sideDishName) => {
      sideDish += this.data.sideDish.find((sideDishItem) => (
        sideDishItem.name === sideDishName
      )).prize;
    });

    // 设置总价格
    this.setData({
      totalPrize: staplePrize + sideDish
    })
  },

  // 点击下单按钮，进行处理
  async onSubmit() {
    // 提示正在加载中
    wx.showLoading({
      title: '正在提交订单',
    });

    // 向订单中添加一条数据
    const models = getApp().globalData.models;
    await models.order.create({
      data: {
        served: false, // 是否已出餐
        sideDish: this.data.selectedSideDishName, // 配菜
        stapleFoodName: this.data.selectedStapleFoodName, // 主食名称
        prize: this.data.totalPrize, // 订单总价格
      }
    });

    // 隐藏加载中
    wx.hideLoading();

    // 显示弹窗
    await wx.showModal({
      title: '点餐成功',
      content: '您的七里香摊饼正在烹饪中！'
    });

    // 点餐完成 重置点餐内容
    this.setData({
      totalPrize: 0,
      selectedStapleFoodName: '',
      selectedSideDishName: [],
    })
  }
});