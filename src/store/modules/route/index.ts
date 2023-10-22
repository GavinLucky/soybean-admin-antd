import { ref } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import { useBoolean } from '@sa/hooks';
import { SetupStoreId } from '@/enum';
import { router } from '@/router';
import { createRoutes } from '@/router/routes';

export const useRouteStore = defineStore(SetupStoreId.Route, () => {
  const { bool: isInitAuthRoute, setBool: setIsInitAuthRoute } = useBoolean();

  /**
   * auth route mode
   * @description it recommends to use static mode in the development environment, and use dynamic mode in the production environment,
   * if use static mode in development environment, the auth routes will be auto generated by plugin "@elegant-router/vue"
   */
  const authRouteMode = ref(import.meta.env.VITE_AUTH_ROUTE_MODE);

  /**
   * home route key
   */
  const routeHome = ref(import.meta.env.VITE_ROUTE_HOME);

  /**
   * global menus
   */
  // const menus = ref<App.Global.Menu[]>([]);

  async function initAuthRoute() {
    if (authRouteMode.value === 'static') {
      await initStaticAuthRoute();
    } else {
      await initDynamicAuthRoute();
    }
  }

  /**
   * init static auth route
   */
  async function initStaticAuthRoute() {
    const { authVueRoutes } = createRoutes();
    handleVueRoutes(authVueRoutes);
  }

  /**
   * init dynamic auth route
   */
  async function initDynamicAuthRoute() {
    //
  }

  function handleVueRoutes(routes: RouteRecordRaw[]) {
    addRoutesToVueRouter(routes);
  }

  function addRoutesToVueRouter(routes: RouteRecordRaw[]) {
    routes.forEach(route => {
      router.addRoute(route);
    });
  }

  return {
    routeHome,
    initAuthRoute,
    isInitAuthRoute,
    setIsInitAuthRoute
  };
});
