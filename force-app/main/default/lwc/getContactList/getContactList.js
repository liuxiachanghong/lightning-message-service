import { LightningElement, wire, api } from "lwc";
import getContacts from "@salesforce/apex/ContactController.getContacts";
import { deleteRecord } from "lightning/uiRecordApi"; // delete action
import { ShowToastEvent } from "lightning/platformShowToastEvent"; // import showToast

import { subscribe, MessageContext } from "lightning/messageService";
import FINISH_FLOW_CHANNEL from "@salesforce/messageChannel/finishFlow__c";

export default class GetContactList extends LightningElement {
  @api recordId;
  rows = [];
  columns = [];

  @wire(MessageContext)
  messageContext;
  subscription = null;

  handleGetContacts() {
    getContacts({
      recordId: this.recordId,
    })
      .then((result) => {
        this.rows = result;
      })
      .catch((error) => {
        this.error = error;
      });
  }

  connectedCallback() {
    this.columns = [
      {
        type: "action",
        typeAttributes: { rowActions: [{ label: "Delete", name: "delete" }] },
      },
      { label: "Id", fieldName: "Id" },
      { label: "Last Name", fieldName: "LastName" },
      { label: "First Name", fieldName: "FirstName" },
      { label: "Email", fieldName: "Email" },
      { label: "Phone", fieldName: "Phone" },
    ];
    this.subscribeToChannel();
  }

  subscribeToChannel() {
    // Subscribe to the message channel
    if (this.subscription) {
      return;
    }
    this.subscription = subscribe(
      this.messageContext,
      FINISH_FLOW_CHANNEL,
      (message) => this.handleMessage()
    );
  }

  // Subscribing to the message channel debug
  handleMessage() {
    this.handleGetContacts(); // to refresh the datatable
    const params = {
      message: "Subscribed Successfully",
      mode: "dismissable",
      variant: "success",
    };
    this.handleShowToast(params);
  }

  handleRowAction(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;
    switch (actionName) {
      case "delete":
        this.handleDelete(event);
        break;
      default:
    }
  }

  handleDelete(event) {
    const row = event.detail.row;
    deleteRecord(row.Id).then(() => {
      const params = {
        message: "Deleted",
        mode: "dismissable",
        variant: "alert",
      };
      this.handleGetContacts(); // to refresh the datatable
      this.handleShowToast(params);
    });
  }

  handleShowToast(params) {
    const event = new ShowToastEvent(params);
    this.dispatchEvent(event);
  }
}