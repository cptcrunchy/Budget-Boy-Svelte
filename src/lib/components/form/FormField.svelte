<script lang="ts">
  import Icon from "@iconify/svelte";

  export let value = "";
  export let icon = "";
  export let errorMessage: object | undefined = undefined;
  export let label = "";
</script>

<div class="flex flex-col items-start grow w-full">
  <p class="text-white font-bold tracking-wider uppercase text-sm">
    {label}
  </p>
  <label class="flex flex-col items-start w-full gap-2">
    <div class="input input-bordered flex items-center w-full">
      <Icon {icon} height="24" />
      <input {...$$props} class="grow" bind:value />
    </div>
    {#if errorMessage}
      <p class="text-red-500">{errorMessage}</p>
    {/if}
  </label>
</div>
