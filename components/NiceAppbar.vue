<template lang="pug">
v-app-bar.nice-appbar(height='60', color='corxskin', clipped-left, fixed, app, flat)
  v-btn(v-if='minimalized', icon, @click='minimalizedInput(false)')
    v-icon(color='primary')
      | mdi-menu
  v-btn(v-else, icon, @click='minimalizedInput(true)')
    v-icon(color='primary')
      | mdi-menu-open
  a.ml-5(href='https://corion.io', :style='"height: 100%; display: flex; align-items: center"', target='blank')
    v-img.appbar-logo(v-if='$vuetify.breakpoint.smAndUp', src='/longlogoblack.png', max-height='60', max-width='174')
    v-img.appbar-logo(v-else, src='/longlogoblack.png', max-height='60', max-width='174')
  v-spacer
  v-btn.nice-button.connect-button.white--text(rounded, color='primary', large, @click='$emit("dialog")')
    | {{ connectButtonLabel }}
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    minimalized: Boolean,
  },
  model: {
    prop: 'minimalized',
    event: 'input',
  },
  computed: {
    connectButtonLabel(): string {
      return this.$accessor.wallet ? this.$accessor.shortWallet : 'Connect'
    },
  },
  methods: {
    minimalizedInput(a: boolean) {
      this.$emit('input', a)
    },
  },
})
</script>
