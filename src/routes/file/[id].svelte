<script context="module">
	import * as eth from '$lib/eth'

	export async function load ({ params }) {
		const { id } = params

		// get file thumbnail
		const file = await eth.getFileMetaWithoutProvider(id)
		console.log(file)

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

	export let id
	export let file

	$: empty = !file || file.sender === eth.emptyAddress
	$: thumbnailLink = `${api.endpoint}/thumbnail?id=${id}`

	async function pay () {

	}

	async function download () {

	}
</script>

<svelte:head>
	{#if !empty}
		<meta property="og:title" content="File">
		<meta property="og:image" content={thumbnailLink}>
	{/if}
</svelte:head>

{#if empty}
	<h1>404 file not found</h1>
{:else}
	<div>
		<img src={thumbnailLink} alt="thumbnail">
		<br>
		<button type="button" on:click={pay}>Pay</button>
		<br>
		<button type="button" on:click={download}>Download</button>
	</div>
{/if}
