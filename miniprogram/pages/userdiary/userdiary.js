// pages/userdiary/userdiary.js
const db = wx.cloud.database({
  env: "web-text-rr-01-urg98"
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 弹出开关
    show: false,
    // 日记目录数据
    rows: [],
    // 日记内容数据
    userDiary: {},
    // 分页查询数据
    pageStart: 0,
    pageCount: 10,
    // 总共的数据量
    userTotal: 0,
    // 加载开关
    btnswitch: "display: none",
    // 再次加载时调用的函数
    sfswitch: false
  },

  // 载入日记目录数据
  loadDiaryIndex: function () {
    // 设置分页查询参数
    var pageStart = this.data.pageStart
    var pageCount = this.data.pageCount
    var userTotal = this.data.userTotal
    console.log("userTotal",userTotal)
    var rowsLength = this.data.rows.length
    console.log("rowsLength", rowsLength)
    console.log(pageStart < 0 && userTotal > rowsLength)

    if (pageStart < 0 && userTotal > rowsLength){
      pageStart = 0
      pageCount = userTotal - rowsLength
    } else if (userTotal == rowsLength){
      wx.showToast({
        title: '没有更多数据了',
      })
      this.showbtn()
      return
    }
    // 调用数据
    db.collection('userdiary')
      .field({
        data: true,
        mydate: true,
        startTime: true,
        usertitle: true
      })
      .skip(pageStart)
      .limit(pageCount)
      .get()
      .then(res => {
          pageStart -= pageCount
          console.log("获取日记目录数据", res.data);
          var rows = this.data.rows.concat(res.data.reverse())
          this.setData({
            rows, 
            pageStart
          },()=>{
            // 判断日历的内容是否为空，如果为空载入内容
            if (Object.keys(this.data.userDiary).length == 0){
              this.loadDiary(this.data.rows[0]._id)
            }
          })
      }).catch(err => {
        console.log(err);
      })
  },

  // 载入日记数据
  loadDiary: function (e) {
    if (!e.target){
      var id = e
    }else{
      var id = e.target.dataset.id
    }
    if (id) {
    wx.showLoading({
      title: '正在加载中',
    })
    db.collection("userdiary")
      .doc(`${id}`)
      .get()
      .then(res => {
      console.log("获取日记文本数据",res.data)
        this.setData({
          userDiary: res.data
        })
        wx.hideLoading();
        this.onClose()
      }).catch(err => {
        console.log(err)
      })
    }
  },

  // 弹出框
  showPopup() {
    this.setData({ 
      show: true,
    },()=>{
      this.showbtn()
    });
  },

  onClose() {
    this.setData({ 
      show: false, 
      btnswitch: "display: none"
    });
  },

  // 显示按钮
  showbtn: function () {
    var userTotal = this.data.userTotal
    var rowsLength = this.data.rows.length
    var show = this.data.show
    if (userTotal == rowsLength || show == false) {
      this.setData({
        btnswitch: "display: none"
      });
    } else if (userTotal > rowsLength && show == true){
      this.setData({
        btnswitch: "display: block"
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.setData({
      show: false,
      // 日记目录数据
      rows: [],
      // 日记内容数据
      userDiary: {},
      // 分页查询数据
      pageStart: 0,
      pageCount: 10,
      // 总共的数据量
      userTotal: 0,
      // 加载开关
      btnswitch: "display: none",
    },()=>{
      db.collection('userdiary')
        .count()
        .then(res => {
          console.log(res.total)
          var pageStart = res.total - this.data.pageCount
          this.setData({
            userTotal: res.total,
            pageStart
          }, () => {
            this.loadDiaryIndex()
          })
        })
    })
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