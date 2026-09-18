import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "../stores/authStore"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: "/dashboard/payment-methods"
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../pages/LoginPage.vue"),
      meta: { requiresGuest: true }
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../layouts/MainLayout.vue"),
      meta: { requiresAuth: true },
      children: [
        {
          path: "payment-methods",
          name: "payment-methods",
          component: () => import("../pages/PaymentMethodsPage.vue")
        }
      ]
    }
  ]
})

// Navigation Guards
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated()

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "login" })
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: "payment-methods" })
  } else {
    next()
  }
})

export default router
