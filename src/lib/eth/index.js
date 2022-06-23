import detectEthereumProvider from '@metamask/detect-provider'
import { writable } from 'svelte/store'
import { BigNumber, ethers } from 'ethers'
import abi from './abi.json'

export const hasProvider = writable(null)
export const account = writable('')
export const balance = writable(BigNumber.from(0))
const rpcUrl = 'https://rei-rpc.moonrhythm.io'
const contractAddress = '0x11B6a7Fd205AB1a701Ee1d5564cDfA8dD152d47f'
export const emptyAddress = '0x0000000000000000000000000000000000000000'

let ethereum
let provider = new ethers.providers.JsonRpcProvider(rpcUrl)
const operationChainId = 55555
let _account = ''

export async function init () {
	ethereum = await detectEthereumProvider()
	if (!ethereum) {
		// no provider found, use default provider
		hasProvider.set(false)
		return
	}

	// switch provider to the one we detected
	provider = new ethers.providers.Web3Provider(ethereum)

	const chainChanged = async () => {
		const chainId = await getChainId()
		if (chainId !== operationChainId) {
			// wrong chain id, remove account
			account.set('')
			_account = ''
		}
	}
	const accountChanged = async () => {
		const accounts = await ethereum.request({ method: 'eth_accounts' })
		if (accounts.length === 0) {
			account.set('')
			_account = ''
		} else {
			account.set(accounts[0])
			_account = accounts[0]
		}
		reloadBalance()
	}

	ethereum.on('chainChanged', chainChanged)
	ethereum.on('accountsChanged', accountChanged)
	await chainChanged()
	await accountChanged()

	hasProvider.set(true)
}

async function getChainId () {
	try {
		return parseInt(await ethereum.request('eth_chainId'), 16)
	} catch (e) {
		return 0
	}
}

export async function requestAccounts () {
	if (!ethereum) {
		throw new Error('No Ethereum provider detected')
	}

	const chainId = await getChainId()
	if (chainId !== 55555) {
		// try switch to chain 55555 or add new chain to wallet
		try {
			await ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: `0x${operationChainId.toString(16)}` }]
			})
		} catch (e) {
			if (e.code === 4902) {
				// add new chain
				await ethereum.request({
					method: 'wallet_addEthereumChain',
					params: [{
						chainId: `0x${operationChainId.toString(16)}`,
						chainName: 'Rei Chain',
						nativeCurrency: 'REI',
						rpcUrls: [rpcUrl],
						blockExplorerUrls: ['https://reiscan.com']
					}]
				})
			}
		}
	}

	return ethereum.request({ method: 'eth_requestAccounts' })
}

export async function reloadBalance () {
	if (!_account) {
		balance.set(BigNumber.from(0))
		return
	}
	const b = await provider.getBalance(_account)
	balance.set(b)
}

export function formatEther (wei) {
	const v = ethers.utils.formatEther(wei)
	return ethers.utils.commify(v)
}

function getSigner () {
	return provider.getSigner()
}

export async function newFile ({ maxSize, downloadFee, deadline, signature, fee }) {
	const c = new ethers.Contract(contractAddress, abi, provider)
	const tx = await c
		.connect(getSigner())
		.newFile(maxSize, downloadFee, deadline, signature,
			{ value: fee })
	return tx.wait()
}

export async function payFile (id, fee) {
	const c = new ethers.Contract(contractAddress, abi, provider)
	const tx = await c
		.connect(getSigner())
		.payFile(id, { value: fee })
	return tx.wait()
}

export function isPaid (id) {
	const c = new ethers.Contract(contractAddress, abi, provider)
	return c.paidFiles(id, _account)
}

export async function signData (method) {
	const deadline = Math.floor(Date.now() / 1000) + 300
	const data = {
		primaryType: 'Request',
		types: {
			EIP712Domain: [
				{ name: 'name', type: 'string' },
				{ name: 'version', type: 'string' },
				{ name: 'chainId', type: 'uint256' }
			],
			Request: [
				{ name: 'method', type: 'string' },
				{ name: 'deadline', type: 'uint256' }
			]
		},
		domain: {
			name: 'kaai.finance',
			version: '1',
			chainId: `0x${operationChainId.toString(16)}`
		},
		message: {
			method,
			deadline
		}
	}

	const signature = await ethereum.request({
		method: 'eth_signTypedData_v4',
		params: [_account, JSON.stringify(data)],
		from: _account
	})

	return {
		signature,
		deadline
	}
}

async function ethCallWithoutProvider (callData) {
	const resp = await fetch(rpcUrl, {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			id: '1',
			method: 'eth_call',
			params: [
				{ to: contractAddress, data: callData },
				'latest'
			]
		})
	})
	return (await resp.json()).result
}

export async function getFileMetaWithoutProvider (id) {
	const args = ethers.utils.defaultAbiCoder.encode(['uint256'], [id])
	const callData = ethers.utils.hexConcat(['0xf4c714b4', args])
	const result = await ethCallWithoutProvider(callData)

	return ethers.utils.defaultAbiCoder.decode(
		[
			'address sender',
			'uint256 maxSize',
			'uint256 uploadFee',
			'uint256 downloadFee',
			'bool active',
			'uint256 paidCount'
		],
		result
	)
}
