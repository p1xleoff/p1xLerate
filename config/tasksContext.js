// TasksContext.js
import React, { createContext, useReducer, useContext, useEffect } from "react";
import { fetchListsFromStorage } from './dbHelper';

const TasksContext = createContext();

const initialState = {
  lists: [], // Initialize with an empty array
  selectedListId: 'default',
  tasks: [],
};

const tasksReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASKS':
      return { ...state, tasks: action.payload };    
    case "DELETE_LIST":
      return {
        ...state,
        lists: state.lists.filter((list) => list.id !== action.payload),
      };
    case "MARK_COMPLETED":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload ? { ...task, completed: 1 } : task
        ),
      };
    case "EDIT_LIST":
      const updatedLists = state.lists.map((list) =>
        list.id === action.payload.id
          ? { ...list, name: action.payload.name }
          : list
      );
      return { ...state, lists: updatedLists };
      case 'ADD_LISTS':
        return { ...state, lists: action.payload };  
    case "SELECT_LIST":
      return { ...state, selectedListId: action.payload };
    default:
      return state;
  }
};

const TasksProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tasksReducer, initialState);
  
  useEffect(() => {
    const fetchLists = async () => {
      const storedLists = await fetchListsFromStorage();
      dispatch({ type: 'ADD_LISTS', payload: storedLists });
    };

    fetchLists();
  }, []);

  return (
    <TasksContext.Provider value={{ state, dispatch }}>
      {children}
    </TasksContext.Provider>
  );
};

const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};

export { TasksProvider, useTasks };
