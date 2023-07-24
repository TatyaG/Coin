<h1 align="center">Банковская система Coin</h1> 

<h2>Установка</h2> 
  
1. Для запуска данного проекта вам понадобится nodejs и npm.  
2. Склонируйте данный репозиторий к себе на диск.
3. С помощью команды `cd server` перейдите в папку сервера.
4. Для установки зависимостей серверной части приложения выполните `npm i`, затем запустите сервер командой `npm start`.  
5. По умолчанию сервер слушает на 3000-ом порту localhost.

<h2>Запуск проекта</h2>

1. Перейдите в папку frontend-части с помощью команды `cd client`.
2. Для установки зависимостей frontend части приложения выполните `npm i`.

<h3>Запуск приложения в режиме development</h3>

Выполните команду `npm run dev`.

<h3>Запуск приложения в режиме production</h3>

В данном режиме проект собирается в папку dist.

1. Выполните команду `npm run dev`.
2. Для запуска приложения необходимо установить веб-сервер <a href="https://www.npmjs.com/package/serve">serve</a></h2>
Чтобы установить его, необходимо выполнить команду `npm install --global serve`.

3. Для запуска сервера выполните команду `serve -s dist`.

<h2>Авторизация</h2>

Для авторизации используйте логин и пароль:
```
login: 'developer',
password: 'skillbox'
```

<img width="100%" align="center" src="https://github.com/TatyaG/Coin/blob/master/readme-assets/login.png">

<h2>Список счетов</h2>

После авторизации вы увидите список всех своих счетов.
Также есть возможность создания нового счета.

<img width="100%" align="center" src="https://github.com/TatyaG/Coin/blob/master/readme-assets/accounts.png">

<h2>Информация о счете</h2>

При нажатии на счет открывается информация о счете, динамика баланса, история переводов. Можно произвести новый перевод с данного счета.

<img width="100%" align="center" src="https://github.com/TatyaG/Coin/blob/master/readme-assets/account.png">

<h2>Подробная информация о счете</h2>

При нажатии на окошко с динамикой баланса или историей переводов открывается подробная информация о счете.

<img width="100%" align="center" src="https://github.com/TatyaG/Coin/blob/master/readme-assets/account-more.png">

<h2>Валюты</h2>

На странице валюты можно посмотреть список всех валют, изменение курсов в реальном времени произвести обмен валютами.

<img width="100%" align="center" src="https://github.com/TatyaG/Coin/blob/master/readme-assets/currencies.png">

<h2>Банки</h2>

На странице Банкоматы отображена карта с банками

<img width="100%" align="center" src="https://github.com/TatyaG/Coin/blob/master/readme-assets/banks.png">



