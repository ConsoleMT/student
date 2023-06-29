const util = require("../../../utils/util");

const app = getApp()

Page({

  data: {
    payed:false
  },

  previewImg: function (e) {
    
    wx.previewImage({
      current: this.data.class.images,    //当前图片地址  
      //所有要预览的图片的地址集合 数组形式
      urls: [this.data.class.images],
      // success: function (res) { },
      // fail: function (res) { },
      // complete: function (res) { },
    })
  },
  previewFaceImg: function () {
    
    wx.previewImage({
      current: this.data.teacher.image,    //当前图片地址  
      //所有要预览的图片的地址集合 数组形式
      urls: [this.data.teacher.image],
      // success: function (res) { },
      // fail: function (res) { },
      // complete: function (res) { },
    })
  },

  onLoad: function (options) {
    console.log('idddddd=',options.id)

    //获取订单记录
    if(app.globalData.userInfo){
      this.getOrderRecord(options.id)
    }
    

    var that = this;
    //查询课程信息
    wx.cloud.database().collection('online_class_class').doc(options.id).get({
      success(res){
        console.log(res)
        
        that.setData({
          class :res.data,
        })
        //查询讲师信息
        that.getTeacherInfo(res.data.teacherId)
        //更新浏览量
        that.updateBrowse()
      }
    })
  },
  //更新浏览量
  updateBrowse(){
    var that = this;
    var num = 0;
    console.log(that.data.class.browseCount)
    if(!that.data.class.browseCount){
      num = 1
    }else{
      num = that.data.class.browseCount+1
    }
    console.log(num)
    wx.cloud.database().collection('online_class_class').doc(this.data.class._id).update({
      data:{
        browseCount:num
      },
      success(res){
        console.log(res)
      }
    })
  },
  //更新下单量
  updateOrderCount(){
    var that = this;
    var num = 0;
    console.log(that.data.class.orderCount)
    if(!that.data.class.orderCount){
      num = 1
    }else{
      num = that.data.class.orderCount+1
    }
    console.log(num)
    wx.cloud.database().collection('online_class_class').doc(this.data.class._id).update({
      data:{
        orderCount:num
      },
      success(res){
        console.log(res)
      }
    })
  },
  getOrderRecord(classId){
    var that = this;

    wx.cloud.database().collection('online_class_order').where({
      classId:classId,
      _openid:app.globalData.userInfo._openid
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
  getTeacherInfo(teacherId){
    var that = this;
    wx.cloud.database().collection('online_class_teacher').doc(teacherId).get({
      success(res){
        console.log('讲师信息：',res)
        
        that.setData({
          teacher :res.data,
        })
       

      }
    })
  },
  toWatchVideo(e){
    // wx.navigateTo({
    //   url: '/pages/home/onlineclass/watchvideo/watchvideo?url=' + e.currentTarget.dataset.url 
    //   +'&id=' + this.data.class._id,
    // })
    // return


    
    if(e.currentTarget.dataset.free == 0){
      if(this.data.payed == false){

        wx.showToast({
          title: '请购买后学习',
          icon:'none'
        })
        
      }
      if(this.data.payed == true){
        wx.navigateTo({
          url: '/pages/index/classdetail/watchvideo/watchvideo?url=' + e.currentTarget.dataset.url 
          +'&id=' + this.data.class._id,
        })
      }
    }
    if(e.currentTarget.dataset.free == 1){
      wx.navigateTo({
        url: '/pages/index/classdetail/watchvideo/watchvideo?url=' + e.currentTarget.dataset.url 
        +'&id=' + this.data.class._id,
      })
    }
    
  },
  toDetail(){
    var index = 0;
    for(var i = 0;i<this.data.class.detail.length;i++){
      if(this.data.class.detail[i].video!=''&& 
      this.data.class.detail[i].video!=null &&
      this.data.class.detail[i].video!=undefined){
        index = i
      }
    }
    console.log(index)
    wx.navigateTo({
      url: '/pages/index/classdetail/watchvideo/watchvideo?url=' +this.data.class.detail[index].video
      +'&id=' + this.data.class._id,
    })
  },
  //退款
  refund(){
    wx.cloud.callFunction({
      name: 'refund',
      data: {
        refund: Date.now() + Math.floor(9*Math.random()) + '', //商户退款单号 自定义
        trade:'1620304462644' , //商户订单号  之前的下单号
        price: 1//钱  0.01*100
      },
      success: res => {
        console.log("获取退款参数成功", res)
      },
      fail: res => {
        console.log("获取退款参数失败", res)
      },
    })
  },
  buy(){
    if (!app.globalData.userInfo) {
      wx.showToast({
        icon:'none',
        title: '请登录',
      })
      
    }else{
      wx.showLoading({
        title: '支付中',
        mask:'true'
      })
      var that = this;
      
      //订单号
      var orderNum = Date.now() + Math.floor(9*Math.random()) + ''
      that.setData({
        orderNum:orderNum
      })

      //测试 虚拟支付
      that.addOrder()
      return

      //支付模块*******************************
      wx.cloud.callFunction({
        name: 'pay',
        data: {
          msg: that.data.class.name,
          outTradeNo: orderNum,
          //new Date().getTime() 或者 Date.now()
          //Date.now() + Math.floor(9*Math.random()) + ''
          //Number((that.data.class.price*100).toFixed(0))  这种安全些
          //Number(that.data.class.price)*100
          totalFee: Number((that.data.class.price*100).toFixed(0)) //order.pay*100      1
          //Math.floor(that.data.userInform[0].PayMoney*100)
        },
        success(res) {
          console.log('统一下单返回值',res);
          const payment = res.result.res.payment
          console.log('payment',payment)
          that.payOrder(payment)
        }
      })
      //************************************ 
    }
    
  },
  //支付
  payOrder(payment) {
    //第一种方式
    //const {timeStamp,nonceStr,signType,paySign} = payment
    var that = this;
    wx.requestPayment({
      //第一种方式
      // timeStamp,
      // nonceStr,
      // package:payment.package,
      // signType,
      // paySign,

      //第二种方式
      ...payment, //报错
      success (res) {
        console.log('支付成功', res)
        // wx.showToast({
        //   title: '支付成功',
        //   duration:4000
        // })
        //更新订单 变成已经支付
        that.addOrder();
      },
      fail (res) {
        console.log('支付失败', res)
        //跳转到等待买家付款界面
        wx.showToast({
          title: '支付失败',
          icon:'none'
        })
      },
      complete(res){
        console.log('pay complete', res)
      }
    })
  },
  addOrder(){
    var that = this;
    wx.cloud.database().collection('online_class_order').add({
      data: {

        buyNickname: app.globalData.userInfo.nickName,

        classId:that.data.class._id,
        className:that.data.class.name,
        classImage:that.data.class.images,

        teacherUserId:that.data.class.userId,
        teacherOpenid:that.data.class._openid,
        teacherId:that.data.class.teacherId,
  
        payMoney:that.data.class.price,
        orderNum:that.data.orderNum,
        time: util.formatTime(new Date()),
        
        
      },
      success(res){

        console.log(res)


        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '支付成功！',
            })
            that.getOrderRecord(that.data.class._id)
            //下单量+1
            that.updateOrderCount()
          },
        })
        
        
      }

    })
  },
  onShow(){
    
  },
  onShareAppMessage: function (res) {
    var that =this;
    if (res.from === 'menu') {
      return {
        title: that.data.class.name+' ~ 编程不打烊在线课堂',
        path: '/pages/index/classdetail/classdetail?id=' + that.data.class._id,
        imageUrl: that.data.class.images
      }
    }
    // 来自页面内转发按钮   
    if (res.from === 'button') {
      return {
        title: that.data.class.name+' ~ 编程不打烊在线课堂',
        path: '/pages/index/classdetail/classdetail?id=' + that.data.class._id,
        imageUrl: that.data.class.images
      }
    }

  },
  onShareTimeline(){
    var that = this;
    return {
      title: that.data.class.name+' ~ 编程不打烊在线课程',
      query: {
        id: that.data.class._id
      },
      imageUrl:that.data.class.images
    }
  },

})