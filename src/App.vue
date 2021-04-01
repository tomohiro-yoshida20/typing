<template>
  <div id="app">
    <div class="link mt-20 ml-10">
      <router-link to="/play" tag="button" class="btn btn-primary mr-10">
        PLAY
      </router-link>
      <router-link to="/setting" tag="button" class="btn btn-primary mr-10">
        SETTING
      </router-link>
      <router-link to="/ranking" tag="button" class="btn btn-primary">
        RANKING
      </router-link>
    </div>
    <div class="main">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
    <!-- ローダーを表示 -->
    <div class="loader" id="loading">
      <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
        <path fill="#000" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
        <animateTransform attributeType="xml"
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="0.6s"
          repeatCount="indefinite"/>
        </path>
      </svg>
    </div>
  </div>
  
</template>

<script>
export default {
  created() {
    // ロード時は回転ローダー表示
    document.addEventListener('DOMContentLoaded', () => {
      const spinner = document.getElementById('loading');
      spinner.classList.add('loaded');
    },false);
  },
  mounted() {
    this.$nextTick(() => {
      this.$router.push('./play')
    })
  }
}
</script>

<style lang="scss">
/* vue初期設定 #app */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 480px;
  margin: 0 auto;
}

/* ローダーここから */
.loader {
  margin: 0 0 2em;
  height: 100px;
  width: 20%;
  text-align: center;
  padding: 1em;
  margin: 0 auto 1em;
  display: inline-block;
  vertical-align: top;
}

#loading {
  width: 100vw;
  height: 100vh;
  transition: all 1s;
  position: fixed;
  top: 200px;
  left: 0;
  z-index: 9999;
}

.loaded {
opacity: 0;
visibility: hidden;
}

svg path,
svg rect{
  fill: tomato;
}

/* ローダーここまで */

/* 共通部品ここから */

* {
  box-sizing: border-box;
}

.flex {
  display: flex;
}

// 画面上部ルーターリンク
.link {
  display: flex;
  justify-content: left;
}

.fade-enter {
  opacity: 0;
  &-active {
    transition: all .6s ease;
  }
  &-to {
    opacity: 1;
  }
}
.fade-leave {
  opacity: 1;
  &-active {
    transition: all .6s ease;
  }
  &-to {
    opacity: 0;
  }
}

.main {
  margin: 10px 0 0;
  padding: 0;
  width: 460px;
  min-height: 380px;
  height: auto;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
}

.error {
  font-size: 12px;
  color: red;
  text-align: left;
  margin-top: 5px;
}

.marken {
  position: relative;
  z-index: 20;
}

.marker {
  position: absolute;
  bottom: 5%;
  z-index: 10;
  width: 100%;
  height: 35%;
  background-color: #a2a2a270;
  border-radius: 5px;
}

.pink {
  color: palevioletred;
}

.mt {
  &-10 {
    margin-top: 10px;
  }
  &-20 {
    margin-top: 20px;
  }
}
.mb {
  &-10 {
    margin-bottom: 10px;
  }
  &-20 {
    margin-bottom: 20px;
  }
}
.mr {
  &-10 {
    margin-right: 10px;
  }
  &-20 {
    margin-right: 20px;
  }
}
.ml {
  &-10 {
    margin-left: 10px;
  }
  &-20 {
    margin-left: 20px;
  }
}

.center {
  text-align: center;
}

.left {
  text-align: left;
}

.right {
  text-align: right;
}



</style>
