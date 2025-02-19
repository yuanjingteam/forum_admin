<script setup>
const columns = [];
const managerData = ref([]);
</script>

<template>
  <div>
    <a-table :columns="columns" :data="managerData" />
  </div>
</template>

<style></style>
