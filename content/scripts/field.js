//Y reference points
//going off of http://ostma.org/images/pdf-files/layout-high-school-football.pdf
//steps/hash = ((53+(4/12))/3)*(8/5) = 256/9 or 28.44444...
var referencePoints = null;

var accurateReferencePoints = {
    "FSL": 0,
    "FH": 256 / 9,
    "BH": (256 / 9) * 2,
    "BSL": (256 / 9) * 3
};

var inaccurateReferencePoints = {
    "FSL": 0,
    "FH": 28,
    "BH": (28) * 2,
    "BSL": (28) * 3
};

function yardlineToSteps(side, yardline) {
    return ((50 - yardline) * (8 / 5)) * (side === 1 ? -1 : 1);
}

function Dot(x, y) {
    this.x = x;
    this.y = y;
};

Dot.prototype.getReferenceY = function () {
    //assumes FH - FSL === BH - FH, etc.

    switch (Math.floor(this.y / (referencePoints["FH"] / 2))) {
        case 0:
            return "FSL";
        case 1:
        case 2:
            return "FH";
        case 3:
        case 4:
            return "BH";
        case 5:
        case 6:
            return "BSL";
    }
};

Dot.prototype.prettify = function () {    
    var referenceY = this.getReferenceY();
    var y = this.y - referencePoints[referenceY];
    var prettyY = Math.abs(y) + " steps " + (y < 0 ? "in front of" : "behind") + " the " + referenceY;
    
    var referenceX = 0;
    var distanceFromX = 0;

    var absX = Math.abs(this.x);
    referenceX = Math.abs(Math.round(this.x / 8) * 8);
    distanceFromX = Math.abs(absX - referenceX);
    
    var side = (this.x < 0) ? 1 : 2;
    var direction = "";
    
    if (absX === referenceX) {
        direction = "on";
    }
    else {
        direction = absX < referenceX ? "inside" : "outside";
    }
    
    var yardLine = 50 - (referenceX * (5/8));
    
    var prettyX = "Side " + side + ": " + distanceFromX + " steps " + direction + " the " + yardLine;
    console.log(prettyY);
    return { x: prettyX, y: prettyY };
};

Dot.average = function (a, b) {
    return new Dot(((a.x + b.x) / 2), ((a.y + b.y) / 2));
};

Dot.difference = function (a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y
    }
}

var parseDot = function (x, y) {
    var dot = new Dot(0, 0);

    x = parseDot._parseX(x);
    y = parseDot._parseY(y);

    //get the person's actual dot X coord
    if (x.side === 1) {
        if (x.direction === "in") {
            dot.x = x.reference + x.steps;
        }
        else if (x.direction === "out") {
            dot.x = x.reference - x.steps;
        }
    }
    else if (x.side === 2) {
        if (x.direction === "in") {
            dot.x = x.reference - x.steps;
        }
        else if (x.direction === "out") {
            dot.x = x.reference + x.steps;
        }
    }

    y.direction = y.direction === "behind" ? +1 : -1;
    dot.y = y.reference + (y.direction * y.steps);

    return dot;
};

//S(1|2) (steps)(I|O)(yardline)
parseDot._parseX = function (x) {
    var direction = x.split(' ')[1].indexOf("I") === -1 ? "O" : "I";
    var side = parseInt(x[1]);
    return {
        side: side,
        direction: direction === "I" ? "in" : "out",
        steps: parseFloat(x.split(' ')[1].split(direction)[0]),
        reference: yardlineToSteps(side, parseInt(x.split(direction)[1].trim()))
    };
};

//(steps)(IFO/B)(FH|FSL|etc)
parseDot._parseY = function (y) {
    var referenceLine = y.substring(y.match(/^(\d|\.)*(B|IFO)/)[0].length, y.length);

    return {
        steps: parseFloat(y.match(/^(\d|\.)*/)),
        direction: /^(\d|\.)*B/.test(y) ? "behind" : "in front of",
        reference: referencePoints[referenceLine]
    };
};