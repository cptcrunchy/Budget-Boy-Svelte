<script>
  import { route } from "$lib/ROUTES";
</script>

<div class="flex flex-wrap gap-4">
  <a
    role="button"
    class="flex-grow gap-2 font-bold"
    href={route("GET /auth/oauth/google")}
  >
    <iconify-icon icon="mdi:google" width="25"></iconify-icon>
    <span>Google</span>
  </a>

  <a
    role="button"
    class="flex-grow gap-2 font-bold"
    href={route("GET /auth/oauth/github")}
  >
    <iconify-icon icon="mdi:github" width="25"></iconify-icon>
    <span>Github</span>
  </a>
</div>
