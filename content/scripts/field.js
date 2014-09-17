//x in the form
//side (side): (steps) (in/out) from (yardline)
function setFromXY(x, y) {
    var side = parseFloat(x.split("side")[1].split(":")[0].trim());
    var steps = parseFloat(x.split(":")[1].trim().split(" ")[0].trim());
    var direction = x.split("from")[0].split(":")[1].trim().split(" ")[1].trim();
    var reference = parseFloat(x.split("from")[1].trim());
    
    //get the reference as an X value in steps
    var referenceX = ((50 - reference) * 8) * (side == 1 ? -1 : 1);
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
    
    
}