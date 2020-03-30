const WXAPI = require('apifm-wxapi')
const CONFIG = require('../../config.js')
const TOOLS = require('../../utils/tools.js')
const BILLION = require("../api/billion.js")
//获取应用实例
var app = getApp()
Page({
  data: {
    inputVal: "", // 搜索框内容
    loadingHidden: false, // loading
    selectCurrent: 0,
    categories: [],
    activeCategoryId: 0,
    goods: [],

    scrollTop: 0,
    loadingMoreHidden: true,
    coupons: [],
    curPage: 1,
    pageSize: 20,
    cateScrollTop: 0
  },

  tabClick: function(e) {
    wx.navigateTo({
      url: '/pages/goods/list?categoryId=' + e.currentTarget.id,
    })
  },
  toDetailsTap: function(e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  tapBanner: function(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.navigateTo({
        url
      })
    }
  },
  adClick: function(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.navigateTo({
        url
      })
    }
  },
  bindTypeTap: function(e) {
    this.setData({
      selectCurrent: e.index
    })
  },
  onLoad: function(e) {
    wx.showShareMenu({
      withShareTicket: true
    })
    const that = this
    // if (e && e.query && e.query.inviter_id) { 
    //   wx.setStorageSync('referrer', e.query.inviter_id)
    // }
    if (e && e.scene) {
      const scene = decodeURIComponent(e.scene)
      if (scene) {
        wx.setStorageSync('referrer', scene.substring(11))
      }
    }
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
    this.initBanners()
    BILLION.goods({}).then(res => {
      this.setData({
        goods: res
      })
    })
    that.getNotice()
  },
  async initBanners() {
    const _data = {}
    // 读取头部轮播图
    const res1 = await BILLION.banners()
    _data.banners = res1
    this.setData(_data)
  },
  onShow: function(e) {
    this.setData({
      shopInfo: wx.getStorageSync('shopInfo')
    })
    // 获取购物车数据，显示TabBarBadge
    TOOLS.showTabBarBadge();
  },
  onPageScroll(e) {
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  async getGoodsList(categoryId, append) {
    if (categoryId == 0) {
      categoryId = "";
    }
    wx.showLoading({
      "mask": true
    })
    try {
      const res = await BILLION.goods({
        categoryId: categoryId,
        nameLike: this.data.inputVal,
        page: this.data.curPage,
        pageSize: this.data.pageSize
      })
      wx.hideLoading()
      let goods = [];
      if (append) {
        goods = this.data.goods
      }
      for (var i = 0; i < res.length; i++) {
        goods.push(res[i]);
      }
      this.setData({
        loadingMoreHidden: true,
        goods: goods,
      });
    } catch (error) {
      let newData = {
        loadingMoreHidden: false
      }
      if (!append) {
        newData.goods = []
      }
      this.setData(newData);
      return
    }
  },
  onShareAppMessage: function() {
    return {
      title: '"' + wx.getStorageSync('mallName') + '" ' + CONFIG.shareProfile,
      path: '/pages/index/index?inviter_id=' + wx.getStorageSync('uid')
    }
  },
  getNotice: function() {
    var that = this;
    BILLION.noticeList().then(function(res) {
      that.setData({
        noticeList: res
      });
    })
  },
  onReachBottom: function() {
    this.setData({
      curPage: this.data.curPage + 1
    });
    this.getGoodsList(this.data.activeCategoryId, true)
  },
  onPullDownRefresh: function() {
    this.setData({
      curPage: 1
    });
    this.getGoodsList(this.data.activeCategoryId)
    wx.stopPullDownRefresh()
  },
  bindinput(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  bindconfirm(e) {
    this.setData({
      inputVal: e.detail.value
    })
    wx.navigateTo({
      url: '/pages/goods/list?name=' + this.data.inputVal,
    })
  },
})