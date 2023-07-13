<!DOCTYPE html>
<html>
<head>
    <title>Project Management System</title>
    {{-- <link href="{{ asset('css/styles.css') }}" rel="stylesheet"> --}}
    <style>
        /* custom.css */

/* Styles for the header */
header {
    background-color: #333;
    color: #fff;
    padding: 20px;
    text-align: center;
}

/* Styles for the navigation menu */
nav ul {
    list-style: none;
    background-color: #f4f4f4;
    padding: 10px;
    margin: 0;
}

nav ul li {
    display: inline-block;
    margin-right: 10px;
}

nav ul li a {
    text-decoration: none;
    color: #333;
}

/* Styles for the hero section */
.hero {
    background-image: url('../images/download.jpg');
    background-size: cover;
    background-position: center;
    padding: 100px;
    text-align: center;
}

.hero h2 {
    color: #fff;
    font-size: 32px;
    margin-bottom: 20px;
}

.hero p {
    color: #fff;
    font-size: 18px;
    margin-bottom: 40px;
}

.hero .btn {
    background-color: #333;
    color: #fff;
    padding: 10px 20px;
    text-decoration: none;
}

/* Styles for the features section */
.features {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 50px;
}

.feature {
    text-align: center;
    flex-basis: 30%;
    max-width: 30%;
}

.feature img {
    width: 100%;
    max-width: 200px;
    height: auto;
    margin-bottom: 20px;
}

.feature h3 {
    font-size: 24px;
    margin-bottom: 10px;
}

.feature p {
    font-size: 16px;
    color: #666;
}

/* Styles for the footer */
footer {
    background-color: #333;
    color: #fff;
    padding: 20px;
    text-align: center;
}

footer p {
    margin: 0;
}

/* Responsive Styles */
@media screen and (max-width: 768px) {
    .features {
        flex-wrap: wrap;
    }
    
    .feature {
        flex-basis: 100%;
        max-width: 100%;
        margin-bottom: 30px;
    }
}

    </style>
</head>
<body>
    <header>
        <h1>Project Management System</h1>
    </header>

    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="http://localhost:4200/projects">Projects</a></li>
            <li><a href="http://localhost:4200/tasks">Tasks</a></li>
            <li><a href="http://localhost:4200/users">Team</a></li>
        </ul>
    </nav>

    <section class="hero">
        <div class="hero-content">
            <h2 style="color:red">Manage Your Projects with Ease</h2>
            <p style="color:red">Efficiently plan, track, and collaborate on your projects.</p>
            <a href="http://localhost:4200/register" class="btn btn-primary">Get Started</a>
        </div>
    </section>

    <section class="features">
        <div class="feature">
            <img src="{{ asset('images/download.jpeg') }}" alt="Feature 1">
            <h3>Project Management</h3>
            <p>Organize your projects, assign tasks, and set deadlines.</p>
        </div>
        <div class="feature">
            <img src="{{ asset('images/download.png') }}" alt="Feature 2">
            <h3>Task Tracking</h3>
            <p>Keep track of task progress, updates, and completion status.</p>
        </div>
        <div class="feature">
            <img src="{{ asset('images/downloade.jpeg') }}" alt="Feature 3">
            <h3>Team Collaboration</h3>
            <p>Effortlessly collaborate with your team members in real-time.</p>
        </div>
    </section>

    <footer>
        <p>&copy; 2023 Project Management System. All rights reserved.</p>
    </footer>

    {{-- <script src="{{ asset('js/script.js') }}"></script> --}}
</body>
</html>