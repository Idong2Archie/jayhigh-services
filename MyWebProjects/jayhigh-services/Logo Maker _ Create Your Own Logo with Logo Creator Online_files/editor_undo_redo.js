/**
 * @ Created By Rahul Verma
 */
function LM_UNDO_REDO() {

  var undoItemList = [];
  var redoItemList = [];
  var undoBtnRef = null;
  var redoBtnRef = null;
  /**
   * 
   * @param {*} p_oUndoBtnRef 
   * @param {*} p_oRedoBtnRef 
   */
  var init = function (p_oUndoBtnRef = null, p_oRedoBtnRef = null) {
    debugConsole("LM_UNDO_REDO init");
    undoItemList = [];
    redoItemList = [];
    undoBtnRef = p_oUndoBtnRef;
    redoBtnRef = p_oRedoBtnRef;
    manageUndoBtn(true);
    manageRedoBtn(true);
  }
  /**
   * 
   * @param {*} isUndoDisabled 
   */
  var manageUndoBtn = function (isUndoDisabled) {
    if (undoBtnRef) {
      if (isUndoDisabled) {
        undoBtnRef.addClass("disabled");
      } else {
        undoBtnRef.removeClass("disabled");
      }
    }
  }
  /**
   * 
   * @param {*} isRedoDisbaled 
   */
  var manageRedoBtn = function (isRedoDisbaled) {
    if (redoBtnRef) {
      if (isRedoDisbaled) {
        redoBtnRef.addClass("disabled");
      } else {
        redoBtnRef.removeClass("disabled");
      }
    }
  }
  /**
   * 
   * @param {*} p_sActId 
   * @param {*} p_sUndoActValue 
   * @param {*} p_sRedoActValue 
   * @param {*} p_nSessionParentLink 
   * @param {*} p_nSessionTargetLink 
   */
  var setUndoAct = function (p_sActId, p_sUndoActValue, p_nUndoParentLink, p_nUndoTargetLink, p_sRedoActValue, p_nRedoParentLink, p_nRedoTargetLink, p_sHackedUndoValue, p_sHackedRedoValue) {
    var actObj = new Object();

    actObj.type = p_sActId;
    if(undoItemList.length > 0){
      var lastActObj = undoItemList[undoItemList.length-1];
      actObj.prevAct = lastActObj.type;
    }
    

    actObj.undoValue = p_sUndoActValue;
    actObj.undoParentLink = p_nUndoParentLink;
    actObj.undoTargetLink = p_nUndoTargetLink;

    actObj.redoValue = p_sRedoActValue;
    actObj.redoParentLink = p_nRedoParentLink;
    actObj.redoTargetLink = p_nRedoTargetLink;
    actObj.hackedUndoValue = p_sHackedUndoValue;
    actObj.hackedRedoValue = p_sHackedRedoValue;

    actObj.uniqId = genRandomId();

    if (redoItemList && redoItemList.length > 0) {
      redoItemList = [];
      debugConsole("flush the redo array");
      manageRedoBtn(true);
    }
    undoItemList.push(actObj);
    if (DH.DH_APP_MODE === "PRODUCTION") {
      debugConsole("undoItemList length:=" + undoItemList.length);
    } else {
      // console.log("undoItemList length:=" + undoItemList.length);
    }
    if (undoItemList.length >= 1) {
      manageUndoBtn(false);
    }
    expendUndoList(undoItemList);
  }
  /**
   * 
   * @param {*} undoItemList 
   */
  var expendUndoList = function (undoItemList) {
    if (undoItemList && undoItemList.length > 0) {
      for (var i = 0; i < undoItemList.length; i++) {
        if (DH.DH_APP_MODE === "DEVELOPMENT") {
          debugConsole("type:=" + undoItemList[i].type + ", undoValue:=" + undoItemList[i].undoValue + ", undoParentLink:=" + undoItemList[i].undoParentLink + ", prevAct:=" + undoItemList[i].prevAct + ", redoValue:=" + undoItemList[i].redoValue + ", redoParentLink:=" + undoItemList[i].redoParentLink + ", redoTargetLink:=" + undoItemList[i].redoTargetLink + ", uniqId:=" + undoItemList[i].uniqId);
          debugConsole("--------------------------------");
        } else {
          // console.log("type:=" + undoItemList[i].type + ", undoValue:=" + undoItemList[i].undoValue + ", undoParentLink:=" + undoItemList[i].undoParentLink + ", undoTargetLink:="+undoItemList[i].undoTargetLink+", redoValue:="+undoItemList[i].redoValue+", redoParentLink:="+undoItemList[i].redoParentLink+", redoTargetLink:="+undoItemList[i].redoTargetLink+", uniqId:="+undoItemList[i].uniqId);
          // console.log("--------------------------------");
        }
      }
    }

  }
  /**
   * 
   */
  var getCurrentUndoAct = function () {
    if (undoItemList && undoItemList.length > 0) {
      var currentUndoObj = undoItemList.pop();
      debugConsole("undoItemList.length:=" + undoItemList.length);
      redoItemList.push(currentUndoObj);
      if (redoItemList.length >= 1) {
        manageRedoBtn(false);
      }
      if (undoItemList.length === 0) {
        manageUndoBtn(true);
      }else{
        manageUndoBtn(false);
      }
      return currentUndoObj;
    }
    return null;
  }
  /**
   * 
   */
  var getCurrentRedoAct = function () {
    if (redoItemList && redoItemList.length > 0) {
      var currentRedoObj = redoItemList.pop();
      debugConsole("redoItemList.length:=" + redoItemList.length);
      undoItemList.push(currentRedoObj);
      if (undoItemList.length >= 1) {
        manageUndoBtn(false);
      }
      debugConsole("redoItemList.length1:=" + redoItemList.length);
      if (redoItemList.length === 0) {
        manageRedoBtn(true);
      }else{
        manageRedoBtn(false);
      }
      return currentRedoObj;
    }
    return null;
  }
  /**
   * 
   * @param {*} p_aList 
   */
  var updateUndoItemList = function (p_aList) {
    if (p_aList && p_aList.length > 0) {
      undoItemList = [];
      undoItemList = undoItemList.concat(p_aList);
      expendUndoList(p_aList);
    } else {
      undoItemList = [];
    }
  }
  /**
   * 
   */
  var getUndoItemList = function () {
    if (undoItemList && undoItemList.length > 0) {
      return undoItemList;
    }
    return null;
  }
  /**
   * 
   */
  var die = function () {
    undoItemList = [];
    redoItemList = [];
    manageUndoBtn(true);
    manageRedoBtn(true);
  }
  var genRandomId = function () {
    var array = new Uint32Array(1);
    var cryptoObj = window.crypto || window.msCrypto;
    cryptoObj.getRandomValues(array);
    return array[0];
  }
  /**
   * 
   */
  this.init = init;
  this.setUndoAct = setUndoAct;
  this.getCurrentUndoAct = getCurrentUndoAct;
  this.getCurrentRedoAct = getCurrentRedoAct;
  this.getUndoItemList = getUndoItemList;
  this.updateUndoItemList = updateUndoItemList;
  this.die = die;
}
