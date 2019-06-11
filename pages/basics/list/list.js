//引用二维码生成器
var QR = require("../../..//utils/qrcode.js");

const app = getApp();
Page({
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		qrImage:'',
		qr_h:330,
    Property:[]
	},
	onLoad() {
		console.log('onLoad')
		var that = this
		wx.request({
      url: app.globalData.BaseURL+'property/' + app.globalData.user.userID, //真实的接口地址
			data: {},
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
			success: function (res) {
        console.log(res);
				if (res.data =='No Session'){
					wx.navigateTo({
						url: '/pages/welcome/home/home',
					})
				}
				else{
        //console.log(res.data)
        for (var i of res.data) {
          i.propertyImages=i.propertyImages.split(',')
        };
				that.setData({
					Property: res.data //设置数据
				})
			}},
			fail: function (err) {
				console.log(err)
			}
		})
	},
	isCard(e) {
		this.setData({
			isCard: e.detail.value
		})
	},
	showModal(e) {
		//获取点击相关信息
    console.log(e);
		//生产所需信息
    var qrData = e.target.dataset.target;
    var qrString = '资产ID:' + qrData.propertyID + '\n' + '使用部门:' + qrData.propertyDep + '\n' + '负责人:' + qrData.propertyUser + '\n' + '购买时间:' + qrData.propertyBuyDate + '\n' + '报废时间:' + qrData.propertyScrapDate ;
		wx.showToast({
			title: '生成中...',
			icon: 'loading', 
			duration: 2000
		});
		var that = this;
		var st = setTimeout(function () {
			wx.hideToast()
			var size = that.setCanvasSize();
			//绘制二维码
      that.createQrCode(qrString, "mycanvas", size.w, size.h);
			clearTimeout(st);
		}, 2000)
		this.setData({
			modalName: 'Image',
      canvasLeft: '0'
			//qr_h: that.setCanvasSize().height
		})
	},
	hideModal(e) {
		this.setData({
			modalName: null,
      canvasLeft:'10000'
		})
	},
	//适配不同屏幕大小的canvas
	setCanvasSize: function () {
		var size = {};
		try {
			var res = wx.getSystemInfoSync();
			var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽
			var width = res.windowWidth / scale;
			var height = width;//canvas画布为正方形
			size.w = width;
			size.h = height;
		} catch (e) {
			// Do something when catch error
			console.log("获取设备信息失败" + e);
		}
		return size;
	},
	createQrCode: function (url, canvasId, cavW, cavH) {
		//调用插件中的draw方法，绘制二维码图片
		QR.api.draw(url, canvasId, cavW, cavH);
		setTimeout(() => { this.canvasToTempImage(); }, 1000);

	},
	//获取临时缓存照片路径，存入data中
	canvasToTempImage: function () {
		var that = this;
		wx.canvasToTempFilePath({
			canvasId: 'mycanvas',
			success: function (res) {
				var tempFilePath = res.tempFilePath;
				console.log(tempFilePath);
				that.setData({
					qrImage: tempFilePath,
					// canvasHidden:true
				});
			},
			fail: function (res) {
				console.log(res);
			}
		});
	},
	//点击图片进行预览，长按保存分享图片
	previewImg: function (e) {
		var img = this.data.qrImage;
		console.log(img);
		wx.previewImage({
			current: img, // 当前显示图片的http链接
			urls: [img] // 需要预览的图片http链接列表
		})
	},
  searchProperty(e) {
    let key = e.detail.value.toLowerCase();
    let list = this.data.Property;
    for (let i = 0; i < list.length; i++) {
      let a = key;
      let searchID = list[i].propertyID.toLowerCase();
      let searchName = list[i].propertyUser.toLowerCase();
      let searchDep = list[i].propertyDep.toLowerCase();
      if (searchID.search(a) != -1 || searchName.search(a) != -1 || searchDep.search(a) != -1) {
        list[i].isShow = true
      } else {
        list[i].isShow = false
      }
    }
    this.setData({
      Property: list
    })
  }
});