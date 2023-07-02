import { el, setChildren } from 'redom';
import JustValidate from 'just-validate';
import {router} from './index.js';
import { signIn } from './api';


export function createSignForm() {
    const form = el('form.form');
    const fieldset = el('fieldset.form__fieldset');
    const legend = el('legend.fieldset__legend', 'Вход в аккаунт');
    const loginLabel = el('label.form__label.login');
    const loginText = el('span.label-text', 'Логин');
    const loginInput = el('input.form__input', { placeholder: 'Введите логин', id: 'login' });
    const passwordLabel = el('label.form__label.password');
    const passwordText = el('span.label-text', 'Пароль');
    const passwordInput = el('input.form__input', { placeholder: 'Введите пароль', id: 'password', type: 'password' });

    const btn = el('button.form__btn.btn-reset', 'Войти', { type: 'submit' });

    setChildren(form, [fieldset, btn]);
    setChildren(fieldset, [legend, loginLabel, passwordLabel]);
    setChildren(loginLabel, [loginText, loginInput]);
    setChildren(passwordLabel, [passwordText, passwordInput]);

    const validate = new JustValidate(form);

    validate
        .addField(loginInput, [
            {
                rule: 'required',
                errorMessage: 'Введите логин',
            },
            {
                rule: 'minLength',
                value: 6,
                errorMessage: 'Логин должен содержать 6 символом и более',
            },
        ])
        .addField(passwordInput, [
            {
                rule: 'required',
                errorMessage: 'Введите пароль',
            },
            {
                rule: 'minLength',
                value: 6,
                errorMessage: 'Пароль должен содержать 6 символом и более',
            },
        ])

    loginInput.addEventListener('input', () => {
        if (document.querySelector('.error-sign')) document.querySelector('.error-sign').remove();
    })

    passwordInput.addEventListener('input', () => {
        if (document.querySelector('.error-sign')) document.querySelector('.error-sign').remove();
    })

    // Запрет на ввод пробела

    const letters = /[ ]/;

    loginInput.addEventListener('keypress', (e) => {
        if (letters.test(e.key)) {
            e.preventDefault();
        }
    })

    passwordInput.addEventListener('keypress', (e) => {
        if (letters.test(e.key)) {
            e.preventDefault();
        }
    })


    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = await signIn(loginInput.value, passwordInput.value);
        console.log(data)
        if (data.error == '') {
            document.querySelector('.loader').style.display = 'block';
            localStorage.setItem('token', data.payload.token);
            form.remove();
            router.navigate('/accounts');

            document.querySelectorAll('.header__btn ').forEach(el => {
                el.addEventListener('click', () => {
                    if (document.querySelector('.header__btn--active')) document.querySelector('.header__btn--active').classList.remove('header__btn--active');
                    el.classList.add('header__btn--active');
                })
            })

        } else if (data.error == 'No such user' && loginInput.value.length >= 6 && passwordInput.value.length >= 6) {
            if (document.querySelector('.error-sign')) document.querySelector('.error-sign').remove();
            const error = el('span.error-sign', 'Пользователя с таким логином не существует!');
            document.querySelector('.form__label.login').append(error);
        } else if (data.error == 'Invalid password' && passwordInput.value.length >= 6) {
            const error = el('span.error-sign', 'Введите правильный пароль!');
            document.querySelector('.form__label.password').append(error);
        }
    })


    return {
        form,
        validate
    }
}

