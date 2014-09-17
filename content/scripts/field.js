//Y reference points
//going off of http://ostma.org/images/pdf-files/layout-high-school-football.pdf
//steps/hash = ((53+(4/12))/3)*(8/5) = 256/9 or 28.44444...
var FSL = 0;
var FH = 256/9;
var BH = (256/9)*2;
var BSL = (256/9)*3;



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
    
    switch(referenceLine) {
        case "FSL":
            referenceY = FSL;
        break;
        case "FH":
            referenceY = FH;
        break;
        case "BH":
            referenceY = BH;
        break;
        case "BSL":
            referenceY = BSL;
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

//set should be an object with x and y properties
function prettifySet(set) {
    var x = set.x;
    var y = set.y;
    
    var referenceY = "FSL";
    if(set.y >= (FH / 2) && set.y <= ((FH + BH) / 2)) {
        referenceY = "FH";
        y = set.y - FH;
    }
    else if (set.y >= ((FH + BH) / 2) && set.y <= ((BH + BSL) / 2)) {
        referenceY = "BH";
        y = set.y - BH;
    }
    else if(set.y >= ((BH + BSL) / 2)) {
        referenceY = "BSL";
        y = set.y - BSL;
    }
    var prettyY = Math.abs(y) + " steps " + (y < 0 ? "in front" : "behind") + " of the " + referenceY;
    
    var referenceX = 0;
    var distanceFromX = 0;
    //get the X coord=
    for(i = -80; i <= 80; (i += 8)) {
        distanceFromX = Math.abs(Math.abs(set.x) - Math.abs(i));
        if(distanceFromX <= 4) {
            referenceX = i;
            break;
        }
    }
    
    var side = (i < 0) ? 1 : 2;
    var direction = "";
    
    if (x == referenceX) {
        direction = "on";
    }
    else if (side == 1) {
        if(x < referenceX) {
            direction = "outside";
        }
        else if (x > referenceX) {
            direction = "inside";
        }
    }
    else if (side == 2) {
        if(x < referenceX) {
            direction = "inside";
        }
        else if (x > referenceX) {
            direction = "outside";
        }
    }
    
    var yardLine = (50 - (Math.abs(referenceX) * (5/8)));
    
    var prettyX = "Side " + side + ": " + distanceFromX + " steps " + direction + " the " + yardLine;
    
    return { "prettyX": prettyX, "prettyY": prettyY };
}

setFromXY.prototype.findHalfSet = function(otherSet) {
    var halfX = (otherSet.x + this.x) / 2;
    var halfY = (otherSet.y + this.y) / 2;
    
    return { x: halfX, y: halfY };
}