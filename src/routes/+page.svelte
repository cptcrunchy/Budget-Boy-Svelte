<script lang="ts">
  import toast from "svelte-french-toast";
</script>

<h1 class="text-2xl font-bold">Home page</h1>

<button class="btn" on:click={() => toast("Hello world!")}>Show toast</button>
