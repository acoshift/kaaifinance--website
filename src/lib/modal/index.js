import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

export function error (title, message) {
	return Swal.fire({
		title,
		text: message,
		icon: 'error'
	})
}

export function success (title, message) {
	return Swal.fire({
		title,
		text: message,
		icon: 'success'
	})
}
