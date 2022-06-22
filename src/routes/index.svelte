<script>
	import Connect from './_components/Connect.svelte'
	import UploadForm from './_components/UploadForm.svelte'
	import * as eth from '$lib/eth'

	const hasProvider = eth.hasProvider
	const account = eth.account
	const balance = eth.balance
</script>

<div class="lo-12 _gg-12px _jtfit-ct _w-100pct" style="max-width: 460px;">
	{#if $hasProvider != null}
		{#if !$account}
			<Connect />
		{:else}
			<div>{$account}</div>
			<div>Balance: {eth.formatEther($balance)} REI</div>

			<UploadForm />
		{/if}
	{:else}
		<div>Connecting to Ethereum...</div>
	{/if}
</div>
