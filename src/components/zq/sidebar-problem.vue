<template>
    <div class="sidebar-container">
        <div class="sidebar-items">
            <div id="problems-btn" class="sidebar-item active">
                    <div class="item-icon problem-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 6H16M8 10H16M8 14H12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="item-text">题目</div>
            </div>
            <div id="ranks-btn" class="sidebar-item">
                <router-link to="/contest/ranks">
                    <div class="item-icon rank-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 20V10M12 20V4M18 20V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="item-text">排名</div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.sidebar-container {
    height: 100%;
    width: 70px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    transition: all 0.3s ease;
}

.sidebar-items {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    width: 100%;
}

.sidebar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 0;
    width: 100%;
    cursor: pointer;
    transition: all 0.3s ease;
}

.sidebar-item a {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: #64748b;
    gap: 6px;
    width: 100%;
}

.item-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.problem-icon {
    background-color: #ecfdf5;
    color: #10b981;
}

.rank-icon {
    background-color: #f3f4f6;
    color: #9ca3af;
}

.item-text {
    font-size: 13px;
    font-weight: 500;
    margin-top: 2px;
}

.sidebar-item.active .item-icon {
    background-color: #ecfdf5;
    color: #10b981;
}

.sidebar-item.active .item-text {
    color: #10b981;
}

.sidebar-item:hover:not(.active) .item-icon {
    transform: translateY(-2px);
}

.sidebar-item svg {
    width: 24px;
    height: 24px;
}
</style>