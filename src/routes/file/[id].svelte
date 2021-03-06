<script context="module">
	import * as eth from '$lib/eth'

	export async function load ({ params }) {
		const { id } = params

		// get file thumbnail
		const file = await eth.getFileMetaWithoutProvider(id)

		return {
			props: {
				id,
				file
			}
		}
	}
</script>

<script>
	import * as api from '$lib/api'
	import * as modal from '$lib/modal'
	import Connect from '../_components/Connect.svelte'

	export let id
	export let file

	const account = eth.account
	const hasProvider = eth.hasProvider

	$: empty = !file || file.sender === eth.emptyAddress
	$: thumbnailLink = `${api.endpoint}/thumbnail?id=${id}`

	let loading = true
	let paid = false

	$: $account, fetchPaid()

	async function fetchPaid () {
		if (!$account) {
			return
		}
		paid = await eth.isPaid(id)
		loading = false
	}

	let paying = false
	async function pay () {
		if (paying) {
			return
		}

		paying = true
		try {
			await eth.payFile(id, file.downloadFee)
		} catch (e) {
			modal.error('Pay Failed', e.reason || e.message)
		} finally {
			fetchPaid()
			paying = false
		}
	}

	async function download () {
		const signed = await eth.signData('download')
		const url = `${api.endpoint}/download?id=${id}&signature=${signed.signature}&deadline=${signed.deadline}`
		window.open(url)
	}
</script>

<svelte:head>
	{#if !empty}
		<meta property="og:title" content="File">
		<meta property="og:image" content={thumbnailLink}>
	{/if}
</svelte:head>

<div class="lo-12 _gg-12px _jtfit-ct _w-100pct _pdv-48px" style="max-width: 480px;">
	{#if empty}
		<div class="_bgcl-white-100 _bdw-1px _bdcl-neutral-300 _bdrd-12px _pd-32px _fw-500 _fs-600 _mgt-32px">
			<h1>404 file not found</h1>
		</div>
	{:else}
		<div class="lo-12 _gg-32px _bgcl-white-100 _pd-24px _bdrd-12px _bdw-1px _bdcl-neutral-300 _w-100pct">
			<img src={thumbnailLink} alt="thumbnail" width="100%" class="_bdrd-8px _ovf-hd">

			{#if $account && !loading}
				<div class="lo-12 _g-8px">
					{#if !paid}
						<button type="button" class="nomi-button" class:is-loading={paying} on:click={pay}>Pay ({eth.formatEther(file.downloadFee)} REI)</button>
					{:else}
						<button type="button" class="nomi-button is-variant-secondary" on:click={download}>Download</button>
					{/if}
				</div>
			{/if}

			{#if $hasProvider != null}
				{#if !$account}
					<Connect />
				{/if}
			{:else}
				<div>
					Connecting to Ethereum...
				</div>
			{/if}
		</div>
	{/if}
</div>
