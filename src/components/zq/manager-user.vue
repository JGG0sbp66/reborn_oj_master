<template>
    <div class="page-header">
                <div class="header-left">
                    <h2 class="page-title">用户管理</h2>
                    <p class="page-description">管理所有用户权限，包括创建、编辑和封禁用户</p>
                </div>
                <div class="header-right">
                    <el-button type="primary" class="create-button" @click="CreateRace">
                        <el-icon class="button-icon"><Plus /></el-icon>
                        <span>创建用户</span>
                    </el-button>
                    <el-button type="danger" class="ban-button" @click="openBanDialog()">
                        <el-icon class="button-icon"><CircleCloseFilled /></el-icon>
                        <span>封禁用户</span>
                    </el-button>
                    <race-create @refreshData="fetchData" :alertBoxRef="alertBox" ref="raceCreateRef" />
                    <race-edit @refreshData="fetchData" :alertBoxRef="alertBox" ref="raceEditRef" />
                    <race-detail @refreshData="fetchData" @editRace="handleEditFromDetail" :alertBoxRef="alertBox" ref="raceDetailRef" />
                </div>
            </div>

            <AlertBox ref="alertBox" />

            <div class="filter-bar">
                <div class="filter-left">
                    <el-input
                        placeholder="搜索用户名称或ID"
                        prefix-icon="Search"
                        v-model="searchQuery"
                        clearable
                        class="search-input"
                        @input="handleSearch"
                    >
                        <template #append>
                            <el-button @click="handleSearch" style="background-color: #18a058; border-color: #18a058; color: white;">搜索</el-button>
                        </template>
                    </el-input>
                    <el-button type="primary" plain @click="showAdvancedSearch = !showAdvancedSearch" style="background-color: rgba(24, 160, 88, 0.05); border-color: #18a05880; color: #18a058;">
                        {{ showAdvancedSearch ? '收起' : '高级筛选' }}
                        <el-icon>
                            <component :is="showAdvancedSearch ? 'ArrowUp' : 'ArrowDown'" />
                        </el-icon>
                    </el-button>
                </div>
            </div>

            <transition name="dropdown">
                <div class="advanced-search" v-if="showAdvancedSearch">
                    <div class="advanced-search-header">
                        <h3 class="advanced-search-title">高级筛选</h3>
                        <el-button type="text" @click="resetAdvancedSearch" class="reset-btn">
                            <el-icon><Refresh /></el-icon> 重置筛选
                        </el-button>
                    </div>
                    <div class="advanced-search-content">
                        <div class="search-row">
                            <div class="search-item">
                                <span class="search-label">用户状态:</span>
                                <el-select v-model="statusFilter" placeholder="用户状态" clearable @change="handleSearch" style="flex: 1; max-width: 200px;">
                                    <el-option label="全部" value="" />
                                    <el-option label="报名中" value="upcoming" />
                                    <el-option label="进行中" value="running" />
                                    <el-option label="已结束" value="ended" />
                                </el-select>
                            </div>
                            <div class="search-item">
                                <span class="search-label">用户时长:</span>
                                <el-select v-model="durationFilter" placeholder="用户时长" clearable @change="handleSearch" style="flex: 1; max-width: 200px;">
                                    <el-option label="全部" value="" />
                                    <el-option label="1天以内" value="<1" />
                                    <el-option label="1-3天" value="1-3" />
                                    <el-option label="3天以上" value=">3" />
                                </el-select>
                            </div>
                        </div>
                        <div class="search-row">
                            <div class="search-item">
                                <span class="search-label">用户类型:</span>
                                <el-select v-model="competitionTypeFilter" placeholder="用户类型" clearable @change="handleSearch" style="flex: 1; max-width: 200px;">
                                    <el-option label="全部" value="" />
                                    <el-option label="个人赛" value="individual" />
                                    <el-option label="团队赛" value="team" />
                                </el-select>
                            </div>
                            <div class="search-item">
                                <span class="search-label">赛制类型:</span>
                                <el-select v-model="competitionModeFilter" placeholder="赛制类型" clearable @change="handleSearch" style="flex: 1; max-width: 200px;">
                                    <el-option label="全部" value="" />
                                    <el-option label="ACM赛制" value="acm" />
                                    <el-option label="OI赛制" value="oi" />
                                </el-select>
                            </div>
                        </div>
                        <div class="search-item full-width">
                            <span class="search-label">日期范围:</span>
                            <el-date-picker
                                v-model="dateRange"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                format="YYYY-MM-DD"
                                @change="handleSearch"
                                style="flex: 1; max-width: 400px;"
                            />
                        </div>
                        <div class="search-item full-width">
                            <span class="search-label">参与人数:</span>
                            <el-slider
                                v-model="participantsRange"
                                range
                                :min="0"
                                :max="200"
                                :marks="{0: '0', 50: '50', 100: '100', 150: '150', 200: '200'}"
                                @change="handleSearch"
                                style="flex: 1;"
                            />
                        </div>
                    </div>
                    <div class="advanced-search-footer">
                        <div class="search-result-info">已筛选出 {{ totalCompetitions }} 场用户</div>
                        <div class="search-actions">
                            <el-button type="primary" @click="applyAdvancedSearch">应用</el-button>
                        </div>
                    </div>
                </div>
            </transition>

            <div class="batch-operations" v-if="selectedCompetitions.length > 0">
                <div class="selected-count">已选择 {{ selectedCompetitions.length }} 场用户</div>
                <!-- <div class="batch-actions">
                    <el-button type="primary" plain size="small" @click="batchExport">批量导出</el-button>
                    <el-button type="warning" plain size="small" @click="batchChangeStatus">修改状态</el-button>
                    <el-button type="danger" plain size="small" @click="batchDelete">批量删除</el-button>
                </div> -->
            </div>

            <div class="competition-table">
                <el-table
                    :data="filteredCompetitions"
                    style="width: 100%"
                    :row-class-name="tableRowClassName"
                    v-loading="loading"
                    @selection-change="handleSelectionChange"
                    :border="false"
                    stripe
                    :cell-style="cellStyle"
                    :header-cell-style="{ backgroundColor: '#f8f9fa', color: '#2c3e50', fontWeight: '600'}"
                    :show-overflow-tooltip="false"
                    :max-height="'none'"
                    :height="'auto'"
                >
                    <el-table-column type="selection" width="50" align="center" />
                    <el-table-column prop="uid" label="uid" width="110" align="center" />
                    <el-table-column prop="username" label="用户名" min-width="100" />
                    <el-table-column prop="role" label="注册时间" width="200" align="center" />
                    <el-table-column label="状态" width="200" align="center">
                        <template #default="scope">
                            <span class="user-status" :class="scope.row.rating === '已封禁' ? 'banned' : 'normal'">
                                {{ scope.row.rating }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180" fixed="right" align="center">
                        <template #default="scope">
                            <div class="action-buttons">
                                <el-button 
                                    :type="scope.row.rating === '已封禁' ? 'success' : 'danger'" 
                                    size="small" 
                                    text
                                    @click="scope.row.rating === '已封禁' ? unbanUser(scope.row) : banUser(scope.row)"
                                >
                                    {{ scope.row.rating === '已封禁' ? '解封' : '封禁' }}
                                </el-button>
                                <el-button 
                                    type="primary" 
                                    size="small" 
                                    text
                                    @click="manageUser(scope.row)"
                                >
                                    管理
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div class="pagination-container">
                <div class="pagination">
                    <button class="page-btn prev-btn" :disabled="currentPage === 1" @click="handleCurrentChange(currentPage - 1)">
                        <span class="chevron-left"></span>
                    </button>
                    <div class="page-numbers">
                        <button 
                            v-for="num in displayedPages" 
                            :key="num"
                            class="page-number"
                            :class="{ active: currentPage === num }"
                            @click="handleCurrentChange(num)"
                        >
                            {{ num }}
                        </button>
                    </div>
                    <button class="page-btn next-btn" :disabled="currentPage === totalPages" @click="handleCurrentChange(currentPage + 1)">
                        <span class="chevron-right"></span>
                    </button>
                </div>
            </div>

            <!-- 封禁用户弹窗 -->
            <el-dialog
                v-model="banDialogVisible"
                title="封禁用户"
                width="500px"
                custom-class="ban-user-dialog"
                :close-on-click-modal="false"
            >
                <el-form 
                    ref="banFormRef"
                    :model="banForm"
                    :rules="banRules"
                    label-position="top"
                    class="ban-form"
                >
                    <el-form-item label="用户UID" prop="uid" required>
                        <el-input 
                            v-model="banForm.uid" 
                            placeholder="请输入用户UID" 
                            :disabled="!!selectedUser"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="封禁原因" prop="ban_reason" required>
                        <el-input 
                            v-model="banForm.ban_reason" 
                            type="textarea" 
                            rows="3" 
                            placeholder="请输入封禁原因"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="封禁类型" class="ban-type-selector">
                        <el-radio-group v-model="banForm.is_permanent">
                            <el-radio :label="false">临时封禁</el-radio>
                            <el-radio :label="true">永久封禁</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="!banForm.is_permanent" label="封禁结束时间" class="ban-time-selector">
                        <el-date-picker
                            v-model="banForm.ban_end_time"
                            type="datetime"
                            placeholder="选择封禁结束时间"
                            format="YYYY-MM-DD HH:mm:ss"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            style="width: 100%"
                        ></el-date-picker>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="banDialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="submitBanUser" :loading="banSubmitting">确认封禁</el-button>
                    </div>
                </template>
            </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance } from 'element-plus';
import { Plus, Search, ArrowUp, ArrowDown, Timer, Collection, Refresh, CircleCloseFilled } from '@element-plus/icons-vue';
import AlertBox from '../JGG/alertbox.vue';
import axios from 'axios';
import RaceCreate from './race-create.vue';
import RaceEdit from './race-edit.vue';
import RaceDetail from './race-detail.vue';
import { h, ref as vueRef } from 'vue';

// 定义用户标签类型
interface CompetitionTag {
  name: string;
  type: string;
}

// 定义API返回的用户数据类型
interface ApiCompetition {
  uid: number;
  title: string;
  logos?: string[];
  start_time: string;
  end_time: string;
  duration: string;
  tags?: CompetitionTag[];
  created_at: string;
  updated_at: string;
  problems_list?: number[];
  user_list?: number[];
  status: string;
  description?: string;
}

// 定义示例数据类型
interface ExampleItem {
  input: string;
  output: string;
  explanation: string;
}

// 定义表格显示的用户数据类型
interface FormattedCompetition {
  id: string;
  title: string;
  participantsCount: number;
  startTime: string;
  endTime: string;
  status: string;
  raw?: ApiCompetition;
}

// AlertBox引用
const alertBox = ref(null);
const raceCreateRef = ref(null);
const raceEditRef = ref(null);
const raceDetailRef = ref(null);

// 页面状态
const loading = ref(false);
const searchQuery = ref('');
const statusFilter = ref('');
const dateRange = ref([]);
const currentPage = ref(1);
const pageSize = ref(8);
const totalCompetitions = ref(100);
const showAdvancedSearch = ref(false);
const participantsRange = ref([0, 200]);
const durationFilter = ref('');
const selectedCompetitions = ref([]);
const searchTimeout = ref(null);
const competitionTypeFilter = ref('');
const competitionModeFilter = ref('');

// 用户数据
const competitions = ref([]);
// 预取的下一页数据缓存
const nextPageCache = ref([]);
// 分页数据缓存，key为页码，value为用户数据
const pageDataCache = ref({});

// 总页数
const totalPages = ref(1);

// 当前显示的页码数组（最多显示5个页码按钮，含当前页）
const displayedPages = computed(() => {
  const pages = [];
  // 总页数小于等于7时全部显示
  if (totalPages.value <= 7) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
    return pages;
  }
  // 当前页靠近开头
  if (currentPage.value <= 4) {
    pages.push(1, 2, 3, 4, 5, '...', totalPages.value);
    return pages;
  }
  // 当前页靠近结尾
  if (currentPage.value >= totalPages.value - 3) {
    pages.push(1, '...', totalPages.value - 4, totalPages.value - 3, totalPages.value - 2, totalPages.value - 1, totalPages.value);
    return pages;
  }
  // 当前页在中间，两侧省略
  pages.push(1, '...', currentPage.value - 1, currentPage.value, currentPage.value + 1, '...', totalPages.value);
  return pages;
});

// 创建用户
const CreateRace = () => {
  if (raceCreateRef.value) {
    raceCreateRef.value.openCreateDialog();
  }
};

// 获取用户列表（新接口）
const fetchUsers = async (page = 1) => {
  // 保证页码不小于1
  const safePage = page < 1 ? 1 : page;
  try {
    const res = await axios.post('/api/admin-get-user-list', {
      page: safePage
      // 其他参数可选
    });
    if (res.data.success) {
      return res.data.data; // 返回数据
    } else {
      alertBox.value?.show('获取用户数据失败，请稍后重试', 1);
      return null;
    }
  } catch (e) {
    console.error('用户数据请求异常', e);
    alertBox.value?.show('获取用户数据失败，请稍后重试', 1);
    return null;
  }
};

// 格式化用户数据，适配表格
const formatUserData = (data: any[]): any[] => {
  return data.map(user => ({
    uid: user.uid,
    username: user.username,
    role: user.create_time || '', // 注册时间
    rating: user.is_banned ? '已封禁' : '未封禁', // 状态
    raw: user, // 保留原始数据
  }));
};

// 获取并设置当前页数据，optionally预取下一页
const fetchData = async (preloadNext = false) => {
  loading.value = true;
  try {
    // 优先从缓存取
    if (pageDataCache.value[currentPage.value]) {
      competitions.value = pageDataCache.value[currentPage.value];
    } else {
      // 当前页
      const res = await fetchUsers(currentPage.value);
      const users = res?.users || res?.data?.users || [];
      const formatted = formatUserData(users);
      competitions.value = formatted;
      pageDataCache.value[currentPage.value] = formatted;
      totalCompetitions.value = res?.total_items || res?.data?.total_items || 0;
      totalPages.value = res?.total_pages || res?.data?.total_pages || 1;
    }
    // 预取下一页
    if (preloadNext) {
      const nextPage = currentPage.value + 1;
      if (!pageDataCache.value[nextPage]) {
        const nextRes = await fetchUsers(nextPage);
        const nextUsers = nextRes?.users || nextRes?.data?.users || [];
        const nextFormatted = formatUserData(nextUsers);
        nextPageCache.value = nextFormatted;
        pageDataCache.value[nextPage] = nextFormatted;
      } else {
        nextPageCache.value = pageDataCache.value[nextPage];
      }
    }
  } catch (error) {
    console.error('获取用户数据失败:', error);
    alertBox.value?.show('获取用户数据失败，请稍后重试', 1);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  // 获取第一页数据并预取第二页
  await fetchData(true);
  // 告知子组件预加载题目数据
  if (raceCreateRef.value) {
    raceCreateRef.value.loadAvailableProblems();
  }
  if (raceEditRef.value) {
    raceEditRef.value.loadAvailableProblems();
  }
});

// 处理延迟搜索，避免频繁过滤
const handleSearch = () => {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
    }
    
    searchTimeout.value = setTimeout(() => {
        console.log('搜索条件:', {
            searchQuery: searchQuery.value,
            status: statusFilter.value,
            dateRange: dateRange.value,
            participantsRange: participantsRange.value,
            durationFilter: durationFilter.value,
            competitionTypeFilter: competitionTypeFilter.value,
            competitionModeFilter: competitionModeFilter.value
        });
        
        // 触发过滤计算
        // 如果是API请求，这里不需要手动触发，因为计算属性会自动重新计算
    }, 300);
};

// 处理表格选择变更
const handleSelectionChange = (selection: any[]) => {
    selectedCompetitions.value = selection;
};

// 批量操作方法
const batchExport = () => {
    const ids = selectedCompetitions.value.map((competition: any) => competition.id).join(', ');
    alertBox.value.show(`已导出用户: ${ids}`, 0);
};

const batchChangeStatus = () => {
    ElMessageBox.prompt('请选择新的用户状态', '批量修改状态', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.*/ // 使用正则表达式验证
    }).then(({ value }) => {
        const ids = selectedCompetitions.value.map((competition: FormattedCompetition) => competition.id).join(', ');
        if (alertBox.value) {
            alertBox.value.show(`已将用户 ${ids} 的状态修改为 ${value}`, 0);
        }
    }).catch(() => {
        if (alertBox.value) {
            alertBox.value.show('已取消操作', 1);
        }
    });
};

const batchDelete = () => {
    const ids = selectedCompetitions.value.map((competition: any) => competition.id).join(', ');
    ElMessageBox.confirm(
        `确定要删除这 ${selectedCompetitions.value.length} 场用户吗？此操作不可逆。`,
        '批量删除确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
    .then(() => {
        alertBox.value.show(`已删除用户: ${ids}`, 0);
        selectedCompetitions.value = [];
    })
    .catch(() => {
        alertBox.value.show('已取消删除', 1);
    });
};

// 监听筛选条件变化，重置分页
watch([searchQuery, statusFilter, dateRange, participantsRange, durationFilter, competitionTypeFilter, competitionModeFilter], () => {
    currentPage.value = 1;
});

// 过滤后的用户数据
const filteredCompetitions = computed(() => {
    // 只做过滤，不做分页切片
    return competitions.value.filter((user: any) => {
        // 搜索过滤
        const matchesSearch = searchQuery.value
            ? user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
              String(user.uid).includes(searchQuery.value)
            : true;
        // 状态过滤
        const matchesStatus = statusFilter.value
            ? user.rating === statusFilter.value
            : true;
        // 其他过滤条件可根据需要添加
        return matchesSearch && matchesStatus;
    });
});

// 表格行样式
const tableRowClassName = ({ row }: { row: any }) => {
    if (row.status === '进行中') {
        return 'active-row';
    } else if (row.status === '报名中') {
        return 'registration-row';
    }
    return '';
};

// 获取状态标签类型
const getStatusType = (status: string) => {
    switch (status) {
        case '进行中': return 'success';
        case '报名中': return 'warning';
        case '已结束': return 'info';
        default: return 'info';
    }
};

// 分页处理
const handleCurrentChange = async (page: number) => {
    currentPage.value = page;
    // 优先从缓存取
    if (pageDataCache.value[page]) {
      competitions.value = pageDataCache.value[page];
      // 预取下一页
      const nextPage = page + 1;
      if (!pageDataCache.value[nextPage]) {
        loading.value = true;
        try {
          const nextRes = await fetchUsers(nextPage);
          const nextUsers = nextRes?.users || nextRes?.data?.users || [];
          const nextFormatted = formatUserData(nextUsers);
          nextPageCache.value = nextFormatted;
          pageDataCache.value[nextPage] = nextFormatted;
        } catch (e) {
          nextPageCache.value = [];
        } finally {
          loading.value = false;
        }
      } else {
        nextPageCache.value = pageDataCache.value[nextPage];
      }
    } else {
      // 其他页正常请求
      await fetchData(page === 1); // 如果是第一页，预取第二页
    }
};

// 封禁用户相关
const banDialogVisible = ref(false);
const banSubmitting = ref(false);
const selectedUser = ref(null);
const banFormRef = ref(null);

// 封禁表单数据
const banForm = ref({
    uid: '',
    ban_reason: '',
    ban_end_time: '',
    is_permanent: false
});

// 表单验证规则
const banRules = {
    uid: [
        { required: true, message: '请输入用户UID', trigger: 'blur' },
        { type: 'number', message: 'UID必须为数字', trigger: 'blur', transform: (val: string) => Number(val) }
    ],
    ban_reason: [
        { required: true, message: '请输入封禁原因', trigger: 'blur' },
        { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
    ]
};

// 打开封禁弹窗
const openBanDialog = (user: any = null) => {
    selectedUser.value = user;
    banForm.value = {
        uid: user ? user.uid : '',
        ban_reason: '',
        ban_end_time: '',
        is_permanent: false
    };
    banDialogVisible.value = true;
};

// 提交封禁用户
const submitBanUser = () => {
    if (banFormRef.value) {
        banFormRef.value.validate(async (valid) => {
            if (valid) {
                try {
                    banSubmitting.value = true;
                    
                    await axios.post('/api/admin-ban-user', {
                        uid: Number(banForm.value.uid),
                        ban_reason: banForm.value.ban_reason,
                        ban_end_time: banForm.value.is_permanent ? null : banForm.value.ban_end_time
                    });
                    
                    ElMessage.success('用户已被封禁');
                    alertBox.value?.show(`用户ID ${banForm.value.uid} 已被封禁`, 0);
                    banDialogVisible.value = false;
                    
                    // 清除当前页的缓存，确保获取最新数据
                    delete pageDataCache.value[currentPage.value];
                    // 重新获取当前页数据
                    await fetchData(false);
                } catch (error: any) {
                    ElMessage.error(`封禁失败: ${error.response?.data?.message || error.message || '服务器错误'}`);
                    alertBox.value?.show(`封禁失败: ${error.response?.data?.message || error.message || '服务器错误'}`, 1);
                } finally {
                    banSubmitting.value = false;
                }
            }
        });
    }
};

// 封禁用户按钮点击事件
const banUser = (user: any = null) => {
    openBanDialog(user);
};

// 解封用户
const unbanUser = async (user: any) => {
    try {
        // 确认解封
        await ElMessageBox.confirm(
            `确定要解封用户 ${user.username} (ID: ${user.uid}) 吗？`,
            '解封确认',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        );
        
        // 显示加载状态
        loading.value = true;
        
        // 调用解封接口
        await axios.post('/api/admin-unban-user', {
            uid: user.uid
        });
        
        // 显示成功消息
        ElMessage.success('用户已被解封');
        alertBox.value?.show(`用户 ${user.username} 已被解封`, 0);
        
        // 清除当前页的缓存，确保获取最新数据
        delete pageDataCache.value[currentPage.value];
        // 重新获取当前页数据
        await fetchData(false);
    } catch (error: any) {
        // 如果是用户取消操作，不显示错误
        if (error === 'cancel' || error?.toString().includes('cancel')) {
            return;
        }
        
        // 显示错误消息
        ElMessage.error(`解封失败: ${error.response?.data?.message || error.message || '服务器错误'}`);
        alertBox.value?.show(`解封失败: ${error.response?.data?.message || error.message || '服务器错误'}`, 1);
    } finally {
        // 隐藏加载状态
        loading.value = false;
    }
};

// 管理用户（弹窗展示用户信息，带分页）
const manageUser = (user: any) => {
    // 分页相关
    const pageSize = 8; // 增加每页显示条目数，从5条改为8条
    const questions = user.raw?.questions || [];
    const races = user.raw?.race || [];
    const qPage = vueRef(1);
    const rPage = vueRef(1);
    const totalQPages = Math.max(1, Math.ceil(questions.length / pageSize));
    const totalRPages = Math.max(1, Math.ceil(races.length / pageSize));

    // 生成分页内容
    const getQuestionsHtml = () => {
        if (!questions.length) return '<div class="empty-data">暂无题目数据</div>';
        const start = (qPage.value - 1) * pageSize;
        const end = start + pageSize;
        const pageData = questions.slice(start, end);
        let html = '<div class="problem-list">' + pageData.map((q: any) => {
            // 根据难度设置标签样式
            const difficultyClass = q.difficulty === 'easy' ? 'tag-easy' : 
                                  q.difficulty === 'medium' ? 'tag-medium' : 
                                  q.difficulty === 'hard' ? 'tag-hard' : 'tag-easy';
            
            const difficultyText = q.difficulty === 'easy' ? '入门' : 
                                q.difficulty === 'medium' ? '普及' : 
                                q.difficulty === 'hard' ? '提高' : '入门';
            
            return `
                <div class="problem-item">
                    <div class="problem-title">${q.question_title || `题目${q.question_uid}`}</div>
                    <div class="problem-meta">
                        <span class="problem-tag ${difficultyClass}">${difficultyText}</span>
                        <span class="problem-time">${q.submit_time}</span>
                    </div>
                </div>
            `;
        }).join('') + '</div>';
        if (totalQPages > 1) {
            html += `
                <div class="dialog-pagination">
                    <button class="page-btn ${qPage.value===1?'disabled':''}" onclick="window.__qPrevPage&&window.__qPrevPage()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <span class="page-info">第 ${qPage.value}/${totalQPages} 页</span>
                    <button class="page-btn ${qPage.value===totalQPages?'disabled':''}" onclick="window.__qNextPage&&window.__qNextPage()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                </div>
            `;
        }
        return html;
    };
    
    const getRacesHtml = () => {
        if (!races.length) return '<div class="empty-data">暂无竞赛数据</div>';
        const start = (rPage.value - 1) * pageSize;
        const end = start + pageSize;
        const pageData = races.slice(start, end);
        let html = '<div class="problem-list">' + pageData.map((r: any) => {
            return `
                <div class="problem-item">
                    <div class="problem-title">${r.race_name || `竞赛${r.race_uid}`}</div>
                    <div class="problem-meta">
                        <span class="problem-time">${r.register_time}</span>
                    </div>
                </div>
            `;
        }).join('') + '</div>';
        if (totalRPages > 1) {
            html += `
                <div class="dialog-pagination">
                    <button class="page-btn ${rPage.value===1?'disabled':''}" onclick="window.__rPrevPage&&window.__rPrevPage()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <span class="page-info">第 ${rPage.value}/${totalRPages} 页</span>
                    <button class="page-btn ${rPage.value===totalRPages?'disabled':''}" onclick="window.__rNextPage&&window.__rNextPage()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                </div>
            `;
        }
        return html;
    };

    // 用户简介
    const description = user.raw?.description || '';
    const descHtml = description 
        ? `<div class="user-brief"><span class="info-label">简介：</span>${description}</div>` 
        : '';
        
    // 获取用户身份
    const userRole = user.raw?.role || 'user';
    const roleText = userRole === 'admin' ? '管理员' : 
                    userRole === 'superAdmin' ? '超级管理员' : '普通用户';
    const roleClass = userRole === 'admin' ? 'admin-role' : 
                    userRole === 'superAdmin' ? 'super-admin-role' : 'user-role';

    // 用户基本信息
    const userInfoHtml = `
        <div class="user-info-header">
            <div class="user-avatar">
                ${user.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div class="user-info-main">
                <div class="user-name">${user.username}</div>
                <div class="user-meta">
                    <span class="meta-item">ID: <span class="meta-value">${user.uid}</span></span>
                    <span class="meta-item status-badge ${user.rating === '已封禁' ? 'banned' : ''}">${user.rating}</span>
                    <span class="meta-item role-badge ${roleClass}">${roleText}</span>
                </div>
            </div>
        </div>
        ${descHtml}
    `;

    // 事件挂载到window（Element Plus MessageBox不支持直接绑定vue事件）
    // @ts-ignore
    window.__qPrevPage = () => { if(qPage.value>1){ qPage.value--; updateBox(); } };
    // @ts-ignore
    window.__qNextPage = () => { if(qPage.value<totalQPages){ qPage.value++; updateBox(); } };
    // @ts-ignore
    window.__rPrevPage = () => { if(rPage.value>1){ rPage.value--; updateBox(); } };
    // @ts-ignore
    window.__rNextPage = () => { if(rPage.value<totalRPages){ rPage.value++; updateBox(); } };

    // 更新弹窗内容
    const updateBox = () => {
        const html = `
            <div class="user-detail-content">
                ${userInfoHtml}
                
                <div class="user-sections">
                    <div class="user-section">
                        <div class="detail-header">
                            <h3 class="detail-title">解题记录</h3>
                            <div class="detail-indicator"></div>
                        </div>
                        ${getQuestionsHtml()}
                    </div>
                    
                    <div class="user-section">
                        <div class="detail-header">
                            <h3 class="detail-title">参与竞赛</h3>
                            <div class="detail-indicator"></div>
                        </div>
                        ${getRacesHtml()}
                    </div>
                </div>
            </div>
        `;
        const box = document.querySelector('.el-message-box__message');
        if (box) box.innerHTML = html;
    };

    ElMessageBox.alert(
        `<div class="user-detail-content">加载中...</div>`,
        '用户信息',
        {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '关闭',
            customClass: 'user-detail-dialog',
            callback: () => {
                // @ts-ignore
                delete window.__qPrevPage;
                // @ts-ignore
                delete window.__qNextPage;
                // @ts-ignore
                delete window.__rPrevPage;
                // @ts-ignore
                delete window.__rNextPage;
            }
        }
    );
    
    // 使用setTimeout让弹窗先显示再加载内容
    setTimeout(updateBox, 100);
};

// 表格单元格样式，用户名列左对齐，其余居中
const cellStyle = ({ column }: any) => {
  if (column.property === 'username') {
    return { textAlign: 'left', padding: '12px 0' };
  }
  return { textAlign: 'center', padding: '12px 0' };
};
</script>

<style scoped>
    .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.page-title {
    font-size: 24px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
    margin-bottom: 8px;
}

.page-description {
    font-size: 14px;
    color: #6a778e;
    margin: 0;
}

.filter-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 16px;
}

.filter-left {
    display: flex;
    gap: 12px;
    align-items: center;
}

.filter-right {
    display: flex;
    gap: 16px;
}

.search-input {
    width: 300px;
}

.advanced-search {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    border-left: 3px solid rgba(24, 160, 88, 0.3);
    transition: all 0.3s ease;
}

.advanced-search-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.advanced-search-title {
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
    position: relative;
}

.advanced-search-title::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 16px;
    background-color: #18a058;
    border-radius: 2px;
}

.advanced-search-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.search-row {
    display: flex;
    gap: 24px;
}

.search-item {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
}

.full-width {
    width: 100%;
}

.search-label {
    font-size: 14px;
    color: #606266;
    white-space: nowrap;
    min-width: 80px;
    font-weight: 500;
}

.search-item :deep(.el-slider) {
    width: 100%;
    margin: 8px 0;
}

.search-item :deep(.el-slider__bar) {
    background-color: #18a058;
}

.search-item :deep(.el-slider__button) {
    border-color: #18a058;
}

.search-item :deep(.el-select) {
    width: 100%;
}

.search-item :deep(.el-date-editor) {
    width: 100%;
}

.advanced-search-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.search-result-info {
    font-size: 14px;
    color: #606266;
    display: flex;
    align-items: center;
    gap: 6px;
}

.search-result-info::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #18a058;
    border-radius: 50%;
}

.search-actions {
    display: flex;
    gap: 12px;
}

.reset-btn {
    color: #606266;
    display: flex;
    align-items: center;
    gap: 4px;
}

.reset-btn:hover {
    color: #18a058;
}

.batch-operations {
    background: #fff;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    border-left: 3px solid rgba(24, 160, 88, 0.3);
}

.selected-count {
    font-size: 14px;
    color: #909399;
}

.batch-actions {
    display: flex;
    gap: 8px;
}

.competition-table {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
    border: none;
}

.competition-table :deep(.el-table__inner-wrapper) {
    border: none;
}

.competition-table :deep(.el-scrollbar__bar.is-horizontal) {
    display: none;
}

.competition-table :deep(.el-scrollbar__bar.is-vertical) {
    display: none;
}

.competition-table :deep(.el-table__border-left),
.competition-table :deep(.el-table__border-right),
.competition-table :deep(.el-table__border-top),
.competition-table :deep(.el-table__border-bottom) {
    display: none;
}

.competition-table :deep(.el-table__row) {
    border-bottom: 1px solid #f0f0f0;
}

.competition-table :deep(.el-table__row:last-child) {
    border-bottom: none;
}

.competition-table :deep(.el-table__header) {
    border-bottom: 1px solid #ebeef5;
}

.competition-table :deep(.el-table__cell) {
    border: none;
}

.competition-table :deep(.el-table--stripe .el-table__body tr.el-table__row--striped) {
    background: rgba(24, 160, 88, 0.02);
}

.competition-table :deep(.el-table__fixed-right),
.competition-table :deep(.el-table__fixed) {
    box-shadow: none;
    border-right: none;
    border-left: none;
}

/* 为表格添加行高和单元格内边距控制 */
.competition-table :deep(.el-table__row) {
    height: 70px; /* 增加行高 */
}

.competition-table :deep(.el-table__cell) {
    padding: 10px 0; /* 增加单元格内边距 */
    vertical-align: middle;
}

/* 统一表头样式 */
.competition-table :deep(.el-table__header-row) {
    height: 60px; /* 增加表头行高 */
}

.competition-table :deep(.el-table__header-cell) {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #2c3e50;
}

.competition-title {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
}

.competition-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 2px;
}

.competition-tag {
    margin-right: 0;
}

.competition-meta {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: #909399;
    margin-top: 2px;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.meta-item .el-icon {
    font-size: 14px;
}

.action-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
}

.action-buttons :deep(.el-button) {
    margin: 0;
    padding: 4px 8px;
    font-size: 12px;
    min-height: 28px;
    line-height: 1;
}

.action-buttons :deep(.el-button--text) {
    color: #18a058;
}

.action-buttons :deep(.el-button--text.el-button--danger) {
    color: #F56C6C;
}

.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 24px;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 30px;
    gap: 12px;
    position: relative;
}

.page-numbers {
    display: flex;
    gap: 8px;
}

.page-number {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    border: 1px solid #eaecf0;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    font-size: 14px;
    color: #666;
    position: relative;
    overflow: hidden;
}

.page-number::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(120deg, #e9f7f2, #d6f2e6);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 0;
}

.page-number:hover::before {
    opacity: 1;
}

.page-number:hover {
    border-color: #18a058;
    color: #18a058;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 160, 88, 0.15);
}

.page-number.active {
    background-color: #18a058;
    color: white;
    border-color: #18a058;
    box-shadow: 0 4px 12px rgba(24, 160, 88, 0.3);
    transform: translateY(-2px) scale(1.05);
}

.page-btn {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    border: 1px solid #eaecf0;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    color: #666;
    position: relative;
    overflow: hidden;
}

.page-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(120deg, #e9f7f2, #d6f2e6);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 0;
}

.page-btn:hover:not(:disabled)::before {
    opacity: 1;
}

.page-btn:hover:not(:disabled) {
    border-color: #18a058;
    color: #18a058;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 160, 88, 0.15);
}

.page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.chevron-left, .chevron-right {
    position: relative;
    z-index: 1;
    display: inline-block;
    width: 8px;
    height: 8px;
    border-style: solid;
    border-width: 2px 2px 0 0;
    transition: transform 0.3s ease;
    top: -1px;
}

.chevron-left {
    transform: rotate(-135deg);
    margin-left: 3px;
}

.chevron-right {
    transform: rotate(45deg);
    margin-right: 3px;
}

.prev-btn:hover .chevron-left {
    transform: rotate(-135deg) translateX(-3px);
}

.next-btn:hover .chevron-right {
    transform: rotate(45deg) translateX(3px);
}

/* 表格行样式 */
:deep(.active-row) {
    background-color: rgba(24, 160, 88, 0.05);  /* 更浅的蓝绿色 */
}

:deep(.registration-row) {
    background-color: rgba(24, 160, 88, 0.02);  /* 非常浅的蓝绿色 */
}

/* 响应式调整 */
@media (max-width: 768px) {
    .content-container {
        margin-left: 0;
        padding: 16px;
    }
    
    .filter-bar, 
    .advanced-search-content,
    .batch-operations {
        flex-direction: column;
    }
    
    .search-item {
        width: 100%;
    }
    
    .filter-left,
    .filter-right {
        width: 100%;
    }
}

.header-right {
    display: flex;
}

.header-right .el-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

/* 确保图标和文字垂直居中 */
.el-button .el-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}

.create-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #18a058;
    border-color: #18a058;
}

.button-icon {
    margin-right: 4px;
    display: flex;
}

/* 输入框聚焦时的样式 */
:deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px #18a058 inset !important;
}

:deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px #18a058 inset !important;
}

/* 下拉菜单框聚焦 */
:deep(.el-select .el-input.is-focus .el-input__wrapper) {
    box-shadow: 0 0 0 1px #18a058 inset !important;
}

/* 日期选择器激活状态 */
:deep(.el-date-editor.is-active),
:deep(.el-date-editor.is-active:hover) {
    box-shadow: 0 0 0 1px #18a058 inset !important;
}

/* Element Plus 主题色定制 */
:deep(.el-date-table td.current:not(.disabled)) span {
    background-color: #18a058 !important;
    color: #fff !important;
}

:deep(.el-date-table td.today span) {
    color: #18a058 !important;
}

:deep(.el-date-picker__header-label:hover),
:deep(.el-date-picker__header-button:hover) {
    color: #18a058 !important;
}

:deep(.el-date-picker__time-header) {
    border-bottom: 1px solid #e4e7ed;
}

:deep(.el-picker-panel__icon-btn:hover) {
    color: #18a058 !important;
}

:deep(.el-date-picker__header-label.active),
:deep(.el-date-picker__header-label:hover) {
    color: #18a058 !important;
}

:deep(.el-picker-panel__link-btn) {
    color: #18a058 !important;
}

/* 下拉菜单选中或悬浮样式 */
:deep(.el-select-dropdown__item.hover),
:deep(.el-select-dropdown__item:hover) {
    background-color: rgba(24, 160, 88, 0.1) !important;
}

:deep(.el-select-dropdown__item.selected) {
    color: #18a058 !important;
}

/* 日历选择器区间颜色 */
:deep(.el-date-table td.in-range div) {
    background-color: rgba(24, 160, 88, 0.1) !important;
}

:deep(.el-date-table td.start-date span, 
       .el-date-table td.end-date span) {
    background-color: #18a058 !important;
}

:deep(.el-date-table td.available:hover) {
    color: #18a058 !important;
}

:deep(.el-date-range-picker__header) {
    padding: 0 12px 12px;
}

/* 滑块颜色 */
:deep(.el-slider__button) {
    border-color: #18a058 !important;
}

:deep(.el-slider__bar) {
    background-color: #18a058 !important;
}

:deep(.el-slider__button-wrapper:hover, 
       .el-slider__button-wrapper.hover) {
    cursor: grab;
}

:deep(.el-slider__button-wrapper.active) {
    cursor: grabbing;
}

/* 弹窗样式 */
:deep(.el-message-box__headerbtn:focus .el-message-box__close, 
       .el-message-box__headerbtn:hover .el-message-box__close) {
    color: #18a058 !important;
}

:deep(.el-message-box__title) {
    color: #2c3e50 !important;
}

:deep(.el-message-box__btns .el-button--primary) {
    background-color: #18a058 !important;
    border-color: #18a058 !important;
}

:deep(.el-message-box__btns .el-button--primary:hover) {
    background-color: #35b371 !important;
    border-color: #35b371 !important;
}

/* 创建用户表单样式 */
.form-row {
    display: flex;
    gap: 24px;
}

.form-row .el-form-item {
    flex: 1;
}

.constraints-list, .examples-list {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.constraint-item, .example-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background-color: #f8f9fa;
    border-radius: 6px;
    font-size: 14px;
}

.constraint-item .el-icon, .example-item .el-icon {
    cursor: pointer;
    color: #909399;
}

.constraint-item .el-icon:hover, .example-item .el-icon:hover {
    color: #f56c6c;
}

.example-inputs {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;
}

.example-content {
    font-size: 13px;
    color: #606266;
    margin: 4px 0;
    flex: 1;
}

/* 覆盖表格高度和滚动行为 */
.competition-table :deep(.el-table) {
    overflow: visible;
}

.competition-table :deep(.el-table__body-wrapper) {
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
}

.competition-table :deep(.el-scrollbar__wrap) {
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
}

.competition-table :deep(.el-scrollbar__view) {
    height: auto !important;
    max-height: none !important;
}

.competition-table :deep(.el-scrollbar) {
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
}

.competition-table :deep(.el-table__fixed-body-wrapper) {
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
}

.competition-table :deep(.el-table__fixed-right-patch) {
    background-color: #f8f9fa !important;
}

/* 下拉菜单动画 */
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.3s cubic-bezier(0.5, 0, 0.3, 1.2);
    transform-origin: top center;
}

.dropdown-enter-from {
    opacity: 0;
    transform: translateY(-10px) scaleY(0.95);
}

.dropdown-enter-to {
    opacity: 1;
    transform: translateY(0) scaleY(1);
}

.dropdown-leave-from {
    opacity: 1;
    transform: translateY(0) scaleY(1);
}

.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px) scaleY(0.95);
}

/* 为内容添加延迟子元素动画 */
.advanced-search-content {
    will-change: transform, opacity;
}

.dropdown-enter-active .advanced-search-content,
.dropdown-leave-active .advanced-search-content {
    transition: all 0.3s ease 0.1s;
}

.dropdown-enter-from .advanced-search-content {
    opacity: 0;
    transform: translateY(10px);
}

.dropdown-enter-to .advanced-search-content {
    opacity: 1;
    transform: translateY(0);
}

.dropdown-leave-from .advanced-search-content {
    opacity: 1;
    transform: translateY(0);
}

.dropdown-leave-to .advanced-search-content {
    opacity: 0;
    transform: translateY(10px);
}

.dialog-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    gap: 12px;
}

.dialog-pagination .page-btn {
    width: 28px;
    height: 28px;
    border-radius: 4px;
    border: 1px solid #e4e7ed;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    padding: 0;
    color: #606266;
}

.dialog-pagination .page-btn:hover:not(.disabled) {
    border-color: #18a058;
    color: #18a058;
}

.dialog-pagination .page-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    color: #c0c4cc;
}

.dialog-pagination .page-info {
    font-size: 13px;
    color: #606266;
}

.empty-data {
    text-align: center;
    color: #909399;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 6px;
    font-size: 14px;
}

/* 封禁用户弹窗样式 */
:deep(.ban-user-dialog) {
    width: 500px;
    max-width: 95vw;
}

:deep(.ban-user-dialog .el-message-box__header) {
    padding: 15px 20px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #eaecf0;
}

:deep(.ban-user-dialog .el-message-box__title) {
    font-size: 16px;
    font-weight: 500;
    color: #333;
}

:deep(.ban-user-dialog .el-message-box__content) {
    padding: 20px;
}

:deep(.ban-user-form) {
    margin-bottom: 0;
}

:deep(.ban-form-title) {
    font-size: 14px;
    color: #606266;
    margin-bottom: 20px;
    text-align: center;
}

:deep(.ban-form .el-form-item__label) {
    padding-bottom: 8px;
    font-weight: 500;
    color: #333;
}

:deep(.ban-type-selector) {
    margin-bottom: 15px;
}

:deep(.ban-time-selector) {
    margin-bottom: 0;
}

:deep(.ban-user-dialog .el-button--primary) {
    background-color: #f56c6c;
    border-color: #f56c6c;
}

:deep(.ban-user-dialog .el-button--primary:hover) {
    background-color: #f78989;
    border-color: #f78989;
}

:deep(.ban-user-dialog .el-radio__input.is-checked .el-radio__inner) {
    background-color: #18a058;
    border-color: #18a058;
}

:deep(.ban-user-dialog .el-radio__input.is-checked + .el-radio__label) {
    color: #18a058;
}

:deep(.ban-user-dialog .el-radio__inner:hover) {
    border-color: #18a058;
}

:deep(.ban-user-dialog .el-textarea__inner:focus),
:deep(.ban-user-dialog .el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px #18a058 inset !important;
}

.ban-button {
    margin-left: 12px;
    background-color: #f56c6c;
    border-color: #f56c6c;
}

.ban-button:hover {
    background-color: #f78989;
    border-color: #f78989;
}

/* 用户状态样式 */
.user-status {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 500;
}

.user-status.banned {
    background-color: #fef0f0;
    color: #f56c6c;
    border: 1px solid rgba(245, 108, 108, 0.2);
}

.user-status.normal {
    background-color: #f0f9f4;
    color: #18a058;
    border: 1px solid rgba(24, 160, 88, 0.2);
}

/* 用户角色标签样式 */
.role-badge {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.user-role {
    background-color: #f2f6fc;
    color: #909399;
}

.admin-role {
    background-color: #e6f7ff;
    color: #1890ff;
}

.super-admin-role {
    background-color: #f6ffed;
    color: #52c41a;
}
</style>

<style>
/* 用户信息弹窗样式 */
.user-detail-dialog .el-message-box__container {
    padding: 0;
}

.user-detail-dialog .el-message-box__message {
    padding: 0 !important;
    margin: 0 !important;
    max-height: 80vh !important;
    overflow: visible !important; /* 更改为可见，防止双重滚动 */
}

.user-detail-dialog .el-message-box__title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
}

.user-detail-dialog .el-message-box__header {
    padding: 15px 20px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #eaecf0;
}

.user-detail-dialog .el-message-box__content {
    padding: 0;
    overflow: hidden;
}

.user-detail-dialog .el-message-box__close {
    color: #909399;
}

.user-detail-dialog .el-message-box__headerbtn:focus .el-message-box__close, 
.user-detail-dialog .el-message-box__headerbtn:hover .el-message-box__close {
    color: #18a058;
}

.user-detail-dialog .el-button--primary {
    background-color: #18a058;
    border-color: #18a058;
}

.user-detail-dialog .el-button--primary:hover,
.user-detail-dialog .el-button--primary:focus {
    background-color: #35b371;
    border-color: #35b371;
}

.user-detail-dialog {
    width: auto;
    max-width: 600px !important; /* 直接覆盖宽度 */
    width: 600px !important;
}

.user-detail-content {
    padding: 0;
    min-width: 600px; /* 增加最小宽度，确保内容不被截断 */
    width: 600px; /* 调整为标准宽度 */
    max-width: 90vw;
    max-height: 600px; /* 设置固定高度，确保比例为1:1 */
    overflow-y: auto; /* 内容超出时显示滚动条 */
}

.user-info-header {
    display: flex;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eaecf0;
}

.user-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: #18a058;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    margin-right: 16px;
}

.user-info-main {
    flex: 1;
}

.user-name {
    font-size: 18px;
    font-weight: 500;
    color: #333;
    margin-bottom: 6px;
}

.user-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    color: #606266;
    font-size: 14px;
}

.meta-item {
    display: inline-flex;
    align-items: center;
}

.meta-value {
    font-family: monospace;
    margin-left: 2px;
}

.status-badge {
    padding: 2px 8px;
    border-radius: 4px;
    background-color: #f0f9f4;
    color: #18a058;
}

.status-badge.banned {
    background-color: #fef0f0;
    color: #f56c6c;
}

.info-label {
    font-weight: 500;
    margin-right: 4px;
}

.user-brief {
    padding: 12px 20px;
    color: #606266;
    line-height: 1.5;
    border-bottom: 1px solid #eaecf0;
    font-size: 14px;
}

.user-data-section {
    padding: 20px;
}

.section-title {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    padding-left: 2px;
}

.detail-header {
    display: flex;
    align-items: center;
    margin: 0 0 15px;
    border-bottom: none;
    position: relative;
}

.detail-title {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
    color: #333;
}

.detail-indicator {
    height: 3px;
    width: 40px;
    background-color: #18a058;
    position: absolute;
    bottom: -6px;
    left: 0;
}

.problem-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 300px; /* 增加高度，从250px改为300px */
    overflow-y: auto;
    padding-right: 10px;
}

.problem-item {
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 6px;
    transition: all 0.2s;
    margin-bottom: 0;
}

.problem-item:hover {
    background-color: #f0f0f0;
}

.problem-title {
    font-weight: 500;
    color: #333;
    font-size: 14px;
    margin-bottom: 4px;
}

.problem-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 6px;
}

.problem-tag {
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 12px;
    margin-right: 15px;
}

.tag-easy {
    background-color: #e8f5e9;
    color: #4caf50;
}

.tag-medium {
    background-color: #e3f2fd;
    color: #2196f3;
}

.tag-hard {
    background-color: #fff8e1;
    color: #ff9800;
}

.problem-time {
    color: #909399;
    font-size: 13px;
    white-space: nowrap;
}

/* 添加新布局样式 */
.user-sections {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
}

.user-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

/* 自定义滚动条样式 */
.problem-list::-webkit-scrollbar {
    width: 6px;
}

.problem-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.problem-list::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.problem-list::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* 优化滚动条 */
.user-detail-content::-webkit-scrollbar {
    width: 6px;
}

.user-detail-content::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.user-detail-content::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.user-detail-content::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
</style>