<script>
	import { account } from '$lib/eth'
	import * as modal from '$lib/modal'
	import * as api from '$lib/api'
	import * as eth from '$lib/eth'
	import { BigNumber, ethers } from 'ethers'
	import { goto } from '$app/navigation'

	const form = {
		file: null,
		thumbnail: null,
		price: '1'
	}
	let receiptId = null

	let loading = false
	async function upload () {
		if (loading) {
			return
		}

		loading = true
		try {
			const f = form.file.files[0]
			const thumbnail = form.thumbnail.files[0]
			const price = ethers.utils.parseEther(form.price)

			if (!receiptId) {
				// quote
				const quoteResult = await api.price({
					sender: $account,
					maxSize: f.size
				})

				// pay
				const payReceipt = await eth.newFile({
					maxSize: BigNumber.from(f.size),
					downloadFee: price,
					deadline: BigNumber.from(quoteResult.deadline),
					signature: quoteResult.signature,
					fee: BigNumber.from(quoteResult.fee)
				})
				console.log(payReceipt)
				receiptId = payReceipt.events
					.find((ev) => ev.eventSignature === 'NewFile(address,uint256)')
					.args.id
			}

			const signed = await eth.signData('upload')

			// upload
			const uploadResult = await api.upload({
				id: receiptId,
				deadline: signed.deadline,
				signature: signed.signature,
				file: f,
				thumbnail
			})
			if (uploadResult.status !== 200) {
				throw new Error('calling upload api failed')
			}
			await modal.success('Upload Success', 'File uploaded successfully')
			await goto(`/file/${receiptId}`)
		} catch (e) {
			modal.error('Upload Failed', e.reason || e.message)
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

	let inputFileName = null
	function setFileName (e) {
		const f = e.target.files[0]
		inputFileName = f.name
	}
</script>

<form class="lo-12 _gg-24px _bgcl-white-100 _pd-24px _bdrd-12px _bdw-1px _bdcl-neutral-200 _w-100pct" on:submit|preventDefault={upload}>
	<div>
		<label for="input-file">
			<div class="nomi-button is-variant-secondary">
				Upload file
			</div>
		</label>
		<input class="_dp-n" type="file" id="input-file" bind:this={form.file} required on:change={setFileName}>
		{#if inputFileName}
			<div class="_fs-300 _bgcl-neutral-100 _pdv-4px _pdh-8px _mgt-4px">{inputFileName}</div>
		{/if}
	</div>

	<div>
		<label for="input-thumbnail">
			<div class="nomi-button is-variant-secondary">
				Upload thumbnail
			</div>
		</label>
		<input class="_dp-n" type="file" id="input-thumbnail" bind:this={form.thumbnail} accept="image/png,image/jpeg" on:change={previewThumbnail} required>

		{#if thumbnailImage}
			<div class="_dp-f _mxw-100pct _mgt-4px">
				<div class="_bgcl-neutral-100 _pd-4px _bdrd-4px">
					<img src={thumbnailImage} alt="thumbnail preview" class="_h-64px _mxw-100pct _ojf-ct">
				</div>
			</div>
		{/if}
	</div>

	<div class="nomi-field">
		<label for="input-price">Price</label>
		<div class="nomi-input">
			<input id="input-price" bind:value={form.price} placeholder="0" required>
		</div>
	</div>

	<button class="nomi-button" class:is-loading={loading} disabled={loading}>Upload</button>
</form>
