const balanceElement = document.getElementById("balance");
const loanButtonElement = document.getElementById("loanButton");
const outstandingLoanElement = document.getElementById("outstandingLoan");
const outstandingLoanAmountElement = document.getElementById("outstandingLoanAmount");

const workButtonElement = document.getElementById("workButton");
const bankButtonElement = document.getElementById("bankButton");
const repayLoanButtonElement = document.getElementById("repayLoanButton");
const payElement = document.getElementById("pay");

const laptopSelectionElement = document.getElementById("laptopSelection");
const featuresListElement = document.getElementById("featuresList");
const laptopDescriptionElement = document.getElementById("laptopDescription");
const laptopPriceElement = document.getElementById("laptopPrice");
const laptopModelElement = document.getElementById("laptopModel");
const buyLaptopButtonElement = document.getElementById("buyLaptop");

let balance = 0;
let outstandingLoan = 0;

let pay = 0;

let laptops = [];

fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
    .then(response => response.json())
    .then(data => laptops = data)
    .then(laptops => addLaptopsToList(laptops));

const addLaptopsToList = (laptops) => {
    laptops.forEach(x => addLaptopToList(x));
    updateLaptopFeatures(laptops[0]);
    updateLaptopDescription(laptops[0]);
    updateLaptopPrice(laptops[0]);
    updateLaptopModel(laptops[0]);
}

const addLaptopToList = (laptop) => {
    const laptopElement = document.createElement("option");
    laptopElement.value = laptop.id;
    laptopElement.appendChild(document.createTextNode(laptop.title));
    laptopSelectionElement.appendChild(laptopElement);
}

const handleLoanButtonClick = () => {
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
        repayLoanButtonElement.hidden = false;
        outstandingLoanAmountElement.innerText = outstandingLoan + ' Kr.';
    }

    else {
        outstandingLoanElement.hidden = true;
        repayLoanButtonElement.hidden = true;
        outstandingLoanAmountElement.innerText = '';
    }
}

const updateBalance = () => {
    balanceElement.innerText = balance + ' Kr.';
}





const handleWorkButtonClick = () => {
    pay += 100;
    updatePay();
}

const handleBankButtonClick = () => {
    if(outstandingLoan > 0) {
        outstandingLoan -= (pay / 10);
        pay -= (pay / 10);

        if(outstandingLoan < 0) {
            pay += (- outstandingLoan);
            outstandingLoan = 0;
        }

        updateLoanBalance();
    }

    balance += pay;
    pay = 0;
    updateBalance();
    updatePay();
}

const updatePay = () => {
    payElement.innerText = pay + ' Kr.';
}

const handleRepayLoanButtonClick = () => {
    if(pay > outstandingLoan) {
        pay -= outstandingLoan;
        outstandingLoan = 0;
    }

    else {
        outstandingLoan -= pay;
        pay = 0;
    }

    updatePay();
    updateLoanBalance();
}

const handleLaptopSelectionChange = (e) => {
    const selectedLaptop = laptops[e.target.selectedIndex];
    updateLaptopFeatures(selectedLaptop);
    updateLaptopDescription(selectedLaptop);
    updateLaptopPrice(selectedLaptop);
    updateLaptopModel(selectedLaptop);
}

const updateLaptopFeatures = (selectedLaptop) => {
    featuresListElement.innerHTML = "";
    selectedLaptop.specs.forEach(x => {
        const feature = document.createElement("li");
        feature.innerText = x;
        featuresListElement.appendChild(feature);
    })
}

const updateLaptopDescription = (selectedLaptop) => {
    laptopDescriptionElement.innerText = selectedLaptop.description;
}

const updateLaptopPrice = (selectedLaptop) => {
    laptopPriceElement.innerText = selectedLaptop.price + ' Kr.';
}

const updateLaptopModel = (selectedLaptop) => {
    laptopModelElement.innerText = selectedLaptop.title;
}

const handleBuyLaptopClick = () => {
    const selectedLaptop = laptops[laptopSelectionElement.selectedIndex];
    if(balance < selectedLaptop.price) {
        alert("You can't afford the " + selectedLaptop.title + "!");
        return;
    }

    balance -= selectedLaptop.price;
    updateBalance();
    alert("You are now the proud owner of a " + selectedLaptop.title + "!");
}

loanButtonElement.addEventListener("click", handleLoanButtonClick);
workButtonElement.addEventListener("click", handleWorkButtonClick);
bankButtonElement.addEventListener("click", handleBankButtonClick);
repayLoanButtonElement.addEventListener("click", handleRepayLoanButtonClick);
laptopSelectionElement.addEventListener("change", handleLaptopSelectionChange);
buyLaptopButtonElement.addEventListener("click", handleBuyLaptopClick);