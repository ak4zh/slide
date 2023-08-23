<script lang="ts">
	import { APP_NAME } from '$lib/config/constants';
	import { loading } from '$lib/stores.js';
	import { superForm } from 'sveltekit-superforms/client';
	export let data;
	const { delayed, enhance } = superForm(data.form);
	$: loading.set($delayed)
</script>

<h3>Confirm Your Email Address</h3>

<hr class="!border-t-2 mt-2 mb-6" />

Please check your email account for a message to confirm your email address for {APP_NAME}. If you
did not receive the email,
<form method="POST" use:enhance>
	<button type="submit" class="btn variant-filled-primary">Resend email</button>
</form>
