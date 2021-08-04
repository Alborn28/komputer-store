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
const buyLaptopButtonElement = document.getElementById("buyLaptopButton");
const laptopImageElement = document.getElementById("laptopImage");

let laptops = [];
let balance = 0;
let outstandingLoan = 0;
let loanTaken = false;
let pay = 0;

/**
 * An IIFE that fetches all the laptops from the API as soon as the program starts. 
 * It stores the laptops in the laptops-array and loads them into the dropdown-list on the page.
 */
(async () => {
    const response = await fetch("https://noroff-komputer-store-api.herokuapp.com/computers");
    const data = await response.json();
    laptops = data;
    addLaptopsToList(laptops);
})();

/**
 * Add the laptops to the dropdown-list, and set all html-elements to show information about the first laptop by default.
 * @param {*} laptops list of laptops fetched from the API
 */
const addLaptopsToList = (laptops) => {
    laptops.forEach(x => addLaptopToList(x));
    updateLaptopFeatures(laptops[0]);
    updateLaptopDescription(laptops[0]);
    updateLaptopPrice(laptops[0]);
    updateLaptopModel(laptops[0]);
    updateLaptopImage(laptops[0]);
}

/**
 * Add a laptop to the dropdown-list.
 * @param {*} laptop laptop to be added to the list.
 */
const addLaptopToList = (laptop) => {
    const laptopElement = document.createElement("option");
    laptopElement.value = laptop.id;
    laptopElement.appendChild(document.createTextNode(laptop.title));
    laptopSelectionElement.appendChild(laptopElement);
}

/**
 * Function called when the user wants to take a loan by clicking the loan button.
 * @returns when the user may not take a loan, for example when a loan is already active.
 */
const handleLoanButtonClick = () => {
    if(outstandingLoan > 0) {
        alert("You may only have one loan at a time!");
        return;
    }

    if(loanTaken) {
        alert("You may only take one loan before buying a computer!");
        return;
    }

    const loanAmount = parseInt(prompt("How much do you wish to loan?"));

    if(loanAmount > (2 * balance)) {
        alert("You may not loan that much!");
        return;
    }

    outstandingLoan = loanAmount;
    balance += loanAmount;
    loanTaken = true;

    updateBalance();
    updateOutstandingLoan();
}

/**
 * Update the HTML element showing the amount the user has loaned. If no loan is active, it hides all elements connected to loans.
 */
const updateOutstandingLoan = () => {
    if(outstandingLoan > 0) {
        outstandingLoanElement.hidden = false;
        repayLoanButtonElement.hidden = false;
        outstandingLoanAmountElement.innerText = `${outstandingLoan}  Kr.`;
    }

    else {
        outstandingLoanElement.hidden = true;
        repayLoanButtonElement.hidden = true;
        outstandingLoanAmountElement.innerText = '';
    }
}

/**
 * Updates the HTML element with the current account balance.
 */
const updateBalance = () => {
    balanceElement.innerText = `${balance} Kr.`;
}




/**
 * Function called when a user clicks the work-button.
 */
const handleWorkButtonClick = () => {
    pay += 100;
    updatePay();
}

/**
 * Function called when a user clicks the bank-button. 
 * If the user has no loans, the full pay amount is transferred to the account balance. 
 * If a loan is active, 10% of the pay is deducted and subtracted from the outstanding loan. The rest is transferred to the account balance.
 */
const handleBankButtonClick = () => {
    if(outstandingLoan > 0) {
        if(pay/10 > outstandingLoan) {
            pay -= outstandingLoan;
            outstandingLoan = 0;
        }

        else {
            outstandingLoan -= (pay / 10);
            pay -= (pay / 10);
        }

        updateOutstandingLoan();
    }

    balance += pay;
    pay = 0;
    updateBalance();
    updatePay();
}

const updatePay = () => {
    payElement.innerText = `${pay} Kr.`;
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
    updateOutstandingLoan();
}




const handleLaptopSelectionChange = (e) => {
    const selectedLaptop = laptops[e.target.selectedIndex];
    updateLaptopFeatures(selectedLaptop);
    updateLaptopDescription(selectedLaptop);
    updateLaptopPrice(selectedLaptop);
    updateLaptopModel(selectedLaptop);
    updateLaptopImage(selectedLaptop)
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
    laptopPriceElement.innerText = `${selectedLaptop.price} Kr.`;
}

const updateLaptopModel = (selectedLaptop) => {
    laptopModelElement.innerText = selectedLaptop.title;
}

const updateLaptopImage = (selectedLaptop) => {
    laptopImageElement.src = `https://noroff-komputer-store-api.herokuapp.com/${selectedLaptop.image}`
}

const handleBuyLaptopClick = () => {
    const selectedLaptop = laptops[laptopSelectionElement.selectedIndex];
    if(balance < selectedLaptop.price) {
        alert(`You can't afford the ${selectedLaptop.title}!`);
        return;
    }

    balance -= selectedLaptop.price;
    updateBalance();
    alert(`You are now the proud owner of a ${selectedLaptop.title}!`);
    loanTaken = false;
}

loanButtonElement.addEventListener("click", handleLoanButtonClick);
workButtonElement.addEventListener("click", handleWorkButtonClick);
bankButtonElement.addEventListener("click", handleBankButtonClick);
repayLoanButtonElement.addEventListener("click", handleRepayLoanButtonClick);
laptopSelectionElement.addEventListener("change", handleLaptopSelectionChange);
buyLaptopButtonElement.addEventListener("click", handleBuyLaptopClick);