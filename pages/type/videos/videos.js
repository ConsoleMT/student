const app = getApp()



Page({ 

  /**
   * 页面的初始数据
   */
  data: {
    list:[],

    keywords: '', // 搜索的关键字
 
  },
  onLoad(options){
    if(options.typeName){
      this.setData({
        typeName:options.typeName
      })
      this.getList(1)
    }
    if(options.fieldName){
      this.setData({
        fieldName:options.fieldName
      })
      this.getList(1)
    }
    
  },
  toDetail(e){
    
    wx.navigateTo({
      url: '/pages/index/classdetail/classdetail?id=' + e.currentTarget.dataset.id,
    })
    
    
    
    
  },
  searchFreshThings(e) {
    var that = this;
    //获取搜索的内容
    //console.log(e.detail.value)
    var value = e.detail.value;
    that.data.keywords = value;

    if (value == null || value == ''){
      wx.showToast({
        title: '搜索内容为空！',
        icon:'none'
      })
    }
    if(value!=null && value!=''){
      this.getList(1)
    }
    
  },
  //所有
  getList(page){
    if(page == 1) {
      this.setData({
        list:[]
      })
    }
    const db = wx.cloud.database()
    const _ = db.command
    var that = this 
    wx.cloud.database().collection('online_class_class').where({
      typeName:this.data.typeName,
      fieldName:this.data.fieldName
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
      url: '/pages/index/classdetail/classdetail?id=' + e.currentTarget.dataset.id,
    })
    
    
  },
})