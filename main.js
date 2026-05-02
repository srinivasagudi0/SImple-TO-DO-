let tasks = JSON.parse(localStorage.getItem("tasks")) || []
// First get stuff from index.html
const taskInput = document.getElementById('taskInput')
const taskList = document.getElementById('taskList')
const addBtn = document.getElementById('addBtn')

// When button is clicked 
addBtn.addEventListener('click', addTask)

// Also allow pressing Enter key, this is a litttle upgrade
taskInput.addEventListener('keypress', function (e) {
    
    if (e.key === 'Enter') {
        addTask()
 }
})

// with a python background i did this "function addTask(taskText)" 😅
function addTask() {
    const taskText = taskInput.value.trim() // get input value

    if (taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        }

        tasks.push(task) // store in array
        renderTasks() // show on screen
        localStorage.setItem("tasks", JSON.stringify(tasks)) // save it locally
        taskInput.value = '' // clear input
    }
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id)
    if (task) {
        task.completed = !task.completed
        renderTasks()
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }
}

function renderTasks() {
    taskList.innerHTML = '' // clear list first

    tasks.forEach(function(task) {
        const li = document.createElement('li') // create a new line, so it will also be easier to addd checkboxes
        li.textContent = task.text // put text inside
        li.addEventListener('click', function() {
            toggleTask(task.id)
        })

        if (task.completed) {
            li.classList.add('completed')
        }

        taskList.appendChild(li) // add to the list
    })
}

renderTasks()
