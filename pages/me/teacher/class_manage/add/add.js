
var util = require("../../../../../utils/util.js")
const app =getApp()
Page({

  data: {
    cloudImgList:[],
    teacher:null,
    class:null,
    isEditClass:false
  }, 

  onLoad: function (options) {
    
    this.getType()

    var that = this 
    //查询老师信息
    wx.cloud.database().collection('online_class_teacher').where({
      _openid:app.globalData.userInfo._openid
    }).get({
      success(res){
        console.log(res)
        if(res.data.length !=0 ){
          that.setData({
            teacher :res.data[0],
          })
          
        }
      }

    })

    if(options.id!=null){
      //查询课程信息
      wx.cloud.database().collection('online_class_class').doc(options.id).get({
        success(res){
          console.log(res)
          that.data.cloudImgList.push(res.data.images)
            that.setData({
              class :res.data,
              cloudImgList:that.data.cloudImgList,
              isEditClass:true
            })
        }

      })
    }
    
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
        title: '请输入课程名称',
        icon:'none'
      })
      return
    }
    if(e.detail.value.price == ''){
      wx.showToast({
        title: '请输入收费金额',
        icon:'none'
      })
      return
    }
    // if(e.detail.value.price == 0){
    //   wx.showToast({
    //     title: '金额不可为0',
    //     icon:'none'
    //   })
    //   return
    // }
    if(this.data.cloudImgList.length == 0){
      wx.showToast({
        title: '请选择封面图片',
        icon:'none'
      })
      return
    }
    if(!this.data.typeName||!this.data.fieldName){
      wx.showToast({
        title: '请选择分类',
        icon:'none'
      })
      return
    }
    
    wx.showLoading({
      title: '提交中',
      mask:'true'
    })
    //没有申请过
    if(that.data.class==null){
      wx.cloud.database().collection('online_class_class').add({
        data: {

          teacherId: that.data.teacher._id,

          name: e.detail.value.name,
          tag: e.detail.value.tag,
          price: e.detail.value.price,
          introduce: e.detail.value.introduce,
          images: this.data.cloudImgList[0],
          detail:[],
          
          typeName:this.data.typeName,
          fieldName:this.data.fieldName,

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
      wx.cloud.database().collection('online_class_class').doc(that.data.class._id).update({
        data: {
          
          name: e.detail.value.name,
          tag: e.detail.value.tag,
          //price: e.detail.value.price,
          introduce: e.detail.value.introduce,
          images: this.data.cloudImgList[0],
          
          typeName:this.data.typeName,
          fieldName:this.data.fieldName,
          
          // time: util.formatTime(new Date()),
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
  chooseType(e){
    console.log(e.currentTarget.dataset.index)
    this.setData({
      currentIndex:e.currentTarget.dataset.index,
      currentFieldIndex:null,
      typeName:this.data.typeList[e.currentTarget.dataset.index].type,
      fieldName:null
    })
    this.setData({
      fieldList:this.data.typeList[e.currentTarget.dataset.index].field,
    })


  },
  chooseField(e){
    console.log(e.currentTarget.dataset.index)
    this.setData({
      currentFieldIndex:e.currentTarget.dataset.index,
      fieldName:this.data.typeList[this.data.currentIndex].field[e.currentTarget.dataset.index]
    })
  }

})