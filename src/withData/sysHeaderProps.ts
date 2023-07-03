import SysHeader from '@/components/system/SysHeader.vue'

export default {
  mode: 'horizontal',
  options: [
    { label: '布局', key: '布局' },
    { label: '设置', key: '设置' },
  ],
} as InstanceType<typeof SysHeader>['$props']
