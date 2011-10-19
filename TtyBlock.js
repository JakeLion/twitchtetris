
function TtyBlock (divName, numLines) {
    var i;

    this.elem = document.getElementById(divName);

    // slow scorlling effect variables
    this.curPos = 0;
    this.cursorShown = false;
    
    this.timePassedType = 0;
    this.timePassedFlash = 0;
    
    // time in ms
    this.typePeriod = 30;
    this.flashPeriod = 300;

    this.lines = []
    for (i = 0; i < numLines; i += 1) {
	this.lines.push("");
    }
    
    this.backlog = [];
}


/**
   updates the text block
 */
TtyBlock.prototype.draw = function (dTime) {
    var i,
    outputString = "",
    lastLine;

    this.timePassedType += dTime;
    this.timePassedFlash += dTime;
    
    while (this.timePassedType > this.typePeriod) {
	this.curPos += 1;
	this.timePassedType -= this.typePeriod;
    }

    while (this.timePassedFlash > this.flashPeriod) {
	this.cursorShown = !this.cursorShown;
	this.timePassedFlash -= this.flashPeriod;
    }

    lastLine = this.lines[this.lines.length-1];
    // if I'm past the end of the last line, and there is a backlog, shift all the lines
    if (this.curPos > lastLine.length && this.backlog.length > 0) {
	this.lines.shift();
	lastLine = this.backlog.shift()
	this.lines.push(lastLine);
	this.curPos = 0;
    }

    // print all of the lines but the last one
    for (i = 0; i < this.lines.length - 1; i += 1) {
	outputString += this.lines[i] + "<br/>";
    }
    outputString += lastLine.slice(0, Math.min(this.curPos, lastLine.length));
    if (this.cursorShown) {
	outputString += "_";
    }
    // rewirte for html gaurds
    outputString.replace('>', '&gt');
    this.elem.innerHTML = outputString;
}

TtyBlock.prototype.addLine = function(str) {
    this.backlog.push("> " + str);
}