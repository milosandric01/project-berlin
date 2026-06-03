export default defineNuxtRouteMiddleware(async (to) => {
  const { data } = await useFetch('/api/auth/user')
  if (data.value?.user) {
    return navigateTo('/')
  }
})
