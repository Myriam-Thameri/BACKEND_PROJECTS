const fs = require('fs');
const path = require('path');
const TASKS_FILE = path.join(__dirname, 'tasks.json');

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

function getnextId(tasks){
    const ids = tasks.map(t => t.id);
    ids.sort((a,b) => a - b);
    let nextId = 1;
    for (const id of ids){
        if (id !== nextId){
            break;
        }
        nextId+=1;
    }
    return nextId;
}

function readTasks(){
    if(fs.existsSync(TASKS_FILE)){
        const data = fs.readFileSync(TASKS_FILE);
        return JSON.parse(data);
    }else{
        return [];
    }
}

function writeTasks(tasks){
    fs.writeFileSync(TASKS_FILE,JSON.stringify(tasks,null,2),"utf-8");
}

function ListTasks(status){
    const tasks = readTasks();
    let filteredTasks = tasks;
    if (status){
        if(status.toLowerCase() === "done"){
            filteredTasks = tasks.filter( (task) => task.status === "done");
        }else if (status.toLowerCase() === "todo"){
            filteredTasks = tasks.filter((task) => task.status === "todo");
        }else if(status.toLowerCase() === "in-progress"){
            filteredTasks = tasks.filter((task) => task.status === "in-progress");
        }else{
            console.log(`${colors.red}Invalid status filter. Use "done", "todo", or "in-progress".${colors.reset}`);
            return;
        }
    }

    if (filteredTasks.length === 0){
        console.log(`${colors.yellow} No tasks was found. ${colors.reset}`);
        return;
    }else{
        filteredTasks.forEach((task) =>{
            console.log(`${task.id}. ${task.description} [${task.status === "done" ? colors.green + "Done" + colors.reset : task.status === "in-progress" ? colors.yellow + "In-progress" + colors.reset : colors.red + "To-Do"}${colors.reset}]`);
        });
    }
}

function AddTask(description){
    const tasks = readTasks();
    const newTask = {
        id: getnextId(tasks),
        description: description,
        status: "todo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    writeTasks(tasks);
    console.log(`${colors.green}Task added successfully.${colors.reset}`);
}

function UpdateTask(id,newDescription){
    const tasks = readTasks();
    const task = tasks.find((task) => task.id === parseInt(id));
    if(task){
        task.description = newDescription;
        task.updatedAt = new Date().toISOString();
        writeTasks(tasks);
        console.log(`${colors.green}Task updated successfully.${colors.reset}`);
    }else{
        console.log(`${colors.red}Task with ID ${id} not found.${colors.reset}`);
    }
}

function DeleteTask(id){
    const tasks = readTasks();
    const newTasks = tasks.filter((task) => task.id !== parseInt(id));
    if(newTasks.length < tasks.length){
        writeTasks(newTasks);
        console.log(`${colors.green}Task deleted successfully.${colors.reset}`);
    }else{
        console.log(`${colors.red} Task with ID ${id} not found.${colors.reset}`);
    }
}


function MarkTaskAsCompleted(id){
    const tasks = readTasks();
    const task = tasks.find((task) => task.id === parseInt(id));
    if(task){
        task.status = "done";
        writeTasks(tasks);
        console.log(`${colors.green}Task marked as completed.${colors.reset}`); 
    }else{
        console.log(`${colors.red}Task with ID ${id} not found.${colors.reset}`);
    }
}

function MarkAsInProgress(id){
    const tasks = readTasks();
    const task = tasks.find((task) => task.id === parseInt(id));
    if(task){
        task.status = "in-progress";
        writeTasks(tasks);
        console.log(`${colors.green} Task marked as in progress.${colors.reset}`);
    }else{
        console.log(`${colors.red} Task with ID ${id} not found.${colors.reset}`);
    }
}


const args = process.argv.slice(2);
if (args[0] === "add"){
    const TaskDescription = args.slice(1).join(" ");
    if(!TaskDescription){
        console.log(`${colors.red}Please provide a task description.${colors.reset}`);
    }else{
        AddTask(TaskDescription);
    }
}else if(args[0] == "list"){
    const statusFilter = args[1];
    ListTasks(statusFilter);
}else if(args[0] === "update"){
    const taskId = args[1];
    const newDescription = args.slice(2).join(" ");
    if(!taskId || !newDescription){
        console.log(`${colors.red}Please provide task ID and new description.${colors.reset}`);
    }else{
        UpdateTask(taskId,newDescription);
    }
}else if(args[0] === "delete"){
    const taskId = args[1];
    if(!taskId){
        console.log(`${colors.red}Please provide task ID to delete.${colors.reset}`);
    }else{
        DeleteTask(taskId);
    }
}else if (args[0] === "mark-in-progress"){
    const taskId = args[1];
    if(!taskId){
        console.log(`${colors.red} Please provide the task ID to mark as in progreess.${colors.reset}`);
    }else{
        MarkAsInProgress(taskId);
    }
}else if(args[0] === "mark-done"){
    const taskId = args[1];
    if(!taskId){
        console.log(`${colors.red} Please provide the task ID to mark as completed.${colors.reset}`);
    }else{
        MarkTaskAsCompleted(taskId);
    }
}else {
  console.log(
    `${colors.cyan}Usage: node index.js <command> [arguments]${colors.reset}`
  );
  console.log(`${colors.cyan}Commands:${colors.reset}`);
  console.log(
    `${colors.yellow}  add <task description>            - Add a new task${colors.reset}`
  );
  console.log(
    `${colors.yellow}  list [status]                     - List tasks (status: done, to-do, in-progress)${colors.reset}`
  );
  console.log(
    `${colors.yellow}  update <id> <new description>     - Update a task by ID${colors.reset}`
  );
  console.log(
    `${colors.yellow}  delete <id>                       - Delete a task by ID${colors.reset}`
  );
  console.log(
    `${colors.yellow}  mark-in-progress <id>             - Mark a task as in-progress by ID${colors.reset}`
  );
  console.log(
    `${colors.yellow}  mark-done <id>                    - Mark a task as done by ID${colors.reset}`
  );
}