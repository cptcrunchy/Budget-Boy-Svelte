<script lang="ts">
  import { onMount } from "svelte";
  import { themeChange } from "theme-change";

  onMount(() => {
    themeChange(false);
  });
</script>

<input
  type="checkbox"
  class="toggle"
  data-toggle-theme="light,night"
  data-act-class="ACTIVECLASS"
/>
