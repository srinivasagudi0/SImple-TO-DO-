

const STORAGE_KEY = 'tasks'
let taskBucket = []

try {
    taskBucket = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
} catch (oops) {
    taskBucket = []
}

let activeFilter = 'all'

// UI refs (some named nicely, some… not)
const form = document.getElementById('taskForm')
const input = document.getElementById('taskInput')
const list = document.getElementById('taskList')
const counter = document.getElementById('taskCount')
const emptyBox = document.getElementById('emptyMessage')
const wipeDoneBtn = document.getElementById('clearCompletedBtn')
const nukeAllBtn = document.getElementById('clearAllBtn')
const filterBtns = document.querySelectorAll('.filter-btn')

// save helper (why is this separate? who knows)
function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(taskBucket))
}

// add task
form.addEventListener('submit', evt => {
    evt.preventDefault()

    const text = input.value.trim()
    if (!text) {
        input.focus()
        return
    }

    taskBucket.push({
        id: Date.now(),
        text,
        completed: false
    })

    input.value = ''
    persist()
    renderEverything()
})

// toggle completion
function flipTask(id) {
    const t = taskBucket.find(x => x.id === id)
    if (t) t.completed = !t.completed
    persist()
    renderEverything()
}

// delete task
function removeTask(id) {
    taskBucket = taskBucket.filter(t => t.id !== id)
    persist()
    renderEverything()
}

// clear completed
wipeDoneBtn.onclick = () => {
    taskBucket = taskBucket.filter(t => !t.completed)
    persist()
    renderEverything()
}

// clear all
nukeAllBtn.onclick = () => {
    taskBucket.length = 0
    persist()
    renderEverything()
}

// filtering logic (slightly overcomplicated)
function getFilteredTasks() {
    if (activeFilter === 'active') return taskBucket.filter(t => !t.completed)
    if (activeFilter === 'completed') return taskBucket.filter(t => t.completed)
    return taskBucket
}

// filter button handling
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter

        filterBtns.forEach(b => {
            b.classList.toggle('active', b === btn)
        })

        renderEverything()
    })
})

// render function (too big, but whatever)
function renderEverything() {
    const visible = getFilteredTasks()
    const activeCount = taskBucket.filter(t => !t.completed).length
    const completedCount = taskBucket.length - activeCount

    list.innerHTML = ''

    visible.forEach(task => {
        const li = document.createElement('li')
        li.className = 'task-item'
        if (task.completed) li.classList.add('completed')

        const box = document.createElement('input')
        box.type = 'checkbox'
        box.checked = task.completed
        box.addEventListener('change', () => flipTask(task.id))

        const label = document.createElement('span')
        label.className = 'task-text'
        label.textContent = task.text
        label.onclick = () => flipTask(task.id)

        const del = document.createElement('button')
        del.className = 'delete-btn'
        del.textContent = 'Delete'
        del.onclick = () => removeTask(task.id)

        li.appendChild(box)
        li.appendChild(label)
        li.appendChild(del)
        list.appendChild(li)
    })

    counter.textContent = `${activeCount} ${activeCount === 1 ? 'task' : 'tasks'} left`
    emptyBox.hidden = visible.length > 0
    wipeDoneBtn.disabled = completedCount === 0
    nukeAllBtn.disabled = taskBucket.length === 0
}

renderEverything()
