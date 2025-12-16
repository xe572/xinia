/**
 * 访问量统计功能
 * 功能：统计外部访问量，排除本人IP，点击左下角显示/隐藏访问量
 */

// ========== 访问量统计功能开关 ==========
// true: 启用统计功能 | false: 关闭统计功能
const VISIT_STATS_ENABLED = true;

// ========== 配置信息 ==========
// 本人公网IP白名单（该IP访问不计入统计）
const MY_IP_WHITELIST = '61.242.135.212'; // 修改本人IP位置

// CountAPI配置
const COUNTAPI_NAMESPACE = 'zengzhongxian'; // CountAPI命名空间
const COUNTAPI_KEY = 'portfolio-views'; // 计数键名
const COUNTAPI_URL = `https://api.countapi.xyz/hit/${COUNTAPI_NAMESPACE}/${COUNTAPI_KEY}`; // 实时数据查看地址

// ========== 核心功能实现 ==========
class VisitStats {
    constructor() {
        this.isVisible = false;
        this.statsArea = null;
        this.counter = null;
        this.countElement = null;
        
        if (VISIT_STATS_ENABLED) {
            this.init();
        }
    }

    async init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // 获取DOM元素
        this.statsArea = document.getElementById('visitStatsArea');
        this.counter = document.getElementById('visitCounter');
        this.countElement = document.getElementById('visitCount');

        if (!this.statsArea || !this.counter || !this.countElement) {
            console.error('访问量统计：DOM元素未找到');
            return;
        }

        console.log('访问量统计：DOM元素已找到');

        // 绑定点击事件 - 点击显示/隐藏逻辑
        this.statsArea.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('访问量统计区域被点击');
            this.toggleVisibility();
        });

        // 初始化显示状态
        this.counter.style.opacity = '0';
        this.counter.style.display = 'none';

        // 先获取当前访问量，然后记录新访问
        this.updateCurrentCount();
        this.recordVisit();
    }

    // ========== 点击显示/隐藏交互逻辑 ==========
    toggleVisibility() {
        this.isVisible = !this.isVisible;
        console.log('切换显示状态:', this.isVisible);
        
        if (this.isVisible) {
            this.counter.style.display = 'block';
            this.counter.style.opacity = '0';
            setTimeout(() => {
                this.counter.style.opacity = '1';
            }, 10);
        } else {
            this.counter.style.opacity = '0';
            setTimeout(() => {
                this.counter.style.display = 'none';
            }, 200);
        }
    }

    // ========== IP白名单和统计逻辑 ==========
    async recordVisit() {
        try {
            // 获取用户IP
            const userIP = await this.getUserIP();
            
            // 检查是否在白名单中
            if (userIP === MY_IP_WHITELIST) {
                console.log('访问量统计：本人IP访问，已排除');
                return;
            }

            // 记录外部访问
            await this.incrementCount();
            console.log('访问量统计：已记录外部访问');
            
        } catch (error) {
            console.error('访问量统计失败:', error);
        }
    }

    // ========== 获取用户IP ==========
    async getUserIP() {
        try {
            // 使用免费的IP查询服务
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('获取IP失败:', error);
            // 获取失败时，记录访问但标记为未知IP
            return 'unknown';
        }
    }

    // ========== CountAPI接口调用 ==========
    async incrementCount() {
        try {
            const response = await fetch(COUNTAPI_URL);
            const data = await response.json();
            
            // 更新显示
            if (this.countElement) {
                this.countElement.textContent = data.value;
            }
        } catch (error) {
            console.error('CountAPI调用失败:', error);
            // API调用失败时的本地计数
            this.incrementLocalCount();
        }
    }

    // ========== 本地备用计数 ==========
    incrementLocalCount() {
        let count = parseInt(localStorage.getItem('visitCount') || '0');
        count++;
        localStorage.setItem('visitCount', count.toString());
        
        if (this.countElement) {
            this.countElement.textContent = count;
        }
    }

    // ========== 获取当前访问量 ==========
    async getCurrentCount() {
        try {
            const response = await fetch(`https://api.countapi.xyz/get/${COUNTAPI_NAMESPACE}/${COUNTAPI_KEY}`);
            const data = await response.json();
            return data.value || 0;
        } catch (error) {
            console.error('获取访问量失败:', error);
            return parseInt(localStorage.getItem('visitCount') || '0');
        }
    }

    // ========== 更新当前访问量显示 ==========
    async updateCurrentCount() {
        const count = await this.getCurrentCount();
        if (this.countElement) {
            this.countElement.textContent = count;
        }
    }
}

// ========== 初始化统计功能 ==========
// 低优先级加载，不影响页面主内容
setTimeout(() => {
    new VisitStats();
}, 1000);

// ========== 实时数据查看说明 ==========
// 可以直接在浏览器中打开以下地址查看实时访问量数据：
// https://api.countapi.xyz/get/zengzhongxian/portfolio-views
// 
// 修改本人IP：修改第19行的 MY_IP_WHITELIST 值即可
// 关闭统计功能：修改第12行的 VISIT_STATS_ENABLED 值为 false