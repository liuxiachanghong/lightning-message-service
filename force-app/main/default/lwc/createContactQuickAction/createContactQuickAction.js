import { LightningElement, wire, api } from "lwc";
import { CloseActionScreenEvent } from "lightning/actions";
import { publish, MessageContext } from "lightning/messageService";
import FINISH_FLOW_CHANNEL from "@salesforce/messageChannel/finishFlow__c";

export default class CreateContactQuickAction extends LightningElement {
  flowName = "Create_Contact";

  @wire(MessageContext)
  messageContext;

  inputVariables = [];

  _recordId;
  @api
  get recordId() {
    return this._recordId;
  }

  set recordId(value) {
    if (value !== this._recordId) {
      this._recordId = value;
      this.inputVariables = [
        {
          name: "recordId",
          type: "String",
          value: value,
        },
      ];
    }
  }

  handleFlowFinish(event) {
    if (event.detail.status === "FINISHED") {
      const message = {
        recordId: this.recordId,
        status: event.detail.status,
      };
      this.dispatchEvent(new CloseActionScreenEvent());

      // Publish the message
      publish(this.messageContext, FINISH_FLOW_CHANNEL, message);
    }
  }
}