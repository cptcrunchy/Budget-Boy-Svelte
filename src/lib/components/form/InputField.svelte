<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  import type { EnterKeyHintType } from "$lib/types/index";

  const className: HTMLInputAttributes["class"] = undefined;
  export { className as class };
  export let type: HTMLInputAttributes["type"];
  export const value: string | null | undefined = "";
  export const name: string = "";
  export const label: string = "";
  export const placeholder: string = "";
  export const spellcheck: boolean = true;
  export const autocomplete: string = "on";
  export const enterkeyhint: EnterKeyHintType = "next";
  export const maxlength: number | undefined = undefined;
  export const errorMessage: object | undefined = undefined;

  $: valueLength = value?.length;
</script>

<label
  class="grid gap-1 text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
>
  <div>
    <span>{label}</span>

    {#if maxlength}
      <span class="text-xs text-muted-foreground">
        {valueLength}/{maxlength}
      </span>
    {/if}
  </div>

  {#if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {/if}

  <input
    {name}
    {...{ type }}
    dir="auto"
    bind:value
    {maxlength}
    {spellcheck}
    {placeholder}
    {autocomplete}
    {enterkeyhint}
    aria-label={label}
    class="rounded border bg-transparent px-3 py-2"
    aria-invalid={errorMessage ? "true" : undefined}
    {...$$restProps}
  />
</label>
