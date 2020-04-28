//////////////////////////////////////////////////////////////////////////////
// Add context menu button to complitly remove all attachments
// in selected messages
// @author Zimlet author: Michael Danuschenkov(micle@inbox.ru)
//////////////////////////////////////////////////////////////////////////////

function com_zimbra_clearattach_HandlerObject() {
}

com_zimbra_clearattach_HandlerObject.prototype = new ZmZimletBase();
com_zimbra_clearattach_HandlerObject.prototype.constructor = com_zimbra_clearattach_HandlerObject;

var clearattachZimlet = com_zimbra_clearattach_HandlerObject;

/**
 * Called by Zimbra upon login
 */
clearattachZimlet.prototype.init =
function() {

};

clearattachZimlet.prototype.onActionMenuInitialized = 
function(controller, actionMenu) {
	this.addMenuButton(controller, actionMenu);
}

clearattachZimlet.prototype.onParticipantActionMenuInitialized = 
function(controller, actionMenu) {
	this.addMenuButton(controller, actionMenu);
}

clearattachZimlet.prototype.addMenuButton = 
function(controller, actionMenu) {
	var opDelete = actionMenu.getOp(ZmOperation.DELETE);
	var opDeleteIndex = actionMenu.getItemIndex(opDelete);
	menuItemAttr = {
		text:     "Remove all attachments",
		image:    "EmptyFolder",
		index:    opDeleteIndex+1};
	var clearattachZimletButton = actionMenu.createOp("CLEARATTACH_CONTEXT_BUTTON", menuItemAttr);
	clearattachZimletButton.addSelectionListener(new AjxListener(this, this._clearattachZimletButtonListener, [controller]));
	controller.operationsToEnableOnMultiSelection.push("CLEARATTACH_CONTEXT_BUTTON");
}

clearattachZimlet.prototype._clearattachZimletButtonListener = 
function(controller) {
	var lv = controller._listView[controller._currentViewId];
	this._selectedItem(lv.getDnDSelection());
}

clearattachZimlet.prototype._selectedItem = 
function(itemsList) {
	if (itemsList instanceof Array) {
		for (var item in itemsList) {
			this._selectedItem(itemsList[item]);
		}
	}
	if (itemsList instanceof ZmConv) {
		var itemConv = itemsList;
		if (!(itemConv._loaded)) {
			itemConv.loadMsgs({fetchAll:true}, new AjxCallback(this, this._selectedItem, [itemConv]));
			return;
		}
		var msgList = itemConv.getMsgList();
		if (msgList.length!=1) { return; } 	
		this._selectedItem(itemConv.getFirstHotMsg());
	}
	if (!(itemsList instanceof ZmMailMsg)) {
		return;
	}
	var itemMsg = itemsList;
	this.removeAllAttachments(itemMsg);
}

clearattachZimlet.prototype.removeAllAttachments = 
function(itemMsg) {
	if (!itemMsg._loaded) {
		itemMsg.load({forceLoad:true, callback: new AjxCallback(this, this.removeAllAttachments, [itemMsg])});
		return;
	}
	var listAttachments = itemMsg.getAttachmentInfo(true, false, false);
	var listAttachmentsParts = [];
	for (var i in listAttachments) {
		listAttachmentsParts.push(listAttachments[i].part);
	}
	itemMsg.removeAttachments(listAttachmentsParts, new AjxCallback(this, this._handleRemoveAttachments, [itemMsg]));
}

clearattachZimlet.prototype._handleRemoveAttachments = 
function(itemMsg, result) {
	var currCtrl = appCtxt.getCurrentController();
	var currList = appCtxt.getCurrentList();
}
