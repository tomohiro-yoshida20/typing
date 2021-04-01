<template>
  <div class="container">
    <!-- スタート画面 -->
    <div class="row mt-20">
      <div class="col-md-12 mb-10">
        <h1>ランキング</h1>
      </div>
      <div class="col-md-12">
        <table class="table table-striped table-dark">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">名前</th>
              <th scope="col">記録</th>
              <th scope="col">コメント</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ranker, index) in getRankers" :key="index">
              <th scope="row">{{ index + 1 + (currentPage - 1) * 3 }}</th>
              <td>{{ ranker.fields.name.stringValue }}</td>
              <td>{{ ranker.fields.averageTypeSpeed.doubleValue }} 回/秒</td>
              <td>{{ ranker.fields.comment.stringValue }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div>
      <vuejs-paginate
        :page-count="getPaginateCount"
        :prev-text="'<'"
        :next-text="'>'"
        :click-handler="paginateClickCallback"
        :container-class="'pagination justify-content-center'"
        :page-class="'page-item'"
        :page-link-class="'page-link'"
        :prev-class="'page-item'"
        :prev-link-class="'page-link'"
        :next-class="'page-item'"
        :next-link-class="'page-link'"
        :first-last-button="true"
        :first-button-text="'<<'"
        :last-button-text="'>>'"
      ></vuejs-paginate>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import VueJsPaginate from "vuejs-paginate";

export default {
  components: {
    "vuejs-paginate": VueJsPaginate,
  },
  data() {
    return {
      // データ格納先
      rankers: [],
      items: [],
      currentPage: 1,
      perPage: 3,
    }
  },
  // firestore からデータを取得
  created() {
    axios.get('https://firestore.googleapis.com/v1/projects/typing-9ee13/databases/(default)/documents/rankings')
    .then(response => {
      // 取得したデータを rankers へ格納
      this.rankers = response.data.documents
      // averageTypeSpeed の大きさ降順で並べ替える
      this.rankers.sort((a, b) => {
        if (a.fields.averageTypeSpeed.doubleValue < b.fields.averageTypeSpeed.doubleValue) {
            return 1;
        } else {
            return -1;
        }
      })
      for (let i=0;i<this.rankers.length;i++) {
        if (Number.isInteger(this.rankers[i].fields.averageTypeSpeed.doubleValue)) {
          this.rankers[i].fields.averageTypeSpeed.doubleValue = this.rankers[i].fields.averageTypeSpeed.doubleValue + '.0'
        }
      }
    })
  },
  computed: {
    getRankers: function () {
      let start = (this.currentPage - 1) * this.perPage;
      let end = this.currentPage * this.perPage;
      return this.rankers.slice(start, end);
    },
    getPaginateCount: function () {
      return Math.ceil(this.rankers.length / this.perPage);
    },
  },
  methods: {
    paginateClickCallback: function (pageNum) {
      this.currentPage = Number(pageNum);
    },
  },
}
</script>

<style>
  th, td {
    font-size: 14px;
  }
</style>