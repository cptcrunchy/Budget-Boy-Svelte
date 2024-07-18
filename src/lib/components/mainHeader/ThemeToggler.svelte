<script lang="ts">
  import { onMount } from "svelte";
  import { themeChange } from "theme-change";
  import Icon from "@iconify/svelte";

  onMount(() => {
    themeChange(false);
  });
</script>

<label class="swap swap-rotate">
  <input
    type="checkbox"
    data-toggle-theme="light,night"
    data-act-class="ACTIVECLASS"
  />
  <Icon icon="ph:moon" class="swap-off" height="30" />
  <Icon icon="ph:sun-fill" class="swap-on" height="30" />
</label>
