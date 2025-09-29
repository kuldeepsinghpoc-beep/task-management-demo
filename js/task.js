/**
 * Task class representing a single task item
 */
class Task {
    constructor(title, description = '', id = null) {
        this.id = id || this.generateId();
        this.title = title.trim();
        this.description = description.trim();
        this.completed = false;
        this.createdAt = new Date().toISOString();
    }

    /**
     * Generate a unique ID for the task
     * @returns {string} Unique identifier
     */
    generateId() {
        return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Toggle the completed status of the task
     */
    toggle() {
        this.completed = !this.completed;
    }

    /**
     * Mark the task as completed
     */
    complete() {
        this.completed = true;
    }

    /**
     * Mark the task as incomplete
     */
    incomplete() {
        this.completed = false;
    }

    /**
     * Update task details
     * @param {string} title - New title
     * @param {string} description - New description
     */
    update(title, description = '') {
        this.title = title.trim();
        this.description = description.trim();
    }

    /**
     * Get formatted creation date
     * @returns {string} Formatted date string
     */
    getFormattedDate() {
        const date = new Date(this.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return 'Today';
        } else if (diffDays === 2) {
            return 'Yesterday';
        } else if (diffDays <= 7) {
            return `${diffDays - 1} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    /**
     * Convert task to JSON object
     * @returns {object} Task data as plain object
     */
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            completed: this.completed,
            createdAt: this.createdAt
        };
    }

    /**
     * Create Task instance from JSON object
     * @param {object} data - Task data object
     * @returns {Task} Task instance
     */
    static fromJSON(data) {
        const task = new Task(data.title, data.description, data.id);
        task.completed = data.completed;
        task.createdAt = data.createdAt;
        return task;
    }

    /**
     * Validate task data
     * @returns {boolean} True if task is valid
     */
    isValid() {
        return this.title.length > 0 && this.title.length <= 100;
    }
}

// Export for use in other files (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Task;
}