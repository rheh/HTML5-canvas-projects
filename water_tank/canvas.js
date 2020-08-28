const cleanBtn = document.getElementById('clean-btn');
const removeCharcoalBtn = document.getElementById('remove-charcoal-btn');
const purityMarker = document.getElementById('purity-concentration-marker');
const infoBtn = document.getElementById('info-btn');
const info = document.querySelector('.info');
const charcoalMarker = document.getElementById('charcoal-concentration-marker');
const canvas  = document.querySelector('canvas');
const c = canvas.getContext('2d');

// check for devices smaller than 700px
if(innerWidth < 700){
    canvas.width = innerWidth-20;
    canvas.height = innerHeight*0.75;
}else{
    canvas.width = innerWidth-20;
    canvas.height = innerHeight*0.9;
}

//Gradient generator for canvas background
function gradientGenerator(){
    let my_gradient = c.createLinearGradient(0, 0, 0, 1500);
    my_gradient.addColorStop(0, "#0082c8");
    my_gradient.addColorStop(1, "white");
    c.fillStyle = my_gradient;
    c.fillRect(0, 0, canvas.width, canvas.height);
}

let colors = [
    '#fda403',
    '#e8751a',
    '#c51350',
    '#8a1253'
]

//initialize mouse object with undefined coordinates
let mouse = {
    x: undefined,
    y: undefined
}

//add event to start cleaning process
cleanBtn.addEventListener('click',() =>{
    startCleaningProcess();
})


//remove show-info class when click upon canvas
canvas.addEventListener('click',() =>{
    if(info.classList.contains('show-info')){
        info.classList.remove('show-info');
    }
})


//show info-box on click event
infoBtn.addEventListener('click',() =>{
    info.classList.toggle('show-info');
})

// keep track of screen size changes and fire up init() function each time so as molecules could be regenerated
addEventListener('resize',() =>{
    if(innerWidth < 600){
        canvas.width = innerWidth-20;
        canvas.height = innerHeight*0.75;
    }else{
        canvas.width = innerWidth-20;
        canvas.height = innerHeight*0.9;
    }

    init();
})


// mousedown event so as mouse object is updated with current mouse position and then becomes undefined on mouseup position
canvas.addEventListener('mousedown',(e) =>{
    mouse.x = e.x;
    mouse.y = e.y;

    //generate new impurity molecules on mouse down event anywhere on the canvas
    generateMolecules();
})

// mouseup event in affect
canvas.addEventListener('mouseup',(e) =>{
    mouse.x = undefined;
    mouse.y = undefined;
})

//utility function to generate a random integer between any 2 provided integers.
function randomIntFromRange(min,max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

//utility function to generate a random color from the colors array
function getRandomColors(){
  let k = Math.floor(Math.random()*colors.length);
  return colors[k];
}


// find the distance between 2 molecules or a molecule and the canvas walls
function collisionDist(x1,y1,x2,y2){
    let xDist = x2-x1;
    let yDist = y2-y1;

    return Math.sqrt(Math.pow(xDist,2)+Math.pow(yDist,2));
}

// utility function helpfull in rotating the x-y plane once newtonion theorem is applied in 1-D
function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function resolveInelasticCollision(particle, otherParticle){
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d inelastic collision equation
        const v1 = { x: (m1*u1.x + m2*u2.x )/ (m1+m2), y: u1.y };
        const v2 = { x: (m1*u1.x + m2*u2.x )/ (m1+m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal2.x;
        particle.velocity.y = vFinal2.y;

        otherParticle.velocity.x = vFinal1.x;
        otherParticle.velocity.y = vFinal1.y;
    }

}

// Apply newtonian theorem in 1-D so as elastic collision could be acheived. Energy throughout the system remains constant.
// Energy of initial particles(pure water molecules) changes when impurity/charcoal is induced. 
function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

// class responsible for drawing an updating water,impurity and charcoal molecules
class Molecule{
    constructor(x,y,velocity,radius,color){
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.mass = 2;
    }

    //The following function is responsible for drawing static water and impurity molecules
    draw(){
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI * 2,false);
        let my_gradient = c.createLinearGradient(0, 0, 0, 1500);
        my_gradient.addColorStop(0, this.color);
        my_gradient.addColorStop(1, "white");
        c.fillStyle = my_gradient;
        c.fill();
        c.closePath();
    }

    //The following function is responsible for drawing static charcoal balls only
    drawCharcoalBall(){
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI * 2,false);
        let my_gradient = c.createLinearGradient(0, 0, 0, 1500);
        my_gradient.addColorStop(0, this.color);
        my_gradient.addColorStop(1, "white");
        c.fillStyle = my_gradient;
        c.fill();
        c.strokeStyle = 'red';
        c.stroke();
        c.closePath();
    }

    //The following function updates water molecules/impurity molecules and hence provides movement to them in random directions
    update(){

        //check for collision with left-right canvas walls
        if(this.x+this.radius >= canvas.width || this.x-this.radius <= 0){
            this.velocity.x = -this.velocity.x;
        }

        //check for collision with top-bottom canvas walls
        if(this.y+this.radius >= canvas.height || this.y-this.radius <= 0){
            this.velocity.y = -this.velocity.y;
        }        

        // check for collision of water/impurity molecules with one another except themselves
        moleculeArray.forEach(molecule =>{
            if(this !== molecule){
                let collisionDistVal = collisionDist(this.x,this.y,molecule.x,molecule.y);
                if(collisionDistVal - (this.radius+molecule.radius) < 0){
                    resolveCollision(this,molecule);
                }
            }
        })        

        // increment velocity in x and y directions
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // draw the molecules at newly generated coordinates
        this.draw();
    }

    //The following function updates charcoal molecules and hence provides movement to them in random directions
    updateCharcoalBall(){

        //check for collision with left-right canvas walls
        if(this.x+this.radius >= canvas.width || this.x-this.radius <= 0){
            this.velocity.x = -this.velocity.x;
        }

        //check for collision with top-bottom canvas walls
        if(this.y+this.radius >= canvas.height || this.y-this.radius <= 0){
            this.velocity.y = -this.velocity.y;
        }        

        // check for collision of charcoal molecules with one another except themselves
        charcoalBallsArray.forEach((ball,index) =>{
            if(this !== ball){
                let collisionDistVal = collisionDist(this.x,this.y,ball.x,ball.y);
                if(collisionDistVal - (this.radius+ball.radius) < 0){
                    resolveCollision(this,ball);
                }
            }

            // check if index of molecule array is less than starting molecules than resolve the collision otherwise at all other indexes
            // impurity particles are present and thus when charcoal comes in contact with them, remove them from array
            // Charcoal molecules size increases on coming in contact with impurity molecules and after their radius becomes more than 20px
            // remove them from the charcoal-array 
            moleculeArray.forEach((molecule,i) =>{
                let collisionDistVal = collisionDist(this.x,this.y,molecule.x,molecule.y);
                if(collisionDistVal - (this.radius+molecule.radius) < 0){
                    if(i<startingMolecules){
                        resolveCollision(this,molecule)
                    }
                    else{
                        resolveInelasticCollision(this,molecule)
                        if(molecule.radius > 0 ){
                            molecule.radius -= 1;
                        }
                        else{
                        moleculeArray.splice(i,1);                                                                
                        }
                    }
                }
            })

        })  
        

        // remove charcoalballs slowly after all impurity molecules are removed
        if(moleculeArray.length == startingMolecules){
            if(this.radius > 0.05){
                this.radius -= 0.05;
            }
            else{
                charcoalBallsArray = [];
            }
        }
      
        // increment velocity of charcoal molecules in x and y directions
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // draw the charcoal molecules at newly generated coordinates
        this.drawCharcoalBall();
    }
}


let molecule;
let moleculeArray = [];
let charcoalBallsArray = [];
let startingMolecules;

let purityConcentrationValue = 0;
let charcoalConcentrationValue = 0;

// The following function is responsible for creating multiple new objects for Molecule class so as only water-molecules could be generated 
// on the start
function init(){
    //re-initialize the molecule array to an empty array so that water molecules do not increase so much when window is resized
    moleculeArray = [];
    startingMolecules = 30;
    for(i = 0;i < startingMolecules; i++){
        let radius = randomIntFromRange(5,20);
        let x = randomIntFromRange(radius , canvas.width - radius);
        let y = randomIntFromRange(radius , canvas.height - radius);
        let velocity = {
            x: Math.random(),
            y: Math.random() 
        }

        // check if water molecules are not generated together and hence prevent 2 molecules getting joined up
        if( i !== 0){
            for(let j=0; j < moleculeArray.length; j++){
                if(collisionDist(x,y,moleculeArray[j].x,moleculeArray[j].y) - radius - moleculeArray[j].radius < 0){
                    x = Math.random() * canvas.width;
                    y = Math.random() * canvas.height;

                    j = -1;
                }
            }
        }

        moleculeArray.push(new Molecule(x,y,velocity,radius,'blue'));
    }
}


// The generateMolecules() function generates objects for new impurity molecules when clicked on canvas anywhere
function generateMolecules(){
    for(i = 0;i < randomIntFromRange(1,5); i++){
        let radius = randomIntFromRange(5,20);

        let x = mouse.x;
        let y = mouse.y
        let velocity = {
            x: randomIntFromRange(-8,8),
            y: randomIntFromRange(-8,8) 
        }

        moleculeArray.push(new Molecule(x,y,velocity,radius,getRandomColors()));
    }
}


// Object for charcoal molecules are created when cleanBtn is clicked
function startCleaningProcess(){
    for(i = 0;i < 5; i++){
        let radius = 10;
        let genX = 50;
        let genY = 50;
        let velocity = {
            x: Math.random() * randomIntFromRange(3,8) ,
            y: Math.random() * randomIntFromRange(3,8)
        }
        charcoalBallsArray.push(new Molecule(genX,genY,velocity,radius,'#484848'));
    }
}

// Animation loop keeps the functions running at all time
function animate(){
    requestAnimationFrame(animate);
    gradientGenerator();

    moleculeArray.forEach(molecule =>{
        molecule.update();
    })

    charcoalBallsArray.forEach(ball =>{
        ball.updateCharcoalBall();
    })

    //insert concentration values in DOM. The more the value, higher is the concentration
    purityMarker.innerHTML = 'Impurity Concentration: ' + (moleculeArray.length - startingMolecules);
    charcoalMarker.innerHTML = 'Charcoal Concentration: ' + charcoalBallsArray.length;
}

gradientGenerator();
init();
animate();
