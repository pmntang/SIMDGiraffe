/*var myNewJSON=JSON.parse('{"head":{"name":"_mm_add_epi8", "operandBitCount": [128, 128], "resultBitCount": 128, "fieldOperandCount":[16, 16], "fieldResultCount": 16}, "operand":[ [3, 8, 9, 10, 6, 7, 8, 1, 8, 10, 17, 9, 5, 7, 23, 77 ],[11,2, 4, 76, 56,3, 26,12,11,32, 3,7,45, 9, 24, 87]], "LinkingIndex":[ [[[0,1]],[[0,2]]],[[[1,1]],[[1,2]]],[[[2,1]],[[2,2]]],[[[3,1]],[[3,2]]], [[[4,1]],[[4,2]]],  [[[5,1]],[[5,2]]],  [[[6,1]],[[6,2]]], [[[7,1]],[[7,2]]], [[[8,1]],[[8,2]]], [[[9,1]],[[9,2]]], [[[10,1]],[[10,2]]], [[[11,1]],[[11,2]]],[[[12,1]],[[12,2]]],[[[13,1]],[[13,2]]], [[[14,1]],[[14,2]]], [[[15,1]],[[15,2]]]], "result": []}');
*/
var myNewJSON=JSON.parse('{"head":{"name":"_mm_add_epi8", "operandBitCount": [128], "resultBitCount": 128, "fieldOperandCount":[16], "fieldResultCount": 8}, "operand":[ [11,2, 4, 76, 56,3, 26,12,11,32, 3,7,45, 9, 24, 87]], "LinkingIndex":[ [[[0,1],[1,2]]],[[[2,1],[3,2]]],[[[4,1],[5,2]]],[[[6,1],[7,2]]],[[[8,1],[9,2]]],[[[10,1],[11,2]]],[[[12,1],[13,2]]],[[[14,1],[15,2]]]], "result": []}');

//function to compute result on the fly
myNewJSON.computeResult=function(){
    var i;
        for (i=0; i<this.head.fieldResultCount; i++)
        this.result[i]=this.operand[0][2*i]+this.operand[0][2*i+1];
    
};
/*

var myNewJSON=JSON.parse('{"head":{"name":"_mm_add_epi8", "operandBitCount": [128, 128], "resultBitCount": 128, "fieldOperandCount":[16, 16], "fieldResultCount": 16}, "operand":[ [3, 8, 9, 10, 6, 7, 8, 1, 8, 10, 17, 9, 5, 7, 23, 77 ],[11,2, 4, 76, 56,3, 26,12,11,32, 3,7,45, 9, 24, 87]], "LinkingIndex":[ [[[0,1]],[[0,2]]],[[[1,1]],[[1,2]]],[[[2,1]],[[2,2]]],[[[3,1]],[[3,2]]], [[[4,1]],[[4,2]]],  [[[5,1]],[[5,2]]],  [[[6,1]],[[6,2]]], [[[7,1]],[[7,2]]], [[[8,1]],[[8,2]]], [[[9,1]],[[9,2]]], [[[10,1]],[[10,2]]], [[[11,1]],[[11,2]]],[[[12,1]],[[12,2]]],[[[13,1]],[[13,2]]], [[[14,1]],[[14,2]]], [[[15,1]],[[15,2]]]], "result": []}');


//function to compute result on the fly
myNewJSON.computeResult=function(){
    var i;
        for (i=0; i<this.head.fieldResultCount; i++)
        this.result[i]=this.operand[0][i]+this.operand[1][i];
    
};*/


myNewJSON.computeResult();
myNewJSON.extractIndexRankContribution=function(){   var indexRankContribution=[];
                                                         for (var j=0; j<this.LinkingIndex.length; j++)
                                                             {
                                                                 var anIndexRankContribution=[];
                                                                 for (var i=0; i<this.operand.length; i++)
                                                                     {
                                                                         if(this.LinkingIndex[j][i].length===0) 
                                                                             {
                                                                                 continue;
                                                                             }
                                                                         else
                                                                             {
                                                                                 for(var k=0; k<this.LinkingIndex[j][i].length; k++)
                                                                                     {
                                                                                      anIndexRankContribution[this.LinkingIndex[j][i][k][1]-1]=this.LinkingIndex[j][i][k][0]
                                                                                     }
                                                                             }

                                                                     }
                                                                 indexRankContribution[j]=anIndexRankContribution;
                                                             }
                                                         return indexRankContribution
                                                              };
myNewJSON.constructBandNumber=function(){
                                                     var bandNumber=[]; 
                                                     for (var j=0; j<this.extractIndexRankContribution().length; j++)
                                                     {var n=j*Math.log(cribleHoare(this.extractIndexRankContribution()[j].length+1)[0]), aBandNumber={status: 0, value:0};
                                                         for (var i=0; i<this.extractIndexRankContribution()[j].length; i++)
                                                            { n+=this.extractIndexRankContribution()[j][i]*Math.log(cribleHoare(this.extractIndexRankContribution()[j].length+1)[i+1]);

                                                            }
                                                      
                                                      aBandNumber.status=false;
                                                      aBandNumber.value=n;
                                                      bandNumber.push(aBandNumber);
                                                     }
                                                     return bandNumber
                                                 };

myNewJSON.allocateBandNumber= function(){
var bandNumberAllocation=[];
for (var j=0; j<this.operand.length; j++)
    {
      var bandNumbersOfOperand=[];
        for(var i=0; i<this.operand[j].length; i++)
            {
                var  bandNumberOfField=[];
                for(var k=0; k<this.LinkingIndex.length; k++)
                    {

                                if (this.LinkingIndex[k][j].length===0)
                                    {
                                        continue;
                                    }
                                else
                                    {
                                        for (var l=0;l<this.LinkingIndex[k][j].length; l++)
                                            {
                                                if(this.LinkingIndex[k][j][l][0]===i)
                                                    {
                                                        bandNumberOfField.push(this.constructBandNumber()[k])
                                                    }
                                            }
                                    }

                    }
            bandNumbersOfOperand[i]=bandNumberOfField;
            }
    bandNumberAllocation[j]=bandNumbersOfOperand;
    }
return bandNumberAllocation
};


myNewJSON.extractIndexRankContribution();
myNewJSON.constructBandNumber();
myNewJSON.allocateBandNumber();


console.log(myNewJSON.constructBandNumber());
 console.log(myNewJSON.allocateBandNumber());
console.log(myNewJSON);

var  variablesToDisplay, w=800, h=800;

window.onload = function init() {

      // create my objects
   variablesToDisplay=createVariablesToDisplay(myNewJSON);
    // display my object
 
   displayVariables(variablesToDisplay);

  
};




function cribleHoare(i){
    var post=[2];
    if (i>=1)
        {
            for (var j=2;post.length<i; j++ )
             if(test(j, post)) post[post.length]=j;  
           
        }
    else
        post=[];
    
     return post;
}

function test (n, t){
    var ok;
    for (var i=0; i<t.length; i++)
    {ok=((n%t[i])===0)?false:true;
        if(!ok) break;
    }
    return ok;
        
}


function getLocationOrderByOrd (arrayOfRect){
    var rectBorder=[], x, y, width, height;
    for (var k=0; k<arrayOfRect.length; k++)
        {
         var  bottomPosition={absc:0, ord:0}, topPosition={absc:0, ord:0};
         x=parseFloat(arrayOfRect[k].getAttribute("x"));
         y=parseFloat(arrayOfRect[k].getAttribute("y"));
         width=parseFloat(arrayOfRect[k].getAttribute("width"));
         height=parseFloat(arrayOfRect[k].getAttribute("height"));
         bottomPosition.absc=x+width*0.5;
         bottomPosition.ord=y+height;
         topPosition.absc=bottomPosition.absc;
         topPosition.ord=y;
         rectBorder.push(bottomPosition);
         rectBorder.push(topPosition);
         }

     return rectBorder.sort(compare);
 }

       
function compare(a,b){
 return a.ord-b.ord;
}


function createVariablesToDisplay(someJasonSpecification){
    var someVariablesToDisplay=[], m=someJasonSpecification.operand.length+1, widthOfVariable=w, heigthOfVariable=h/(2*m+4);
    var ns="http://www.w3.org/2000/svg", style="fill:black;stroke:black;font-size:20px;font-weight:bold;";
    var displayzone=document.getElementById("display");
    var svg=document.createElementNS(ns,"svg");
    svg.setAttribute( "width", "800");
    svg.setAttribute( "height", "800"); 
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    displayzone.appendChild(svg);
    var global=document.createElementNS(ns, "g"); //I'd put the whole the graphics and text in this g svg's element
    global.setAttribute("id", "global");
    global.setAttribute("transform", "translate(0, 0)"); // this is a void instruction, did nothing;
    global.setAttribute("style", style); // I'shoul define the style to display and the event globaly
    svg.appendChild(global);
                                                

    
    for (var y=0; y<m; y++) {
                           var objectsTodisplay={//The values to display are those of the operands or the result, we just combine the set in a single array.
                                                 valuesToDisplay:y<m-1?someJasonSpecification.operand[y]:someJasonSpecification.result,
                                                 //this function returns an array consisting of two-field object arrays, the bandNumber objects that uniquely identify a tuples. We will need the linKingIndex.
                                                     
                               
                                                  bandNumberToallocate:y<m-1?someJasonSpecification.allocateBandNumber()[y]:someJasonSpecification.constructBandNumber(), 

                                                
                                                 ordinate:y*heigthOfVariable,
                                                 //: We may add some global properties here, global to the variable and which should be propagated to objects.


                                                 createMyObjects: function (){
                                                                        var ordinateOfRect=this.ordinate;
                                                                        var myObjects=[], n2=this.valuesToDisplay.length, widthOfObjects=((w+1)/(n2+1));
                                                                        for (var j=0; j<n2; j++){

                                                                             var anObject={bandNumber:this.bandNumberToallocate[j],
                                                                                          abscissa: j*widthOfObjects,
                                                                                           ordinate: 4*ordinateOfRect+4*y,
                                                                                           text:""+this.valuesToDisplay[j],
                                                                                           color:"#000000",
                                                                                           font:"9px Arial",
                                                                                           width:widthOfObjects,
                                                                                           height:heigthOfVariable,
                                                                                           textAtribut:style,
                                                                                       
                                                                                           };

                                                                                           
                                                                                           //bangNumber:is an array of object with two fields (number, status)
                                                                                 
                                                                                         

                                                                             myObjects.push(anObject)
                                                                        }

                                                                      return myObjects 

                                                                },
                                                  displayMyobject: function () {
                                                     
                                                      
                                                      
                                                      
                                                      for (var k=0; k<this.createMyObjects().length; k++)
                                                          {   var bandNumberValue="";
                                                           if (typeof(this.createMyObjects()[k].bandNumber.value)=="number")
                                                               {
                                                                   bandNumberValue=bandNumberValue+this.createMyObjects()[k].bandNumber.value;
                                                               }
                                                           else
                                                               {
                                                                   for (var u=0; u<this.createMyObjects()[k].bandNumber.length; u++)
                                                                       {
                                                                           bandNumberValue=bandNumberValue+this.createMyObjects()[k].bandNumber[u].value;
                                                                       }
                                                               }
                                                              var group=document.createElementNS(ns, "g");
                                                           
                                                              var id= bandNumberValue.replace(".","o");
                                                           var id="g"+id;
                                                              
                                                              
                                                              group.setAttribute("class", id);
                                                              
                                                              var rect=document.createElementNS(ns, "rect");
                                                              var idr="r"+id;
                                                              
                                                              rect.setAttribute("class", idr);
                                                              rect.setAttribute("x", ""+this.createMyObjects()[k].abscissa);
                                                              rect.setAttribute("y", ""+this.createMyObjects()[k].ordinate);
                                                              rect.setAttribute("width", ""+this.createMyObjects()[k].width);
                                                              rect.setAttribute("height", ""+this.createMyObjects()[k].height);
                                                              rect.setAttribute("fill", "white");
                                                              rect.setAttribute("style", "stroke: #000000; stroke-opacity:0.5");
                                                              
                                                              var text=document.createElementNS(ns, "text");
                                                              var idt="t"+id;
                                                             
                                                              text.setAttribute("class", idt);
                                                              text.setAttribute("x", ""+(this.createMyObjects()[k].abscissa+0.25*this.createMyObjects()[k].width));
                                                              text.setAttribute("y", ""+(this.createMyObjects()[k].ordinate+0.67*this.createMyObjects()[k].height));
                                                              text.setAttribute("style", ""+this.createMyObjects()[k].textAtribut)
                                                              //text.setAttribute("width", ""+this.createMyObjects()[k].width);
                                                              //text.setAttribute("height", ""+this.createMyObjects()[k].height);
                                                              text.textContent= "  " +this.createMyObjects()[k].text+" ";
                                                              svg.appendChild(group);
                                                              group.appendChild(rect);
                                                              group.appendChild(text);
                                                              
                                                              group.addEventListener("click", this.reactToEvent, true);
                                                              group.addEventListener("mouseover", this.reactToEvent, true);
                                                              group.addEventListener("dblclick", this.reactToEvent, true);
                                           
                                                          }
                                                  },
                                                 reactToEvent:function(t){

                                                     var evt=t.type, elt=t.target, parent=elt.parentNode;
                                                     var attrClassP= parent.getAttribute("class"), attrClass="*"+"["+"class"+"*"+"="+attrClassP+"]",   band=document.querySelectorAll(attrClass);
                                                     var  attrClassR="*"+"["+"class"+"*"+"="+"r"+"]", attrClassT="*"+"["+"class"+"*"+"="+"t"+"]",attrClassL="*"+"["+"class"+"*"+"="+"l"+"]", bandr=document.querySelectorAll(attrClassR), bandl=document.querySelectorAll(attrClassL),bandtext=document.querySelectorAll(attrClass+" "+"text"),bandLocation=document.querySelectorAll(attrClass+" "+"rect") ;
                                                     for (var p=0; p<bandr.length; p++)
                                                                     {
                                                                         bandr[p].setAttribute("fill", "white");
                                                                         bandr[p].setAttribute("style", "stroke: #000000; stroke-opacity:0.5");
                                                                     }
                                                     var lineToDrop=document.querySelectorAll("line");
                                                     while(lineToDrop.length){
                                                         global.removeChild(lineToDrop[lineToDrop.length-1]);
                                                         lineToDrop=document.querySelectorAll("line")
                                                         
                                                     }
                                                     var SelectedRect=getLocationOrderByOrd(bandLocation);
                                                     for (var e=0; (2*e+1)<SelectedRect.length-1; e++)
                                                         {   
                                                             var line=document.createElementNS(ns,"line"); 

                                                              line.setAttribute("x1",""+SelectedRect[2*e+1].absc);
                                                              line.setAttribute("y1",""+SelectedRect[2*e+1].ord);
                                                              line.setAttribute("x2",""+SelectedRect[2*e+2].absc);
                                                              line.setAttribute("y2",""+SelectedRect[2*e+2].ord);
                                                              line.setAttribute("style", "fill:#000000;stroke: #000000; stroke-opacity:0.8; stroke-width:1;")
                                                              line.setAttribute("class", attrClassP);
                                                              global.appendChild(line);
     
                                                         }
                                                     
                                                     switch(evt){
                                                         case "click":{

                                                                 for (var p=0; p<band.length; p++)
                                                                     {
                                                                         band[p].setAttribute("fill", "red");
                                                                         band[p].setAttribute("stroke", "red");
                                                                     }
                                                             }
                                                             break;
                                                        
                                                         case "mouseover":{

                                                                 for (var p=0; p<band.length; p++)
                                                                     {
                                                                         band[p].setAttribute("fill", "green");
                                                                         band[p].setAttribute("stroke", "green");
                                                                     }
                                                             }
                                                             break;
                                                             
                                                        
                                                         case "dblclick":{



                                                                 for (var p=0; p<band.length; p++)
                                                                     {
                                                                         band[p].setAttribute("fill", "purple");
                                                                         band[p].setAttribute("stroke", "purple");
                                                                     }
                                                             
                                                             for(var j=0; j<bandtext.length; j++)
                                                                 {
                                                                     var content=parseInt(bandtext[j].textContent, 10).toString(16);
                                                                     bandtext[j].textContent=""+content;
                                                                     bandtext[j].setAttribute("style", style);
                                                                 }
                                                             }
                                                             break;
                                                             
                                                    }
                                                    



                                                 }
                           }
                                                  
                           someVariablesToDisplay.push(objectsTodisplay);
        
                }
           
   
    return someVariablesToDisplay
}





function displayVariables(arrayOfArrayOfObject){
    arrayOfArrayOfObject.forEach(function(anArrayOfobject){
anArrayOfobject.displayMyobject();
    });
}

