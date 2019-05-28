const app = getApp();
//调用方法组
var query = require('../../../utils/query.js');
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    index: null,
    picker: ['所有人', '管理员',],
    textareaAValue: '',
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
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  formBindSubmit(e) {
    console.log(e.detail.value);
    //为部门重新赋值
    e.detail.value.messageTo = this.data.picker[e.detail.value.messageTo];
    var messageTo='admin';
    if (e.detail.value.messageTo=='所有人'){
      messageTo='all';
    }
    var that = this;
    setTimeout(function () {
      query.MessageSubmit('admin', messageTo,e.detail.value.messageContext,'通知')
    }, 1000);
    wx.showToast({
      title: '公告发布成功!',
    },2000)
  },
})