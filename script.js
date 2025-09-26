// Seleção de elementos
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filters button');

// Recupera tarefas do localStorage ou cria array vazio
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Salva tarefas no localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Cria elemento da tarefa
function createTaskElement(task) {
  const li = document.createElement('li');

  // Container de emoji + texto
  const taskContent = document.createElement('div');
  taskContent.classList.add('task-content');

  // Emoji ✅ se concluída
  const emojiSpan = document.createElement('span');
  emojiSpan.classList.add('task-emoji');
  emojiSpan.textContent = task.completed ? "✅" : "";

  // Texto da tarefa
  const textSpan = document.createElement('span');
  textSpan.classList.add('task-text');
  textSpan.textContent = task.text;
  if (task.completed) textSpan.classList.add('completed');

  taskContent.appendChild(emojiSpan);
  taskContent.appendChild(textSpan);

  // Botão de remover
  const removeBtn = document.createElement('button');
  removeBtn.textContent = '✖';
  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // evita alternar concluída ao clicar no botão
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();
    renderTasks(currentFilter);
  });

  // Alterna conclusão ao clicar na tarefa
  li.addEventListener('click', () => {
    task.completed = !task.completed;
    saveTasks();
    renderTasks(currentFilter);
  });

  li.appendChild(taskContent);
  li.appendChild(removeBtn);
  return li;
}

// Renderiza tarefas com filtro
function renderTasks(filter = 'all') {
  currentFilter = filter;
  taskList.innerHTML = '';
  let filteredTasks = tasks;

  if (filter === 'pending') filteredTasks = tasks.filter(t => !t.completed);
  if (filter === 'completed') filteredTasks = tasks.filter(t => t.completed);

  filteredTasks.forEach(task => {
    taskList.appendChild(createTaskElement(task));
  });

  // Atualiza botão ativo
  filterButtons.forEach(btn => btn.classList.remove('active'));
  document.getElementById(filter).classList.add('active');
}

// Evento para adicionar tarefa
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const newTask = {
    id: Date.now(),
    text: taskInput.value.trim(),
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks(currentFilter);
  taskInput.value = '';
});

// Eventos de filtro
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => renderTasks(btn.id));
});

// Renderiza tarefas iniciais
renderTasks();