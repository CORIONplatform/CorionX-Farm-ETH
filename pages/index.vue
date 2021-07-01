<template lang="pug">
v-main
  v-row.mx-0(justify='center', align='center')
    v-col.py-16(cols='12', sm='11', :style='"max-width: 760px"')
      h1.text-center(:style='"color: #f53a1f"')
        | CorionX DeFi
      .text-center.mb-4.mt-2(:style='"color: #f53a1f"')
        | Swap and Farm on ETH Chain
      .d-flex.justify-space-around
        v-switch(inset, :style='"color: #f53a1f !important"', v-model='toggle_staked', label='Staked only')
        v-switch(inset, :style='"color: #f53a1f !important"', v-model='toggle_active', :label='toggle_active ? "Active" : "Inactive"')
      .alerts-container
        v-alert(v-if='$accessor.providerType === "N"', type='info', color='primary')
          | To perform actions on the page, connect your wallet
        v-alert(v-if='$accessor.loadingMessage', type='info')
          | {{ $accessor.loadingMessage }}
        v-alert(v-if='$accessor.errorMessage', type='error')
          | {{ $accessor.errorMessage }}
        v-alert(v-if='warningMessage', type='warning')
          | {{ warningMessage }}
      v-divider.mt-4.mb-6(:style='"border-color: #f53a1f"')
      v-row(justify='center')
        template(v-if='infoBundleFiltered')
          v-col(cols='12', sm='6', v-for='p of infoBundleFiltered', :key='p.i')
            ProjectCard(:program='p', @warning='warning')
          v-col(cols='12', sm='6')
            v-container.nice-card.nice-card-big.fill-height
              v-card-title
                .d-flex.justify-space-between(just, :style='"width: 100%"')
                  .nice-title(:style='"border-bottom: none; font-size: 22px; font-weight: 600"')
                    | Your Project? 👀 👀
              v-card-text
                v-img(src='/bunny-question.svg', height='64', width='64')
                h1.my-2(:style='"color: #f53a1f; font-size: 40px; font-weight: 600"')
                  | ???
                | Create a pool for your token
                v-btn.nice-button.px-8.my-3(
                  block,
                  color='primary',
                  :style='"border-width: 2px; box-shadow: none !important"',
                  outlined,
                  href='https://forms.gle/hHs52znCgrotJUTNA'
                )
                  | Apply now
                .d-flex.flex-row.justify-space-between
                  div APR:
                  div ??
                .d-flex.flex-row.justify-space-between
                  div Your Stake:
                  div ??? CORX
</template>

<script lang="ts">
/* eslint-disable camelcase */
/* eslint-disable no-console */
import Vue from 'vue'
import NavDrawer from '~/components/NavDrawer.vue'
import { IBT } from '~/store'
import NiceAppbar from '~/components/NiceAppbar.vue'
import ProjectCard from '~/components/ProjectCard.vue'
export default Vue.extend({
  components: { NavDrawer, NiceAppbar, ProjectCard },
  data() {
    return {
      toggle_active: true,
      toggle_staked: false,
      warningMessage: null as string | null,
      dialog_stake_pid: null as number | null,
    }
  },
  computed: {
    // CONVERTERS
    infoBundleFiltered(): (IBT & { i: number })[] | null {
      if (!(this.$accessor.infoBundle && this.$accessor.time)) return null
      return this.$accessor.infoBundle
        .map((p, i) => ({ ...p, i }))
        .filter((p) => (this.toggle_active ? p.finish > this.$accessor.time : p.finish <= this.$accessor.time) && (!this.toggle_staked || p.started))
    },
  },
  async mounted() {
    if (!this.$accessor.wallet) await this.$accessor.loadDefaultInfo()
  },
  methods: {
    warning(msg: string | null) {
      this.warningMessage = msg
    },
    async loadDefaultInfo() {
      this.$accessor.SET_LOADING({ key: 'infoBundle', value: true })
      try {
        await this.$accessor.loadDefaultInfo()
      } catch (error) {
        console.error(error)
      }
      this.$accessor.SET_LOADING({ key: 'infoBundle', value: false })
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
    resetInputDialog() {
      this.dialog_stake_pid = null
    },
  },
})
</script>

<style lang="scss" scoped></style>
