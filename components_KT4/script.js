const state = new Proxy(
  {
    expenses: [],
  },
  {
    set(target, property, value) {
      target[property] = value;
      render(); 
      return true;
    },
  }
);

const formatMoney = (value) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2,
  }).format(value);

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const form = document.getElementById("expense-form");
const nameInput = document.getElementById("expense-name");
const amountInput = document.getElementById("expense-amount");
const listEl = document.getElementById("expense-list");
const totalEl = document.getElementById("total-amount");
const emptyEl = document.getElementById("expense-empty");

function addExpense(name, amount) {
  state.expenses = [
    ...state.expenses,
    { id: generateId(), name: name.trim(), amount: Number(amount) },
  ];
}

function removeExpense(id) {
  state.expenses = state.expenses.filter((item) => item.id !== id);
}

function render() {
  const { expenses } = state;

  // Общая сумма
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  totalEl.textContent = formatMoney(total);

  emptyEl.hidden = expenses.length > 0;

  // Список расходов
  listEl.innerHTML = "";

  expenses.forEach(({ id, name, amount }) => {
    const li = document.createElement("li");
    li.className = "expense-item";
    li.dataset.id = id;

    const info = document.createElement("div");
    info.className = "expense-item__info";

    const nameEl = document.createElement("span");
    nameEl.className = "expense-item__name";
    nameEl.textContent = name;

    const amountEl = document.createElement("span");
    amountEl.className = "expense-item__amount";
    amountEl.textContent = formatMoney(amount);

    info.append(nameEl, amountEl);

    const delBtn = document.createElement("button");
    delBtn.className = "expense-item__delete";
    delBtn.type = "button";
    delBtn.title = "Удалить расход";
    delBtn.textContent = "✕";
    delBtn.dataset.action = "delete";
    delBtn.dataset.id = id;

    li.append(info, delBtn);
    listEl.append(li);
  });
}

// Добавление расхода через форму
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (!name || !Number.isFinite(amount) || amount <= 0) {
    return;
  }

  addExpense(name, amount);

  form.reset();
  nameInput.focus();
});

// удаление расхода по клику
listEl.addEventListener("click", (event) => {
  const btn = event.target.closest('[data-action="delete"]');
  if (!btn) return;

  removeExpense(btn.dataset.id);
});

render();