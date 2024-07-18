<script>
  import { route } from "$lib/ROUTES";
  import Icon from "@iconify/svelte";
</script>

<div class="flex flex-wrap gap-4 w-full">
  <a
    role="button"
    class="btn grow gap-2 font-bold"
    href={route("GET /auth/oauth/google")}
  >
    <Icon icon="mdi:google" width="25" />
    <span>Google</span>
  </a>

  <a
    role="button"
    class="btn grow gap-2 font-bold"
    href={route("GET /auth/oauth/github")}
  >
    <Icon icon="mdi:github" width="25" />
    <span>Github</span>
  </a>
</div>
