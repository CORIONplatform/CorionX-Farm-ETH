<template lang="pug">
v-main
  v-row.mx-0(justify='center', align='center')
    v-col.py-16(cols='12', sm='11', :style='"max-width: 920px"')
      h1.text-center(:style='"color: #f53a1f"')
        | CorionX DeFi
      .text-center.mb-4.mt-2(:style='"color: #f53a1f"')
        | Swap and Farm on ETH Chain
      .alerts-container
        v-alert(v-if='$accessor.loadingMessage', type='info')
          | {{ $accessor.loadingMessage }}
        v-alert(v-if='$accessor.errorMessage', type='error')
          | {{ $accessor.errorMessage }}
        v-alert(v-if='warningMessage', type='warning')
          | {{ warningMessage }}
      v-divider.mt-4.mb-6(:style='"border-color: #f53a1f"')
      v-row(justify='center')
        v-col(cols='12', sm='6')
          v-container.nice-card.nice-card-big
            v-card-title
              .d-flex.justify-space-between(just, :style='"width: 100%"')
                h1.nice-title(:style='"font-size: 40px; border-bottom: none"')
                  | Farms & Staking
            v-card-text
              v-img.mb-4(src='/corxlogo.png', height='64', width='64')
              | CORX to Harvest
              .nice-corx-harvestable.my-4(v-if='$accessor.wallet')
                | {{ corxToHarvest }}
              .my-4(:style='"color: #767366; font-size: 16px"', v-else)
                | LOCKED
              | ~${{ corxToHarvest_USD || "0.00" }}
              br
              .mb-2
              | CORX in Wallet
              .nice-corx-inwallet.my-2(v-if='$accessor.wallet')
                | {{ corxInWallet }}
              .my-1(:style='"color: #767366; font-size: 16px"', v-else)
                | LOCKED
              | ~${{ corxInWallet_USD || "0.00" }}
            v-card-actions
              v-btn.nice-button.nice-button-block.px-8.white--text(
                v-if='$accessor.wallet',
                block,
                color='primary',
                :disabled='progDisabledHarvestAll',
                @click='handleClickHarvestAll'
              )
                | Harvest All ({{ corxToHarvest_SHORT || "0" }})
              v-btn.nice-button.nice-button-block.px-8.mt-2.white--text(v-else, block, color='primary', @click='$accessor.SET_DIALOG(true)')
                | Unlock Wallet
        v-col(cols='12', sm='6')
          v-container.nice-card.nice-card-big(:style='"height: 444px"')
            v-card-title
              .d-flex.justify-space-between(just, :style='"width: 100%"')
                h1.nice-title.mb-4(:style='"font-size: 40px; border-bottom: none"')
                  | Announcements
            v-card-text
              a.twitter-timeline(data-height='316', href='https://twitter.com/CorionPlatform?ref_src=twsrc%5Etfw')
                | Tweets by CorionPlatform
        v-col(cols='12', sm='6')
          v-container.nice-card.nice-card-big(:style='"max-height: 444px"')
            v-card-title
              .d-flex.justify-space-between(just, :style='"width: 100%"')
                h1.nice-title.mb-3(:style='"font-size: 40px; border-bottom: none"')
                  | CORX Stats
            v-card-text
              .d-flex.flex-row.justify-space-between.my-2
                div Market Cap
                div
                  b {{ $accessor.corx_info ? "$" + new Intl.NumberFormat("en-US").format($accessor.corx_info.mcap) : "..." }}
              .d-flex.flex-row.justify-space-between.my-2
                div Total Supply
                b {{ $accessor.corx_info ? new Intl.NumberFormat("en-US").format($accessor.corx_info.tsup) : "..." }}
              .d-flex.flex-row.justify-space-between.my-2
                div Circulating Supply
                div
                  b {{ $accessor.corx_info ? new Intl.NumberFormat("en-US").format($accessor.corx_info.csup) : "..." }}
</template>

<script lang="ts">
/* eslint-disable camelcase */
/* eslint-disable no-console */
import Vue from 'vue'
import { providers, BigNumber } from 'ethers'
import NavDrawer from '~/components/NavDrawer.vue'
import NiceAppbar from '~/components/NiceAppbar.vue'
const __k = 3171
export default Vue.extend({
  components: { NavDrawer, NiceAppbar },
  head: {
    script: [{ async: true, src: 'https://platform.twitter.com/widgets.js', charset: 'utf-8' }],
  },
  data() {
    return {
      warningMessage: null as string | null,
      successMessage: null as string | null,
      loadings_harvestAll: false,
    }
  },
  computed: {
    // CONVERTERS
    progYieldAll(): BigNumber | null {
      if (!this.$accessor.infoBundle) return null
      const pr = this.$accessor.infoBundle.map((p) =>
        p.amount
          .mul((p.finish > this.$accessor.time ? this.$accessor.time : p.finish) - p.started)
          .mul(__k)
          .mul(2)
          .mul(p.M)
          .div(p.B)
          .div(10000)
          .add(p.debt)
      )
      return pr.reduce((acc, val) => acc.add(val), BigNumber.from(0))
    },
    corxToHarvest(): string | null {
      if (!this.progYieldAll) return null
      return Number(this.$niceUtils.BNToNumstr(this.progYieldAll, 8, 3)).toFixed(3)
    },
    corxToHarvest_USD(): string | null {
      if (!(this.progYieldAll && this.$accessor.corx_info)) return null
      return (Number(this.$niceUtils.BNToNumstr(this.progYieldAll, 8, 3)) * this.$accessor.corx_info.price).toFixed(2)
    },
    corxToHarvest_SHORT(): string | null {
      if (!this.progYieldAll) return null
      return this.$niceUtils.BNToNumstr(this.progYieldAll, 8, 3)
    },
    corxInWallet(): string | null {
      if (!this.$accessor.tknBalance) return null
      return Number(this.$niceUtils.BNToNumstr(this.$accessor.tknBalance, 8, 3)).toFixed(3)
    },
    corxInWallet_USD(): string | null {
      if (!(this.$accessor.tknBalance && this.$accessor.corx_info)) return null
      return (Number(this.$niceUtils.BNToNumstr(this.$accessor.tknBalance, 8, 3)) * this.$accessor.corx_info.price).toFixed(2)
    },
    progDisabledHarvestAll(): boolean | null {
      if (!this.progYieldAll) return null
      return this.progYieldAll.eq(0)
    },
  },
  methods: {
    resetData() {
      this.$accessor.RESET()
      this.warningMessage = this.successMessage = null
    },
    async loadContractInfo() {
      this.$accessor.SET_LOADING({ key: 'infoBundle', value: true })
      try {
        await this.$accessor.loadContractInfo()
      } catch (error) {
        console.error(error)
      }
      this.$accessor.SET_LOADING({ key: 'infoBundle', value: false })
    },
    async handleClickHarvestAll(i: number) {
      this.loadings_harvestAll = true
      let tx: providers.TransactionResponse
      let receipt: providers.TransactionReceipt
      try {
        this.warningMessage = null
        tx = await this.$accessor.send_harvestAll()
        this.$accessor.SET_SNACK_TX(`https://etherscan.io/tx/${tx.hash}`)
        console.log({ tx })
      } catch (error) {
        this.warningMessage = error.data?.message || error.message
        console.error(error)
        return
      }
      try {
        receipt = await tx.wait()
        this.$accessor.SET_SNACK_TX(null)
        this.$accessor.SET_SNACK_REC(`https://etherscan.io/tx/${tx.hash}`)
        console.log({ receipt })
        await this.loadContractInfo()
      } catch (error) {
        this.$accessor.SET_SNACK_TX(null)
        this.$accessor.SET_SNACK_FAIL(`https://etherscan.io/tx/${tx.hash}`)
        this.warningMessage = error.data?.message || error.message
        console.error(error)
      }
      this.loadings_harvestAll = true
    },
  },
})
</script>
