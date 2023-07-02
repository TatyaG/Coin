import { el, setChildren } from 'redom';
import { getCurrency, getCurrencyFeed, getAllCurrencies, currencyBuy } from './api.js';
import JustValidate from 'just-validate';

const token = localStorage.getItem('token');
const allCurrencies = await getAllCurrencies(token)

export function createCurrencySection() {
    const section = el('section.currency-section');
    const top = el('div.main__top');
    const h2 = el('h2.title', 'Валютный обмен');
    const mainBlock = el('div.main__block');

    const currency = createCurrency();
    const exchange = createExchange();
    const currencyFeed = createCurrencyFeed();

    setChildren(top, h2);
    setChildren(mainBlock, [currency.currencyBlock, currencyFeed, exchange]);
    setChildren(section, [top, mainBlock]);


    return section;
}

async function renderCurrency() {
    const currencies = await getCurrency(token);
    const values = Object.values(currencies.payload);

    for (let value of values) {
        document.querySelector('.currency__list').append(createCurrencyItem(value.code, value.amount));
    }
}

function pairs(a) {
    return a.flatMap((x) => {
        return a.flatMap((y) => {
            return (x != y) ? [[x, y]] : []
        });
    });
}


async function renderCurrencyFeed() {
    const socket = await getCurrencyFeed();
    const data = allCurrencies.payload;
    const allPairs = pairs(data)

    for (let i = 0; i < allPairs.length; i++) {
        const li = el('li.change__item');
        const code = el('span.change__text.code');
        const amount = el('span.change__text.amount');
        code.textContent = allPairs[i][0] + '/' + allPairs[i][1];
        setChildren(li, [code, amount]);
        document.querySelector('.change__list').append(li);
    }

    socket.addEventListener('message', function (event) {
        const res = JSON.parse(event.data);
        const codes = document.querySelectorAll('.change__text.code');
        const amounts = document.querySelectorAll('.change__text.amount');
        for (let i = 0; i < codes.length; i++) {
            if (codes[i].textContent === `${res.from}/${res.to}`) {
                amounts[i].textContent = res.rate;
                if (res.change === 1) {
                    amounts[i].classList.add('up');
                    amounts[i].parentNode.style.borderColor = '#76CA66';
                }

                else if (res.change === -1) {
                    amounts[i].classList.add('down');
                    amounts[i].parentNode.style.borderColor = '#FD4E5D';

                }
            }
        }
    });
}


function createCurrencyItem(code, amount) {
    const li = el('li.currency__item');
    const codeText = el('span.currency__text.code', code);
    const amountText = el('span.currency__text.amount', amount);

    if (amount == 0) return
    else {
        setChildren(li, [codeText, amountText]);
    }
    return li;
}

function createCurrency() {
    const currencyBlock = el('div.currency');
    const subtitle = el('h3.subtitle', 'Ваши валюты');
    const currencyList = el('ul.currency__list');

    setChildren(currencyBlock, [subtitle, currencyList]);

    renderCurrency()

    return {
        currencyBlock,
        currencyList
    }
}

let keys = [];

function createExchange() {
    const exchangeBlock = el('div.exchange');
    const subtitle = el('h3.subtitle', 'Объем валюты');
    const form = el('form.exchange__form');
    const top = el('div.exchange__top');
    const left = el('div.exchange__left');
    const fromText = el('span.exchange__from', 'Из');
    const dropdownFrom = el('div.dropdown.currency-from');
    const dropdownBtnFrom = el('button.dropdown__btn.btn-reset', 'Валюта');
    const dropdownMenuFrom = el('ul.dropdown__menu');

    const inText = el('span.exchange__in', 'в');
    const dropdownTo = el('div.dropdown.currency-to');
    const dropdownBtnTo = el('button.dropdown__btn.btn-reset', 'Валюта');
    const dropdownMenuTo = el('ul.dropdown__menu');

    const label = el('label.exchange__label');
    const labelText = el('span.exchange__text', 'Сумма');
    const input = el('input.exchange__input');

    const btn = el('button.exchange__btn.btn-reset', 'Обменять');

    dropdownBtnTo.addEventListener('click', (e) => {
        e.preventDefault();
        dropdownMenuTo.classList.toggle('dropdown__menu--open');
        dropdownBtnTo.classList.toggle('dropdown__btn--open');
    })

    dropdownBtnFrom.addEventListener('click', (e) => {
        e.preventDefault();
        dropdownMenuFrom.classList.toggle('dropdown__menu--open');
        dropdownBtnFrom.classList.toggle('dropdown__btn--open');
    })



    createDropdownItems(dropdownMenuFrom);
    createDropdownItems(dropdownMenuTo);

    setChildren(top, [fromText, dropdownFrom, inText, dropdownTo]);
    setChildren(dropdownFrom, [dropdownBtnFrom, dropdownMenuFrom]);
    setChildren(dropdownTo, [dropdownBtnTo, dropdownMenuTo]);
    setChildren(exchangeBlock, [subtitle, form]);
    setChildren(form, [left, btn]);
    setChildren(left, [top, label]);
    setChildren(label, [labelText, input]);


    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (document.querySelector('.error-currency')) document.querySelector('.error-currency').remove();


        const obj = {
            from: dropdownBtnFrom.textContent,
            to: dropdownBtnTo.textContent,
            amount: input.value
        }
      const data = await currencyBuy(obj, token);
        console.log(data)
       if (data.error === '' && input.value) {

        const result = Object.keys(data.payload).map(key => {
          keys.push(data.payload[key]);
        })
       
       const codes = document.querySelectorAll('.currency__text.code');
       const amounts = document.querySelectorAll('.currency__text.amount');

       for (let i = 0; i < codes.length; i++) {
        if (codes[i].textContent == dropdownBtnFrom.textContent) {
            amounts[i].textContent = keys[i].amount;

        }
        if (codes[i].textContent == dropdownBtnTo.textContent) {
            amounts[i].textContent = keys[i].amount;
        }
       }

       document.querySelectorAll('.dropdown__item--active').forEach(el => el.classList.remove('dropdown__item--active'));

       input.value = '';
       dropdownBtnFrom.textContent = 'Валюта';
       dropdownBtnTo.textContent = 'Валюта';
       keys = [];
    }
    else if (data.error === 'Unknown currency code') {
        createErrorMessage('Передан неверный валютный код!', form)
    }
    else if (data.error === 'Invalid amount') {
        createErrorMessage('Введите положительную сумму!', form)
    }
    else if (data.error === 'Overdraft prevented') {
        createErrorMessage('Недостаточно средств!', form)
    }
    else if (input.value === '') {
        createErrorMessage('Введите сумму перевода!', form)
    }
    
    
  
    })
    

    return exchangeBlock;
}

function createErrorMessage(message, body) {
    const error = el('span.error-currency', message);
    body.append(error);
}

async function createDropdownItems(body) {
    for (let currency of allCurrencies.payload) {
        let dropdownItem = el('li.dropdown__item', currency);
        body.append(dropdownItem);
    }
}

function createCurrencyFeed() {
    const changeBlock = el('div.change');
    const subtitle = el('h3.subtitle', 'Изменение курсов в реальном времени');
    const ul = el('ul.change__list');

    setChildren(changeBlock, [subtitle, ul]);
    renderCurrencyFeed();
    return changeBlock;
}