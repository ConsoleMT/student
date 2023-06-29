const app = getApp()
Page({
  onShow() {

    // wx.cloud.callFunction({
    //   name: "users"
    // }).then(res => {
    //   console.log("积分排名", res)
    //   this.setData({
    //     userList: res.result.data
    //   })
    // })

    wx.cloud.database().collection('online_class_user').orderBy("score", 'desc').get()
    .then(res=>{
      console.log("积分排名", res.data)
      this.setData({
        userList: res.data
      })
    })

  },
  //去答题页
  goQuestions() {
    // 发布之前先判断是否登录和注册
    if (app.globalData.userInfo) {
      wx.switchTab({
        url: '/pages/tiku/tiku',
      })
    } else {
      wx.showModal({
        title: "请先注册",
        content:'注册用户后才可以参与积分排名',
        success: res => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/me/me',
            })
          }
        }
      })
    }
  }
})