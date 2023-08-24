<template>
  <v-app>
    <AppHeader/>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import AppHeader from "@/components/AppHeader";
export default {
  name: 'App',
  components: {
    AppHeader
  }
}
</script>

<style>
</style>