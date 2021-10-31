//Date And Time
let today = new Date();
let day = today.getDay();
let daylist = ["Sunday", "Monday", "Tuesday", "Wednesday ", "Thursday", "Friday", "Saturday"];
let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let dateTime = date + ' ' + time;

document.getElementById("displayDateTime").innerHTML = dateTime + ' <br> Day : ' + daylist[day];

document.getElementById('submitOrder').addEventListener('click', submitOrder)

//Cashier Functionality

// const orderItemIdArray = [];

const orderIdArray = [];
const orderItemsArray = [];
const orderPriceArray = [];
const orderArray = [];

let i = 0;


function submitOrder() {
    let customerName = document.getElementById('inputCustomer').value;
    console.log('sending to server', customerName, orderArray)
    fetch('/orders', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'orderArray': orderArray,
            'customerName': customerName
        })
    })
        .then(response => {
            if (response.ok) return response.json()
        })
        .then(data => {
            console.log(data)
            window.location.reload(true)
        })
}




function orderBasket(itemName, itemPrice) {

    orderIdArray.push(i);
    // orderItemIdArray.push(itemId);
    orderItemsArray.push(itemName);
    orderPriceArray.push(itemPrice);

    // orderArray.push(itemName);

    orderArray.push({ itemName: itemName, itemPrice: itemPrice })


    // console.log(orderArray)
    // console.log(orderArray.length);



    let orderList = document.getElementById('orderList');

    // Create the LI tag
    const orderItem = document.createElement('li');
    orderItem.className = 'itemMenu d-flex justify-content-between align-items-center';


    // Create a span for red color
    const orderItemPriceSpan = document.createElement('span');

    // Create the text node with itemname and itemprice
    const orderItemName = document.createTextNode(itemName);
    const orderItemPrice = document.createTextNode(' $ ' + itemPrice);

    // Adjust text color to text-danger
    orderItemPriceSpan.className = 'text-danger';

    // Add pricetextnode into span
    orderItemPriceSpan.appendChild(orderItemPrice);

    // Create a delete button
    const deleteButton = document.createElement('button');
    const deleteButtonText = document.createTextNode('X');

    deleteButton.setAttribute('onclick', 'deleteItem(' + i + ', this)');

    //create a span for button
    // const deleteButton = document.createElement('span');
    //combine this
    //appendchild to li
    deleteButton.appendChild(orderItemPriceSpan);
    // Append the text to the deletebutton
    deleteButton.appendChild(deleteButtonText);
    deleteButton.className = 'btn btn-danger rounded-pill';

    orderItem.appendChild(deleteButton);

    //Attach the itemname tag and itemprice to the LI Tag
    orderItem.appendChild(orderItemName);

    // Attach the orderItemPriceSpan Span into LI tag
    orderItem.appendChild(orderItemPriceSpan);

    // Attach or Append the LI tag (child) to parent id=orderList
    orderList.appendChild(orderItem);

    // Button section


    totalItems();
    totalCost();
    // console.log(orderIdArray);
    // console.log(orderItemIdArray);
    console.log(orderArray);

    // Increment the i = iteration loop
    i++;

    enableCheckOutButton();
};

function totalItems() {
    document.getElementById('totalItems').innerText = orderItemsArray.length;
    // console.log(orderArray.length)

}

function totalCost() {
    if (orderPriceArray.length === 0) {
        document.getElementById('totalCost').innerText = 0;
    } else {
        document.getElementById('totalCost').innerText = orderPriceArray.reduce(sumArray).toFixed(2);

        document.getElementById('amount').value = orderPriceArray.reduce(sumArray).toFixed(2);


        function sumArray(total, num) {
            return total + num;


        };


    }
}

function orderBasketClear() {
    let orderList = document.getElementById('orderList');
    document.getElementById('amount').value = 0;
    orderList.innerHTML = "";
    orderItemsArray.length = 0;
    orderPriceArray.length = 0;
    orderArray.length = 0;
    orderIdArray.length = 0;
    i = 0;
    totalItems();
    totalCost();

    enableCheckOutButton();

}

function deleteItem(orderID, button) {
    const indexNum = orderIdArray.indexOf(orderID);
    orderIdArray.splice(indexNum, 1);
    orderItemsArray.splice(indexNum, 1);
    orderPriceArray.splice(indexNum, 1);
    // console.log(orderPriceArray)
    // console.log(orderItemsArray)
    // console.log(orderIdArray)

    totalItems();
    totalCost();

    orderList.removeChild(button.parentElement);

    if (orderPriceArray.length === 0) {
        document.getElementById('amount').value = 0;
    }

    enableCheckOutButton();
    // console.log(button);
    // console.log(orderID);
    // console.log(indexNum);
    // console.log(orderIdArray);
};

function enableCheckOutButton() {
    const checkOutButton = document.getElementById('checkOutButton');
    checkOutButton.disabled = true;

    if (orderIdArray.length > 0) {
        checkOutButton.disabled = false;

    }
    if (orderIdArray.length == 0) {
        const backToMainTab = document.getElementById('pills-hotDrink-tab');
        const mainTab = new bootstrap.Tab(backToMainTab);

        mainTab.show();
    }
};

function goToCheckOutTab() {
    const firstTabEl = document.getElementById('pills-checkOut-tab');
    const firstTab = new bootstrap.Tab(firstTabEl);

    firstTab.show();

}


