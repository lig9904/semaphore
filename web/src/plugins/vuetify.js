import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import en from 'vuetify/lib/locale/en';
import zhHans from 'vuetify/lib/locale/zh-Hans';
import zhHant from 'vuetify/lib/locale/zh-Hant';
import OpenTofuIcon from '@/components/OpenTofuIcon.vue';
import PulumiIcon from '@/components/PulumiIcon.vue';
import TerragruntIcon from '@/components/TerragruntIcon.vue';
import HashicorpVaultIcon from '@/components/HashicorpVaultIcon.vue';
import OpenBaoIcon from '@/components/OpenBaoIcon.vue';
import DvlsIcon from '../components/DvlsIcon.vue';
import AwsSmIcon from '../components/AwsSmIcon.vue';
import AzureKvIcon from '../components/AzureKvIcon.vue';
import i18n from './i18';

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { en, zh_cn: zhHans, zh_tw: zhHant },
    current: ['zh_cn', 'zh_tw'].includes(i18n.locale) ? i18n.locale : 'en',
  },
  icons: {
    values: {
      tofu: {
        component: OpenTofuIcon,
      },
      pulumi: {
        component: PulumiIcon,
      },
      terragrunt: {
        component: TerragruntIcon,
      },
      hashicorp_vault: {
        component: HashicorpVaultIcon,
      },
      openbao: {
        component: OpenBaoIcon,
      },
      dvls: {
        component: DvlsIcon,
      },
      aws_sm: {
        component: AwsSmIcon,
      },
      azure_kv: {
        component: AzureKvIcon,
      },
    },
  },
});
