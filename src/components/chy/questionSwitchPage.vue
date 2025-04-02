<template>
  <!-- 当 tpage > 0 时才显示分页组件 -->
  <div
    v-if="tpage > 0"
    class="pagination-container"
  >
    <div class="pagination">
      <button
        id="prev-page"
        class="page-btn prev-btn"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.2674 15.793C11.9675 16.0787 11.4927 16.0672 11.2071 15.7673L6.20572 10.5168C5.9298 10.2271 5.9298 9.7719 6.20572 9.48223L11.2071 4.23177C11.4927 3.93184 11.9675 3.92031 12.2674 4.206C12.5673 4.49169 12.5789 4.96642 12.2932 5.26634L7.78458 9.99952L12.2932 14.7327C12.5789 15.0326 12.5673 15.5074 12.2674 15.793Z"
            fill="currentColor"
          ></path>
        </svg>
      </button>

      <div class="page-numbers">
        <template
          v-for="item in visiblePages"
          :key="item"
        >
          <button
            v-if="item !== '...'"
            :class="['page-btn', { active: currentPage === item }]"
            @click="changePage(item)"
          >
            {{ item }}
          </button>
          <span
            v-else
            class="ellipsis"
          >
            ...
          </span>
        </template>
      </div>

      <button
        id="next-page"
        class="page-btn next-btn"
        :disabled="currentPage === tpage"
        @click="changePage(currentPage + 1)"
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.73271 4.20694C8.03263 3.92125 8.50737 3.93279 8.79306 4.23271L13.7944 9.48318C14.0703 9.77285 14.0703 10.2281 13.7944 10.5178L8.79306 15.7682C8.50737 16.0681 8.03263 16.0797 7.73271 15.794C7.43279 15.5083 7.42125 15.0336 7.70694 14.7336L12.2155 10.0005L7.70694 5.26729C7.42125 4.96737 7.43279 4.49264 7.73271 4.20694Z"
            fill="currentColor"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      allData: [], // 存储从后端获取的当前页数据
      currentPage: 1, // 当前页码
      pageSize: 15, // 每页展示的数据条数
      tpage: -1, // 总页数
      category: "all",
      topic: "all",
      input: "",
    };
  },
  props: {
    selectData: {
      type: Object,
      require: true,
    },
  },
  computed: {
    visiblePages() {
      // 动态生成分页按钮列表
      const pages = [];
      if (this.tpage <= 5) {
        for (let i = 1; i <= this.tpage; i++) {
          pages.push(i);
        }
      } else {
        if (this.currentPage <= 4) {
          pages.push(1, 2, 3, 4, 5, "...", this.tpage);
        } else if (this.currentPage >= this.tpage - 3) {
          pages.push(
            1,
            "...",
            this.tpage - 4,
            this.tpage - 3,
            this.tpage - 2,
            this.tpage - 1,
            this.tpage
          );
        } else {
          pages.push(
            1,
            "...",
            this.currentPage - 1,
            this.currentPage,
            this.currentPage + 1,
            "...",
            this.tpage
          );
        }
      }
      return pages;
    },
  },
  methods: {
    async fetchData(page) {
      // 从后端获取数据
      try {
        // const formData = new FormData();
        // formData.append("page", page);
        // formData.append("category", this.selectData.category);
        // formData.append("topic", this.selectData.topic);
        // formData.append("input", this.selectData.input);

        const { data: response } = await axios({
          url: "http://localhost:5000/api/questions",
          method: "post",
          data: {
            "page": page,
            "category": this.selectData.category,
            "topic": this.selectData.topic,
            "input": this.selectData.input
          }
        });

        console.log("Fetched data:", response); // 调试日志
        this.allData = Array.isArray(response.questions)
          ? response.questions
          : []; // 确保数据是数组
        this.tpage = response.total_page;
        this.allData = response.questions;
        // 触发事件通知父组件
        this.$emit("page-change", this.allData);
        console.log(this.allData);
        console.log(this.tpage);
        if (!this.allData.length) {
          console.warn("No data fetched from the server.");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    },
    changePage(page) {
      // 切换页面并刷新数据
      if (page >= 1 && page <= this.tpage) {
        this.currentPage = page;
        this.fetchData(this.currentPage); // 刷新数据
        console.log(this.currentPage);
      }
    },
    handleSelectDataChange(newData) {
      // 处理数据变化的逻辑
      console.log("Received new selectData:", newData);
      this.selectData.category = newData.category;
      this.selectData.topic = newData.topic;
      this.selectData.input = newData.input;
      console.log(this.selectData.category);
      this.currentPage = 1;
      this.fetchData(this.currentPage);
    },
  },
  mounted() {
    // 组件挂载时获取第一页数据
    this.fetchData(this.currentPage);
  },
};
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: end;
  margin: 32px 0;
  width: 100%; /* 确保容器足够宽 */
}

.pagination {
  display: flex;
  flex-direction: row; /* 明确设置为横向排列 */
  align-items: center;
  gap: 8px;
  background: #fff;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow-x: auto; /* 如果内容过多允许横向滚动 */
  white-space: nowrap; /* 防止内容换行 */
}
.page-numbers {
  display: flex;
  flex-direction: row; /* 确保页码按钮横向排列 */
  gap: 8px;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  background-color: #fff;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn svg {
  width: 16px;
  height: 16px;
  color: #666;
}

.page-btn.active {
  background-color: #18a058;
  color: #fff;
  border-color: #18a058;
}

.page-btn.active:hover {
  background-color: #12804a;
  border-color: #12804a;
}

.prev-btn,
.next-btn {
  background-color: #f0f7ff;
  border-color: #d0e3ff;
}

.prev-btn:hover:not(:disabled),
.next-btn:hover:not(:disabled) {
  background-color: #e1f0ff;
  border-color: #a8d0ff;
}

.ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #999;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pagination {
    gap: 4px;
    padding: 6px;
  }

  .page-btn {
    width: 36px;
    height: 36px;
    font-size: 13px;
  }

  .ellipsis {
    width: 36px;
    height: 36px;
  }
}
</style>