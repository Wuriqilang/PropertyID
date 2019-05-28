Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    iconList: [{
      icon: 'list',
      color: 'white',
      badge: 120,
      name: '进行中'
    }, {
      icon: 'check',
        color: 'white',
      badge: 1,
      name: '已完成'
    }, {
      icon: 'notice',
        color: 'white',
      badge: 0,
      name: '提醒'
    }, {
      icon: 'comment',
        color: 'white',
      badge: 22,
      name: '通知'
    },],
    elements: [
      { title: '新增资产', name: 'add', color: 'cyan', icon: 'newsfill' },
      { title: '资产列表', name: 'list', color: 'blue', icon: 'searchlist' },
      { title: '资产报表', name: 'form', color: 'red', icon: 'formfill' },
      { title: '资产调整', name: 'change', color: 'olive', icon: 'album' },
    ], elements2: [
      { title: '用户管理', name: 'people', color: 'green', icon: 'people' },
      { title: '发布公告', name: 'notice', color: 'orange', icon: 'notice' },
    ],
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: '/images/swiper/1.jpg'
    }, {
      id: 1,
      type: 'image',
        url: '/images/swiper/2.jpg',
    }, {
      id: 2,
      type: 'image',
				url: '/images/swiper/4.jpg'
    }],
  },
  methods: {
    onLoad() {
      let that = this;
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (!res.authSetting['scope.userInfo']) {
            wx.redirectTo({
              url: '/pages/auth/auth'
            })
          }
        }
      })
    },
		// cardSwiper
		cardSwiper(e) {
			this.setData({
				cardCur: e.detail.current
			})
		},
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
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