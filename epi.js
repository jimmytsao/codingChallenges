var combineLinkedLists = function(firstLinkedList, secondLinkedList){
  var combinedList, firstHasLinks, secondHasLinks, addLink;

  combinedList = {head: null, tail: null};

  addLink = function(source, destination){
    if (destination.head === null){
      destination.head = source.head;
      destination.tail = source.head;
    } else {
      destination.tail.next = source.head;
      destination.tail = destination.tail.next;
    }
      source.head = source.head.next;
      destination.tail.next = null;
  };

  firstHasLinks = firstLinkedList.head !== null;
  secondHasLinks = secondLinkedList.head !==null;

  while (firstHasLinks || secondHasLinks){
    if (!firstHasLinks || secondLinkedList.head.data < firstLinkedList.head.data){
      addLink(secondLinkedList, combinedList);
      secondHasLinks = secondLinkedList.head !== null;
    } else if (!secondHasLinks || firstLinkedList.head.data <= secondLinkedList.head.data){
      addLink(firstLinkedList, combinedList);
      firstHasLinks = firstLinkedList.head !== null;
    }
  }

  return combinedList;
};


var inorderTraverse = function (tree, callback){
  var currentNode, previousValue, previousWasDown, update;
  
  previousWasDown = true;
  currentNode = tree;

  update = function(node, direction, value){
    currentNode = node;

    previousWasDown = direction;
    previousValue = value;
  };

  while (currentNode !== null){
    if (previousWasDown === undefined || previousWasDown){
      if (currentNode.left !== null){
        update(currentNode.left, true, currentNode.value);
      } else {
        callback(currentNode);
        if (currentNode.right !== null){
          update(currentNode.right, true, currentNode.value);
        } else {
          update(currentNode.parent, false, currentNode.value);
        }
      }
    } else {
      if (previousValue <= currentNode.value){
        callback(currentNode);
        if (currentNode.right !== null){
          update(currentNode.right, true, currentNode.value);
        } else {
          update(currentNode.parent, false, currentNode.value);
        }
      } else {
        update(currentNode.parent, false, currentNode.value);
      }
    }
  }
};


var stack = function() {
  var stack, max, methods;

  stack = [];
  max = [];
  methods = {};

  methods.push = function(value) {
    if (stack.length && value <= stack[stack.length-1]){
      if (!max.length || stack[stack.length-1] >= max[max.length-1]){
        max.push(stack[stack.length-1]);
      }
    }
    stack.push(value);
  };

  methods.pop = function(){
    if(stack.length === 0){
      //throw new Error(‘Error’);
    }

    if (max.length && max[max.length -1] === stack[stack.length-1]){
      max.pop();
    }
    return stack.pop();
  };

  methods.getMax = function() {
    if (max.length){
      return Math.max(max[max.length-1], stack[stack.length-1]);
    }
    return stack[stack.length-1];
  };

  return methods;
};

