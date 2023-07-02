import { el, setChildren} from 'redom';
import {router} from './index.js';
import {newCard} from './api.js';

const token = localStorage.getItem('token');

console.log(router)

const monthArray = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
]

export function createCard(id, balance, date) {
    const card = el('li.card');
    const cardId = el('p.card__id', id);
    const cardBalance = el('p.card__balance', `${balance} ₽`);
    const cardInfo = el('div.card__info');
    const transaction = el('p.card__transaction', 'Последняя транзакция:');
    const transactionDate = el('p.card__date');
    const openBtn = el('a.card__btn.btn-reset', 'Открыть', {href: `/accounts/${id}`});


    if (!date) {
      transactionDate.textContent = ''
   } else {
      const dateNow = new Date(date.date); 
      transactionDate.textContent = `${dateNow.getDate()} ${monthArray[dateNow.getMonth()]} ${dateNow.getFullYear()}`;  
    } 
    

    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
       router.navigate(e.target.getAttribute('href'));   
       console.log(id)
       document.querySelector('.loader').style.display = 'block';
    })


    setChildren(card, [cardInfo, openBtn]);
    setChildren(cardInfo, [cardId, cardBalance, transaction, transactionDate]);

    return {
        card,
        openBtn
    }
}





export function createAccountsSection() {
  const section = el('section.accounts');
  const cardsList = el('ul.cards-list');

    const top = el('div.main__top');
    const btnNew = el('button.btn-reset.main__btn.new', 'Создать новый счёт');
    const mainLeft = el('div.main__left');
    const h2 = el('h2.title', 'Ваши счета');
    const dropdown = el('div.dropdown.sort');
    const dropdownBtn = el('button.dropdown__btn.btn-reset', 'Сортировка');
    const dropdownMenu = el('ul.dropdown__menu');
    const dropdowmNumberItem = el('li.dropdown__item.number-item', 'По номеру');
    const dropdowmBalanceItem = el('li.dropdown__item.balance-item', 'По балансу');
    const dropdowmDateItem = el('li.dropdown__item.date-item', 'По последней транзакции');

    setChildren(dropdownMenu, [dropdowmNumberItem, dropdowmBalanceItem, dropdowmDateItem]);
    setChildren(dropdown, [dropdownBtn, dropdownMenu]);
    setChildren(top, [mainLeft, btnNew]);
    setChildren(mainLeft, [h2, dropdown]);
    setChildren(section, [top, cardsList]);

    dropdownBtn.addEventListener('click', (e) => {
      e.preventDefault();
        dropdownMenu.classList.toggle('dropdown__menu--open');
        dropdownBtn.classList.toggle('dropdown__btn--open');
    })

    // Создание нового счета

    btnNew.addEventListener('click', async () => {
      const createNewCard = await newCard(token);
      const card = createCard(createNewCard.payload.account, createNewCard.payload.balance, createNewCard.payload.transactions.date);
      document.querySelector('.cards-list').append(card.card);
  })

  return {
    section,
    cardsList,
    top,
  }
}
