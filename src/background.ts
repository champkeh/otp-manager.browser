export {}

chrome.runtime.onInstalled.addListener(async details => {
    const data = await chrome.storage.sync.get('accounts')
    const accounts = data.accounts || []
    await chrome.action.setBadgeText({text: accounts.length.toString()})
})
