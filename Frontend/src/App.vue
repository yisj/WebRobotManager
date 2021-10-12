<template>
  <Header></Header>
  <Main></Main>
  <Footer></Footer>
</template>

<script>
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import Main from './components/Main.vue'

export default {
  name: 'App',
  components: {
    Header,
    Main,
    Footer
  }
}
</script>

<style>
body{
  margin: 0;
  overflow: hidden;
  -ms-user-select: none; 
  -moz-user-select: -moz-none; 
  -webkit-user-select: none; 
  -khtml-user-select: none; 
  user-select:none;
  -webkit-user-drag: none;

}
::-webkit-scrollbar{width: 14px;}
::-webkit-scrollbar-track{background-color: #525051;}
::-webkit-scrollbar-thumb{background-color: #d3d7cf;}
</style>
