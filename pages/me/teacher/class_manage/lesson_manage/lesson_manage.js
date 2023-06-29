const app = getApp()
var classId
Page({


  data: {
    showZhang:false,
    showKeshi:false
  },
  setShowZhang(){
    this.setData({
      showZhang:!this.data.showZhang
    })
    if(this.data.showKeshi == true && this.data.showZhang == true){
      this.setData({
        showKeshi:!this.data.showKeshi
      })
    }
  },
  setShowKeshi(){
    this.setData({
      showKeshi:!this.data.showKeshi
    })
    if(this.data.showKeshi == true && this.data.showZhang == true){
      this.setData({
        showZhang:!this.data.showZhang
      })
    }
  },
  //设置为免费
  setFree(e){
    console.log('下标',e.currentTarget.dataset.index)
    var that = this;
    var newDetail = that.data.class.detail
    newDetail[e.currentTarget.dataset.index].free=1
    wx.cloud.database().collection('online_class_class').doc(classId).update({
      data: {
        detail:newDetail
      },
      success(res){

        console.log(res)
        wx.hideLoading({
          success: (res) => {},
        })
        
        that.getCourseDetail()
        
        wx.showToast({
          title: '提交成功！',
        })
        
      }

    })
  },
  //取消免费
  cancelFree(e){
    console.log('下标',e.currentTarget.dataset.index)
    var that = this;
    var newDetail = that.data.class.detail
    newDetail[e.currentTarget.dataset.index].free=0
    wx.cloud.database().collection('online_class_class').doc(classId).update({
      data: {
        detail:newDetail
      },
      success(res){

        console.log(res)
        wx.hideLoading({
          success: (res) => {},
        })
        
        that.getCourseDetail()
        
        wx.showToast({
          title: '提交成功！',
        })
        
      }

    })
  },
  onLoad: function (options) {
    console.log(options.id)
    classId = options.id
    this.setData({
      classId:classId
    })
    this.getCourseDetail()

  },
  getCourseDetail(){
    var that = this;
    //查询课程信息
    wx.cloud.database().collection('online_class_class').doc(this.data.classId).get({
      success(res){
        console.log(res)
        that.setData({
          class :res.data,
          
          showZhang:false,
          showKeshi:false
        })
      }

    })
  },
  submitZhang(e){
    console.log(e.detail.value.zhangName);
    if(!e.detail.value.zhangName){
      wx.showToast({
        title: '请输入新章名称',
      })
      return
    }
    console.log('课程ID：',classId)
    wx.showLoading({
      title: '提交中',
    })

    var that = this;
    var newDetail = that.data.class.detail
    var zhang = {}
    zhang.name=e.detail.value.zhangName
    zhang.type=1
    newDetail.push(zhang)

    wx.cloud.database().collection('online_class_class').doc(classId).update({
      data: {
        detail:newDetail
      },
      success(res){

        console.log(res)
        wx.hideLoading({
          success: (res) => {},
        })
        that.getCourseDetail()
        
        wx.showToast({
          title: '提交成功！',
        })
        
        
      }

    })
  },

  submitKeshi(e){
    console.log(e.detail.value.keshiName);
    if(!e.detail.value.keshiName){
      wx.showToast({
        title: '请输入课时名称',
      })
      return
    }
    console.log('课程ID：',classId)
    wx.showLoading({
      title: '提交中',
    })

    var that = this;
    var newDetail = that.data.class.detail
    var keshi = {}
    keshi.name=e.detail.value.keshiName
    keshi.type=2
    keshi.free=0//默认非免费
    keshi.video=''
    keshi.duration=''
    newDetail.push(keshi)

    wx.cloud.database().collection('online_class_class').doc(classId).update({
      data: {
        detail:newDetail
      },
      success(res){

        console.log(res)
        wx.hideLoading({
          success: (res) => {},
        })
        that.getCourseDetail()
        
        wx.showToast({
          title: '提交成功！',
        })
        
      }

    })
  },
  chooseVideo(e){
    var that = this;
    
    wx.chooseVideo({
      sourceType: ['album','camera'],
      maxDuration: 60,
      compressed: false,
      camera: 'back',
      success(res) {
        console.log(res)

        //计算时间 start
        var keshiTime = parseInt(res.duration)

        console.log(parseInt(keshiTime/3600))//小时
        console.log(parseInt(keshiTime/60))//分钟
        console.log(parseInt(res.duration-parseInt(keshiTime/3600)*3600-parseInt(keshiTime/60)*60))//秒

        var shi  =  parseInt(keshiTime/3600) + ''
        var feng =  parseInt(keshiTime/60) + ''
        var miao = parseInt(res.duration-parseInt(keshiTime/3600)*3600-parseInt(keshiTime/60)*60) + ''
        var classTime = that.zeroFill(shi,2)+':' + that.zeroFill(feng,2) + ':' + that.zeroFill(miao,2)
        console.log('转换后的时间表示：',classTime)
        //计算时间 end

        console.log(res.tempFilePath.match(/\.(\w+)$/)[1])
        wx.showLoading({
          title: '上传中',
        })
        wx.cloud.uploadFile({
          cloudPath:`classVideos/${Math.random()}_${Date.now()}.${res.tempFilePath.match(/\.(\w+)$/)[1]}`,
          filePath: res.tempFilePath,
          success(suc){
            console.log(suc.fileID)

            that.updateVideoUrl(e.currentTarget.dataset.index,suc.fileID,classTime)

          }
        })


      }
    })


  },
  //补零方法，str为数字字符串 n为需要的位数，不够补零
  zeroFill(str, n){
    if (str.length < n){
     str = '0'+str
    }
    return str
   },
  //更新课时视频地址
  updateVideoUrl(index,url,duration){
    var that = this;
    var newDetail = that.data.class.detail
    newDetail[index].video=url
    newDetail[index].duration=duration
    wx.cloud.database().collection('online_class_class').doc(classId).update({
      data: {
        detail:newDetail
      },
      success(res){

        console.log(res)
        wx.hideLoading({
          success: (res) => {},
        })
        
        that.getCourseDetail()
        
        wx.showToast({
          title: '提交成功！',
        })
        
      }

    })
  },
  delete(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success(res){
        if(res.confirm){
          console.log(e)
          wx.showLoading({
            title: '删除中',
          })
          
          var newDetail = that.data.class.detail
          newDetail.splice(e.currentTarget.dataset.index,1)

          wx.cloud.database().collection('online_class_class').doc(classId).update({
            data: {
              detail:newDetail
            },
            success(res){

              console.log(res)
              wx.hideLoading({
                success: (res) => {},
              })
              
              that.getCourseDetail()
        
              wx.showToast({
                title: '提交成功！',
              })
              
            }

          })

        }
      }
    })
  }

  
})