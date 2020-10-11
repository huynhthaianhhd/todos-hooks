import React, {useState, useEffect} from 'react'
import TodoForm from './TodoForm'
import Todo from './Todo'
function TodoList() {
    const [todos, setTodos] = useLocalStorage('name', []);

    const addTodo = (todo)=>{
        if (!todo.text || /^\s*$/.test(todo.text) ){
            return
        }
        const newTodos = [todo,...todos]
        setTodos(newTodos);
    }

    const updateTodo = (todoId, newValue) =>{
        if (!newValue.text || /^\s*$/.test(newValue.text) ){
            return
        }
        setTodos(pre => pre.map(item => (item.id === todoId ? newValue : item)));
    }

    const removeTodo = id =>{
        const removeArr = [...todos].filter(todo=> (todo.id!==id));
        setTodos(removeArr);
    }

    const completeTodo = id => {
        let updatedTodos = todos.map(todo => {
          if (todo.id === id) {
            todo.isComplete = !todo.isComplete;
          }
          return todo;
        });
        setTodos(updatedTodos);
      };

      function useLocalStorage(key, initialValue) {
        // State to store our value
        // Pass initial state function to useState so logic is only executed once
        const [storedValue, setStoredValue] = useState(() => {
          try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
          } catch (error) {
            // If error also return initialValue
            console.log(error);
            return initialValue;
          }
        });
      
        // Return a wrapped version of useState's setter function that ...
        // ... persists the new value to localStorage.
        const setValue = value => {
          try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
              value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error);
          }
        };
      
        return [storedValue, setValue];
      }
    return (
        <div>
            <h1>What's the Plan for Today</h1>
            <TodoForm onSubmit={addTodo}/>
            <Todo todos={todos} completeTodo={completeTodo} removeTodo={removeTodo} updateTodo={updateTodo}/>
        </div>
    )
}

export default TodoList
