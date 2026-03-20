import { createSlice } from "@reduxjs/toolkit";

// 🔹 Load initial data from localStorage
const savedTasks = localStorage.getItem("tasks");
const initialState = savedTasks ? JSON.parse(savedTasks) : [];

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.push(action.payload);
      localStorage.setItem("tasks", JSON.stringify(state));
    },
    editTask: (state, action) => {
      const { id, data } = action.payload;
      const index = state.findIndex(task => task.id === id);
      if (index >= 0) state[index] = data;
      localStorage.setItem("tasks", JSON.stringify(state));
    },
    deleteTask: (state, action) => {
      const newState = state.filter(task => task.id !== action.payload);
      localStorage.setItem("tasks", JSON.stringify(newState));
      return newState;
    },
  },
});

export const { addTask, editTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;