/**
 * Problem 1.3
 */

var checkPermutation = function(first, second){
  var firstHash = {};

  if (first.length !== second.length){
    return false;
  }

  for (var i = 0; i<first.length; i++){
    if (firstHash[first[i]]){
      firstHash[first[i]]++;
    } else {
      firstHash[first[i]] = 1;
    }
  }

  for (var x = 0; x < second.length; x ++){
    if (!firstHash[second[x]]){
      return false;
    } else if (firstHash[second[x]] === 1){
      delete firstHash[second[x]];
    } else {
      firstHash[second[x]]--;
    }
  }

  for (var key in firstHash){
    return false;
  }

  return true;
};

/**
 * Problem 1.4
 */

var replaceWith20v1 = function(string){
  return string.split(' ').join('%20');
};

var replaceWith20v2 = function(string){
  var regFormula = /\s/g;
  return string.replace(regFormula, '%20');
};

/**
 * 1.5
 */

var compressString = function(string){
  var result = [];
  var lastChar = string[0];
  var lastCharCount = 1;
  var currentChar;

  for (var i = 1; i<string.length; i++){
    currentChar = string[i];

    if (lastChar === currentChar){
      lastCharCount++;
    } else {
      result.push(lastChar);
      result.push(lastCharCount);
      lastChar = currentChar;
      lastCharCount =1;
    }
  }

  result.push(lastChar);
  result.push(lastCharCount);

  if (string.length > result.length){
    return result.join('');
  } else {
    return string;
  }
};

/**
 * 1.6
 */

var rotateArray = function(array, counterClockWise){

  //For every position in the nxn array, there are 3 other adjacent/mirror positions
  //This function finds the next position in the clockwise/counterclockwise direction
  var nextAdjacent = function(row, col){
    var maxIndex = array.length - 1;

    if (counterClockWise){
      return {
        row: maxIndex - col,
        col: 0 + row
      };    
    } else {    
      return {
        row: 0 + col,
        col: maxIndex - row
      };
    }
  };

  //This function will go through all of the adjacent/mirror positions and will swap the contents in those positions
  var swapAllAdjacent = function(row, col){
    var queue = [];
    var next = {
      row: row,
      col: col
    };

    for (var i = 0; i<5; i++){
      queue.push(array[next.row][next.col]);
      if (queue.length !== 1){
        array[next.row][next.col] = queue.shift();
      }
      next = nextAdjacent(next.row, next.col);
    }
  };

  //Phase is used to keep track of which direction we are going in
  var phase = 0;

  //max count keeps track of the number of times we will do swaps
  var maxCount = Math.floor(array.length*array.length/4);

  //steps at this phase keeps track of how many times we go in the current direction(phase) before we change directions(phase)
  var maxStepsAtThisPhase = array.length-1;
  var stepsUntilPhaseChange = array.length-1;
  var row = 0;
  var col = 0;


  var updateNextRowCol = function(){

    if (stepsUntilPhaseChange === 0){
      maxStepsAtThisPhase = maxStepsAtThisPhase-2;
      stepsUntilPhaseChange = maxStepsAtThisPhase;
      phase = (phase+1) % 4;
    }

    //Phase 0 = going right
    //Phase 1 = going down
    //Phase 2 = going left
    //Phase 3 = going up

    if (phase === 0){
      col++;
    } else if (phase ===1){
      row++;
    } else if (phase ===2){
      col--;
    } else {
      row--;
    }
  };

  for (var i = 0; i<maxCount; i++){
    swapAllAdjacent(row, col);
    stepsUntilPhaseChange--;
    updateNextRowCol();
  }

  return array;
};

var rotateArrayVersion2 = function(array){
  var first;
  var last;
  var top;

  //layer outside going in
  for (var layer = 0; layer<array.length/2; layer++){
    first = layer;
    last = array.length - 1 - layer;

    //create an offset i
    for (var i = 0; i < last-first; i++){
      top = array[first][first+i];
      array[first][first+i] = array[last-i][first];
      array[last-i][first] = array[last][last-i];
      array[last][last-i] = array[first+i][last];
      array[first+i][last] = top;
    console.log(array);
    }
  }
  return array;
};

/**
 * 1.7
 */

var zero = function(array){
  var rowHash = {};
  var colHash = {};
  var rows = array.length;
  var cols = array[0].length;

  var zeroColumn = function (col){
    for (var i = 0; i<rows; i++){
      array[i][col] = 0;
    }
  };

  var zeroRow = function(row){
    for (var i = 0; i<cols; i++){
      array[row][i] = 0;
    }
  };

  for (var y = 0; y<rows; y++){
    for (var x = 0; x<cols; x++){
      if (array[y][x] === 0){
        rowHash[y] = true;
        colHash[x] = true;
      }
    }
  }

  for (var key in rowHash){
    zeroRow(key);
  }

  for (var index in colHash){
    zeroColumn(index);
  }

  return array;
};


/**
 * 2.1
 */
var SinglyLinkedList = function(){
  this.head = null;
  this.tail = null;
};

SinglyLinkedList.prototype.makeNode = function (value){
  return {
    value: value,
    next: null
  };
};

SinglyLinkedList.prototype.addToTail = function(value){
  var newNode = this.makeNode(value);
  if (this.tail === null){
    this.head = newNode;
    this.tail = newNode;
  } else {
    this.tail.next = newNode;
    this.tail = newNode;
  }
};


var removeDuplicatesWithHash = function(linkedList){
  var hash = {};
  var currentNode = linkedList.head;
  var prevNode;

  var removeNode = function(){
    if (prevNode){
      prevNode.next = currentNode.next;
    } else {
      linkedList.head = currentNode.next;
    }
  };

  while (currentNode !== null){
    if (hash[currentNode.value]){
      removeNode();
    } else {
      hash[currentNode.value] = true;
      prevNode = currentNode;
    }
    currentNode = currentNode.next;
  }
  return linkedList;
};

var removeDuplicatesWithoutBuffer = function(linkedList){
  var currentNode = linkedList.head;
  var frontNode;
  var backNode;

  while (currentNode !== null){
    frontNode = currentNode.next;
    backNode = currentNode;

    while(frontNode !== null){
      if (frontNode.value === currentNode.value){
        backNode.next = frontNode.next;
      } else {
        backNode = frontNode;
      }
      frontNode = frontNode.next;
    }
    currentNode = currentNode.next;
  }
  return linkedList;
};

/**
 * 2.2
 */

var kthElementSinglyLinkedList = function(linkedList, k){
  var scout = linkedList.head;
  var kth = linkedList.head;

  for (var i = 0; i<k-1; i++){
    if (scout.next === null){
      return null;
    } else {
      scout =scout.next;
    }
  }
  while (scout.next !== null){
    scout = scout.next;
    kth = kth.next;
  }
  return kth.value;
};

/**
 * 2.4
 */

var partitionLinkedList = function(linkedList, x){
  var currentNode = linkedList.head.next;
  var previousNode = linkedList.head;

  var moveToHead = function(){
    previousNode.next = currentNode.next;
    currentNode.next = linkedList.head;
    linkedList.head = currentNode;
  };

  while (currentNode !== null){
    if (currentNode.value <x){
      moveToHead();
      currentNode = previousNode.next;
    } else {
      previousNode = currentNode;
      currentNode = currentNode.next;
    }
  }
  return linkedList;
};

/**
 * 2.5
 */

var addLinkedListsReversed = function (first, second){
  var firstPointer = first.head;
  var secondPointer = second.head;
  var carryover = 0;
  var modulo;
  var result = new SinglyLinkedList();

  var incrementPointers= function(){
    if (firstPointer !== null){
      firstPointer = firstPointer.next;
    }
    if (secondPointer !== null){
      secondPointer = secondPointer.next;
    }
  };

  while (firstPointer !== null || secondPointer !== null){
    modulo = 0;

    if (firstPointer !== null){
      modulo = modulo + firstPointer.value;
    }

    if (secondPointer !== null){
      modulo = modulo + secondPointer.value;
    }

    modulo = modulo + carryover;
    carryover = Math.floor(modulo/10);
    modulo = modulo % 10;
    result.addToTail(modulo);

    incrementPointers();
  }

  if (carryover > 0){
    result.addToTail(carryover);
  }
  return result;
};

var addLinkedListsForward = function(first, second){
  var firstNumber = [];
  var secondNumber = [];
  var current;
  var sum;
  var result = new SinglyLinkedList;

  current = first.head;
  while (current !== null){
    firstNumber.push(current.value);
    current = current.next;
  }

  current = second.head;
  while(current !== null){
    secondNumber.push(current.value);
    current = current.next;
  }

  sum = firstNumber.join('')*1 + secondNumber.join('')*1;
  sum = sum.toString().split('');

  for (var i = 0; i<sum.length; i++){
    result.addToTail(sum[i]);
  }
  return result;
};

/**
 * 2.6
 */

var beginningOfCycleMarking = function(linkedList){
  var current = linkedList.head;
  while (current._visited !== true){
    current._visited = true;
    current = current.next;
  }
  return current;
};

var beginningOfCycleNonMarking = function(linkedList){
  var current = linkedList.head;
  var faster;
  var slower;
  var searching;

  while (true){
    searching = true;
    faster = current.next.next;
    slower = current.next;

    while(searching){
      for (var i = 0; i<2; i++){
        if (faster === current){
          return current;
        } else if (faster === slower){
          searching = false;
          break;
        } else if (faster === null){
          return null;
        }
        faster = faster.next;
      }

      slower = slower.next;
    }

    current = current.next;
  }
};

var beginningOfCycleDoublyLinkedList = function(linkedList){
  var current = linkedList.head;

  while (true){
    if (current.next.previous !== current){
      return current.next;
    } else if (current.next === null){
      return null;
    }
    current = current.next;
  }
};

var beginningOfCycleBookSolution = function(linkedList){
  var faster = linkedList.head;
  var slower = linkedList.head;
  var head = linkedList.head;
  var collisionPointer;
  var run = true;

  while (run){
    faster = faster.next;
    faster = faster.next;
    slower=slower.next;
    if (faster === slower){
      collisionPointer = faster;
      run = false;
    }
  }

  while (collisionPointer !== head){
    collisionPointer = collisionPointer.next;
    head = head.next;
  }

  return head;
};

/**
 * 2.7
 */

var linkedListPalindromeConstantSpace = function(linkedList){
  var length = 0;
  var front;
  var end;
  var current = linkedList.head;

  while(current !== null){
    length++;
    current = current.next;
  }

  for (var i = 0; i<Math.floor(length/2); i++){
    front = front && front.next || linkedList.head;
    end = front;
    for (var x = 0; x < length - 1 - 2*i; x++){
      end = end.next;
    }
    if (front.value !== end.value){
      return false;
    }
  }
  return true;
};

var linkedListPalindromeLinearTime = function(linkedList){
  var stack = [];
  var slow = linkedList.head;
  var fast = linkedList.head;

  while (fast !== null && fast.next !== null){
    fast = fast.next.next;
    stack.push(slow.value);
    slow = slow.next;
  }
  if (fast !== null){
    slow = slow.next;
  }
  while (stack.length){
    if (stack.pop() !== slow.value){
      return false;
    }
    slow = slow.next;
  }
  return true;
};

/**
 * 3.1
 */

var ThreeStackArray = function(){
  var size = {
    1:0,
    2:0,
    3:0};
  var storage = [];

  this.push = function(value, stack){
    var index;
    var offset = stack-1;

    if (size[stack] !== undefined){
      index = size[stack]*3 + offset;
      size[stack]++;
    }

    storage[index] = value;
  };

  this.pop = function(stack){
    var index;
    var offset = stack-1;
    var result;

    if (size[stack] !== undefined){
      size[stack]--;
      index = size[stack] * 3 + offset;
    }

    result = storage[index];
    delete storage[index];
    return result;
  };
};

/**
 * 3.2
 */

 var Stack = function() {

    var stack = [];
    var minStack = [];

  // add an item to the top of the stack
  this.push = function(value){

    var stackHasItems = !!stack.length;
    var stackLastItem = stack[stack.length-1];
    var minStackIsEmpty = !minStack.length;
    var minStackLastItem = minStack[minStack.length-1];

    if (stackHasItems && value > stackLastItem){
      if (minStackIsEmpty || stackLastItem < minStackLastItem){
        minStack.push(stackLastItem);
      }
    }

    stack.push(value);
  };

  // remove an item from the top of the stack
  this.pop = function(){
    var stackHasItems = !!stack.length;
    var minStackHasItems = !!minStack.length;
    var stackLastItem = stack[stack.length-1];
    var minStackLastItem = minStack[minStack.length-1];

    if (!stackHasItems){
      return null;
    } else if (minStackHasItems && stackLastItem === minStackLastItem){
      minStack.pop();
    }

    return stack.pop();
  };

  // return the number of items in the stack
  this.size = function(){
    return stack.length;
  };

  this.min = function() {
    var stackLastItem = stack[stack.length-1];
    var minStackLastItem = minStack[minStack.length-1];

    if (stackLastItem === undefined){
      return null;
    } else if (minStackLastItem === undefined){
      return stackLastItem;
    } else {
      return Math.min(stackLastItem, minStackLastItem);
    }

  };
  return this;
};

/**
 * 3.3
 */

var SetOfStacks = function(size) {
  size = size || 10;
  var arrayOfStacks = [[]];

  this.push = function(value){
    var lastStack = arrayOfStacks[arrayOfStacks.length-1];
    var lastStackHasSpace = lastStack.length < size;
    var newStack;

    if (lastStackHasSpace){
      lastStack.push(value);
    } else {
      newStack = [value];
      arrayOfStacks.push(newStack);
    }
  };

  this.pop = function(){
    var lastStack = arrayOfStacks[arrayOfStacks.length-1];
    return lastStack.pop();
  };

  this.popAt = function(index){
    var stackAtIndex = arrayOfStacks[index];
    return stackAtIndex.pop();
  };
};


/**
 * 3.5
 */

var MyQueue = function(){
  
  var enqueueStack = [];
  var dequeueStack = [];

  var moveToOtherStack = function(){
    var currentStack;
    var otherStack;
    var dataIsInCurrentStack;
    var dataIsInEnqueueStack = !!enqueueStack.length;

    if (dataIsInEnqueueStack){
      currentStack = enqueueStack;
      otherStack = dequeueStack;
    } else {
      currentStack = dequeueStack;
      otherStack = enqueueStack;
    }

    dataIsInCurrentStack = !!currentStack.length;

    while (dataIsInCurrentStack){
      otherStack.push(currentStack.pop());
      dataIsInCurrentStack = !!currentStack.length;
    }
  };

  this.enqueue = function(value){
    var dataIsInWrongStack = !!dequeueStack.length;
    
    if(dataIsInWrongStack){
      moveToOtherStack();
    }

    enqueueStack.push(value);
  };

  this.dequeue = function(){
    var dataIsInWrongStack = !!enqueueStack.length;

    if(dataIsInWrongStack){
      moveToOtherStack();
    }

    return dequeueStack.pop();
  };
};

/**
 * 3.6
 */

var sortStackWithStack = function(stack){
  var bufferStack = [];
  var length = 0;
  var sortedCount = 0;
  var stackIsSorting;
  var minItem;

  var getLengthAndInitialMinItem = function(){
    var stackHasItems;
    var knownMinItem;
    var currentItem;
    while (stackHasItems = stack.length>0){
      if(knownMinItem !== undefined){      
        currentItem = stack.pop();
        if(currentItem < knownMinItem){
          bufferStack.push(knownMinItem);
          knownMinItem = currentItem;
        } else {
          bufferStack.push(currentItem);
        }
      } else {
        knownMinItem = stack.pop();
      }
      length++;

    }
    stack.push(knownMinItem);
    sortedCount++;
  };

  var moveAllItemsFromBufferToStack = function(){
    var bufferHasItems;

    while(bufferHasItems = bufferStack.length>0){
      stack.push(bufferStack.pop());
    }
  };

  var findMinItem = function(){
    var numOfPops = length-sortedCount;
    var knownMinItem;
    var currentItem;

    for (var i = 0; i<numOfPops; i++){
      if(knownMinItem!==undefined){
        currentItem = stack.pop();
        if (currentItem<knownMinItem){
          bufferStack.push(knownMinItem);
          knownMinItem = currentItem;
        } else {
          bufferStack.push(currentItem);
        }
      } else {
        knownMinItem = stack.pop();
      }
    }

    return knownMinItem;
  };

  getLengthAndInitialMinItem();

  while (stackIsSorting = length !== sortedCount){
    moveAllItemsFromBufferToStack();
    minItem = findMinItem();
    stack.push(minItem);

    sortedCount++;
  }

  return stack;
};

var sortStackWithStackv2 = function(stack){
  var sortedStack = [];
  var currentItem;
  var stackHasItems;
  var sortedStackTopItem;
  var sortedStackIsEmpty;
  var sortedStackHasItems;

  while (stackHasItems = stack.length >0){
    currentItem = stack.pop();
    sortedStackIsEmpty = sortedStack.length === 0;
    sortedStackTopItem = sortedStack[sortedStack.length-1];

    if (sortedStackIsEmpty || sortedStackTopItem < currentItem){
      sortedStack.push(currentItem);
    } else {
      sortedStackHasItems = sortedStack.length > 0;
      while (sortedStackHasItems && sortedStackTopItem > currentItem){
        stack.push(sortedStack.pop());
        sortedStackHasItems = sortedStack.length > 0;
      }
      sortedStack.push(currentItem);
    }
  }
  return sortedStack;
};

/**
 * 3.7
 */

var DogCatQueue = function(){
  this.head = null;
  this.tail = null;
};

DogCatQueue.prototype.makeQueueItem = function(name, type){
  return {
    name: name,
    type: type,
    next: null
  };
};

DogCatQueue.prototype.enqueue = function (name, type){

  if (!(type === 'dog' ^ type === 'cat')){
    return 'Incorrect type, please entere dog or cat';
  }

  var pet = this.makeQueueItem(name, type);
  var queueIsEmpty;

  queueIsEmpty = this.tail === null;
  
  if (queueIsEmpty){
    this.head = pet;
    this.tail = pet;
  } else {
    this.tail.next = pet;
    this.tail = pet;
  }
};

DogCatQueue.prototype.dequeueAny = function(){
  var dequeueItem = this.head;
  var queueIsNotEmpty = this.head !== null;

  if (queueIsNotEmpty && dequeueItem.next !== null){
    this.head = this.head.next;
  } else {
    this.head = null;
    this.tail = null;
  }

  return dequeueItem;
};

DogCatQueue.prototype.dequeue = function(desiredType){
  var currentItem;
  var dequeueItem;
  var dequeueItemIsLastItemInQueue;

  currentItem = this.head;

  if (currentItem.type === desiredType){
    return this.dequeueAny();
  }

  while (currentItem.next.type !== desiredType){
    currentItem = currentItem.next;
  }

  dequeueItem = currentItem.next;
  dequeueItemIsLastItemInQueue = dequeueItem.next === null;

  if (dequeueItemIsLastItemInQueue){
    currentItem.next = null;
    this.tail = currentItem;
  } else {
    currentItem.next = dequeueItem.next;
  }

  return dequeueItem;
};

DogCatQueue.prototype.dequeueCat = function(){
  return this.dequeue('cat');
};

DogCatQueue.prototype.dequeueDog = function(){
  return this.dequeue('dog');
};

/**
 * 4.1
 */

var checkForBalance = function(binaryTree){
  var leftDepth;
  var rightDepth;
  var treeHasLeftChild;
  var treeHasRightChild;
  var childrenAreBalanced;
  var maxDepth;
  var inbalancedFlag = -1;
  var leftIsNotBalanced;
  var rightIsNotBalanced;

  treeHasLeftChild = binaryTree.left !== null;
  treeHasRightChild = binaryTree.right !== null;

  if (treeHasLeftChild){
    leftDepth = checkForBalance(binaryTree.left);
    leftIsNotBalanced = leftDepth === inbalancedFlag;
    if (leftIsNotBalanced){
      return inbalancedFlag;
    }
  } else {
    leftDepth = 0;
  }

  if (treeHasRightChild){
    rightDepth = checkForBalance(binaryTree.right);
    rightIsNotBalanced = rightDepth === inbalancedFlag;
    if (rightIsNotBalanced){
      return inbalancedFlag;
    }
  } else {
    rightDepth = 0;
  }

  childrenAreBalanced = Math.abs(leftDepth - rightDepth) <= 1;

  if (childrenAreBalanced){
    maxDepth = Math.max(leftDepth, rightDepth);
    return maxDepth + 1;
  } else {
    return inbalancedFlag;
  }
};

/**
 * 4.2
 */

var checkIfNodesAreConnected = function(currentNode, targetNode){
  
  var pathToTargetFound;
  var currentNodeHasEdges;

  if (currentNode === targetNode){
    return true;
  }

  pathToTargetFound = false;
  currentNodeHasEdges = currentNode.edges.length > 0;
  currentNode.visited = true;

  if (currentNodeHasEdges){
    for(var i = 0; i<currentNode.edges.length; i++){
      if (currentNode.edges[i].visited === false){      
        pathToTargetFound = pathToTargetFound || checkIfNodesAreConnected(currentNode.edges[i], targetNode);
        if (pathToTargetFound){
          currentNode.visited = false;
          return true;
        }
      }
    }
  }

  currentNode.visited = false;
  return false;
};

/**
 * 4.3
 */

var BinarySearchTree = function(){
  this.head = null;
};

BinarySearchTree.prototype.makeNode = function(value){
  return {
    value: value,
    left: null,
    right: null
  };
};

BinarySearchTree.prototype.insert = function(value){
  var newNode;
  var binarySearchTreeIsEmpty;
  var nodeHasNotBeenInserted;
  var currentNode;
  var rightChildIsEmpty;
  var leftChildIsEmpty;

  newNode = this.makeNode(value);
  binarySearchTreeIsEmpty = this.head === null;

  if (binarySearchTreeIsEmpty){
    this.head = newNode;
    return;
  }

  currentNode = this.head;
  nodeHasNotBeenInserted = true;

  while(nodeHasNotBeenInserted){
    if(currentNode.value > newNode.value){

      leftChildIsEmpty = currentNode.left === null;

      if(leftChildIsEmpty){
        currentNode.left = newNode;
        nodeHasNotBeenInserted = false;
      } else {
        currentNode = currentNode.left;
      }

    } else {

      rightChildIsEmpty = currentNode.right === null;

      if(rightChildIsEmpty){
        currentNode.right = newNode;
        nodeHasNotBeenInserted = false;
      } else {
        currentNode = currentNode.right;
      }
    }
  }
};

var createBalancedTree = function(array, tree){
  var itemToBeAdded;
  var leftArray;
  var rightArray;
  var middleIndex;
  var leftArrayHasItems;
  var rightArrayHasItems;

  middleIndex = Math.floor(array.length/2);
  itemToBeAdded = array[middleIndex];

  tree.insert(itemToBeAdded);

  leftArray = array.slice(0,middleIndex);
  rightArray = array.slice(middleIndex+1);

  leftArrayHasItems = leftArray.length >0;
  rightArrayHasItems = rightArray.length >0;

  if(leftArrayHasItems){
    createBalancedTree(leftArray, tree);
  }

  if(rightArrayHasItems){
    createBalancedTree(rightArray, tree);
  }
};

/**
 * 4.4
 */

var binaryTreeToLinkedList = function(tree, level, resultsArray){
  level = level && level + 1 || 1;
  resultsArray = resultsArray || [];

  var currentNode = tree.head || tree;
  var linkedListForThisLevelExists;
  var linkedList;
  var leftChildExists;
  var rightChildExists;

  linkedListForThisLevelExists = resultsArray[level-1] !== undefined;

  if (linkedListForThisLevelExists){
    linkedList = resultsArray[level-1];
  } else {
    linkedList = new SinglyLinkedList;
    resultsArray[level-1] = linkedList;
  }

  linkedList.addToTail(currentNode);

  leftChildExists = currentNode.left !== null;
  rightChildExists = currentNode.right !== null;

  if (leftChildExists){
    binaryTreeToLinkedList(currentNode.left, level, resultsArray);
  }

  if (rightChildExists){
    binaryTreeToLinkedList(currentNode.right, level, resultsArray);
  }

  if (level === 1){
    return resultsArray;
  }
};


/**
 * 4.5
 */

//Inorder Traversal checking to see if values are in ascending order
var checkIfBtIsBst = function(binaryTree, previousValue){
  var leftValue;
  var currentValue;
  var rightValue;
  var treeHasLeftChild;
  var treeHasRightChild;
  var notBSTFlag = false;

  treeHasLeftChild = binaryTree.left !== null;
  treeHasRightChild = binaryTree.right !== null;

  currentValue = binaryTree.value;

  //Check to see if previousValue was passed in - previousValue will not be defined until after we've reached the left most child
  //If passed in , check to see if previous value is > current value
  if (previousValue && previousValue > currentValue){
    return notBSTFlag;
  }

  //check if left child exists
  //if so recurse left
  //check to see if returned left value is not false and is not greater than the current value
  if (treeHasLeftChild){
    leftValue = checkIfBtIsBst(binaryTree.left, previousValue);
    if (leftValue === notBSTFlag){
      return notBSTFlag;
    }
    if (leftValue > currentValue){
      return notBSTFlag;
    }
  }

  //check if left child exists
  //if so recurse right passing in the current value
  //check to see if returned right value is not false and is not greater than the current value
  if(treeHasRightChild){
    rightValue = checkIfBtIsBst(binaryTree.right, currentValue);
    if(rightValue === notBSTFlag){
      return notBSTFlag;
    }
    if (rightValue <= currentValue){
      return notBSTFlag;
    }
  }

  //return right value or current value
  return rightValue || currentValue;
};

/**
 * 4.6
 */

var findNextNode = function(node){
  var nodeHasRightChild;
  var nodeHasParent;

  var findLeftMostNode = function(node){
    var nodeHasLeftChild = node.left !== null;
    if(nodeHasLeftChild){
      return findLeftMostNode(node.left);
    }
    return node;
  };

  var findLargerParent = function(node){
    var nodeHasParent = node.parent !== null;

    if (nodeHasParent){
      if (node.parent.value > node.value){
        return node.parent;
      } else {
        return findLargerParent(node.parent);
      }
    } else {
      return null;
    }
  };

  nodeHasRightChild = node.right !== null;

  if (nodeHasRightChild){
    return findLeftMostNode(node.right);
  }

  nodeHasParent = node.parent !== null;

  if (nodeHasParent){
    return findLargerParent(node);
  }

  return null;
};

/**
 * 4.7
 */


var findClosestAncestor = function(currentTree, firstNode, secondNode, foundFirstNode){

  var currentIsOne;
  var currentTreeHasLeftChild;
  var currentTreeHasRightChild;
  var leftChildHasOne;
  var rightChildHasOne;
  var resultIsClosestAncestor;

  console.log(currentTree);
  currentIsOne = currentTree === firstNode || currentTree === secondNode;

  if (currentIsOne && foundFirstNode){
    return true;
  }

  currentTreeHasLeftChild = currentTree.left !== null;
  currentTreeHasRightChild = currentTree.right !== null;

  if (currentTreeHasLeftChild){

    foundFirstNode = currentIsOne || foundFirstNode;

    leftChildHasOne = findClosestAncestor(currentTree.left, firstNode, secondNode, foundFirstNode);
    resultIsClosestAncestor = typeof leftChildHasOne === 'object';

    if (resultIsClosestAncestor){
      return leftChildHasOne;
    }

    if (currentIsOne && leftChildHasOne){
      return currentTree;
    }

    if (foundFirstNode && leftChildHasOne){
      return leftChildHasOne;
    }

  }

  if (currentTreeHasRightChild){

    foundFirstNode = currentIsOne || foundFirstNode || leftChildHasOne;


    rightChildHasOne = findClosestAncestor(currentTree.right, firstNode, secondNode, foundFirstNode);
    resultIsClosestAncestor = typeof rightChildHasOne === 'object';

    if (resultIsClosestAncestor){
      return rightChildHasOne;
    }

    if ( (currentIsOne && rightChildHasOne) || (leftChildHasOne && rightChildHasOne)){
      return currentTree;
    }
  }

  return currentIsOne || leftChildHasOne || rightChildHasOne;
};

/**
 * 4.8
 */


var checkIfTreesMatch = function(firstTree, secondTree){
  
  var oneLeftIsNullOneIsNot;
  var oneRightIsNullOneIsNot;
  var leftIsNotTheSame;
  var rightIsNotTheSame;
  var thereAreLeftChildren;
  var thereAreRightChildren;

  if (firstTree.value !== secondTree.value){
    return false;
  }

  //we now know these nodes have same value

  oneLeftIsNullOneIsNot = firstTree.left === null ^ secondTree.left === null;
  if (oneLeftIsNullOneIsNot){
    return false;
  }

  // we now know these nodes either both have left children or both do not have left children
  
  thereAreLeftChildren = firstTree.left !== null;
  if (thereAreLeftChildren){
    leftIsNotTheSame = !checkIfTreesMatch(firstTree.left, secondTree.left);
    if (leftIsNotTheSame){
      return false;
    }
  }

  //we now know the left side is the same
  
  oneRightIsNullOneIsNot = firstTree.right === null ^ secondTree.right === null;
  if (oneRightIsNullOneIsNot){
    return false;
  }

  // we now know these nodes either both have right children or both do not have right children

  thereAreRightChildren = firstTree.right !== null;
  if (thereAreRightChildren){
    rightIsNotTheSame = !checkIfTreesMatch(firstTree.right, secondTree.right);
    if (rightIsNotTheSame){
      return false;
    }
  }

  // we now know that both left and right are the same
  return true;
};


var checkIfSubtreeExists = function (tree, subtree){

  var subtreeFound;
  var treeHasLeftChild;
  var treeHasRightChild;

  if (tree.value === subtree.value){
    subtreeFound = checkIfTreesMatch(tree,subtree);
    if(subtreeFound){
      return true;
    }
  }

  treeHasLeftChild = tree.left !== null;
  treeHasRightChild = tree.right !== null;

  if (treeHasLeftChild){
    subtreeFound = checkIfSubtreeExists(tree.left, subtree);
    if(subtreeFound){
      return true;
    }
  }

  if (treeHasRightChild){
    subtreeFound = checkIfSubtreeExists(tree.right, subtree);
    if (subtreeFound){
      return true;
    }
  }

  return false;
};

/**
 * 4.9
 */

var findAllSumPaths = function(tree, targetSum, originalSum, previousPath){

  var remainingSum;
  var successfulPaths = [];
  var treeHasLeftChild;
  var treeHasRightChild;


  previousPath = previousPath || [];
  originalSum = originalSum || targetSum;

  remainingSum = targetSum - tree.value;

  if (remainingSum === 0){
    successfulPaths.push(previousPath.concat(tree.value));
  }

  treeHasRightChild = tree.right !== null;
  treeHasLeftChild = tree.left !== null;

  if (treeHasLeftChild){
    successfulPaths = successfulPaths.concat(findAllSumPaths(tree.left, remainingSum, originalSum, previousPath.concat(tree.value)));
    successfulPaths = successfulPaths.concat(findAllSumPaths(tree.left, originalSum));
  }

  if (treeHasRightChild){
    successfulPaths = successfulPaths.concat(findAllSumPaths(tree.right, remainingSum, originalSum, previousPath.concat(tree.value)));
    successfulPaths = successfulPaths.concat(findAllSumPaths(tree.right, originalSum));
  }

  return successfulPaths;
};


var findAllSumPathsBookSolution = function(tree, targetSum, path){

  var sum = 0;
  var result = [];
  var pathCopy = path && path.slice(0) || [];

  pathCopy.push(tree.value);


  for (var i = pathCopy.length-1; i>= 0; i--){
    sum += pathCopy[i];
    if(sum === targetSum){
      result.push(pathCopy.slice(i,pathCopy.length));
    }
  }

  if (tree.left){
    result = result.concat(findAllSumPathsBookSolution(tree.left, targetSum, pathCopy));
  }

  if (tree.right){
    result = result.concat(findAllSumPathsBookSolution(tree.right, targetSum, pathCopy));
  }

  return result;
};


/**
 * 5.1
 */


var insertFirstIntoSecond = function (first, second, msb, lsb){

  //create mask in Javascript
  var finalMask = ~(((1 << (msb - lsb +1)) -1)<<lsb);

  //Use mask to clear out destination bits in second
  var clearedSecondItem = second & finalMask;

  //shift the first
  var firstShifted  = first << (lsb);
  
  //merge the two
  var finalItem = clearedSecondItem | firstShifted;

  console.log('first: ', first.toString(2));
  console.log('first shifted: ', firstShifted.toString(2));
  console.log('second: ', second.toString(2));
  console.log('finalMask: ' , finalMask.toString(2));
  console.log('secondCleared: ', clearedSecondItem.toString(2));
  console.log('final: ', finalItem.toString(2));
};

/**
 * 5.2
 */

var convertDecimalFractionToBinary = function(number){

  var inputIsNotValid;
  var resultsArray = [];

  isNotValidInput = typeof number !== number || number <= 0 || number >= 1;

  if (inputIsNotValid){
    return 'Invalid input';
  }

  for (var i = 0; i<32; i++){
    if (number === 0){
      break;
    }

    number = number*2;

    if (number >= 1){
      resultsArray.push(1);
    } else {
      resultsArray.push(0);
    }
    number = number%1;
  }

  if (number!==0){
    return 'Error';
  } 
  return '0.' + resultsArray.join('');

};

/**
 * 5.3
 */

var getNextLargest = function(number){

  var numberInBinary = number.toString(2),
      clearingMask,
      settingMask,
      onesMask,
      numberOfOnesToAdd,
      findNonLeadingZeroResults;


  var findNonLeadingZero = function(){
    var numOfOnes = 0,
        digit,
        index,
        isDigitANonLeadingZero;

    for (var i = 0; i<numberInBinary.length; i++){
      index = numberInBinary.length-1-i;
      digit = numberInBinary[index]*1;

      numOfOnes = numOfOnes + digit;

      isDigitANonLeadingZero = digit === 0 && numOfOnes > 0;

      if (isDigitANonLeadingZero){
        return {
          index: i,
          numberOfOnes: numOfOnes
        };
      }
    }
  };

  findNonLeadingZeroResults = findNonLeadingZero();

  //set the first non leading zero to 1
  settingMask = 1 << findNonLeadingZeroResults.index;
  number = number | settingMask;

  //clear out all bits after non leading zero
  clearingMask = ~((1 << findNonLeadingZeroResults.index) - 1);
  number = number & clearingMask;

  //add the number of 1s (minus 1) to the right of the non leading zero
  numberOfOnesToAdd = findNonLeadingZeroResults.numberOfOnes -1;
  if (numberOfOnesToAdd > 0){
    onesMask = (1 << numberOfOnesToAdd) -1;
  }
  number = number | onesMask;

  return number;
};

var getNextSmallest = function(number){
  var numberInBinary = number.toString(2),
      clearingMask,
      settingMask,
      onesMask,
      findNonLeadingOneResults,
      spacesToShiftOnes,
      isNumberAllOnes;


  var findNonLeadingOne = function(){
    var numOfOnes = 0,
        numOfZeros = 0,
        digit,
        index,
        isDigitANonLeadingOne;

    for (var i = 0; i<numberInBinary.length; i++){
      index = numberInBinary.length-1-i;
      digit = numberInBinary[index]*1;

      numOfOnes = numOfOnes + digit;

      if (digit === 0){
        numOfZeros++;
      }

      isDigitANonLeadingOne = digit === 1 && numOfZeros > 0;

      if (isDigitANonLeadingOne){
        return {
          index: i,
          numberOfOnes: numOfOnes
        };
      }
    }
    return false;
  };

  findNonLeadingOneResults = findNonLeadingOne();
  isNumberAllOnes = findNonLeadingOneResults === false;

  if (isNumberAllOnes){
    return "Number Is All Ones";
  }

  //clear out all digits after and including non-leading 1
  settingMask = ~( (1 << findNonLeadingOneResults.index +1) -1);
  number = number & settingMask;

  //add the number of 1s (minus 1) to the right of the non leading zero
  numberOfSpacesToShiftOnes = findNonLeadingOneResults.index - findNonLeadingOneResults.numberOfOnes;
  onesMask = ((1 << findNonLeadingOneResults.numberOfOnes) -1) << numberOfSpacesToShiftOnes;
  number = number | onesMask;

  return number;
};

/**
 * 5.5
 */

var numOfBitsRequired = function(first, second){
  var bitsInFirst,
      bitsInSecond;

  bitsInFirst = first.toString(2).split("").reduce(function(accumulator, item){
    return accumulator + item*1;
  }, 0);

  bitsInSecond = second.toString(2).split("").reduce(function(accumulator, item){
    return accumulator + item*1;
  }, 0);

  return bitsInFirst-bitsInSecond;

};

/**
 * 5.6
 */

var swapBits = function(number){
  var mask =1,
      evens,
      odds,
      isMaskForEvens,
      result,
      numberBinaryLength = number.toString(2).length;

  for (var i = 0; i<numberBinaryLength ; i++){
    mask = (mask << 1) + (i%2);
  }

  isMaskForEvens = !!((i-1)%2);

  if (!isMaskForEvens){
    mask = ~mask;
  }

  evens = number & mask;
  odds = number & ~mask;

  result = (evens<<1) | (odds>>>1);

  return result;
};


/**
 * 7.4
 */


var multiply = function(first, second){
  var result = 0,
      firstIsNegative = first < 0,
      secondIsNegative = second < 0,
      absFirst = Math.abs(first),
      absSecond = Math.abs(second);

  for (var i = 0; i<absSecond; i++){
    result = result + absFirst;
  }

  if (firstIsNegative ^ secondIsNegative){
    return -result;
  }
  return result;
};

var subtract = function(first, second){
  return first + (-second);
};

var divide = function(first, second){

  var accumulator = 0,
      firstIsNegative = first < 0,
      secondIsNegative = second < 0,
      resultsArray = [],
      digitToAppendToAccumulator,
      numberOfTimesDivisible,
      reachedEndOfFirst = false,
      maxDigitsAllowed = 30,
      decimalPushed = false,
      results;

  //make all numbers positive
  first = Math.abs(first);
  second = Math.abs(second);
  first = first.toString().split('');

  for (var i = 0; i <maxDigitsAllowed; i++){
    numberOfTimesDivisible = 0;

    //check if the end of the first number has been reached
    reachedEndOfFirst = i >= first.length;
    if (reachedEndOfFirst){

      //if both accumulator = 0 and end of first number reached, the number has divided cleanly
      if (accumulator === 0){
        break;
      }

      //if we've reached the end with no decimal, add a decimal to continue
      if (!decimalPushed){
        resultsArray.push('.');
        decimalPushed = true;
      }
      digitToAppendToAccumulator = 0;

    //if there is a decimal in the first number, push the decimal
    } else if (first[i] === '.'){
      resultsArray.push(first[i]);
      decimalPushed = true;
      continue;
    } else {
      digitToAppendToAccumulator = first[i];
    }

    //append the new digit to the accumulator
    accumulator = accumulator.toString().concat(digitToAppendToAccumulator)*1;

    //check to see how many times the second number goes into the accumulator and add it to results
    while (accumulator >= second){
      accumulator = subtract(accumulator, second);
      numberOfTimesDivisible++;
    }

    resultsArray.push(numberOfTimesDivisible);
  }

  results = resultsArray.join('')*1;

  //if signs are opposite return the negative number
  if (firstIsNegative ^ secondIsNegative){
    return -results;
  }

  //if signs are the same return the positive number
  return results;
};


/**
 * 7.6
 */

var findLineWithMostPoints = function(pointsArray){
  
  var linesHash = {},
      slopeInterceptKey,
      slope,
      intercept,
      keyExists,
      maxCount = 0,
      maxKey;

  //assume each point is passed in as an object {x: <coord>, y: <coord>}
  var calculateSlope = function(first, second){
    return ((second.y - first.y) / (second.x - first.x)).toFixed(5);
  };

  var calculateYIntercept = function (slope, point){
    return (point.y - (slope * point.x)).toFixed(5);
  };


  for (var i = 0; i<pointsArray.length-1; i++){
    for (var x = i+1; x<pointsArray.length; x++){
      slope = calculateSlope(pointsArray[i], pointsArray[x]);
      intercept = calculateYIntercept(slope, pointsArray[x]);
      slopeInterceptKey = slope+':'+intercept;

      keyExists = linesHash[slopeInterceptKey] !== undefined;
      if (keyExists){
        linesHash[slopeInterceptKey]++;
      } else {
        linesHash[slopeInterceptKey] = 1;
      }

      if (linesHash[slopeInterceptKey] > maxCount){
        maxCount = linesHash[slopeInterceptKey];
        maxKey = slopeInterceptKey;
      }
    }
  }

  return 'slope:Yintercept = '+maxKey;
};


/**
 * 8.1
 */

var makePlayingCards = function(){
  var suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs'],
      name,
      specialCharacters = {
        1: 'Ace',
        11: 'Jack',
        12: 'Queen',
        13: 'King'
      };

  var deck = [];
  var card;

  for (var i = 0; i <suits.length; i++){  
    for (var x= 1; x<14; x++){
      name = specialCharacters[x] ? specialCharacters[x] : x;
      card = {
        suit: suits[i],
        value: x,
        name: name
      };

      Object.defineProperty(card, 'print' ,{
        get: function(){
          return [this.name, 'of', this.suit].join(' ');
        }
      });

      deck.push(card);
    }
  }

  return deck;
};

var Deck = function(){
  var _deck = makePlayingCards();


  var shuffle = function(){
    var randomIndex;
    var temp;

    for (var i = 0; i< _deck.length; i++){
      randomIndex = Math.floor(Math.random()*_deck.length);
      temp = _deck[randomIndex];
      _deck[randomIndex] = _deck[i];
      _deck[i] = temp;
    }
  };

  shuffle();
  var dealCard = function(){
    return _deck.pop();
  };
  
  var useNewDeck = function(){
    _deck = makePlayingCards();
    shuffle(); 
  };

  var cardsLeft = function(){
    return _deck.length;
  };


  return {
    dealCard: dealCard,
    shuffle: shuffle,
    useNewDeck: useNewDeck,
    cardsLeft: cardsLeft
  };
};


/**
 * 9.1
 */

var combinationOfNStepsBottomUp = function(numberOfSteps){

  var history = {0: 0};
  var stepOptions = [1,2,3];
  var possibleCombinationsAtThisN;
  var currentCombination;
  var addFunction;

  addFunction = function(accumulator,newItem){
    return accumulator+newItem;
  };

  for (var i = 1; i <= numberOfSteps; i++){
    possibleCombinationsAtThisN = [];

    for (var x = 0; x <stepOptions.length ; x++){
      currentCombination = i - stepOptions[x];

      if (currentCombination === 0){
        possibleCombinationsAtThisN.push(1);
      } else if (currentCombination > 0){
        possibleCombinationsAtThisN.push(history[currentCombination]);
      }
    }

    history[i] = possibleCombinationsAtThisN.reduce(addFunction);
  }

  return history[numberOfSteps];
};

var combinationOfNStepsTopDown = function(numberOfStairs, history){
  history = history || {0:0};

  if (numberOfStairs < 0){
    return 0;
  } 

  if (numberOfStairs === 0){
    return 1;
  }

  if (history[numberOfStairs] !== undefined){
    return history[numberOfStairs];
  }

  history[numberOfStairs] = combinationOfNStepsTopDown(numberOfStairs-1, history) + combinationOfNStepsTopDown(numberOfStairs-2, history) + combinationOfNStepsTopDown(numberOfStairs-3, history);
  return history[numberOfStairs];
};

/**
 * 9.2
 */

var countPathsTopDown = function(x,y,history){

  var key,
      leftResult = 0,
      topResult = 0;

  history = history || {'0:0': 0};

  key = x + ':' + y;

  if (history[key] !== undefined){
    return history[key];
  }

  if (x > 0){
    leftResult = leftResult + Math.max(1, countPaths(x-1, y, history));
  }

  if (y > 0){
    topResult = topResult + Math.max(1, countPaths(x, y-1, history));
  }

  history[key] = leftResult + topResult;

  return history[key];
};


var countPathsBottomUp = function(x, y){
  var history = {'0:0': 0},
      topResult,
      leftResult,
      topKey,
      leftKey,
      key;


  for (var i = 0; i<y; i++){
    for (var j = 0; j<x; j++){
      leftResult = 0;
      topResult = 0;
      if (i>0){
        topKey = j+':'+ (i-1);
        topResult = Math.max(1, history[topKey]);
      }
      if (j>0){
        leftKey = (j-1)+':'+ i;
        leftResult = Math.max(1, history[leftKey]);
      }
      key = j+':'+i;
      if(history[key] === undefined){
        history[key] = topResult + leftResult;
      }
    }
  }

  key = (x-1)+':'+(y-1);
  return history[key];
};


/**
 * 9.4
 */

//assume set is an in an array
var allSubsetsOfSet = function(set){

  var results = [''],
      temp;

  for (var i = 0; i<set.length; i++){
    temp = [];
    for (var x=0; x<results.length; x++){
      temp.push(results[x].toString().concat(set[i]));
    }
    results = results.concat(temp);
  }
  return results.slice(1);
};


/**
 * 9.5
 */
var allAnagrams = function(remainingString, builtString) {
  // Your code here.
  
  var charArray = remainingString.split('');
  var noMoreChars = charArray.length === 0;
  var results = [];
  var charArrayCopy;
  var newBuiltString;

  builtString = builtString || '';

  //base case;
  if (noMoreChars){
    return [builtString];
  } else {
    for (var i = 0; i< charArray.length; i++){
      charArrayCopy = charArray.slice(0);
      newBuiltString = builtString + charArrayCopy.splice(i,1);
      results = results.concat(allAnagrams(charArrayCopy.join(''), newBuiltString));
    }
  }

  return results;
};

/**
 * 9.6
 */

var parenthesesCombinationsBottomUp = function(n, left, right, string ,result){

  result = result || [];

  //avoid situations where left and right = 0
  if (left === undefined){
    left = n;
  }

  if (right === undefined){
    right = n;
  }
  string = string || '';

  if (right === 0 && left === 0){
    result.push(string);
    return;
  }

  if (left > 0){
    parenthesesCombinationsTopDown(n, left -1, right, string.concat('('), result);
  }

  if (right > 0 && right > left){
    parenthesesCombinationsTopDown(n, left, right-1, string.concat(')'), result);
  }

  return result;
};


/**
 * 9.7
 */

//assume matrix = array
//point = an object {row: <coord>, col: <coord>}
//value = new value 
var paint = function(matrix, point, newValue, oldValue){
  
  oldValue = oldValue || matrix[point.row][point.col];

  var isNotTopEdge,
      isNotRightEdge,
      isNotBottomEdge,
      isNotLeftEdge,
      nextCellHasSameColor,
      nextCell;

  //checking to see if point is on any edge
  isNotTopEdge = point.row !== 0;
  isNotLeftEdge = point.col !== 0;
  isNotBottomEdge = point.row !== matrix.length-1;
  isNotRightEdge = point.col !== matrix[0].length -1;
  
  //set current point
  matrix[point.row][point.col] = newValue;

  //check the 8 surrounding locations and recurse if needed
  
  //Top
  if (isNotTopEdge){
    nextCell = {row: point.row-1, col: point.col};
    nextCellHasSameColor = matrix[nextCell.row][nextCell.col] === oldValue;
    if (nextCellHasSameColor){
      paint(matrix, nextCell, newValue, oldValue);
    }
  }
  
  //TopLeft
  if (isNotTopEdge && isNotLeftEdge){
    nextCell = {row: point.row-1, col: point.col-1};
    nextCellHasSameColor = matrix[nextCell.row][nextCell.col] === oldValue;
    if (nextCellHasSameColor){
      paint(matrix, nextCell, newValue, oldValue);
    }
  }

  //TopRight
  if (isNotTopEdge && isNotRightEdge){
    nextCell = {row: point.row-1, col: point.col+1};
    nextCellHasSameColor = matrix[nextCell.row][nextCell.col] === oldValue;
    if (nextCellHasSameColor){
      paint(matrix, nextCell, newValue, oldValue);
    }
  }
  
  //left
  if (isNotLeftEdge){
    nextCell = {row: point.row, col: point.col-1};
    nextCellHasSameColor = matrix[nextCell.row][nextCell.col] === oldValue;
    if (nextCellHasSameColor){
      paint(matrix, nextCell, newValue, oldValue);
    }
  }

  //right
  if (isNotRightEdge){
    nextCell = {row: point.row, col: point.col+1};
    nextCellHasSameColor = matrix[nextCell.row][nextCell.col] === oldValue;
    if (nextCellHasSameColor){
      paint(matrix, nextCell, newValue, oldValue);
    }
  }

  //BottomLeft
  if (isNotLeftEdge && isNotBottomEdge){
    nextCell = {row: point.row+1, col: point.col-1};
    nextCellHasSameColor = matrix[nextCell.row][nextCell.col] === oldValue;
    if (nextCellHasSameColor){
      paint(matrix, nextCell, newValue, oldValue);
    }
  }

  //BottomRight
  if (isNotRightEdge && isNotBottomEdge){
    nextCell = {row: point.row+1, col: point.col+1};
    nextCellHasSameColor = matrix[nextCell.row][nextCell.col] === oldValue;
    if (nextCellHasSameColor){
      paint(matrix, nextCell, newValue, oldValue);
    }
  }

  //Bottom
  if (isNotBottomEdge){
    nextCell = {row: point.row+1, col: point.col};
    nextCellHasSameColor = matrix[nextCell.row][nextCell.col] === oldValue;
    if (nextCellHasSameColor){
      paint(matrix, nextCell, newValue, oldValue);
    }
  }
};

var makeChange = function(n, previous){
  previous = previous || 25;

  var result = 0;

  if (n === 0){
    return 1;
  } else if (n < 0 ){
    return 0;
  } else {

    if (previous === 25){
      result += makeChange(n-25, 25);
      result += makeChange(n-10, 10);
      result += makeChange(n-1, 1);
    } else if (previous === 10){
      result += makeChange(n-10, 10);
      result += makeChange(n-1, 1);      
    } else if (previous === 1){
      result += makeChange(n-1, 1);            
    }
  }

  return result;
};