<script lang="ts">
	import { enhance } from "$app/forms";
	import { i } from '@inlang/sdk-js';
	import { LogOut } from "lucide-svelte";
    import { modalStore, type ModalSettings } from "@skeletonlabs/skeleton"

    let formEl: HTMLFormElement;

    const signoutConfirmModal = (button: HTMLButtonElement, form: HTMLFormElement): ModalSettings => {
        return {
            type: 'confirm',
            title: 'Please Confirm',
            body: 'Are you sure you want to sign out?',
            response: (r: boolean) => { if (r) form.requestSubmit(button) }
        }
    }
</script>

<form
    id="completion-form"
    use:enhance
    method="POST"
    action="/auth/sign-out"
    bind:this={formEl}
>
    <button
        type="submit"
        class="btn variant-filled-error"
        on:click|preventDefault={(e) => modalStore.trigger(signoutConfirmModal(e.currentTarget, formEl))}
    >
        <span><LogOut /></span>
        <span>{i("signout")}</span>
    </button>
</form>