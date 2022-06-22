const endpoint = 'https://kaaifinance--api.moonrhythm.workers.dev'

export function price ({ sender, maxSize }) {
	return fetch(`${endpoint}/price`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			sender,
			maxSize
		})
	})
}
