<template>
  <div class="container">
    <!-- スタート画面 -->
    <div class="row mt-20">
      <div class="col-md-12 mb-10">
        <h1>文言を追加する</h1>
      </div>
      <div class="col-md-12">
        <label for="ja" class="col-md-12 left">日本語表記：</label>
        <input
         type="text"
         id="ja"
         class="form-control mb-10"
         v-model="ja"
         placeholder="日本語を入力してください">
        <ul v-if="jaErrors.length" class="err_ul">
          <li
            v-for="(jaError, index) in jaErrors"
            :key="index"
            class="error">
            {{ jaError }}
          </li>
        </ul>
      </div>
      <div class="col-md-12 mb-20">
        <label for="ro" class="col-md-12 left">ローマ表記：</label>
        <input
         type="text"
         id="ro"
         class="form-control"
         v-model="ro"
         placeholder="ローマ字を入力してください">
         <ul v-if="roErrors.length" class="err_ul">
           <li
            v-for="(roError, index) in roErrors" 
            :key="index"
            class="error">
             {{ roError }}
           </li>
         </ul>
      </div>
      <div class="col-md-12 mb-20">
        <button
        class="btn btn-primary mr-10"
        @click="createLetter">
        文言をサーバーへ送る
        </button>
      </div>
      <div class="col-md-12 mb-20">
        <!-- twitter接続のテスト -->
        <!-- <button
          class="btn btn-primary"
          @click="twitterTest">twitterTest
        </button> -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
var Twitter = require('twitter')

export default {
  data() {
    return {
      ja: '',
      ro: '',
      posts: [],
      jaPosts: [],
      roPosts: [],
      jaErrors: [],
      roErrors: []
    }
  },
  // firestore からデータを取得
  created() {
    axios.get('https://firestore.googleapis.com/v1/projects/typing-9ee13/databases/(default)/documents/letters')
    .then(response => {
      // 取得した文言とかぶらないようにするエラーチェック用
      this.posts = response.data.documents
      // 日本語とローマ字のリストをそれぞれ
      for(let i=0;i<this.posts.length;i++) {
        this.jaPosts.push(this.posts[i].fields.ja.stringValue)
        this.roPosts.push(this.posts[i].fields.ro.stringValue)
      }
    })
  },
  methods: {
    check() {
      // 初期化
      this.jaErrors = []
      this.roErrors = []

      /* 日本語表記のチェック */
      let jaTxt = this.ja

      // かな・カナ・漢字で入力されているか
      let jaData = jaTxt.match(/[^A-Za-z0-9]+/)
      if (!jaData && (jaTxt !== '')) {
        this.jaErrors.push("入力にかな・漢字以外の文字が存在します")
      }
      // 入力が「」空でないか
      if (jaTxt === '') {
        this.jaErrors.push('入力欄が空です。')
      }
      // サーバーに同じ文字が存在しないか
      if (this.jaPosts.includes(jaTxt)) {
        this.jaErrors.push('すでに登録されています。')
      }

      /* ローマ字表記のチェック */
      // 「-」の個数は？
      let roTxt = this.ro
      let count = roTxt.split("-").length - 1
      // 「-」を抜いた文字列を半角英数判定
      for(let i=0;i<count;i++) {
        roTxt = roTxt.replace("-", "")
      }
      // 「-」抜きで半角英数判定
      let roData = roTxt.match(/[^A-Za-z0-9]+/)
      if (roData) this.roErrors.push("入力に半角英数字以外の文字が存在します")

      // 入力が「」空でないか
      if (roTxt === '') {
        this.roErrors.push('入力欄が空です。')
      }
      // サーバーに同じ文字が存在しないか
      if (this.roPosts.includes(roTxt)) {
        this.roErrors.push('すでに登録されています。')
      }
    },

    // ここからtwitter 許諾されるまでは動かない？
    twitterTest() {
      var client = new Twitter({
        consumer_key:'PBAs747xMrdFbKwaGAotUJP5k',
        consumer_secret: 'm0gILxJhz9gcUe485gERBc2YckbXJJPwZUk9oQUU9Aoi3rx7xQ',
        access_token_key: '1244271522841165826-K1GSCQQ24DiyBXufKByWG5BciT58f5',
        access_token_secret: 'DYZVpTHdR0yyn8GFHhuhhbdJVSF5yZuZmgmzY36pGJWUy'
      })

      console.log(client)

      client.post('statuses/update', {status: 'ツイートも出来るかな？'}, function(error, tweet, response){
          console.log(response)
          if (!error) {
              console.log('ツイートしました ⇒' + tweet);
          } else {
              console.log('errorです！ ⇒' + error);
          }
      });
    },
    // ここまで


    // firestore へデータを追加
    createLetter() {
      // エラーチェック
      this.check()
      // エラーがないならデータを追加
      if (!this.jaErrors.length && !this.roErrors.length) {
        axios.post(
          'https://firestore.googleapis.com/v1/projects/typing-9ee13/databases/(default)/documents/letters',
          {
            fields: {
              ja: {
                stringValue: this.ja
              },
              ro: {
                stringValue: this.ro
              },
            }
          }
        )
        .then(response => {
          console.log(response)
          alert('登録しました！')
        })
        .catch(error => {
          console.log(error)
        })
        this.ja = ''
        this.ro = ''
      }
    }
  }
}
</script>

<style>
  .err_ul {
    margin: 0;
  }
</style>