
Page({


  data: {

  },

  onLoad: function (options) {
    this.getType()
  },

  getType(){
    var that = this;
    wx.cloud.database().collection('online_class_type').get({
      success(res){
        console.log(res)
        
        that.setData({
          typeList :res.data,
        })
      }

    })
  },
  toSearch(){
    wx.navigateTo({
      url: '/pages/type/search/search',
    })
  },
  toVideosByTypeName(e){
    wx.navigateTo({
      url: '/pages/type/videos/videos?typeName=' + e.currentTarget.dataset.typename,
    })
  },
  toVideosByFieldName(e){
    wx.navigateTo({
      url: '/pages/type/videos/videos?fieldName=' + e.currentTarget.dataset.fieldname,
    })
  }


})