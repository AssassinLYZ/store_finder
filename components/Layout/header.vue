<template>
  <header class="header">
    <nav>
      <div class="header__nav_left">
        <img src="/images/jumbo.svg" alt="Jumbo Logo" class="logo" @click="goHome" />
      </div>
      <div class="header__nav_right">
        <LayoutLanguageSwitcher />
      </div>
    </nav>
  </header>
</template>
<script setup>
  const router = useRouter();

  const goHome = () => {
    router.push('/');
  };
</script>
<style lang="scss" scoped>
  .header {
    position: fixed;
    height: 100px;
    width: 100%;
    display: flex;
    align-items: center;
    background: white;
    z-index: var(--z-sticky);
    border-bottom: 1px solid var(--color-gray-300);
  }

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: var(--breakpoint-xl);
    margin: 0 auto;
    padding: 1rem;
  }

  .header__nav_left,
  .header__nav_right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logo {
    cursor: pointer;
    height: 28px;
  }
</style>
