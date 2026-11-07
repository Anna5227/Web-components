//доступ
const template = document.getElementById('contact-card');
const container = document.getElementById('contacts-container');

// создаём шаблон карточки
function createContactCard(contact) {
  const clone = template.content.cloneNode(true);

  const avatar = clone.querySelector('.contact-avatar');
  const name   = clone.querySelector('.contact-name');
  const email  = clone.querySelector('.contact-email');
  const phone  = clone.querySelector('.contact-phone');

  avatar.src = contact.avatar;
  avatar.alt = `Фото ${contact.name}`;

  name.textContent = contact.name;

  email.textContent = contact.email;
  email.href = `mailto:${contact.email}`;

  phone.textContent = contact.phone;
  phone.href = `tel:${contact.phone.replace(/\s+/g, '')}`;

  return clone;
}

// данные контактов
const contacts = [
  {
    name: 'Дмитрий Куплинов',
    email: 'dima.kuplinov@mail.ru',
    phone: '+7 900 123-45-67',
    avatar: '/avatars/dimka.jfif'
  },
  {
    name: 'Максим Тарасенко',
    email: 'max.tarasenko@gmail.com',
    phone: '+7 901 987-65-43',
    avatar: '/avatars/max.jfif'
  },
  {
    name: 'Вероника Чирцова',
    email: 'animekawai@mail.ru',
    phone: '+7 924 123-38-68',
    avatar: '/avatars/nika.jfif'
  },
  {
    name: 'София Киреева',
    email: 'bessorodnoe.nechto@mail.ru',
    phone: '+7 984 157-74-23',
    avatar: '/avatars/sonya.jfif'
  }
];

// Рендерим
contacts.forEach((contact) => {
  const card = createContactCard(contact);
  container.appendChild(card);
});