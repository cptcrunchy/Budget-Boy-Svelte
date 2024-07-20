<script>
  import { route } from "$lib/ROUTES";

  import MainNav from "./MainNav.svelte";
  import MainNavMenuToggleBtn from "./MainNavMenuToggleBtn.svelte";
  import ThemeToggler from "./ThemeToggler.svelte";
</script>

<header class="relative mb-10 border-b">
  <div class="flex items-center justify-between p-2">
    <div class="avatar">
      <a href={route("/")} class="w-24">
        <img src="/assets/logo.svg" alt="Budget Boy" />
      </a>
    </div>
    <div class="flex gap-2">
      <MainNav />
      <ThemeToggler />
      <MainNavMenuToggleBtn />
    </div>
  </div>
</header>
