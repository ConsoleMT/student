
var util = require("../../../utils/util.js")
const app =getApp()
Page({

  data: {
    teacher:null
  },
  onShow(){
    
  },
  onLoad: function (options) {
    
  
  },
  toApply(){
    wx.navigateTo({
      url: 'apply/apply',
    })
  }
  
})