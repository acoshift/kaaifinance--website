<script>
	import { account } from '$lib/eth'
	import * as modal from '$lib/modal'
	import * as api from '$lib/api'

	const form = {
		file: null,
		thumbnail: null,
		price: '1'
	}

	let loading = false
	async function upload () {
		if (loading) {
			return
		}

		loading = true
		try {
			const f = form.file.files[0]
			const result = await api.price({
				sender: $account,
				maxSize: f.size
			})
			console.log(result)
			modal.success('Upload Success', 'File uploaded successfully')
		} catch (e) {

		} finally {
			loading = false
		}
	}

	let thumbnailImage = null
	function previewThumbnail (e) {
		const f = e.target.files[0]
		const reader = new FileReader()
		reader.onload = (e) => {
			thumbnailImage = e.target.result
		}
		reader.readAsDataURL(f)
	}
</script>

<form class="_mgt-32px" on:submit|preventDefault={upload}>
	<div>
		<label for="input-file">File</label>
		<input type="file" id="input-file" bind:this={form.file} required>
	</div>
	<div>
		<label for="input-thumbnail">Thumbnail</label>
		<input type="file" id="input-thumbnail" bind:this={form.thumbnail} accept="image/png,image/jpeg" on:change={previewThumbnail} required>
	</div>
	{#if thumbnailImage}
		<div>
			<img class="_w-100vh" src={thumbnailImage} alt="thumbnail preview">
		</div>
	{/if}
	<div>
		<label for="input-price">Price</label>
		<input id="input-price" bind:value={form.price} required>
	</div>
	<button class="nomi-button" class:is-loading={loading} disabled={loading}>Upload</button>
</form>
