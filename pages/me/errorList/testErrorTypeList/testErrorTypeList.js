const db = wx.cloud.database()
const app = getApp()
Page({
  onLoad(e) {
    

    wx.cloud.database().collection('tiku_test_results').where({
      testId:e.type,
      _openid:app.globalData.openid
    }).get().then(res=>{
      console.log(res)
      this.setData({
        testResult:res.data[0]
      })
    })

    wx.setNavigationBarTitle({
      title: e.type + '错题',
    })
    this.setData({
      type: e.type
    })

    
  },
  onShow(){
    console.log("一级题目类型", this.data.type)
    const $ = db.command.aggregate
    db.collection('tiku_test_errors').aggregate()
      .match({
        testId: this.data.type
      })
      .group({
        _id: '$type2',
        num: $.sum(1)
      })
      .end().then(res => {
        console.log('二级题目类型', res)
        this.setData({
          list: res.list
        })
      })
  },
  //去答题
  goDetail(e) {
    let type1 = this.data.type
    let type2 = e.currentTarget.dataset.type2

    wx.navigateTo({
      url: '/pages/me/errorList/testErrorQuestions/testErrorQuestions?type1=' + type1 + '&type2=' + type2,
    })
  }
})