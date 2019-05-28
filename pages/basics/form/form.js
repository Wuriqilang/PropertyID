var wxCharts = require('../../../utils/charts.js');
var app = getApp();
var lineChart = null;
var depChart = null;
var sumChart = null;

Page({
	data: {
	},
	touchHandler: function (e) {
		// console.log(lineChart.getCurrentDataIndex(e));
		// lineChart.showToolTip(e, {
		// 	// background: '#7cb5ec',
		// 	format: function (item, category) {
		// 		return category + ' ' + item.name + ':' + item.data
		// 	}
		// });
	},
	//生成资产购买数据
	createSimulationData: function () {
		var categories = [];
		var data = [];
		for (var i = 0; i < 12; i++) {
			categories.push('2018-' + (i + 1));
			data.push(Math.random() * (20 - 10) + 10);
		}
		return {
			categories: categories,
			data: data
		}
	},
	//生成部门使用数据
	createDepData: function () {
		var categories = ['办公室', '收入核算股', '征收管理股', '税源管理股', '党建工作股', '纪检组', '纳税服务股', '税政股', '劳务外聘', '物业公司'];
		var data = [];
		for (var i = 0; i < categories.length; i++) {
			data.push(Math.random() *10);
		}
		return {
			categories: categories,
			data: data
		}
	},
	onLoad: function (e) {
		var windowWidth = 320;
		try {
			var res = wx.getSystemInfoSync();
			windowWidth = res.windowWidth;
		} catch (e) {
			console.error('getSystemInfoSync failed!');
		}

		var simulationData = this.createSimulationData();
		lineChart = new wxCharts({
			canvasId: 'lineCanvas',
			type: 'line',
			categories: simulationData.categories,
			animation: true,
			series: [{
				name: '资产买入统计',
				data: simulationData.data,
				format: function (val, name) {
					return val.toFixed(0);
				}
			},],
			xAxis: {
				disableGrid: true
			},
			yAxis: {
				title: '购入数量',
				min: 0
			},
			width: windowWidth+12,
			height: 200,
			dataLabel: true,
			dataPointShape: true,
			extra: {
				lineStyle: 'curve'
			}
		});

		var depData=this.createDepData();
		depChart = new wxCharts({
			canvasId: 'lineCanvas2',
			type: 'column',
			categories: depData.categories,
			animation: true,
			series: [{
				name: '部门资产统计',
				data: depData.data,
				format: function (val, name) {
					return val.toFixed(0);
				}
			},],
			xAxis: {
				disableGrid: true
			},
			yAxis: {
				title: '购入数量',
				format: function (val) {
					return val.toFixed(0);
				},
				min: 0
			},
			width: windowWidth + 12,
			height: 200,
			dataLabel: true,
			dataPointShape: true,
			extra: {
				lineStyle: 'curve'
			}
		});

		sumChart = new wxCharts({
			canvasId: 'lineCanvas3',
			type: 'pie',
			animation: true,
			series: [{
				name: '使用中',
				data: 360,
			}, {
					name: '已报废',
					data: 120,
				}],
			width: windowWidth + 12,
			height: 200,
			dataLabel: true,
		});
	}
});