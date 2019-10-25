// pages/index/index.js
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
    // 当天的日期
    today: "",
    // 日历数组
    day: [],
    // 年份
    year: 2019,
    // 月份
    month: 10,
    // 星期
    weekday: ["日","一", "二", "三", "四", "五", "六"],
    // 选中的日期 默认为当天 用户选择后修改
    theday: "2019-10-18",
    usertheday: "",
    // 普通年天数
    monthday: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    // 用户所选日期
    userchecked: "",
    // 日期样式
    checked_view: "checkedcolor",
    today_view: "background-color: #f4598d;color: #fff;",
    // 今日按钮
    todaybtn: "",

    // 弹出框组件
    show: false,

    // 组件时间选择
    currentDate: new Date().getTime(),
    minDate: -2177481600000,
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },

    // 轮播图数据
    carousel: []
  },
  // -------------------------------------数据底部

  // -------------------------------------函数部分

  // 载入轮播图
  loadCarousel: function(){
    wx.showLoading({
      title: '正在加载中',
    })
    db.collection("mycalendar")
    .get()
    .then(res => {
      console.log("获取轮播图数据", res.data[0].mycarousel);
      this.setData({
        carousel: res.data[0].mycarousel
      })
      wx.hideLoading();
    }).catch(err => {
      console.log(err);
    })
  },

  // 跳转备注添加页
  jumpRemark: function () {
    var today = this.data.today;
    wx.navigateTo({
      url: `/pages/useradd/useradd?mydate=${today}`,
    })
    // wx.redirectTo({
    //   url: `/pages/userRemark/userRemark`,
    // })
  },

  // 标题栏按钮显示开关
  btnchange: function(e){
    if (e.target.dataset.action == "today") {
      var  theday = this.data.today;
      this.loadCalendar(theday)
    } else if (e.target.dataset.action == "add"){
      this.jumpRemark()
      console.log(123)
    }
  },

  //通过时间组件修改时间
  confirm(val) {
    // this.change()
    console.log("组件确认输出日期的毫秒数"+val.detail)
    var datetime = new Date(val.detail);
    var mytime = datetime.getFullYear() + '-' + (datetime.getMonth() + 1) + '-' + datetime.getDate()
    console.log("组件确认输出日期", mytime);
    this.loadCalendar(mytime)
    this.onClose()
    this.onInput(val)
  },
  cancel() {
    this.onClose()
  },

  //  给时间组件赋值
  onInput(event) {
    this.setData({
      currentDate: event.detail
    });
  },

  // 弹出框组件
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },



  // 选中当天
  checkedDay: function (e) {
    if (e.target.dataset.day){
      console.log("这天是",e.target.dataset.day,"号");
      var theday = `${this.data.year}-${this.data.month}-${e.target.dataset.day}`;
      var usertheday = `${this.data.year}年${this.data.month}月${e.target.dataset.day}日`;
      console.log("这天是"+theday)
      this.setData({
        usertheday
      })
      this.changecolor(theday)
    }
  },

  // 修改颜色
  changecolor: function (theday){
    if (theday){
      if (theday == this.data.today) {
        this.setData({
          theday,
          today_view: "background-color: #f4598d;color: #fff"
        });
      } else {
        this.setData({
          theday,
          today_view: ""
        });
      }
    }
  },

  // 切换月份
  switchMonth: function (e) {
    if (e.target.dataset.action){
      // e.currentTarget可以获取当前元素的自定义属性，e.target可以获取当前子元素的自定义属性
      // console.log("我动了", e.currentTarget)
      console.log("我动了", e.target)
      var myaction = e.target.dataset.action;
      // 用户选择的日期
      var userdate = {
        year:this.data.year,
        month:this.data.month,
        day: ""
        }
      // 判断月份增减
      if(myaction == "prev"){
        userdate.month--;
      } else if (myaction == "next"){
        userdate.month++;
      }
      // 判断年份增减
      if (userdate.month > 12){
        userdate.month = 1;
        userdate.year++;
      } else if (userdate.month < 1){
        userdate.month = 12;
        userdate.year--;
      }
      var day = this.data.theday.split("-")
      var datestr = `${userdate.year}-${userdate.month}-${day[2]}`
      this.loadCalendar(datestr)
    }
  },

  // 日历数据的获取
  loadCalendar: function (date) {
    // 接收数据，初步切割
    var datetime = new Date();
    var mytime = datetime.getFullYear() + '-' + (datetime.getMonth() + 1) + '-' + datetime.getDate()
    console.log("输出当前日期",mytime);

    date = date || mytime;
    var theday = date;
    console.log("输出需要处理的日期",date);
    date = date.split("-")
    console.log("输出分割后的日期",date);
    // date[0]为年份 date[1]为月份 | date[2]为日期

    // 判断该月是否为闰年2月
    if (date[1] == 2 && ((date[0] % 4 == 0 && date[0] % 100 != 0) || date[0] % 400 == 0)){
        var toMonth = 29;
    }else{
      var toMonth = this.data.monthday[date[1] - 1];
    }
    console.log("输出该月天数 "+toMonth)

    // 判断该月1号周几
    var startday = `${date[0]}-${date[1]}-1`
    console.log("输出该月1号日期 "+startday)
    startday = new Date(startday).getDay()
    console.log("输出该月1号日期 "+"星期"+startday)

    // 补全日历数组
    for (var i = 0, todealDay = []; i < toMonth; i++){
      todealDay[i] = i + 1;
    }
    console.log("日历未修改数组"+todealDay);
    // 在数组开头添加无效日期
    if (startday != 0){
      for (var i = 0; i < startday; i++) {
        todealDay.unshift("")
      }
    }

    console.log("todealDay.length " + todealDay.length);
    // 日历的行数
    var lines = Math.floor(todealDay.length / 7);
    console.log("日历的行数"+lines);
    console.log("日历最后一行余数" + (todealDay.length % 7));
    if (todealDay.length % 7 > 0) {
      lines++;
    }
    console.log("日历的行数"+lines);

    // 在数组结尾添加无效日期
    var endday = lines * 7 - todealDay.length + 1
    if (endday != 0) {
      for (var i = 0; i < endday; i++) {
        todealDay.push("")
      }
    }
    var dealDay = [];
    for (var i = 0; i < lines; i++) {
      var temp = 7;
      dealDay[i] = todealDay.slice(i * temp, (i+1) * temp)
    }
    console.log("输出日历数组第一行 " + dealDay + "该数据的类型为" + typeof (dealDay[0]))

    // 日期显示过滤
    var usertheday = `${date[0]}年${date[1]}月${date[2]}日`;

    // 将数据赋值
    this.setData({
      year: date[0],
      month: date[1],
      day: dealDay,
      today: mytime,
      usertheday,
      theday
    },() => {
      this.changecolor(this.data.theday)
    })
  },
  // ---------------------------------自定义函数结束

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowHeight: app.globalData.windowHeight,
      screenHeight: app.globalData.screenHeight
    })
    this.loadCalendar()
    this.loadCarousel()
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