// pages/basics/delete/delete.js
const app = getApp();
//调用方法组
var query = require('../../../utils/query.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		reasonIndex: null,
		pickerIndex: null,
		reason: ['离职', '责任人调整'],
		picker: ['办公室', '收入核算股', '征收管理股', '税源管理股', '党建工作股', '纪检组', '纳税服务股', '税政股', '劳务外聘', '物业公司'],

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log('onLoad')
		var that = this;
		wx.request({
      url: app.globalData.BaseURL+ 'property/' + app.globalData.user.userID, //真实的接口地址
			data: {},
			header: {
				'content-type': 'application/json'
			},
			success: function (res) {
				if (res.data == 'No Session') {
					wx.navigateTo({
						url: '/pages/welcome/home/home',
					})
				}
				else {
					console.log(res)
					for (var i of res.data) {
						i.propertyImages = i.propertyImages.split(',')
					};
					that.setData({
						Property: res.data //设置数据
					})
				}
			},
			fail: function (err) {
				console.log(err)
			}
		})
	},

	showModal(e) {
		console.log(e.target.dataset.target);
		this.setData({
			modalType: '资产划拨申请',
			modalData: e.target.dataset.target
		})
	},
	hideModal(e) {
		this.setData({
			modalType: null,
			modalData: null
		})
	},
	scrapProperty(e){
		//判断用户
		if (app.globalData.user.userID=='admin'){
			wx.showModal({
				title: '提醒',
				content: '确定要报废该资产吗？',
				cancelText: '取消',
				confirmText: '确定',
				success: res => {
					if (res.confirm) {
						wx.request({
							method: 'POST',
              url: app.globalData.BaseURL+ 'propertyScrap',
							data: { propertyID: e.target.dataset.target.propertyID },
							header: { 'content-type': 'application/json' },
							success: function (res) {
								if (res.statusCode == 200) {
                  wx.showToast({
                    title: res.data.result,
                    icon: 'success',
                    duration: 2000
                  })
                  query.MessageSubmit('admin', 'admin','固定资产'+ e.target.dataset.target.propertyID + '完成报废', '日志');
								}
								else {
									wx.showToast({
										title: '操作失败，请联系管理员',
										icon: 'none',
										duration: 2000
									})
								}
							}
						})
					}
				}
			})

		}else{
			wx.showToast({
				title: '您并非管理员!',
				icon:'none'
			},1000)
		}
	},


	GetUserID(e) {
		console.log(e.detail.value)
		//获取数据并将数据存入userID中
		var that = this;
		wx.request({
			method: 'POST',
			url: app.globalData.BaseURL+ 'getUserID', //接口地址
			data: {
				userName: e.detail.value
			},
			header: { 'content-type': 'application/json' },
			success: function (res) {
				console.log(res);
				if (res.statusCode == 200) {
					that.setData({
						userID: res.data
					})
				}
				else {
					wx.showToast({
						title: '查无此人，请确认使用人名字无误！',
						icon: 'none',
						duration: 2000
					})
				}
			}
		})
	},

	submitModal(e) {
		//为部门重新赋值
		console.log(e.detail.value)
		e.detail.value.receiveDep = this.data.picker[e.detail.value.receiveDep];
		e.detail.value.applyReason = this.data.reason[e.detail.value.applyReason];
		var modalData = e.detail.value;
		//console.log(modalData)
		//将信息处理为信息流，发送给后端
		wx.request({
			method: 'POST',
      url: app.globalData.BaseURL + 'messageSubmit', //接口地址
			data: {
				messageFrom: modalData.applyUserID,
				messageTo: 'admin',
				messageContext: JSON.stringify(modalData),
				messageType: '划拨申请',
        messageSource:'propertyID'
			},
			header: { 'content-type': 'application/json' },
			success: function (res) {
				//console.log(res);
				if (res.statusCode == 200) {
					wx.showToast({
						title: res.data.code,
						icon: 'success',
						duration: 2000
					})
				}
				else {
					wx.showToast({
						title: '失败，请注意输入格式！',
						icon: 'none',
						duration: 2000
					})
				}
			},
			fail: function (res) {
				console.log('Error' + ':' + res)
			}
		})
		this.setData({
			modalType: null,
			modalName: null
		})
	},

	// ListTouch触摸开始
	ListTouchStart(e) {
		this.setData({
			ListTouchStart: e.touches[0].pageX
		})
	},

	// ListTouch计算方向
	ListTouchMove(e) {
		this.setData({
			ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
		})
	},

	// ListTouch计算滚动
	ListTouchEnd(e) {
		if (this.data.ListTouchDirection == 'left') {
			this.setData({
				modalName: e.currentTarget.dataset.target
			})
		} else {
			this.setData({
				modalName: null
			})
		}
		this.setData({
			ListTouchDirection: null
		})
	},
	PickerChange(e) {
		console.log(e);
		this.setData({
			pickerIndex: e.detail.value
		})
	},
	ReasonChange(e) {
		console.log(e);
		this.setData({
			reasonIndex: e.detail.value
		})
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})