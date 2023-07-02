import { el, setChildren } from 'redom';
import {createChart, createHistory} from './account-info.js';
import {router} from './index.js';


export async function createMoreSection(id, balance) {
    const section = el('section.more');
    const mainBlock = el('div.main__block--more');

    const top = el('div.main__top');
    const linkBack = el('a.main__link.back', 'Вернуться назад', {href: `/accounts/${id}`});
    const mainLeft = el('div.main__left--new');
    const h2 = el('h2.title', 'Просмотр счёта');
    const cardId = el('p.main__id', `№ ${id}`);
    const mainRight = el('div.main__right');
    const balanceInfo = el('p.balance-info');
    const balanceText = el('span.balance-text', 'Баланс');
    const cardBalance = el('span.balance', `${balance} ₽`);

    const chart1 = await createChart(id, 'balance1', 12, 1200, 'Динамика баланса');
    const chart2 = await createChart(id, 'balance2', 12, 1200, 'Соотношение входящий исходящих транзакций');
    const history = createHistory(id, 25);

    chart1.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('.loader').style.display = 'none';
    })

    chart2.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('.loader').style.display = 'none';
    })

    history.historyBlock.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('.loader').style.display = 'none';
    })

    linkBack.addEventListener('click', (e) => {
      e.preventDefault();
      router.navigate(e.target.getAttribute('href'));   
    })

    
    setChildren(top, [mainLeft, mainRight]);
    setChildren(mainLeft, [h2, cardId]);
    setChildren(mainRight, [linkBack, balanceInfo]);
    setChildren(balanceInfo, [balanceText, cardBalance]);
    setChildren(mainBlock, [chart1, chart2, history.historyBlock]);
    setChildren(section, [top, mainBlock]);

    return section;
}


