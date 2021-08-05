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
    try {
        const response = await fetch("https://noroff-komputer-store-api.herokuapp.com/computers");
        const data = await response.json();
        laptops = data;
        addLaptopsToList(laptops);
    }
    catch(error) {
        console.error("Something went wrong with fetching from API...");
        console.error(error);
    }
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
};

/**
 * Add a laptop to the dropdown-list.
 * @param {*} laptop laptop to be added to the list.
 */
const addLaptopToList = (laptop) => {
    const laptopElement = document.createElement("option");
    laptopElement.value = laptop.id;
    laptopElement.appendChild(document.createTextNode(laptop.title));
    laptopSelectionElement.appendChild(laptopElement);
};

/**
 * Update the HTML elements concerning a user's loans. If no loan is active, it hides all elements connected to loans.
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
        outstandingLoanAmountElement.innerText = "";
    }
};

/**
 * Updates the HTML element with the current account balance.
 */
const updateBalance = () => {
    balanceElement.innerText = `${balance} Kr.`;
};

/**
 * Update the HTML element with the current pay earned from work.
 */
const updatePay = () => {
    payElement.innerText = `${pay} Kr.`;
};

/**
 * Update the features to match the features of the laptop currently selected in the dropdown-list.
 * @param {*} selectedLaptop currently selected laptop.
 */
const updateLaptopFeatures = (selectedLaptop) => {
    featuresListElement.innerHTML = "";
    selectedLaptop.specs.forEach(x => {
        const feature = document.createElement("li");
        feature.innerText = x;
        featuresListElement.appendChild(feature);
    });
};

/**
 * Update the description to match the description of the laptop currently selected in the dropdown-list.
 * @param {*} selectedLaptop currently selected laptop.
 */
const updateLaptopDescription = (selectedLaptop) => {
    laptopDescriptionElement.innerText = selectedLaptop.description;
};

/**
 * Update the price tag to match the price of the laptop currently selected in the dropdown-list.
 * @param {*} selectedLaptop currently selected laptop.
 */
const updateLaptopPrice = (selectedLaptop) => {
    laptopPriceElement.innerText = `${selectedLaptop.price} Kr.`;
};

/**
 * Update the model to the model of the laptop currently selected in the dropdown-list.
 * @param {*} selectedLaptop currently selected laptop.
 */
const updateLaptopModel = (selectedLaptop) => {
    laptopModelElement.innerText = selectedLaptop.title;
};

/**
 * Update the image to show the laptop currently selected in the dropdown-list.
 * @param {*} selectedLaptop currently selected laptop.
 */
const updateLaptopImage = (selectedLaptop) => {
    laptopImageElement.src = `https://noroff-komputer-store-api.herokuapp.com/${selectedLaptop.image}`;
};

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
    if(isNaN(loanAmount)) {
        alert("Input must be an integer!");
        return;
    }

    if(loanAmount > (2 * balance)) {
        alert("You may not loan that much!");
        return;
    }

    outstandingLoan = loanAmount;
    balance += loanAmount;
    loanTaken = true;

    updateBalance();
    updateOutstandingLoan();
};

/**
 * Function called when a user clicks the work-button.
 */
 const handleWorkButtonClick = () => {
    pay += 100;
    updatePay();
};

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
};

/**
 * Function called when the user clicks the repay loan button. 
 * If the pay amount exceed the outstanding loan, subtract the loan amount from pay and leave the rest.
 * If the pay amount is less than the loan, subtract the full pay from the loan amount.
 */
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
};

/**
 * Function called when the selection in the dropdown-list is changed.
 * Updates the information shown on screen to match the current laptop selected in the dropdown-list.
 * @param {*} e the event that is triggered from the selection change.
 */
 const handleLaptopSelectionChange = (e) => {
    const selectedLaptop = laptops[e.target.selectedIndex];
    updateLaptopFeatures(selectedLaptop);
    updateLaptopDescription(selectedLaptop);
    updateLaptopPrice(selectedLaptop);
    updateLaptopModel(selectedLaptop);
    updateLaptopImage(selectedLaptop);
};

/**
 * Function called when the user clicks the BUY NOW-button to buy a laptop.
 * @returns if the user can't afford the selected laptop.
 */
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
};

/**
 * Eventlisteners to handle events such as button clicks and selection changes.
 */
loanButtonElement.addEventListener("click", handleLoanButtonClick);
workButtonElement.addEventListener("click", handleWorkButtonClick);
bankButtonElement.addEventListener("click", handleBankButtonClick);
repayLoanButtonElement.addEventListener("click", handleRepayLoanButtonClick);
laptopSelectionElement.addEventListener("change", handleLaptopSelectionChange);
buyLaptopButtonElement.addEventListener("click", handleBuyLaptopClick);