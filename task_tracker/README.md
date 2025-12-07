1/Task Tracker

2/To clone the project type: 
gh repo clone Myriam-Thameri/BACKEND_PROJECTS
cd BACKEND_PROJECTS/task_tracker

2/Features: 
*Add, Update, and Delete tasks.
*Mark a task as in progress or done.
*List all tasks.
*List all tasks that are done.
*List all tasks that are not done.
*List all tasks that are in progress.

2/EXAMPLE OF HOW TO USE

# Adding a new task
task-cli add "Buy groceries"
# Output: Task added successfully (ID: 1)

# Updating and deleting tasks
task-cli update 1 "Buy groceries and cook dinner"
task-cli delete 1

# Marking a task as in progress or done
task-cli mark-in-progress 1
task-cli mark-done 1

# Listing all tasks
task-cli list

# Listing tasks by status
task-cli list done
task-cli list todo
task-cli list in-progress
