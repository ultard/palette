<template>
  <div id="app">
    <nav class="main-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <h1>🎨 Palette Generator</h1>
        </div>
        <div class="nav-links">
          <router-link to="/" class="nav-link">Генератор</router-link>
          <router-link to="/advanced" class="nav-link">Продвинутый</router-link>
          <router-link to="/library" class="nav-link">Библиотека</router-link>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
// App component with routing
</script>

<style>
#app {
  min-height: 100vh;
  background: #f5f5f5;
}

.main-nav {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #667eea;
  background: #f0f0f0;
}

.nav-link.router-link-active {
  color: #667eea;
  background: #f0f0f0;
}

.main-content {
  min-height: calc(100vh - 80px);
}
</style>
