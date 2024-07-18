<script lang="ts">
  import Icon from "@iconify/svelte";

  export let value = "";
  export let icon = "";
  export let errorMessage: object | undefined = undefined;
  export let labelName = "";
</script>

<div class="flex flex-col items-start grow w-full">
  <p class="text-white font-bold tracking-wider uppercase text-sm">
    {labelName}
  </p>
  <label class="input input-bordered flex items-center w-full gap-2">
    <Icon {icon} height="24" />
    <input {...$$props} class="grow" bind:value />
    {#if errorMessage}
      <p class="text-red-500">{errorMessage}</p>
    {/if}
  </label>
</div>
