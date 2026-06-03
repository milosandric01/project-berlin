<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #f5f5f5;
}

.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 360px;
}

.auth-card h1 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.auth-card form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.auth-card input {
  padding: 0.625rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
}

.auth-card button {
  padding: 0.625rem;
  background: #111;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.auth-card button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-card .error {
  color: #e53e3e;
  font-size: 0.8rem;
}

.auth-card .link {
  margin-top: 1rem;
  font-size: 0.8rem;
  text-align: center;
  color: #666;
}

.auth-card .link a {
  color: #111;
  font-weight: 600;
}
</style>
