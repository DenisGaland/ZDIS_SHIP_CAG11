sap.ui.define([
	"sap/ui/core/mvc/Controller",
	//"Press_Shop_Fiori/TABLE/TableExampleUtils",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/core/BusyIndicator"
], function(Controller, MessageToast, MessageBox, JSONModel, ODataModel, BusyIndicator) {
	"use strict";

	return Controller.extend("Press_Shop_Fiori4.controller.Master", {
		//Init flux
		onInit: function() {
			var oView = this.getView();
			var osite = oView.byId("__PLANT");
			//Function module ZFIORI_GET_PLANT_OF_USER
			var URL = "/sap/opu/odata/sap/ZGET_PLANT_SRV/S_T001WSet(Type='')";
			debugger;
			BusyIndicator.show();
			OData.read(URL, function(response) {
				BusyIndicator.hide();
				var site = response.EPlant + " " + response.ET001w.Name1;
				osite.setText(site);
				jQuery.sap.delayedCall(500, this, function() {
					oView.byId("CAGE").focus();
				});
			}, function() {
				BusyIndicator.hide();
			});
		},

		// Scan Cage              
		CheckCage: function() {
			var oView = this.getView();
			var oController = oView.getController();
			var cage = oView.byId("CAGE").getValue();
			// Function module Z_CHECK_SCAN_VALUE
			var URL = "/sap/opu/odata/sap/ZCHECK_VALUE_SCAN_SRV/MessageSet(PValue='05" + cage + "')";
			debugger;
			BusyIndicator.show();
			OData.read(URL, function(response) {
				BusyIndicator.hide();
				if (response.EMessage !== "" && response.EZtype === "E") {
					var path = $.sap.getModulePath("Press_Shop_Fiori4", "/audio");
					var aud = new Audio(path + "/MOREINFO.png");
					aud.play();
					oView.byId("CAGE").setValue("");
					MessageBox.show(response.EMessage, MessageBox.Icon.ERROR);
				} else {
					oController.ShipCage();
				}
			}, function() {
				BusyIndicator.hide();
			});
		},

		ShipCage: function() {
			var oView = this.getView();
			var cage = oView.byId("CAGE").getValue();
			//Function mdoule Z_GET_BOX_CONTENT
			var URL = "/sap/opu/odata/sap/ZRETURN_DC_SRV/ItemsSet(ZembArt='E" + cage + "')";
			debugger;
			BusyIndicator.show();
			OData.read(URL, function(response) {
				BusyIndicator.hide();
				if (response.E_MESSAGE !== "" && response.E_ZTYPE === "E") {
					var path = $.sap.getModulePath("Press_Shop_Fiori4", "/audio");
					var aud = new Audio(path + "/MOREINFO.png");
					aud.play();
					oView.byId("CAGE").setValue("");
					MessageBox.show(response.E_MESSAGE, MessageBox.Icon.ERROR);
				} else {
					oView.byId("CAGE").setValue("");
					MessageBox.show(response.E_MESSAGE, MessageBox.Icon.INFORMATION);
				}
			}, function() {
				BusyIndicator.hide();
			});
		}
	});
});