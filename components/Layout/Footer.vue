<template>
  <footer class="footer">
    <p>
      {{ $t('footer.copyright') }}
    </p>
  </footer>
</template>
<style lang="scss" scoped>
  .footer {
    background-color: var(--color-dark);
    height: 4rem;
    p {
      color: var(--color-white);
      text-align: center;
      line-height: 4rem;
    }
  }
</style>
