'use strict';

/*  GENERIC DOM MANIPULATION  */

function DOMNode() {

  this.targetParentNodeRef;
  this.selfNodeRef;
  this.childNodeRef;

  this.attachToNode = function (become) {
    this.selfNodeRef = become;
  };

  /*  Inserts node of element type nodeType as child of target. */
  this.insertNode = function(nodeType) {
    // console.log('FUNCTION_EXECUTE insertNode(' + target + ',' + nodeType + ')');
    // console.log('insertNode() :: typeof target parameter is ' + typeof target);

    var newNode;
    newNode = document.createElement(nodeType);
    this.selfNodeRef.appendChild(newNode);
    // console.log('insertNode() :: RETURN lastChild ' + targetNodeObj.lastChild + 'of targetNode ' + targetNodeObj);
    this.childNodeRef = this.selfNodeRef.lastChild;
    console.log('DOMNode.insertNode() :: context of this: ' + this);
  };

  /*  As above, but creates a child text node.  */
  this.insertNodeWithText = function(nodeType, textInput) {
    // console.log('insertNodeWithText() :: FUNCTION_EXECUTE(' + target + ',' + nodeType + ',' + textInput + ')');
    // console.log('insertNodeWithText() :: typeof target parameter is ' + typeof target);

    var newNode;
    var newTextNode;
    newNode = document.createElement(nodeType);
    newTextNode = document.createTextNode(textInput);
    newNode.appendChild(newTextNode);
    // console.log('insertNodeWithText() :: appending newNode ' + newNode + ' to targetNode ' + targetNodeObj);
    this.selfNodeRef.appendChild(newNode);
    // console.log('insertNodeWithText() :: RETURN lastChild (' + targetNodeObj.lastChild + ') of targetNode (' + targetNodeObj + ')');
    this.childNodeRef = this.selfNodeRef.lastChild;
  };
}