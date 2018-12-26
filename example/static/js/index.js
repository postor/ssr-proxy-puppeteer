var app = new Vue({
  el: '#app',
  data: {
    list: [
      'not loading api.json'
    ]
  },
  created() {
    fetch('/js/api.json')
      .then(r => r.json())
      .then(obj => {
        this.list = obj.list
      })
  }
})