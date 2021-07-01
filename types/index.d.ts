import { providers, BigNumber } from 'ethers'
import { accessorType } from '~/store'
declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessorType
    $niceUtils: {
      removeTrailingZeros(str: string): string
      numstrToBN(input: string, dec: number): BigNumber
      BNToNumstr(bn: BigNumber | string, dec: number, prec: number): string
      fmtDate(seconds: number): string
      fmtDateNumeric(seconds: number): string
      wait(time?: number): Promise<void>
    }
  }
}
declare module 'vuex/types' {
  interface Store<S> {
    $accessor: typeof accessorType
  }
}
declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $accessor: typeof accessorType
  }
}
declare global {
  interface Window {
    web3?: providers.ExternalProvider & providers.Web3Provider
    ethereum?: providers.ExternalProvider & providers.Web3Provider
  }
}
