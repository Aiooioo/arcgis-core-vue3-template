import { ExtractPublicPropTypes } from 'vue'
import SysHeader from '@/components/system/SysHeader.vue'

export default {
  mode: 'horizontal',
  options: [
    { label: '布局', key: '布局' },
    { label: '设置', key: '设置' },
  ],
} satisfies ExtractPublicPropTypes<InstanceType<typeof SysHeader>['$props']>
