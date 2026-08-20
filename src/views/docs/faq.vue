<template>
  <div>
    <AppHeader />
    <div class="docs-content">
      <div class="docs-card">
        <h1>常见问题</h1>

        <section class="qa-block">
          <h2>如何开始做题？</h2>
          <p>
            注册并登录后，进入顶部导航的「题库」，点击任意题目即可进入答题页。在右侧代码编辑器中选择语言、编写代码，点击「提交」即可获得评测结果。
          </p>
        </section>

        <section class="qa-block">
          <h2>支持哪些编程语言？</h2>
          <p>
            目前支持
            C、C++（cpp）、Java、Python。提交前请在答题页左上角的语言选择器中确认所选语言与代码一致。
          </p>
        </section>

        <section class="qa-block">
          <h2>评测结果分别代表什么？</h2>
          <ul>
            <li><strong>答案正确（AC）</strong>：程序在所有测试点上输出了正确结果。</li>
            <li><strong>答案错误（WA）</strong>：程序运行结束，但输出与标准答案不一致。</li>
            <li><strong>时间超限（TLE）</strong>：程序运行时间超过题目时间限制。</li>
            <li><strong>内存超限（MLE）</strong>：程序占用内存超过题目空间限制。</li>
            <li><strong>运行时错误（RE）</strong>：程序运行过程中异常退出（如段错误、除零）。</li>
            <li><strong>编译错误（CE）</strong>：代码无法通过编译，请检查语法。</li>
          </ul>
        </section>

        <section class="qa-block">
          <h2>我的提交记录保存在哪里？</h2>
          <p>
            登录用户的提交记录会保存在答题页「我的提交」标签页中，并同步到个人中心的做题统计与活动热力图。
          </p>
        </section>

        <section class="qa-block">
          <h2>如何参加竞赛？</h2>
          <p>
            进入「竞赛」页面，选择状态为「报名中」或「进行中」的比赛，点击「Let's
            go」进入竞赛详情页报名。比赛开始后，已报名用户可以查看并提交赛题；比赛结束后题目会公开。
          </p>
        </section>

        <section class="qa-block">
          <h2>竞赛排行榜在哪里看？</h2>
          <p>
            排行榜按竞赛维度提供：进入任意竞赛详情页，切换到「排名」标签即可查看该场比赛的实时排名。
          </p>
        </section>

        <section class="qa-block">
          <h2>如何修改头像和个人资料？</h2>
          <p>登录后点击右上角头像进入「个人中心」，即可修改昵称、邮箱、个性签名并上传头像。</p>
        </section>

        <section class="qa-block">
          <h2>忘记密码怎么办？</h2>
          <p>
            在登录页点击「忘记密码」，通过注册邮箱接收验证码后即可重置密码。如邮箱不可用，请通过页脚邮箱联系管理员。
          </p>
        </section>
      </div>
    </div>
    <foot />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import foot from '@/components/foot.vue';
</script>

<style scoped>
.docs-content {
  min-height: calc(100vh - 100px);
  padding: 120px 24px 80px;
  background-color: #f7f9fc;
}

.docs-card {
  max-width: 860px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 48px 56px;
}

h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
}

.qa-block {
  margin-bottom: 28px;
}

h2 {
  font-size: 17px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 10px;
  padding-left: 10px;
  border-left: 3px solid #42b983;
}

p,
li {
  font-size: 14px;
  color: #475569;
  line-height: 1.8;
}

ul {
  padding-left: 22px;
}

@media (max-width: 768px) {
  .docs-card {
    padding: 32px 24px;
  }
}
</style>
