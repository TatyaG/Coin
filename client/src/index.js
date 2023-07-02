import './style.css';
import { el, setChildren } from 'redom';
import Navigo from 'navigo';
import logo from './assets/img/Logo.svg';
import Chart from 'chart.js/auto';
import { createSignForm } from './sign.js';
import { createCard, createAccountsSection } from './accounts';
import { createBanksSection } from './banks.js';
import { getCards, getCard } from './api.js';
import { createAccountInfoSection, result, incomeArr, expensesArr } from './account-info.js';
import { createCurrencySection } from './currency.js';
import { createMoreSection } from './more.js';

export let router = new Navigo('/');

const header = el('header.header');
const headerContainer = el('div.container.header__container');
const logoLink = el('a.header__logo', { href: '/accounts' });
const logoImg = el('img', { src: logo });
const headerList = createHeaderList();
const script = document.createElement('script');
script.src = "https://api-maps.yandex.ru/2.1/?apikey=<ваш API-ключ>&lang=ru_RU";
document.body.appendChild(script);

logoLink.addEventListener('click', (e) => {
    e.preventDefault();
    router.navigate('/accounts');
})


const main = el('main.main');

setChildren(logoLink, logoImg);
setChildren(header, headerContainer);
setChildren(headerContainer, [logoLink, headerList]);
setChildren(window.document.body, [header, main]);

const container = el('div.container');
const loader = el('div.loader');

setChildren(main, [container, loader]);
const token = localStorage.getItem('token');



export async function accounts() {
    document.querySelector('.header__list').style.display = 'flex';
    const accountsSection = createAccountsSection();
    setChildren(document.querySelector('.main > .container'), accountsSection.section);

    setTimeout(() => {
        document.querySelector('.loader').style.display = 'none';
    }, 1000)

    getCards(token).then(data => {
        let cardsArray = data.payload;
    container.append(accountsSection.section);
    renderCardsList(cardsArray, accountsSection.cardsList);


    document.querySelector('.number-item').addEventListener('click', () => {
        sort(cardsArray, 'account');
        renderCardsList(cardsArray, accountsSection.cardsList);
    })

    document.querySelector('.balance-item').addEventListener('click', () => {
        sort(cardsArray, 'balance');
        renderCardsList(cardsArray, accountsSection.cardsList);
    })

    document.querySelector('.date-item').addEventListener('click', () => {
        sort(cardsArray, 'date');
        renderCardsList(cardsArray, accountsSection.cardsList);
    })

    const items = document.querySelectorAll('.sort .dropdown__item');
    items.forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.sort .dropdown__item--active').forEach(el => {
                if (el !== item) el.classList.remove('dropdown__item--active');
            })

            item.classList.toggle('dropdown__item--active');
            document.querySelector('.sort .dropdown__btn').textContent = item.textContent;
            document.querySelector('.sort .dropdown__menu').classList.remove('dropdown__menu--open');
        })
    })  
    }).catch(error => console.log(error))
      
   
    
}


export async function accountInfo(id) {
    document.querySelector('.header__list').style.display = 'flex';
    const data = await getCard(token, id);
    const accountInfoSection = await createAccountInfoSection(id, data.payload.balance);
    console.log(accountInfoSection)
    setChildren(document.querySelector('.main > .container'), accountInfoSection.section);

    setTimeout(() => {
        document.querySelector('.loader').style.display = 'none';
    }, 1000)

    new Chart(
        document.getElementById('balance'),
        {
            type: 'bar',
            options: {
                elements: {
                    bar: {
                        borderSkipped: false
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                family: 'WorkSans',
                                weight: 700,
                            }
                        },
                        display: false
                    },
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        }
                    },
                    y: {
                        min: 0,
                        max: result.reduce((row1, row2) => row1.balance > row2.balance ? row1.balance : row2.balance),
                        beginAtZero: true,
                        position: 'right',
                        ticks: {
                            maxTicksLimit: 2,
                            callback: function (value, index, ticks) {
                                return `${value} ₽`;
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                },
            },
            data: {
                labels: result.map(row => row.month),
                datasets: [
                    {
                        label: 'Balance by month',
                        data: result.map(row => row.balance),
                        backgroundColor: '#116ACC',
                        color: '#000000',
                    }
                ]
            }
        }
    );
}

export async function accountInfoMore(id) {
    document.querySelector('.header__list').style.display = 'flex';
    const data = await getCard(token, id);
    console.log(data)
    setChildren(document.querySelector('.main > .container'), await createMoreSection(id, data.payload.balance));
    setTimeout(() => {
        document.querySelector('.loader').style.display = 'none';
    }, 1000)


    const maxValue = result.reduce((row1, row2) => row1.balance > row2.balance ? row1.balance : row2.balance);
    const minValue = result.reduce((a, b) => a.balance < b.balance ? a.balance : b.balance);


    new Chart(
        document.getElementById('balance1'),
        {
            type: 'bar',
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        }
                    },
                    y: {
                        min: 0,
                        max: result.reduce((row1, row2) => row1.balance > row2.balance ? row1.balance : row2.balance),
                        beginAtZero: true,
                        position: 'right',
                        ticks: {
                            maxTicksLimit: 2,
                            callback: function (value, index, ticks) {
                                return `${value} ₽`;
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                }
            },
            data: {
                labels: result.map(row => row.month),
                datasets: [
                    {
                        label: 'Balance by month',
                        data: result.map(row => row.balance),
                        backgroundColor: '#116ACC',
                        color: '#000000',
                    }
                ]
            }
        }
    );

    new Chart(
        document.getElementById('balance2'),
        {
            type: 'bar',
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                },
                responsive: true,
                scales: {
                    x: {
                        stacked: true,
                        grid: {
                            display: false,
                        }
                    },
                    y: {
                        min: 0,
                        max: result.reduce((row1, row2) => row1.balance > row2.balance ? row1.balance : row2.balance),
                        stacked: true,
                        beginAtZero: true,
                        position: 'right',
                        ticks: {
                            maxTicksLimit: 3,
                            callback: function (value, index, ticks) {
                                return `${value} ₽`;
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                }
            },
            data: {
                labels: result.map(row => row.month),
                datasets: [{
                    label: 'Расходы',
                    backgroundColor: "#FD4E5D",
                    data: expensesArr.map(row => row.balance),
                }, {
                    label: 'Доходы',
                    backgroundColor: "#76CA66",
                    data: incomeArr.map(row => row.balance),
                }]
            }
        }
    );

}


export function banks() {
   
    document.querySelector('.header__list').style.display = 'flex';
    document.querySelector('.header__btn--active').classList.remove('header__btn--active');
    document.querySelector('.banks-btn').classList.add('header__btn--active');
    createBanksSection().then(banks => {
         setChildren(container, banks);
   
    })
    .catch(error => console.log(error))
    setTimeout(() => {
        document.querySelector('.loader').style.display = 'none';
    }, 1000)


}


export function currencies() {
    document.querySelector('.header__list').style.display = 'flex';
    document.querySelector('.header__btn--active').classList.remove('header__btn--active');
    document.querySelector('.currency-btn').classList.add('header__btn--active');

    setChildren(document.querySelector('.main > .container'), createCurrencySection());

    setTimeout(() => {
        document.querySelector('.loader').style.display = 'none';
    }, 1000)

    const itemsFrom = document.querySelectorAll('.currency-from .dropdown__item');
    itemsFrom.forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.currency-from .dropdown__item--active').forEach(el => {
                if (el !== item) el.classList.remove('dropdown__item--active');
            })

            item.classList.toggle('dropdown__item--active');
            document.querySelector('.currency-from .dropdown__btn').textContent = item.textContent;
            document.querySelector('.currency-from .dropdown__menu').classList.remove('dropdown__menu--open');
        })
    })

    const itemsTo = document.querySelectorAll('.currency-to .dropdown__item');
    itemsTo.forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.currency-to .dropdown__item--active').forEach(el => {
                if (el !== item) el.classList.remove('dropdown__item--active');
            })

            item.classList.toggle('dropdown__item--active');
            document.querySelector('.currency-to .dropdown__btn').textContent = item.textContent;
            document.querySelector('.currency-to .dropdown__menu').classList.remove('dropdown__menu--open');
        })
    })
}


 function createHeaderList() {
    const headerList = el('ul.header__list');
    const BanksItem = el('li.header__item');
    const BanksBtn = el('a.header__btn.banks-btn', 'Банкоматы', { href: '/banks' });

    const accountItem = el('li.header__item');
    const accountBtn = el('a.header__btn.account-btn.header__btn--active', 'Счета', { href: '/accounts' });

    const currencyItem = el('li.header__item');
    const currencyBtn = el('a.header__btn.currency-btn', 'Валюта', { href: '/currencies' });

    const exitItem = el('li.header__item');
    const exitBtn = el('a.header__btn.exit-btn', 'Выйти', { href: '/login' });

    setChildren(headerList, [BanksItem, accountItem, currencyItem, exitItem]);
    setChildren(BanksItem, BanksBtn);
    setChildren(accountItem, accountBtn);
    setChildren(currencyItem, currencyBtn);
    setChildren(exitItem, exitBtn);

    accountBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loader.style.display = 'block';
        router.navigate('/accounts');
        document.querySelector('.header__btn--active').classList.remove('header__btn--active');
        accountBtn.classList.add('header__btn--active');

    })

    currencyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loader.style.display = 'block';
        router.navigate('/currencies');
        document.querySelector('.header__btn--active').classList.remove('header__btn--active');
        currencyBtn.classList.add('header__btn--active');

    })

    BanksBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loader.style.display = 'block';
        router.navigate('/banks');
        document.querySelector('.header__btn--active').classList.remove('header__btn--active');
        BanksBtn.classList.add('header__btn--active');

    })

    exitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // loader.style.display = 'block';
        router.navigate('/login');
        document.querySelector('.header__btn--active').classList.remove('header__btn--active');
        exitBtn.classList.add('header__btn--active');

    })



    return headerList;
}



export function renderCardsList(array, list) {
    list.innerHTML = '';
    for (let i = 0; i < array.length; i++) {
        const card = createCard(array[i].account, array[i].balance, array[i].transactions[i]);
        list.append(card.card);
    }

    return list;
}


export function sort(arr, prop, dir = true) {
    let result = arr.sort(function (a, b) {
        let dirIf = a[prop] < b[prop];
        if (dir == true) dirIf = a[prop] > b[prop]
        if (dirIf == false) return -1;
    });
    return result
}



router.on('/login', () => {
    // setTimeout(() => {
    //     document.querySelector('.loader').style.display = 'none';
    // }, 500)
    document.querySelector('.main > .container').innerHTML = '';
    const signForm = createSignForm();

    setChildren(container, signForm.form);
    document.querySelector('.header__list').style.display = 'none';
    document.querySelector('.loader').style.display = 'none';
})


router.on('/accounts', () => {
    document.querySelector('.main > .container').innerHTML = '';
   accounts();
})


router.on('/accounts/:id', ({ data: { id } }) => {
    document.querySelector('.main > .container').innerHTML = '';
   accountInfo(id);
})


router.on('/accounts/:id/more', ({ data: { id } }) => {
    document.querySelector('.main > .container').innerHTML = '';
    accountInfoMore(id);
})

router.on('/banks', () => {
    document.querySelector('.main > .container').innerHTML = '';
    banks();
    const script = document.createElement('script');
    script.src = "https://api-maps.yandex.ru/2.1/?apikey=<ваш API-ключ>&lang=ru_RU";
    document.body.appendChild(script);
})


router.on('/currencies', () => {
    document.querySelector('.main > .container').innerHTML = '';
    currencies();
})


router.resolve();
