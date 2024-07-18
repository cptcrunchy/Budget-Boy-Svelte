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

<div class="dropdown dropdown-end">
  <button
    tabindex="0"
    type="button"
    aria-controls={MAIN_NAV_ID}
    aria-expanded={$isSiteNavMenuOpen}
    aria-label="Toggle Main Navigation"
    class="rounded border p-2 btn btn-ghost sm:hidden"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h7"
      />
    </svg>
  </button>
  <ul
    tabindex="0"
    class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
  >
    <li><a>Homepage</a></li>
    <li><a>Portfolio</a></li>
    <li><a>About</a></li>
  </ul>
</div>
