// 板块切换功能
document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // 移除所有按钮的active类
            navButtons.forEach(btn => btn.classList.remove('active'));
            // 添加当前按钮的active类
            this.classList.add('active');
            
            // 平滑滚动到顶部
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // 隐藏所有板块
            sections.forEach(section => section.classList.remove('active'));
            
            // 延迟显示对应板块，确保滚动动画完成
            setTimeout(() => {
                const targetElement = document.getElementById(targetSection);
                if (targetElement) {
                    targetElement.classList.add('active');
                }
            }, 150);
        });
    });
    
    // 二维码放大功能
    const qrCode = document.getElementById('wechat-qr');
    const modal = document.getElementById('qr-modal');
    const modalImage = document.getElementById('modal-qr-image');
    const closeBtn = document.querySelector('.close');
    
    if (qrCode && modal) {
        const qrImage = qrCode.querySelector('img');
        
        qrImage.addEventListener('click', function(e) {
            e.stopPropagation();
            modalImage.src = this.src;
            modalImage.alt = this.alt;
            modal.style.display = 'block';
        });
        
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        modal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        modalImage.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // 作品详情按钮功能
    const detailButtons = document.querySelectorAll('.detail-btn');
    
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const portfolioCard = this.closest('.portfolio-card');
            const title = portfolioCard.querySelector('h3').textContent;
            
            // 创建详情弹窗
            const detailModal = document.createElement('div');
            detailModal.className = 'modal';
            detailModal.id = 'detail-modal';
            detailModal.innerHTML = `
                <div class="modal-content" style="max-width: 600px; text-align: left;">
                    <span class="close">&times;</span>
                    <h2 style="margin-bottom: 20px; color: #000;">${title}</h2>
                    <div class="detail-content"></div>
                </div>
            `;
            
            document.body.appendChild(detailModal);
            
            // 获取作品详情内容
            const content = portfolioCard.querySelector('.portfolio-content').innerHTML;
            detailModal.querySelector('.detail-content').innerHTML = content;
            
            // 移除详情按钮避免重复
            detailModal.querySelector('.detail-btn')?.remove();
            
            // 显示弹窗
            detailModal.style.display = 'block';
            
            // 关闭弹窗功能
            const detailCloseBtn = detailModal.querySelector('.close');
            detailCloseBtn.addEventListener('click', function() {
                detailModal.style.display = 'none';
                document.body.removeChild(detailModal);
            });
            
            detailModal.addEventListener('click', function() {
                detailModal.style.display = 'none';
                document.body.removeChild(detailModal);
            });
            
            detailModal.querySelector('.modal-content').addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });
    });
    
    // 平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 页面加载动画
    window.addEventListener('load', function() {
        // 延迟显示页面内容，提供更好的加载体验
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // 添加键盘快捷键支持
    document.addEventListener('keydown', function(e) {
        // ESC键关闭弹窗
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
                if (modal.id === 'detail-modal') {
                    document.body.removeChild(modal);
                }
            });
        }
        
        // 数字键1-5快速切换板块
        if (e.key >= '1' && e.key <= '5') {
            const index = parseInt(e.key) - 1;
            if (navButtons[index]) {
                navButtons[index].click();
            }
        }
    });
    
    // 移动端触摸优化
    if ('ontouchstart' in window) {
        // 为移动端添加触摸反馈
        const clickableElements = document.querySelectorAll('.nav-btn, .contact-link, .portfolio-link, .detail-btn');
        
        clickableElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.opacity = '0.7';
            });
            
            element.addEventListener('touchend', function() {
                this.style.opacity = '1';
            });
        });
    }
    
    // 性能优化：图片懒加载
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px' // 提前50px开始加载
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // 错误处理：图片加载失败时显示占位符
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0YwRjBGMCIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+5aS06LSo77yaMzAweDMwMDwvdGV4dD48L3N2Zz4=';
            this.alt = '图片加载失败';
        });
    });
});

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 响应式菜单切换（移动端）
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    
    if (window.innerWidth <= 767) {
        sidebar.classList.toggle('mobile-open');
        content.classList.toggle('mobile-open');
    }
}

// 响应式窗口大小变化监听
window.addEventListener('resize', debounce(function() {
    if (window.innerWidth > 767) {
        const sidebar = document.querySelector('.sidebar');
        const content = document.querySelector('.content');
        sidebar.classList.remove('mobile-open');
        content.classList.remove('mobile-open');
    }
}, 250));

// 添加滚动到顶部按钮
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    
    // 移动端样式
    button.style.cssText = `
        position: fixed;
        bottom: 50px;
        right: 20px;
        width: 45px;
        height: 45px;
        background-color: #F0F0F0;
        color: #444444;
        border: none;
        border-radius: 50%;
        font-size: 18px;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all 0.2s ease;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    `;
    
    document.body.appendChild(button);
    
    // 滚动显示/隐藏按钮
    window.addEventListener('scroll', throttle(function() {
        if (window.pageYOffset > 300) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    }, 100));
    
    // 点击滚动到顶部
    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 悬停效果
    button.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#E0E0E0';
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#F0F0F0';
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.1)';
    });
}

// 初始化滚动到顶部按钮
createScrollToTopButton();

// 添加页面可见性API支持
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面不可见时暂停动画等资源消耗
        document.body.classList.add('page-hidden');
    } else {
        // 页面可见时恢复
        document.body.classList.remove('page-hidden');
    }
});

// 性能监控（开发环境）
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`页面加载时间: ${loadTime.toFixed(2)}ms`);
        
        // 监控资源加载
        const resources = performance.getEntriesByType('resource');
        const slowResources = resources.filter(resource => resource.duration > 1000);
        
        if (slowResources.length > 0) {
            console.warn('加载缓慢的资源:', slowResources);
        }
    });
}