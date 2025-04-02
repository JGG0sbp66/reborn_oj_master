<template>
    <div class="left-penel">
        <div style="margin-top: 15px;">
            <div id="problems-btn" class="left-penel-item panel-item-active"><a href="problems">
                    <svg class="panel-item-active" xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20">
                        <g fill="none">
                            <path
                                d="M9 8.5a.5.5 0 0 1 .5-.5H13a.5.5 0 0 1 0 1H9.5a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5H13a.5.5 0 0 1 0 1H9.5a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5H13a.5.5 0 0 1 0 1H9.5a.5.5 0 0 1-.5-.5zm-1-6a.75.75 0 1 1-1.5 0a.75.75 0 0 1 1.5 0zm0 3a.75.75 0 1 1-1.5 0a.75.75 0 0 1 1.5 0zm-.75 3.75a.75.75 0 1 0 0-1.5a.75.75 0 0 0 0 1.5zM7.085 3A1.5 1.5 0 0 1 8.5 2h3a1.5 1.5 0 0 1 1.415 1H14.5A1.5 1.5 0 0 1 16 4.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 4 16.5v-12A1.5 1.5 0 0 1 5.5 3h1.585zM8.5 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM7.085 4H5.5a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5h-1.585A1.5 1.5 0 0 1 11.5 5h-3a1.5 1.5 0 0 1-1.415-1z"
                                fill="currentColor"></path>
                        </g>
                    </svg>
                    <div class="panel-item-active">题目</div>
                </a></div>
            <div id="ranks-btn" class="left-penel-item"><a href="ranks">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 24 24">
                        <g fill="none">
                            <path
                                d="M8.5 5.23a2.25 2.25 0 0 1 2.25-2.25h2.5a2.25 2.25 0 0 1 2.25 2.25V7h3.25A2.25 2.25 0 0 1 21 9.25v11a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1-.75-.75v-8A2.25 2.25 0 0 1 5.25 10H8.5V5.23zM10 19.5h4V5.23a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75V19.5zm-1.5-8H5.25a.75.75 0 0 0-.75.75v7.25h4v-8zm7 8h4V9.25a.75.75 0 0 0-.75-.75H15.5v11z"
                                fill="currentColor"></path>
                        </g>
                    </svg>
                    <div>排名</div>
                </a></div>
        </div>
    </div>
</template>

<script lang="ts" setup></script>
<style scoped>
.left-penel {
    width: 64px;
    background-color: #fff;
    height: 100%;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.left-penel-item {
    display: flex;
    flex-direction: column;
    width: 48px;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    margin-bottom: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
}

.left-penel-item svg {
    height: 24px;
    width: 24px;
    color: #767c82;
}

.left-penel-item a {
    text-decoration: none;
    color: #767c82;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 14px;
}
.panel-item-active{
    color: #18a058 !important; 
    background-color: #f3f3f5 !important;
    border-radius: 10px;
}
</style>