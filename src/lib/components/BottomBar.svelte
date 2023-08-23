<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { NavItems } from '$lib/config/constants';
    import { i } from '@inlang/sdk-js';
    import { modalStore, type ModalSettings } from "@skeletonlabs/skeleton"
	import SignoutForm from './SignoutForm.svelte';

    export let navItems: NavItems;
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

<div class="card h-16 md:hidden">
    <div class="h-full max-w-sm flex mx-auto justify-center">
        {#each navItems||[] as nav}
            {#if nav.title === 'signout'}
                {#if $page.data.user}
                    <SignoutForm />
                {/if}
            {:else if (nav.alwaysVisible || ($page.data.user && nav.protected) || (!$page.data.user && !nav.protected))}
                <a class="btn variant-glass inline-flex flex-col items-center justify-center card {$page.url.pathname === nav.url ? 'bg-primary-active-token' : ''}" href="{nav.url}">
                    <svelte:component this={nav.icon} />
                    <span class="text-sm">{i(nav.title)}</span>
                </a>
            {/if}
        {/each}
    </div>
</div>