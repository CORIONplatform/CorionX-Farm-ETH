<template lang="pug">
v-container.nice-card.nice-card-big
  v-dialog(v-model='dialogs.stake', max-width='340', content-class='nice-dialog-wrapper')
    v-card.nice-card
      h3.nice-connector-title.text-center.mb-5(:style='"color: #f53a1f"')
        | Enter amount:
      v-card-text.fill-width(:style='"font-size: 0.9rem; color: #f53a1f"')
        | Balance:
        b {{ $niceUtils.BNToNumstr(program.bal, dec, 3) }} {{ token }}
      v-card-text.pb-0
        v-text-field.nice-textfield(
          v-if='approvedEnough',
          v-model='inputs.stake',
          type='number',
          :rules='[() => amountsValid.stake || "Enter proper amount", () => amountsEnough.stake || "Amount is too low", () => balancesEnough.stake || "Balance too low"]',
          outlined,
          placeholder='Amount',
          required,
          :disabled='loading.stake'
        )
          v-btn.maximizer-btn(v-if='canMaximizeAmounts.stake', slot='append', text, @click='clickMaximize("stake")')
            | Max
      v-card-actions
        v-spacer
        v-btn.nice-button.px-8.white--text(color='primary', block, :loading='loading.stake', :disabled='disabledInner.stake', @click='reduce("stake")')
          | Stake
        v-spacer
  v-dialog(v-model='dialogs.increase', max-width='340', content-class='nice-dialog-wrapper')
    v-card.nice-card
      h3.nice-connector-title.text-center.mb-5(:style='"color: #f53a1f"')
        | Enter amount:
      v-card-text.fill-width(:style='"font-size: 0.9rem; color: #f53a1f"')
        | Balance:
        b {{ $niceUtils.BNToNumstr(program.bal, dec, 3) }} {{ token }}
      v-card-text.pb-0
        v-text-field.nice-textfield(
          v-if='approvedEnough',
          v-model='inputs.increase',
          type='number',
          :rules='[() => amountsValid.increase || "Enter proper amount", () => amountsEnough.increase || "Amount is too low", () => balancesEnough.increase || "Balance too low"]',
          outlined,
          placeholder='Amount',
          required,
          :disabled='loading.increase'
        )
          v-btn.maximizer-btn(v-if='canMaximizeAmounts.increase', slot='append', text, @click='clickMaximize("increase")')
            | Max
      v-card-actions
        v-spacer
        v-btn.nice-button.px-8.white--text(
          color='primary',
          block,
          :loading='loading.increase',
          :disabled='disabledInner.increase',
          @click='reduce("increase")'
        )
          | Increase
        v-spacer
  v-dialog(v-model='dialogs.decrease', max-width='340', content-class='nice-dialog-wrapper')
    v-card.nice-card
      h3.nice-connector-title.text-center.mb-5(:style='"color: #f53a1f"')
        | Enter amount:
      v-card-text.fill-width(:style='"font-size: 0.9rem; color: #f53a1f"')
        | Staked:
        b {{ $niceUtils.BNToNumstr(program.amount, dec, 3) }} {{ token }}
      v-card-text.pb-0
        v-text-field.nice-textfield(
          v-if='approvedEnough',
          v-model='inputs.decrease',
          type='number',
          :rules='[() => amountsValid.decrease || "Enter proper amount", () => amountsEnough.decrease || "Amount is too low", () => balancesEnough.decrease || "Amount too big"]',
          outlined,
          placeholder='Amount',
          required,
          :disabled='loading.decrease'
        )
          v-btn.maximizer-btn(v-if='canMaximizeAmounts.decrease', slot='append', text, @click='clickMaximize("decrease")')
            | Max
      v-card-actions
        v-spacer
        v-btn.nice-button.px-8.white--text(
          color='primary',
          block,
          :loading='loading.decrease',
          :disabled='disabledInner.decrease',
          @click='reduce("decrease")'
        )
          | {{ decreaseAmountMaxed ? "Unstake" : "Decrease" }}
        v-spacer
  v-card-title
    .d-flex.justify-space-between(just, :style='"width: 100%"')
      div
        v-tooltip(top)
          template(v-slot:activator='{ on, attrs }')
            .nice-title(v-bind='attrs', v-on='on', :style='"font-size: 22px; font-weight: 600"') {{ name }}
          span {{ $niceUtils.fmtDate(program.start) }} — {{ $niceUtils.fmtDate(program.finish) }}
      div
        v-chip.white--text(color='corxorange') x{{ program.M }}
  v-divider
  v-card-text
    .d-flex.align-center.justify-space-between.fill-width.mb-2
      .fill-width(:style='"font-size: 1.1rem"')
        | APR:
      .fill-width(:style='"font-size: 1.1rem"')
        b {{ program.M.mul(10).toString() }},00%
    .d-flex.align-center.justify-space-between.fill-width.mb-2
      .fill-width(:style='"font-size: 1.1rem"')
        | Earn:
      .fill-width(:style='"font-size: 1.1rem"')
        b CORX
    .nice-text.mt-4(:style='"font-size: 0.75rem"')
      b CORX EARNED
    .d-flex.align-center.justify-space-between.fill-width
      .fill-width(:class='{ "grey--text": yield.lt(1) }', :style='"font-size: 1.25rem"')
        b {{ yield.gt(0) ? $niceUtils.BNToNumstr(yield, 8, 4) : "0.00" }}
      div
        v-btn.nice-button.mx-1.white--text(color='primary', :loading='loading.harvest', :disabled='disabled.harvest', @click='reduce("harvest")')
          | Harvest
    .nice-text.mt-2(:style='"font-size: 0.75rem"')
      b {{ token }} STAKED
    .d-flex.align-center.justify-space-between.fill-width(v-if='approvedEnough')
      .fill-width(:class='{ "grey--text": !program.started }', :style='"font-size: 1.25rem"')
        b {{ $niceUtils.BNToNumstr(program.amount, dec, 3) }}
      div
        .d-flex(v-if='program.started && !programFinished')
          v-btn.nice-button.n-mini.mx-1.white--text.mt-5.mt-sm-0(color='secondary', :disabled='disabled.decrease', @click='openDialog("decrease")')
            v-icon mdi-minus
          v-btn.nice-button.n-mini.mx-1.white--text.mt-5.mt-sm-0(color='secondary', :disabled='disabled.increase', @click='openDialog("increase")')
            v-icon mdi-plus
        v-btn.nice-button.mx-1.white--text.mt-5.mt-sm-0(
          v-else-if='programFinished',
          color='secondary',
          :loading='loading.unstake',
          :disabled='disabled.unstake',
          @click='reduce("unstake")'
        )
          | Unstake
        v-btn.nice-button.px-8.white--text(v-else, color='primary', :disabled='disabled.stake', @click='openDialog("stake")')
          | Stake
    v-btn.nice-button.px-8.white--text(
      v-else-if='$accessor.wallet',
      block,
      color='primary',
      :loading='loading.approve',
      :disabled='disabled.approve',
      @click='reduce("approve")'
    )
      | Approve
    v-btn.nice-button.px-8.mt-2.white--text(v-else, block, color='primary', @click='$accessor.SET_DIALOG(true)')
      | Unlock Wallet
</template>

<script lang="ts">
import { BigNumber } from '@ethersproject/bignumber'
import { providers } from 'ethers'
import Vue, { PropType } from 'vue'
import { IBT } from '~/store'
const programNames = ['CORX-ETH LP', 'CORX Staking', 'CORX-ETH LP', 'CORX Staking']
const programTokens = ['CORX-ETH LP', 'CORX', 'CORX-ETH LP', 'CORX']
const programDecimals = [18, 8, 18, 8]
const __k = 3171
type OpTypeInput = 'stake' | 'increase' | 'decrease'
type OpType = 'approve' | 'stake' | 'harvest' | 'increase' | 'decrease' | 'unstake'
export default Vue.extend({
  props: {
    program: Object as PropType<IBT & { i: number }>,
  },
  data() {
    return {
      dialogs: {
        stake: false,
        increase: false,
        decrease: false,
      },
      inputs: {
        stake: '',
        increase: '',
        decrease: '',
      },
      loading: {
        approve: false,
        stake: false,
        harvest: false,
        increase: false,
        decrease: false,
        unstake: false,
      },
    }
  },
  computed: {
    dec(): number {
      return programDecimals[this.program.i]
    },
    token(): string {
      return programTokens[this.program.i]
    },
    name(): string {
      return programNames[this.program.i]
    },
    programFinished(): boolean {
      return this.program.finish <= this.$accessor.time
    },
    hasBalance(): boolean {
      return this.program.bal.gt(0)
    },
    hasStaked(): boolean {
      return this.program.amount.gt(0)
    },
    approvedEnough(): boolean {
      return this.program.all.gt('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
    },
    // CONVERTERS
    amountsBN(): { [key in OpTypeInput]: BigNumber | null } {
      return {
        stake: this.amountsValid.stake ? this.$niceUtils.numstrToBN(this.inputs.stake.trim(), this.dec) : null,
        increase: this.amountsValid.increase ? this.$niceUtils.numstrToBN(this.inputs.increase.trim(), this.dec) : null,
        decrease: this.amountsValid.decrease ? this.$niceUtils.numstrToBN(this.inputs.decrease.trim(), this.dec) : null,
      }
    },
    yield(): BigNumber {
      const p = this.program
      return p.amount
        .mul((p.finish > this.$accessor.time ? this.$accessor.time : p.finish) - p.started)
        .mul(__k)
        .mul(2)
        .mul(p.M)
        .div(p.B)
        .div(10000)
        .add(p.debt)
    },
    // VALID DATA
    amountsValid(): { stake: boolean; increase: boolean; decrease: boolean } {
      return {
        stake: !!Number(this.inputs.stake),
        increase: !!Number(this.inputs.increase),
        decrease: !!Number(this.inputs.decrease),
      }
    },
    amountsEnough(): { [key in OpTypeInput]: boolean | null } {
      const { stake, increase, decrease } = this.amountsBN
      return {
        stake: !stake ? null : stake.gte(0),
        increase: !increase ? null : increase.gte(0),
        decrease: !decrease ? null : decrease.gte(0),
      }
    },
    balancesEnough(): { [key in OpTypeInput]: boolean | null } {
      const { stake, increase, decrease } = this.amountsBN
      return {
        stake: !stake ? null : stake.lte(this.program.bal),
        increase: !increase ? null : increase.lte(this.program.bal),
        decrease: !decrease ? null : decrease.lte(this.program.amount),
      }
    },
    // BUTTONS DISABLED
    canMaximizeAmounts(): { [key in OpTypeInput]: boolean | null } {
      const { stake, increase, decrease } = this.amountsBN
      return {
        stake: !stake ? true : !stake.eq(this.program.bal),
        increase: !increase ? true : !increase.eq(this.program.bal),
        decrease: !decrease ? true : !decrease.eq(this.program.bal),
      }
    },
    decreaseAmountMaxed(): boolean | null {
      const _bn = this.amountsBN.decrease
      if (!_bn) return null
      return _bn.eq(this.program.amount)
    },
    disabled(): { [key in OpType]: boolean } {
      return {
        approve: !this.$accessor.allSafe,
        stake: !this.$accessor.allSafe || this.programFinished,
        harvest: !this.$accessor.allSafe || this.yield.eq(0),
        increase: !this.$accessor.allSafe,
        decrease: !this.$accessor.allSafe,
        unstake: !this.$accessor.allSafe || !this.hasStaked,
      }
    },
    disabledInner(): { [key in OpTypeInput]: boolean } {
      return {
        stake: !this.$accessor.allSafe || !this.amountsValid.stake || !this.amountsEnough.stake || !this.balancesEnough.stake || !this.hasBalance,
        increase: !this.$accessor.allSafe || !this.amountsValid.increase || !this.amountsEnough.increase || !this.balancesEnough.increase || !this.hasBalance,
        decrease: !this.$accessor.allSafe || !this.amountsValid.decrease || !this.amountsEnough.decrease || !this.balancesEnough.decrease,
      }
    },
  },
  methods: {
    clickMaximize(operation: OpTypeInput) {
      this.inputs[operation] = this.$niceUtils.BNToNumstr(operation === 'decrease' ? this.program.amount : this.program.bal, this.dec, this.dec)
    },
    openDialog(operation: OpTypeInput) {
      this.inputs[operation] = ''
      this.dialogs[operation] = true
    },
    warning(msg: string | null) {
      this.$emit('warning', msg)
    },
    async reduce(operation: OpType) {
      this.loading[operation] = true
      let tx: providers.TransactionResponse
      let receipt: providers.TransactionReceipt
      this.warning(null)
      this.$accessor.SET_SNACK_REC(null)
      this.$accessor.SET_SNACK_FAIL(null)
      try {
        const pid = this.program.i
        let amount: BigNumber | null
        console.log({ operation })
        switch (operation) {
          case 'approve':
            tx = await this.$accessor.send_approve({ pid })
            break
          case 'stake':
            amount = this.amountsBN[operation]
            if (!amount) throw new Error('Invalid input amount')
            tx = await this.$accessor.send_stake({ pid, amount })
            break
          case 'harvest':
            tx = await this.$accessor.send_harvest({ pid })
            break
          case 'increase':
            amount = this.amountsBN[operation]
            if (!amount) throw new Error('Invalid input amount')
            tx = await this.$accessor.send_increase({ pid, amount })
            break
          case 'decrease':
            if (this.decreaseAmountMaxed) console.log('decrease amount maxed. operation: unstake')
            amount = this.amountsBN[operation]
            if (!amount) throw new Error('Invalid input amount')
            if (this.decreaseAmountMaxed) {
              tx = await this.$accessor.send_unstake({ pid })
            } else tx = await this.$accessor.send_decrease({ pid, amount })
            break
          case 'unstake':
            tx = await this.$accessor.send_unstake({ pid })
            break
        }
        this.$accessor.SET_SNACK_TX(`https://etherscan.io/tx/${tx.hash}`)
        console.log({ tx })
      } catch (error) {
        console.error(error)
        this.warning(error.data?.message || error.error?.message || error.reason || error.message)
        console.error({ ...error })
        this.loading[operation] = false
        if (operation === 'stake' || operation === 'increase' || operation === 'decrease') this.dialogs[operation] = false
        return
      }
      try {
        receipt = await tx.wait()
        this.$accessor.SET_SNACK_TX(null)
        this.$accessor.SET_SNACK_REC(`https://etherscan.io/tx/${tx.hash}`)
        console.log({ receipt })
        await this.loadContractInfo()
      } catch (error) {
        console.error(error)
        this.$accessor.SET_SNACK_TX(null)
        this.$accessor.SET_SNACK_FAIL(`https://etherscan.io/tx/${tx.hash}`)
        this.warning(error.data?.message || error.error?.message || error.reason || error.message)
        console.error(error)
      }
      this.loading[operation] = false
      if (operation === 'stake' || operation === 'increase' || operation === 'decrease') this.dialogs[operation] = false
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
  },
})
</script>

<style lang="scss" scoped>
.v-btn.nice-button.n-mini {
  min-width: 48px;
  padding: 8px 16px !important;
}
</style>
