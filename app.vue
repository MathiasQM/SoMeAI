<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <footer>
    <div class="link-bar">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/about">About</NuxtLink>
    </div>
  </footer>
</template>

<style>
footer {
  position: fixed;
  bottom: 24px;
  display: flex;
  justify-content: center;
  align-items: center;

  left: 0;
  right: 0;
  padding: 10px;
  text-align: center;
}

.link-bar {
  display: flex;
  justify-content: center;
  gap: 1rem;

  padding: 0.5rem;
  border-radius: 0.5rem;

  border: 1px solid #ffe6e6;
  box-shadow: 0 0 10px #ffe6e6;
  position: relative;
}
</style>
