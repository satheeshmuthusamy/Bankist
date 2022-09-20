'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-09-08T17:01:17.194Z',
    '2022-09-09T10:36:17.929Z',
    '2022-09-10T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN', // de-DE
  // username:`js`,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
  // username:`jd`,
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementsDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yesterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day=`${date.getDate()}`.padStart(2,0);
  // //  const date=now.getDate();
  // const month=`${date.getMonth()+1}`.padStart(2,0);
  // const year=date.getFullYear();
  // //  const hour=now.getHours();
  // //  const min=`${now.getMinutes()}`.padStart(2,0);
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: `currency`,
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(date, acc.locale);
    console.log(displayDate);

    const formatedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    console.log(accs);
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
      console.log(acc.username);
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////

/////setInterval
const startLogoutTimer=function(){
  const tick=function(){
    const min=String(Math.trunc(time/60)).padStart(2,0);
    const sec=String(time%60).padStart(2,0);
    
      //In each call print remaining time to UI
      labelTimer.textContent=`${min}:${sec}`;
    
      
      //time=0 secs stop timer and logout user
      if(time===0){
        clearInterval(timer);
        labelWelcome.textContent = `Log in to get started`;
        containerApp.style.opacity = 0;
      }
      //decrease 1 sec
      time--;
    
    }
  //set time to five mins
let time=120;

  //call the timer
  tick();
const timer=setInterval(tick,1000);

return timer;
   
}



// Event handlers
let currentAccount,timer;

//Fake login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

////Experimenting with the API
const now = new Date();
const options = {
  hour: `numeric`,
  minute: `numeric`,
  day: `numeric`,
  month: `long`, //long (or) 2-digit
  year: `numeric`,
  weekday: `long`, //sort or narrow
};


btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
    );
    console.log(currentAccount);
    
    if (currentAccount?.pin === +inputLoginPin.value) {
      // Display UI and message
      labelWelcome.textContent = `Welcome back, ${
        currentAccount.owner.split(' ')[0]
      }`;
      containerApp.style.opacity = 100;
      
      ///current date display after login
      const now = new Date();
      const day = `${now.getDay()}`.padStart(2, 0);
      const date = now.getDate();
      const month = `${now.getMonth() + 1}`.padStart(2, 0);
      const year = now.getFullYear();
      const hour = now.getHours();
      const min = `${now.getMinutes()}`.padStart(2, 0);
      
      labelDate.textContent = new Intl.DateTimeFormat(
        currentAccount.locale,
        options
      ).format(now); //locale string
      //`ar-SY`,`en-US`
      const locale = navigator.language;
      console.log(locale); //en-US
    labelDate.textContent = `${date}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //setTimeIntervel
    if(timer)clearInterval(timer);//to clear the previous timer to prevent time collapse
    timer=startLogoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //add transfer dates
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    //reset timer
    clearInterval(timer);
    timer=startLogoutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement

    setTimeout(function () {
      currentAccount.movements.push(amount);

      //adding loan dates
      currentAccount.movementsDates.push(new Date().toISOString());
      // Update UI
      updateUI(currentAccount);
        //reset timer
    clearInterval(timer);
    timer=startLogoutTimer();
    },2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
//all numbers are in floating point
// console.log(23===23.00);//true
// //base 10- 0 to 9
// //binary base 2 - 0 1
// console.log(0.1+0.2);//0.30000000000000004..error in js works this way
// console.log(0.1+0.2===0.3);//false

// ///convert string to number
// console.log(Number(`23`));//23
// console.log(+`23`);//23(another way)

// //parsing
// //removing units to calculate sums
// console.log(Number.parseInt(`23px`,10));//23// 10is for using base 10
// console.log(Number.parseFloat(`1.5mm`,10));//1.5
// //Number is namespace
// console.log(Number.parseInt(`1.5mm`,10));//1
// console.log(Number.parseFloat(`23px`,10));//23//parseFloat works for both correctly

// //NaN
// console.log(Number.isNaN(20));//false
// console.log(Number.isNaN(`20`));//false
// console.log(Number.isNaN(`+23x`));//true
// console.log(Number.isNaN(10/0));//false

// //isFinite
// console.log(Number.isFinite(20));//true
// console.log(Number.isFinite(`20`));//false
// console.log(Number.isFinite(10/0));//false

// //Interger
// console.log(Number.isInteger(10));//true
// console.log(Number.isInteger(`10`));//false

// //MATH AND ROUNDING
// //square root of a number
// console.log(Math.sqrt(10));//3.1622776601683795
// //cubic root of a number
// console.log(8**(1/3));//2

// console.log(Math.max(5,8,15));//15
// console.log(Math.max(5,`23`,8,15));//23 it has type coertion

// console.log(Math.min(5,8,9));//5

// console.log(Math.PI*Number.parseFloat(`10px`)**2);//314.1592653589793

//  console.log(Math.trunc (Math.random()*6)+1);//random number between 1-6

//  const randomInt=(min,max)=>Math.floor(Math.random()*(max-min)+1)+min;
//  // 0..1->0...(max-min)->min...max
//  console.log(randomInt(10,30));//random round number between 10 to 30

//  //rounding Integers
//  console.log(Math.trunc(23.3));//23
//  console.log(Math.trunc(23.9));//23
//  //trunc always rounds to the minimum nearest number
//  //instead we can use Math.round()
//  console.log(Math.round(22.9));//23
//  console.log(Math.round(23.5));//23

//  //ceil==>always rounds upto the maximum
//  console.log(Math.ceil(22.9));//23
//  console.log(Math.ceil(23.1));//24

//  //floor==>rounded down to minimum
//  console.log(Math.floor(22.9));//22
//  console.log(Math.floor(23.1));//23
//  //all methods do type coretion

//  //rounding decimals
//  console.log((2.7).toFixed(0));//3 ==>It laways return the string
//  console.log((2.7).toFixed(3));//2.700
//  console.log((2.345).toFixed(2));//2.35
//  console.log(+(2.345).toFixed(2));//2.35 number

// //reminder operator==>gives the reminder
// console.log(59%10);//9
// console.log(5%3);//2

// //to find odd or even numbers
// console.log(6%2===0?`even`:`odd`);//even
// const isEven=n=>n%2===0;
// isEven(8);//2
// isEven(33);//false
// isEven(81);//false

// labelBalance.addEventListener(`click`,function(){
// [...document.querySelectorAll(`.movements__row`)].forEach(function(row,i){
//   console.log(i);
// if(i%2===0)row.style.backgroundColor=`red`;
// if(i%3===0)row.style.backgroundColor=`orange`;
// })

// })

//Numeric seperators==>to imcludes comma

// const diameter=2_874_600_000;
// console.log(diameter);//2874600000==>it will not consider _
// //it is really helpful to understand the number for other developers

// const priceCents=345_445;
// console.log(priceCents);//345445

// const transferFee=1_500;//1500
// // const PI=3._1415;//error

// console.log(Number(`23000`));//23000
// console.log(Number(`23000_00`));//NaN==>it willnot work
//if you are fetching datas form api dont use this method

//PRIMITIVE DATA TYPE==>BIGINT=>ES2020
//in systems the numbers are internally stored in 64bits ==>(0s and 1s)
//64 1's or 0's==>only 53 buts are used in 0's and 1's all others are stored in bigint

// console.log(2**53-1)//9007199254740991
// console.log(Number.MAX_SAFE_INTEGER);//9007199254740991
// //maximun integer number that we can save in js

// //ES2020==>BigInt==>as large numbers
// console.log(88888888888882212n);//88888888888882212n
// //accurate numbers
// console.log(BigInt(50000001));//50000001n
// console.log(99999999999999n*4445445577777n);//444544557777695554554422223n
// const huge= 24555555555n;
// const num=23;
// console.log(huge*BigInt(num));//564777777765n
// console.log(2548n===2548);//false

// //string concatination
// console.log(huge +` is really big!`);//24555555555 is really big!

// //division
// console.log(10n/3n);//3n
// console.log((10/3).toFixed(4));//3.3333

////////////////

//Creating dates
// const now=new Date();//Sun Sep 11 2022 08:10:07 GMT+0530 (India Standard Time)
// console.log(now);

// console.log(new Date(`Sep 11 2022 08:10:07`));//Sun Sep 11 2022 08:10:07 GMT+0530 (India Standard Time)
// console.log(new Date(`September 11,2020`));//Fri Sep 11 2020 00:00:00 GMT+0530 (India Standard Time)
// console.log(new Date(account1.movementsDates[0]));//Tue Nov 19 2019 03:01:17 GMT+0530 (India Standard Time)
// console.log(new Date(2037,10,19,15,23,5));//Thu Nov 19 2037 15:23:05 GMT+0530 (India Standard Time)
//month is zero based

// console.log(new Date(2037,10,33));//Thu Dec 03 2037 00:00:00 GMT+0530 (India Standard Time)//auto correct

// console.log(new Date(0));//Thu Jan 01 1970 05:30:00 GMT+0530 (India Standard Time)
// //unix time
// console.log(new Date(3*24*60*60*1000));//converting time to milli seconds
//3 days later==>time stem
//Sun Jan 04 1970 05:30:00 GMT+0530 (India Standard Time)(exactly 3 days later)

//working with dates
//date have their own methods

// const future=new Date(2037,10,19,15,23);
// console.log(future);//Thu Nov 19 2037 15:23:00 GMT+0530 (India Standard Time)
// console.log(future.getFullYear());//2037
// console.log(future.getMonth());//10=>o based
// console.log(future.getDate());//19
// console.log(future.getDay());//4=>thursday =>0 based
// console.log(future.getHours());//15
// console.log(future.getMinutes());//23
// console.log(future.getSeconds());//0
// console.log(future.toISOString());//2037-11-19T09:53:00.000Z
// //time stamp
// console.log(future.getTime());//2142237180000==>in milli seconds from jan 1970

// console.log(new Date(2142237180000));//Thu Nov 19 2037 15:23:00 GMT+0530 (India Standard Time)
// //creating exact date and time with timestamp

// console.log(Date.now());//1662865221661

// future.setFullYear(2040);
// console.log(future);//Mon Nov 19 2040 15:23:00 GMT+0530 (India Standard Time)

//OPERATIONS WITH CALCULATIONS
// const future=new Date(2037,10,19,15,23);
// console.log(future);//Thu Nov 19 2037 15:23:00 GMT+0530 (India Standard Time)
// console.log(+future);//2142237180000==> in milli seconds

// const calcDaysPassed=((date1,date2)=>Math.abs(date2-date1)/(1000*60*60*24));
// //(1000*60*60*24)==>milli seconds to seconds==>1000milli seconds,60mins,seconds,24-hours

// calcDaysPassed((2022,10,20),(2024,12,30));
// console.log(calcDaysPassed(new Date(2022,10,20),new Date(2024,12,30)));//always use new Date() function to create new date//802 days

// console.log(calcDaysPassed(new Date(2022,10,20),new Date(2024,12,30,10,8)));//10mins 8 seconds//here use Math.round();

//////////////
//internalizing numbers
// const num=33569.8;

// const option={
//   style:`unit`,
//   unit:`mile-per-hour`,
//   currency:`EUR`
// }

// console.log(`US: ` ,new Intl.NumberFormat(`en-US`,option).format(num));
// //US:  33,569.8
// console.log(`IN: ` ,new Intl.NumberFormat(`en-IN`,option).format(num));//IN:  33,569.8
// console.log(`Navigator Language ` ,new Intl.NumberFormat(navigator.language,option).format(num));
//Navigator Language  33,569.8
//US:  33,569.8 mph
// script.js:532 IN:  33,569.8 mph
// script.js:533 Navigator Language  33,569.8 mph

//setTimeout and set Interval
//callback function only executed once
// const ingredients = [`olives`, `chicken`];
// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`here is your pizza with ${ing1} and ${ing2}`),
//   3000,
//   ...ingredients
// ); //after 3 seconds later
// console.log(`waiting`);

// if (ingredients.includes(`chicken`)) clearTimeout(pizzaTimer);
//if it contains chicken it will not be printed

//syntax=>setTimeout((function),time);
//here we are not calling the function
///asynchronous js is working behind

//setInterval
//call back happens every 1 seconds
// setInterval(function(){
//   const now=new Date();
  
//   console.log(`${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`.padStart(2,0));
// },1000)