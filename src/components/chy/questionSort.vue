<template>
  <main
    class="Box"
    @click.self="closeAllDropdowns"
  >
    <div class="headerBox">
      <!-- 状态筛选按钮 -->
      <div class="filter-container">
        <span
          class="filter-button"
          :class="{ 'active-filter': selectedStatus }"
          tabindex="0"
          @mouseover="hoverStatus = true"
          @mouseout="hoverStatus = false"
          @click="toggleStatusDropdown"
        >
          {{ selectedStatus || '作答状况' }}
          <svg
            class="filter-arrow"
            :class="{ rotated: showStatusDropdown }"
            viewBox="0 0 24 24"
          >
            <path
              d="M6 15l6-6l6 6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </span>

        <!-- 标签筛选按钮 -->
        <span
          class="filter-button"
          :class="{ 'active-filter': selectedTag }"
          tabindex="0"
          @mouseover="hoverTag = true"
          @mouseout="hoverTag = false"
          @click="toggleTagDropdown"
        >
          {{ selectedTag || '标签' }}
          <svg
            class="filter-arrow"
            :class="{ rotated: showTagDropdown }"
            viewBox="0 0 24 24"
          >
            <path
              d="M6 15l6-6l6 6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </span>
      </div>

      <!-- 搜索框 -->
      <div class="search-container">
        <svg
          class="search-icon"
          viewBox="0 0 1024 1024"
        >
          <path
            d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1c-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"
            fill="currentColor"
          ></path>
        </svg>
        <input
          class="search-input"
          type="search"
          placeholder="搜索题号、题目..."
          v-model="searchQuery"
          @input="handleSearch"
        >
      </div>
    </div>

    <!-- 状态下拉框 -->
    <div
      class="dropdown-menu"
      v-show="showStatusDropdown"
    >
      <div class="dropdown-arrow"></div>
      <div
        class="dropdown-content"
        @click="closeAllDropdowns"
      >
        <div
          class="dropdown-item"
          @click="handleStatusSelect('未尝试')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="status-icon"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm-5-9h10v2H7z"
              fill="currentColor"
            ></path>
          </svg>
          <span>未尝试</span>
          <svg
            v-if="selectedStatus === '未尝试'"
            class="checkmark"
            viewBox="0 0 24 24"
          >
            <path
              fill="#1890ff"
              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
            ></path>
          </svg>
        </div>
        <div
          class="dropdown-item"
          @click="handleStatusSelect('已通过')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="status-icon"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4l8-8z"
              fill="currentColor"
            ></path>
          </svg>
          <span>已通过</span>
          <svg
            v-if="selectedStatus === '已通过'"
            class="checkmark"
            viewBox="0 0 24 24"
          >
            <path
              fill="#52c41a"
              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
            ></path>
          </svg>
        </div>
        <div
          class="dropdown-item"
          @click="handleStatusSelect('未通过')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="status-icon"
          >
            <path
              d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192z"
              fill="none"
              stroke="currentColor"
              stroke-miterlimit="10"
              stroke-width="32"
            ></path>
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="M320 320L192 192"
            ></path>
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="M192 320l128-128"
            ></path>
          </svg>
          <span>未通过</span>
          <svg
            v-if="selectedStatus === '未通过'"
            class="checkmark"
            viewBox="0 0 24 24"
          >
            <path
              fill="#fe4c61"
              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
            ></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- 标签下拉框 -->
    <div
      class="dropdown-menu tag-dropdown"
      v-show="showTagDropdown"
    >
      <div class="dropdown-arrow"></div>
      <div
        class="dropdown-content"
        @click="closeAllDropdowns"
      >
        <div
          class="dropdown-item tag-item tag-beginner"
          @click="handleTagSelect('入门')"
        >
          <span>入门</span>
          <svg
            v-if="selectedTag === '入门'"
            class="checkmark"
            viewBox="0 0 24 24"
          >
            <path
              fill="#fe4c61"
              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
            ></path>
          </svg>
        </div>
        <div
          class="dropdown-item tag-item tag-popular"
          @click="handleTagSelect('普及')"
        >
          <span>普及</span>
          <svg
            v-if="selectedTag === '普及'"
            class="checkmark"
            viewBox="0 0 24 24"
          >
            <path
              fill="#f39c11"
              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
            ></path>
          </svg>
        </div>
        <div
          class="dropdown-item tag-item tag-advanced"
          @click="handleTagSelect('提高')"
        >
          <span>提高</span>
          <svg
            v-if="selectedTag === '提高'"
            class="checkmark"
            viewBox="0 0 24 24"
          >
            <path
              fill="#ffc116"
              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
            ></path>
          </svg>
        </div>
        <div
          class="dropdown-item tag-item tag-provincial"
          @click="handleTagSelect('省选')"
        >
          <span>省选</span>
          <svg
            v-if="selectedTag === '省选'"
            class="checkmark"
            viewBox="0 0 24 24"
          >
            <path
              fill="#52c41a"
              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
            ></path>
          </svg>
        </div>
        <div
          class="dropdown-item tag-item tag-noi"
          @click="handleTagSelect('NOI')"
        >
          <span>NOI</span>
          <svg
            v-if="selectedTag === 'NOI'"
            class="checkmark"
            viewBox="0 0 24 24"
          >
            <path
              fill="#9d3dcf"
              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
            ></path>
          </svg>
        </div>
        <div
          class="dropdown-item tag-item tag-ctsc"
          @click="handleTagSelect('CTSC')"
        >
          <span>CTSC</span>
          <svg
            v-if="selectedTag === 'CTSC'"
            class="checkmark"
            viewBox="0 0 24 24"
          >
            <path
              fill="#0e1d69"
              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
            ></path>
          </svg>
        </div>
      </div>
    </div>

    <questionContent :questions="questionsData"></questionContent>
    <questionSwitchPage
      ref="switchPage"
      @page-change="handlePageChange"
      :selectData="selected"
    ></questionSwitchPage>
  </main>
</template>

<script>
import questionContent from "./questionContent.vue";
import questionSwitchPage from "./questionSwitchPage.vue";
export default {
  data() {
    return {
      showStatusDropdown: false,
      showTagDropdown: false,
      hoverStatus: false,
      hoverTag: false,
      questionsData: [],
      selected: {
        category: "all",
        topic: "all",
        input: "",
      },
      selectedStatus: "",
      selectedTag: "",
      searchQuery: "",
    };
  },
  components: {
    questionContent,
    questionSwitchPage,
  },
  mounted() {
    document.addEventListener("click", this.handleGlobalClick);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleGlobalClick);
  },
  methods: {
    handleGlobalClick(event) {
      const keepOpenElements = [
        ".selection",
        ".selection2",
        ".headerSpan1",
        ".headerSpan2",
        ".hS1",
        ".hS2",
      ];
      const isClickInside = keepOpenElements.some((selector) =>
        event.target.closest(selector)
      );
      if (!isClickInside) {
        this.closeAllDropdowns();
      }
    },
    toggleArrow(element, show) {
      if (element) {
        element.style.transform = show ? "rotate(0deg)" : "rotate(180deg)";
        element.style.transition = "transform 0.5s ease";
      }
    },
    toggleStatusDropdown(event) {
      event.stopPropagation();
      // 关闭标签下拉框
      if (this.showTagDropdown) {
        this.showTagDropdown = false;
        const tagArrow = document.querySelector(".hS2");
        this.toggleArrow(tagArrow, false);
      }
      // 切换状态下拉框
      this.showStatusDropdown = !this.showStatusDropdown;
      const arrow = document.querySelector(".hS1");
      this.toggleArrow(arrow, this.showStatusDropdown);
    },
    toggleTagDropdown(event) {
      event.stopPropagation();
      // 关闭状态下拉框
      if (this.showStatusDropdown) {
        this.showStatusDropdown = false;
        const statusArrow = document.querySelector(".hS1");
        this.toggleArrow(statusArrow, false);
      }
      // 切换标签下拉框
      this.showTagDropdown = !this.showTagDropdown;
      const arrow = document.querySelector(".hS2");
      this.toggleArrow(arrow, this.showTagDropdown);
    },
    closeAllDropdowns() {
      if (this.showStatusDropdown) {
        this.showStatusDropdown = false;
        const arrow = document.querySelector(".hS1");
        this.toggleArrow(arrow, false);
      }
      if (this.showTagDropdown) {
        this.showTagDropdown = false;
        const arrow = document.querySelector(".hS2");
        this.toggleArrow(arrow, false);
      }
    },
    handlePageChange(data) {
      this.questionsData = data;
    },
    handleStatusSelect(status) {
      // 如果点击的是已选中的状态，则取消选择
      if (this.selectedStatus === status) {
        this.selectedStatus = "";
        this.selected = {
          ...this.selected,
          category: "",
        };
      } else {
        this.selectedStatus = status;
        this.selected = {
          ...this.selected,
          category: status,
        };
      }
      this.showStatusDropdown = false;
      const arrow = document.querySelector(".hS1");
      this.toggleArrow(arrow, false);
    },
    handleTagSelect(tag) {
      // 如果点击的是已选中的标签，则取消选择
      if (this.selectedTag === tag) {
        this.selectedTag = "";
        this.selected = {
          ...this.selected,
          topic: "",
        };
      } else {
        this.selectedTag = tag;
        this.selected = {
          ...this.selected,
          topic: tag,
        };
      }
      this.showTagDropdown = false;
      const arrow = document.querySelector(".hS2");
      this.toggleArrow(arrow, false);
    },
    handleSearch(event) {
      this.searchText = event.target.value;
      // 更新selected对象
      this.selected = {
        ...this.selected,
        input: event.target.value,
      };
    },
    handleSearch() {
      this.selected = {
        ...this.selected,
        input: this.searchQuery,
      };
    },
  },
  computed: {
    statusButtonStyle() {
      return {
        backgroundColor: this.hoverStatus ? "#d1e8fc" : "#2E33380D",
        cursor: "pointer",
      };
    },
    tagButtonStyle() {
      return {
        backgroundColor: this.hoverTag ? "#d1e8fc" : "#2E33380D",
        cursor: "pointer",
      };
    },
  },
  watch: {
    selected: {
      handler(newVal) {
        // 当selected变化时，通过ref调用子组件方法或自动更新prop
        if (this.$refs.switchPage) {
          // 如果需要调用子组件特定方法：
          this.$refs.switchPage.handleSelectDataChange(newVal);
          // 或者直接依靠prop的自动更新（如果子组件有watch监听prop变化）
        }
      },
      deep: true, // 深度监听
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.Box {
  display: flex;
  flex-direction: column;
  width: 80%;
  background-color: white;
  border-radius: 15px;
  margin: 16px auto;
  padding: 16px;
  position: relative;
  top: 30px;
}

.headerBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
}

.filter-container {
  display: flex;
  gap: 12px;
}

.filter-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
  font-size: 14px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  border: 1px solid transparent;
  position: relative;
  user-select: none;
  overflow: hidden;
  z-index: 1;
}

.filter-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(24, 144, 255, 0.1), transparent);
  transition: left 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  z-index: -1;
}

.filter-button:hover {
  background-color: #ebf0f5;
  border-color: #d1dbe5;
  transform: translateY(-2px);
}

.filter-button:hover::before {
  left: 100%;
}

.filter-button.active-filter {
  background: linear-gradient(to right, #f0f7ff, #e6f7ff);
  color: #1890ff;
  border: 1px solid #91d5ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
  position: relative;
  overflow: hidden;
}

.filter-button.active-filter::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, #1890ff, #40a9ff);
  transition: all 0.3s ease;
}

.filter-button.active-filter:hover::after {
  height: 3px;
}

.filter-arrow {
  width: 16px;
  height: 16px;
  margin-left: 8px;
  transition: transform 0.2s ease;
  color: currentColor;
}

.filter-arrow.rotated {
  transform: rotate(180deg);
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 280px;
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

.search-container:focus-within {
  width: 350px;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  color: #a0aec0;
  z-index: 1;
  transition: all 0.3s ease;
}

.search-container:focus-within .search-icon {
  color: #42b983;
  transform: scale(1.1);
}

.search-input {
  width: 100%;
  height: 38px;
  padding: 8px 12px 8px 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #4a5568;
  background-color: #f8fafc;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  outline: none;
}

.search-input:hover {
  border-color: #99a1a9;
  background-color: #fff;
}

.search-input:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
  background-color: #fff;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .headerBox {
    flex-direction: column;
    gap: 12px;
  }

  .filter-container {
    width: 100%;
    justify-content: space-between;
  }

  .search-container {
    width: 100%;
  }
}

/* 下拉菜单通用样式 */
.dropdown-menu {
  position: absolute;
  width: 140px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
  z-index: 100;
  top: 76px;
  margin-left: 8px;
  transform-origin: top center;
  animation: dropdownFadeIn 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.tag-dropdown {
  left: 140px;
}

.dropdown-arrow {
  width: 12px;
  height: 12px;
  background-color: white;
  position: absolute;
  left: 16px;
  top: -6px;
  transform: rotate(45deg);
  box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
}

.dropdown-content {
  padding: 8px 0;
  border-radius: 8px;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  font-size: 14px;
  line-height: 20px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.dropdown-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(24, 144, 255, 0.1), transparent);
  transition: left 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  z-index: -1;
}

.dropdown-item:hover {
  background-color: #f5f7fa;
  padding-left: 22px;
}

.dropdown-item:hover::before {
  left: 100%;
}

.status-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  flex-shrink: 0;
}

/* 标签项特定样式 */
.tag-item {
  position: relative;
  padding-left: 12px;
  transition: padding-left 0.2s ease;
}

.tag-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  border-radius: 2px;
  transition: left 0.2s ease;
}

.checkmark {
  width: 16px;
  height: 16px;
  margin-left: auto;
  flex-shrink: 0;
}

.tag-beginner::before {
  background-color: #fe4c61;
}

.tag-popular::before {
  background-color: #f39c11;
}

.tag-advanced::before {
  background-color: #ffc116;
}

.tag-provincial::before {
  background-color: #52c41a;
}

.tag-noi::before {
  background-color: #9d3dcf;
}

.tag-ctsc::before {
  background-color: #0e1d69;
}

/* 标签项悬停效果 */
.tag-beginner:hover {
  background-color: rgba(254, 76, 97, 0.1);
  color: #fe4c61;
}

.tag-popular:hover {
  background-color: rgba(243, 156, 17, 0.1);
  color: #f39c11;
}

.tag-advanced:hover {
  background-color: rgba(255, 193, 22, 0.1);
  color: #ffc116;
}

.tag-provincial:hover {
  background-color: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.tag-noi:hover {
  background-color: rgba(157, 61, 207, 0.1);
  color: #9d3dcf;
}

.tag-ctsc:hover {
  background-color: rgba(14, 29, 105, 0.1);
  color: #0e1d69;
}

/* 更新悬停时的动画行为 */
.dropdown-item.tag-item:hover {
  padding-left: 22px;
}

.dropdown-item.tag-item:hover::before {
  left: 10px;
}
</style>