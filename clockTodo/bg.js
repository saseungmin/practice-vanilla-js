const body = document.querySelector("body");


const IMG_NUMBER = 3;

// function handleImgLoad() {
//     console.log("fin");
    
// }


function paintImage(imgNum){
    const image = new Image();
    image.src = `image/${imgNum + 1}.jpg`;
    //image.addEventListener("loadend",handleImgLoad)
    image.classList.add('bgImage');
    //body.prepend(image);
    body.appendChild(image);


}


function getRandom(){
    const number =  Math.floor(Math.random() * IMG_NUMBER);
    return number;
}

function init(){
    const randonNumber = getRandom();
    paintImage(randonNumber);
}

init();