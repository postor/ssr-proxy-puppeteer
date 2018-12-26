var app = new Vue({
  el: '#app',
  template: `<div id="app"><ul><li v-for="item in list">{{item}}</li></ul><button v-on:click="alertit()">load</button></div>`,
  data: {
    list: [
      'not loading api.json'
    ]
  },
  created() {
    fetch('/api')
      .then(r => r.json())
      .then(obj => {
        this.list = obj.list
      })
  },
  methods: {
    alertit: function () {
      alert(`vue binded!`)
    }
  }
})