// 远程配置文件地址
const CONFIG_URL = './config.json';

// 禁止微信默认下拉行为
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

// 加载远程配置
async function loadConfig() {
    try {
        const res = await fetch(CONFIG_URL, { cache: 'no-store' });
        const config = await res.json();

        // 更新所有可配置项
        document.getElementById('status-time').textContent = config.statusTime;
        document.getElementById('battery-text').textContent = config.batteryText;
        document.getElementById('unread').textContent = config.unread;
        document.getElementById('nickname').textContent = config.nickname;
        document.getElementById('msg-time').textContent = config.msgTime;
        document.getElementById('bubble').innerHTML = config.bubble.replace(/\n/g, '<br>');
        document.getElementById('avatar').style.backgroundImage = `url(${config.avatarUrl})`;

        // 更新电量填充
        const batteryPercent = parseInt(config.batteryText) / 100;
        document.getElementById('battery-fill').style.width = `${batteryPercent * 100}%`;
    } catch (err) {
        console.error('配置加载失败，使用默认值', err);
    }
}

// 生成全屏截图，覆盖整个页面
function generateScreenshot() {
    html2canvas(document.getElementById('capture'), {
        useCORS: true,
        scale: 3,
        backgroundColor: null,
        logging: false
    }).then(canvas => {
        // 清空页面，只显示截图
        document.body.innerHTML = '';
        document.body.style.cssText = `
            margin: 0;
            padding: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            background: #ededed;
        `;
        // 让截图铺满手机屏幕
        canvas.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
            pointer-events: none;
        `;
        document.body.appendChild(canvas);
    }).catch(err => {
        console.error('截图生成失败，保留原界面', err);
    });
}

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    // 延迟3秒生成截图，确保界面渲染完成
    setTimeout(generateScreenshot, 3000);
});
