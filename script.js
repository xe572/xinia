document.addEventListener('DOMContentLoaded', function() {
    // 导航功能
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    // 导航点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有active类
            navLinks.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // 添加active类到当前链接
            this.classList.add('active');
            
            // 显示对应的内容区域
            const targetSection = this.getAttribute('data-section');
            const section = document.getElementById(targetSection);
            if (section) {
                section.classList.add('active');
            }
        });
    });
    
    // 滚动动画效果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察所有卡片元素
    const cards = document.querySelectorAll('.card, .experience-card, .portfolio-item, .contact-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // 技能条动画
    const skillBars = document.querySelectorAll('.skill-bar');
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.style.width;
                skillBar.style.width = '0%';
                setTimeout(() => {
                    skillBar.style.width = width;
                }, 100);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
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
    
    // 鼠标移动视差效果（可选）
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
        
        const cards = document.querySelectorAll('.portfolio-item, .experience-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardX = rect.left + rect.width / 2;
            const cardY = rect.top + rect.height / 2;
            const distanceX = (e.clientX - cardX) / 30;
            const distanceY = (e.clientY - cardY) / 30;
            
            if (Math.abs(distanceX) < 10 && Math.abs(distanceY) < 10) {
                card.style.transform = `translateY(${-2 + distanceY}px) rotateX(${-distanceY}deg) rotateY(${distanceX}deg)`;
            }
        });
    });
    
    // 重置卡片变换
    document.addEventListener('mouseleave', function() {
        const cards = document.querySelectorAll('.portfolio-item, .experience-card');
        cards.forEach(card => {
            card.style.transform = '';
        });
    });
    
    // 打字机效果（可选，用于标题）
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // 页面加载完成后的初始化动画
    window.addEventListener('load', function() {
        // 为主要内容区域添加淡入效果
        const mainContent = document.querySelector('.main-content');
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateX(20px)';
        mainContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateX(0)';
        }, 300);
        
        // 为侧边栏添加滑入效果
        const sidebar = document.querySelector('.sidebar');
        sidebar.style.transform = 'translateX(-100%)';
        sidebar.style.transition = 'transform 0.8s ease';
        
        setTimeout(() => {
            sidebar.style.transform = 'translateX(0)';
        }, 100);
    });
    
    // 时间线项目的渐进显示
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        
        const timelineObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, 100);
                }
            });
        }, { threshold: 0.2 });
        
        timelineObserver.observe(item);
    });
    
    // 添加键盘导航支持
    document.addEventListener('keydown', function(e) {
        const activeLink = document.querySelector('.nav-link.active');
        const allLinks = Array.from(document.querySelectorAll('.nav-link'));
        const currentIndex = allLinks.indexOf(activeLink);
        
        if (e.key === 'ArrowDown' && currentIndex < allLinks.length - 1) {
            e.preventDefault();
            allLinks[currentIndex + 1].click();
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            e.preventDefault();
            allLinks[currentIndex - 1].click();
        }
    });
    
    // 添加页面滚动时的导航栏高亮效果
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.content-section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });
});