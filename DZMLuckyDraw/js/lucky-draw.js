new Vue({
  el: '#app',
  template: `
    <div class="lucky-draw-view">
      <!-- 抽奖显示页面 -->
      <div :class="isLuckyDraw ? 'lucky-draw-content lucky-draw-start' : 'lucky-draw-content'">
        <div :class="isLuckyDraw ? 'lucky-draw-users lucky-draw-users-start' : 'lucky-draw-users'">
          <div class="lucky-draw-user" v-for="item in users" :key="index">
            <div class="lucky-draw-user-name">{{ item.name }}</div>
            <div class="lucky-draw-user-department">{{ item.department }}</div>
          </div>
          <div v-if="!users.length && !surplusUsers.length" class="ucky-draw-empty">老板大气，已经人人中奖了！</div>
        </div>
      </div>
      <!-- 设置奖项，人数，并开始抽奖 -->
      <div class="lucky-draw-tool-left">
        <!-- 设置奖项 -->
        <a-select
          v-if="modeType == 1"
          class="lucky-draw-custom"
          placeholder="请选择奖项"
          :disabled="isLuckyDraw"
          @change="handleModeTypeChange"
          style="width:260px;display:none;"
        >
          <a-select-option
            v-for="(item, index) in customs"
            :key="index"
            :disabled="shoudDisable(item)"
            :value="item.tag"
            :item="item"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
        <!-- 设置抽奖人数 -->
        <a-input
          :class="modeType == 1 ? 'lucky-draw-number-custom' : 'lucky-draw-number'"
          :disabled="isLuckyDraw"
          style="display:none;"
          v-model="numberPeople"
          placeholder="本轮抽奖人数"
        />
        <!-- 抽奖按钮 -->
        <a-button v-show="false" @click="luckyDraw">
          {{ isLuckyDraw ?  luckyDrawTime ? '停止抽奖' : '结束本轮' : '开始抽奖' }}
        </a-button>
      </div>
      <!-- 右边工具栏 -->
      <!--<div class="lucky-draw-tool-right" @click="downloadWinningUsers">
        <a-button shape="circle" icon="download" />
      </div>-->
      <div class="award-tip">{{awardName}}</div>
    </div>
  `,
  data () {
    return {
      awardName: '',
      awardList: [],
      // 当前第几轮抽奖
      number: 1,
      tempNumber: 0,
      // 抽奖人数
      numberPeople: undefined,
      // 抽奖状态
      isLuckyDraw: false,
      // 滚动名单
      users: [],
      lastUsers: [],
      // 0 默认抽奖模式，1 自定义抽奖模式
      modeType: 1,
      // 自定义奖项列表
      customs: [{
        name: "三等奖（欧乐B电动牙刷、刷头）",
        tag: 3,
        num: 3
      }, {
        name: "二等奖（小米踢脚线电暖器）",
        tag: 2,
        num: 3
      }, {
        name: "一等奖（科沃斯扫地机）",
        tag: 1,
        num: 1
      }],
      // 当前选中奖项
      custom: undefined,
      // 中奖人员
      winningUsers: [],
      // 剩余未中奖人数
      surplusUsers: [],
      // 滚动定时器
      luckyDrawTime: undefined
    }
  },
  created () {
    this.enterKeyup();
  },
  mounted () {
    // 获取模式
    // const modeType = sessionStorage.getItem('modeType')
    // if (modeType) {
    //   this.modeType = Number(modeType)
    // } else {
    //   this.modeType = 0
    // }
    // 获取自定义列表
    //this.customs = JSON.parse(sessionStorage.getItem('customs')) || []
    // 剩余未中奖人数
    const _winningUsers = JSON.parse(localStorage.getItem('winning-users')) || [];
    const _users = users.filter(u => {
      if (_winningUsers.find(item => {
        if (item.user.indexOf(u.name) > -1) {
          return true;
        } else {
          return false;
        }
      })) {
        return false;
      } else {
        return true;
      }
    })

    this.winningUsers = _winningUsers;
    this.number = _winningUsers.length + 1;
    this.surplusUsers = [..._users];
    this.getUrlKey();
  },
  watch: {
    // awardList: function (val, oldVal) {
    //   if (val.length < 1) {
    //     console.log('一出事件监听。。。。')
    //     this.enterKeyupDestroyed();
    //   }
    // }
  },
  computed: {
    isHowBtn: function () {
      return this.awardList.length > 0;
    },
  },
  methods: {
    // 获取url中参数
    getUrlKey() {
      let awardType = window.location.href.split('?')[1].split('=')[1];
      
      // const pageData = JSON.parse(localStorage.getItem('page-data')) || {};
      // Object.keys(pageData).forEach(key => {
      //   this[key] = pageData[key];
      // });
      
      if (awardType == 3) {
        this.custom = {
          name: "三等奖（欧乐B电动牙刷、刷头）",
          tag: 3,
          num: 1
        };
        this.numberPeople = 1;
        this.awardList = [
          {
            name: '三等奖（欧乐B电动牙刷、刷头）',
            guest: '嘉宾一' 
          },
          {
            name: '三等奖（欧乐B电动牙刷、刷头）',
            guest: '嘉宾二' 
          },
          {
            name: '三等奖（欧乐B电动牙刷、刷头）',
            guest: '嘉宾三' 
          }
        ];
        this.awardName = `有请 ${this.awardList[0].guest} 抽取【${this.awardList[0].name}】`
      } else if (awardType == 2) {
        this.custom = {
          name: "二等奖（小米踢脚线电暖器）",
          tag: 2,
          num: 1
        }
        this.numberPeople = 1;
        this.awardList = [
          {
            name: '二等奖（小米踢脚线电暖器）',
            guest: '嘉宾一' 
          },
          {
            name: '意外奖（星巴克卡）',
            guest: '嘉宾一' 
          },
          {
            name: '意外奖（Air Pods pro）',
            guest: '嘉宾一' 
          },
          {
            name: '二等奖（小米踢脚线电暖器）',
            guest: '嘉宾二' 
          },
          {
            name: '二等奖（小米踢脚线电暖器）',
            guest: '嘉宾三' 
          }
        ];
        this.awardName = `有请 ${this.awardList[0].guest} 抽取【${this.awardList[0].name}】`
      } else if (awardType == 1) {
        this.custom = {
          name: "一等奖（科沃斯扫地机）",
          tag: 1,
          num: 1
        }
        this.numberPeople = 1;
        this.awardList = [
          {
            name: '一等奖（科沃斯扫地机）',
            guest: '嘉宾' 
          }
        ];
        this.awardName = `有请 ${this.awardList[0].guest} 抽取【${this.awardList[0].name}】`
      } else if (awardType == 4) {
        this.custom = {
          name: "特等奖（2000元购物卡）",
          tag: 4,
          num: 1
        }
        this.numberPeople = 1;
        this.awardList = [
          {
            name: '特等奖（2000元购物卡）',
            guest: '嘉宾' 
          }
        ];
        this.awardName = `有请 ${this.awardList[0].guest} 抽取【${this.awardList[0].name}】`
      } else {
        this.custom = {

        }
      }      
    },
    // 切换奖项
    handleModeTypeChange (value, e) {
      // 记录奖项
      this.custom = e.data.attrs.item
    },
    luckyDraw () {
      // 是否在抽奖
      if (this.isLuckyDraw) {
        // 已经开始抽奖，只能停止抽奖
        // 停止抽奖
        this.stopLuckyDraw()
      } else {
        // 准备开始抽奖
        if (this.modeType == 1 && !this.custom) {
          this.$message.error('请选择奖项')
          return
        }
        if (!this.numberPeople) {
          this.$message.error('请设置抽奖人数')
          return
        }
        if (!REG_IS_INTEGER(this.numberPeople)) {
          this.$message.error('抽奖人数必须为整数')
          return
        }
        if (this.numberPeople <= 0) {
          this.$message.error('抽奖人数必须大于0')
          return
        }
        if (this.numberPeople > users.length) {
          this.$message.error(`抽奖名单共 ${users.length} 人，填写抽奖人数必须小于或等于 ${users.length} 人`)
          return
        }
        this.startLuckyDraw()
        // if (this.checkNumberPeople()) {
        //   // 开始抽奖
        //   this.startLuckyDraw()
        // }
      }
    },
    // 为防止输入错误，这里限制一等奖1名，二等奖3名，三等奖3名
    checkNumberPeople () {
      let canSubmit = true;
      
      if (this.custom.num != this.numberPeople) {
        canSubmit = false;
        this.$message.error('该奖项抽奖人数不对');
      }
      return canSubmit;
    },
    // 开始抽奖
    startLuckyDraw () {
      if (this.tempNumber != this.number) {
        this.tempNumber = this.number
        stopAnimate('sphere')
        setTimeout(() => {
          this.isLuckyDraw = true
          this.infiniteCycle()
          this.GetUsers()
        }, 2000);
      }
    },
    // 停止抽奖
    stopLuckyDraw () {
      if (this.tempNumber === this.number) {
        if (this.luckyDrawTime) {
          clearInterval(this.luckyDrawTime)
          this.luckyDrawTime = undefined
          this.users = this.lastUsers
          this.saveWinningUsers()
        } else {
          this.isLuckyDraw = false
          this.numberPeople = 1
          this.number += 1
          stopAnimate('grid')

          this.awardList.shift();
          if (this.awardList[0]) {
            this.awardName = `有请 ${this.awardList[0].guest} 抽取【${this.awardList[0].name}】`;
          } else {
            this.awardName = '';
          }
        }
      }
    },
    // 循环名单
    infiniteCycle () {
      if (this.luckyDrawTime) {
        clearInterval(this.luckyDrawTime)
        this.luckyDrawTime = undefined
      }
      this.luckyDrawTime = setInterval(() => {
        this.updateNumberUsers()
      }, 10);
    },
    // 更新抽奖名单
    updateNumberUsers () {
      const tempUsers = []
      var number = 0;
      const total = users.length
      while (number < this.numberPeople) {
        const index = parseInt(Math.random()*total)
        const user = users[index]
        if (user) { tempUsers.push(user) }
        number++;
      }
      this.users = tempUsers
    },
    GetUsers () {
      // 剩余用户
      const surplusUsers = [...this.surplusUsers]
      const lastUsers = []
      // 标记用户
      surplusUsers.forEach(user => {
        // 编号有值
        if (user.number > 0) {
          if (this.modeType == 0) { // 默认抽奖模式
            if (user.number == this.number) {
              if (lastUsers.length < this.numberPeople) {
                lastUsers.push(user)
                const index = this.surplusUsers.indexOf(user)
                if (index !== -1) { this.surplusUsers.splice(index, 1) }
              }
            }
          } else if (this.modeType == 1) { // 自定义奖项模式
            if (user.number == this.custom.tag && this.custom.tag != 0) {
              if (lastUsers.length < this.numberPeople) {
                lastUsers.push(user)
                const index = this.surplusUsers.indexOf(user)
                if (index !== -1) { this.surplusUsers.splice(index, 1) }
              }
            }
          } else {}
        }
      })
      // 随机用户
      while (this.surplusUsers.length > 0 && lastUsers.length < this.numberPeople) {
        const index = parseInt(Math.random()*this.surplusUsers.length)
        const user = this.surplusUsers[index]
        if (user) {
          const index = this.surplusUsers.indexOf(user)
          if (index !== -1) {
            lastUsers.push(user)
            this.surplusUsers.splice(index, 1)
          }
        }
      }
      // 打乱顺序
      var length = lastUsers.length
      if (length > 1) {
        for (var i = 0; i < length - 1; i++) {
            var index = parseInt(Math.random() * (length - i));
            var temp = lastUsers[index];
            lastUsers[index] = lastUsers[length - i - 1];
            lastUsers[length - i - 1] = temp;
        }
      }
      // 记录数据
      this.lastUsers = lastUsers
    },
    shoudDisable(currentItem) {
      if (this.winningUsers.find(item => item.award === currentItem.name)) {
        return true;
      } else {
        return false;
      }
    },
    // 保存中奖名单
    saveWinningUsers () {
      // 处理名称
      var usernames = []
      this.lastUsers.forEach(user => {
        if (user.department) {
          usernames.push(`${user.name}(${user.department})`)
        } else {
          usernames.push(user.name)
        }
      })
      // 记录
      this.winningUsers.push({
        round: this.number,
        award: this.awardList[0].name,
        user: usernames.join('、')
      })

      // 保存
      localStorage.setItem('winning-users', JSON.stringify(this.winningUsers));
    },
    // 下载中奖名单
    downloadWinningUsers () {
      // 获取中奖名单
      const winningUsers = JSON.parse(localStorage.getItem('winning-users')) || []
      // 列名称
      const columns = [
        {
          name: '轮数',
          field: 'round',
          style: {
            color: '#0000FF',
            alignmentHor: 'Center',
            alignmentVer: 'Center'
          }
        },
        {
          name: '奖项',
          field: 'award',
          style: {
            color: '#0000FF',
            alignmentHor: 'Center',
            alignmentVer: 'Center'
          }
        },
        {
          name: '中奖用户',
          field: 'user',
          style: {
            colWidth: 888,
            color: '#0000FF',
            borderColor: '#D5DBEA',
            backgroundColor: '#00FFFF'
          }
        }
      ]
      // 将要保存的 sheets 数据源
      const sheets = [
        {
          // 单个 sheet 名字
          name: '中奖名单',
          // 单个 sheet 数据源
          data: winningUsers,
          // 单个 sheet 列名称与读取key
          columns: columns
        }
      ]
      // 下载
      EXDownloadManager(sheets, function (item, field, json, sheetIndex, row, col, columnCount, rowCount) {
        // 处理标题行
        if (row === 0) {
          // 内容横向排版：Left、Center、Right
          item.style.alignmentHor = 'Center'
          // 内容竖向排版：Top、Center、Bottom
          item.style.alignmentVer = 'Center'
          // 行高
          item.style.rowHeight = 32
        }
        // 返回
        return item
      })
    },
    enterKey(event) {
      const code = event.keyCode
                ? event.keyCode
                : event.which
                    ? event.which
                    : event.charCode;
      
      //if (code == 13 || code == 39 || code == 40) {
        if (this.awardList.length < 1) {
          this.enterKeyupDestroyed();
          top.postMessage( JSON.stringify({ namespace: 'reveal', eventName: 'slidechanged' }), '*' );
        } else {
          this.luckyDraw();
        }
      //}
    },
    handleClickChangePPT() {
      if (this.awardList.length < 1) {
        this.enterKeyupDestroyed();
        top.postMessage( JSON.stringify({ namespace: 'reveal', eventName: 'slidechanged' }), '*' );
      } else {
        this.luckyDraw();
      }
    },
    enterKeyupDestroyed() {
      document.removeEventListener("keydown", this.enterKey, false);
      document.removeEventListener("click", this.handleClickChangePPT, false);
    },
    enterKeyup() {
      window.postMessage( JSON.stringify({ namespace: 'reveal', eventName: 'slidechanged' }), '*' );
      document.addEventListener("keydown", this.enterKey, false);
      document.addEventListener("click", this.handleClickChangePPT, false);
      window.focus();
    }
  }
})