<template>
    <div 
      class="resize-bar" 
      @mousedown="startDrag"
    ></div>
  </template>
  
  <script>
  export default {
    methods: {
      startDrag(e) {
        this.$emit('start-drag', e);
      }
    }
  }
  </script>
  
  <style scoped>
  .resize-bar {
    width: 8px;
    height: 100%;
    background-color: #f0f0f0;
    cursor: col-resize;
    transition: background-color 0.2s;
    position: relative;
    margin: 0 2px;
    border-radius: 4px;
  }
  
  .resize-bar:hover {
    background-color: #c0c4cc;
  }
  
  .resize-bar:active {
    background: linear-gradient(90deg, #3aa876, #00b3e6);
    
  }
  </style>