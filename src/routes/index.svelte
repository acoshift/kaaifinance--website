<script>
	import Connect from './_components/Connect.svelte'
	import UploadForm from './_components/UploadForm.svelte'
	import * as eth from '$lib/eth'

	const hasProvider = eth.hasProvider
	const account = eth.account
	const balance = eth.balance
</script>

<div>
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
