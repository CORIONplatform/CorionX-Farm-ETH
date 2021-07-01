import { BigNumber, Contract, providers } from 'ethers'
import { getAccessorType, mutationTree, actionTree, getterTree } from 'typed-vuex'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Token from '~/abis/Token.json'
import LPFarmAbi from '~/abis/Farming.json'
import CoinGecko from 'coingecko-api'

export type InfoBundleType = {
  pp: { LPTKN: string; start: number; finish: number; B: BigNumber; M: BigNumber }[]
  ss: { started: number; amount: BigNumber; debt: BigNumber }[]
  all: BigNumber[]
  bal: BigNumber[]
  kk: BigNumber
}
export type IBT = {
  LPTKN: string
  start: number
  finish: number
  B: BigNumber
  M: BigNumber
  started: number
  amount: BigNumber
  debt: BigNumber
  all: BigNumber
  bal: BigNumber
}
export type IBTArray = IBT[]
export type IBTD = {
  LPTKN: string
  start: number
  finish: number
  B: BigNumber
  M: BigNumber
}
export type IBTDArray = IBTD[]
export type CGInfoType = { mcap: number; tsup: number; csup: number; price: number }
export type ContractInfoType = {
  infoBundle: IBTArray
  tknBalance: BigNumber
  corx_info: CGInfoType
}
export type LoadingKeyType = 'provider' | 'infoBundle'

const infuraKey = '958c04784f1942ef95aa36a1a469fdc7'
const address_TKNE = '0x297c05f0de271380898c539899d6d93185f84a1b'
const address_LPFARM = '0x51E42aDA0CC58493bE76DF7bc529dDAD951422FC'
const _providerE = new providers.InfuraProvider(4, infuraKey)
const LPFARM = new Contract(address_LPFARM, LPFarmAbi, _providerE)
const TKNE = new Contract(address_TKNE, Token.abi, _providerE)

const CoinGeckoClient = new CoinGecko()
async function getCORXPrice() {
  try {
    const res = await (CoinGeckoClient.coins as any).fetch('corionx')
    const mcap: number = res.data.market_data.market_cap.usd
    const tsup: number = res.data.market_data.total_supply
    const csup: number = res.data.market_data.circulating_supply
    const price: number = res.data.market_data.current_price.usd
    return { mcap, tsup, csup, price }
  } catch (error) {
    throw new Error(`Could not get CORX Coingecko data: ${error.message}`)
  }
}
export const state = () => ({
  time: 0,
  provider: null as (() => providers.Web3Provider) | null,
  signer: null as (() => providers.JsonRpcSigner) | null,
  wallet: null as string | null,
  providerType: 'N' as 'N' | 'W' | 'M',
  infoBundle: null as IBTArray | null,
  tknBalance: null as BigNumber | null,
  corx_info: null as CGInfoType | null,
  chainId: null as number | null,
  loading: {
    provider: false,
    infoBundle: false,
  } as { [key in LoadingKeyType]: boolean },
  dialog: false,
  errorMessage_misc: null as string | null,
  snackbar_tx_url: null as string | null,
  snackbar_rec_url: null as string | null,
  snackbar_fail_url: null as string | null,
})

export type RootState = ReturnType<typeof state>

export const mutations = mutationTree(state, {
  UPDATE_TIME(state) {
    state.time = Math.trunc(Date.now() / 1000)
  },
  SET_PROVIDER(state, provider: providers.Web3Provider | null) {
    if (provider === null) state.provider = null
    else state.provider = () => provider
  },
  SET_SIGNER(state, signer: providers.JsonRpcSigner | null) {
    if (signer === null) state.provider = null
    else state.signer = () => signer
  },
  SET_WALLET(state, { wallet }: { wallet: string | null }) {
    state.wallet = wallet
  },
  SET_PTYPE(state, { providerType }: { providerType: 'N' | 'W' | 'M' }) {
    state.providerType = providerType
  },
  SET_INFO_BUNDLE(state, { infoBundle }: { infoBundle: IBTArray }) {
    state.infoBundle = infoBundle
  },
  SET_TKN_BALANCE(state, { tknBalance }: { tknBalance: BigNumber }) {
    state.tknBalance = tknBalance
  },
  SET_CORX_INFO(state, { corx_info }: { corx_info: CGInfoType }) {
    state.corx_info = corx_info
  },
  SET_CHAIN_ID(state, { chainId }: { chainId: number | null }) {
    state.chainId = chainId
  },
  SET_LOADING(state, { key, value }: { key: LoadingKeyType; value: boolean }) {
    state.loading[key] = value
  },
  SET_DIALOG(state, value: boolean) {
    state.dialog = value
  },
  SET_ERROR_MISC(state, value: string | null) {
    state.errorMessage_misc = value
  },
  SET_SNACK_TX(state, value: string | null) {
    state.snackbar_tx_url = value
  },
  SET_SNACK_REC(state, value: string | null) {
    state.snackbar_rec_url = value
  },
  SET_SNACK_FAIL(state, value: string | null) {
    state.snackbar_fail_url = value
  },
  RESET(state) {
    state.provider = null
    state.wallet = null
    state.providerType = 'N'
    state.infoBundle = null
    state.tknBalance = null
    state.corx_info = null
    state.chainId = null
    state.loading = {
      provider: false,
      infoBundle: false,
    }
    state.dialog = false
    state.errorMessage_misc = null
    state.snackbar_tx_url = null
    state.snackbar_rec_url = null
    state.snackbar_fail_url = null
  },
  RESET_SNACKS(state) {
    state.snackbar_tx_url = null
    state.snackbar_rec_url = null
    state.snackbar_fail_url = null
  },
})

export const getters = getterTree(state, {
  shortWallet(state): string {
    return state.wallet ? state.wallet.substr(0, 6) + '...' + state.wallet.substr(-4) : ''
  },
  contractInfo(state): ContractInfoType | null {
    if (!(state.infoBundle && state.tknBalance && state.corx_info)) return null
    return { infoBundle: state.infoBundle, tknBalance: state.tknBalance, corx_info: state.corx_info }
  },
  // MESSAGES
  loadingMessage(state): string {
    return state.loading.provider ? 'Connecting provider...' : state.loading.infoBundle ? 'Loading info from network...' : ''
  },
  err_chainId(state): boolean | null {
    if (!state.chainId) return null
    return state.chainId !== 4
  },
  errorMessage(state, getters): string {
    return getters.err_chainId
      ? `You selected wrong network. Select Ethereum Mainnet in your provider${state.providerType === 'M' ? '' : ' and refresh the page'}`
      : state.errorMessage_misc || ''
  },
  // TECHNICAL OK
  allSafe(state, getters): boolean {
    return !!state.wallet && !!state.infoBundle && !getters.errorMessage && !state.loading.provider && !state.loading.infoBundle
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async ADMIN_CANNON() {},
    getCORXPrice,
    async loadCORXInfo({ commit }) {
      const corx_info = await getCORXPrice()
      commit('SET_CORX_INFO', { corx_info })
    },
    async connectMetamask({ state, commit }) {
      if (state.providerType === 'W') commit('RESET')
      if (!window.ethereum) throw new Error('Please set up MetaMask properly')
      await (window.ethereum as any).enable()
      const provider = new providers.Web3Provider(window.ethereum)
      commit('SET_PROVIDER', provider)
      const signer = provider.getSigner()
      commit('SET_SIGNER', signer)
      const wallet = await signer.getAddress()
      commit('SET_WALLET', { wallet })
      await this.$accessor.updateChainId()
      await this.$accessor.loadContractInfo()
      commit('SET_PTYPE', { providerType: 'M' })
    },
    async connectWalletconnect({ state, commit }) {
      if (state.providerType === 'M') commit('RESET')
      const wc = new WalletConnectProvider({ infuraId: infuraKey, qrcode: true })
      await wc.enable()
      const provider = new providers.Web3Provider(wc)
      commit('SET_PROVIDER', provider)
      const signer = provider.getSigner()
      commit('SET_SIGNER', signer)
      wc.on('close', (code: number, reason: string) => {
        console.log({ code, reason })
        if (state.providerType === 'W') commit('RESET')
      })
      const wallet = await signer.getAddress()
      commit('SET_WALLET', { wallet })
      await this.$accessor.updateChainId()
      await this.$accessor.loadContractInfo()
      commit('SET_PTYPE', { providerType: 'W' })
    },
    async updateChainId({ state, commit }) {
      commit('SET_CHAIN_ID', { chainId: (await state.provider?.().getNetwork())?.chainId || null })
    },
    async loadDefaultInfo({ commit }) {
      const ibn = (await LPFARM.infoBundle('0x0000000000000000000000000000000000000000')).pp as IBTDArray
      const infoBundle = ibn.map((p) => ({
        ...p,
        started: 0,
        amount: BigNumber.from(0),
        debt: BigNumber.from(0),
        all: BigNumber.from(0),
        bal: BigNumber.from(0),
      })) as IBTArray
      commit('SET_INFO_BUNDLE', { infoBundle })
      console.log('default info:')
      console.log(ibn)
    },
    async loadContractInfo({ state, commit }, p?: { wallet: string }) {
      const w = p?.wallet || state.wallet
      const [tknBalance, ibn]: [BigNumber, InfoBundleType] = await Promise.all([TKNE.balanceOf(w), LPFARM.infoBundle(w)])
      const infoBundle = ibn.pp.map((p, i) => ({
        ...p,
        ...ibn.ss[i],
        all: ibn.all[i],
        bal: ibn.bal[i],
      })) as IBTArray
      commit('SET_TKN_BALANCE', { tknBalance })
      commit('SET_INFO_BUNDLE', { infoBundle })
      console.log('real info:')
      console.log(infoBundle)
    },
    async send_approve({ state }, { pid }: { pid: number }): Promise<providers.TransactionResponse> {
      const LPTKN = new Contract(state.infoBundle![pid].LPTKN, Token.abi, state.provider?.().getSigner())
      return await LPTKN.approve(address_LPFARM, BigNumber.from('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'))
    },
    async send_stake({ state }, { pid, amount }: { pid: number; amount: BigNumber }): Promise<providers.TransactionResponse> {
      if (!state.signer) throw new Error('Signer not connected')
      const LPFARM = new Contract(address_LPFARM, LPFarmAbi, state.signer())
      return await LPFARM.stake(`${pid}`, amount)
    },
    async send_harvest({ state }, { pid }: { pid: number }): Promise<providers.TransactionResponse> {
      if (!state.signer) throw new Error('Signer not connected')
      const LPFARM = new Contract(address_LPFARM, LPFarmAbi, state.signer())
      return await LPFARM.harvest(`${pid}`)
    },
    async send_increase({ state }, { pid, amount }: { pid: number; amount: BigNumber }): Promise<providers.TransactionResponse> {
      if (!state.signer) throw new Error('Signer not connected')
      const LPFARM = new Contract(address_LPFARM, LPFarmAbi, state.signer())
      return await LPFARM.increase(`${pid}`, amount)
    },
    async send_decrease({ state }, { pid, amount }: { pid: number; amount: BigNumber }): Promise<providers.TransactionResponse> {
      if (!state.signer) throw new Error('Signer not connected')
      const LPFARM = new Contract(address_LPFARM, LPFarmAbi, state.signer())
      return await LPFARM.decrease(`${pid}`, amount)
    },
    async send_unstake({ state }, { pid }: { pid: number }): Promise<providers.TransactionResponse> {
      if (!state.signer) throw new Error('Signer not connected')
      const LPFARM = new Contract(address_LPFARM, LPFarmAbi, state.signer())
      return await LPFARM.unstake(`${pid}`)
    },
    async send_harvestAll({ state }): Promise<providers.TransactionResponse> {
      if (!state.signer) throw new Error('Signer not connected')
      const LPFARM = new Contract(address_LPFARM, LPFarmAbi, state.signer())
      return await LPFARM.harvestAll()
    },
  }
)

export const accessorType = getAccessorType({
  actions,
  getters,
  mutations,
  state,
})
