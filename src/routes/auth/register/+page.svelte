<script lang="ts">
  import type { PageData } from "./$types";
  import toast from "svelte-french-toast";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { route } from "$lib/ROUTES";
  import {
    MAX_EMAIL_LENGTH,
    MAX_NAME_LENGTH,
    MAX_PASSWORD_LENGTH,
    RegisterUserZodSchema,
  } from "$validations/authSchemas";
  import OrContinueWithDivider from "$components/OrContinueWithDivider.svelte";
  import FormField from "$components/form/FormField.svelte";
  import InputField from "$components/form/InputField.svelte";
  import OAuthButtonLinks from "$components/OAuthButtonLinks.svelte";
  import Icon from "@iconify/svelte";
  import { assets } from "$app/paths";

  export let data: PageData;

  const { enhance, errors, form, message } = superForm(
    data.registerUserFormData,
    {
      resetForm: true,
      taintedMessage: null,
      validators: zodClient(RegisterUserZodSchema),

      onUpdated: () => {
        if (!$message) return;

        const { alertType, alertText } = $message;

        if (alertType === "success") {
          toast.success(alertText);
        }

        if (alertType === "error") {
          toast.error(alertText);
        }
      },
    },
  );
</script>

<div class="w-full flex flex-col items-center">
  <div class="card w-96 relative mt-14">
    <h2
      class="-top-[52px] tracking-[-3px] text-[50px] uppercase font-bold absolute left-[20px] text-[--theme-green]"
    >
      Register
    </h2>
    <div
      class="card-body p-6 items-center text-center bg-action bg-[--theme-green] rounded-xl border-none z-10"
    >
      <form
        method="post"
        use:enhance
        class="gap-y-4 w-full bg-[--theme-green]"
        action={route("registerUser /auth/register")}
      >
        <FormField
          icon="ph:user"
          type="text"
          placeholder="Username"
          bind:value={$form.name}
          errorMessage={$errors.name}
          label="Username"
        />
        <FormField
          icon="ph:envelope"
          type="email"
          placeholder="Email"
          bind:value={$form.email}
          errorMessage={$errors.email}
          label="Email"
        />
        <FormField
          icon="ph:key"
          type="password"
          bind:value={$form.password}
          errorMessage={$errors.password}
          label="Password"
        />
        <button type="submit" class="btn bg-white w-full mt-4">
          Register
        </button>
      </form>
      <OrContinueWithDivider />
      <OAuthButtonLinks />
    </div>
  </div>
  <p class="mt-5 font-bold text-sm tracking-wide">
    Already have an account? <a href="/auth/login" class="text-[--theme-green]"
      >Log in</a
    >!
  </p>
</div>
<img
  class="absolute left-0 bottom-0 z-10 opacity-30 hidden lg:block"
  src="/assets/girl-computer.webp"
  alt="girl on a computer"
/>
