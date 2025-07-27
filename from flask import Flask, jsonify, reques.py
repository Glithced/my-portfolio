from flask import Flask, jsonify, request, render_template_string
from flask_cors import CORS
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# In-memory storage for demonstration
todos = [
    {"id": 1, "text": "Complete portfolio website", "completed": False, "created_at": "2024-07-09T10:00:00Z"},
    {"id": 2, "text": "Study JavaScript concepts", "completed": True, "created_at": "2024-07-09T09:00:00Z"},
    {"id": 3, "text": "Apply for internships", "completed": False, "created_at": "2024-07-09T08:00:00Z"}
]

blog_posts = [
    {
        "id": 1,
        "title": "Getting Started with Web Development",
        "content": "Web development has been an incredible journey for me. Starting with HTML and CSS, I quickly discovered the power of creating interactive experiences. JavaScript opened up a whole new world of possibilities, allowing me to build dynamic applications that respond to user input. The key to success in web development is consistent practice and staying curious about new technologies.",
        "excerpt": "My journey into web development and the lessons learned along the way.",
        "category": "Development",
        "created_at": "2024-07-09T10:00:00Z"
    },
    {
        "id": 2,
        "title": "My Journey in Computer Science",
        "content": "Computer science is more than just coding - it's about problem-solving, logical thinking, and understanding how technology can improve people's lives. As a high school student passionate about this field, I've explored various aspects from algorithms to software engineering principles. Each project teaches me something new about efficiency, user experience, and the importance of clean, maintainable code.",
        "excerpt": "Exploring the fascinating world of computer science as a student.",
        "category": "Education",
        "created_at": "2024-07-09T09:30:00Z"
    },
    {
        "id": 3,
        "title": "Tips for Young Developers",
        "content": "Starting your development journey can feel overwhelming, but here are some tips that have helped me: 1) Start with the basics and build a strong foundation, 2) Practice coding every day, even if it's just for 30 minutes, 3) Build projects that solve real problems, 4) Don't be afraid to ask questions and seek help from the community, 5) Stay updated with industry trends but focus on mastering fundamentals first.",
        "excerpt": "Practical advice for aspiring developers just starting their journey.",
        "category": "Tips",
        "created_at": "2024-07-09T09:00:00Z"
    }
]

weather_data = {
    'london': {'temp': 15, 'condition': 'Cloudy', 'icon': '☁️', 'humidity': 78, 'wind': 8},
    'new york': {'temp': 22, 'condition': 'Sunny', 'icon': '☀️', 'humidity': 55, 'wind': 12},
    'tokyo': {'temp': 18, 'condition': 'Rainy', 'icon': '🌧️', 'humidity': 85, 'wind': 6},
    'cape town': {'temp': 22, 'condition': 'Sunny', 'icon': '☀️', 'humidity': 65, 'wind': 12},
    'paris': {'temp': 16, 'condition': 'Partly Cloudy', 'icon': '⛅', 'humidity': 70, 'wind': 10}
}

# Counter for generating unique IDs
next_todo_id = 4
next_blog_post_id = 4

@app.route('/')
def home():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Jordi Kongolo Portfolio API</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }
            .endpoint { margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px; border-left: 4px solid #4CAF50; }
            .method { font-weight: bold; color: #2196F3; }
            .url { font-family: monospace; background: #e8e8e8; padding: 2px 6px; border-radius: 3px; }
            .description { margin-top: 5px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Jordi Kongolo Portfolio API</h1>
            <p>Backend API for the portfolio website built with Flask (Python). This API provides endpoints for managing todos, blog posts, and weather data.</p>
            
            <h2>Available Endpoints:</h2>
            
            <div class="endpoint">
                <div><span class="method">GET</span> <span class="url">/api/todos</span></div>
                <div class="description">Get all todo items</div>
            </div>
            
            <div class="endpoint">
                <div><span class="method">POST</span> <span class="url">/api/todos</span></div>
                <div class="description">Create a new todo item (JSON body: {"text": "Task description"})</div>
            </div>
            
            <div class="endpoint">
                <div><span class="method">PATCH</span> <span class="url">/api/todos/&lt;id&gt;</span></div>
                <div class="description">Update todo completion status (JSON body: {"completed": true/false})</div>
            </div>
            
            <div class="endpoint">
                <div><span class="method">DELETE</span> <span class="url">/api/todos/&lt;id&gt;</span></div>
                <div class="description">Delete a todo item</div>
            </div>
            
            <div class="endpoint">
                <div><span class="method">GET</span> <span class="url">/api/blog-posts</span></div>
                <div class="description">Get all blog posts</div>
            </div>
            
            <div class="endpoint">
                <div><span class="method">GET</span> <span class="url">/api/blog-posts/&lt;id&gt;</span></div>
                <div class="description">Get a specific blog post by ID</div>
            </div>
            
            <div class="endpoint">
                <div><span class="method">POST</span> <span class="url">/api/blog-posts</span></div>
                <div class="description">Create a new blog post (JSON body: {"title": "...", "content": "...", "excerpt": "...", "category": "..."})</div>
            </div>
            
            <div class="endpoint">
                <div><span class="method">GET</span> <span class="url">/api/weather/&lt;city&gt;</span></div>
                <div class="description">Get weather data for a city (Available: london, new york, tokyo, cape town, paris)</div>
            </div>
            
            <h2>Tech Stack:</h2>
            <ul>
                <li><strong>Framework:</strong> Flask (Python)</li>
                <li><strong>CORS:</strong> Flask-CORS for cross-origin requests</li>
                <li><strong>Storage:</strong> In-memory (for demonstration)</li>
                <li><strong>Data Format:</strong> JSON</li>
            </ul>
            
            <h2>Usage Example:</h2>
            <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto;">
# Get all todos
curl http://localhost:5000/api/todos

# Create a new todo
curl -X POST http://localhost:5000/api/todos \\
     -H "Content-Type: application/json" \\
     -d '{"text": "Learn Python Flask"}'

# Get weather for London
curl http://localhost:5000/api/weather/london
            </pre>
        </div>
    </body>
    </html>
    """

# Todo API endpoints
@app.route('/api/todos', methods=['GET'])
def get_todos():
    """Get all todos, sorted by creation date (newest first)"""
    sorted_todos = sorted(todos, key=lambda x: x['created_at'], reverse=True)
    return jsonify(sorted_todos)

@app.route('/api/todos', methods=['POST'])
def create_todo():
    """Create a new todo item"""
    global next_todo_id
    data = request.get_json()
    
    if not data or 'text' not in data:
        return jsonify({'error': 'Missing required field: text'}), 400
    
    new_todo = {
        'id': next_todo_id,
        'text': data['text'],
        'completed': data.get('completed', False),
        'created_at': datetime.now().isoformat() + 'Z'
    }
    
    todos.append(new_todo)
    next_todo_id += 1
    
    return jsonify(new_todo), 201

@app.route('/api/todos/<int:todo_id>', methods=['PATCH'])
def update_todo(todo_id):
    """Update a todo's completion status"""
    data = request.get_json()
    
    if not data or 'completed' not in data:
        return jsonify({'error': 'Missing required field: completed'}), 400
    
    todo = next((t for t in todos if t['id'] == todo_id), None)
    if not todo:
        return jsonify({'error': 'Todo not found'}), 404
    
    todo['completed'] = data['completed']
    return jsonify(todo)

@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    """Delete a todo item"""
    global todos
    todo = next((t for t in todos if t['id'] == todo_id), None)
    
    if not todo:
        return jsonify({'error': 'Todo not found'}), 404
    
    todos = [t for t in todos if t['id'] != todo_id]
    return '', 204

# Blog API endpoints
@app.route('/api/blog-posts', methods=['GET'])
def get_blog_posts():
    """Get all blog posts, sorted by creation date (newest first)"""
    sorted_posts = sorted(blog_posts, key=lambda x: x['created_at'], reverse=True)
    return jsonify(sorted_posts)

@app.route('/api/blog-posts/<int:post_id>', methods=['GET'])
def get_blog_post(post_id):
    """Get a specific blog post by ID"""
    post = next((p for p in blog_posts if p['id'] == post_id), None)
    
    if not post:
        return jsonify({'error': 'Blog post not found'}), 404
    
    return jsonify(post)

@app.route('/api/blog-posts', methods=['POST'])
def create_blog_post():
    """Create a new blog post"""
    global next_blog_post_id
    data = request.get_json()
    
    required_fields = ['title', 'content', 'excerpt', 'category']
    for field in required_fields:
        if not data or field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    new_post = {
        'id': next_blog_post_id,
        'title': data['title'],
        'content': data['content'],
        'excerpt': data['excerpt'],
        'category': data['category'],
        'created_at': datetime.now().isoformat() + 'Z'
    }
    
    blog_posts.append(new_post)
    next_blog_post_id += 1
    
    return jsonify(new_post), 201

# Weather API endpoint
@app.route('/api/weather/<string:city>', methods=['GET'])
def get_weather(city):
    """Get weather data for a specific city"""
    city_lower = city.lower()
    
    if city_lower not in weather_data:
        return jsonify({'error': 'City not found'}), 404
    
    data = weather_data[city_lower].copy()
    data['city'] = city.title()
    
    return jsonify(data)

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({'error': 'Method not allowed'}), 405

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("🚀 Jordi Kongolo Portfolio API Server")
    print("📍 Server running on: http://localhost:5000")
    print("📋 API Documentation available at: http://localhost:5000")
    print("🔧 Available endpoints:")
    print("   • GET    /api/todos")
    print("   • POST   /api/todos")
    print("   • PATCH  /api/todos/<id>")
    print("   • DELETE /api/todos/<id>")
    print("   • GET    /api/blog-posts")
    print("   • GET    /api/blog-posts/<id>")
    print("   • POST   /api/blog-posts")
    print("   • GET    /api/weather/<city>")
    print("\n💡 To test the API:")
    print("   pip install flask flask-cors")
    print("   python backend-python-flask.py")
    print("\n🌐 For production, consider using:")
    print("   • Database (PostgreSQL, SQLite)")
    print("   • Authentication (JWT, sessions)")
    print("   • Input validation (Marshmallow)")
    print("   • Production server (Gunicorn, uWSGI)")
    
    app.run(debug=True, host='0.0.0.0', port=5000)