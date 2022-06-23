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
	<div class="_pst-f _l-12px _t-12px">
		<svg width="60" viewBox="0 0 210 182" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			<title>Path</title>
			<defs>
				<linearGradient x1="50%" y1="0.385161713%" x2="50%" y2="100%" id="linearGradient-1">
					<stop stop-color="#FF78CD" offset="0%"></stop>
					<stop stop-color="#D90620" offset="100%"></stop>
				</linearGradient>
			</defs>
			<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				<path d="M123.554779,25.3125 L120.429779,40.9375 L187.164711,40.9375 L180.888269,157.5 L118.913807,157.5 L124.382557,71.5625 L115.196823,71.5625 L99.5718227,157.5 L37.4509046,157.5 L53.0759046,71.5625 L23.3125,71.5625 L23.3125,40.9375 L58.2577207,40.9375 L61.3827207,25.3125 L123.554779,25.3125 Z" id="Path" stroke="#000000" stroke-width="15" fill="#D90620" fill-rule="nonzero"></path>
				<path d="M120.50527,27.8125 L117.38027,43.4375 L184.526474,43.4375 L178.519263,155 L121.577954,155 L127.046704,69.0625 L113.110382,69.0625 L97.4853818,155 L40.4464364,155 L56.0714364,69.0625 L25.8125,69.0625 L25.8125,43.4375 L60.3072305,43.4375 L63.4322305,27.8125 L120.50527,27.8125 Z" id="Path" stroke="#FFFFFF" stroke-width="10" fill="url(#linearGradient-1)" fill-rule="nonzero"></path>
			</g>
		</svg>
	</div>
	<div class="_dp-f _jtfct-ct _pdv-48px">
		<slot />
	</div>
</div>
