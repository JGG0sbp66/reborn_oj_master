<template>
  <div>
    <AppHeader />
    <div class="docs-content">
      <div class="docs-card">
        <h1>服务条款</h1>
        <p class="update-time">最后更新：2026 年 8 月</p>

        <section class="terms-block">
          <h2>一、服务说明</h2>
          <p>
            OJ
            Master（判题大师）是一个在线编程评测平台，为用户提供题目练习、代码评测、竞赛组织与排名等服务。注册并使用本平台，即表示您同意遵守本条款。
          </p>
        </section>

        <section class="terms-block">
          <h2>二、账号责任</h2>
          <ul>
            <li>您应妥善保管账号与密码，因账号保管不善造成的损失由您自行承担。</li>
            <li>注册信息应真实有效，不得冒用他人身份。</li>
            <li>发现账号异常或安全漏洞，请及时通过页脚邮箱通知我们。</li>
          </ul>
        </section>

        <section class="terms-block">
          <h2>三、使用规范</h2>
          <ul>
            <li>
              禁止提交恶意代码，包括但不限于试图攻击评测机、窃取测试数据、耗尽系统资源的程序。
            </li>
            <li>禁止利用平台漏洞获取不正当利益；发现漏洞请向我们报告。</li>
            <li>竞赛中请遵守各场比赛公布的规则，禁止抄袭、多账号协作等作弊行为。</li>
            <li>违反上述规范的账号，平台有权限制功能、封禁账号并清空相关成绩。</li>
          </ul>
        </section>

        <section class="terms-block">
          <h2>四、内容与版权</h2>
          <ul>
            <li>
              平台题目、测试数据及相关内容的知识产权归平台及题目作者所有，未经许可不得转载或用于商业用途。
            </li>
            <li>您提交的代码版权归您所有，但您授权平台为评测、统计与展示之目的使用该代码。</li>
          </ul>
        </section>

        <section class="terms-block">
          <h2>五、服务变更与中断</h2>
          <p>
            平台可能因维护、升级或不可抗力暂停部分或全部服务，并尽可能提前公告。对于服务中断造成的损失，平台在法律允许范围内不承担责任。
          </p>
        </section>

        <section class="terms-block">
          <h2>六、免责声明</h2>
          <p>
            平台按「现状」提供服务，不保证服务完全无错误、不中断。评测结果仅供学习参考。因使用本平台产生的任何间接损失，平台不承担责任。
          </p>
        </section>

        <section class="terms-block">
          <h2>七、条款修改</h2>
          <p>我们可能适时修订本条款，修订后将在本页面公布。继续使用平台即视为接受修订后的条款。</p>
        </section>

        <section class="terms-block">
          <h2>八、联系我们</h2>
          <p>
            如对本条款有任何疑问，请发送邮件至
            <a href="mailto:oj_master@163.com">oj_master@163.com</a>。
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
  margin-bottom: 8px;
}

.update-time {
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
}

.terms-block {
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

a {
  color: #42b983;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .docs-card {
    padding: 32px 24px;
  }
}
</style>
