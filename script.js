const app = document.querySelector('#app').innerHTML = `
<div class="container">
    <form class="todo-form">
        <div class="input-box">
            <label for="todo-input">Текс заметки</label>
            <input name="todo-input" id="todo-input" type="text" placeholder="Введите текст">
        </div>
        <div class="button-box">
            <button type="submit">Создать</button>
        </div>
    </form>
    <div class="todo-filters">
      <div class="todo-filter">
        <label for="radio1">Показать выполненные задачи</label>
        <input class="radio-show" id="radio1" name="visible-todos" type="radio" value="show-complete">
      </div>
      <div class="todo-filter">
            <label for="radio2">Показать не выполненные задачи</label>
      <input class="radio-hidden" name="visible-todos" id="radio2"  type="radio" value="show-not-complete" >
</div>
       <div class="todo-filter">
      <label for="radio3">Показать все задачи</label>
      <input class="radio-hidden" name="visible-todos" id="radio3"  type="radio" value="show-all" checked>
      </div>
    </div>
    <ul class="todos">
        <li class="todo">
            <div class="text-box">
                <input class="todo__checkbox" type="checkbox" />
                <span class="todo__text">Текст заметки</span>
            </div>
            <div class="todo__buttons">
                <button class="todo__edit-button">Редактировать заметку</button>
                <button class="todo__delete-button">Удалить заметку</button>
            </div>
        </li>
        <li class="todo">
            <input type="text" value="Текст заметки">
            <div class="todo__buttons">
                <button class="button todo__edit-button">
                    <span class="button-text">Отменить</span>
                    <div class="button-tooltip">Отменить изменения</div>
                </button>
                <button class="todo__edit-button">Подтвердить</button>
            </div>
        </li>
    </ul>
</div>`

let todos = [
    { id: 1, text: 'Заметка 1', completed: false, isEdit: false },
    { id: 2, text: 'Заметка 2', completed: true, isEdit: false }
]
let filter = 'show-all'

function createTodo(text) {
    if (!text.trim().length) {
        alert('Введите текст заметки')
        return
    }

    const newTodo = {
        id: Date.now(), text, completed: false
    }
    todos.push(newTodo)
}

const toggleTodo = function (id) {
    const todo = todos.find(todo => todo.id === +id)
    todo.completed = !todo.completed
}

const deleteTodo = (id) => {
    todos = [ ...todos.filter(todo => todo.id !== id) ]
}

const changeTodo = (text, id) => {
    const todo = todos.find(todo => todo.id === id)
    todo.text = text
}

const todoForm = document.querySelector('.todo-form')
const todoFormInput = todoForm.querySelector('#todo-input')
const todosContainer = document.querySelector('.todos')

todoForm.addEventListener('submit', (event) => {
    event.preventDefault()
    createTodo(todoFormInput.value)
    todoFormInput.value = ''
    renderTodos()
})

function renderTodos() {
    todosContainer.innerHTML = ''


    const getReadableTodo = (todo) => {
        return `
  <li class="todo">
    <div class="text-box">
        <input class="todo__checkbox" data-todo-checkbox="${todo.id}" type="checkbox" ${todo.completed ? 'checked' : ''} />
        <span class="todo__text ${todo.completed && 'is-complete'}">${todo.text}</span>
    </div>
    <div class="todo__buttons">
        <button class="todo__edit-button" data-edit-id="${todo.id}" >Редактировать заметку</button>
        <button class="todo__delete-button" data-delete-id="${todo.id}">Удалить заметку</button>
    </div>
</li>
  `
    }
    const getEditableTodo = (todo) => {
        return `<li class="todo">
    <div class="text-box">
        <input class="todo__checkbox" data-todo-input="${todo.id}" type="text" value="${todo.text}"/>
    </div>
    <div class="todo__buttons">
        <button class="todo__edit-button" data-edit-complete="${todo.id}" >Принять изменения</button>
        <button class="todo__delete-button" data-edit-cancel="${todo.id}">Отменить изменения</button>
    </div>
</li>`
    }

    const emptyBlock = () => {
        return `
    <div>Нет задач</div>
    `
    }
    const filteredTodos = getFilteredTodos(todos, filter)
    if (!filteredTodos.length) {
        todosContainer.innerHTML = emptyBlock()
        return
    }

    for (const todo of filteredTodos) {
        todosContainer.innerHTML += `
      ${!todo.isEdit ? getReadableTodo(todo) : getEditableTodo(todo)}
`
    }
    setTodoEventListeners()
}

function getFilteredTodos(todos, filter) {
    const copyTodos = JSON.parse(JSON.stringify(todos))

    switch (filter) {
        case 'show-all':
            return copyTodos
        case 'show-complete':
            return copyTodos.filter(todo => todo.completed === true)
        case 'show-not-complete':
            return copyTodos.filter(todo => todo.completed === false)
        default:
            return copyTodos
    }
}

function setTodoEventListeners() {
    const changeCheckbox = (id) => {
        toggleTodo(id)
        renderTodos()
    }

    const checkboxes = document.querySelectorAll('[data-todo-checkbox]')
    for (const checkbox of checkboxes) {
        checkbox.addEventListener('change', () => {
            const todoId = checkbox.getAttribute('data-todo-checkbox')
            changeCheckbox(todoId)
        })
    }

    const startEditMode = (id) => {
        todos = todos.map(todo => todo.id === id ? {
            ...todo, isEdit: !todo.isEdit
        } : todo)
    }

    const stopEditMode = (id) => {
        todos = todos.map(todo => todo.id === id ? {
            ...todo, isEdit: !todo.isEdit
        } : todo)
    }

    const editCompleteButtons = document.querySelectorAll('[data-edit-complete]')
    for (const editCompleteButton of editCompleteButtons) {
        editCompleteButton.addEventListener('click', () => {
            const todoId = editCompleteButton.getAttribute('data-edit-complete')
            const todoEditInput = document.querySelector(`[data-todo-input='${todoId}']`)
            changeTodo(todoEditInput.value, +todoId)
            stopEditMode(+todoId)
            renderTodos()
        })
    }

    const editCancelButtons = document.querySelectorAll('[data-edit-cancel]')
    for (const editCancelButton of editCancelButtons) {
        editCancelButton.addEventListener('click', () => {
            const todoId = editCancelButton.getAttribute('data-edit-cancel')
            stopEditMode(+todoId)
            renderTodos()
        })
    }

    const todoDeleteButtons = document.querySelectorAll('[data-delete-id]')
    for (const todoDeleteButton of todoDeleteButtons) todoDeleteButton.addEventListener('click', () => {
        const todoId = todoDeleteButton.getAttribute('data-delete-id')
        deleteTodo(+todoId)
        renderTodos()
    })

    const todoEditButtons = document.querySelectorAll('[data-edit-id]')
    for (const todoEditButton of todoEditButtons) todoEditButton.addEventListener('click', () => {
        const todoId = todoEditButton.getAttribute('data-edit-id')
        startEditMode(+todoId)
        renderTodos()
    })
}

function visibleTodoRadioButtons() {
    const radioButtons = document.querySelectorAll('[name=visible-todos]')
    for (const radioButton of radioButtons) {
        radioButton.addEventListener('change', () => {
            filter = radioButton.value
            renderTodos()
        })
    }
}

visibleTodoRadioButtons()
renderTodos()
