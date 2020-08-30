const rangeSlider = document.getElementById('range-slider');
const skeletonLines = document.getElementById('skeleton-lines');
const skeletonLinesInput = document.getElementById('skeleton-lines-input');
const circleLineIntersections = document.getElementById('circle-line-intersections');
const circleLineIntersectionsInput = document.getElementById('circle-line-intersections-input');
const displayLineIntersectionAngle = document.getElementById('display-line-intersection-angle');
const rangeSliderInput = document.getElementById('angle');

let showskeletonLinesBool = false;
let showcircleLineIntersectionsBool = false;


const canvas  = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.height = innerHeight - 20;
canvas.width = innerWidth - 20;



// console.log(skeletonLinesInput.checked)
// console.log(circleLineIntersectionsInput.checked)


skeletonLinesInput.oninput = () =>{
    if(skeletonLinesInput.checked){
        showskeletonLinesBool = true;
    }
    else{
        showskeletonLinesBool = false;
    }
}


circleLineIntersectionsInput.oninput = () =>{
    if(circleLineIntersectionsInput.checked){
        showcircleLineIntersectionsBool = true;
    }
    else{
        showcircleLineIntersectionsBool = false;
    }
}


let divisionAngle = new Number(rangeSliderInput.value);
displayLineIntersectionAngle.innerHTML = divisionAngle + ' deg';

rangeSlider.oninput = () =>{
    divisionAngle = new Number(rangeSliderInput.value);
    displayLineIntersectionAngle.innerHTML = divisionAngle+ ' deg';

}



addEventListener('resize',()=>{
    canvas.height = innerHeight - 20;
    canvas.width = innerWidth - 20;  
    init();
})

let colors = [
    "#ffd8a6",
    "#fc8210",
    "#ff427f",
    "#007892",
    "#ffe0f7",
    "#fe91ca",
    "#d3dbff",
    "#251f44"
]


let mouse = {
    posX : canvas.width/2,
    posY : canvas.height/2 
}

let scrollRadius = {
    radiusIncrement: 0 
}

// let randomIndexes = colors.map((c,i) =>{
//     return Math.floor(Math.random()*i)
// })

// console.log(randomIndexes)


class Circle{
    constructor(circle,color){
        this.circleOrigin = circle.origin;
        this.circleRadius = circle.radius;
        this.color = color;
    }

    draw() {
        c.beginPath();
        c.arc(this.circleOrigin.x,this.circleOrigin.y,this.circleRadius,0,Math.PI*2,false);
        // let index = Math.floor(Math.random() * 10);
        // let color= colors[index];
        c.strokeStyle = this.color;        
        c.stroke();
        c.closePath();

        for(let i = 0 ; i <= 360 ;i = i+divisionAngle){
            c.moveTo(auxilliaryCircle.origin.x ,auxilliaryCircle.origin.y);
            let newX = Math.cos(i*Math.PI/180)*(2*container.radius)+auxilliaryCircle.origin.x;
            let newY = Math.sin(i*Math.PI/180)*(2*container.radius)+auxilliaryCircle.origin.y;
    
            if(showskeletonLinesBool){
                c.lineTo( newX, newY);
                c.stroke();
                c.strokeStyle = 'grey';
            }
    
            let containerTemp = new Point2D(container.origin.x, container.origin.y);
            let containerTempradius = container.radius;

    
            let circleTemp2 = new Point2D(auxilliaryCircle.origin.x, auxilliaryCircle.origin.y);
            let circleTemp2radius = auxilliaryCircle.radius;
    
            let point1 = new Point2D(auxilliaryCircle.origin.x, auxilliaryCircle.origin.y);
            let point2 = new Point2D(newX, newY);
    
            let intersectionTemp = Intersection.intersectCircleLine(containerTemp, containerTempradius, point1, point2);
            let intersectionTemp2 = Intersection.intersectCircleLine(circleTemp2, circleTemp2radius, point1, point2);

            let X2 = intersectionTemp2.points[0].x;
            let Y2 = intersectionTemp2.points[0].y;

            let X3,Y3;

            if(intersectionTemp.points[0] == undefined){
                mouse.posX = canvas.width/2;
                mouse.posY = canvas.height/2;
                init();
            }
            else{
                X3 = intersectionTemp.points[0].x;
                Y3 = intersectionTemp.points[0].y;
            }
    
            let dist = Math.sqrt(Math.pow(X3-X2,2) + Math.pow(Y3-Y2,2));
            let generatedCirclesRadius = dist;

            if(showcircleLineIntersectionsBool){
                c.beginPath();
                c.arc(X3,Y3,5,0,Math.PI*2,false);
                c.stroke();
                c.strokeStyle = "red";
                c.fill();
                c.fillStyle = "pink"
                c.closePath();
    
                c.beginPath();
                c.arc(X2,Y2,5,0,Math.PI*2,false);
                c.stroke();
                c.strokeStyle = this.color;
                c.fill();
                c.fillStyle = "blue"
                c.closePath();
            }
    
    
            c.beginPath();
            c.arc(X2,Y2,generatedCirclesRadius,0,Math.PI*2,false);
            c.stroke();
            c.strokeStyle = this.color;
            c.closePath();
    
        }
    }

    update(){
        this.circleOrigin.x = mouse.posX;
        this.circleOrigin.y = mouse.posY;
        this.circleRadius = circle1.radius;
        this.draw();
    }

    updateAuxiliary(){
        this.circleOrigin.x = (mouse.posX + container.origin.x)/2;
        this.circleOrigin.y = (mouse.posY + container.origin.y)/2;
        this.draw();
    }
}

let container;
let circle1;
let auxilliaryCircle;
let color = '#585858';


function init(){

    container = {
        radius: canvas.height/2.1 > 0 ? canvas.height/2.1 : -canvas.height/2.1,
        origin:{
            x:canvas.width/2,
            y:canvas.height/2   
        }
    }

    circle1 = {
        origin:{
            x: mouse.posX,
            y: mouse.posY
        },
        radius: 2*container.radius / 3 + scrollRadius.radiusIncrement > 0 ? 2*container.radius / 3 + scrollRadius.radiusIncrement : -(2*container.radius / 3 + scrollRadius.radiusIncrement)
    }

    auxilliaryCircle = {
        origin:{
            x:(mouse.posX + container.origin.x)/2,
            y:(mouse.posY + container.origin.y)/2
        },
        radius: circle1.radius + (container.radius - circle1.radius)/2 > 0 ? circle1.radius + (container.radius - circle1.radius)/2 : -(circle1.radius + (container.radius - circle1.radius)/2)
    }
   
}

canvas.addEventListener('mousemove',(e) =>{
    mouse.posX = e.x;
    mouse.posY = e.y;
})

canvas.addEventListener('wheel',(e) =>{
    scrollRadius.radiusIncrement += e.deltaY*0.05;
    init();
})

colors.forEach

function animate(){

    c.clearRect(0,0, canvas.width,canvas.height)

    requestAnimationFrame(animate);
    let containerObj = new Circle(container,color);
    containerObj.draw();
    let auxilliaryCircleObj = new Circle(auxilliaryCircle,color);
    auxilliaryCircleObj.updateAuxiliary();
    let circle1Obj = new Circle(circle1,color);
    circle1Obj.update();

}


init();
animate();

