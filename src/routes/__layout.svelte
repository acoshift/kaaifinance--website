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

<div class="bg-pattern _w-100pct _mnh-100vh _pdtv-64px _bgcl-neutral-100 _pdh-16px">
	<div class="_dp-f _jtfct-ct">
		<slot />
	</div>
</div>
