'use strict'
var synth = new Tone.Synth().toMaster()
var game = new Vue({
  el: '#game',
  data: {
    heightBlockMax:'',
    widthBlockMax:'',
    size:50,
    row: 5,
    column: 5,
    timer: 0,
    circleStyle:{},
    crossStyle:{},
    blockStyle:{},
    numberList: [],
    count: 1,
    isGameStart: false,
    isGameEnd: false,
    isNewGame: true,
    isCircleShow: false,
    isCrossShow: false,
    isstartTimer: false
  },
  created:function(){
    this.heightBlockMax = Math.floor(document.body.clientHeight/52)
    this.widthBlockMax = Math.floor(document.body.clientWidth/52)
  }
  ,
  computed: {
    numSum: function () {
      return this.row * this.column
    },
  },
  methods: {
    changeBlockStyle:function(num){
      this.blockStyle.width = num + "px"
      this.blockStyle.height = num + "px"
      this.blockStyle.fontSize = num/2 + "px"
      this.circleStyle.width = num/2 + "px"
      this.circleStyle.height = num/2 + "px"
      this.circleStyle.borderRadius = num/2 + "px"
      this.crossStyle.width = num/2 + "px"
      this.crossStyle.height = num/6 + "px"
    },
    reset: function () {
      this.isGameEnd = false
      this.isGameStart = false
      this.isNewGame = false
    },
    countTimer2: function () {
      let start = null;
      this.isstartTimer = true
      function step(timestamp) {
        if (!start) {
          start = timestamp
        }
        let progress = timestamp - start;
        if (progress >= 1000) {
          game.timer += 1
          progress = 0
          start = null
        }
        if (game.isstartTimer == true) {
          window.requestAnimationFrame(step);
        }
        else {
          window.cancelAnimationFrame(startTimer);
        }
      }
      let startTimer = window.requestAnimationFrame(step);
    }
    ,
    endGame: function () {
      this.reset()
      this.isGameEnd = true
      this.isstartTimer = false
    },
    initGame: function () {
      this.numberList = []
      this.timer = 0
      this.count = 1
      this.isCircleShow = false
      this.isCrossShow = false
      for (let i = 1; i < (this.numSum + 1); i++) {
        this.numberList.push(i)
      }
      this.randomSortList()
      this.coordinateList()
      this.changeBlockStyle(this.size)
      this.countTimer2()
    },
    startGame: function (e) {
      this.reset()
      this.isGameStart = true
      this.initGame()
    },
    coordinateList: function () {
      let temp = []
      for (let i = 0; i < this.column; i += 1) {
        temp.push(this.numberList.slice(i * this.row, this.row * (i + 1)))
      }
      this.numberList = temp
    },
    clickRight: function (x, y) {
      this.isCircleShow = true
      let width = this.size
      synth.triggerAttackRelease('E4', '8n')
      let circle = document.querySelector(".allCircle").style
      circle.top = y*width - (width/2) + "px"
      circle.left = x*width - (width/2) + "px"
      setTimeout(function () {
        game.isCircleShow = false
      }, 200)
    },
    clickWrong: function (x, y) {
      this.isCrossShow = true
      let width = this.size
      synth.triggerAttackRelease('C4', '8t')
      let cross = document.querySelector(".allCross").style
      cross.top = y*width - (width/2) + "px"
      cross.left = x*width - (width/2) + "px"
      setTimeout(function () {
        game.isCrossShow = false
      }, 200)
    },
    clickBlock: function (x, y) {
      if (this.numSum !== this.count) {
        if (this.numberList[y - 1][x - 1] == this.count) {
          this.count += 1
          this.clickRight(x, y)
        } else {
          this.clickWrong(x, y)
        }
      }
      else {
        this.endGame()
      }
    },
    randomSortList: function () {
      let list = [...this.numberList]
      let temp = []
      for (let i = 0; i < this.numberList.length; i++) {
        let randomNum = Math.floor(Math.random() * (this.numberList.length - i))
        temp.push(list[randomNum])
        list.splice(randomNum, 1)
      }
      this.numberList = temp
    }
  }
})
