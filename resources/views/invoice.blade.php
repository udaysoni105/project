<!DOCTYPE html>
<html>
<head>
    <title>Task Name</title>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }
        th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
    </style>
</head>
<body>
    <h1>Task Name</h1>
    <p>Dear User,</p>
    <p>The following tasks list:</p>
    <table border="1">
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Project ID</th>
        </tr>
        <tr>
            <td>{{ $task->name }}</td>
            <td>{{ $task->description }}</td>
            <td>{{ $task->start_date }}</td>
            <td>{{ $task->end_date }}</td>
            <td>{{ $task->status }}</td>
            <td>
                {{ App\Models\Project::where('id', $task->project_id)->value('name') }}
            </td>
        </tr>
    </table>
    <p>Please ensure that these tasks are addressed promptly.</p>
    <p>Thank you!</p>
</body>
</html>
