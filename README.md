# Task Management Demo Application

![Task Management Demo](https://img.shields.io/badge/Status-Active-green) ![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 Overview

A comprehensive task management web application that allows users to efficiently manage their daily tasks. This application was developed as part of **POC-1** Jira ticket to demonstrate core task management functionality.

## ✨ Features

### Core Functionality
- ➕ **Add new tasks** with title and description
- ✅ **Mark tasks as complete/incomplete** with visual feedback
- 🔍 **Filter tasks by status**:
  - All tasks
  - Active (incomplete) tasks
  - Completed tasks
- 🗑️ **Delete tasks** with confirmation
- 💾 **Local storage persistence** - tasks persist between sessions

### User Experience
- 📱 **Responsive design** - works on desktop, tablet, and mobile
- 🎨 **Modern UI** with smooth animations and transitions
- ⌨️ **Keyboard shortcuts** - Enter to add tasks, Escape to cancel
- 📊 **Task statistics** - view total, active, and completed task counts
- 🕒 **Timestamps** - track when tasks were created

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation & Usage

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kuldeepsinghpoc-beep/task-management-demo.git
   cd task-management-demo
   ```

2. **Open the application**:
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (if you have serve installed)
     npx serve .
     ```

3. **Start managing tasks**:
   - Enter a task title and description
   - Click "Add Task" or press Enter
   - Use the filter buttons to view different task categories
   - Click the checkbox to mark tasks as complete
   - Use the delete button to remove tasks

## 📁 Project Structure

```
task-management-demo/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Stylesheet with modern design
├── js/
│   ├── app.js          # Main application logic
│   ├── task.js         # Task class definition
│   └── storage.js      # Local storage utilities
├── assets/
│   └── favicon.ico     # Application icon
└── README.md           # This file
```

## 🛠️ Technical Details

### Technologies Used
- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with Flexbox and Grid
- **Vanilla JavaScript (ES6+)** - No external dependencies
- **Local Storage API** - Data persistence

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Key Features Implementation

#### Task Management
```javascript
// Task object structure
{
  id: 'unique-id',
  title: 'Task title',
  description: 'Task description',
  completed: false,
  createdAt: '2025-09-29T12:00:00.000Z'
}
```

#### Local Storage
- Tasks are automatically saved to browser's local storage
- Data persists between browser sessions
- No server or database required

#### Responsive Design
- Mobile-first approach
- Breakpoints: 768px (tablet), 1024px (desktop)
- Touch-friendly interface for mobile devices

## 🔮 Future Enhancements

### Planned Features (Potential Sub-tasks)
- [ ] **Task Categories/Tags** - Organize tasks by categories
- [ ] **Due Dates** - Set and track task deadlines
- [ ] **Priority Levels** - High, Medium, Low priority tasks
- [ ] **Task Search** - Search tasks by title or description
- [ ] **Export/Import** - Backup and restore tasks
- [ ] **Dark/Light Theme** - Toggle between themes
- [ ] **Task Notes** - Add detailed notes to tasks
- [ ] **Subtasks** - Break down tasks into smaller items
- [ ] **Task Templates** - Create reusable task templates
- [ ] **Analytics Dashboard** - Task completion statistics

## 🐛 Known Issues

- None currently reported

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related

- **Jira Ticket**: POC-1 - Create a demo application for a task management tool
- **Demo URL**: [Live Demo](https://kuldeepsinghpoc-beep.github.io/task-management-demo/)

## 📞 Support

If you have any questions or need help, please:
1. Check the existing issues
2. Create a new issue with detailed description
3. Contact: kuldeep.singh.poc@gmail.com

---

**Built with ❤️ for POC-1 Jira Ticket**