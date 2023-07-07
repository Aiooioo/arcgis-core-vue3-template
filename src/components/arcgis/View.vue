<script setup lang="ts">
import { useView } from './hooks'

const { deps } = $defineProps<{
  properties?: arcgis.ViewProperties
  deps?: unknown[] | Record<string, unknown>
}>()
defineEmits<{
  when: [view: arcgis.View]
}>()

const view = $(useView())
</script>
