/**
 * Storage utility class for managing task persistence
 */
class TaskStorage {
    constructor() {
        this.storageKey = 'task_manager_tasks';
        this.settingsKey = 'task_manager_settings';
    }

    /**
     * Save tasks to localStorage
     * @param {Task[]} tasks - Array of tasks to save
     */
    saveTasks(tasks) {
        try {
            const tasksData = tasks.map(task => task.toJSON());
            localStorage.setItem(this.storageKey, JSON.stringify(tasksData));
            return true;
        } catch (error) {
            console.error('Error saving tasks to localStorage:', error);
            return false;
        }
    }

    /**
     * Load tasks from localStorage
     * @returns {Task[]} Array of loaded tasks
     */
    loadTasks() {
        try {
            const tasksData = localStorage.getItem(this.storageKey);
            if (!tasksData) {
                return [];
            }

            const parsedData = JSON.parse(tasksData);
            return parsedData.map(data => Task.fromJSON(data));
        } catch (error) {
            console.error('Error loading tasks from localStorage:', error);
            return [];
        }
    }

    /**
     * Clear all tasks from storage
     */
    clearTasks() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error clearing tasks from localStorage:', error);
            return false;
        }
    }

    /**
     * Save application settings
     * @param {object} settings - Settings object to save
     */
    saveSettings(settings) {
        try {
            localStorage.setItem(this.settingsKey, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Error saving settings to localStorage:', error);
            return false;
        }
    }

    /**
     * Load application settings
     * @returns {object} Loaded settings object
     */
    loadSettings() {
        try {
            const settingsData = localStorage.getItem(this.settingsKey);
            if (!settingsData) {
                return this.getDefaultSettings();
            }
            return { ...this.getDefaultSettings(), ...JSON.parse(settingsData) };
        } catch (error) {
            console.error('Error loading settings from localStorage:', error);
            return this.getDefaultSettings();
        }
    }

    /**
     * Get default application settings
     * @returns {object} Default settings
     */
    getDefaultSettings() {
        return {
            currentFilter: 'all',
            theme: 'light',
            autoSave: true,
            showCompletedTasks: true
        };
    }

    /**
     * Export tasks to JSON file
     * @param {Task[]} tasks - Tasks to export
     */
    exportTasks(tasks) {
        try {
            const exportData = {
                exportDate: new Date().toISOString(),
                version: '1.0',
                tasks: tasks.map(task => task.toJSON())
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `tasks_export_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);
            return true;
        } catch (error) {
            console.error('Error exporting tasks:', error);
            return false;
        }
    }

    /**
     * Import tasks from JSON file
     * @param {File} file - File to import from
     * @returns {Promise<Task[]>} Promise that resolves to imported tasks
     */
    importTasks(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    
                    if (!importData.tasks || !Array.isArray(importData.tasks)) {
                        throw new Error('Invalid file format');
                    }

                    const tasks = importData.tasks.map(data => Task.fromJSON(data));
                    resolve(tasks);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => {
                reject(new Error('Error reading file'));
            };

            reader.readAsText(file);
        });
    }

    /**
     * Check if localStorage is available
     * @returns {boolean} True if localStorage is available
     */
    isStorageAvailable() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get storage usage information
     * @returns {object} Storage usage stats
     */
    getStorageStats() {
        try {
            const tasks = JSON.stringify(this.loadTasks());
            const settings = JSON.stringify(this.loadSettings());
            
            return {
                tasksSize: new Blob([tasks]).size,
                settingsSize: new Blob([settings]).size,
                totalSize: new Blob([tasks + settings]).size,
                available: this.isStorageAvailable()
            };
        } catch (error) {
            return {
                tasksSize: 0,
                settingsSize: 0,
                totalSize: 0,
                available: false,
                error: error.message
            };
        }
    }
}

// Export for use in other files (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaskStorage;
}