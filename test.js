var myNewJSON=JSON.parse('{"head":{"name":"_mm_add_epi8", "operandBitCount": [128, 128], "resultBitCount": 128, "fieldOperandCount":[16, 16], "fieldResultCount": 16}, "operand":[ [3, 8, 9, 10, 6, 7, 8, 1, 8, 10, 17, 9, 5, 7, 23, 77 ],[11,2, 4, 76, 56,3, 26,12,11,32, 3,7,45, 9, 24, 87]], "LinkingIndex":[ [0,0],[1,1], [2,2], [3,3],  [4,4],  [5,5], [6,6], [7,7], [8,8], [9,9], [10,10],[11,11],[12,12], [13,13], [14,14], [15,15]], "result": []}');


//function to compute result on the fly
myNewJSON.computeResult=function(){
    var i;
        for (i=0; i<this.head.fieldResultCount; i++)
        this.result[i]=this.operand[0][i]+this.operand[1][i];
    
};
myNewJSON.computeResult();


var canvas,ctx, w, h;
var mousePosition, variablesToDisplay;

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
    // display my object
   ctx.clearRect(0, 0, w, h);
 
   displayVariables(variablesToDisplay);
    
};



function click (evt){
   
mousePosition=getMousePos(canvas, evt);
ctx.clearRect(0, 0, w, h);
variablesToDisplay=createVariablesToDisplay(myNewJSON);
reactToEventsOfVariables(variablesToDisplay);
  //   ctx.clearRect(0, 0, w, h);   
  
    console.log(mousePosition.x, mousePosition)
    }

function getMousePos(canvas, evt) {
   // Here we take into account CSS boudaries
   rect = canvas.getBoundingClientRect();
   return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
   };
}





function createVariablesToDisplay(someJasonSpecification){
    console.log("create var called");
    var someVariablesToDisplay=[], m=someJasonSpecification.operand.length+1, widthOfVariable=w, heigthOfVariable=h/(2*m+1);
    for (var i=0; i<m; i++) {
                           var objectsTodisplay={//The values to display are those of the operands or the result, we just combine the set in a single array.
                                                 valuesToDisplay:i<m-1?someJasonSpecification.operand[i]:someJasonSpecification.result,
                                                 //this function returns an array consisting of two-field object arrays, the bandNumber objects that uniquely identify a tuples. We will need the linKingIndex.
                                                 constructBandNumber: function(){
                                                     
                                                 },
                                                 ordinate:i*heigthOfVariable+5*i,
                                                 //: We may add some global properties here, global to the variable and which should be propagated to objects.
                                                 display: function () {
                                                                //ctx.clearRect(0, 0, w, h);
                                                                ctx.save();
                                                                ctx.translate(0, this.ordinate);
                                                                this.createMyObjects().forEach(function(everyObject){everyObject.drawn();})
                                                                ctx.restore();
                                                     console.log("a la variable ordonne" + (this.ordinate));
                                                 },
                                                react:function () {
                                                                ctx.save();
                                                                ctx.translate(0, this.ordinate);
                                                                this.createMyObjects().forEach(function(everyObject){everyObject.react();})
                                                                ctx.restore();

                                                },
                                                 createMyObjects: function (){
                                                                        var ordinateOfRect=this.ordinate;
                                                                        var myObjects=[], n2=this.valuesToDisplay.length, widthOfObjects=(w/(n2+2));
                                                                        for (var j=0; j<n2; j++){
                                                                             
                                                                             var anObject={abscissa: j*widthOfObjects,
                                                                                           ordinate: ordinateOfRect,
                                                                                           text:""+this.valuesToDisplay[j],
                                                                                           color:"#000000",
                                                                                           font:"8px Arial",
                                                                                           width:widthOfObjects,
                                                                                           height:heigthOfVariable,
                                                                                           position: function (){
                                                                                                      ctx.save();
                                                                                                      ctx.translate(this.abscissa, 0);
                                                                                           },
                                                                                           drawn: function (){
                                                                                                    this.position(),
                                                                                                   // ctx.fillStyle = "rgba(255, 255, 255, 1)";
                                                                                                   // ctx.fillRect(0, 0, anObject.width, anObject.height);
                                                                                                    ctx.clearRect(0, 0, this.width, this.height);
                                                                                                    ctx.strokeRect(0, 0, this.width, this.height);
                                                                                                    ctx.font = this.font;
                                                                                                    ctx.fillStyle = this.color;
                                                                                                    ctx.fillText(this.text, 2, this.height*2/3);
                                                                                                    ctx.restore();
                                                                                               
                                                                                           },
                                                                                           react: function () {
                                                                                                   if (((this.ordinate<=mousePosition.y)&&(this.ordinate+this.height>=mousePosition.y))&&((this.abscissa<=mousePosition.x)&&(this.abscissa+this.width>=mousePosition.x)))
                                                                                                        {      
                                                                                                           
                                                                                                           this.color="red";
                                                                                                           this.drawn();
                                                                                                        }
                                                                                                    else
                                                                                                         {   this.color="green";
                                                                                                            this.drawn();
                                                                                                          }
                                                                                               console.log("au rectangle ordonne"+(this.ordinate),"au rectangle ordonne souris"+mousePosition.y, "au rectangle abscisse" + (this.abscissa),  "au rectangle abscisse souris" + mousePosition.x, this.text);
                                                                                          
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





function displayVariables(arrayOfArrayOfObject){
    arrayOfArrayOfObject.forEach(function(anArrayOfobject){
anArrayOfobject.display();
    });
}

function reactToEventsOfVariables(arrayOfArrayOfObject){
    arrayOfArrayOfObject.forEach(function(anArrayOfobject){
anArrayOfobject.react();
    });
}
 
/*
function unefonction(){
     console.log(testafichage);
}
console.log(eventctxAbscissa);
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

function display(t){
    t.forEach(function displayelt (x) {console.log(x.mebre1);});
}


display(tab);
tab[0].mbre3.elt2(tab);
tab[0].mbre3.elt3;
*/