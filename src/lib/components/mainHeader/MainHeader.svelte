<script>
  import { route } from "$lib/ROUTES";

  import MainNav from "./MainNav.svelte";
  import MainNavMenuToggleBtn from "./MainNavMenuToggleBtn.svelte";
  import ThemeToggler from "./ThemeToggler.svelte";
</script>

<header class="relative mb-10 border-b">
  <div class="container flex items-center justify-between p-2">
    <a role="button" href={route("/")} class="btn"> Budget Boy </a>

    <div class="flex gap-2">
      <MainNav />
      <ThemeToggler />
      <MainNavMenuToggleBtn />
    </div>
  </div>
</header>
