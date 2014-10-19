"use strict";
(function (global) {

  // list of available functions
	var functions = [ "abs", "acos", "arg", "asin", "atan", "conj", "cos", "cosh", "exp", "imag", "log", "neg", "pow", "real", "sin", "sinh", "sqrt", "tan", "tanh" ];
	// list of available operators
	var operators = "+-*/";
	// separator of arguments
	var separator = ",";
	// imaginary symbol
	//private final String IMAGINARY = "I";


  function isFunction(item) {
    return functions.indexOf(item) != -1 ? true : false;
  }
  
  function isNumber(item) {
    return !isNaN(parseFloat(item)) && isFinite(item);
  }
  
  function isSeparator(item) {
    return separator.indexOf(item) != -1 ? true : false;
  }
  
  function isOpenBracket(item) {
    return item == "(";
  }
  
  function isCloseBracket(item) {
    return item == ")";
  }
  
  function isOperator(item) {
    return operators.indexOf(item) != -1 ? true : false;
  }
  
  function getPrecednce(item) {//todo: add support for ^
    if (item == "+" || item == "-") {
      return 1;
    }
    return 2;
  }
  
  function tokenize(str) {
    str = str.split('');
    for (var i = 0; i < str.length; i++) {
      var numFlag = isNumber(str[i]) && isNumber(str[i+1]);
      var strFlag = /[A-z]/.test(str[i])  && /[A-z]/.test(str[i+1]);
      if (numFlag || strFlag) {
        str[i] = str[i] + str[i+1];
        str.splice(i+1, 1);
        i--;
      }
    }
    return str;
    //console.log(str.split(/[+-\*\\/]/));
    //console.log(str.split(/[+-*\/]/));
  }
  
  function prepareString(str) {
    str = str.replace(/ /g, "");
    str = str.replace(/\(-/g, "(0-");
    str = str.replace(/,-/g, ",0-");
    if(str.charAt(0) == "-") {
      str = "0" + str;
    }
    return str;
  }

  function str2Expr() {
    this.name = "test";
  }
  
  
  
  str2Expr.prototype = (function () {
    // private member
    var browser = "Mobile Webkit";
    
    var stackOperations = [];
    var stackNumbers = [];
    // public prototype members
    return {
      getBrowser: function () {
        return browser;
      },
      
      parse: function(str) {
        str = str || "2+45+728*7+30-98+3+(-4)*88";
        console.log(str);
        str = prepareString(str);
        str = tokenize(str);
        console.log(str);

        
        for (var i = 0; i < str.length; i++) {
          var item = str[i];
          if(isSeparator(item)) {
            
          } else if (isOpenBracket(item)) {
            stackOperations.push(item);
          } else if (isCloseBracket(item)) {
            while(stackOperations.length != 0 && !isOpenBracket(stackOperations[stackOperations.length-1])) {
              stackNumbers.push(stackOperations.pop());
            }
            stackOperations.pop();
            while(stackOperations.length != 0 && !isFunction(stackOperations[stackOperations.length-1])) {
              stackNumbers.push(stackOperations.pop());
            }
          } else if (isNumber(item)) {
            //todo: add support for i
            stackNumbers.push(item);
          } else if (isOperator(item)) {
            while(stackOperations.length != 0 
              && isOperator(stackOperations[stackOperations.length-1]) 
              && getPrecednce(item) <= getPrecednce(stackOperations[stackOperations.length-1])) {
                stackNumbers.push(stackOperations.pop());
              }
              stackOperations.push(item);
          } else if (isFunction(item)) {
            
          }
          

          
        }

        while (stackOperations.length != 0) {
          stackNumbers.push(stackOperations.pop());
        }
        console.log(stackNumbers);
        console.log(stackOperations);
      }

    };
  }());
  
  
  global.str2Expr = function() {
    return new str2Expr();
  }
  
  global.str2Expr().parse();
}(this));
