//x in the form
//side (side): (steps) (in/out) from (yardline)

//y in the form
//(steps) (behind/infront) (FSL/FH/BH/BSL)
function setFromXY(x, y) {
    //parse X
    var side = parseFloat(x.split("side")[1].split(":")[0].trim());
    var steps = parseFloat(x.split(":")[1].trim().split(" ")[0].trim());
    var direction = x.split("from")[0].split(":")[1].trim().split(" ")[1].trim();
    var reference = parseFloat(x.split("from")[1].trim());
    
    //get the reference as an X value in 8 to 5 steps
    var referenceX = ((50 - reference) * (8/5)) * (side == 1 ? -1 : 1);
    var actualX;
    
    //get the person's actual dot X coord
    if(side == 1) {
        if(direction == "in") {
            actualX = referenceX + steps;
        }
        else if (direction == "out") {
            actualX = referenceX - steps;
        }
    }
    else if(side == 2) {
        if (direction == "in") {
            actualX = referenceX - steps;
        }
        else if (direction == "out") {
            actualX = referenceX + steps;
        }
    }
    
    //parses Y
    var stepsY = parseFloat(y.split(" ")[0].trim());
    var directionY = y.split(" ")[1].trim();
    var referenceLine = y.split(" ")[2].trim();
    var referenceY = 0;
    
    //going off of http://ostma.org/images/pdf-files/layout-high-school-football.pdf
    //steps/hash = ((53+(4/12))/3)*(8/5) = 256/9 or 28.44444...
    switch(referenceLine) {
        case "FSL":
            referenceY = 0;
        break;
        case "FH":
            referenceY = (256/9);
        break;
        //I don't actually know anything past the FH
        case"BH":
            referenceY = (256/9)*2;
        break;
        case "BSL":
            referenceY = (256/9)*3;
        break;
    }
    
    var actualY;
    
    //get the actual Y coord
    if(directionY == "behind") {
        actualY = referenceY + stepsY;
    }
    else if (directionY == "infront") {
        actualY = referenceY - stepsY;
    }
    
    this.x = actualX;
    this.y = actualY;
};