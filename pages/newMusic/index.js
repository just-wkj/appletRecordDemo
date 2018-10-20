// pages/newMusic/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        max_time:10000,//录音时长最大值 10s 默认十分钟
        src: '', //录音文件
        time: 0,//录音时长
        startTime: 0,//录音开始时间
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        this.recorderManager = wx.getRecorderManager();
        this.recorderManager.onError(function () {
            that.tip("录音失败！")
        });
        this.recorderManager.onStop(function (res) {
            console.log(res.tempFilePath)
            that.setData({
                src: res.tempFilePath,
            })
        });

        this.innerAudioContext = wx.createInnerAudioContext();
        this.innerAudioContext.onError((res) => {
            that.tip("播放录音失败！")
        })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            startTime: 0,
        })
    },


    /**
     * 提示
     */
    tip: function (msg) {
        wx.showModal({
            title: '提示',
            content: msg,
            showCancel: false
        })
    },

    /**
     * 录制aac音频
     */
    startRecordAac: function () {
        this.recorderManager.start({
            format: 'aac'
        });
    },

    /**
     * 录制mp3音频
     */
    startRecordMp3: function () {
        console.log('开始录音')
        this.setData({
            src: '',
            time:0,
            startTime: this.getCurTime()
        })
        this.recorderManager.start({
            format: 'mp3',
            duration:this.data.max_time
        });
    },

    /**
     * 停止录音
     */
    stopRecord: function () {
        console.log('结束录音')
        var time = (this.getCurTime() - this.data.startTime)
        if(time > this.data.max_time){
            time = this.data.max_time
        }
        this.setData({
            time: time/1000, //计算录音时长
            startTime:0 //清空初始录音时长
        })
        this.recorderManager.stop()
    },

    /**
     * 播放录音
     */
    playRecord: function () {
        console.log('点击播放')
        console.log(this.data)
        var src = this.data.src;
        if (src == '') {
            this.tip("请先录音!！")
            return;
        }
        console.log(this.data.src)
        this.innerAudioContext.src = this.data.src;
        this.innerAudioContext.play()
    },
    getCurTime() {
        return new Date().getTime()
    }


})