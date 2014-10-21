(function() {

  Number.prototype.toRoman = function(){

    var input, factor, resultsBuffer, romanNumeralsHash, maxPower, power, results;

    input = this;
    validateInput(input);

    resultsBuffer = [];
    romanNumeralsHash = {
      0:    '',
      1:    'I',
      5:    'V',
      10:   'X',
      50:   'L',
      100:  'C',
      500:  'D',
      1000: 'M'
    };

    maxPower = Math.pow(10, input.toString().length);

    for (power = maxPower; power >= 1 ; power = power/10){
      factor = Math.floor(input/power);

      if (factor === 9){
        handleNine(factor, power, romanNumeralsHash, resultsBuffer);

      } else if (factor === 4){
        handleFour(factor, power, romanNumeralsHash, resultsBuffer);
        
      } else {
        handleOthers(factor, power, romanNumeralsHash, resultsBuffer);
      }

      input = input - (factor * power);
    }

    results = resultsBuffer.join('');

    return results;

    function handleFour(factor, power, romanNumeralsHash, resultsBuffer){

      resultsBuffer.push(romanNumeralsHash[power]);
      resultsBuffer.push(romanNumeralsHash[power*5]);
    }

    function handleNine(factor, power, romanNumeralsHash, resultsBuffer){

      resultsBuffer.push(romanNumeralsHash[power]);
      resultsBuffer.push(romanNumeralsHash[power*10]);
    }

    function handleOthers(factor, power, romanNumeralsHash, resultsBuffer){

      if (factor >= 5){
        resultsBuffer.push(romanNumeralsHash[power*5]);
        factor = factor - 5;
      }

      for (var x = 0; x<factor; x++){
        resultsBuffer.push(romanNumeralsHash[power]);
      }
    }

    function validateInput(input){

      var inputIsNotValid = !(input instanceof Number) || isNaN(input) || input <= 0 || input >=3999;

      if (inputIsNotValid){
        throw new Error('This method can only be called on a number between 0 and 3999');
      }
    }
  };
})();
