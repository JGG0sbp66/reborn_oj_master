import { ref, reactive } from 'vue';
import axios from 'axios';

// 题目数据缓存
export const questionData = reactive({
  problems: [],
  categories: [],
  tags: [],
  isLoaded: false,
  isLoading: false
});

// 预加载题目数据
export const loadQuestionData = async () => {
  // 避免重复加载
  if (questionData.isLoading || questionData.isLoaded) return;
  
  try {
    questionData.isLoading = true;
    
    // 获取题目列表
    const response = await axios.get('http://localhost:5000/api/problem-list');
    if (response.data && Array.isArray(response.data)) {
      questionData.problems = response.data;
    }
    
    // 获取分类信息
    const categoriesResponse = await axios.get('http://localhost:5000/api/problem-categories');
    if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
      questionData.categories = categoriesResponse.data;
    }
    
    // 获取标签信息
    const tagsResponse = await axios.get('http://localhost:5000/api/problem-tags');
    if (tagsResponse.data && Array.isArray(tagsResponse.data)) {
      questionData.tags = tagsResponse.data;
    }
    
    questionData.isLoaded = true;
  } catch (error) {
    console.error('预加载题目数据失败:', error);
  } finally {
    questionData.isLoading = false;
  }
};

// 根据筛选条件获取题目数据
export const getFilteredProblems = (status = '', tag = '', searchQuery = '') => {
  if (!questionData.isLoaded) return [];
  
  let filtered = [...questionData.problems];
  
  // 根据状态筛选
  if (status) {
    filtered = filtered.filter(problem => problem.status === status);
  }
  
  // 根据标签筛选
  if (tag) {
    filtered = filtered.filter(problem => problem.topic === tag);
  }
  
  // 根据搜索关键词筛选
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(problem => 
      problem.title.toLowerCase().includes(query) || 
      problem.id.toString().includes(query)
    );
  }
  
  return filtered;
}; 