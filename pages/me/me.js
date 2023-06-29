var util = require("../../utils/util.js")
const app = getApp()
Page({
  data: {
  },
  onLoad: function (options) {
  },
  previewImg: function (e) {
    wx.previewImage({
      current: this.data.userInfo.avatarUrl,    //当前图片地址  
      //所有要预览的图片的地址集合 数组形式
      urls: [this.data.userInfo.avatarUrl],
      // success: function (res) { },
      // fail: function (res) { },
      // complete: function (res) { },
    })
  },
  onShow(){
    this.setData({
      userInfo:app.globalData.userInfo
    })
  },
  getUserProfile(e) {
    var that = this;
    wx.getUserProfile({
      desc: '用于完善用户信息', 
      fail:(e)=>{
        console.log(e);
      },
      success: (res) => {
        //查找数据库用户表里面是否有这个用户记录
        wx.cloud.database().collection('online_class_user').where({
          _openid: app.globalData.openid
        }).get({
          success(result){
            if(result.data.length!=0){
              console.log("用户存在");
              app.globalData.userInfo = result.data[0]
              that.setData({
                userInfo: result.data[0],
              })
              wx.showToast({
                title: '登录成功',
              })
            }else{
              console.log("用户不存在，正在保存数据");
              console.log(res.userInfo);

              wx.cloud.database().collection('online_class_user').add({
                data: {
                  avatarUrl:res.userInfo.avatarUrl,
                  nickName:res.userInfo.nickName,
                  time: util.formatTime(new Date())
                },
                success(res){
                  console.log(1);
                  wx.showToast({
                    title: '登录成功',
                  })
                 
                  //查找数据库用户表里用户记录
                  wx.cloud.database().collection('online_class_user').where({
                    _openid: app.globalData.openid
                  }).get({
                    success(result){
                      console.log(result);
                      app.globalData.userInfo = result.data[0]
                      that.setData({
                        userInfo: result.data[0],
                      })
                    },
                    
                fail(err){
                  // console.log(err);
                }
                  })
                },
                fail(err){
                  wx.showToast({
                    title: err,
                  })
                 
                  console.log(err);
                }
              })
            }
          },
          fail(err){
          //  console.log(err);
          }
        })
      }
    })
  },
  loginOut(){
    app.globalData.userInfo = null
    this.setData({
      userInfo:null
    })
  },
  toTeacherCenter(){
    if (!app.globalData.userInfo) {
      wx.showToast({
        icon:'none',
        title: '请先登录',
      })
    }else{
      wx.navigateTo({
        url: '/pages/me/teacher/teacher',
      })
    }
  },
  toMyOrder(){
    wx.navigateTo({
      url: '/pages/me/orders/orders',
    })
  },
  toMyErrors(){
    wx.navigateTo({
      url: '/pages/me/errorList/errorList',
    })
  },
  toMyRank(){
    wx.navigateTo({
      url: '/pages/me/ranking/ranking',
    })
  }
})