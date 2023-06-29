const app = getApp()
Page({


  data: {
    payed:false
  },
  //设置倍速播放
  btnClick15: function () {
    this.videoContext.playbackRate(1.5)
  },
  btnClick125: function () {
    this.videoContext.playbackRate(1.25)
  },
  onReady(res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  onLoad: function (options) {
    console.log(options.url);
    this.setData({
      videoUrl:options.url
    })

    var that = this;
    //查询课程信息
    wx.cloud.database().collection('online_class_class').doc(options.id).get({
      success(res){
        console.log(res)
        
        that.setData({
          class :res.data,
        })

      }
    })
    
    this.getOrderRecord(options.id)

  },
  toWatchVideo(e){
    // this.setData({
    //   videoUrl:e.currentTarget.dataset.url
    // })
    // this.setData({
    //   currentFocuIndex:e.currentTarget.dataset.index
    // })
    // return
    
    this.setData({
      currentFocuIndex:e.currentTarget.dataset.index
    })
    if(!e.currentTarget.dataset.url){
      wx.showToast({
        title: '讲师录课中...',
        icon:'none'
      })
    }
    if(e.currentTarget.dataset.free == 0){
      if(this.data.payed == true){
        this.setData({
          videoUrl:e.currentTarget.dataset.url
        })
      }
      if(this.data.payed ==false ){
        wx.showToast({
          title: '没有权限，请先开通',
          icon:'none'
        })
      }
    }
    if(e.currentTarget.dataset.free == 1){
      this.setData({
        videoUrl:e.currentTarget.dataset.url
      })
    }
  },
  getOrderRecord(classId){
    var that = this;
    console.log(app.globalData.userId)
    wx.cloud.database().collection('online_class_order').where({
      classId:classId,
      buyUserId:app.globalData.userId
    }).get({
      success(res){
        console.log(res)
        console.log('res.data.length=',res.data.length);
        
        if(res.data.length!=0){
          that.setData({
            payed: true
          })
        }
      }
    })
  },
  
})