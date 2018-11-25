import Vuetify from '../../../../node_modules/vuetify/es5/components/Vuetify'
import VApp from '../../../../node_modules/vuetify/es5/components/VApp'
import VGrid from '../../../../node_modules/vuetify/es5/components/VGrid'
import VFooter from '../../../../node_modules/vuetify/es5/components/VFooter'
import VToolBar from '../../../../node_modules/vuetify/es5/components/VToolBar'
import VNavDrawer from '../../../../node_modules/vuetify/es5/components/VNavigationDrawer'
import VTabs from '../../../../node_modules/vuetify/es5/components/VTabs'
import VMenu from '../../../../node_modules/vuetify/es5/components/VMenu'
import VList from '../../../../node_modules/vuetify/es5/components/VList'
import VPagination from '../../../../node_modules/vuetify/es5/components/VPagination'
import VSubheader from '../../../../node_modules/vuetify/es5/components/VSubheader'
import VParallax from '../../../../node_modules/vuetify/es5/components/VParallax'
import VBtn from '../../../../node_modules/vuetify/es5/components/VBtn'
import VCard from '../../../../node_modules/vuetify/es5/components/VCard'
import VAvatar from '../../../../node_modules/vuetify/es5/components/VAvatar'
import VChip from '../../../../node_modules/vuetify/es5/components/VChip'
import VDivider from '../../../../node_modules/vuetify/es5/components/VDivider'
import VSnackbar from '../../../../node_modules/vuetify/es5/components/VSnackbar'
import VProgressLinear from '../../../../node_modules/vuetify/es5/components/VProgressLinear'
import * as directives from '../../../../node_modules/vuetify/es5/directives'

const install = (Vue, theme) => {
  Vue.use(Vuetify, {
    components: {
      VApp,
      VGrid,
      VFooter,
      VToolBar,
      VNavDrawer,
      VTabs,
      VMenu,
      VList,
      VPagination,
      VSubheader,
      VParallax,
      VBtn,
      VCard,
      VAvatar,
      VChip,
      VDivider,
      VSnackbar,
      VProgressLinear
    },
    directives,
    theme: theme.colors
    // options: {
    // }
  })
}

export default { install }
