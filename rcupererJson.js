var myNewDataJSON = {"head":
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
};
console.log("affichage1");
console.log(myNewDataJSON);


var myNewData=JSON.stringify(myNewDataJSON);


console.log("affichage2");
console.log(myNewData);
myNewDataJSON.computeResullt=function computeResullt(){
    var i;
    for (i=0; i<this.fieldResultCount; i++)
        {
            this.result[i]=this.operand[0][i]+this.operand[1][i];
          return this.result;
        }
    
}

var myNewData1=myNewDataJSON;
var tab=[1, 8, 9];
console.log (tab);

console.log("affichage3");
console.log(myNewData1);

console.log("affichage4");
console.log(myNewDataJSON);

