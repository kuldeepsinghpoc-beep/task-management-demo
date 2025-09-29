/**
 * Main Task Management Application
 */
class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.storage = new TaskStorage();
        this.taskToDelete = null;
        
        this.initializeElements();
        this.loadTasks();
        this.bindEvents();
        this.updateUI();
        
        console.log('Task Manager initialized successfully!');
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        // Input elements
        this.titleInput = document.getElementById('taskTitle');
        this.descriptionInput = document.getElementById('taskDescription');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        
        // Filter elements
        this.filterBtns = document.querySelectorAll('.filter-btn');
        
        // Container elements
        this.tasksContainer = document.getElementById('tasksContainer');
        this.emptyState = document.getElementById('emptyState');
        
        // Statistics elements
        this.totalTasksEl = document.getElementById('totalTasks');
        this.activeTasksEl = document.getElementById('activeTasks');
        this.completedTasksEl = document.getElementById('completedTasks');
        
        // Modal elements
        this.deleteTaskModal = document.getElementById('deleteTaskModal');
        this.clearAllModal = document.getElementById('clearAllModal');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Add task events
        this.addTaskBtn.addEventListener('click', () => this.handleAddTask());
        this.titleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleAddTask();
        });
        this.descriptionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) this.handleAddTask();
        });

        // Filter events
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.setFilter(filter);
            });
        });

        // Modal events
        document.getElementById('confirmDeleteTask')?.addEventListener('click', () => {
            this.confirmDeleteTask();
        });
        
        document.getElementById('cancelDeleteTask')?.addEventListener('click', () => {
            this.hideModal(this.deleteTaskModal);
        });
        
        document.getElementById('confirmClearAll')?.addEventListener('click', () => {
            this.clearAllTasks();
        });
        
        document.getElementById('cancelClearAll')?.addEventListener('click', () => {
            this.hideModal(this.clearAllModal);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAllModals();
            }
        });

        // Click outside modal to close
        [this.deleteTaskModal, this.clearAllModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.hideModal(modal);
                    }
                });
            }
        });

        // Auto-save on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveTasks();
            }
        });

        // Auto-save on beforeunload
        window.addEventListener('beforeunload', () => {
            this.saveTasks();
        });
    }

    /**
     * Handle adding a new task
     */
    handleAddTask() {
        const title = this.titleInput.value.trim();
        const description = this.descriptionInput.value.trim();

        if (!title) {
            this.showError('Please enter a task title');
            this.titleInput.focus();
            return;
        }

        if (title.length > 100) {
            this.showError('Task title must be 100 characters or less');
            return;
        }

        if (description.length > 500) {
            this.showError('Task description must be 500 characters or less');
            return;
        }

        const task = new Task(title, description);
        this.addTask(task);
        this.clearInputs();
        this.titleInput.focus();
    }

    /**
     * Add a task to the list
     * @param {Task} task - Task to add
     */
    addTask(task) {
        this.tasks.unshift(task); // Add to beginning for newest first
        this.saveTasks();
        this.updateUI();
        this.showSuccess('Task added successfully!');
    }

    /**
     * Delete a task
     * @param {string} taskId - ID of task to delete
     */
    deleteTask(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex > -1) {
            const task = this.tasks[taskIndex];
            this.tasks.splice(taskIndex, 1);
            this.saveTasks();
            this.updateUI();
            this.showSuccess(`Task "${task.title}" deleted`);
        }
    }

    /**
     * Toggle task completion status
     * @param {string} taskId - ID of task to toggle
     */
    toggleTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.toggle();
            this.saveTasks();
            this.updateUI();
            
            const status = task.completed ? 'completed' : 'reactivated';
            this.showSuccess(`Task ${status}!`);
        }
    }

    /**
     * Set current filter
     * @param {string} filter - Filter type ('all', 'active', 'completed')
     */
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.updateTaskDisplay();
    }

    /**
     * Get filtered tasks based on current filter
     * @returns {Task[]} Filtered tasks
     */
    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    /**
     * Update the entire UI
     */
    updateUI() {
        this.updateStatistics();
        this.updateTaskDisplay();
    }

    /**
     * Update statistics display
     */
    updateStatistics() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const active = total - completed;

        if (this.totalTasksEl) this.totalTasksEl.textContent = total;
        if (this.activeTasksEl) this.activeTasksEl.textContent = active;
        if (this.completedTasksEl) this.completedTasksEl.textContent = completed;
    }

    /**
     * Update task display based on current filter
     */
    updateTaskDisplay() {
        const filteredTasks = this.getFilteredTasks();
        this.renderTasks(filteredTasks);
        
        // Show/hide empty state
        if (this.emptyState) {
            this.emptyState.style.display = filteredTasks.length === 0 ? 'block' : 'none';
        }
    }

    /**
     * Render tasks in the DOM
     * @param {Task[]} tasks - Tasks to render
     */
    renderTasks(tasks) {
        if (!this.tasksContainer) return;
        
        this.tasksContainer.innerHTML = '';
        
        tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            this.tasksContainer.appendChild(taskElement);
        });
    }

    /**
     * Create DOM element for a task
     * @param {Task} task - Task to create element for
     * @returns {HTMLElement} Task DOM element
     */
    createTaskElement(task) {
        const taskEl = document.createElement('div');
        taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskEl.dataset.taskId = task.id;

        taskEl.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                 onclick="taskManager.toggleTask('${task.id}')"></div>
            <div class="task-content">
                <div class="task-title">${this.escapeHtml(task.title)}</div>
                ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
                <div class="task-meta">
                    <span>Created: ${task.getFormattedDate()}</span>
                    ${task.completed ? '<span>✓ Completed</span>' : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="task-btn delete-btn" 
                        onclick="taskManager.showDeleteConfirmation('${task.id}')"
                        title="Delete task">
                    🗑️
                </button>
            </div>
        `;

        return taskEl;
    }

    /**
     * Show delete confirmation modal
     * @param {string} taskId - ID of task to delete
     */
    showDeleteConfirmation(taskId) {
        this.taskToDelete = taskId;
        this.showModal(this.deleteTaskModal);
    }

    /**
     * Confirm and execute task deletion
     */
    confirmDeleteTask() {
        if (this.taskToDelete) {
            this.deleteTask(this.taskToDelete);
            this.taskToDelete = null;
            this.hideModal(this.deleteTaskModal);
        }
    }

    /**
     * Clear all tasks
     */
    clearAllTasks() {
        this.tasks = [];
        this.saveTasks();
        this.updateUI();
        this.hideModal(this.clearAllModal);
        this.showSuccess('All tasks cleared!');
    }

    /**
     * Show modal
     * @param {HTMLElement} modal - Modal element to show
     */
    showModal(modal) {
        if (modal) {
            modal.classList.add('active');
        }
    }

    /**
     * Hide modal
     * @param {HTMLElement} modal - Modal element to hide
     */
    hideModal(modal) {
        if (modal) {
            modal.classList.remove('active');
        }
    }

    /**
     * Hide all modals
     */
    hideAllModals() {
        [this.deleteTaskModal, this.clearAllModal].forEach(modal => {
            this.hideModal(modal);
        });
    }

    /**
     * Clear input fields
     */
    clearInputs() {
        if (this.titleInput) this.titleInput.value = '';
        if (this.descriptionInput) this.descriptionInput.value = '';
    }

    /**
     * Save tasks to storage
     */
    saveTasks() {
        this.storage.saveTasks(this.tasks);
    }

    /**
     * Load tasks from storage
     */
    loadTasks() {
        this.tasks = this.storage.loadTasks();
    }

    /**
     * Show success message
     * @param {string} message - Success message
     */
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        this.showNotification(message, 'error');
    }

    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type ('success', 'error', 'info')
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateY(-20px)',
            transition: 'all 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        // Add to DOM
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);

        // Hide and remove notification
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Escape HTML characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Export tasks to JSON file
     */
    exportTasks() {
        return this.storage.exportTasks(this.tasks);
    }

    /**
     * Import tasks from file
     * @param {File} file - File to import
     */
    async importTasks(file) {
        try {
            const importedTasks = await this.storage.importTasks(file);
            this.tasks = [...this.tasks, ...importedTasks];
            this.saveTasks();
            this.updateUI();
            this.showSuccess(`Imported ${importedTasks.length} tasks successfully!`);
        } catch (error) {
            this.showError('Error importing tasks: ' + error.message);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
});