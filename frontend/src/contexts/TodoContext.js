import React, { createContext, useReducer } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export const TodoContext = createContext();

const todoReducer = (state, action) => {
    console.log("REDUCER called with action")
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, { id: Date.now(), text: action.payload, completed: false }];
    case 'TOGGLE_TODO':
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
    case 'DELETE_TODO':
      return state.filter(todo => todo.id !== action.payload);
    case 'EDIT_TODO':
      return state.map(todo =>
        todo.id === action.payload.id ? { ...todo, text: action.payload.text } : todo
      );
    default:
      return state;
  }
};

export const TodoProvider = ({ children }) => {
  const [todos, dispatch] = useLocalStorage('todos', todoReducer, []);

    console.log("HERE")
    console.log(todos)
    console.log(dispatch)
  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};