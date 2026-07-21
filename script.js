// DOM Elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const themeToggleBtn = document.getElementById('theme-toggle');

// State Management
let tasks = [];

// --- THEME LOGIC ---
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggleBtn.textContent = '☀️';
}

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggleBtn.textContent = '🌙';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.textContent = '☀️';
    }
});

// --- TASK TRACKER LOGIC ---

// 1. Add Task Event Listener
taskForm.addEventListener('submit', function (e) {
    e.preventDefault(); 

    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    renderTasks();
    taskInput.value = '';
});

// 2. Event Delegation for Complete and Delete Actions
taskList.addEventListener('click', function (e) {
    const target = e.target;
    const taskItem = target.closest('.task-item');
    if (!taskItem) return;
    
    const taskId = Number(taskItem.dataset.id);

    // Handle Delete Action
    if (target.classList.contains('delete-btn')) {
        tasks = tasks.filter(task => task.id !== taskId);
        renderTasks();
    }

    // Handle Complete Toggle Action
    if (target.classList.contains('complete-btn')) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        renderTasks();
    }
});

// 3. Render Function
function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        li.innerHTML = `
            <span>${escapeHtml(task.text)}</span>
            <div class="task-actions">
                <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// Utility function to prevent XSS injection
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}