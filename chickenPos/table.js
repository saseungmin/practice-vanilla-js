const tableList = document.querySelector(".js-tableList"),
        tableItem=tableList.querySelector("div"),
        menuList = document.querySelector(".js-menu"),
        chooseMenu = document.querySelector(".js-selectmenu"),
        orderTotalPrice = document.querySelector(".js-totalPrice"),
        submitOrder = document.querySelector(".js-order"),
        count = document.getElementsByClassName("js-count"),
        paymentmain = document.querySelector(".js-payment"),
        radioBox = document.getElementsByName("choose_pay"),
        paymentButton = document.querySelector(".js-paymentButton");

const menu = [
    {id : 1, name : '후라이드', price : 16000, category : 'chicken'},
    {id : 2, name : '양념치킨', price : 16000, category : 'chicken'},
    {id : 3, name : '반반치킨', price : 16000, category : 'chicken'},
    {id : 4, name : '통구이', price : 16000, category : 'chicken'},
    {id : 5, name : '간장치킨', price : 17000, category : 'chicken'},
    {id : 6, name : '순살치킨', price : 17000, category : 'chicken'},
    {id : 7, name : '콜라', price : 1000, category : 'drink'},
    {id : 8, name : '사이다', price : 1000, category : 'drink'},
]
const paytage = `<label><input type="radio" value="cash" name="choose_pay" checked> 현금 </label>
                    <label><input type="radio" name="choose_pay" value="card"> 신용카드 </label>
                    <button class="js-paymentButton">결제</button>`;

const TABLE_COUNT = 10,
        SELECT_TABLE = "selecting",
        SHOWING_MENU = "showing",
        PAYMENT_MENU = "paying",
        salePayment = 0.05;

let selectedMenu = [],
    choosePrice = [],
    currentTableNum = 0,
    prev = null;
function selectedTable(number){

    selectedMenu.push({
        number,
        totalPrice : null,
    })
    console.log(selectedMenu);
}

function payment(tableNumber){
    const mypay= selectedMenu.find(val => val.number === tableNumber);
    const cash = mypay.totalPrice - (mypay.totalPrice * salePayment);
    paymentmain.innerHTML = `<span class="js-dopay"> 결제하기 : ${cash}원</span> ${paytage}`;
    const doPay = document.querySelector(".js-dopay");
    for(let i =0; i<radioBox.length; i++){
        radioBox[i].addEventListener('change',function() {
            if (this !== prev) {
                prev = this;
            }
            console.log(this.value);
            if(this.value === 'cash'){
                const cash = mypay.totalPrice - (mypay.totalPrice * salePayment);
                doPay.innerText = `결제하기 : ${cash}원 `;
            }else{
                doPay.innerText = `결제하기 : ${mypay.totalPrice}원`;
            }
        });
    }
}


function handlePaySubmit(tableNumber){

}
function getTable(e){
    const tableNumber = e.target.id;
    if(e.target.classList.contains(SELECT_TABLE)){
        const checkOrder = selectedMenu.findIndex(val => val.number === tableNumber && val.totalPrice === null);
        if(checkOrder !== -1){
            alert("주문 등록을 해주세요.")
        }else{
            e.target.classList.remove(SELECT_TABLE);
            e.target.classList.add(PAYMENT_MENU);
            paymentmain.style.display = "inline-block";
            payment(tableNumber);
            paymentButton.addEventListener("click",handlePaySubmit(tableNumber));
        }
    }else{
        currentTableNum = tableNumber;
        console.log(currentTableNum);
        alert(`${tableNumber}번 테이블을 선택하셨습니다.`);
        e.target.classList.add(SELECT_TABLE);
        menuList.classList.add(SHOWING_MENU);
        selectedTable(tableNumber);
    }

}

function createTableList (){
    for(let i = 1; i<TABLE_COUNT; i++){
        const tableDiv = document.createElement("div");
        const priceDiv = document.createElement("div");
        priceDiv.className = 'table-price';
        tableDiv.className = 'grid-item';
        tableDiv.id = `table${i}`;
        tableDiv.innerText = `table${i}`;
        tableDiv.addEventListener("click",getTable);
        tableDiv.appendChild(priceDiv);
        tableList.appendChild(tableDiv);
    }
}

function chooseTotalPrice(price,id){
    if(choosePrice.length > 0){
        const index = choosePrice.findIndex(val => val.id === id);
        if(index !== -1){
            choosePrice[index].price = price;
        }else{
            choosePrice.push({id,price});
        }
    }else{
        choosePrice.push({id , price});
    }
}
function orderPrice(){
    let orderAllPrice = 0;
    for(let i =0; i<choosePrice.length; i++){
        orderAllPrice += choosePrice[i].price;
    }
    console.log(orderAllPrice);
    return orderAllPrice;
}

function quantity(e){
    const bro = e.target.nextSibling;
    const quantity = e.target.valueAsNumber;
    const span = e.target.parentNode.parentNode;
    const id = span.id.slice(6);
    const choose = menu.find(val => val.id === parseInt(id));
    const totalPrice = choose.price * quantity - ( choose.category === "chicken"? Math.floor(quantity/10) * 10000 : 0 );
    chooseTotalPrice(totalPrice,id);
    bro.innerText = ` ${totalPrice}원`;
    orderTotalPrice.value = orderPrice();
}

function selectMenu(choose){
    const menuSelect = document.createElement("div");
    const span = document.createElement("span");
    const spanPrice = document.createElement("span");
    const input = document.createElement("input");
    input.type = 'number';
    input.min = '1';
    input.max = '99';
    input.className = 'js-count';
    input.addEventListener('change',quantity);
    spanPrice.className = 'js-price';
    span.innerText = `${choose.category === 'chicken' ? '[치킨]' : '[음료]'} ${choose.name} - 수량 : `;
    span.appendChild(input);
    span.appendChild(spanPrice);
    menuSelect.appendChild(span);
    menuSelect.id = `choose${choose.id}`;
    chooseMenu.appendChild(menuSelect);
}



function checkboxCheck(e){
    const target = e.target;
    if(target.checked){
        const choose = menu.find(val => val.id === parseInt(target.parentNode.id));
        if(choose !== null){
            selectMenu(choose);
        }else{
            alert("없는 메뉴입니다.");
        }
    }else{
        const id = document.getElementById(`choose${target.parentNode.id}`);
        chooseMenu.removeChild(id);
        console.log(parseInt(target.parentNode.id));
        const newchoosePrice = choosePrice.filter(val => val.id !== target.parentNode.id);
        choosePrice = newchoosePrice;
        orderTotalPrice.value = orderPrice();
    }
}

function createMenuList() {

    for(let i = 0; i< menu.length; i++){
        
        const li = document.createElement("li");
        const check = document.createElement("input");
        const span = document.createElement("span");
        check.type = 'checkbox';
        check.addEventListener('change',checkboxCheck)
        li.id = menu[i].id;
        span.innerText = `${menu[i].category === 'chicken' ? '치킨' : '음료'} ${menu[i].name} : ${menu[i].price}원`;
        li.appendChild(span);
        li.appendChild(check);
        menuList.appendChild(li);
    }
    
}

function getPrice(){
    
    if(selectedMenu.length > 0){
        selectedMenu.forEach(element => {
            if(element.totalPrice !== null){
                const tableNum = document.getElementById(element.number);
                tableNum.children[0].innerText = `가격 : ${element.totalPrice}원`;
            }else{
                alert("주문한 내역이 없습니다.");
            }
        });
    }else{
        alert("결제할 테이블 내역이 없습니다.");
    }

}

function noneChecked(){
    for(let i =0; i<menuList.children.length; i++){
        const toggle = menuList.children[i].getElementsByTagName('INPUT');
        toggle[0].checked = false;
    }
}

function handleSubmit(){
    if(orderTotalPrice.value == null || orderTotalPrice.value == 0 ){
        alert("메뉴를 선택해주세요.")
    }else{
        const nownum = selectedMenu.findIndex(val => val.number === currentTableNum);
        if(nownum !== -1){
            console.log(selectedMenu);
            selectedMenu[nownum].totalPrice = parseInt(orderTotalPrice.value);
            orderTotalPrice.value = "";
            noneChecked();
            menuList.classList.remove(SHOWING_MENU);
            choosePrice = [];
            for(let i = 0; i<chooseMenu.children.length; i++){
                if(chooseMenu.children[i].tagName === "DIV"){
                    chooseMenu.children[i].remove();
                    i--;
                }
            }
            getPrice();
        }else{
            alert("테이블을 선택해주세요.");
        }
    }
}

function init() {
    createTableList();
    createMenuList();
    submitOrder.addEventListener("click",handleSubmit);
}

init();