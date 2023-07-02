import { el, setChildren } from 'redom';

export function signIn(login, password) {
    const response = fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'content-Type': 'application/json',
        },
        body: JSON.stringify({
            login: login,
            password: password
        })
    })
    .then(res => {
        if (res.status === 404) {
            const error = el('span.error-api')
            error.textContent = 'Произошла ошибка, попробуйте обновить страницу позже';
            document.querySelector('.main .container').append(error);
          }

       return res.json()
    }) 
    .catch(error => {console.log(error)})
    .finally(() => {
        document.querySelector('.loader').style.display = 'none';
    })

    return response;
}

export function makeTransfer(obj, token) {
    const response = fetch('http://localhost:3000/transfer-funds', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${token}`,
            'content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then(res => {
        if (res.status === 404) {
            const error = el('span.error-api')
            error.textContent = 'Произошла ошибка, попробуйте обновить страницу позже';
            document.querySelector('.main .container').append(error);
          }

       return res.json()
    }) 
    .then(data => {return data})
    .catch(error => console.log(error))

    return response;
}

export function getCurrency(token) {
    const response = fetch('http://localhost:3000/currencies', {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${token}`,
            'content-Type': 'application/json'
        }

    })
    .then(res => {
        if (res.status === 404) {
            const error = el('span.error-api')
            error.textContent = 'Произошла ошибка, попробуйте обновить страницу позже';
            document.querySelector('.main .container').append(error);
          }

       return res.json()
    }) 
    .then(data => {return data})
    .catch(error => console.log(error))

    return response;
}

export function getAllCurrencies(token) {
    const response = fetch('http://localhost:3000/all-currencies', {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${token}`,
            'content-Type': 'application/json'
        }

    })
    .then(res => {
        if (res.status === 404) {
            const error = el('span.error-api')
            error.textContent = 'Произошла ошибка, попробуйте обновить страницу позже';
            document.querySelector('.main .container').append(error);
          }

       return res.json()
    }) 
    .then(data => {return data})
    .catch(error => console.log(error))

    return response;
}

export async function getCurrencyFeed() {
    return new WebSocket('ws://localhost:3000/currency-feed');
}


export function newCard(token) {
    const response = fetch('http://localhost:3000/create-account', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${token}`,
            'content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(res => {
        if (res.status === 404) {
            const error = el('span.error-api')
            error.textContent = 'Произошла ошибка, попробуйте обновить страницу позже';
            document.querySelector('.main .container').append(error);
          }

       return res.json()
    }) 
    .then(data => {return data})
    .catch(error => console.log(error))

    return response;
}

export function getCards(token) {
    const response = fetch('http://localhost:3000/accounts', {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${token}`,
            'content-Type': 'application/json'
        }

    }).then(res => {
        if (res.status === 404) {
            const error = el('span.error-api')
            error.textContent = 'Произошла ошибка, попробуйте обновить страницу позже';
            document.querySelector('.main .container').append(error);
          }

       return res.json()
    }) 
    .then(data => {return data})
    .catch(error => console.log(error))

    return response;
}

export function getCard(token, id) {
    const response = fetch(`http://localhost:3000/account/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${token}`,
            'content-Type': 'application/json'
        }

    })
    .then(res => {
        if (res.status === 404) {
            const error = el('span.error-api')
            error.textContent = 'Произошла ошибка, попробуйте обновить страницу позже';
            document.querySelector('.main .container').append(error);
          }

       return res.json()
    }) 
    .then(data => {return data})
    .catch(error => console.log(error))

    return response;
}

export function currencyBuy(obj, token) {
    const response = fetch('http://localhost:3000/currency-buy', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${token}`,
            'content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then(res => {
        if (res.status === 404) {
            const error = el('span.error-api')
            error.textContent = 'Произошла ошибка, попробуйте обновить страницу позже';
            document.querySelector('.main .container').append(error);
          }

       return res.json()
    }) 
    .then(data => {return data})
    .catch(error => console.log(error))


    return response;
}

export function getBanks(token) {
    const response = fetch('http://localhost:3000/banks', {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${token}`,
            'content-Type': 'application/json'
        }

    })
    .then(res => {
        if (res.status === 404) {
            const error = el('span.error-api')
            error.textContent = 'Произошла ошибка, попробуйте обновить страницу позже';
            document.querySelector('.main .container').append(error);
          }

       return res.json()
    }) 
    .then(data => {return data})
    .catch(error => console.log(error))

    return response;
}