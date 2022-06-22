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
			<div class="lo-12 _gg-8px _mgt-32px _bgcl-white-100 _pd-24px _bdrd-12px _bdw-1px _bdcl-neutral-200 _w-100pct">
				<div class="_dp-f _jrfct-spbtw _alit-fe _gg-4px _w-100pct _fs-200">
					<strong>Account:</strong>
					<hr class="_f-1">
					<span class="_tal-r">{$account}</span>
				</div>
				<div class="_dp-f _jrfct-spbtw _alit-fe _gg-4px _w-100pct _fs-200">
					<strong>Balance:</strong>
					<hr class="_f-1">
					<span class="_tal-r">{eth.formatEther($balance)} REI</span>
				</div>
			</div>

			<UploadForm />
		{/if}
	{:else}
		<div>Connecting to Ethereum...</div>
	{/if}
</div>
