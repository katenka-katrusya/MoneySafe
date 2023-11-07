import {convertStringNumber} from './convertStringNumber.js';

const financeForm = document.querySelector('.finance__form');
const financeAmount = document.querySelector('.finance__amount');
const financeReportBtn = document.querySelector('.finance__report');
let amount = 0;

financeAmount.textContent = amount;

financeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const typeOperation = e.submitter.dataset.typeOperation;
    const changeAmount = Math.abs(convertStringNumber(financeForm.amount.value));
    console.log(changeAmount);
    if (typeOperation === 'income') {
        amount += changeAmount;
    } else if (typeOperation === 'expenses') {
        amount -= changeAmount;
    }

    financeAmount.textContent = `${amount.toLocaleString()} ₽`;
});

financeReportBtn.addEventListener('click', () => {
    const report = document.querySelector('.report');
    report.classList.add('report__open');

    const reportClose = report.querySelector('.report__close');
    reportClose.addEventListener('click', () => {
        report.classList.remove('report__open');
    });
});

