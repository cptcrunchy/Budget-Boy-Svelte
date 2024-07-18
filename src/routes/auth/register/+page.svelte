<script lang="ts">
  import type { PageData } from "./$types";
  import toast from "svelte-french-toast";
  import { superForm } from "sveltekit-superforms/client";
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

<div class="w-full flex justify-center">
  <div class="register">
    <h2 class="register-title">Register</h2>
    <div class="card-body items-center text-center">
      <form
        method="post"
        use:enhance
        class="gap-y-4 w-full"
        action={route("registerUser /auth/register")}
      >
        <FormField
          icon="ph:user"
          type="text"
          placeholder="Username"
          bind:value={$form.name}
          errorMessage={$errors.name}
          labelName="Username"
        />
        <FormField
          icon="ph:envelope"
          type="email"
          placeholder="Email"
          bind:value={$form.email}
          errorMessage={$errors.email}
          labelName="Email"
        />
        <FormField
          icon="ph:key"
          type="password"
          bind:value={$form.password}
          errorMessage={$errors.password}
          labelName="Password"
        />
        <button type="submit" class="btn bg-white w-full mt-4">
          Register
        </button>
      </form>
      <OrContinueWithDivider />
      <OAuthButtonLinks />
    </div>
  </div>
</div>

<style lang="postcss">
  .register {
    @apply card w-96 relative mt-14;
    background-color: var(--theme-green);
  }
  .register-title {
    @apply -top-[52px] tracking-[-3px] text-[50px] uppercase font-bold absolute left-[20px];
    color: var(--theme-green);
  }
</style>
