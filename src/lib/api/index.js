const endpoint = 'https://kaaifinance--api.moonrhythm.workers.dev'

export async function price ({ sender, maxSize }) {
	const resp = await fetch(`${endpoint}/price`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			sender,
			maxSize
		})
	})
	return resp.json()
}

export function upload ({ id, deadline, signature, file, thumbnail }) {
	const fd = new FormData()
	fd.set('id', id)
	fd.set('deadline', deadline)
	fd.set('signature', signature)
	fd.set('file', file)
	fd.set('thumbnail', thumbnail)

	return fetch(`${endpoint}/upload`, {
		method: 'POST',
		body: fd
	})
}
