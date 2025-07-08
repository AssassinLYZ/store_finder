<!-- layouts/default.vue -->
<template>
  <div>
    <LayoutHeader />
    <main>
      <NuxtPage />
    </main>
    <LayoutFooter />
  </div>
</template>

<style scoped>
  main {
    max-width: var(--breakpoint-xl);
    margin: 0 auto;
    padding: 100px 30px;
  }
</style>
