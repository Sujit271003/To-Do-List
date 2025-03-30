document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clearCompleted');

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    // Render tasks
    function renderTasks() {
        taskList.innerHTML = '';
        const filteredTasks = filterTasks(tasks, currentFilter);

        filteredTasks.forEach((task, index) => {
            const li = createTaskElement(task, index);
            taskList.appendChild(li);
        });

        // Save to localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Create task element
    function createTaskElement(task, index) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span>${task.text}</span>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;

        // Add event listeners
        const checkbox = li.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => toggleTask(index));

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(index));

        return li;
    }

    // Add new task
    function addTask(text) {
        if (text.trim() === '') return;
        
        tasks.push({
            text: text.trim(),
            completed: false,
            id: Date.now()
        });
        
        taskInput.value = '';
        renderTasks();
    }

    // Toggle task completion
    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
    }

    // Delete task
    function deleteTask(index) {
        tasks.splice(index, 1);
        renderTasks();
    }

    // Filter tasks
    function filterTasks(tasks, filter) {
        switch (filter) {
            case 'active':
                return tasks.filter(task => !task.completed);
            case 'completed':
                return tasks.filter(task => task.completed);
            default:
                return tasks;
        }
    }

    // Event Listeners
    addTaskBtn.addEventListener('click', () => addTask(taskInput.value));
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(taskInput.value);
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        renderTasks();
    });

    // Initial render
    renderTasks();
}); 