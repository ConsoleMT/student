const app =getApp()
Page({


  data: {

  },

  onLoad: function (options) {

    this.getList(1)
  },
  getList(page){
    if(!app.globalData.userInfo){
      wx.showToast({
        icon:'none',
        title: '未登录',
      })
      return
    }
    if(page == 1) {
      this.setData({
        list:[]
      })
    }
    var that = this 
    wx.cloud.database().collection('online_class_order').where({
      _openid:app.globalData.userInfo._openid
    }).skip((page - 1) * 20).limit(20).orderBy('time','desc').get({
      success(res){
        console.log(res)

        if(res.data.length!=0){
          that.setData({
            list :that.data.list.concat(res.data)
          })
          that.getList(page + 1)
        }
        

      }
    })
  },
  onPullDownRefresh(){
    this.getList(1)
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
  },
  toClassDetail(e){
    
    wx.navigateTo({
      url: '/pages/index/classdetail/classdetail?id=' + e.currentTarget.dataset.id,
    })
  

    
  },

})