const db = wx.cloud.database()
const app = getApp()
Page({
  data: {

    
  },
  //获取所有题目类型
  onLoad() {
    

    this.getCurrentDate()
    //this.getBannerList()

    const $ = db.command.aggregate
    db.collection('tiku_questions').aggregate()
      .group({
        _id: '$type',
        num: $.sum(1)
      }).end().then(res => {
        console.log('题目类型', res)
        this.setData({
          list: res.list
        })
      })

    
    db.collection('tiku_exams').aggregate()
      .group({
        _id: '$type',
        num: $.sum(1)
      }).end().then(res => {
        console.log('题目类型', res)
        this.setData({
          examList: res.list
        })
      })
  },
  getCurrentDate(){
    var now = new Date();
    var day = now.getDay();
    var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    var week = weeks[day];
    this.setData({
      week,
      month:now.getMonth() + 1,
      day:now.getDate()
    })
  },
  
  //轮播数据
  getBannerList(){
    

    var that = this 
    wx.cloud.database().collection('tiku_banners').orderBy('sort','desc').get({
      success(res){
        console.log(res)

        that.setData({
          bannerList :res.data
        })

      }
    })
    
  },
  //去轮播图详情页
  toBannerDetail(e){
    wx.navigateTo({
      url: '/pages/home/bannerDetail/bannerDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  //去题目列表页
  goQuestionList(e) {
    if(!app.globalData.userInfo){
      wx.switchTab({
        url: '/pages/me/me',
        success(res){
          wx.showToast({
            icon:'none',
            title: '请先登录认证',
          })
        }
      })
      return
    }
    wx.navigateTo({
      url: '/pages/tiku/questionList/questionList?type=' + e.currentTarget.dataset.type,
    })
  },
  //去题目列表页
  goExamQuestionList(e) {
    if(!app.globalData.userInfo){
      wx.switchTab({
        url: '/pages/me/me',
        success(res){
          wx.showToast({
            icon:'none',
            title: '请先登录认证',
          })
        }
      })
      return
    }
    wx.navigateTo({
      url: '/pages/tiku/examList/examList?type=' + e.currentTarget.dataset.type,
    })
  },
  //随机答题
  goRandom() {
    if(!app.globalData.userInfo){
      wx.switchTab({
        url: '/pages/me/me',
        success(res){
          wx.showToast({
            icon:'none',
            title: '请先登录认证',
          })
        }
      })
      return
    }
    wx.navigateTo({
      url: '/pages/tiku/questions/questions',
    })
  }

})