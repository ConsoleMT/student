const db = wx.cloud.database()
Page({
  data: {},
  //获取所有题目类型
  onShow() {
    const $ = db.command.aggregate
    db.collection('tiku_errors').aggregate()
      .group({
        _id: '$type',
        num: $.sum(1)
      }).end().then(res => {
        console.log('题目类型', res)
        this.setData({
          list: res.list
        })
      })


      db.collection('tiku_test_errors').aggregate()
      .group({
        _id: '$testId',
        num: $.sum(1)
      })
      .sort({
        _id: -1
      }).end().then(res => {
        console.log('考试批次', res)
        this.setData({
          testList: res.list
        })
      })

  },

  //去题目列表页
  goQuestionList(e) {
    wx.navigateTo({
      url: '/pages/me/errorList/errorTypeList/errorTypeList?type=' + e.currentTarget.dataset.type,
    })
  },
  //去题目列表页
  goTestQuestionList(e) {
    wx.navigateTo({
      url: '/pages/me/errorList/testErrorTypeList/testErrorTypeList?type=' + e.currentTarget.dataset.type,
    })
  },
  //去答题页重新答题
  goHome() {
    wx.switchTab({
      url: '/pages/tiku/tiku',
    })
  }

})