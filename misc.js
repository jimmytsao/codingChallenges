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

/**
 * Expands an excel selector and to an array of individual cell selectors
 * Example: 'B3:C4&E5~B3:B4' would return ["C3", "C4", "E5"]
 * @param  {[String]} string - selector that uses '&' (add), ':' (range), and '~' (exclude)
 * @return {[Array]}        - an array of individual cell selectors
 */
var expandSelector = function(string){  
  var parsed, adds, excludes, results, hash, isRange, toAdd, toExclude, keys, results;

  //Categorize each selector as either a selector to add or a selector to exclude
  parsed = findAddsAndExclusions(string);
  adds = parsed.adds;
  excludes = parsed.exclusions;

  //Booleans to control the helper functions to add or to exclude
  toAdd = true;
  toExclude = false;

  //Used a hash table for amortized constant time adds and deletion
  //Each cell that is to be included will have a key which is a string representation of the coordinates of the cell
  //e.g Cell B3 will be represented in the hash as {'1-3': true}
  hash = {};

  //Add all cells defined by the add selectors to the hash table
  updateHash(adds, hash, toAdd);

  //Remove all cells defined by the remove selectors from the hash table  
  updateHash(excludes, hash, toExclude);

  //Extract the keys from the hash table
  keys = Object.keys(hash);

  //Convert each key back to a selector (e.g '1-3' to 'B3')
  results = keys.map(keyToSelector);

  //Return the results
  return results;


  /***********************
   * Supporting functions
   ***********************/
  
  /**
   * Parses the input string into arrays of selectors to add and selectors to exclude
   * @param  {[String]} string - selector that uses '&' (add), ':' (range), and '~' (exclude)
   * @return {[Object]}        - Object with 2 arrays: (1) adds which contains selectors that add (2) selectors that excludes cells
   */
  function findAddsAndExclusions(string){

    var adds, exclusions, temp, containsExclusions, results;

    adds = [];
    exclusions = [];
    temp = string.split('~');

    containsExclusions = temp.length > 1;

    if (containsExclusions){
      adds = adds.concat(temp[0].split('&'));
      temp = temp[1].split('&');
      exclusions.push(temp[0]);
      adds = adds.concat(temp.slice(1));

    } else {
      adds = temp[0].split('&');
    }

    results = {
      adds: adds,
      exclusions: exclusions
    };

    return results;
  }

  /**
   * Updates the hash table by adding/removing keys that represent the cell to be added/removed
   * @param  {Array} array - array of selectors
   * @param  {Object} hash  - hash table to keep track of cells to be included
   * @param  {Boolean} toAdd - boolean that determins whether to add (true) or remove (false) from the hash
   * @return {None} 
   */
  function updateHash (array, hash, toAdd){
    var currentSelector, isRange;

    for (var i = 0; i<array.length; i++){
      currentSelector = array[i];

      isRange = currentSelector.indexOf(':') !== -1;

      if (isRange){
        handleRangeSelector(currentSelector, hash, toAdd);
      } else {
        handleIndividualSelector(currentSelector, hash, toAdd);
      }
    }
  }

  /**
   * Updates the hash table by adding/removing keys that represent the cell to be added/removed
   * @param  {Array} array - array of selectors
   * @param  {Object} hash  - hash table to keep track of cells to be included
   * @param  {Boolean} toAdd - boolean that determins whether to add (true) or remove (false) from the hash
   * @return {None} 
   */
  function handleIndividualSelector(selector, hash, toAdd){
    var coordinates, key;
    coordinates = toCoordinates(selector);
    key = coordinates.join('-');

    if (toAdd){
      hash[key] = true;
    } else {
      delete hash[key];
    }
  }

  /**
   * Updates the hash table by adding/removing keys that represent the cell to be added/removed
   * @param  {Array} array - array of selectors
   * @param  {Object} hash  - hash table to keep track of cells to be included
   * @param  {Boolean} toAdd - boolean that determins whether to add (true) or remove (false) from the hash
   * @return {None} 
   */
  function handleRangeSelector(selector, hash, toAdd){

    var keys, start, end, parsed;

    parsed = selector.split(':');

    start = parsed[0];
    end = parsed[1];

    keys = getRangeKeys(start, end);
    addKeysToHash(hash, keys, toAdd);

    /**
     * Converts a range selector to keys
     * Example: 'A1:B2' would return ['0-1', '0-2', '1-1', '1-2']
     * @param  {string} start - starting selector of the range
     * @param  {string} end   - ending selector of the range
     * @return {array}       Array of keys that have been converted from selectors
     */
    function getRangeKeys (start, end){  
      var results, startCoord, endCoord, leftEdge, rightEdge, topEdge, bottomEdge;

      startCoord = toCoordinates(start);
      leftEdge = startCoord[0];
      topEdge = startCoord[1];

      endCoord = toCoordinates(end);
      rightEdge = endCoord[0];
      bottomEdge = endCoord[1];

      results = [];

      for (var x = leftEdge; x <rightEdge+1; x++){
        for (var y = topEdge; y <bottomEdge+1; y++){
          results.push([x,y].join('-'));
        }
      }

      return results;
    }

    /**
     * Updates the hash table by adding/removing keys that represent the cell to be added/removed
     * @param  {Object} hash  - hash table to keep track of cells to be included
     * @param  {Array} keys - array of keys that have been converted from selectors
     * @param  {Boolean} toAdd - boolean that determins whether to add (true) or remove (false) from the hash
     * @return {None} 
     */
    function addKeysToHash(hash, keys, toAdd){
      for (var i = 0; i<keys.length; i++){
        if (toAdd){
          hash[keys[i]] = true;
        } else {
          delete hash[keys[i]];
        }
      }
    }
  }
  
  /**
   * Converts a selector to its coordinate representation
   * @param  {String} selector - string representation of the cell
   * @return {Array}          - coordinate representation of the cell [x coordinate, y coordinate]
   */
  function toCoordinates(selector){
    var charCodeOfA, alphaValue, alphaCharCode, numericValue, xCoord, yCoord;

    alphaValue = selector[0].toUpperCase();
    numericValue = selector.slice(1);

    charCodeOfA = 'A'.charCodeAt(0);
    alphaCharCode = alphaValue.charCodeAt(0);

    xCoord = alphaCharCode - charCodeOfA;
    yCoord = numericValue*1;

    return [xCoord, yCoord];
  }

  /**
   * Converts a coordinate representation of the cell to a string selector representation of the cell
   * @param  {Array} coordinates - coordinate representation of the cell [x coordinate, y coordinate
   * @return {String}            - string representation of the cell
   */
  function toSelector(coordinates){
    var charCodeOfA, alphaValue, alphaCharCode, numericValue, xCoord, yCoord, selector;

    xCoord = coordinates[0]*1;
    yCoord = coordinates[1]*1;

    charCodeOfA = 'A'.charCodeAt(0);
    alphaCharCode = charCodeOfA + xCoord;
    alphaValue = String.fromCharCode(alphaCharCode);
    numericValue = yCoord;

    selector = [alphaValue, numericValue].join('');

    return selector;
  }

  /**
   * Callback function to convert a hashtable key to a selector
   * @param  {String} key - hash table key (e.g '1-3' which represents)
   * @return {String}     - string selector after being convertd (e.g - 'B3')
   */
  function keyToSelector(key){
    var keyArray = key.split('-');
    return toSelector(keyArray);
  }
};
