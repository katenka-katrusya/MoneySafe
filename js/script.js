import {convertStringNumber} from './convertStringNumber.js';
import {OverlayScrollbars} from './overlayscrollbars.esm.min.js';

const API_URL = 'https://hyper-inconclusive-cockatoo.glitch.me/api';

const $financeForm = document.querySelector('.finance__form');
const $financeAmount = document.querySelector('.finance__amount');
const $financeReportBtn = document.querySelector('.finance__report');
const $report = document.querySelector('.report');
const reportOperationList = document.querySelector('.report__operation-list');
const reportDates = document.querySelector('.report__dates');

const typesOperation = {
    income: 'доход',
    expenses: 'расход'
};

let amount = 0;

$financeAmount.textContent = amount;

$financeForm.addEventListener('submit', operations); /* определяем какой оператор нажат и меняем amount */
$financeReportBtn.addEventListener('click', async () => {
    openReport();
    const data = await getData('/test');
    renderReport(data);
});
reportDates.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(reportDates));

    const searchParams = new URLSearchParams();

    if (formData.startDate) {
        searchParams.append('startDate', formData.startDate);
    }

    if (formData.endDate) {
        searchParams.append('endDate', formData.endDate);
    }

    const queryString = searchParams.toString();
    const url = queryString ? `/test?${queryString}` : '/test';

    const data = await getData(url);
    renderReport(data);
});

OverlayScrollbars($report, {});

function openReport() {
    $report.classList.add('report__open');
    document.addEventListener('click', closeReport);
}

function closeReport({target}) {
    // если мы кликаем по кнопке закрытия ИЛИ вне модалки И это не кнопка $financeReportBtn, то закрываем окно
    if (target.closest('.report__close') || (!target.closest('.report') && (target !== $financeReportBtn))) {
        $report.classList.remove('report__open');
        document.removeEventListener('click', closeReport);
    }
}

function operations(e) {
    e.preventDefault();
    const typeOperation = e.submitter.dataset.typeOperation;
    const changeAmount = Math.abs(convertStringNumber($financeForm.amount.value));

    if (typeOperation === 'income') {
        amount += changeAmount;
    } else if (typeOperation === 'expenses') {
        amount -= changeAmount;
    }

    $financeAmount.textContent = `${amount.toLocaleString()} ₽`;
}

async function getData(url) {
    try {
        const response = await fetch(`${API_URL}${url}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();

    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        throw error;
    }
}

function renderReport(data) {
    reportOperationList.textContent = '';

    const reportRows = data.map(({category, amount, description, date, type}) => {
        const reportRow = document.createElement('tr');
        reportRow.classList.add('.report__row');

        reportRow.innerHTML = `
            <td class="report__cell">${category}</td>
            <td class="report__cell report__cell-amount">${amount.toLocaleString()}&nbsp;₽</td>
            <td class="report__cell">${description}</td>
            <td class="report__cell">${reformatDate(date)}</td>
            <td class="report__cell">${typesOperation[type]}</td>
            <td class="report__action-cell">
                <button
                        class="report__button report__button_table">&#10006;
                </button>
            </td>`;
        return reportRow;
    });

    reportOperationList.append(...reportRows);
}

function reformatDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`;
}