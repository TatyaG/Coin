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




