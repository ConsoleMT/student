
var util = require("../../../../utils/util.js")
const app =getApp()
Page({

  data: {
    cloudImgList:[],
    teacher:null
  },

  onLoad: function (options) {
    
    var that = this 
    wx.cloud.database().collection('online_class_teacher').where({
      _openid:app.globalData.userInfo._openid
    }).get({
      success(res){
        console.log(res)
        if(res.data.length !=0 ){
          that.data.cloudImgList[0] = res.data[0].image
          that.setData({
            teacher :res.data[0],
            cloudImgList:that.data.cloudImgList
          })
          
        }

      }
    })
  },
 


  chooseImage(){
    var that = this;
    wx.chooseImage({
      count: 1 - that.data.cloudImgList.length,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success(res){

        console.log(res)
        console.log(res.tempFilePaths)
        //上传图片
        that.data.tempImgList = res.tempFilePaths
        that.uploadImages()
      }
    })

  },
  uploadImages(){
    var that = this;
    for(var i = 0 ; i< this.data.tempImgList.length; i++){
      wx.cloud.uploadFile({
        cloudPath:`teachers/${Math.random()}_${Date.now()}.${this.data.tempImgList[i].match(/\.(\w+)$/)[1]}`,
        filePath: this.data.tempImgList[i],
        success(res){
          console.log(res.fileID)
          that.data.cloudImgList.push(res.fileID)
          that.setData({
            cloudImgList:that.data.cloudImgList
          })
        }
      })
    }

  },
  deleteImg(e){
    console.log(e.currentTarget.dataset.index)
    this.data.cloudImgList.splice(e.currentTarget.dataset.index,1)
    this.setData({
      cloudImgList: this.data.cloudImgList
    })
  },

  submitData(e){
    var that = this;
    console.log(e)
    if(e.detail.value.name == ''){
      wx.showToast({
        title: '请输入姓名',
        icon:'none'
      })
      return
    }
    if(e.detail.value.phone == ''){
      wx.showToast({
        title: '请输入电话',
        icon:'none'
      })
      return
    }
    if(this.data.cloudImgList.length == 0){
      wx.showToast({
        title: '请选择图片',
        icon:'none'
      })
      return
    }
    
    wx.showLoading({
      title: '发布中',
      mask:'true'
    })
    //没有申请过
    if(that.data.teacher==null){
      wx.cloud.database().collection('online_class_teacher').add({
        data: {
          name: e.detail.value.name,
          phone: e.detail.value.phone,
          introduce: e.detail.value.introduce,
          image: this.data.cloudImgList[0],
          time: util.formatTime(new Date()),
          ispass:0
        },
        success(res){
  
          console.log(res)
          wx.hideLoading({
            success: (res) => {},
          })
          wx.navigateBack({
            delta: 0,
            success(res){
              wx.showToast({
                title: '提交成功！',
              })
            }
          })
          
        }
  
      })
    }else{//申请过
      wx.cloud.database().collection('online_class_teacher').doc(that.data.teacher._id).update({
        data: {
          name: e.detail.value.name,
          phone: e.detail.value.phone,
          introduce: e.detail.value.introduce,
          image: this.data.cloudImgList[0],
          
          time: util.formatTime(new Date()),
          //ispass:0
        },
        success(res){
  
          console.log(res)
          wx.hideLoading({
            success: (res) => {},
          })
          wx.navigateBack({
            delta: 0,
            success(res){
              wx.showToast({
                title: '提交成功！',
              })
            }
          })
  
        }
  
      })
    }
    
  }

})