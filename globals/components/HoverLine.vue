<template>
  <div
    class="drag-none hover-line"
    :class="{
      'hover-line-hover': hoverable,
      'hover-line-horizontal': direction === 'horizontal',
      'hover-line-vertical': direction === 'vertical',
    }"
    :style="style"
  />
</template>

<script setup lang="ts">
import { useCurrentElement } from '@vueuse/core'
import { useThemeVars } from 'naive-ui'
import { CSSProperties } from 'vue'
import { useDragEvent } from '../hooks'
import { useDragEventOptions } from '../hooks/useDragEvent'

const themeVars = useThemeVars()

const {
  direction = 'none',
  hoverable = true,
  thickness = '5px',
  useDrag = true,
  style = {},
} = $defineProps<{
  direction?: 'horizontal' | 'vertical' | 'none'
  hoverable?: boolean
  thickness?: string
  useDrag?: boolean | useDragEventOptions
  style?: CSSProperties
}>()
const el = useCurrentElement<HTMLElement>()

const $emit = defineEmits<{
  drag: [
    val: Parameters<Parameters<ReturnType<typeof useDragEvent>['onDrag']>[0]>[0]
  ]
}>()

if (useDrag) {
  const dragOptions = typeof useDrag === 'object' ? useDrag : {}
  let dragEvent: ReturnType<typeof useDragEvent>
  watch(
    $$(style),
    () => {
      nextTick(() => {
        dragEvent?.cleanup()
        dragEvent = useDragEvent(el, dragOptions)
        dragEvent.onDrag((...r) => $emit('drag', ...r))
      })
    },
    {
      immediate: true,
    }
  )
}
</script>

<style>
.hover-line {
  flex: none;
  background-color: v-bind('themeVars.dividerColor');
}

.hover-line-hover:hover,
.hover-line-hover:active {
  background-color: v-bind('themeVars.primaryColorHover');
}

.hover-line-horizontal {
  width: 100%;
  height: v-bind(thickness);
}

.hover-line-vertical {
  width: v-bind(thickness);
  height: 100%;
}
</style>
