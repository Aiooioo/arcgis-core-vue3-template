<template>
  <win-box default-direction="vertical" class="bg-red-500">
    <div class="bg-dark-500">bg-dark-500</div>
    <win-box>
      <div />
      <win-box default-direction="vertical">
        <div />
        <div />
      </win-box>
    </win-box>
    <div class="bg-green-500" />
  </win-box>
</template>

<script setup lang="ts">
definePage({
  name: 'view',
  path: '/view',
})
</script>
