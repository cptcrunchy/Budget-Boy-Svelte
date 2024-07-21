<script context="module" lang="ts">
  import { writable } from "svelte/store";
  export const MAIN_NAV_ID: string = "main_nav";
  export const isSiteNavMenuOpen = writable(false);
</script>

<script>
  import { route } from "$lib/ROUTES";
  import { page } from "$app/stores";

  import { mainNavLinks } from "$lib/utils/navLinks";
  import MainNavMenuToggleBtn from "./MainNavMenuToggleBtn.svelte";
  import ThemeToggler from "./ThemeToggler.svelte";

  export let user;

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

<header class="relative mb-10 border-b">
  <div class="flex items-center justify-between p-2">
    <div class="avatar">
      <a href={route("/")} class="w-24">
        <img src="/assets/logo.svg" alt="Budget Boy" />
      </a>
    </div>
    <div class="flex gap-2">
      <nav id={MAIN_NAV_ID} aria-label="Main Navigation" class="navbar">
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
          {#if isUserLoggedIn}
            <li>
              <form action={route("default /dashboard")} method="post">
                <button type="submit" class="btn btn-outline">Logout</button>
              </form>
            </li>
          {/if}
        </ul>
        <div role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img alt={user.name} src={user.avatar_url} />
          </div>
        </div>
      </nav>
      <ThemeToggler />
      <MainNavMenuToggleBtn />
    </div>
  </div>
</header>
