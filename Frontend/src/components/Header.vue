<template>
  <div class="header">
    <img src="../assets/hdec_logo.png">
  </div>
</template>

<script>

export default {
  name: 'Header',
  props: {
  },
  setup () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.header{
  height: 60px;
  background-color: #525051;
}
.header img{
  position: absolute;
  top:20px;
  left:20px;
}
</style>
