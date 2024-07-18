<script lang="ts">
  import type { PageData } from "./$types";

  import toast from "svelte-french-toast";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  import { route } from "$lib/ROUTES";
  import {
    MAX_EMAIL_LENGTH,
    UserLoginZodSchema,
    passwordResetEmailZodSchema,
  } from "$validations/authSchemas";

  import OAuthButtonLinks from "$components/OAuthButtonLinks.svelte";
  import OrContinueWithDivider from "$components/OrContinueWithDivider.svelte";
  import FormField from "$components/form/FormField.svelte";

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
    validators: zodClient(UserLoginZodSchema),

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
    validators: zodClient(passwordResetEmailZodSchema),

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

<div class="w-full flex flex-col items-center">
  <div class="card w-96 relative mt-14">
    <h2
      class="-top-[52px] tracking-[-3px] text-[50px] uppercase font-bold absolute left-[20px] text-[--theme-green]"
    >
      Login
    </h2>
    <div
      class="card-body p-6 items-center text-center bg-action bg-[--theme-green] rounded-xl border-none z-10"
    >
      <form
        method="post"
        use:loginEnhance
        action={route("logInUser /auth/login")}
        class="flex flex-col gap-y-4 w-full bg-[--theme-green]"
      >
        <FormField
          type="email"
          name="email"
          icon="ph:envelope"
          label="Email"
          bind:value={$loginForm.email}
          errorMessage={$loginErrors.email}
        />

        <FormField
          type="password"
          name="password"
          icon="ph:key"
          label="Password"
          bind:value={$loginForm.password}
          errorMessage={$loginErrors.password}
        />

        <div class="flex flex-wrap justify-between gap-4">
          <button
            type="submit"
            disabled={$loginDelayed}
            class="btn bg-white w-full mt-4">Sign in with email</button
          >

          <dialog class="" id="forgotpassword_modal">
            <p>Forgot Password?</p>
            <div>
              <header>
                <h3>Password Reset</h3>
                <p>
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>
              </header>

              <form
                method="post"
                use:resetEnhance
                action={route("sendPasswordResetEmail /auth/login")}
                class="gap-y-4 w-full bg-[--theme-green]"
              >
                <FormField
                  type="email"
                  name="email"
                  icon="ph:envelope"
                  label="Email"
                  bind:value={$resetForm.email}
                  errorMessage={$resetErrors.email}
                  maxlength={MAX_EMAIL_LENGTH}
                />

                <button type="submit" disabled={$resetDelayed}
                  >Send Reset Link</button
                >
              </form>
            </div>
          </dialog>
        </div>
      </form>
      <OrContinueWithDivider />
      <OAuthButtonLinks />
    </div>
  </div>
</div>
