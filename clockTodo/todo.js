const todoForm = document.querySelector(".js-todoForm"),
    todoInput = todoForm.querySelector("input"),
    todoList = document.querySelector(".js-todoList");


const TODOS_LS = 'todos';

let toDos = [];


function deleteToDo(e){
    const btn = e.target;
    const li = btn.parentNode;
    todoList.removeChild(li);
    console.dir(e.target.parentNode);
    const cleanToDos = toDos.filter(val => val.id !== parseInt(li.id));
    toDos = cleanToDos;
    saveToDos();
}


function saveToDos(){
    localStorage.setItem(TODOS_LS,JSON.stringify(toDos));
}


function loadTodos(){
    const loadedToDos = localStorage.getItem(TODOS_LS);
    if(loadedToDos !== null){
        const parsedToDos = JSON.parse(loadedToDos);
        parsedToDos.forEach(function(todo){
            paintTodo(todo.text);
        });
    }
}

function paintTodo(text){
    const li = document.createElement("li");
    const delBtn = document.createElement("button");
    delBtn.innerText = "❌";
    delBtn.addEventListener("click",deleteToDo);
    const span = document.createElement("span");
    const newId = toDos.length+1;
    span.innerText = text;
    li.appendChild(span);
    li.appendChild(delBtn);
    li.id = newId
    todoList.appendChild(li);
    const toDoObj = {
        text,
        id : newId
    };
    toDos.push(toDoObj);
    saveToDos();
}



function handleSubmit(e){
    e.preventDefault();
    const currentValue = todoInput.value;
    paintTodo(currentValue);
    todoInput.value ="";
}


function init(){
    loadTodos();
    todoForm.addEventListener("submit", handleSubmit)
}

init();