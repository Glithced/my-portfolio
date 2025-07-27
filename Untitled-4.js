/**
 * Jordi Kongolo Portfolio - JavaScript Implementation
 * Standalone JavaScript code for all interactive functionality
 * This file contains all the JavaScript logic used in the portfolio website
 */

// ========================================
// CALCULATOR FUNCTIONALITY
// ========================================

class Calculator {
    constructor(displayElementId) {
        this.display = document.getElementById(displayElementId);
        this.shouldResetDisplay = false;
        this.init();
    }

    init() {
        // Set initial display value
        this.display.value = '0';
    }

    appendToDisplay(value) {
        if (this.shouldResetDisplay) {
            this.display.value = '';
            this.shouldResetDisplay = false;
        }
        
        if (this.display.value === '0' && value !== '.') {
            this.display.value = value;
        } else {
            this.display.value += value;
        }
    }

    clearDisplay() {
        this.display.value = '0';
    }

    deleteLast() {
        if (this.display.value.length > 1) {
            this.display.value = this.display.value.slice(0, -1);
        } else {
            this.display.value = '0';
        }
    }

    calculateResult() {
        try {
            // Replace display multiplication symbol with JavaScript operator
            const expression = this.display.value.replace(/×/g, '*');
            
            // Evaluate the expression (Note: In production, use a safer expression parser)
            const result = eval(expression);
            
            // Handle division by zero and other special cases
            if (!isFinite(result)) {
                this.display.value = 'Error';
            } else {
                this.display.value = result.toString();
            }
            
            this.shouldResetDisplay = true;
        } catch (error) {
            this.display.value = 'Error';
            this.shouldResetDisplay = true;
        }
    }
}

// ========================================
// WEATHER APP FUNCTIONALITY
// ========================================

class WeatherApp {
    constructor() {
        this.weatherData = {
            'london': { temp: 15, condition: 'Cloudy', icon: '☁️', humidity: 78, wind: 8 },
            'new york': { temp: 22, condition: 'Sunny', icon: '☀️', humidity: 55, wind: 12 },
            'tokyo': { temp: 18, condition: 'Rainy', icon: '🌧️', humidity: 85, wind: 6 },
            'cape town': { temp: 22, condition: 'Sunny', icon: '☀️', humidity: 65, wind: 12 },
            'paris': { temp: 16, condition: 'Partly Cloudy', icon: '⛅', humidity: 70, wind: 10 },
            'johannesburg': { temp: 20, condition: 'Clear', icon: '☀️', humidity: 45, wind: 15 },
            'durban': { temp: 24, condition: 'Humid', icon: '🌤️', humidity: 80, wind: 10 },
            'pretoria': { temp: 19, condition: 'Partly Cloudy', icon: '⛅', humidity: 55, wind: 12 }
        };
        this.currentCity = 'cape town';
        this.isLoading = false;
    }

    async getWeather(city) {
        if (!city) return;

        this.isLoading = true;
        this.updateLoadingState();

        // Simulate API delay
        setTimeout(() => {
            const cityLower = city.toLowerCase().trim();
            const weatherInfo = this.weatherData[cityLower];

            if (weatherInfo) {
                this.displayWeather(cityLower, weatherInfo);
            } else {
                this.displayError();
            }

            this.isLoading = false;
        }, 500);
    }

    displayWeather(city, data) {
        const displayElement = document.getElementById('weatherDisplay');
        if (!displayElement) return;

        const cityName = city.charAt(0).toUpperCase() + city.slice(1);
        
        displayElement.innerHTML = `
            <div class="weather-icon">${data.icon}</div>
            <div class="weather-temp">${data.temp}°C</div>
            <div style="font-size: 1.1rem; margin-bottom: 0.25rem;">${cityName}</div>
            <div style="font-size: 0.875rem; opacity: 0.9; margin-bottom: 1rem;">${data.condition}</div>
            <div class="weather-details">
                <div>
                    <div style="opacity: 0.75;">Humidity</div>
                    <div style="font-weight: 600;">${data.humidity}%</div>
                </div>
                <div>
                    <div style="opacity: 0.75;">Wind</div>
                    <div style="font-weight: 600;">${data.wind} km/h</div>
                </div>
            </div>
        `;
    }

    displayError() {
        const displayElement = document.getElementById('weatherDisplay');
        if (!displayElement) return;

        displayElement.innerHTML = `
            <div class="weather-icon">❓</div>
            <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">City not found</div>
            <div style="font-size: 0.75rem; opacity: 0.75;">Try: London, New York, Tokyo, Cape Town, Paris</div>
        `;
    }

    updateLoadingState() {
        const displayElement = document.getElementById('weatherDisplay');
        if (!displayElement || !this.isLoading) return;

        displayElement.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; padding: 2rem;">
                <div style="animation: spin 1s linear infinite;">🌀</div>
            </div>
        `;
    }

    searchWeather() {
        const input = document.getElementById('cityInput');
        if (!input) return;

        const city = input.value.trim();
        if (city) {
            this.getWeather(city);
            input.value = '';
        }
    }
}

// ========================================
// TODO APP FUNCTIONALITY
// ========================================

class TodoApp {
    constructor() {
        this.todos = [
            { id: 1, text: "Complete portfolio website", completed: false, createdAt: new Date('2024-07-09T10:00:00Z') },
            { id: 2, text: "Study JavaScript concepts", completed: true, createdAt: new Date('2024-07-09T09:00:00Z') },
            { id: 3, text: "Apply for internships", completed: false, createdAt: new Date('2024-07-09T08:00:00Z') }
        ];
        this.nextId = 4;
    }

    addTodo(text) {
        if (!text || !text.trim()) return;

        const newTodo = {
            id: this.nextId++,
            text: text.trim(),
            completed: false,
            createdAt: new Date()
        };

        this.todos.unshift(newTodo); // Add to beginning of array
        this.renderTodos();
        this.saveTodos();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.renderTodos();
            this.saveTodos();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.renderTodos();
        this.saveTodos();
    }

    renderTodos() {
        const todoList = document.getElementById('todoList');
        if (!todoList) return;

        if (this.todos.length === 0) {
            todoList.innerHTML = '<div style="text-align: center; color: #64748b; padding: 1rem;">No tasks yet</div>';
            return;
        }

        todoList.innerHTML = this.todos.map(todo => `
            <div class="todo-item">
                <input type="checkbox" class="todo-checkbox" 
                       ${todo.completed ? 'checked' : ''} 
                       onchange="todoApp.toggleTodo(${todo.id})">
                <span class="todo-text ${todo.completed ? 'completed' : ''}">${this.escapeHtml(todo.text)}</span>
                <button class="todo-delete" onclick="todoApp.deleteTodo(${todo.id})" title="Delete task">🗑️</button>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTodos() {
        try {
            localStorage.setItem('jordi-portfolio-todos', JSON.stringify(this.todos));
        } catch (error) {
            console.warn('Could not save todos to localStorage:', error);
        }
    }

    loadTodos() {
        try {
            const saved = localStorage.getItem('jordi-portfolio-todos');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.todos = parsed.map(todo => ({
                    ...todo,
                    createdAt: new Date(todo.createdAt)
                }));
                
                // Update nextId to avoid conflicts
                const maxId = Math.max(...this.todos.map(t => t.id), 0);
                this.nextId = maxId + 1;
            }
        } catch (error) {
            console.warn('Could not load todos from localStorage:', error);
        }
    }

    init() {
        this.loadTodos();
        this.renderTodos();
    }
}

// ========================================
// BLOG APP FUNCTIONALITY
// ========================================

class BlogApp {
    constructor() {
        this.posts = [
            {
                id: 1,
                title: "Getting Started with Web Development",
                content: "Web development has been an incredible journey for me. Starting with HTML and CSS, I quickly discovered the power of creating interactive experiences.\n\nJavaScript opened up a whole new world of possibilities, allowing me to build dynamic applications that respond to user input. The key to success in web development is consistent practice and staying curious about new technologies.\n\nSome key lessons I've learned:\n• Start with the fundamentals\n• Practice every day\n• Build real projects\n• Join developer communities\n• Never stop learning",
                excerpt: "My journey into web development and the lessons learned along the way.",
                category: "Development",
                createdAt: new Date('2024-07-09T10:00:00Z')
            },
            {
                id: 2,
                title: "My Journey in Computer Science",
                content: "Computer science is more than just coding - it's about problem-solving, logical thinking, and understanding how technology can improve people's lives.\n\nAs a high school student passionate about this field, I've explored various aspects from algorithms to software engineering principles. Each project teaches me something new about efficiency, user experience, and the importance of clean, maintainable code.\n\nWhat excites me most about computer science is its endless possibilities. Whether it's creating mobile apps, building web applications, or exploring artificial intelligence, there's always something new to learn and discover.",
                excerpt: "Exploring the fascinating world of computer science as a student.",
                category: "Education",
                createdAt: new Date('2024-07-09T09:30:00Z')
            },
            {
                id: 3,
                title: "Tips for Young Developers",
                content: "Starting your development journey can feel overwhelming, but here are some tips that have helped me:\n\n1. Start with the basics and build a strong foundation\n2. Practice coding every day, even if it's just for 30 minutes\n3. Build projects that solve real problems\n4. Don't be afraid to ask questions and seek help from the community\n5. Stay updated with industry trends but focus on mastering fundamentals first\n\nRemember, every expert was once a beginner. The key is consistency and never giving up on your goals.",
                excerpt: "Practical advice for aspiring developers just starting their journey.",
                category: "Tips",
                createdAt: new Date('2024-07-09T09:00:00Z')
            }
        ];
        this.selectedPost = null;
    }

    renderPosts() {
        const blogContainer = document.querySelector('.blog-app');
        if (!blogContainer) return;

        if (this.selectedPost) {
            this.renderSelectedPost(blogContainer);
        } else {
            this.renderPostList(blogContainer);
        }
    }

    renderPostList(container) {
        container.innerHTML = `
            <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">Featured Posts:</div>
            <div style="max-height: 250px; overflow-y: auto;">
                ${this.posts.map(post => `
                    <div class="blog-post" onclick="blogApp.selectPost(${post.id})">
                        <div class="blog-title">📄 ${this.escapeHtml(post.title)}</div>
                        <div class="blog-excerpt">${this.escapeHtml(post.excerpt)}</div>
                        <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.25rem;">
                            ${post.category} • ${this.formatDate(post.createdAt)}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderSelectedPost(container) {
        const post = this.selectedPost;
        container.innerHTML = `
            <div style="max-height: 350px; overflow-y: auto;">
                <button onclick="blogApp.goBack()" 
                        style="margin-bottom: 1rem; padding: 0.5rem 1rem; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 0.25rem; cursor: pointer;">
                    ← Back to Posts
                </button>
                <article>
                    <h2 style="font-size: 1.25rem; font-weight: bold; color: #1e293b; margin-bottom: 0.5rem;">
                        ${this.escapeHtml(post.title)}
                    </h2>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; font-size: 0.75rem; color: #64748b;">
                        📅 ${this.formatDate(post.createdAt)}
                        <span style="background: #e2e8f0; color: #475569; padding: 0.125rem 0.5rem; border-radius: 0.75rem;">
                            ${post.category}
                        </span>
                    </div>
                    <div style="line-height: 1.6; color: #374151;">
                        ${post.content.split('\n').map(paragraph => 
                            paragraph.trim() ? `<p style="margin-bottom: 0.75rem;">${this.escapeHtml(paragraph)}</p>` : ''
                        ).join('')}
                    </div>
                </article>
            </div>
        `;
    }

    selectPost(id) {
        this.selectedPost = this.posts.find(p => p.id === id);
        this.renderPosts();
    }

    goBack() {
        this.selectedPost = null;
        this.renderPosts();
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    init() {
        this.renderPosts();
    }
}

// ========================================
// NAVIGATION AND SMOOTH SCROLLING
// ========================================

class Navigation {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupScrollSpy();
    }

    setupSmoothScrolling() {
        // Add smooth scrolling to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('open');
            });

            // Close mobile menu when clicking on a link
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('open');
                });
            });
        }
    }

    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

        if (sections.length === 0 || navLinks.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remove active class from all nav links
                    navLinks.forEach(link => link.classList.remove('active'));
                    
                    // Add active class to current section's nav link
                    const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// ========================================
// CONTACT FORM FUNCTIONALITY
// ========================================

class ContactForm {
    constructor() {
        this.init();
    }

    init() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        // Validate form data
        if (!this.validateForm(data)) {
            return;
        }

        // Simulate form submission
        this.submitForm(data);
    }

    validateForm(data) {
        const errors = [];

        if (!data.name || data.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }

        if (!data.message || data.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
        }

        if (errors.length > 0) {
            alert('Please fix the following errors:\n' + errors.join('\n'));
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    submitForm(data) {
        // Show loading state
        const submitBtn = document.querySelector('#contactForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            alert('Thank you for your message! I\'ll get back to you soon.');
            
            // Reset form
            document.getElementById('contactForm').reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

const Utils = {
    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format date for display
    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    },

    // Animate element on scroll
    animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
};

// ========================================
// GLOBAL INSTANCES AND INITIALIZATION
// ========================================

// Global instances
let calculator;
let weatherApp;
let todoApp;
let blogApp;
let navigation;
let contactForm;

// Global functions for HTML onclick handlers
function appendToCalc(value) {
    if (calculator) calculator.appendToDisplay(value);
}

function clearCalc() {
    if (calculator) calculator.clearDisplay();
}

function deleteLast() {
    if (calculator) calculator.deleteLast();
}

function calculateResult() {
    if (calculator) calculator.calculateResult();
}

function getWeather() {
    if (weatherApp) weatherApp.searchWeather();
}

function addTodo() {
    const input = document.getElementById('todoInput');
    if (input && todoApp) {
        todoApp.addTodo(input.value);
        input.value = '';
    }
}

function showBlogPost(id) {
    if (blogApp) blogApp.selectPost(id);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Jordi Kongolo Portfolio - JavaScript Loaded');

    // Initialize all components
    calculator = new Calculator('calcDisplay');
    weatherApp = new WeatherApp();
    todoApp = new TodoApp();
    blogApp = new BlogApp();
    navigation = new Navigation();
    contactForm = new ContactForm();

    // Initialize components that need it
    todoApp.init();
    blogApp.init();

    // Setup keyboard shortcuts
    setupKeyboardShortcuts();

    // Setup animations
    Utils.animateOnScroll();

    // Add some custom styles for animations
    addCustomAnimations();

    console.log('✅ All components initialized successfully');
});

// ========================================
// KEYBOARD SHORTCUTS AND EVENT LISTENERS
// ========================================

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Todo app shortcuts
        if (e.target.id === 'todoInput' && e.key === 'Enter') {
            addTodo();
        }

        // Weather app shortcuts
        if (e.target.id === 'cityInput' && e.key === 'Enter') {
            getWeather();
        }

        // Calculator shortcuts
        if (e.target.id === 'calcDisplay') {
            e.preventDefault(); // Prevent typing in readonly input
        }

        // Global shortcuts (when not typing in inputs)
        if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
            switch(e.key) {
                case 'h':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        navigation.scrollToSection('home');
                    }
                    break;
                case 'p':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        navigation.scrollToSection('projects');
                    }
                    break;
                case 'c':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        navigation.scrollToSection('contact');
                    }
                    break;
            }
        }
    });
}

// ========================================
// CUSTOM ANIMATIONS AND STYLES
// ========================================

function addCustomAnimations() {
    // Add animation styles to head if not already present
    if (!document.querySelector('#custom-animations')) {
        const style = document.createElement('style');
        style.id = 'custom-animations';
        style.textContent = `
            .animate-fade-in {
                animation: fadeInUp 0.6s ease-out forwards;
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            .nav-links a.active {
                color: #3b82f6;
                position: relative;
            }

            .nav-links a.active::after {
                content: '';
                position: absolute;
                bottom: -5px;
                left: 0;
                right: 0;
                height: 2px;
                background: #3b82f6;
                border-radius: 1px;
            }

            /* Smooth transitions for all interactive elements */
            button, input, .blog-post, .project-card {
                transition: all 0.2s ease;
            }

            /* Hover effects */
            .blog-post:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .calc-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            }

            /* Loading animation */
            .loading {
                display: inline-block;
                animation: spin 1s linear infinite;
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// PERFORMANCE MONITORING
// ========================================

// Simple performance monitoring
const Performance = {
    start: Date.now(),
    
    log(message) {
        const elapsed = Date.now() - this.start;
        console.log(`⏱️ ${message} (${elapsed}ms)`);
    },

    measure(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`📊 ${name}: ${(end - start).toFixed(2)}ms`);
        return result;
    }
};
