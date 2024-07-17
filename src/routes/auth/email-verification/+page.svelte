<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";

  import toast from "svelte-french-toast";
  import { superForm } from "sveltekit-superforms/client";

  import { route } from "$lib/ROUTES";
  import { EmailVerificationCodeZodSchema } from "$validations/authSchemas";

  import InputField from "$components/form/InputField.svelte";

  export let data: PageData;

  const {
    form,
    errors,
    message,
    delayed,
    enhance: verifyCodeEnhance,
  } = superForm(data.emailVerificationCodeFormData, {
    resetForm: false,
    taintedMessage: null,
    validators: EmailVerificationCodeZodSchema,

    onUpdated: () => {
      if (!$message) return;

      const { alertType, alertText } = $message;

      if (alertType === "error") {
        toast.error(alertText);
      }
    },
  });
</script>

<h1 class="mb-6 text-2xl font-bold leading-none">Email Verification Code</h1>

<h2 class="mb-5">
  Welcome aboard 🎉! To complete your registration, please enter the
  verification code we've sent to your email:
  <strong>{data.pendingUserEmail}</strong>.
</h2>

<form
  use:verifyCodeEnhance
  method="post"
  class="space-y-4"
  action={route("verifyCode /auth/email-verification")}
>
  <InputField
    type="text"
    name="verificationCode"
    label="Verification Code"
    placeholder="Enter your verification code here"
    bind:value={$form.verificationCode}
    errorMessage={$errors.verificationCode}
  />

  <button type="submit" class="w-full" disabled={$delayed}>Verify</button>
</form>

<form
  method="post"
  action={route("sendNewCode /auth/email-verification")}
  use:enhance={() => {
    return async ({ result }) => {
      if (result.type === "failure") {
        toast.error(result.data?.message);
      }

      if (result.type === "success") {
        toast.success(result.data?.message);
      }
    };
  }}
  class="mt-4"
>
  <button type="submit" class="w-full">Send New Code</button>
</form>
