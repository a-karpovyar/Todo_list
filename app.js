(function() {
//Globals
let todos, users = [];
const todoList = document.getElementById('todo-list');
const userSelect = document.getElementById('user-todo');
const form = document.querySelector('form');

//Attach Events
document.addEventListener('DOMContentLoaded', initApp);
form.addEventListener('submit',handleSubmit);

//BasicLogic
const getUserName = (userId) => {
   const user = users.find(user=>user.id == userId);
   return user.name;
}

const createUserOption = (user) => {
    const option = document.createElement('option');
    option.value = user.id;
    option.innerText = user.name;
    userSelect.append(option);
}
const alertError = (error) => {
    alert(error.message);
}

const removeTodo = (todoId) => {
    todos = todos.filter(todo => todo.id !=todoId);
    const todo = todoList.querySelector(`[data-id=${todoId}]`);
    todo.querySelector('input').removeEventListener('change',handleTodoChange);
    todo.querySelector('.close').removeEventListener('click',handleClose);
    todo.remove();
}

const printTodo = ({id,userId,title,complete}) => {
    const li = document.createElement('li');
    li.className ='todo-item';
    li.dataset.id = id;
    li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(userId)}</b></span>`;
    
    const status = document.createElement('input');
    status.type = 'checkbox';
    status.checked = complete;
    status.addEventListener('change', handleTodoChange);

    const close =   document.createElement('span');
    close.innerHTML = '&times;';
    close.className ='close';
    close.addEventListener('click', handleClose)

    li.prepend(status);
    li.append(close);


    todoList.prepend(li);
}


//Async Logic
const getAllTodos = async () => {
    try {
        const responce = await fetch('https://jsonplaceholder.typicode.com/todos');
        const data = await responce.json();
        return data;
    } catch (error) {
        alertError(error);
    }
};

const getAllUsers = async () => {
    try {
        const responce = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await responce.json();
        return data;
    } catch (error) {
        alertError(error);
    }
};

const createTodo = async (todo)=> {
    try {
        const responce = await fetch('https://jsonplaceholder.typicode.com/todos',{
            method: "POST",
            body: JSON.stringify(todo),
            headers:{
                'Content-Type':'application/json',
            },
        });
        
        const newTodo = await responce.json();
        printTodo(newTodo);
    } catch (error) {
        alertError(error);
    }
}

const deleteTodo = async (todoId) => {
try {
    const responce = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,{
        method: "DELETE",
        headers:{
            'Content-Type':'application/json',
        },
    });
    if(responce.ok) {
        removeTodo();
    }
    else {
        throw new Error('Failed to connect with server');
    }
} catch (error) {
    alertError(error);
}
};

const toogleTodoComplete = async (todoId, completed) => {
    try {
        const responce = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,{
            method:"PATCH",
            body: JSON.stringify({completed}),
            headers:{
                'Content-Type':'application/json',
            },
        });
        if(!responce.ok) {
            throw new Error('Failed to connect with server');
        }
    } catch (error) {
        alertError(error);
    }
}

//Event logic
function initApp() {
    Promise.all([getAllTodos(), getAllUsers()]).then(values => {
        [todos, users] = values;
        //Отправить в разметку
        todos.forEach(todo => printTodo(todo));
        users.forEach(user => createUserOption(user));
    })
}

function handleSubmit(event) {
    event.preventDefault();
    createTodo({userId: form.user.value, title: form.todo.value, complete: false });
}
function handleTodoChange() {
   const todoId = this.parentElement.dataset.id;
   const completed = this.checked;

   toogleTodoComplete(todoId,completed);
}

function handleClose() {
    const todoId = this.parentElement.dataset.id;
    deleteTodo(todoId);
 }
}())

