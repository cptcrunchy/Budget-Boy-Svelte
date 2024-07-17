<script lang="ts">
  import type { PageData } from "./$types";

  import toast from "svelte-french-toast";
  import { superForm } from "sveltekit-superforms/client";

  import { route } from "$lib/ROUTES";
  import {
    MAX_EMAIL_LENGTH,
    MAX_PASSWORD_LENGTH,
    UserLoginZodSchema,
    passwordResetEmailZodSchema,
  } from "$validations/authSchemas";

  import OAuthButtonLinks from "$components/OAuthButtonLinks.svelte";
  import OrContinueWithDivider from "$components/OrContinueWithDivider.svelte";
  import InputField from "$components/form/InputField.svelte";

  export let data: PageData;

  // For login form
  const {
    enhance: loginEnhance,
    form: loginForm,
    errors: loginErrors,
    message: loginMessage,
    delayed: loginDelayed,
  } = superForm(data.userLoginFormData, {
    resetForm: true,
    taintedMessage: null,
    validators: UserLoginZodSchema,

    onUpdated: () => {
      if (!$loginMessage) return;

      const { alertType, alertText } = $loginMessage;

      if (alertType === "error") {
        toast.error(alertText);
      }
    },
  });

  // For password reset form
  const {
    enhance: resetEnhance,
    form: resetForm,
    errors: resetErrors,
    message: resetMessage,
    delayed: resetDelayed,
  } = superForm(data.passwordResetEmailFormData, {
    resetForm: true,
    taintedMessage: null,
    validators: passwordResetEmailZodSchema,

    onUpdated: () => {
      if (!$resetMessage) return;

      const { alertType, alertText } = $resetMessage;

      if (alertType === "error") {
        toast.error(alertText);
      }

      if (alertType === "success") {
        toast.success(alertText);
      }
    },
  });
</script>

<h1 class="mb-6 text-2xl font-bold leading-none">Login</h1>

<form
  method="post"
  use:loginEnhance
  action={route("logInUser /auth/login")}
  class="space-y-4"
>
  <InputField
    type="email"
    name="email"
    label="Email"
    bind:value={$loginForm.email}
    errorMessage={$loginErrors.email}
    maxlength={MAX_EMAIL_LENGTH}
  />

  <InputField
    type="password"
    name="password"
    label="Password"
    bind:value={$loginForm.password}
    errorMessage={$loginErrors.password}
    maxlength={MAX_PASSWORD_LENGTH}
  />

  <div class="flex flex-wrap justify-between gap-4">
    <button
      type="submit"
      disabled={$loginDelayed}
      class="flex-grow btn btn-primary">Sign in with email</button
    >

    <dialog class="modal" id="forgotpassword_modal">
      <p>Forgot Password?</p>
      <div>
        <header>
          <h3>Password Reset</h3>
          <p>
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </header>

        <form
          method="post"
          use:resetEnhance
          action={route("sendPasswordResetEmail /auth/login")}
          class="space-y-4"
        >
          <InputField
            type="email"
            name="email"
            label="Email"
            bind:value={$resetForm.email}
            errorMessage={$resetErrors.email}
            maxlength={MAX_EMAIL_LENGTH}
          />

          <button type="submit" disabled={$resetDelayed}>Send Reset Link</button
          >
        </form>
      </div>
    </dialog>
  </div>
</form>

<OrContinueWithDivider />

<OAuthButtonLinks />
