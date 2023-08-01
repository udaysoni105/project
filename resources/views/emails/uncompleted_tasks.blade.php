<!DOCTYPE html>
<html>
<head>
    <title>Uncompleted Task Reminder</title>
</head>
<body>
    <h1>Uncompleted Task Reminder</h1>
    <p>Dear Project Manager,</p>
    <p>The following tasks are still uncompleted:</p>
    <ul>
        @foreach ($uncompletedTasks as $task)
            <li>{{ $task->name }}</li>
        @endforeach
    </ul>
    <p>Please ensure that these tasks are addressed promptly.</p>
    <p>Thank you!</p>
</body>
</html>
