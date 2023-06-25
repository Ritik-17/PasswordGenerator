const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector(".uppercase");
const lowercaseCheck = document.querySelector(".lowercase");
const numbersCheck = document.querySelector(".numbers");
const symbolsCheck = document.querySelector(".symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '!@#$%^&*()_-+=[]{};:"<>,.?/';

let password = "";
let passwordlength = 10;
let checkcount = 0;
handleslider();
setIndicator("#ccc");


function handleslider(){
    inputSlider.value = passwordlength;
    lengthDisplay.innerText = passwordlength;
    // to change teh background as the scroller moves
    // we will handle the size of background image
    const min = inputSlider.min;
    const max = inputSlider.max;
    // backgroundsize controls width and height. width is calculated with below formula and height will be 100%
    inputSlider.style.backgroundSize = ((passwordlength-min)*100/(max-min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
    

}

function getRndInteger(min, max){
    return Math.floor(Math.random() * (max-min)) + min;
}

 function generateRndNumber(){
    return getRndInteger(0,9); 
}

 function generateLowercase(){
    return String.fromCharCode(getRndInteger(97, 122));
}

 function generateUppercase(){
    return String.fromCharCode(getRndInteger(65, 90));
}

 function generateSymbol(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function shufflePassword(array){
    // fisher Yates Method
    for (let i =array.length-1; i>0; i--){
        const j =Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str ="";
    array.forEach((el)=>(str+=el));
    return str;
}
 function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && hasSym && hasNum && passwordlength>=10) {
        setIndicator("#00ff7f");
    }
    else if ((hasLower||hasUpper)&&(hasNum||hasSym) && passwordlength>=10){
        setIndicator("#fefe33");
    }
    else{
        setIndicator("#ff0000");
    }
}



// navigator.clipboard.writeText() is used to copy element
// await is added so that we'll get to know if our promise is successful or not
// try -- if the prmise is resoove it'll display Copied msg if not that failed
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch{
        copyMsg.innerText= "Failed";
    }
    // to make CSS named active activated
    copyMsg.classList.add("active");
    // to remove after 2 sec
    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    },2000);    
}

function handleCheckBoxChange(){
    checkcount=0;
    allCheckBox.forEach( (checkbox)=>{
        if(checkbox.checked)
        checkcount++;
    });

    if(passwordlength < checkcount)
        passwordlength=checkcount;
        handleslider();
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handleCheckBoxChange);
})

// to connect slider with the password length
// handleslider is called because it'll connect password display aswell
inputSlider.addEventListener('input', (e)=>{
    passwordlength= e.target.value;
    handleslider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
     copyContent();
});

generateBtn.addEventListener('click', ()=>{
    if (checkcount == 0) return;

    if (passwordlength<checkcount) {
        passwordlength=checkcount;
        handleslider();
    }
    // to remove old password
    password="";

    let funcArr = [];

    if (uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if (lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }
    if (numbersCheck.checked){
        funcArr.push(generateRndNumber);
    }
    if (symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }
    // to add compulsory characters
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    
    // to add remaining characters to password
    for(let i=0; i<passwordlength-funcArr.length; i++){
        let randIndex = getRndInteger(0 , funcArr.length);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    // to shuffle password
    password = shufflePassword(Array.from(password));

    // to display in UI
    passwordDisplay.value = password;

    // calculate Strength
    calcStrength();
});
