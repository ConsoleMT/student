
Page({


  data: {

  },

  onLoad: function (options) {
    console.log(options)
    this.setData({
      totalScore:options.totalScore,
      totalError:options.totalError,
      testTimeMin:options.testTimeMin,
      testTimeSec:options.testTimeSec,
      totalError:options.totalError,
    })
  },
  //去查看错题集
  seeError() {
    console.log('点击了查看错题集')
    //跳页
    wx.navigateTo({
      url: '/pages/me/errorList/errorList'
    })
  },
  
})