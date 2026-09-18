import { createApp } from "vue"
import { createPinia } from "pinia"
import { Quasar, Notify, Dialog, Loading } from "quasar"
import quasarLang from "quasar/lang/es"

// Import Quasar css
import "@quasar/extras/material-icons/material-icons.css"
import "quasar/src/css/index.sass"

// Custom styles
import "./assets/styles/main.scss"

import App from "./App.vue"
import router from "./router"

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(Quasar, {
  lang: quasarLang,
  plugins: {
    Notify,
    Dialog,
    Loading
  },
  config: {
    notify: {
      position: "top",
      timeout: 2500,
      textColor: "white"
    }
  }
})

app.mount("#app")
