export default {
  ssr: false,
  target: 'static',
  server: {
    host: '0.0.0.0',
  },
  head: {
    titleTemplate: '%s',
    title: 'CorionX LP Farm',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Kanit:300,400,500,600,700' },
      { rel: 'icon', type: 'image/x-icon', href: '/corxlogo.png' },
    ],
  },
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify', 'nuxt-typed-vuex'],
  build: {
    transpile: [/typed-vuex/],
  },
  plugins: ['~/plugins/niceUtils.ts'],
  vuetify: {
    theme: {
      themes: {
        light: {
          primary: '#f53a1f',
          corxorange: '#f53a1f',
          secondary: '#503fa1',
          corxviolet: '#503fa1',
          warning: '#FF7629',
          error: '#EA202D',
          success: '#45CA72',
          corxskin: '#f7e9e9',
        },
      },
    },
  },
}
