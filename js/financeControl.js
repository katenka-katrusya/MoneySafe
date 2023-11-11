import {animationNumber, helper} from './helper.js';
import {getData, postData} from './service.js';

const $financeForm = document.querySelector('.finance__form');
const $financeAmount = document.querySelector('.finance__amount');

let amount = 0;

$financeAmount.textContent = amount;

const addNewOperation = async (e) => { /* определяем какой оператор нажат и меняем amount */
    e.preventDefault();

    const typeOperation = e.submitter.dataset.typeOperation;

    const financeFormDate = Object.fromEntries(new FormData($financeForm));
    financeFormDate.type = typeOperation;

    const newOperation = await postData('/finance', financeFormDate);

    const changeAmount = Math.abs(helper(newOperation.amount));

    if (typeOperation === 'income') {
        amount += changeAmount;
    } else if (typeOperation === 'expenses') {
        amount -= changeAmount;
    }
    
    animationNumber($financeAmount, amount);
    $financeForm.reset();
};

export async function financeControl() {
    const operations = await getData('/finance');

    amount = operations.reduce((acc, item) => {
        if (item.type === 'income') {
            acc += helper(item.amount);
        } else if (item.type === 'expenses') {
            acc -= helper(item.amount);
        }

        return acc;
    }, 0);

    animationNumber($financeAmount, amount);

    $financeForm.addEventListener('submit', addNewOperation);
}