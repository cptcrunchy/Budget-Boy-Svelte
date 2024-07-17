<script>
  import { navigating } from "$app/stores";
  import { onMount } from "svelte";

  import { MAIN_NAV_ID, isSiteNavMenuOpen } from "./MainNav.svelte";

  // Close the site nav menu when navigating
  $: if ($navigating) $isSiteNavMenuOpen = false;

  onMount(() => {
    // Prevent scrolling when site nav menu is open
    const unsubscribe = isSiteNavMenuOpen.subscribe((value) => {
      document.body.style.overflow = value ? "hidden" : "auto";
    });

    // Cleanup function to run when component is destroyed
    return () => {
      unsubscribe();
    };
  });
</script>

<button
  aria-controls={MAIN_NAV_ID}
  aria-expanded={$isSiteNavMenuOpen}
  aria-label="Toggle Main Navigation"
  on:click={() => ($isSiteNavMenuOpen = !$isSiteNavMenuOpen)}
  class="rounded border p-2 sm:hidden"
>
  <div />
  <div />
  <div />
</button>

<style lang="postcss">
  button div {
    @apply h-[0.1875rem] w-7 rounded transition-transform duration-300 ease-in-out;

    &:not(:last-of-type) {
      margin-block-end: 0.375rem;
    }
  }
</style>
