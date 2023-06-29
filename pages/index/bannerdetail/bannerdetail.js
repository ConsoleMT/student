
Page({

  data: {

  },

  onLoad: function (options) {
    console.log(options.id)
    this.getBannerDetail(options.id)
  },

  getBannerDetail(bannerId){
    var that = this;

    wx.cloud.database().collection('online_class_banner').doc(bannerId).get({
      success(res){
        console.log(res)
  
          that.setData({
            banner: res.data
          })

      }
    })
  },

})