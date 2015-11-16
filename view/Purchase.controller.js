sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	//'sap/ui/core/Fragment',
	'sap/ui/model/Filter',
	'sap/ui/model/Sorter',
	'sap/ui/model/json/JSONModel'
], function(jQuery, Controller, Filter, Sorter, JSONModel, utilities, Fragment) {
	"use strict";
	sap.ui.controller("GoodsReceipt1.view.Purchase", {
		onInit: function() {
	//		var oModel = new JSONModel({data: {}});
	//		this.getView().setModel(oModel);
			/*var myModel = new sap.ui.model.json.JSONModel();
		var json = {};
		var test = this.getView().byId("__input8").getValue();
		json.mySecret = test;
		myModel.setData(json);
		
	//	myModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
		
		sap.ui.getCore().setModel(myModel);*/
			//----------------------
			var data = {
				"Collection": [{
					"id": "1"
				}]
			};
			//Create Model  
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(data);
			//Storage  
			jQuery.sap.require("jquery.sap.storage");
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			//Check if there is data into the Storage  
			if (oStorage.get("myLocalData")) {
				console.log("Data is from Storage!");
				var oData = oStorage.get("myLocalData");
				oModel.setData(oData);
			}
			//----------------------
			var view = this.getView();
			this.getRouter().attachRouteMatched(function(oEvent) {
				var sContextPath = new sap.ui.model.Context(view.getModel(), "/" +
					oEvent.getParameter("arguments").item);
				view.setBindingContext(sContextPath);
			}, this);
		},

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		// Function to create the dialog
		openDialog: function() {
			var oDialog1 = new sap.m.Dialog();
			oDialog1.setTitle("My first Dialog");
			var oText = this.getView().byId("__input4").getValue();

			oDialog1.addContent(oText);
			oDialog1.addButton(new sap.ui.commons.Button({
				text: "OK",
				press: function() {
					oDialog1.close();
				}
			}));
			oDialog1.open();
		},

		overView: function() {
		this.getView().byId("__filter0");
		
			var combo11 = this.getView().byId("combo1").getValue();
			jQuery.sap.require("jquery.sap.storage");
			
			this.getView().byId("__label17").setText(combo11);

			var input = this.getView().byId("__select1").getSelectedItem().getText();
			
			this.getView().byId("__label31").setText(input);

			var input31 = this.getView().byId("input3").getValue();
			var input32 = this.getView().byId("__input4").getValue();
			this.getView().byId("__label35").setText(input31);
			this.getView().byId("__label37").setText(input32);

			var combo21 = this.getView().byId("combo2").getValue();
			this.getView().byId("__label41").setText(combo21);

			var input61 = this.getView().byId("__input6").getValue();
			this.getView().byId("__label45").setText(input61);

			var input71 = this.getView().byId("__input7").getValue();
			this.getView().byId("__label49").setText(input71);

			var text1 = this.getView().byId("__input7").getValue();
			this.getView().byId("__label17").setText(text1);
		},

		/*	browserStorage : function(){
		jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		oStorage.put("dataStorage", "Jbeli");
		 var dataRetrieve = oStorage.get("dataStorage");
		 var text1 = this.getView().byId("__input7").getValue();
		 this.getView().byId("__label17").setText(text1);
	//	alert(dataRetrieve );
		
		
	},	*/
	handleLiveChange: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			this.getView().byId("getValue").setText(sValue);
		},

//	return CController,
		onNavBack: function() {
			this.getRouter().myNavBack("detail");
		}
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf view.Purchase
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf view.Purchase
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf view.Purchase
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf view.Purchase
		 */
		//	onExit: function() {
		//
		//	}

	});
});