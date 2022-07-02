export {}

chrome.runtime.onInstalled.addListener(async details => {
    // 设置 badge
    const data = await chrome.storage.sync.get('accounts')
    const accounts = data.accounts || []
    await chrome.action.setBadgeText({text: accounts.length.toString()})

    // 启动一个定时器检查是否忘记备份
    chrome.alarms.create('check', {
        periodInMinutes: 60 * 24,
        // periodInMinutes: 1, // 测试用
    })
})

chrome.alarms.onAlarm.addListener(async alarm => {
    // 检查是否有最新的账户没有备份
    const data = await chrome.storage.sync.get('setting')
    const setting = data.setting || {latestAccountDate: 0, lastExportDate: 0}
    if (setting.lastExportDate === undefined || setting.lastExportDate < setting.latestAccountDate) {
        await chrome.action.setBadgeBackgroundColor({color: 'red'})
    }
})
