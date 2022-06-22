<script>
	import * as eth from '$lib/eth'
	import * as modal from '$lib/modal'

	async function connect () {
		try {
			await eth.requestAccounts()
		} catch (e) {
			modal.error('Error connecting to Ethereum', e?.message || e)
		}
	}
</script>

<div class="nomi-button" on:click={connect}>Connect Wallet</div>
