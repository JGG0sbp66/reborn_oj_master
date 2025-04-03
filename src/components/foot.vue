<template>
    <footer>
        <div class="footer-container">
            <div class="footer-content">
                <div class="footer-left">
                    <div class="footer-left-title">OJ Mastr 判题大师</div>
                    <div class="footer-left-content">在线评测系统</div>
                </div>
                <div class="footer-divider"></div>
                <div class="footer-right">
                    <div class="footer-right-item">问题反馈 · 题目问题 · 联系我们</div>
                    <div class="footer-right-item">所谓混学 · OJmaster · J-C-Z-V</div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script lang="ts" setup>
// 页脚组件逻辑
</script>

<style scoped>
/* body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
} */

footer {
    position: relative;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background-color: #1f2225;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
    z-index: 10;
}

.page-footer {
    margin-top: 0;
    position: relative;
}

.page-footer::before {
    display: none;
}

.footer-container {
    height: 100%;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.footer-content {
    width: 100%;
    max-width: 1200px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.footer-left-title {
    color: #ffffff;
    font-size: 28px;
    font-weight: 600;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    letter-spacing: 0.5px;
}

.footer-left-title:hover {
    color: #42b983;
    transform: translateY(-2px);
    text-shadow: 0 2px 10px rgba(66, 185, 131, 0.3);
}

.footer-left-content {
    color: #999;
    font-size: 18px;
    font-weight: normal;
    letter-spacing: 2px;
    margin-top: 4px;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.footer-left-content:hover {
    color: #42b983;
    transform: translateX(3px);
}

.footer-divider {
    background-color: #3a3f45;
    width: 1px;
    height: 60px;
    margin: 0 3rem;
    position: relative;
    overflow: hidden;
}

.footer-divider::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, transparent, #42b983, transparent);
    opacity: 0;
    transition: opacity 0.5s ease;
}

.footer-content:hover .footer-divider::after {
    opacity: 0.8;
    animation: glowEffect 1.5s infinite alternate;
}

.footer-right {
    color: #999;
    font-size: 14px;
    font-weight: normal;
    letter-spacing: 1px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.footer-right-item {
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    position: relative;
    padding: 4px 0;
}

.footer-right-item:hover {
    transform: translateX(5px);
    color: #42b983;
}

.footer-right-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background-color: #42b983;
    transition: width 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.footer-right-item:hover::after {
    width: 100%;
}

@keyframes glowEffect {
    from {
        opacity: 0.3;
        transform: translateY(-30px);
    }
    to {
        opacity: 0.8;
        transform: translateY(30px);
    }
}

@media (max-width: 768px) {
    .footer-content {
        flex-direction: column;
        text-align: center;
        padding: 1rem 0;
    }
    
    .footer-divider {
        width: 60px;
        height: 1px;
        margin: 1rem 0;
    }
    
    .footer-right {
        align-items: center;
    }
    
    .footer-right-item:hover {
        transform: translateY(-3px);
    }
}
</style>