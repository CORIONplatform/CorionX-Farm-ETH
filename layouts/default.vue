<template lang="pug">
v-app
  NavDrawer(:minimalized='drawer_minimalized')
  NiceAppbar(v-model='drawer_minimalized', @dialog='$accessor.SET_DIALOG(true)')
  v-dialog(:value='$accessor.dialog', @input='$accessor.SET_DIALOG', max-width='330', content-class='nice-dialog-wrapper')
    v-card.nice-card
      h3.nice-connector-title.text-center.mb-8(:style='"color: #f53a1f"')
        | Connect using:
      div
        v-btn.nice-button.mb-4.white--text(
          color='primary',
          :style='$accessor.providerType === "M" ? "color: #1bb19b !important; border-color: #1bb19b" : ""',
          block,
          large,
          :disabled='$accessor.providerType === "M"',
          @click='clickConnectMetamask'
        )
          | MetaMask
          v-icon(v-if='$accessor.providerType === "M"', right, :style='"color: #1bb19b !important"')
            | mdi-check-circle-outline
        v-btn.nice-button.mb-4.white--text(
          color='primary',
          :style='$accessor.providerType === "W" ? "color: #1bb19b !important; border-color: #1bb19b" : ""',
          block,
          large,
          :disabled='$accessor.providerType === "W"',
          @click='clickConnectWalletconnect'
        )
          | Walletconnect
          v-icon(v-if='$accessor.providerType === "W"', right, :style='"color: #1bb19b !important"')
            | mdi-check-circle-outline
  a(:href='$accessor.snackbar_tx_url || ""', target='_blank', rel='noopener noreferrer')
    v-snackbar(:timeout='-1', color='info', :value='$accessor.snackbar_tx_url', :multi-line='true')
      | Transaction sent, please wait...
      br
      | Click here to see it
      template(#action='{ attrs }')
        v-btn(rounded, icon, v-bind='attrs', @click.prevent='$accessor.SET_SNACK_TX(null)')
          v-icon mdi-close
  a(:href='$accessor.snackbar_rec_url || ""', target='_blank', rel='noopener noreferrer')
    v-snackbar(:timeout='-1', color='success', :value='$accessor.snackbar_rec_url', :multi-line='true')
      | Transaction confirmed! Click here to see it
      template(#action='{ attrs }')
        v-btn(rounded, icon, v-bind='attrs', @click.prevent='$accessor.SET_SNACK_REC(null)')
          v-icon mdi-close
  a(:href='$accessor.snackbar_fail_url || ""', target='_blank', rel='noopener noreferrer')
    v-snackbar(:timeout='-1', color='error', :value='$accessor.snackbar_fail_url', :multi-line='true')
      | Transaction failed! Click here to see it
      template(#action='{ attrs }')
        v-btn(rounded, icon, v-bind='attrs', @click.prevent='$accessor.SET_SNACK_FAIL(null)')
          v-icon mdi-close
  nuxt
</template>

<script lang="ts">
import Vue from 'vue'
import NavDrawer from '~/components/NavDrawer.vue'
import NiceAppbar from '~/components/NiceAppbar.vue'
export default Vue.extend({
  data() {
    return {
      drawer_minimalized: false,
    }
  },
  async mounted() {
    this.$accessor.UPDATE_TIME()
    setInterval(this.$accessor.UPDATE_TIME, 1000)
    if (!this.$accessor.corx_info)
      try {
        await this.$accessor.loadCORXInfo()
      } catch (error) {}
  },
  methods: {
    async clickConnectWalletconnect() {
      await this.connectWalletconnect()
    },
    async connectWalletconnect() {
      this.$accessor.SET_LOADING({ key: 'provider', value: true })
      try {
        await this.$accessor.connectWalletconnect()
      } catch (error) {
        this.$accessor.SET_ERROR_MISC('Could not connect Walletconnect. Error: ' + error.message)
        console.error(error)
      }
      this.$accessor.SET_LOADING({ key: 'provider', value: false })
      this.$accessor.SET_DIALOG(false)
    },
    async clickConnectMetamask() {
      await this.connectMetamask()
      ;(window.ethereum as any).on('chainChanged', async (chainId: string) => {
        console.log({ chainId })
        await this.connectMetamask()
      })
    },
    async connectMetamask() {
      this.$accessor.SET_LOADING({ key: 'provider', value: true })
      try {
        await this.$accessor.connectMetamask()
      } catch (error) {
        this.$accessor.SET_ERROR_MISC('Could not connect Walletconnect. Error: ' + error.message)
      }
      this.$accessor.SET_LOADING({ key: 'provider', value: false })
      this.$accessor.SET_DIALOG(false)
    },
  },
  components: { NavDrawer, NiceAppbar },
})
</script>

<style lang="scss">
h1 {
  font-style: normal;
  font-weight: bold;
  font-size: 32px;
}
h2 {
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
}
h3 {
  font-style: normal;
  font-weight: bold;
  font-size: 22px;
}
li {
  margin-left: 16px;
}
.v-application {
  font-family: 'Kanit', sans-serif !important;
  color: #f53a1f;
}
.v-main {
  height: 100%;
  background-color: none;
  background: url('/bg2.png') repeat;
}
label {
  color: #f53a1f !important;
}
.v-overlay--active .v-overlay__scrim {
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
  background: rgba(118, 118, 118, 0.5) !important;
  opacity: unset !important;
}
.v-toolbar__content {
  border-bottom: 2px solid #ecdfdf !important;
}
.v-navigation-drawer {
  background-color: #f7e9e9 !important;
}
.v-list--nav {
  padding-left: 0px;
  * {
    color: #f53a1f !important;
  }
}
.v-list-item__icon {
  margin-right: 16px !important;
}
.v-list-group__items .v-list-item {
  padding-left: 32px !important;
}
.v-list-item {
  border-radius: 0 !important;
  padding-left: 16px !important;
}
.nice-active {
  -webkit-box-shadow: inset 4px 0px 0px 0px #f53a1f;
  box-shadow: inset 4px 0px 0px 0px #f53a1f;
}
.alerts-container {
  width: 100%;
  .v-alert {
    margin-bottom: 5px;
    border-radius: 32px !important;
    @media only screen and (max-width: 599px) {
      border-radius: 0;
    }
  }
}
.nice-dialog-wrapper {
  border-radius: 6px !important;
}
.nice-button {
  font-size: 16px !important;
  text-transform: unset !important;
  letter-spacing: -0.29px !important;
  padding: 8px 32px !important;
  height: 48px !important;
  box-shadow: rgb(14 14 44 / 40%) 0px -1px 0px inset !important;
  border-radius: 16px !important;
  &:not(.white--text) {
    color: black !important;
  }
  &.connect-button {
    font-weight: 600 !important;
    position: absolute !important;
    right: 32px;
    height: 32px !important;
    @media only screen and (max-width: 599px) {
      right: 16px;
    }
  }
  &.nice-button-block {
    border-radius: 16px;
  }
}
.nice-textfield {
  border-radius: 6px;
  border-color: #e0e2e5;
  width: 100%;
  fieldset {
    border-width: 1px;
  }
  label {
    color: #787878;
  }
  &.v-input--is-disabled .v-input__slot {
    background: #e0e2e5 !important;
  }
  .v-input__append-inner {
    align-items: center !important;
    margin: 0 auto !important;
    height: 56px;
  }
  .maximizer-btn {
    text-transform: none;
    font-weight: 500;
    color: #f53a1f;
    padding: 0;
    font-size: 16px;
    height: 27px;
    min-width: 48px;
  }
}
.nice-card {
  padding: 16px !important;
  border-radius: 32px !important;
  border: 1.3px solid #e0e2e5 !important;
  box-shadow: rgb(25 19 38 / 10%) 0px 2px 12px -8px, rgb(25 19 38 / 5%) 0px 1px 1px;
  color: #f53a1f;
  &.nice-card-big {
    background: #f7e9e9;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
    @media only screen and (max-width: 599px) {
      padding: 20px 10px !important;
      margin: 20px 0 !important;
      box-shadow: unset !important;
      border: none !important;
    }
  }
  .nice-connector-title {
    white-space: nowrap !important;
    line-height: 30px;
  }
  .nice-title {
    height: 30px;
    border-bottom: 2px dotted #aaa;
  }
  .nice-corx-harvestable {
    font-size: 40px;
    font-weight: 600;
  }
  .nice-corx-inwallet {
    font-size: 24px;
    font-weight: 600;
  }
}
</style>
