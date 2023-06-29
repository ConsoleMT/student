// app.js
App({
  onLaunch() {
    

    wx.cloud.init({
      env: "cloud-6gpvk1h62d67fa3f",
      traceUser: true,
    })
    this.getUserinfo()
  },
  getUserinfo(){
    //获取用户的openid
    var that = this;
    wx.cloud.callFunction({
      name:'login_get_openid',
      success(res){
        console.log(res)
        that.globalData.openid = res.result.openid

        //查找数据库用户表里面是否有这个用户记录
        wx.cloud.database().collection('online_class_user').where({
          _openid: res.result.openid
        }).get({
          success(result){

            console.log(result)
            that.globalData.userInfo = result.data[0]

          }
        })

      }
    })
  },

  globalData: {
    userInfo: null,
    openid:'',
    randomNum: 5, //随机答题的时候随机几道题
  }
  
})
