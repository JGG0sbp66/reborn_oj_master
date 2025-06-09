<template>
    <footer>
        <div class="footer-bg-pattern"></div>
        <div class="footer-container">
            <div class="footer-content">
                <!-- 左侧品牌区域 -->
                <div class="footer-section brand-section">
                    <div class="footer-logo">
                        <span class="logo-icon">⚖️</span>
                    </div>
                    <div class="footer-branding">
                        <div class="footer-left-title">OJ Mastr 判题大师</div>
                        <div class="footer-left-content">在线评测系统</div>
                    </div>
                    <div class="footer-slogan">高效、公正、智能的编程评测平台</div>
                </div>

                <!-- 中间导航区域 -->
                <div class="footer-section nav-section">
                    <h4 class="footer-heading">常用链接</h4>
                    <div class="footer-nav-links">
                        <router-link to="/nav/home" class="footer-nav-link">首页</router-link>
                        <router-link to="/nav/question" class="footer-nav-link">题库</router-link>
                        <router-link to="/nav/competition" class="footer-nav-link">竞赛</router-link>
                        <a href="#" class="footer-nav-link">排行榜</a>
                        <a href="#" class="footer-nav-link">用户中心</a>
                    </div>
                </div>

                <!-- 右侧资源区域 -->
                <div class="footer-section resources-section">
                    <h4 class="footer-heading">资源与支持</h4>
                    <div class="footer-nav-links">
                        <a href="#" class="footer-nav-link">API接口</a>
                        <a href="#" class="footer-nav-link">开发文档</a>
                        <a href="#" class="footer-nav-link">常见问题</a>
                        <a href="#" class="footer-nav-link">服务条款</a>
                    </div>
                </div>

                <!-- 联系方式区域 -->
                <div class="footer-section contact-section">
                    <h4 class="footer-heading">联系我们</h4>
                    <div class="contact-info">
                        <div class="contact-item">
                            <span class="contact-icon">💌</span>
                            <span>oj_master@163.com</span>
                        </div>
                        <div class="contact-item">
                            <span class="contact-icon">🔗</span>
                            <span>www.oj-master.fun</span>
                        </div>
                        <div class="social-links">
                            <a href="https://github.com/JGG0sbp66/reborn_oj_master" target="_blank" class="social-link">
                                <i class="social-icon github-icon"></i>
                                <span>GitHub</span>
                            </a>
                            <a href="#" class="social-link">
                                <i class="social-icon weibo-icon"></i>
                                <span>微博</span>
                            </a>
                            <a href="#" class="social-link">
                                <i class="social-icon qq-icon"></i>
                                <span>QQ群</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 底部版权信息 -->
            <div class="footer-bottom">
                <div class="copyright">© 2025 OJ Mastr All Rights Reserved</div>
                <div class="footer-credits">
                    <span class="credit-item">所谓混学</span>
                    <span class="link-divider">·</span>
                    <span class="credit-item">OJ Master</span>
                    <span class="link-divider">·</span>
                    <div class="team-credits">
                        <span class="team-member" data-full="JGG0sbp66">J</span>
                        <span>-</span>
                        <span class="team-member" data-full="CHY">C</span>
                        <span>-</span>
                        <span class="team-member" data-full="ZQ">Z</span>
                        <span>-</span>
                        <span class="team-member" data-full="Violety">V</span>
                    </div>
                </div>
                <div class="footer-links">
                    <a href="#" class="footer-link">问题反馈</a>
                    <span class="link-divider">·</span>
                    <a href="#" class="footer-link">题目问题</a>
                    <span class="link-divider">·</span>
                    <a href="#" class="footer-link">联系我们</a>
                </div>
            </div>
        </div>
        <div class="footer-glow"></div>
    </footer>
</template>

<script lang="ts" setup>
// 页脚组件逻辑
</script>

<style scoped>
footer {
    position: relative;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #1a1d20;
    box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.2);
    z-index: 10;
    overflow: hidden;
    padding: 40px 0 20px;
}

.footer-bg-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(rgba(66, 185, 131, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.3;
    z-index: 1;
}

.footer-glow {
    position: absolute;
    bottom: -50px;
    left: 50%;
    transform: translateX(-50%);
    width: 70%;
    height: 60px;
    background: radial-gradient(ellipse at center, rgba(66, 185, 131, 0.15), transparent 70%);
    z-index: 1;
    opacity: 0.6;
}

.page-footer {
    margin-top: 0;
    position: relative;
}

.page-footer::before {
    display: none;
}

.footer-container {
    padding: 0 2rem;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 2;
}

.footer-content {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
    gap: 30px;
    margin-bottom: 30px;
}

/* 页脚区域通用样式 */
.footer-section {
    padding: 0 10px;
}

.footer-heading {
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    position: relative;
    padding-bottom: 10px;
}

.footer-heading::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #42b983, transparent);
    transition: width 0.3s ease;
}

.footer-section:hover .footer-heading::after {
    width: 60px;
}

/* 品牌区域样式 */
.brand-section {
    display: flex;
    flex-direction: column;
}

.footer-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    background: linear-gradient(135deg, #42b983, #33c6aa);
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(66, 185, 131, 0.25);
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    margin-bottom: 15px;
}

.logo-icon {
    font-size: 22px;
    color: white;
}

.footer-logo:hover {
    transform: translateY(-3px) rotate(5deg);
    box-shadow: 0 6px 16px rgba(66, 185, 131, 0.35);
}

.footer-branding {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

.footer-left-title {
    color: #ffffff;
    font-size: 22px;
    font-weight: 600;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    letter-spacing: 0.5px;
    position: relative;
    display: inline-block;
}

.footer-left-title::before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #42b983, transparent);
    transition: width 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.footer-left-title:hover {
    color: #42b983;
    transform: translateY(-1px);
    text-shadow: 0 2px 10px rgba(66, 185, 131, 0.3);
}

.footer-left-title:hover::before {
    width: 100%;
}

.footer-left-content {
    color: #999;
    font-size: 14px;
    font-weight: normal;
    letter-spacing: 1px;
    margin-top: 4px;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.footer-slogan {
    color: #777;
    font-size: 13px;
    margin-top: 15px;
    line-height: 1.5;
    max-width: 250px;
}

/* 导航链接区域 */
.footer-nav-links {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.footer-nav-link {
    color: #999;
    text-decoration: none;
    font-size: 14px;
    transition: all 0.3s ease;
    position: relative;
    padding-left: 0;
    width: fit-content;
}

.footer-nav-link::before {
    content: '›';
    opacity: 0;
    margin-right: 5px;
    transition: all 0.3s ease;
    transform: translateX(-5px);
    display: inline-block;
}

.footer-nav-link:hover {
    color: #42b983;
    padding-left: 12px;
}

.footer-nav-link:hover::before {
    opacity: 1;
    transform: translateX(0);
}

/* 联系方式区域 */
.contact-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #999;
    font-size: 14px;
    transition: all 0.3s ease;
}

.contact-item:hover {
    color: #42b983;
    transform: translateX(3px);
}

.contact-icon {
    font-size: 16px;
}

.social-links {
    display: flex;
    gap: 15px;
    margin-top: 12px;
}

.social-link {
    color: #999;
    text-decoration: none;
    font-size: 14px;
    transition: all 0.3s ease;
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
}

.social-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.7;
    transition: all 0.3s ease;
}

.github-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23999'%3E%3Cpath d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'/%3E%3C/svg%3E");
}

.weibo-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23999'%3E%3Cpath d='M10.098 20c-3.809 0-6.9-1.8-6.9-4.02 0-1.17.723-2.52 1.957-3.8.663-.69 1.414-1.31 2.192-1.84.252-.17.476-.33.684-.48.137-.09.275-.19.406-.3-.134-.16-.277-.34-.428-.53-.762-1-1.731-2.91-1.059-4.72.432-1.16 1.445-1.95 2.637-2.07 1.17-.11 2.268.42 2.894 1.42.208.33.387.77.474 1.27.087.49.066 1.02-.039 1.55-.096.49-.296.97-.486 1.42-.071.18-.138.34-.195.49.124.07.258.15.395.24.503.31 1.109.69 1.691 1.13.998.76 1.839 1.6 2.396 2.4.847 1.21 1.053 2.5.53 3.36-.415.69-1.193 1.13-2.112 1.23-.994.11-2.125-.28-3.019-1.05-.536-.46-1.029-1.05-1.47-1.74-.222-.35-.43-.72-.617-1.1-.124-.25-.244-.51-.36-.77-.078.17-.167.35-.267.54-.195.37-.437.77-.731 1.19-1.071 1.55-2.561 3.02-3.563 3.02zm6.997-3.9c.419.05.708-.08.837-.31.112-.2.082-.63-.439-1.43-.479-.69-1.185-1.39-2.036-2.03-.478-.36-1.04-.72-1.514-1.01-.26-.16-.494-.3-.667-.42-.118-.08-.213-.15-.272-.19-.128-.08-.233 0-.283.08-.073.12-.085.37.121.78.232.44.592 1.19.796 1.68.133.32.258.63.368.92.173.45.313.81.388.99.138.33.371.87.67 1.36.354.57.74 1.05 1.099 1.35.518.44 1.082.65 1.517.59.085-.01.283-.04.415-.06zm-1.895-8.42c.538 0 .978.44.978.98s-.44.97-.978.97-.978-.43-.978-.97.44-.98.978-.98zm-2.12-3.88c-.585.13-.99.56-1.14 1.19-.193.78.151 1.86.736 2.62.123.16.255.32.395.47.31-.26.582-.5.805-.67.066-.05.128-.1.18-.15-.103-.26-.207-.53-.293-.79-.122-.38-.205-.72-.224-.97-.019-.26.007-.48.079-.65.235-.55.7-.65 1.024-.63.055-.12.071-.23.061-.33-.042-.38-.216-.92-.41-1.21-.303-.45-.808-.65-1.214-.59z'/%3E%3C/svg%3E");
}

.qq-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23999'%3E%3Cpath d='M12.003 2c-2.265 0-6.29 1.364-6.29 7.325v1.195s-.276 1.451.554 2.126c.44.354.501.842.494 1.354-.83.492-1.789 5.309-.394 6.329 1.043.76 2.958-2.652 2.958-2.652.823.215 1.596.298 2.675.297 1.08-.002 1.852-.085 2.675-.297 0 0 1.915 3.413 2.958 2.652 1.395-1.019.487-5.837.394-6.329-.007-.512.053-1 .494-1.354.83-.675.553-2.126.553-2.126v-1.195c0-5.961-4.025-7.325-6.29-7.325zm-3.5 7.5c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm7.003 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z'/%3E%3C/svg%3E");
}

.social-link:hover .social-icon {
    opacity: 1;
    transform: scale(1.2);
}

/* 底部版权区域 */
.footer-bottom {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
}

.copyright {
    color: #666;
    font-size: 12px;
    letter-spacing: 0.5px;
}

.footer-credits, .footer-links {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #777;
    font-size: 12px;
    letter-spacing: 0.5px;
}

.footer-link {
    color: #888;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    padding: 0 2px;
}

.footer-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #42b983;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
}

.footer-link:hover {
    color: #42b983;
}

.footer-link:hover::after {
    transform: translateX(0);
}

.link-divider {
    color: #555;
}

.credit-item {
    transition: all 0.3s ease;
}

.credit-item:hover {
    color: #42b983;
}

/* 团队成员动画样式 */
.team-credits {
    display: inline-flex;
    align-items: center;
    gap: 2px;
}

.team-member {
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-block;
}

.team-member::after {
    content: attr(data-full);
    position: absolute;
    left: 0;
    top: 0;
    color: #42b983;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.team-member:hover {
    color: transparent;
}

.team-member:hover::after {
    opacity: 1;
    transform: translateX(0);
}

/* 为了让其他字母在展开时不重叠 */
.team-member:hover ~ span {
    transform: translateX(40px);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* 根据不同字母调整位移距离 */
.team-member[data-full="JGG0sbp66"]:hover ~ span {
    transform: translateX(65px);
}

.team-member[data-full="CHY"]:hover ~ span {
    transform: translateX(18px);
}

.team-member[data-full="ZQ"]:hover ~ span {
    transform: translateX(10px);
}

.team-member[data-full="Violety"]:hover ~ span {
    transform: translateX(40px);
}

/* 响应式设计 */
@media (max-width: 1200px) {
    .footer-content {
        grid-template-columns: 1fr 1fr;
        gap: 30px 40px;
    }
}

@media (max-width: 768px) {
    .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
    }
    
    .footer-heading::after {
        left: 50%;
        transform: translateX(-50%);
    }
    
    .footer-nav-links, .contact-info {
        align-items: center;
    }
    
    .footer-nav-link::before {
        display: none;
    }
    
    .footer-nav-link:hover {
        padding-left: 0;
        transform: translateY(-2px);
    }
    
    .contact-item {
        justify-content: center;
    }
    
    .footer-bottom {
        flex-direction: column;
        text-align: center;
    }
    
    .footer-section {
        padding: 15px 0;
    }
    
    .footer-logo {
        margin: 0 auto 15px;
    }
}

@media (max-width: 480px) {
    .social-links {
        flex-direction: column;
        gap: 8px;
        align-items: center;
    }
    
    .footer-links, .footer-credits {
        flex-direction: column;
        gap: 8px;
    }
    
    .link-divider {
        display: none;
    }
}
</style>