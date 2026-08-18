import Vuetify from 'vuetify/es5/components/Vuetify'
import VApp from 'vuetify/es5/components/VApp'
import VGrid from 'vuetify/es5/components/VGrid'
import VFooter from 'vuetify/es5/components/VFooter'
import VToolBar from 'vuetify/es5/components/VToolbar'
import VNavDrawer from 'vuetify/es5/components/VNavigationDrawer'
import VMenu from 'vuetify/es5/components/VMenu'
import VList from 'vuetify/es5/components/VList'
import VPagination from 'vuetify/es5/components/VPagination'
import VBtn from 'vuetify/es5/components/VBtn'
import VCard from 'vuetify/es5/components/VCard'
import VChip from 'vuetify/es5/components/VChip'
import VDivider from 'vuetify/es5/components/VDivider'
import VProgressLinear from 'vuetify/es5/components/VProgressLinear'
import Ripple from 'vuetify/es5/directives/ripple'
import Scroll from 'vuetify/es5/directives/scroll'

const install = (Vue, theme) => {
  Vue.use(Vuetify, {
    components: {
      VApp,
      VGrid,
      VFooter,
      VToolBar,
      VNavDrawer,
      VMenu,
      VList,
      VPagination,
      VBtn,
      VCard,
      VChip,
      VDivider,
      VProgressLinear
    },
    directives: { Ripple, Scroll },
    theme: theme.colors
    // options: {
    // }
  })
}

export default { install }
