<script context="module" lang="ts">
  import { writable } from "svelte/store";

  export const MAIN_NAV_ID: string = "main_nav";

  export const isSiteNavMenuOpen = writable(false);
</script>

<script lang="ts">
  import { page } from "$app/stores";
  import type { HTMLAttributes } from "svelte/elements";

  import { mainNavLinks } from "$lib/utils/navLinks";

  let className: HTMLAttributes<HTMLElement>["class"] = undefined;
  export { className as class };

  // static classes
  const staticClasses = "navbar";

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

  $: isUserLoggedIn = $page.data.isUserLoggedIn;
</script>

<nav
  id={MAIN_NAV_ID}
  aria-label="Main Navigation"
  class={[staticClasses, className].join("")}
>
  <ul class="sm:flex gap-5 *:*:w-full hidden sm:gap-2">
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
</nav>
