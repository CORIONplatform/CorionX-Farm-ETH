<template lang="pug">
v-navigation-drawer(:value='true', floating, clipped, fixed, app, :mini-variant='minimalized', permanent)
  v-list(nav, dense, flat)
    v-list-item(flat, link, color='primary', active-class="nice-active", to='/home')
      v-list-item-icon
        v-icon mdi-home
      v-list-item-title Home
    v-list-group(:value='false', no-action, prepend-icon='mdi-swap-horizontal')
      template(v-slot:activator)
        v-list-item-content
          v-list-item-title Trade
      v-list-item(flat, link, href='https://app.uniswap.org/#/swap?outputCurrency=0x26a604DFFE3ddaB3BEE816097F81d3C4a2A4CF97', target='blank')
        v-list-item-content
          v-list-item-title Exchange
      v-list-item(flat, link, href='https://app.uniswap.org/#/add/ETH/0x26a604DFFE3ddaB3BEE816097F81d3C4a2A4CF97', target='blank')
        v-list-item-content
          v-list-item-title Liquidity
    v-list-item(flat, link, color='primary', active-class="nice-active", to='/')
      v-list-item-icon
        v-icon mdi-tractor
      v-list-item-title Farms
    v-list-item(flat, href='https://bscbridge.corion.io/', target='blank')
      v-list-item-icon
        v-icon mdi-white-balance-sunny
      v-list-item-title Bridge
    v-list-item(flat, href='https://app.corion.io/', target='blank')
      v-list-item-icon
        BinanceLogo
      v-list-item-title DeFi on BSC
    v-list-item(flat, href='https://docs.google.com/forms/d/e/1FAIpQLSfcg5PADupA42EUMAWzm9BWYO-wQlKXQBrMkKX1Q2CBMcltAg/viewform', target='blank')
      v-list-item-icon
        v-icon mdi-handshake
      v-list-item-title Partnership
    v-list-group(flat, :value='false', no-action, prepend-icon='mdi-dots-horizontal')
      template(v-slot:activator)
        v-list-item-content
          v-list-item-title Info
      v-list-item(flat, link, href='https://corion.io/', target='blank')
        v-list-item-content
          v-list-item-title Website
      v-list-item(flat, link, href='https://coinmarketcap.com/currencies/corionx/', target='blank')
        v-list-item-content
          v-list-item-title CoinMarketCap
      v-list-item(flat, link, href='https://www.coingecko.com/en/coins/corionx', target='blank')
        v-list-item-content
          v-list-item-title Coingecko
      v-list-item(flat, link, href='https://etherscan.io/token/0x26a604DFFE3ddaB3BEE816097F81d3C4a2A4CF97', target='blank')
        v-list-item-content
          v-list-item-title Etherscan
      v-list-item(flat, link, href='https://github.com/CORIONplatform', target='blank')
        v-list-item-content
          v-list-item-title Github
    v-list-item(flat, href='/Audit.pdf', target='blank')
      v-list-item-icon
        v-icon mdi-security
      v-list-item-title Security Audit
  .d-flex.flex-column.py-2(
    :class='[minimalized ? "px-0" : "px-1"]',
    :style='"border-top: 2px solid #ecdfdf; position: absolute; bottom: 0; width: 100%; transition-duration: 0.2s"'
  )
    .d-flex.flex-row.justify-space-between.px-4(Lstyle='"height: 48px"')
      .d-flex.flex-row.justify-left.align-center
        v-img.mr-3(src='/corxlogo.png', height='24', width='24')
        div(:style='"color: #f53a1f; font-weight: 600"', :class='[minimalized ? "ml-2" : ""]')
          | {{ $accessor.corx_info ? "$" + new Intl.NumberFormat("en-US").format($accessor.corx_info.price) : "..." }}
      .d-flex.flex-row.justify-left.align-center
        v-menu(open-on-hover, rounded, top, offset-y)
          template(v-slot:activator='{ attrs, on }')
            .mr-2(v-bind='attrs', v-on='on', Lstyle='"height: 24px"')
              TelegramLogo
          div(:style='"background: #f7e9e9"')
            v-list-item(link, href='https://t.me/corionx', target='blank')
              v-list-item-title(:style='"color: #f53a1f; font-weight: 600"')
                | Group
            v-list-item(link, href='https://t.me/CorionX1', target='blank')
              v-list-item-title(:style='"color: #f53a1f; font-weight: 600"')
                | Channel
        a(href='https://twitter.com/CorionPlatform', target='blank', :style='"height: 24px"')
          TwitterLogo
</template>

<script lang="ts">
import Vue from 'vue'
import BinanceLogo from './BinanceLogo.vue'
import TelegramLogo from './TelegramLogo.vue'
import TwitterLogo from './TwitterLogo.vue'
export default Vue.extend({
  props: {
    minimalized: Boolean,
  },
  components: { BinanceLogo, TelegramLogo, TwitterLogo },
})
</script>
