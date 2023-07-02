import { el, setChildren } from 'redom';
import moment from 'moment';
import { paginator } from './paginator.js';
import JustValidate from 'just-validate';
import { router } from './index.js';
import { makeTransfer, getCard } from './api.js';


// const router = new Navigo('/');
const accountsArray = [];
const token = localStorage.getItem('token');

const monthArray = [
    'январь',
    'февраль',
    'март',
    'апрель',
    'май',
    'июнь',
    'июль',
    'август',
    'сентябрь',
    'октябрь',
    'ноябрь',
    'декабрь',
]



export function createNewTransfer(id) {
    const transferBlock = el('div.transfer');
    const subtitle = el('h3.subtitle', 'Новый перевод');
    const form = el('form.transfer__form');
    const numberLabel = el('label.transfer__label');
    const numberText = el('span.transfer__text', 'Номер счёта получателя');
    const numberInput = el('input.transfer__input.transfer__number', { list: 'numbers' });
    const datalist = el('datalist', { id: 'numbers' })
    const amountLabel = el('label.transfer__label');
    const amountText = el('span.transfer__text', 'Сумма перевода');
    const amountInput = el('input.transfer__input.transfer__amount');

    const sendBtn = el('button.btn-reset.transfer__btn', 'Отправить', { type: 'submit' });

    const validate = new JustValidate(form);

    const letters = /[0-9]/;

    numberInput.addEventListener('keypress', (e) => {
        if (!letters.test(e.key)) {
            e.preventDefault();
        }
    })

    amountInput.addEventListener('keypress', (e) => {
        if (!letters.test(e.key)) {
            e.preventDefault();
        }
    })

    numberInput.addEventListener('input', () => {
        if (amountInput.parentNode.contains(document.querySelector('.error-message'))) document.querySelector('.error-message').remove();
    })

    amountInput.addEventListener('input', () => {
        if (amountInput.parentNode.contains(document.querySelector('.error-message'))) document.querySelector('.error-message').remove();
    })

    validate
        .addField(numberInput, [
            {
                rule: 'required',
                errorMessage: 'Введите номер счёта получателя',
            },

        ])
        .addField(amountInput, [
            {
                rule: 'required',
                errorMessage: 'Введите сумму перевода',
            },
            {
                rule: 'minNumber',
                value: 0,
                errorMessage: 'Сумма перевода должна быть положительной!',
            },

        ])

    setChildren(transferBlock, [subtitle, form]);
    setChildren(form, [numberLabel, amountLabel, sendBtn]);
    setChildren(numberLabel, [numberText, numberInput, datalist]);
    setChildren(amountLabel, [amountText, amountInput]);



    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const result = await validate.revalidate();
        if (result === true) {
            if (document.querySelector('.error-message')) document.querySelector('.error-message').remove();

            const obj = {
                from: id,
                to: numberInput.value,
                amount: amountInput.value
            }
            makeTransfer(obj, token).then(transfer => {
                switch (transfer.error) {
                    case '': {
                        if (!accountsArray.includes(obj.to)) {
                            accountsArray.push(obj.to);
                            const option = el('option', obj.to);
                            datalist.append(option);
                            localStorage.setItem('accountsArray', accountsArray);
                        }

                        const accounts = localStorage.getItem('accountsArray');
                        console.log(accounts)
                        document.querySelector('.history__tbody').append(createTransfer(id, obj.from, obj.to, obj.amount, Date.now()));

                        numberInput.value = '';
                        amountInput.value = '';

                        break;
                    }
                    case 'Invalid account to': {
                        const error = el('span.error-message', 'Данный счет не принадлежит нам!');
                        numberLabel.append(error);

                        break;
                    }
                    case 'Overdraft prevented': {
                        const error = el('span.error-message', 'Недостаточно средств!');
                        amountLabel.append(error);

                        break;
                    }
                }
            });
        }
    })

    return {
        transferBlock,
        numberInput,
        amountInput
    }

}

function createTransfer(id, from, to, amount, date) {
    const row = el('tr');
    const sendAccountTd = el('td', from);
    const benAccountTd = el('td', to);
    const amountTd = el('td', amount);
    const dateTd = el('td');

    const dd = new Date(date);
    let day = dd.getDate();
    let month = dd.getMonth() + 1;
    const year = dd.getFullYear();

    if (day.toString().length == 1) day = `0${day}`;
    if (month.toString().length == 1) month = `0${month}`;

    dateTd.textContent = `${day}.${month}.${year}`;

    setChildren(row, [sendAccountTd, benAccountTd, amountTd, dateTd]);

    if (id == to) {
        amountTd.classList.add('account-to');
        amountTd.textContent = `+${amount} ₽`;
    } else {
        amountTd.classList.add('account-from');
        amountTd.textContent = `-${amount} ₽`;
    }

    return row;
}


let transactionsArray = [];
let transactionsMonthBalance = [];
let obj = {};
let mmArray = [];
export let result = [];
export let incomeArr = [];
export let expensesArr = [];
let income = {};
let expenses = {};




function getMonth(count) {
    let array = []
    moment.updateLocale('ru', {
        monthsShort: []
    });
    moment().locale('ru');
    for (let i = count - 1; i >= 0; i--) {
        array.push(moment().subtract(i, 'months').format('MMMM'));
    }

    return array;
}


export async function createChart(id, chartId, count, width, title) {
    const chartBlock = el('div.chart');
    const subtitle = el('h3.subtitle', title);
    const chart = el('div', { style: `width: ${width}px;` });
    const canvas = el('canvas', { id: chartId, style: `width: ${width}px; height: 250px` });

    setChildren(chart, canvas);
    setChildren(chartBlock, [subtitle, chart]);

    chartBlock.addEventListener('click', () => {
        router.navigate(`/accounts/${id}/more`);
        document.querySelector('.loader').style.display = 'block';
    })

    const data = await getCard(token, id);

    transactionsArray = []
    const transactions = data.payload.transactions;
    for (let i = 0; i <= transactions.length - 1; i++) {
        if ((Date.now() - Date.parse(transactions[i].date)) / (1000 * 3600 * 24) <= 181) {
            transactionsArray.push(transactions[i]);
        }
    }

    let mmArray = getMonth(count);

    transactionsMonthBalance = []
    for (let i = 0; i < transactionsArray.length; i++) {

        const dd = new Date(transactionsArray[i].date);

        obj = {
            month: monthArray[dd.getMonth(transactionsArray[i].date)],
            from: transactionsArray[i].from,
            to: transactionsArray[i].to,
            amount: transactionsArray[i].amount
        }

        transactionsMonthBalance.push(obj);
    }

    let balance = 0;
    let balanceIncome = 0;
    let balanceExpenses = 0;
    result = [];
    incomeArr = [];
    expensesArr = [];

    for (let i = 0; i < mmArray.length; i++) {
        balance = 0;
        balanceIncome = 0;
        balanceExpenses = 0;
        for (let j = 0; j < transactionsMonthBalance.length; j++) {
            if (mmArray[i] == transactionsMonthBalance[j].month) {
                if (transactionsMonthBalance[j].to == id) {
                    balance = balance + transactionsMonthBalance[j].amount;
                    balanceIncome = balance;
                }
                else {
                    balance = balance - transactionsMonthBalance[j].amount;
                    balanceExpenses = balance;
                }
            }
            else {
                balance = 0;
                balanceIncome = balance;
                balanceExpenses = balance;
            }
        }

        obj = {
            month: mmArray[i],
            balance: balance
        }

        income = {
            month: mmArray[i],
            balance: balanceIncome
        }

        expenses = {
            month: mmArray[i],
            balance: balanceExpenses
        }

        incomeArr.push(income);
        expensesArr.push(expenses);

        result.push(obj)
    }

    return chartBlock;
}



export function createHistory(id, count) {
    const historyBlock = el('div.history');
    const subtitle = el('h3.subtitle', 'История переводов');
    const table = el('table.history__table', { cellspacing: '0', cellpadding: '0' });
    const tableHead = el('thead');
    const tableBody = el('tbody.history__tbody');
    const tableHeadRow = el('tr');
    const sendAccountTd = el('td', 'Счёт отправителя');
    const benAccountTd = el('td', 'Счёт получателя');
    const amountTd = el('td', 'Сумма');
    const dateTd = el('td', 'Дата');

    setChildren(historyBlock, [subtitle, table]);
    setChildren(table, [tableHead, tableBody]);
    setChildren(tableHead, tableHeadRow);
    setChildren(tableHeadRow, [sendAccountTd, benAccountTd, amountTd, dateTd]);

    renderTable(id, tableBody, count)

    historyBlock.addEventListener('click', () => {
        router.navigate(`/accounts/${id}/more`);
        document.querySelector('.loader').style.display = 'block';
    })

    return {
        historyBlock,
        table
    }
}

export async function renderTable(id, body, count) {
    const data = await getCard(token, id);


    if (data.payload.transactions.length < count) {
        const transactions = data.payload.transactions;
        for (let i = 0; i < transactions.length; i++) {
            body.append(createTransfer(id, transactions[i].from, transactions[i].to, transactions[i].amount, transactions[i].date));
        }

    } else {
        const transactions = data.payload.transactions.slice(data.payload.transactions.length - count, data.payload.transactions.length);
        for (let i = 0; i < transactions.length; i++) {
            body.append(createTransfer(id, transactions[i].from, transactions[i].to, transactions[i].amount, transactions[i].date));
        }
    }

    if (data.payload.transactions.length >= count && count == 25) {
        const transactions = data.payload.transactions;

        for (let i = 0; i < transactions.length; i++) {
            body.append(createTransfer(id, transactions[i].from, transactions[i].to, transactions[i].amount, transactions[i].date));
        }

        const box = el('div.history__box');
        document.querySelector('.history').append(box);

        paginator({
            get_rows: function () {
                return document.querySelector(".history__tbody").getElementsByTagName("tr");
            },
            box: document.querySelector(".history__box"),
            rows_per_page: 25,
            active_class: 'active-page'
        });

    }

}

export async function createAccountInfoSection(id, balance) {
    const section = el('section.account-info');
    const mainBlock = el('div.main__block');
    const newTransfer = createNewTransfer(id);
    const chart = await createChart(id, 'balance', 6, 500, 'Динамика баланса');
    const history = createHistory(id, 10);

    const top = el('div.main__top');
    const linkBack = el('a.main__link.back', 'Вернуться назад', {href: '/accounts'});
    const mainLeft = el('div.main__left--new');
    const h2 = el('h2.title', 'Просмотр счёта');
    const cardId = el('p.main__id', `№ ${id}`);
    const mainRight = el('div.main__right');
    const balanceInfo = el('p.balance-info');
    const balanceText = el('span.balance-text', 'Баланс');
    const cardBalance = el('span.balance', `${balance} ₽`);

    setChildren(top, [mainLeft, mainRight]);
    setChildren(mainLeft, [h2, cardId]);
    setChildren(mainRight, [linkBack, balanceInfo]);
    setChildren(balanceInfo, [balanceText, cardBalance]);
    setChildren(mainBlock, [newTransfer.transferBlock, chart, history.historyBlock]);
    setChildren(section, [top, mainBlock]);

    linkBack.addEventListener('click', (e) => {
        e.preventDefault();
        transactionsArray = [];
        transactionsMonthBalance = [];
        router.navigate(e.target.getAttribute('href')); 
        document.querySelector('.loader').style.display = 'block';
    })

    return {
        section,
        linkBack
    }
}
