<script>
  import { route } from "$lib/ROUTES";
</script>

<div class="home-container">
  <div
    class="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-12 p-10"
  >
    <div class="flex justify-center flex-col">
      <h1
        class="font-bold font-[Roboto] text-7xl text-pretty uppercase theme-green"
      >
        Keep track <br />of your finances
      </h1>
      <div class="my-4 text-pretty text-md font-semibold tracking-wide">
        Budget Boy is your online tool for keeping track of all of your expenses
        so that way you never miss a payment or go under budget.
        <br />
        <br />
        With the <span class="text-sm text-[--theme-green]">custom</span> built-in
        calculator, the process is seemless!
      </div>
      <a
        role="button"
        class="btn btn-action bg-[--theme-green] text-white w-52 text-lg uppercase border-none"
        href={route("/auth/register")}
      >
        Get Started
      </a>
    </div>
    <img src="assets/girl-counting.svg" alt="girl-counting" class="max-w-80" />
  </div>
  <footer class="footer footer-center bg-transparent text-base-content p-4">
    <aside>
      <p>
        Copyright © {new Date().getFullYear()} - All right reserved by Budget Boy
      </p>
      <p>
        Website By: <span class="text-[--theme-green]">Chubby Designs</span>
      </p>
    </aside>
  </footer>
</div>

<style lang="postcss">
  .btn-action {
    box-shadow: 10px 10px var(--theme-gray);
  }
  .home-container {
    @apply flex flex-col w-full h-full justify-between;
  }
</style>
