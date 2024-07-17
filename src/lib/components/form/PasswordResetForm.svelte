<script lang="ts">
  import { page } from "$app/stores";
  import toast, { Toaster } from "svelte-french-toast";

  import {
    MAX_PASSWORD_LENGTH,
    PasswordResetZodSchema,
    type PasswordReset,
  } from "$validations/authSchemas";

  import InputField from "./InputField.svelte";
  import { superForm, type SuperValidated } from "sveltekit-superforms";

  export let formData: SuperValidated<PasswordReset>;
  export let formAction: string;
  export const isPasswordResetTokenRequired: boolean = false;

  const { enhance, form, errors, message, delayed } = superForm(formData, {
    resetForm: true,
    taintedMessage: null,
    validators: PasswordResetZodSchema,

    onUpdated: () => {
      if (!$message) return;

      const { alertType, alertText } = $message;

      if (alertType === "error") {
        toast.error(alertText);
      }

      if (alertType === "success") {
        toast.success(alertText);
      }
    },
  });
</script>

<Toaster />

<form use:enhance method="post" class="space-y-4" action={formAction}>
  <InputField
    type="password"
    name="newPassword"
    label="New Password"
    bind:value={$form.newPassword}
    errorMessage={$errors.newPassword}
    maxlength={MAX_PASSWORD_LENGTH}
  />

  <InputField
    type="password"
    name="confirmPassword"
    label="Confirm Password"
    bind:value={$form.confirmPassword}
    errorMessage={$errors.confirmPassword}
    maxlength={MAX_PASSWORD_LENGTH}
  />

  {#if isPasswordResetTokenRequired}
    <InputField
      type="hidden"
      name="passwordResetToken"
      value={$page.url.searchParams.get("token")}
    />
  {/if}

  <button type="submit" disabled={$delayed} />
</form>
