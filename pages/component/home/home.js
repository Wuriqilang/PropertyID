//获取应用实例
const app = getApp();
//调用方法组
var query = require('../../../utils/query.js');

Component({
  options: {
    addGlobalClass: true,
  },
  data: {

  },
  //组件创建时，获取数据
  created(){
    let that = this;
    // 获取消息信息
    wx.request({
      url: app.globalData.BaseURL+'message/' + app.globalData.user.userID, //真实的接口地址
			//url: 'http://localhost:3000/message/admin' , //真实的接口地址
      data: {},
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        //console.log(res);
        if (res.data == 'No Session') {
          wx.navigateTo({
            url: '/pages/welcome/home/home',
          })
        }
        else {
         console.log(res.data);
					var messageData = res.data;
					for (var i = 0; i < messageData.length; i++) {
						if (messageData[i].messageType == "划拨申请") {
							//将内容数据转换为对象
							messageData[i].messageContext = JSON.parse(messageData[i].messageContext);
					 	}
					}
					that.setData({
						Message: res.data //设置数据
					})
					//数据基本处理，首先将信息根据时间排序

        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  methods: {
		Pass(e){
			//获取审批数据
			console.log(e.target.dataset.target.messageContext);
			//根据审批数据进行资产划拨
			var that = this;
			wx.request({
				method: 'POST',
        url: app.globalData.BaseURL+'propertyChange',
				//url: app.globalData.BaseURL +'propertyChange',
				data: e.target.dataset.target.messageContext,
				header: { 'content-type': 'application/json' },
				success: function (res) {
					if (res.statusCode == 200) {
						wx.showToast({
							title: res.data.result,
							icon: 'success',
							duration: 2000
						})
						//成功后生成新的信息，并将申请信息删除
						query.DeleteMessage(e.target.dataset.target.id);
						//生成新的信息：包括三个参数，发送人，接收人，信息内容。三条数据：删除成功，划拨成功，处理完成
						query.MessageSubmit('admin', 'admin', e.target.dataset.target.messageContext.applyPropertyID+'完成划拨审批','日志');
						query.MessageSubmit('admin', e.target.dataset.target.messageContext.applyUserID, '您提交的'+e.target.dataset.target.messageContext.applyPropertyID + '已经完成划拨审批,请知悉', '消息');
						query.MessageSubmit('admin','固定资产'+ e.target.dataset.target.messageContext.receiveUserID, e.target.dataset.target.messageContext.applyPropertyID+'划拨由您负责，请知悉' , '消息');
            //created();
					}
					else {
						wx.showToast({
							title: '资产转移失败，请联系管理员！',
							icon: 'none',
							duration: 2000
						})
					}
				}
			})
		},
    onShareAppMessage() {
      return {
        title: 'ColorUI-高颜值的小程序UI组件库',
        imageUrl: 'https://image.weilanwl.com/color2.0/share2215.jpg',
        path: '/pages/basics/home/home'
      }
    },
  },
})
