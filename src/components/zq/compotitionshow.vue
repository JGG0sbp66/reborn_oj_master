<template>
    <table class="problems-list">
        <thead class="problems-head">
            <tr>
                <th style="width: 100px;">状态</th>
                <th style="width: 225px;text-align: left;">题目</th>
                <th style="width: 250px;">一血</th>
                <th style="width: 120px;text-align: left;">提交/解决</th>
                <th style="width: 120px;text-align: left;">通过率</th>
            </tr>
        </thead>
        <tbody class="problems-body">
            <tr v-for="(problem, index) in problemsList" :key="problem.u_id">
                <td style="width: 100px;display: flex; justify-content: center; align-items: center;">
                    <svg v-if="problem.state === '已通过'" style="height: 18px;width: 18px;color: #18a058;"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4l8-8z"
                            fill="currentColor"></path>
                    </svg>
                    <svg v-else-if="problem.state === '未通过'" style="height: 18px;width: 18px;color: rgb(208, 48, 80);"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192z" fill="none"
                            stroke="currentColor" stroke-miterlimit="10" stroke-width="32">
                        </path>
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="32" d="M320 320L192 192"></path>
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="32" d="M192 320l128-128"></path>
                    </svg>
                </td>
                <td style="width: 225px;text-align: left;">
                    <a style="text-decoration: none;color:black"
                        :href="`../tabsPage/questions_detail.html?u_id=${problem.u_id}`" target="_blank">
                        {{ KEYS[index] }}. {{ problem.title }}
                    </a>
                </td>
                <td style="width: 250px;display: flex; justify-content: center; align-items: center;"
                    class="first-blood">
                    <template v-if="problem.first_blood">
                        <img src="../../static/image/占位符.jpg">
                        <div>{{ problem.first_blood }}</div>
                    </template>
                </td>
                <td style="width: 120px;text-align: left;">{{ problem.submit }}/{{ problem.solve }}</td>
                <td style="width: 120px;text-align: left;">{{ problem.rate }} %</td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Problem {
    u_id: string
    title: string
    state: string
    first_blood: string | null
    submit: number
    solve: number
    rate: number
}

interface Competition {
    title: string
    start_time: string
    end_time: string
    join_num: number
    topic: string
    state: string
}

const KEYS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

const urlParams = new URLSearchParams(window.location.search)
const uid = urlParams.get('uid') || ''

const problemsList = ref<Problem[]>([])
const competitionInfo = ref<Competition>({
    title: '',
    start_time: '',
    end_time: '',
    join_num: 0,
    topic: '',
    state: ''
})

const statusMap = {
    "未开始": "not-start",
    "已结束": "finished",
    "个人赛": "individual-competition",
    "团队赛": "team-tournament",
    "IOI赛制": "ioi",
    "ACM赛制": "acm",
    "官方比赛": "Official-competition"
} as const

type StatusKey = keyof typeof statusMap

const loadQuestions = async () => {
    try {
        const response = await axios.post('http://localhost/oj/php/contest.php', { uid }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        const { competitions, questionsList } = response.data
        competitionInfo.value = competitions
        problemsList.value = questionsList

        // 更新其他元素
        const contentTitle = document.querySelector('.content-title')
        const startTime = document.querySelector('.start_time')
        const endTime = document.querySelector('.end_time')
        const joinPeople = document.querySelector('.join_people')

        if (contentTitle) contentTitle.textContent = competitions.title
        if (startTime) startTime.textContent = competitions.start_time
        if (endTime) endTime.textContent = competitions.end_time
        if (joinPeople) joinPeople.textContent = `${competitions.join_num}人`

        // 更新比赛主题
        const topicContainer = document.querySelector('.competition-item-topic')
        if (topicContainer) {
            topicContainer.innerHTML = competitions.topic.split(' ')
                .map((topic: string) => `<div class="topic-item ${statusMap[topic as StatusKey] || ''}">${topic}</div>`)
                .join('')
        }

        // 更新面板状态
        const panelState = document.querySelector('#panel-state')
        if (panelState) {
            panelState.innerHTML = `<div class="firpanel-title ${statusMap[competitions.state as StatusKey]}">竞赛${competitions.state}</div>`
        }
    } catch (error) {
        console.error('加载题目失败:', error)
    }
}

// 监听问题按钮点击
const handleProblemsClick = () => {
    loadQuestions()
}

onMounted(() => {
    loadQuestions()
    // 更新链接的 uid
    document.querySelectorAll('.left-penel-item a').forEach(link => {
        const href = link.getAttribute('href')
        if (href) {
            link.setAttribute('href', `${href}?uid=${uid}`)
            link.setAttribute('uid', uid)
        }
    })

    // 添加问题按钮点击事件监听
    const problemsBtn = document.querySelector('#problems-btn')
    if (problemsBtn) {
        problemsBtn.addEventListener('click', handleProblemsClick)
    }
})
</script>

<style scoped>
.left-main {
    max-width: 860px;
}

.problems-list {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    overflow: hidden;
}

.problems-list tr {
    height: 61px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid rgb(239, 239, 245);
}

.problems-head {
    font-size: 14px;
    background-color: #fafafc;
}

.problems-head th {
    font-weight: normal;
    margin-top: 8px;
    margin-bottom: 8px;
}

.problems-body {
    background-color: white;
}

.problems-body td {
    font-size: 14px;
    font-weight: normal;
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
}

.status-accepted {
    background-color: #ecfdf5;
    color: #10b981;
}

.status-wrong {
    background-color: #fef2f2;
    color: #ef4444;
}

.status-pending {
    background-color: #f3f4f6;
    color: #6b7280;
}

.status-default {
    background-color: #f3f4f6;
    color: #6b7280;
}

.problem-link {
    color: #1f2937;
    text-decoration: none;
    transition: color 0.2s ease;
}

.problem-link:hover {
    color: #10b981;
}
</style>
