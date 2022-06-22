import detectEthereumProvider from '@metamask/detect-provider'
import { writable } from 'svelte/store'
import { BigNumber, ethers } from 'ethers'

export const hasProvider = writable(null)
export const account = writable('')
export const balance = writable(BigNumber.from(0))
const rpcUrl = 'https://rei-rpc.moonrhythm.io'

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

function parseChainId (chainId) {
	try {
		return parseInt(chainId, 16)
	} catch (e) {
		return 0
	}
}

async function getChainId () {
	try {
		return parseChainId(await ethereum.request('eth_chainId'))
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
		// try switch to chain 55555 or add new chain
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
