<template>
  <div class="container">
    <!-- スタート画面 -->
    <div class="row" v-show="showHome">
      <div class="col-md-12 mb-20">
        <h1>タイピングゲーム</h1>
        <h4>by vue.js</h4>
      </div>
      <div class="col-md-12">
        <button
        class="btn btn-primary"
        @click="startCountDown"
        >ゲームスタート
        </button>
      </div>
    </div>
    <!-- カウントダウン -->
    <div class="countDown" v-show="showCountDown">
      <h1>
        {{ countDownTimer }}
      </h1>
    </div>

    <!-- ゲーム画面 -->
    <div class="row" v-show="showGame">
      <div class="col-md-12">
        <!-- 制限時間 -->
        <div class="timer mb-20">残り時間：{{ showLimitTime }} 秒</div>
        <!-- 問題 -->
        <p>{{ jaLetter }}</p>
        <p>
          <span
           v-for="(compLetter,index) in compLetters"
           :key="`first-${index}`"
           class="pink">
            {{ compLetter }}
          </span>
          <span
           v-for="(restLetter,index) in restLetters" 
           :key="`second-${index}`"
           class="">
            {{ restLetter }}
          </span>
        </p>
        <!-- 入力欄 -->
        <input type="hidden" class="typeBox mb-20" id="typeBox" v-model="inputText" autofocus>
        <!-- 問題ゲージ -->
        <div class="gage-frame">
          <div class="gage-bar" :style="styleObject"></div>
        </div>
      </div>
      <div v-show="showMissModal" class="missModal"></div>
    </div>

    <!-- リザルト画面 -->
    <div class="row" v-show="showResult">
      <div class="col-md-12">
        <h1 class="result mb-20">結果</h1>
        <div class="result mb-20">
          <div class="">
            <div>平均キータイプ数：{{ averageTypeSpeed }} 回/秒</div>
            <hr>
          </div>
          <div>
            <div>正しく打ったキー数：{{ currentKeyCount }} 回</div>
            <hr>
            <div class=""></div>
          </div>
          <div>
            <div>間違えた数：{{ missTypeCount }} 回</div>
            <hr>
            <div class=""></div>
          </div>
        </div>
        <div class="result">
          <button class="btn btn-primary mr-10" @click="resetGame">開始画面へ戻る</button>
          <button @click="showModal" class="btn btn-primary">ランキングへ登録</button>
        </div>
      </div>
      <div class="resistModal hidden" id="resistModal">
        <div class="resistBody">
          <label for="name" class="col-md-12 left mt-10">名前：</label>
          <input
          type="text"
          id="name"
          class="form-control offset-sm-1 col-sm-10 mb-10"
          v-model="name"
          placeholder="名前を入力してください">
          <label for="comment" class="col-md-12 left">コメント：</label>
          <input
          type="text"
          id="comment"
          v-model="comment"
          class="form-control offset-sm-1 col-sm-10 mb-10"
          placeholder="一言コメントを入力してください">
          <button class="btn btn-primary mr-10" @click="resist">登録する</button>
          <button class="btn btn-primary" @click="cancelResist">キャンセル</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"

export default {
  data() {
    return {
      // 画面表示切り替え
      showHome: true,
      showCountDown: false,
      showGame: false,
      showResult: false,
      showMissModal: false,
      // ゲーム開始フラグ
      startFlag: 0,
      // ゲーム終了フラグ
      endFlag: 0,
      // スタート時のカウントタイマー
      countDownTimer: 3,
      // 制限時間
      limitTime: 60,
      // 入力したキー
      key: '',
      // 経過時間
      takeTime: 0,
      // 総問題数
      totalLetters: 0,
      // 回答数
      ansLetterCount: 0,
      // 文字列
      letters: [
        // *すたーと時にランダムに並べて配列をつくる
      ],
      // dammy array
      dammyArray: [],
      // 日本語文字列
      jaLetter: '',
      // まだ打ち込んでない文字
      restLetters: [],
      // 打ち込みが終わった文字
      compLetters: [],
      // 入力文字(１文字)
      inputText: '',
      // 平均タイプ数
      averageTypeSpeed: 0,
      // 正しく打ち込んだキー数
      currentKeyCount: 0,
      // 間違い数
      missTypeCount: 0,

      name: '',
      comment: '',
    }
  },
  created() {
    // 押下したキーを取得
    window.addEventListener("keydown", (e)=>{
      this.key = e.key;
      // inputText を変化させる
      this.inputText = this.key
    }),

    axios.get('https://firestore.googleapis.com/v1/projects/typing-9ee13/databases/(default)/documents/letters')
    .then(response => {
      // サーバーから取得した文言をlettersに追加
      // console.log(response.data.documents.length)
      for(let i=0;i<response.data.documents.length;i++) {
        this.letters.push({
          ja: response.data.documents[i].fields.ja.stringValue,
          ro: response.data.documents[i].fields.ro.stringValue
        })
      }

      // 順番をランダムにしたい配列 array
      let array = this.letters
      // 連続回数
      const roopCount = array.length 
      // ダミー配列
      let newArray = []

      for(let i=0;i<roopCount;i++) {  
        // ランダム番目の要素のindex
        let x = Math.floor(Math.random() * array.length)
        // ランダム番目の要素を取り出す
        let el = array[x]
        // ランダム番目の要素を切り取る
        array.splice(x,1)
        // newArray へランダムな要素を入れ込む
        newArray.push(el)
      }
      
      this.letters = newArray
    })
  },
  computed: {
    styleObject() {
      let width = (((this.totalLetters - this.ansLetterCount) / this.totalLetters) * 100) + '%'
      return {
        'width': width
      }
    },
    showLimitTime() {
      if (this.limitTime < 10) {
        return '0' + this.limitTime
      }
      return this.limitTime
    }
  },
  methods: {
    // 初期化処理
    reset() {
      Object.assign(this.$data, this.$options.data());
    },

    /* 制限時間処理 */
    limitTimer() {
      if(this.endFlag != 1) {
        setTimeout(() => {
          // 制限時間を減算
          this.limitTime--
  
          // 経過時間を加算
          this.takeTime++
  
          // 制限時間が 0 になったら結果処理へ
          if(this.limitTime == 0) {
            // 結果出力
            this.outResult()
          } else {
            // 制限時間の減算処理をループさせる
            this.limitTimer()
          }
          
        }, 1000)
      }
    },

    /* ゲーム開始処理 */
    startGame() {
      // ゲーム画面に切り替える
      this.showCountDown = false
      this.showGame = true

      // 問題配置処理
      this.putLetter()

      // トータル問題数を計算
      this.totalLetters = this.letters.length

      // 制限時間始動
      this.limitTimer()

      // 入力欄に自動フォーカス
      this.$nextTick(() => {
        document.getElementById('typeBox').focus()
      })
    },

    /* ゲーム開始前カウントダウン実行処理 */
    actCountDown() {
      setTimeout(() => {
        this.countDownTimer--

        // カウントダウンが 0 になったらゲームスタート
        if(this.countDownTimer == 0) {
          this.countDownTimer = 'start !'
          setTimeout(()=> {
            // スタート！
            this.startGame()
          }, 1000)
        } else {
          // カウントダウンが 0 になるまでループ
          this.actCountDown()
        }
      }, 1000)
    },

    /* ゲーム開始前カウントダウン始動処理 */
    startCountDown() {
      // カウントダウンを表示
      this.showHome = false
      this.showCountDown = true

      // 減算を実行
      this.actCountDown()
    },

    /* 問題配置処理 */
    putLetter() {
      // 問題を取り出す
      this.jaLetter = this.letters[0].ja
      // 文字列を分割する
      this.restLetters = (this.letters[0].ro).split('')
    },

    /* 結果計算処理 */
    calcResult() {
      // 少数第一位まで計測
      this.averageTypeSpeed = (this.currentKeyCount / this.takeTime).toFixed(1)
    },

    /* 結果出力処理 */
    outResult() {
      // 制限時間と経過時間ストップ
      this.endFlag = 1

      // 結果計算
      this.calcResult()

      // 結果画面に切り替える
      this.showGame = false
      this.showResult = true
    },

    /* スタート画面へ戻る */
    resetGame() {
      // 初期化
      // this.reset()
      // 初期ページ再読み込み
      // this.$router.push('/setting')
      window.location.href = 'https://www.y-tomohiro.com/typing/'
    },

    // 登録用モーダルを表示する
    showModal() {
      const resistModal = document.getElementById('resistModal')
      resistModal.classList.add('show')
    },

    // 登録を実行する
    resist() {
      this.$router.push('/ranking')

      // データを送信
      axios.post('https://firestore.googleapis.com/v1/projects/typing-9ee13/databases/(default)/documents/rankings',
        {
          fields: {
            name: {
              stringValue: this.name
            },
            averageTypeSpeed: {
              doubleValue: this.averageTypeSpeed
            },
            comment: {
              stringValue: this.comment
            },
          }
        }
      )
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
      this.name = ''
      this.speed = ''
      this.comment = ''
    },

    // 登録をキャンセルしモーダルを閉じる
    cancelResist() {
      const resistModal = document.getElementById('resistModal')
      resistModal.classList.remove('show')
    }

  },

  watch: {
    // 入力文字 = 引数e
    inputText(e) {
      // 入力が正しい場合
      if(e == this.restLetters[0]) {
        // 正しく打ったキー数を増やす
        this.currentKeyCount++

        // 残文字列の先頭を削除し完了の方に追加する
        this.compLetters.push(this.restLetters[0])
        this.restLetters.shift()

      // 打ち込んだ値を空白に戻す
      } else if( e == '') {
      // 空白に戻す

      // 入力を誤っている場合
      } else {
        // 間違い数を増やす
        this.missTypeCount++
        
        // 間違ったときは一瞬ミスモーダルをつける
        this.showMissModal = true
        setTimeout(()=> {
          this.showMissModal = false
        }, 100)
      }

      // // 文字入力毎に消す
      this.$nextTick(() => {
        this.inputText = ''
      })
    },

    restLetters() {
      if(this.restLetters.length == 0) {
        // 回答数をふやす
        this.ansLetterCount++
        // 完了した文字を初期化
        this.compLetters = []
        // 先頭の問題を取り除く
        this.letters.shift()
      }
    },

    letters() {
      if(this.letters.length == 0) {
        this.outResult()

      } else {
        // 次の問題をレンダリング
        this.putLetter()
      }
    }
  }
}
</script>

<style scoped lang="scss">

  .resistModal {
    visibility: hidden;
    opacity: 0;
    transition: 1s ease;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
  }

  .show {
    opacity: 1;
    visibility: visible;
  }

  .resistBody {
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 360px;
    height: 220px;
    background-color: white;
    border-radius: 5px;
  }

  .missModal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 0, 0, 0.6);
  }

  .typeBox {
    outline: none;
    border: none;
  }

  .gage-frame {
    width: 60%;
    background-color: #333;
    margin: 0 auto;
    padding: 3px 3px;

    & .gage-bar {
      height: 5px;
      background-color: tomato;
      transition: all .2s
    }
  }

</style>
