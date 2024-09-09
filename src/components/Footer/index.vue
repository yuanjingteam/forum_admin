<template>
  <footer class="footer">
    <slot>这是方腾飞的</slot>
  </footer>
</template>

<style lang="less" scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-size: @size-mini;
  color: var(--color-text-2);
  text-align: center;
}
</style>
