
const app = getApp()

Page({

  data: {



  },
  onLoad(){
    this.getBannerList()
    this.getList(1)
    this.getType()
  },
  getBannerList(){
    

    var that = this 
    wx.cloud.database().collection('online_class_banner').orderBy('sort','desc').get({
      success(res){
        console.table(res.data)

        that.setData({
          bannerList :res.data
        })

      }
    })
    
  },
  toBannerDetail(e){
    wx.navigateTo({
      url: '/pages/index/bannerdetail/bannerdetail?id=' + e.currentTarget.dataset.id,
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
      ispass:1
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
    this.getBannerList()
    this.getList(1)
    this.getType()
  },
  toClassDetail(e){
    
    wx.navigateTo({
      url: '/pages/index/classdetail/classdetail?id=' + e.currentTarget.dataset.id,
    })
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
})
