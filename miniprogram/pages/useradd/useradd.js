// pages/useradd/useradd.js
const db = wx.cloud.database({
  env: "web-text-rr-01-urg98"
});
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 页面长宽
    windowHeight: 0,
    screenHeight: 0,
    mydate: "",
    startTime:"",
    usertitle:"你好！今天！",
    userinput: "",
    maxlength: 1000,
    inputlength: 0
  },

  // 文本框相关
  changetitle: function(e){
    // console.log(e);
    this.setData({
      usertitle: e.detail.value,
    })
  },
  changeinput: function(e){
    // console.log(e);
    this.setData({
      userinput: e.detail.value,
      inputlength: e.detail.value.replace(/(^\s*)|(\s*$)/g,"").length
    })
  },

  // 日记开始的时间
  getStartTime: function(){
    var nowTime = new Date();
    var startTime = nowTime.getHours()+":"+nowTime.getMinutes();
    console.log(startTime);
    this.setData({
      startTime
    })
  },

  // 添加数据库
  adduserinfo: function(){
    if (this.data.inputlength == 0) {
      wx.showToast({
        title: '请请输入内容',
      })
      return
    }
    wx.showLoading({
      title: '正在保存',
    })
    // 准备数据
    var mydate = this.data.mydate
    var startTime = this.data.startTime
    var userinput = this.data.userinput
    var usertitle = this.data.usertitle
    // 添加数据库
    db.collection("userdiary").add({
      data: {
        mydate,
        startTime,
        userinput,
        usertitle
      }
    }).then(res=>{
      console.log(res)
      wx.hideLoading();
      wx.showToast({ title: "保存成功" })
    }).catch(err=>{
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var mydate = options.mydate;
    this.setData({
      windowHeight: app.globalData.windowHeight,
      screenHeight: app.globalData.screenHeight,
      mydate
    })
    this.getStartTime()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})