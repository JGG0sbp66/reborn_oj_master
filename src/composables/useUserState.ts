/**
 * 用户登录状态 composable
 * 从原 4 套头部组件（headerheader / manager-head / competitionheader /
 * questions_detailHeader）中抽取的公共逻辑，统一采用原 headerheader 的
 * 完整实现（按用户校验头像缓存、用户名多字段回退链）。
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { checkAuth } from '@/utils/auth';
import { authApi } from '@/api';
import emitter from '@/utils/eventBus';
import { generateAvatarSvg } from '@/utils/avatar';

export const useUserState = () => {
  const router = useRouter();
  const isAuthenticated = ref<boolean>(false);
  const username = ref<string>('');
  const userRole = ref<string>('');
  const avatarUrl = ref<string>('');
  const showUserMenu = ref<boolean>(false);
  const menuCloseTimer = ref<number | null>(null); // 用于延迟关闭菜单

  // 从用户名生成缩写
  const userInitials = computed(() => {
    if (!username.value || typeof username.value !== 'string') return '?';
    return username.value.substring(0, 2).toUpperCase();
  });

  // 尝试从服务器刷新用户头像
  const tryRefreshAvatar = async (userId?: string | number) => {
    try {
      // 使用传入的userId或从localStorage获取
      const id = userId || localStorage.getItem('uid');
      if (!id) return;

      // 添加时间戳以防止缓存
      const timestamp = localStorage.getItem('avatar_timestamp') || Date.now().toString();

      // 检查是否有头像
      const avatarBlob = await authApi.getUserAvatar(id, timestamp);

      // 如果成功获取头像
      if (avatarBlob) {
        // 释放之前的blob URL资源
        if (avatarUrl.value && avatarUrl.value.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(avatarUrl.value);
          } catch (e) {
            console.warn('释放旧头像URL资源失败:', e);
          }
        }

        // 创建blob URL用于当前会话显示
        const blob = new Blob([avatarBlob], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(blob);
        avatarUrl.value = imageUrl;

        // 将blob转换为Base64，用于持久化存储
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            // 保存Base64格式的图片到localStorage
            localStorage.setItem('avatarBase64', reader.result.toString());
            // 更新时间戳
            localStorage.setItem('avatar_timestamp', Date.now().toString());
          }
        };
        reader.readAsDataURL(blob);
      }
    } catch (avatarError) {
      console.warn('没有找到用户头像或头像加载失败:', avatarError);
      // 如果头像获取失败，继续使用默认头像或已有的头像
    }
  };

  // 生成用户默认头像
  const defaultAvatarUrl = computed(() => {
    // 如果已有头像URL，直接返回
    if (avatarUrl.value) return avatarUrl.value;

    // 检查缓存的头像是否属于当前用户
    const currentUserId = localStorage.getItem('uid') || localStorage.getItem('username');
    const cachedAvatarUserId = localStorage.getItem('avatar_user_id');

    // 如果有缓存的头像，且属于当前用户，则使用缓存的头像
    if (cachedAvatarUserId && cachedAvatarUserId === currentUserId) {
      const cachedAvatarBase64 = localStorage.getItem('avatarBase64');
      if (cachedAvatarBase64) return cachedAvatarBase64;
    }

    // 否则生成默认头像，优先使用内存中的username，其次使用uid
    // 这样确保登录后立刻有默认头像，不必等待刷新
    let idForAvatar = '';
    if (username.value) {
      idForAvatar = username.value;
    } else {
      const uid = localStorage.getItem('uid');
      if (uid) {
        idForAvatar = uid;
      } else {
        // 如果都没有，使用一个固定值确保显示
        idForAvatar = 'user';
      }
    }

    // 使用idForAvatar生成默认头像
    return generateAvatarSvg(idForAvatar);
  });

  // 验证用户状态
  const verifyUserState = async () => {
    try {
      // 先检查localStorage中是否有登录状态
      const isLoggedInFromStorage = localStorage.getItem('isLoggedIn') === 'true';
      const usernameFromStorage = localStorage.getItem('username');
      const userRoleFromStorage = localStorage.getItem('userRole');

      // 如果localStorage中有数据，先使用这些数据更新UI
      if (isLoggedInFromStorage && usernameFromStorage) {
        isAuthenticated.value = true;
        username.value = usernameFromStorage;
        userRole.value = userRoleFromStorage || '普通用户';

        // 优先使用储存的Base64头像，避免闪烁
        const cachedAvatarBase64 = localStorage.getItem('avatarBase64');
        if (cachedAvatarBase64) {
          avatarUrl.value = cachedAvatarBase64;
        } else {
          // 如果没有Base64缓存，检查旧版本的Blob URL
          const avatarUrlFromStorage = localStorage.getItem('avatarUrl');
          if (avatarUrlFromStorage) {
            avatarUrl.value = avatarUrlFromStorage;
          }
        }
      }

      // 获取用户ID用于头像
      const userId = localStorage.getItem('uid');

      // 如果有用户ID，尝试从服务器获取最新头像，但不阻塞UI显示
      if (userId) {
        requestAnimationFrame(() => {
          tryRefreshAvatar(userId);
        });
      }

      // 然后再通过API获取最新状态
      const { authenticated, user } = await checkAuth();
      isAuthenticated.value = authenticated;
      if (authenticated && user) {
        // 优先使用API返回的用户名，而不是uid
        // 用户名可能在不同地方有不同格式，需要适当处理
        const u = user as {
          username?: string;
          name?: string;
          user_name?: string;
          uid?: string | number;
          role?: string;
        };
        if (u.username) {
          username.value = u.username;
        } else if (u.name) {
          username.value = u.name;
        } else if (u.user_name) {
          username.value = u.user_name;
        } else if (u.uid) {
          // 如果没有用户名，尝试使用形如"user123"的格式
          if (typeof u.uid === 'string' && !isNaN(Number(u.uid))) {
            username.value = 'user' + u.uid;
          } else {
            username.value = String(u.uid);
          }
        } else {
          username.value = '用户';
        }

        userRole.value = u.role || '普通用户';

        // 保存用户ID，可用于头像获取
        if (u.uid) {
          localStorage.setItem('uid', String(u.uid));

          // 如果之前没有获取头像，尝试用获取到的ID获取
          if (!avatarUrl.value) {
            tryRefreshAvatar(u.uid);

            // 强制触发defaultAvatarUrl的重新计算
            // 为确保没有头像时也能立即显示默认头像
            const dummyKey = 'avatar_update_' + Date.now();
            localStorage.setItem(dummyKey, '1');
            localStorage.removeItem(dummyKey);
          }
        }

        // 更新localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username.value); // 保存正确的username
        localStorage.setItem('userRole', userRole.value);
      } else {
        // 如果API返回未认证，清除localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        localStorage.removeItem('uid');
        // 不要清除avatarUrl，因为它可能在其他地方使用
      }
    } catch (error) {
      console.error('验证用户状态错误:', error);
      isAuthenticated.value = false;
    }
  };

  // 退出登录
  const logout = async () => {
    try {
      // 立即清除头像显示，防止下次登录时显示旧头像
      avatarUrl.value = '';

      // 立即清除本地存储中的头像数据
      localStorage.removeItem('avatarBase64');
      localStorage.removeItem('avatar_timestamp');
      localStorage.removeItem('avatarUrl');
      localStorage.removeItem('avatar_user_id');

      // 发送退出登录请求
      await authApi.logout();
      isAuthenticated.value = false;
      showUserMenu.value = false;

      // 清除localStorage中的登录信息
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');

      router.push('/nav/home');
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  };

  // 处理鼠标移入用户头像或菜单
  const handleUserMenuEnter = () => {
    // 清除可能存在的关闭定时器
    if (menuCloseTimer.value !== null) {
      clearTimeout(menuCloseTimer.value);
      menuCloseTimer.value = null;
    }
    // 显示菜单
    showUserMenu.value = true;
  };

  // 处理鼠标移出菜单或头像
  const handleUserMenuLeave = () => {
    // 设置延迟关闭定时器，给用户足够时间移动到菜单上
    menuCloseTimer.value = window.setTimeout(() => {
      showUserMenu.value = false;
      menuCloseTimer.value = null;
    }, 500); // 500毫秒(0.5秒)延迟
  };

  // 跳转到用户个人中心
  const goToUserProfile = () => {
    router.push('/user/profile');
  };

  // 组件加载时验证用户状态
  onMounted(() => {
    verifyUserState();

    // 监听头像更新事件
    emitter.on('avatar-updated', (data: any) => {
      // 更新头像URL
      if (data.avatarUrl) {
        avatarUrl.value = data.avatarUrl;
      }

      // 也可以直接刷新用户状态
      verifyUserState();
    });

    // 监听用户名变更事件
    emitter.on('username-updated', (data: any) => {
      if (data.username) {
        username.value = data.username;
      }

      // 刷新用户状态以获取完整信息
      verifyUserState();
    });

    // 定时检查localStorage中的用户名是否发生变化
    const usernameCheckInterval = setInterval(() => {
      if (isAuthenticated.value) {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername && storedUsername !== username.value) {
          // 如果本地存储的用户名与当前显示的不一致，则更新
          username.value = storedUsername;
        }
      }
    }, 2000); // 每2秒检查一次

    // 清除定时器的逻辑移至全局的onBeforeUnmount
    onBeforeUnmount(() => {
      clearInterval(usernameCheckInterval);
    });
  });

  // 组件销毁前清除所有资源
  onBeforeUnmount(() => {
    // 清除菜单定时器
    if (menuCloseTimer.value !== null) {
      clearTimeout(menuCloseTimer.value);
      menuCloseTimer.value = null;
    }

    // 取消事件监听
    emitter.off('avatar-updated');
    emitter.off('username-updated');

    // 释放blob URL
    if (avatarUrl.value && avatarUrl.value.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(avatarUrl.value);
      } catch (e) {
        console.warn('释放头像URL资源失败:', e);
      }
    }
  });

  return {
    isAuthenticated,
    username,
    userRole,
    avatarUrl,
    showUserMenu,
    userInitials,
    defaultAvatarUrl,
    verifyUserState,
    logout,
    handleUserMenuEnter,
    handleUserMenuLeave,
    goToUserProfile,
  };
};
