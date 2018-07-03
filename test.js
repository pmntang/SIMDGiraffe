var myNewJSON=JSON.parse('{"head":{"name":"_mm_add_epi8", "operandBitCount": [128, 128], "resultBitCount": 128, "fieldOperandCount":[16, 16], "fieldResultCount": 16}, "operand":[ [3, 8, 9, 10, 6, 7, 8, 1, 8, 10, 17, 9, 5, 7, 23, 77 ],[11,2, 4, 76, 56,3, 26,12,11,32, 3,7,45, 9, 24, 87]], "LinkingIndex":[ [0,0],[1,1], [2,2], [3,3],  [4,4],  [5,5], [6,6], [7,7], [8,8], [9,9], [10,10],[11,11],[12,12], [13,13], [14,14], [15,15]], "result": []}');


//function to compute result on the fly
myNewJSON.computeResult=function(){
    var i;
        for (i=0; i<this.head.fieldResultCount; i++)
        this.result[i]=this.operand[0][i]+this.operand[1][i];
    
};
myNewJSON.computeResult();
//test and verify function computeResult
//console.log(myNewJSON);
//var variableToDisplay=myNewJSON.operand;
//variableToDisplay.push(myNewJSON.result);
//console.log(""+variableToDisplay[0][0]);

var canvas,ctx, w, h, testafichage="oui";
var eventctxAbscissa, eventctxOrdinate;

window.onload = function init() {
    // called AFTER the page has been loaded
    canvas = document.querySelector("#myCanvas");
  
    // will be use later
    w = canvas.width; 
    h = canvas.height;  
  
    // important, we will draw with this object
    ctx = canvas.getContext('2d');
   canvas.addEventListener('click', click);
  
  
    // create my objects
   variablesToDisplay=createVariablesToDisplay(myNewJSON);
     // ready to go !
    mainFunction();
   
    var exemple=createVariablesToDisplay(myNewJSON);
console.log(exemple[0].createMyObjects(), exemple[1].createMyObjects(), exemple[2].createMyObjects(), "un exemple");
};


/*function mainFunction(){
    ctx.clearRect(0, 0, w, h);
    displayAVariable(myObjects);
}

*/


function click (evt){
testafichage="qui"
  eventctxAbscissa=getMousePos(canvas, evt).x;
 eventctxOrdinate=getMousePos(canvas, evt).y;
    var firstAbscissa, secondAbscissa, firstOrdinate, secondOrdinate;
    testEventPosition(eventctxAbscissa, eventctxOrdinate, firstAbscissa, secondAbscissa, firstOrdinate, secondOrdinate);
  
}


//the two tests may not occur and the same level
function testEventPosition(evt, firstAbscissa, secondAbscissa, firstOrdinate, secondOrdinate){
  return  testPositionOrdinate(eventctxOrdinate, firstOrdinate, secondOrdinate)&&testPositionAbscissa(eventctxAbscissa, firstAbscissa, secondAbscissa);
  }

function testPositionOrdinate(eventctxOrdinate, firstOrdinate, secondOrdinate){
    if ((firstOrdinate-eventctxOrdinate)*(secondOrdinate-eventctxOrdinate)<=0)
        return true
    else
        return false
}

function testPositionAbscissa(eventctxAbscissa, firstAbscissa, secondAbscissa){
    if ((firstAbscissa-eventctxAbscissa)*(secondAbscissa-eventctxAbscissa)<=0)
        return true
    else
        return false
}



function getMousePos(canvas, evt) {
   // Here we take into account CSS boudaries
   var rect = canvas.getBoundingClientRect();
   return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
   };
}




function mainFunction(){
    ctx.clearRect(0, 0, w, h);
    displayVariables(variablesToDisplay);
    reactToEventsOfVariables(variablesToDisplay);
}

function createVariablesToDisplay(someJasonSpecification){
    var someVariablesToDisplay=[], m=someJasonSpecification.operand.length+1, widthOfVariable=w, heigthOfVariable=h/(2*m+1);
    for (var i=0; i<m; i++) {
                           var objectsTodisplay={//The values to display are those of the operands or the result, we just combine the set in a single array.
                                                 valuesToDisplay:i<m-1?someJasonSpecification.operand[i]:someJasonSpecification.result,
                                                 //this function returns an array consisting of two-field object arrays, the bandNumber objects that uniquely identify a tuples. We will need the linKingIndex.
                                                 constructBandNumber: function(){
                                                     
                                                 },
                                                 ordinate:i*heigthOfVariable+5*i,
                                                 //: We may add some global properties here, global to the variable and which should be propagated to objects.
                                                 createMyObjects: function (){
                                                                        var myObjects=[], n2=this.valuesToDisplay.length, widthOfObjects=(w/(n2+2));
                                                                        for (var j=0; j<n2; j++){
                                                                             var anObject={abscissa: j*widthOfObjects,
                                                                                           // ordinate:this.ordinate,It is a global property and common to all the objects of the variable, we go back in the variable., 
                                                                                           text:""+this.valuesToDisplay[j],
                                                                                           color:"#000000",
                                                                                           font:"8px Arial",
                                                                                           width:widthOfObjects,
                                                                                           height:heigthOfVariable,
                                                                                           react: function (){if (testPositionAbscissa(eventctxAbscissa, this.abscissa, this.abscissa+this.width)) this.color="red";
                                                                                               
                                                                                           }
                                                                                           //bangNumber:is an array of object with two fields (number, status)
                                                                                           
                                                                                           }

                                                                             myObjects.push(anObject);
                                                                        }

                                                                      return myObjects 

                                                                }
                                                    }
                           someVariablesToDisplay.push(objectsTodisplay);
                }
           
   
    return someVariablesToDisplay
}





function displayVariables(arrayOfObjects){
    arrayOfObjects.forEach(function(anObjectOfArray){
        ctx.save();
        ctx.translate(0, anObjectOfArray.ordinate);
        displayAVariable(anObjectOfArray);
        ctx.restore();
        
    });
}

function reactToEventsOfVariables(arrayOfObjects){
    arrayOfObjects.forEach(function(anObjectOfArray){
        reactToEventsOfAVariables(anObjectOfArray);
    });
}
/*
function createMyObjects (aVariable){
    var myObjects=[], n1=aVariable.length, widthOfObjects=(w/(n1+2)), heigthOfObjects=widthOfObjects;
    for (var i=0; i<n1; i++){
        var anObject={abscissa: i*widthOfObjects,
                      ordinate:aVariable.ordinate,
                      text:""+aVariable[i],
                      color:"#000000",
                      font:"8px Arial",
                      width:widthOfObjects,
                      height:heigthOfObjects
            
        }
    
        myObjects.push(anObject);
    }
    
  return myObjects  
 }
*/

function displayAVariable(anObjectOfArray) {
    anObjectOfArray.createMyObjects().forEach(function(anObject) {
      drawObject(anObject);
    });
}

function reactToEventsOfAVariables(anObjectOfArray) {
    anObjectOfArray.createMyObjects().forEach(function(anObject) {
      anObject.react();
    });
}


function drawObject(anObject){
    ctx.save();
    ctx.translate(anObject.abscissa, 0);
   // ctx.fillStyle = "rgba(255, 255, 255, 1)";
   // ctx.fillRect(0, 0, anObject.width, anObject.height);
    ctx.strokeRect(0, 0, anObject.width, anObject.height);
    ctx.font = anObject.font;
    ctx.fillStyle = anObject.color;
    ctx.fillText(anObject.text, 2, anObject.height*2/3);
    ctx.restore();
}


function reactToEventsOfObject(anObject){
  
}
/*
var unexemple=createMyObjects(variableToDisplay[0]);
console.log(unexemple[10].text);

let myNewData=JSON.parse('{"head":
	{"name":"_mm_add_epi8",
	 "operandBitCount": [128, 128],
	 "resultBitCount": 128,
	 "fieldOperandCount":[16, 16],
	 "fieldResultCount": 16
	},
 "operand":[ [3, 8, 9, 10, 6, 7, 8, 1, 8, 10, 17, 9, 5, 7, 23, 77 ],
			  
			 [11,2, 4, 76, 56,3, 26,12,11,32, 3,  7,45, 9, 24, 87 ]
			],
 "LinkingIndex":        [ [0,0],
						  [1,1],
						  [2,2],
						  [3,3],
						  [4,4],
						  [5,5],
						  [6,6],
						  [7,7],
						  [8,8],
						  [9,9],
						  [10,10],
						  [11,11],
						  [12,12],
						  [13,13],
						  [14,14],
						  [15,15],
						],
 "result": []
}')*/

function unefonction(){
     console.log(testafichage);
}
var SuperObjectModel={
    init:function (st1){
        this.mebre1=st1;
    },
    mebre1:"je 1",
    mbre2:"je suis le2",
    mbre3:{elt1:"je suis seul",
           elt2: function(arrayOfSuperObject){
               for(var i=0; i<arrayOfSuperObject.length; i++)
                   console.log(arrayOfSuperObject[i].mebre1);
           
          },
           elt3:unefonction(),
        
    }
}

var tab=[];
var SuperObjectModel1=Object.create(SuperObjectModel),SuperObjectModel2=Object.create(SuperObjectModel),SuperObjectModel3=Object.create(SuperObjectModel) ;
SuperObjectModel1.init("je suis le 1");
SuperObjectModel2.init("je suis le 2");
SuperObjectModel3.init("je suis le 3");

tab.push(SuperObjectModel1);
tab.push(SuperObjectModel2);
tab.push(SuperObjectModel3);

/*
function display(t){
    t.forEach(function displayelt (x) {console.log(x.mebre1);});
}


display(tab);
tab[0].mbre3.elt2(tab);
tab[0].mbre3.elt3;
*/