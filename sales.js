'use strict';

/*  The all-important Store object constructor */
function Store(locString, minCustomers, maxCustomers, avgCookiesPerCust) {
  this.locString = locString;
  this.minCustomers = minCustomers;
  this.maxCustomers = maxCustomers;
  this.avgCookiesPerCust = avgCookiesPerCust;

  this.salesOutputArray = [];

  /*  generates number of customers */
  this.genRandomCust = function() {
    var min = Math.ceil(this.minCustomers);
    var max = Math.floor(this.maxCustomers);
    return Math.floor(Math.random() * (max + 1 - min) + min);
  };

  /*  multiply number of customers by rate */
  this.cookiesPerHour = function cookiesPerHour() {
    return Math.round(this.genRandomCust() * this.avgCookiesPerCust);
  };

  this.genSalesStrings = function genSalesStrings() {

    for (var i = 6; i <= 20; i++) {
      this.salesOutputArray.push(this.cookiesPerHour());
    }

    console.log('.genSalesStrings() :: finished building salesOutputArray: ' + this.salesOutputArray);

  };
  this.genSalesStrings();
}
/*  will contain pregenerated strings to be created as text nodes, following format:
    6am: 315 cookies  */

Store.prototype.hoursOutputArray = [];
Store.prototype.genHeadingStrings = function genHeadingStrings() {

  for (var i = 6; i <= 20; i++) {
    var workingString = ''; //temp string
    var time = parseHr12(i);

    /*  begin building string. mock string output follows in comments */
    workingString += time[0]; // '6'
    if (!time[1]) {
      workingString += ':00am'; // '6' + 'am: '
    } else if (time[1]) {
      workingString += ':00pm'; // '6' + 'pm: '
    }

    this.hoursOutputArray.push(workingString); //finally, push complete string
  }
  console.log('.genHeadingStrings() :: finished building hoursOutputArray: ' + this.hoursOutputArray);
};
Store.prototype.genHeadingStrings();

/*  Initialize Store objects  */
var firstAndPike = new Store('1st and Pike', //locString
23, 65, 6.3); //minCustomers, maxCustomers, avgCookiesPerCust

var seaTacAirport = new Store('SeaTac Airport', //locString
3, 24, 1.2); //minCustomers, maxCustomers, avgCookiesPerCust

var seattleCenter = new Store('Seattle Center', //locString
11, 38, 3.7); //minCustomers, maxCustomers, avgCookiesPerCust

var capitolHill = new Store('Capitol Hill',
20, 38, 2.3); //minCustomers, maxCustomers, avgCookiesPerCust

var alki = new Store('Alki', //locString
2, 16, 4.6); //minCustomers, maxCustomers, avgCookiesPerCust

/*  GENERIC PARSING FUNCTIONS   */
function parseHr12 (hr24) {
  var amPmFlag; //12hr am/pm bit
  var hr12; //12hr hour value

  if (hr24 < 12) { //if before noon...
    amPmFlag = 0;
    hr12 = hr24;
  } else if (hr24 === 12) { //if noon...
    amPmFlag = 1;
    hr12 = 12; //naturally. value of 0 for below calc would not work.
  } else {
    amPmFlag = 1;
    hr12 = hr24 - 12; //convert to 12hr. does not work at noon
  } //don't need to make it work for midnight, outside store hours. I'm sure this will become its own Y2K (T2400?) bug should the owner decide to expand business hours to a 24/7 model.

  return [hr12, amPmFlag];
}

/*  MAIN EXECUTION  */

/*  WILL NOT WORK IF NODE PASSED DIRECTLY TO, USE ID INSTEAD
    Used to recursively add elements.
    Tightly coupled with Store objects, only a wrapper function.  */

function DOMNode() {
  /*  GENERIC DOM MANIPULATION FUNCTIONS  */
  /*  Note to self: consider removing parameter type analysis in favor of accepting only direct nodes, do all node selection at function call.
    e.g. insertNode(document.getElementById('htmlId'), 'li')
    This will avoid redundancy and improve performance, at cost of...? Readability? Think on it. */

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

function SalesTable (targetParentNodeRef) {
  this.targetParentNodeRef = targetParentNodeRef; //parent <section>
  this.superStore; //IMPORTANT: index of all Store objects
  this.salesTableNodeRef;
  this.currentRowObj;

  this.lastIndexPos;

  this.superStore = [firstAndPike,seaTacAirport,seattleCenter,capitolHill,alki];

  this.addUserStore = function(locString, minCustomers, maxCustomers, avgCookiesPerCust) {
    this.superStore.push(new Store(locString, minCustomers, maxCustomers, avgCookiesPerCust));
    this.lastIndexPos = this.superStore.length - 1;
    console.log('.addUserStore() :: new Store object pushed to .superStore: ' + this.superStore[this.lastIndexPos]);
    this.appendToSalesTable(this.lastIndexPos);
  };

  this.initializeSalesTable = function() {
    console.log('generateSalesElements() :: FUNCTION_EXECUTE');

    this.wrapperSectionObj = new DOMNode(); //FIRST, create pointer object
    this.wrapperSectionObj.attachToNode(targetParentNodeRef); //SECOND, affix to DOM Node. Now contains a mirror reference.

    /*  BEGIN TABLE GENERATE  */
    this.wrapperSectionObj.insertNode('table'); //THIRD, insert a child table node beneath it
    this.tableObj = new DOMNode();
    this.tableObj.attachToNode(this.wrapperSectionObj.childNodeRef);

    /*  GENERATE TABLE HEADING  */
    this.tableObj.insertNode('tr');
    this.currentRowObj = new DOMNode();
    this.currentRowObj.attachToNode(this.tableObj.childNodeRef);

    this.currentRowObj.insertNode('td'); //create corner cell...

    //fill out rest of table heading
    for (var i = 0; i < Store.prototype.hoursOutputArray.length; i++) {
      this.currentRowObj.insertNodeWithText('td', Store.prototype.hoursOutputArray[i]);
    }
  };

  this.appendToSalesTable = function(startIndex) {
    console.log('.appendToSalesTable() :: FUNCTION_EXECUTE');
    //now we have to generate as many table rows as there are stores...
    for (var i = startIndex; i < (this.superStore.length); i++) {

      this.tableObj.insertNode('tr'); //begin row
      this.currentRowObj.attachToNode(this.tableObj.childNodeRef);
      this.currentRowObj.insertNodeWithText('td', this.superStore[i].locString);

      //while generating a row, make sure to add TDs
      for (var j = 0; j < (this.superStore[i].salesOutputArray.length); j++) {
        this.currentRowObj.insertNodeWithText('td', this.superStore[i].salesOutputArray[j]);
      }
    }
    console.log('.initializeSalesTable() :: FUNCTION_BREAK');
  }; //.initializeSalesTable
  this.initializeSalesTable();
  this.appendToSalesTable(0);

} //SalesSection

SalesTable.prototype = Object.create(DOMNode.prototype);

document.addEventListener('DOMContentLoaded', execUponLoad);
function execUponLoad() {

  console.log('execUponLoad() :: DOMContentLoaded FIRED');


  var myTable = new SalesTable(document.getElementById('salesSection'));

  // console.log('forcing .addUserStore');
  // myTable.addUserStore('location',2,10,5);

  var form = document.getElementById('fid_addStoreForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    myTable.addUserStore(
      e.target.fn_locString.value,
      e.target.fn_minCustomers.value,
      e.target.fn_maxCustomers.value,
      e.target.fn_avgCookiesPerCust.value
    );
  });
}