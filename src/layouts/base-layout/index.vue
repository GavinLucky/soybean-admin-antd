<script setup lang="ts">
import { computed } from 'vue';
import { AdminLayout, LAYOUT_SCROLL_EL_ID } from '@sa/materials';
import type { LayoutMode } from '@sa/materials';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import GlobalHeader from '../modules/global-header/index.vue';
import GlobalSider from '../modules/global-sider/index.vue';
import GlobalTab from '../modules/global-tab/index.vue';
import GlobalContent from '../modules/global-content/index.vue';
import GlobalFooter from '../modules/global-footer/index.vue';
import ThemeDrawer from '../modules/theme-drawer/index.vue';
import { setupMixMenuContext } from '../hooks/use-mix-menu';

defineOptions({
  name: 'BaseLayout'
});

const appStore = useAppStore();
const themeStore = useThemeStore();

const layoutMode = computed(() => {
  const vertical: LayoutMode = 'vertical';
  const horizontal: LayoutMode = 'horizontal';
  return themeStore.layout.mode.includes(vertical) ? vertical : horizontal;
});

const headerPropsConfig: Record<UnionKey.ThemeLayoutMode, App.Global.HeaderProps> = {
  vertical: {
    showLogo: false,
    showMenu: false,
    showMenuToggler: true
  },
  'vertical-mix': {
    showLogo: false,
    showMenu: false,
    showMenuToggler: false
  },
  horizontal: {
    showLogo: true,
    showMenu: true,
    showMenuToggler: false
  },
  'horizontal-mix': {
    showLogo: true,
    showMenu: true,
    showMenuToggler: false
  }
};

const headerProps = computed(() => headerPropsConfig[themeStore.layout.mode]);

const siderVisible = computed(() => themeStore.layout.mode !== 'horizontal');

const isVerticalMix = computed(() => themeStore.layout.mode === 'vertical-mix');

const isHorizontalMix = computed(() => themeStore.layout.mode === 'horizontal-mix');

const siderWidth = computed(() => getSiderWidth());

const siderCollapsedWidth = computed(() => getSiderCollapsedWidth());
const siderDraggerOpenComputed = computed(() => {
  if (isHorizontalMix.value) {
    return false;
  }
  if (isVerticalMix.value) {
    return appStore.mixSiderFixed;
  }
  return true;
});
function getSiderWidth() {
  const { width, mixWidth, mixChildMenuWidth } = themeStore.sider;

  // let w = isVerticalMix.value || isHorizontalMix.value ? mixWidth : width;
  //
  // if (isVerticalMix.value && appStore.mixSiderFixed) {
  //   w += mixChildMenuWidth;
  // }
  let w = isVerticalMix.value || isHorizontalMix.value ? mixWidth : width;
  if (isHorizontalMix.value) {
    w = mixWidth;
  } else if (isVerticalMix.value) {
    // debugger;
    w = mixWidth;
    if (appStore.mixSiderFixed) {
      const tempMixChildMenuWidth = width - mixWidth;
      if (tempMixChildMenuWidth < mixChildMenuWidth) {
        w += mixChildMenuWidth;
      } else {
        w += tempMixChildMenuWidth;
      }
    }
  }
  return w;
}
function onEmits_siderWidthChangedFn(val: number) {
  themeStore.sider.width = val;
}
function getSiderCollapsedWidth() {
  const { width, collapsedWidth, mixCollapsedWidth, mixChildMenuWidth } = themeStore.sider;
  if (appStore.siderCollapse) {
    if (appStore.mixSiderFixed) {
      if (width < mixCollapsedWidth + mixChildMenuWidth) {
        return mixCollapsedWidth + mixChildMenuWidth;
      }
      return width;
    }
    return mixCollapsedWidth;
  }
  let w = isVerticalMix.value || isHorizontalMix.value ? mixCollapsedWidth : collapsedWidth;

  if (isVerticalMix.value && appStore.mixSiderFixed) {
    if (width - mixCollapsedWidth > mixChildMenuWidth) {
      w += width - mixCollapsedWidth;
    } else {
      w += mixChildMenuWidth;
    }
  }

  return w;
}

setupMixMenuContext();
</script>

<template>
  <AdminLayout
    v-model:sider-collapse="appStore.siderCollapse"
    :sider-width="siderWidth"
    :mode="layoutMode"
    :scroll-el-id="LAYOUT_SCROLL_EL_ID"
    :scroll-mode="themeStore.layout.scrollMode"
    :is-mobile="appStore.isMobile"
    :full-content="appStore.fullContent"
    :fixed-top="themeStore.fixedHeaderAndTab"
    :header-height="themeStore.header.height"
    :tab-visible="themeStore.tab.visible"
    :tab-height="themeStore.tab.height"
    :content-class="appStore.contentXScrollable ? 'overflow-x-hidden' : ''"
    :sider-visible="siderVisible"
    :sider-collapsed-width="siderCollapsedWidth"
    :footer-visible="themeStore.footer.visible"
    :fixed-footer="themeStore.footer.fixed"
    :right-footer="themeStore.footer.right"
    :use-sider-drag="siderDraggerOpenComputed"
    @on-emit-sider-width-changed="onEmits_siderWidthChangedFn"
  >
    <template #header>
      <GlobalHeader v-bind="headerProps" />
    </template>
    <template #tab>
      <GlobalTab />
    </template>
    <template #sider>
      <GlobalSider />
    </template>
    <GlobalContent />
    <ThemeDrawer />
    <template #footer>
      <GlobalFooter />
    </template>
  </AdminLayout>
</template>

<style lang="scss">
#__SCROLL_EL_ID__ {
  @include scrollbar();
}
</style>
