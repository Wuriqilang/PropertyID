const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    index: null,
    picker: ['办公室', '收入核算股', '征收管理股', '税源管理股', '党建工作股', '纪检组', '纳税服务股', '税政股', '劳务外聘', '物业公司'],
    date: '2019-01-01',
    date2: '2020-01-01',
    imgList: [],
    modalName: null,
    textareaAValue: '',
    textareaBValue: '',
    porperty: '',
    img: []
  },
  onLoad() {
    console.log('onLoad')

  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  DateChangeScrap(e) {
    this.setData({
      date2: e.detail.value
    })
  },
  GetUserID(e) {
    console.log(e.detail.value)
    //获取数据并将数据存入userID中
    var that = this;
    wx.request({
      method: 'POST',
      url: app.globalData.BaseURL + 'getUserID', //接口地址
      data: {
        userName: e.detail.value
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res);
        if (res.statusCode == 200) {
          that.setData({
            userID: res.data
          })
        } else {
          wx.showToast({
            title: '查无此人，请确认使用人名字无误！',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '删除',
      content: '确定要删除该图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  formBindSubmit(e) {
    console.log(e.detail.value);
    //为部门重新赋值
    e.detail.value.propertyDep = this.data.picker[e.detail.value.propertyDep];
    //为资产重新定义编号
    e.detail.value.propertyID = e.detail.value.propertyID + 'GS' + Date.now();
    //将图片进行上传
    this.upload();
    var that = this;
    setTimeout(function() {
      e.detail.value.imgPath = that.data.img;
      console.log(e.detail.value);
      wx.request({
        method: 'POST',
        url: app.globalData.BaseURL + 'propertySubmit', //接口地址
        data: e.detail.value,
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          console.log(res);
          if (res.statusCode == 200) {
            wx.showToast({
              title: res.data.code+'请继续录入',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              userName:'',
              userID:'',
              textareaAValue:''
            })
          } else {
            wx.showToast({
              title: '失败，请注意输入格式！',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function(res) {
          console.log('Error' + ':' + res)
        }
      })
    }, 1000);
  },

  upload: function() {
    var that = this;
    //return new Promise(function(reslove, reject){
    for (var i = 0; i < that.data.imgList.length; i++) {
      wx.uploadFile({
        url: app.globalData.BaseURL + 'imgUpload',
        filePath: that.data.imgList[i],
        name: 'picture',
        success: function(res) {
          var imgData = JSON.parse(res.data)
          if (that.data.img.length != 0) {
            that.setData({
              img: that.data.img.concat("," + app.globalData.BaseURL + imgData.imgPath)
            })
            //reslove('ok');
          } else {
            that.setData({
              img: app.globalData.BaseURL.substr(0, app.globalData.BaseURL.length - 1) + imgData.imgPath
            })
          }
        }
      })
    }
  }
})