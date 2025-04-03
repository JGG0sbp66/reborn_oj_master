<template>
    <footer>
        <div class="footer">
            <div class="footer-left">
                <div class="footer-left-title">OJ Mastr 判题大师</div>
                <div class="footer-left-content">在线评测系统</div>
            </div>
            <div class="line"></div>
            <div class="footer-right">
                <div class="footer-right-item">问题反馈 · 题目问题 · 联系我们</div>
                <div class="footer-right-item">所谓混学 · JGG0sbp66 · CHY</div>
            </div>
        </div>
    </footer>
</template>

<script lang="ts" setup>

</script>

<style scoped>
/* body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
} */

footer {
    position: relative; /* 固定在页面底部 */
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px; /* 设置 footer 高度 */
    background-color: #1f2225;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
    z-index: 10; /* 确保 footer 在最上层 */
}

/* 优化页脚与内容之间的连接 */
.page-footer {
    margin-top: 0; /* 移除间距 */
    position: relative;
}

/* 添加一个前置伪元素填充页脚上方空白并创造渐变过渡效果 */
.page-footer::before {
    content: '';
    position: absolute;
    top: -80px; /* 向上延伸更多 */
    left: 0;
    width: 100%;
    height: 80px;
    background: linear-gradient(to bottom, #f7f9fc, #1f2225); /* 创造渐变过渡 */
    z-index: -1;
}

.footer {
    max-width: 100%; /* 确保宽度不超出视口 */
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-x: hidden; /* 防止水平滚动 */
}

.footer-left-title {
    color: #ffffff;
    font-size: 30px;
    font-weight: bolder;
    transition: color 0.3s ease; /* 添加颜色变化动画 */
}

.footer-left-title:hover {
    color: #42b983; /* 鼠标悬停时改变颜色 */
}

.footer-left-content {
    color: #757575;
    font-size: 20px;
    font-weight: normal;
    letter-spacing: 3px;
    transition: color 0.3s ease; /* 添加颜色变化动画 */
}

.footer-left-content:hover {
    color: #42b983; /* 鼠标悬停时改变颜色 */
}

.line {
    background-color: #767c82;
    width: 1px;
    height: 60px;
    margin-left: 2rem;
    margin-right: 2rem;
}

.footer-right {
    color: #757575;
    font-size: 14px;
    font-weight: normal;
    letter-spacing: 3px;
}

.footer-right-item {
    transition: transform 0.3s ease, color 0.3s ease; /* 添加缩放和颜色变化动画 */
}

.footer-right-item:hover {
    transform: scale(1.1); /* 鼠标悬停时放大 */
    color: #42b983; /* 鼠标悬停时改变颜色 */
}

/* 添加淡入动画 */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>