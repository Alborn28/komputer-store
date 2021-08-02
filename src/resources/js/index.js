const balanceElement = document.getElementById("balance");
const loanButtonElement = document.getElementById("loanButton");
const outstandingLoanElement = document.getElementById("outstandingLoan")
const outstandingLoanAmountElement = document.getElementById("outstandingLoanAmount")

let balance = 100;
let outstandingLoan = 0;

const takeLoan = () => {
    if(outstandingLoan > 0) {
        alert("You may only have one loan at a time!");
        return;
    }

    const loanAmount = parseInt(prompt("How much do you wish to loan?"));
    if(loanAmount > (2 * balance)) {
        alert("You may not loan that much!");
        return;
    }

    outstandingLoan = loanAmount;
    balance += loanAmount;

    updateBalance();

    updateLoanBalance();
}

const updateLoanBalance = () => {
    if(outstandingLoan > 0) {
        outstandingLoanElement.hidden = false;
    }

    outstandingLoanAmountElement.innerText = outstandingLoan + ' Kr.';
}

const updateBalance = () => {
    balanceElement.innerText = balance + ' Kr.';
}

loanButtonElement.addEventListener("click", takeLoan);