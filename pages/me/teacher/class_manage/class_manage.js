const app = getApp()
Page({


  data: {

  },
  onLoad: function (options) {
    
  },
  onShow(){
    this.getList(1)
  },
  onPullDownRefresh(){
    this.getList(1)
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
  },
  getList(page){
    if(page == 1) {
      this.setData({
        list:[]
      }) 
    }
    var that = this 
    wx.cloud.database().collection('online_class_class').where({
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
  toClassDetail(e){
    wx.navigateTo({
      url: '/pages/me/onlineclass/classdetail/classdetail?id=' + e.currentTarget.dataset.id,
    })
  },

  toEdit(e){
    console.log(e)
    wx.navigateTo({
      url: 'add/add?id=' +e.currentTarget.dataset.id,
    })
  },
  toAddVideo(e){
    console.log(e)
    wx.navigateTo({
      url: 'lesson_manage/lesson_manage?id=' +e.currentTarget.dataset.id,
    })
  }
  
})