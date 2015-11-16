sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	//'sap/ui/core/Fragment',
	'sap/ui/model/Filter',
	'sap/ui/model/Sorter',
	'sap/ui/model/json/JSONModel'
], function(jQuery, Controller, Filter, Sorter, JSONModel, utilities, Fragment) {
	"use strict";

	return sap.ui.core.mvc.Controller.extend("GoodsReceipt1.view.Detail", {

		onInit: function() {
			this._oAssignDialog = null;
			this._oView = this.getView();
			this.oInitialLoadFinishedDeferred = jQuery.Deferred();
 
			if (sap.ui.Device.system.phone) {
				//Do not wait for the master when in mobile phone resolution
				this.oInitialLoadFinishedDeferred.resolve();
			} else {
				this.getView().setBusy(true);
				var oEventBus = this.getEventBus();
				oEventBus.subscribe("Component", "MetadataFailed", this.onMetadataFailed, this);
				oEventBus.subscribe("Master", "InitialLoadFinished", this.onMasterLoaded, this);
			}

			this.getRouter().attachRouteMatched(this.onRouteMatched, this);
		},

		onMasterLoaded: function(sChannel, sEvent) {
			this.getView().setBusy(false);
			this.oInitialLoadFinishedDeferred.resolve();
		},

		onMetadataFailed: function() {
			this.getView().setBusy(false);
			this.oInitialLoadFinishedDeferred.resolve();
			this.showEmptyView();
		},

		onRouteMatched: function(oEvent) {
			var oParameters = oEvent.getParameters();

			jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(function() {
				var oView = this.getView();

				// When navigating in the Detail page, update the binding context 
				if (oParameters.name !== "detail") {
					return;
				}

				var sEntityPath = "/" + oParameters.arguments.entity;
				this.bindView(sEntityPath);

				var oIconTabBar = oView.byId("idIconTabBar");
				oIconTabBar.getItems().forEach(function(oItem) {
					if (oItem.getKey() !== "selfInfo") {
						oItem.bindElement(oItem.getKey());
					}
				});

				// Specify the tab being focused
				var sTabKey = oParameters.arguments.tab;
				this.getEventBus().publish("Detail", "TabChanged", {
					sTabKey: sTabKey
				});

				if (oIconTabBar.getSelectedKey() !== sTabKey) {
					oIconTabBar.setSelectedKey(sTabKey);
				}
			}, this));

		},

		bindView: function(sEntityPath) {
			var oView = this.getView();
			oView.bindElement(sEntityPath);

			//Check if the data is already on the client
			if (!oView.getModel().getData(sEntityPath)) {

				// Check that the entity specified was found.
				oView.getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function() {
					var oData = oView.getModel().getData(sEntityPath);
					if (!oData) {
						this.showEmptyView();
						this.fireDetailNotFound();
					} else {
						this.fireDetailChanged(sEntityPath);
					}
				}, this));

			} else {
				this.fireDetailChanged(sEntityPath);
			}

		},

		showEmptyView: function() {
			this.getRouter().myNavToWithoutHash({
				currentView: this.getView(),
				targetViewName: "GoodsReceipt1.view.NotFound",
				targetViewType: "XML"
			});
		},

		fireDetailChanged: function(sEntityPath) {
			this.getEventBus().publish("Detail", "Changed", {
				sEntityPath: sEntityPath
			});
		},

		fireDetailNotFound: function() {
			this.getEventBus().publish("Detail", "NotFound");
		},

		onNavBack: function() {
			// This is only relevant when running on phone devices
			this.getRouter().myNavBack("main");
		},

		onDetailSelect: function(oEvent) {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("detail", {
				entity: oEvent.getSource().getBindingContext().getPath().slice(1),
				tab: oEvent.getParameter("selectedKey")
			}, true);
		},

		openActionSheet: function() {

			if (!this._oActionSheet) {
				this._oActionSheet = new sap.m.ActionSheet({
					buttons: new sap.ushell.ui.footerbar.AddBookmarkButton()
				});
				this._oActionSheet.setShowCancelButton(true);
				this._oActionSheet.setPlacement(sap.m.PlacementType.Top);
			}

			this._oActionSheet.openBy(this.getView().byId("actionButton"));
		},

		getEventBus: function() {
			return sap.ui.getCore().getEventBus();
		},

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onItemDetailPressed: function(oEvent) {
		//	var oSelectedItem = oEvent.getParameters().listItem;
			
			var sPath = oEvent.getSource().getBindingContext().getPath().slice(1);

			this.getRouter().navTo("purchase", {
				from: "detail",
				entity: "Purchase",
				item: sPath
			}, false);

		},

		onPress: function() {
			this._Dialog = sap.ui.xmlfragment("GoodsReceipt1.Fragment.Dialog",
				this);
			this._Dialog.open();
		},

		// onClose event handler of the fragment
		onClose: function() {
			this._Dialog.close();
		},
		
	/*	onSearch: function() {
			this.oInitialLoadFinishedDeferred = jQuery.Deferred();
			// Add search filter
			var filters = [];
			var searchString = this.getView().byId("field0").getValue();
			if (searchString && searchString.length > 0) {
				filters = [new sap.ui.model.Filter("Tanum", sap.ui.model.FilterOperator.Contains, searchString)];
			}
			// Update list binding
			this.getView().byId("idItemsTable").getBinding("items").filter(filters);

			//On phone devices, there is nothing to select from the list
			if (sap.ui.Device.system.phone) {
				return;
			}

			//Wait for the list to be reloaded
			this.waitForInitialListLoading(function() {
				//On the empty hash select the first item
				this.selectFirstItem();
			});
		},*/

	//---------------------------------
	_createDialog: function(sDialog) {
			var oDialog = sap.ui.xmlfragment(sDialog, this);
			utilities.attachControl(this._oView, oDialog);
			return oDialog;
		},

		
			_fnGroup: function(oContext) {
			var sName = oContext.getProperty("Tostat");

			return {
				key: sName,
				text: sName
			};
		},

		onReset: function(oEvent) {
			this.bGrouped = false;
			this.bDescending = false;
			this.sSearchQuery = 0;
			this.byId("maxPrice1").setValue("");

			this.fnApplyFiltersAndOrdering();
		},

		onGroup: function(oEvent) {
			this.bGrouped = !this.bGrouped;
			this.fnApplyFiltersAndOrdering();
		},
		onSort: function(oEvent) {
			this.bDescending = !this.bDescending;
			this.fnApplyFiltersAndOrdering();
		},
		onFilter: function(oEvent) {
			this.sSearchQuery = oEvent.getSource().getValue();
			this.fnApplyFiltersAndOrdering();
		},
		
		fnApplyFiltersAndOrdering: function(oEvent) {
			var aFilters = [],
				aSorters = [];

			if (this.bGrouped) {
				aSorters.push(new Sorter("Priority", this.bDescending, this._fnGroup));
			} else {
				aSorters.push(new Sorter("Priority", this.bDescending));
			}

			if (this.sSearchQuery) {
				var oFilter = new Filter("Tanum", sap.ui.model.FilterOperator.Contains, this.sSearchQuery);
				aFilters.push(oFilter);
			}

			this.byId("idItemsTable1").getBinding("items").filter(aFilters).sort(aSorters);
		},

	//---------------------------------
	
		onLineItemPressed: function(oEvent) {
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("GoodsReceipt1.Fragment.Dialog", this);
				this.getView().addDependent(this._oPopover);
			}

			this._oPopover.openBy(oEvent.getSource());
		},
		
		

		Splitting : function(){
			//alert(this.getView());
			var splitapp = sap.ui.getCore().byId("__xmlview2");
			console.log("splitapp",splitapp);
			splitapp.toDetail("__xmlview2");
		},
		
		onExit: function(oEvent) {
			var oEventBus = this.getEventBus();
			oEventBus.unsubscribe("Master", "InitialLoadFinished", this.onMasterLoaded, this);
			oEventBus.unsubscribe("Component", "MetadataFailed", this.onMetadataFailed, this);
			if (this._oActionSheet) {
				this._oActionSheet.destroy();
				this._oActionSheet = null;
			}
		}
	});
});