<script lang="ts">
  import { page } from "$app/stores";

  import { getFlash } from "sveltekit-flash-message";

  import toast, { Toaster } from "svelte-french-toast";
  import { setupViewTransition } from "sveltekit-view-transition";

  import extend from "just-extend";
  import { MetaTags } from "svelte-meta-tags";

  import "../app.css";

  import SiteMainHeader from "$components/mainHeader/MainHeader.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  const flash = getFlash(page);

  $: if ($flash) {
    toast($flash.message);
  }

  setupViewTransition();

  $: metaTags = extend(true, {}, data.baseMetaTags, $page.data.pageMetaTags);
</script>

<MetaTags {...metaTags} />

<Toaster position={"top-center"} />

<div class="flex flex-col h-svh">
  <SiteMainHeader />

  <main class="container flex-1 p-2 pb-10">
    <slot />
  </main>
  <div class="absolute opacity-20 -z-10">
    <div class="brick-green"></div>
    <div class="brick-black"></div>
  </div>
</div>

<style lang="postcss">
  .brick-green {
    @apply fixed h-80 w-32 bottom-0 right-0;
    background-color: var(--theme-green);
  }
  .brick-black {
    @apply fixed h-52 w-32 bottom-0 right-28 bg-gray-600;
  }
</style>
