

var test =[0,[1, [3,[7 ,[15], [16] ], [8 ,[17], [18]]], [4, [9 ,[19], [20]], [10, [21] ,[22]]]], [2, [5, [11, [23], [24]], [12, [25], [26]]], [6 ,[13, [27], [28]], [14, [29], [30]]]]];




var width=1000, heigth=1000, radius=20, firsTranslation="translate(0, 0)", x0=500, y0=25, pasx=120, pasy=35 ;
window.onload = function init() {

pictureTree(test, x0, y0, pasx, pasy);

  
};

        var ns="http://www.w3.org/2000/svg", style="fill:none;stroke:#000000;font-size:20px;font-weight:bold;";
        var displayzone=document.getElementById("display"), svg=document.createElementNS(ns,"svg");
      svg.setAttribute( "width", ""+width);
      svg.setAttribute( "height", ""+heigth); 
      svg.setAttribute("id", "svg");
      displayzone.appendChild(svg);
      var global=document.createElementNS(ns, "g");
      global.setAttribute("id", "global");
      global.setAttribute("transform", firsTranslation);
      global.setAttribute("style", style);
      svg.appendChild(global);
 


function pictureTree(ast, x, y, px, py){
    var l=ast.length;
    switch (l){
        case 1:drawnSvgCircle(x, y, radius, ast[0]);
            break;
        case 3:{
            drawnSvgCircle(x, y, radius, ast[0]);
            if (!(ast[1].length===0)){
                //drawnSvgCircle(x, y, radius, ast[1][0]);
                drawnSvgLine(x, y, x-2*px+radius/2, y+py);
                px=px*0.75
                pictureTree(ast[1],x-2*px, y+py, px, py);
            }
            if (!(ast[2].length===0)){
                //drawnSvgCircle(x, y, radius, ast[2][0]);
                drawnSvgLine(x, y, x+2*px-radius/2, y+py);
                px=px*0.75
                pictureTree(ast[2], x+2*px, y+py, px, py);
            }
        }
            
    }
}
        
  


function drawnSvgCircle(abs, ord, rad, root){
    var circle=document.createElementNS(ns, "circle");
    circle.setAttribute("cx", ""+abs);
    circle.setAttribute("cy", ""+ord);
    circle.setAttribute("r", ""+rad);
    var text=document.createElementNS(ns, "text");
    text.setAttribute("x", ""+abs);
    text.setAttribute("y", ""+ord);
    text.textContent=""+root;
    global.appendChild(circle);
    global.appendChild(text);
 
    
}

function drawnSvgLine(abs1, ord1, abs2, ord2){
    var line=document.createElementNS(ns,"line");
    line.setAttribute("x1",""+abs1);
    line.setAttribute("x2", ""+abs2);
    line.setAttribute("y1", ""+ord1);
    line.setAttribute("y2", ""+ord2);
    global.appendChild(line);
 
}