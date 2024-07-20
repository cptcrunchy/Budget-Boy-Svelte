<script>
  import { navigating, page } from "$app/stores";
  import { onMount } from "svelte";

  import { MAIN_NAV_ID, isSiteNavMenuOpen } from "./MainNav.svelte";
  import { mainNavLinks } from "$lib/utils/navLinks";

  // Close the site nav menu when navigating
  $: if ($navigating) $isSiteNavMenuOpen = false;

  const sessionLinks = {
    home: mainNavLinks.home,
    dashboard: mainNavLinks.dashboard,
  };

  const noneSessionLinks = {
    home: mainNavLinks.home,
    about: mainNavLinks.about,
    login: mainNavLinks.login,
    register: mainNavLinks.register,
  };

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
  $: isUserLoggedIn = $page.data.isUserLoggedIn;
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
    class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
  >
    {#each Object.values(isUserLoggedIn ? sessionLinks : noneSessionLinks) as link}
      {@const isCurrentPage =
        $page.url.pathname === link.href ? "page" : undefined}

      <li>
        <a
          href={link.href}
          aria-label={link.ariaLabel}
          aria-current={isCurrentPage}
          class="btn btn-outline"
        >
          {link.title}
        </a>
      </li>
    {/each}
  </ul>
</div>
