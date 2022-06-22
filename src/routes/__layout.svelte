<script>
	import '../style/main.scss'
	import { onMount } from 'svelte'
	import { browser } from '$app/env'
	import { init } from '$lib/eth'

	if (browser) {
		onMount(() => {
			init()
		})
	}
</script>

<div class="_w-100pct _mgt-64px">
	<div class="_dp-f _jtfct-ct">
		<slot />
	</div>
</div>
