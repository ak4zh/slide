<script lang="ts">
	import '../app.postcss';
	import {
		AppBar,
		AppShell,
		Avatar,
		Drawer,
		Modal,
		Toast,
		getDrawerStore,
		ProgressRadial
	} from '@skeletonlabs/skeleton';
	import Navigation from '$lib/components/navigation.svelte';
	import { APP_NAME, navItems } from '$lib/config/constants';
	import Footer from '$lib/components/footer.svelte';
	import { Menu } from 'lucide-svelte';
	import convertNameToInitials from '$lib/_helpers/convertNameToInitials';
	import BottomBar from '$lib/components/BottomBar.svelte';
	import { navigating } from '$app/stores';
	import { loading } from '$lib/stores';
	import { initializeStores } from '@skeletonlabs/skeleton';

	initializeStores();
	export let data;
	let drawerStore = getDrawerStore();
	function drawerOpen(): void {
		drawerStore.open();
	}

</script>

<Toast position="tr" />
<Modal />
<Drawer>
	<Navigation {navItems} />
</Drawer>

<AppShell slotSidebarLeft="w-0 md:w-52 bg-surface-500/10">
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<button class="md:hidden btn btn-sm mr-4" aria-label="Menu Button" on:click={drawerOpen}>
					<span>
						<Menu />
					</span>
				</button>
				<strong class="text-xl uppercase">{APP_NAME}</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if data?.user}
					<Avatar initials={convertNameToInitials(data?.user?.firstName||'', data?.user?.lastName||'')} width="w-10" background="bg-primary-500" />
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<Navigation {navItems} />
	</svelte:fragment>
	<!-- Main Content -->
	{#if $navigating || $loading}
		<div
			class="fixed bottom-0 left-0 right-0 top-0 z-50 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-500 opacity-75"
		>
			<ProgressRadial stroke={100} />
		</div>
	{/if}
	<div class="container lg:p-10 mx-auto">
		<slot />
	</div>
	<svelte:fragment slot="pageFooter"><Footer /></svelte:fragment>
	<svelte:fragment slot="footer"><BottomBar {navItems}/></svelte:fragment>
</AppShell>
