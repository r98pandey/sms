import { filter } from "rxjs/operators";
import { event } from "jquery";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "app-flow-chart-with-digram",
  templateUrl: "./flow-chart-with-digram.component.html",
  styleUrls: ["./flow-chart-with-digram.component.scss"],
})
export class FlowChartWithDigramComponent implements OnInit, OnChanges {
  valueObject: any = [];
  @Input() isBillingRequired = "";
  @Input() isGlobal = "";
  @Input() SeviceType = "Service";
  @Input() ticketStatusId: number = 0;
  @Input() incindetTechSignImageURL: any = null;
  @Input() incindetClientSignImageURL: any = null;
  @Input() workFlowRequired: any[] = [];
  @Output() sendToActivingForTab = new EventEmitter();

  // Quotation Requiring Approval From The Client Process
  ngOnInit() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.SeviceType == "Service") {
      if (this.isBillingRequired === "null") {
        console.log("isBillingRequired", this.isBillingRequired);
        this.valueObject = this.getObjectWithIsBillingRequiredNull(
          this.ticketStatusId
        );
      }
      if (this.isBillingRequired == "false") {
        console.log("isBillingRequired", this.isBillingRequired);
        this.valueObject = this.getObjectWithIsBillingRequiredFalse(
          this.ticketStatusId
        );
      }
      if (this.isGlobal == "false") {
        console.log("isGlobal", this.isGlobal);
        this.valueObject = this.getObjectWithIsGlobalFalse(this.ticketStatusId);
      }
      if (this.isBillingRequired == "true" && this.isGlobal == "true") {
        console.log("isGlobal", this.isGlobal);
        console.log("isBillingRequired", this.isBillingRequired);
        this.valueObject = this.getObjectWithIsGlobalTrueIsBillingRequiredTrue(
          this.ticketStatusId
        );
      }
    } else {
      if (this.isBillingRequired === "null") {
        console.log("isBillingRequired", this.isBillingRequired);
        this.valueObject = this.getObjectWithIsBillingRequiredNull(
          this.ticketStatusId
        );
      }
      if (this.isBillingRequired == "false") {
        console.log("isBillingRequired", this.isBillingRequired);
        this.valueObject = this.getObjectWithIsBillingRequiredFalseIncident(
          this.ticketStatusId
        );
      }
      if (this.isGlobal == "false") {
        console.log("isGlobal", this.isGlobal);
        this.valueObject = this.getObjectWithIsGlobalFalse(this.ticketStatusId);
      }
      if (this.isBillingRequired == "true" && this.isGlobal == "true") {
        console.log("isGlobal", this.isGlobal);
        console.log("isBillingRequired", this.isBillingRequired);
        this.valueObject =
          this.getObjectWithIsGlobalTrueIsBillingRequiredTrueIncident(
            this.ticketStatusId
          );
      }
    }
  }

  getObjectWithIsBillingRequiredNull(TicketStatusId: any) {
    console.log("hello2")
    let object: any;
    if (TicketStatusId == 48) {
      object = [
        {
          title:
            "The ticket is currently awaiting action from the help desk to escalate the further process to either the technical team or the finance team, ensuring service continuity",
          subTitle: "",
          background: "danger",
          boxRequired: true,
        },
      ];
    } //Billing Eligibility Process
    else if (TicketStatusId == 51) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Billing Verification",
          subTitle:
            "The ticket is currently undergoing the billing check process. If approved, a quotation for the ticket can be generated. If rejected, a Service Order (SO) can be generated instead",
          background: "danger",
          boxRequired: false,
        },
      ];
    } else if (TicketStatusId == 19) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Canceled",
          subTitle: "The ticket has been canceled",
          background: "blur",
          boxRequired: false,
        },
      ];
    }
    return object;
  }
  getObjectWithIsBillingRequiredFalse(TicketStatusId: any) {
    console.log("hello3")
    let object: any;
    if (TicketStatusId == 52) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Service Order",
          subTitle:
            "The ticket is undergoing the service order generation process.",
          background: "danger",
          boxRequired: false,
        },
        {
          title: "Task",
          subTitle:
            "Awaiting the member to commence the task for the service order",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Internal Verification",
          subTitle: "Awaiting completion of the task for verification process",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle:
            "The internal  verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          background: "warning",
          boxRequired: false,
        },
      ];
    } else if (TicketStatusId == 34) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Task",
          subTitle: "The work has been Started by the Member. ",
          background: "danger",
          boxRequired: false,
        },
        {
          title: "Internal Verification",
          subTitle: "Awaiting completion of the task for verification process.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle:
            "The internal  verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          background: "warning",
          boxRequired: false,
        },
      ];
    } else if (TicketStatusId == 30) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Task",
          subTitle: "The work has been Started by the Member. ",

          background: "danger",
          boxRequired: false,
        },
        {
          title: "Internal Verification",
          subTitle: "Awaiting completion of the task for verification process.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle:
            "The internal  verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          background: "warning",
          boxRequired: false,
        },
      ];
    }
    else if (TicketStatusId == 72) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          background: "success",
          boxRequired: false,
        },
        {
        title: "Task",
        subTitle: "The task has been completed by the member",
        background: "success",
        boxRequired: false,},
        {
          title: "Internal Verification",
          subTitle:
            "The work has been completed, and it is now undergoing a Acknowledgement process by Admin.",
          boxRequired: false,
          background: "danger",
        },
        {
          title: "Client Verification",
          subTitle:
            " The internal  verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          background: "warning",
          boxRequired: false,
        },
      ];
    } 
    else if (TicketStatusId == 29) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Task",
          subTitle: "The work has been Started by the Member. ",
          background: "danger",
          boxRequired: false,
        },
        {
          title: "Internal Verification",
          subTitle: "Awaiting completion of the task for verification process.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle:
            " The internal  verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          background: "warning",
          boxRequired: false,
        },
      ];
    } else if (TicketStatusId == 61) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Task",
          subTitle: "The task has been completed by the member",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Internal Verification",
          subTitle:
            "The work has been completed, and it is now undergoing a Acknowledgement process by Admin.",
          boxRequired: false,
          background: "danger",
        },
        {
          title: "Client Verification",
          subTitle:
            "The internal  verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          background: "warning",
          boxRequired: false,
        },
      ];
    } else if (TicketStatusId == 31) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Task",
          subTitle: "The task has been completed by the member",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Internal Verification",
          subTitle: "The internal verification has been completed",
          background: "success",
        },
        {
          title: "Client Verification",
          subTitle: "The ticket is undergoing closure process by the client.",
          background: "danger",
          boxRequired: false,
        },
      ];
    } else if (TicketStatusId == 32) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Task",
          subTitle: "The task has been completed by the member",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Internal Verification",
          subTitle: "The internal verification has been completed",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle:
            "The Ticket has passed client verification, the ticket is closed now.",
          background: "success",
          boxRequired: false,
        },
      ];
    } else if (TicketStatusId == 19) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Canceled",
          subTitle: "The ticket has been canceled",
          background: "blur",
          boxRequired: false,
        },
      ];
    }
    return object;
  }
  getObjectWithIsGlobalFalse(TicketStatusId: any) {
    console.log("hello4")
    let object: any;

    if (TicketStatusId == 48) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Service Order",
          subTitle:
            "The ticket is undergoing the service order generation process",
          background: "danger",
          boxRequired: false,
        },
        {
          title: "Task",
          subTitle:
            "Awaiting the member to commence the task for the service order.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Internal Verification",
          subTitle: "Awaiting completion of the task for verification process",
          background: "warning",
          boxRequired: false,
        },
      ];
    } else if (TicketStatusId == 52) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
        },
        {
          title: "Service Order",
          subTitle:
            "The ticket is undergoing the service order generation process",
          background: "danger",
        },
        {
          title: "Task",
          subTitle:
            "Awaiting the member to commence the task for the service order.",
          background: "warning",
        },
        {
          title: "Internal Verification",
          subTitle: "Awaiting completion of the task for verification process",
          background: "warning",
          boxRequired: false,
        },
      ];
    } else if (TicketStatusId == 51) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle:
            "The ticket is currently undergoing the billing check process. If approved, a quotation for the ticket can be generated. If rejected, a Service Order (SO) can be generated instead",

          boxRequired: false,
          background: "danger",
        },
      ];
    } else if (TicketStatusId == 30) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Task",
          subTitle: "The work has been Started by the Member. ",
          boxRequired: false,
          background: "danger",
        },
        {
          title: "Internal Verification",
          subTitle: "Awaiting completion of the task for verification process",

          boxRequired: false,
          background: "warning",
        },
      ];
    } 
    else if (TicketStatusId == 72) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Task",
          subTitle: "The task has been completed by the member.",
          boxRequired: false,
          background: "success",
        },{
          title: "Internal Verification",
          subTitle:
            " The work has been completed, and it is now undergoing a recheck/review process.",
          boxRequired: false,
          background: "danger",
        },
      ];
    } else if (TicketStatusId == 34) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Service Order",
          subTitle: " The service order has been generated for the ticket.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Task",
          subTitle: "The work has been Started by the Member. ",
          boxRequired: false,
          background: "danger",
        },
        {
          title: "Internal Verification",
          subTitle:
            " Awaiting completion of the task for verification process.",
          boxRequired: false,
          background: "warning",
        },
      ];
    } else if (TicketStatusId == 29) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Service Order",
          subTitle: " The service order has been generated for the ticket.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Task",
          subTitle: "The work has been Started by the Member. ",
          boxRequired: false,
          background: "danger",
        },
        {
          title: "Internal Verification",
          subTitle:
            " Awaiting completion of the task for verification process.",
          boxRequired: false,
          background: "warning",
        },
      ];
    } else if (TicketStatusId == 61) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Task",
          subTitle: "The task has been completed by the member.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Internal Verification",
          subTitle:
            " The work has been completed, and it is now undergoing a recheck/review process.",
          boxRequired: false,
          background: "danger",
        },
      ];
    } else if (TicketStatusId == 32) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Task",
          subTitle: "The task has been completed by the member.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Internal Verification",
          subTitle:
            "The internal verification has been completed; now, the ticket is closed.",
          background: "success",
          boxRequired: false,
        },
      ];
    } else if (TicketStatusId == 19) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Canceled",
          subTitle: "The ticket has been canceled",
          background: "blur",
          boxRequired: false,
        },
      ];
    }
    return object;
  }
  getObjectWithIsGlobalTrueIsBillingRequiredTrue(TicketStatusId: any) {
    console.log("hello5")
    let object: any;
    if (TicketStatusId == 53) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle:
            "The billing process has been approved, and now this ticket is awaiting the generation of a quotation.",
          boxRequired: false,
          background: "danger",
        },
        {
          title: "Quotation Internal Verification",
          subTitle:
            " Awaiting internal quotation verification process, to proceed first, it is required to generate the quotation.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            "Awaiting client quotation verification to complete the internal quotation verification process.",
          boxRequired: false,
          background: "warning",
        },

        {
          title: "Service Order",
          subTitle: "Waiting to generate the service order.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Task",
          subTitle:
            "Awaiting the member to commence the task for the service order.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Internal Verification",
          subTitle: "Awaiting completion of the task for verification process.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Client Verification",
          subTitle:
            " The internal  verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.  ",
          boxRequired: false,
          background: "warning",
        },
      ];
    } else if (TicketStatusId == 57) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: `Quotation Internal Verification${this.getRequriedData() ? "" : "-Rejected"
            }`,
          subTitle: this.getRequriedData()
            ? " Internal Quotation verification process is completed successfully. "
            : "The quotation has been generated successfully, and now this ticket is undergoing the internal quotation Verification process.",
          boxRequired: false,
          background: this.getRequriedData() ? "success" : "danger",
        },
        {
          title: `Quotation Client Verification${this.getRequriedData() ? "-Rejected" : ""
            }`,
          subTitle: this.getRequriedData()
            ? "The quotation has passed internal verification, and now this ticket is undergoing the client quotation Verification process."
            : "Awaiting client quotation verification to complete the internal quotation verification process.",
          boxRequired: false,
          background: this.getRequriedData() ? "danger" : "warning",
        },

        {
          title: "Service Order",
          subTitle: this.getRequriedData()
            ? "The Ticket has been Rejected"
            : "Waiting to generate the service order.",
          boxRequired: false,
          background: this.getRequriedData() ? "blur" : "warning",
        },
        {
          title: "Task",
          subTitle: this.getRequriedData()
            ? "The Ticket has been Rejected"
            : "Awaiting the member to commence the task for the service order.",
          boxRequired: false,
          background: this.getRequriedData() ? "blur" : "warning",
        },
        {
          title: "Internal Verification",
          subTitle: this.getRequriedData()
            ? "The Ticket has been Rejected"
            : "Awaiting completion of the task for verification process.",
          boxRequired: false,
          background: this.getRequriedData() ? "blur" : "warning",
        },
        {
          title: "Client Verification",
          subTitle: this.getRequriedData()
            ? "The Ticket has been Rejected"
            : " The internal  verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          boxRequired: false,
          background: this.getRequriedData() ? "blur" : "warning",
        },
      ];
    } else if (TicketStatusId == 54) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",

          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Internal Verification",
          subTitle:
            "The quotation has been generated successfully, and now this ticket is undergoing the internal quotation Verification process.",
          boxRequired: false,
          background: "danger",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            "The internal quotation verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          boxRequired: false,
          background: "warning",
        },

        {
          title: "Service Order",
          subTitle: "Waiting to generate the service order.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Task",
          subTitle:
            "Awaiting the member to commence the task for the service order.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Internal Verification",
          subTitle: "Awaiting completion of the task for verification process.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Client Verification",
          subTitle:
            "The internal quotation verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          boxRequired: false,
          background: "warning",
        },
      ];
    } else if (TicketStatusId == 55) {
      console.log("hh")
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Internal Verification",
          subTitle:
            "Internal Quotation verification process is completed successfully. ",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            "The quotation has passed internal verification, and now this ticket is undergoing the client quotation Verification process.",
          boxRequired: false,
          background: "danger",
        },

        {
          title: "Service Order",
          subTitle: "Waiting to generate the service order.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Task",
          subTitle:
            "Awaiting the member to commence the task for the service order.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Internal Verification",
          subTitle: "Awaiting completion of the task for verification process.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Client Verification",
          subTitle:
            "The internal quotation verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          boxRequired: false,
          background: "warning",
        },
      ];
    } else if (TicketStatusId == 52) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Internal Verification",
          subTitle:
            "Internal Quotation verification process is completed successfully. ",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            "Client Quotation verification process completed successfully.",

          boxRequired: false,
          background: "success",
        },

        {
          title: "Service Order",
          subTitle:
            "The ticket is undergoing the service order generation process.",
          boxRequired: false,
          background: "danger",
        },
        {
          title: "Task",
          subTitle:
            "Awaiting the member to commence the task for the service order.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Internal Verification",
          subTitle: "Awaiting completion of the task for verification process.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Client Verification",
          subTitle:
            "The internal quotation verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          boxRequired: false,
          background: "warning",
        },
      ];
    } else if (TicketStatusId == 34) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Internal Verification",
          subTitle:
            "Internal Quotation verification process is completed successfully. ",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            "Client Quotation verification process completed successfully.",
          boxRequired: false,
          background: "success",
        },

        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Task",
          subTitle: "The work has been Started by the Member. ",

          boxRequired: false,
          background: "danger",
        },
        {
          title: "Internal Verification",
          subTitle: "Awaiting completion of the task for verification process.",

          boxRequired: false,
          background: "warning",
        },
        {
          title: "Client Verification",
          subTitle:
            "The internal verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",

          boxRequired: false,
          background: "warning",
        },
      ];
    } else if (TicketStatusId == 30) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Internal Verification",
          subTitle:
            "Internal Quotation verification process is completed successfully. ",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            "Client Quotation verification process completed successfully.",
          boxRequired: false,
          background: "success",
        },

        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Task",
          subTitle: "The work has been Started by the Member. ",
          boxRequired: false,
          background: "danger",
        },
        {
          title: "Internal Verification",
          subTitle: "Awaiting completion of the task for verification process.",

          boxRequired: false,
          background: "warning",
        },
        {
          title: "Client Verification",
          subTitle:
            "The internal verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",

          boxRequired: false,
          background: "warning",
        },
      ];
    } else if (TicketStatusId == 29) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Internal Verification",
          subTitle:
            "Internal Quotation verification process is completed successfully. ",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            "Client Quotation verification process completed successfully.",
          boxRequired: false,
          background: "success",
        },

        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Task",
          subTitle: "The work has been Started by the Member. ",
          boxRequired: false,
          background: "danger",
        },
        {
          title: "Internal Verification",
          subTitle: "Awaiting completion of the task for verification process.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Client Verification",
          subTitle:
            "The internal verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          boxRequired: false,
          background: "warning",
        },
      ];
    } else if (TicketStatusId == 61) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Internal Verification",
          subTitle:
            "Internal Quotation verification process is completed successfully. ",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            "Client Quotation verification process completed successfully.",
          boxRequired: false,
          background: "success",
        },

        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Task",
          subTitle: "The task has been completed by the member.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Internal Verification",
          subTitle:
            "The work has been completed, and it is now undergoing a Acknowledgement process by Admin.",
          boxRequired: false,
          background: "danger",
        },
        {
          title: "Client Verification",
          subTitle:
            "The internal  verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          boxRequired: false,
          background: "warning",
        },
      ];
    }else if (TicketStatusId == 72) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Internal Verification",
          subTitle:
            "Internal Quotation verification process is completed successfully. ",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            "Client Quotation verification process completed successfully.",
          boxRequired: false,
          background: "success",
        },

        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Task",
          subTitle: "The task has been completed by the member.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Internal Verification",
          subTitle:
            "The work has been completed, and it is now undergoing a Acknowledgement process by Admin.",
          boxRequired: false,
          background: "danger",
        },
        {
          title: "Client Verification",
          subTitle:
            "The internal  verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          boxRequired: false,
          background: "warning",
        },
      ];
    } else if (TicketStatusId == 31) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Internal Verification",
          subTitle:
            "Internal Quotation verification process is completed successfully. ",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            "Client Quotation verification process completed successfully.",
          boxRequired: false,
          background: "success",
        },

        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Task",
          subTitle: "The task has been completed by the member.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Internal Verification",
          subTitle: " The internal verification has been completed.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Client Verification",
          subTitle: "The ticket is undergoing closure process by the client.",
          boxRequired: false,
          background: "danger",
        },
      ];
    } else if (TicketStatusId == 32) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Internal Verification",
          subTitle:
            "Internal Quotation verification process is completed successfully. ",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            "Client Quotation verification process completed successfully.",
          boxRequired: false,
          background: "success",
        },

        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",

          boxRequired: false,
          background: "success",
        },
        {
          title: "Task",
          subTitle: "The task has been completed by the member.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Internal Verification",
          subTitle: "The internal verification has been completed.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Client Verification",
          subTitle:
            "The Ticket has passed client verification, the ticket is closed now.",
          boxRequired: false,
          background: "success",
        },
      ];
    } else if (TicketStatusId == 19) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Canceled",
          subTitle: "The ticket has been canceled",
          background: "blur",
          boxRequired: false,
        },
      ];
    }
    return object;
  }
  getObjectWithIsBillingRequiredFalseIncident(TicketStatusId: any) {
    console.log("hello6")
    let object: any;
    if (TicketStatusId == 52) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Service Order",
          subTitle:
            "The ticket is undergoing the service order generation process.",
          background: "danger",
          boxRequired: false,
        },
        {
          title: "Task",
          subTitle:
            "Awaiting the member to commence the task for the service order.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Internal Verification",
          subTitle:
            " The work has been completed, and it is now undergoing a Acknowledgement process by Admin.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Tech Signature Process",
          subTitle:
            "The internal verification has been completed.awaiting member signature.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle: " The ticket is undergoing closure process by the client.",
          background: "warning",
          boxRequired: false,
          client: "Second",
        },
      ];
    } else if (TicketStatusId == 34) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Task",
          subTitle: " The work has been Started by the Member. ",
          background: "danger",
          boxRequired: false,
        },
        {
          title: "Internal Verification",
          subTitle:
            " The work has been completed, and it is now undergoing a Acknowledgement process by Admin.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Tech Signature Process",
          subTitle:
            "The internal verification has been completed.awaiting member signature.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle: " The ticket is undergoing closure process by the client.",
          background: "warning",
          boxRequired: false,
          client: "Second",
        },
      ];
    } else if (TicketStatusId == 30) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Task",
          subTitle: " The work has been Started by the Member. ",
          background: "danger",
          boxRequired: false,
        },
        {
          title: "Internal Verification",
          subTitle:
            " The work has been completed, and it is now undergoing a Acknowledgement process by Admin.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Tech Signature Process",
          subTitle:
            "The internal verification has been completed.awaiting member signature.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle: " The ticket is undergoing closure process by the client.",
          background: "warning",
          boxRequired: false,
          client: "Second",
        },
      ];
    } else if (TicketStatusId == 29) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Task",
          subTitle: " The work has been Started by the Member. ",
          background: "danger",
          boxRequired: false,
        },
        {
          title: "Internal Verification",
          subTitle:
            " The work has been completed, and it is now undergoing a Acknowledgement process by Admin.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Tech Signature Process",
          subTitle:
            "The internal verification has been completed.awaiting member signature.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle: " The ticket is undergoing closure process by the client.",
          background: "warning",
          boxRequired: false,
          client: "Second",
        },
      ];
    } else if (TicketStatusId == 61) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Task",
          subTitle: "The task has been completed by the member.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Internal Verification",
          subTitle:
            "The work has been completed, and it is now undergoing a Acknowledgement process by Admin.",
          boxRequired: false,
          background: "danger",
        },
        {
          title: "Tech Signature Process",
          subTitle: "Member Signature Pending.",
          background: "warning",
          boxRequired: false,
          client: "Second",
        },
        {
          title: "Client Verification",
          subTitle:
            "The internal  verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          background: "warning",
          boxRequired: false,
        },
      ];
    } else if (TicketStatusId == 31) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Task",
          subTitle: "The task has been completed by the member.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Internal Verification",
          subTitle: "The ticket is undergoing closure process by the client.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Tech Signature Process",
          subTitle:
            this.incindetTechSignImageURL == null
              ? "The internal verification has been completed.awaiting member signature."
              : "Member Signature Completed.",
          background:
            this.incindetTechSignImageURL == null ? "danger" : "success",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle:
            this.incindetTechSignImageURL == null ? "The internal  verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket." : this.incindetClientSignImageURL == null
              ? "The internal verification has been completed.awaiting Client signature."
              : "The Ticket has passed client verification, the ticket is closed now.",

          boxRequired: false,
          background:
            this.incindetTechSignImageURL == null ? "warning" : this.incindetClientSignImageURL == null ? "danger" : "success",

          client: "Second",
        },
      ];
    } else if (TicketStatusId == 32) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",

          boxRequired: false,
        },
        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Task",
          subTitle: " The task has been completed by the member.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Internal Verification",
          subTitle: " The internal verification has been completed.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Tech Signature Process",

          subTitle:
            this.incindetTechSignImageURL == null
              ? "The internal verification has been completed.awaiting member signature."
              : " Member Signature Completed.",
          background:
            this.incindetTechSignImageURL == null ? "danger" : "success",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle:
            this.incindetTechSignImageURL == null ? "The internal  verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket." : this.incindetClientSignImageURL == null
              ? "The internal verification has been completed.awaiting Client signature."
              : "The Ticket has passed client verification, the ticket is closed now.",

          boxRequired: false,
          background:
            this.incindetTechSignImageURL == null ? "warning" : this.incindetClientSignImageURL == null ? "danger" : "success",

          client: "Second",
        },
      ];
    } else if (TicketStatusId == 19) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Canceled",
          subTitle: "The ticket has been canceled",
          background: "blur",
          boxRequired: false,
        },
      ];
    }
    return object;
  }
  getObjectWithIsGlobalTrueIsBillingRequiredTrueIncident(TicketStatusId: any) {
    console.log("hello1")
    let object: any;
    if (TicketStatusId == 53) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle:
            "The billing process has been approved, and now this ticket is awaiting the generation of a quotation.",
          boxRequired: false,
          background: "danger",
        },
        {
          title: "Quotation Internal Verification",
          subTitle:
            "Awaiting internal quotation verification process, to proceed first, it is required to generate the quotation.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            " Awaiting client quotation verification to complete the internal quotation verification process.",
          boxRequired: false,
          background: "warning",
        },

        {
          title: "Service Order",
          subTitle: " Waiting to generate the service order.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Task",
          subTitle:
            "Awaiting the member to commence the task for the service order.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Internal Verification",
          subTitle:
            " Awaiting completion of the task for verification process.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Tech Signature Process",
          subTitle: "Member Signature Pending.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle:
            "The internal verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          boxRequired: false,
          background: "warning",
          client: "Second",
        },
      ];
    } else if (TicketStatusId == 57) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: `Quotation Internal Verification${this.getRequriedData() ? "" : "-Rejected"
            }`,
          subTitle: this.getRequriedData()
            ? "Client Quotation verification process completed successfully."
            : "danger",

          boxRequired: false,
          background: this.getRequriedData() ? "success" : "danger",
        },
        {
          title: `Quotation Client Verification${this.getRequriedData() ? "-Rejected" : ""
            }`,
          subTitle: this.getRequriedData()
            ? "The quotation has passed internal verification, and now this ticket is undergoing the client quotation Verification process."
            : "Awaiting client quotation verification to complete the internal quotation verification process.",
          boxRequired: false,
          background: this.getRequriedData() ? "danger" : "warning",
        },

        {
          title: "Service Order",
          subTitle: this.getRequriedData()
            ? "The Ticket has been Rejected"
            : "Waiting to generate the service order.",
          boxRequired: false,
          background: this.getRequriedData() ? "blur" : "warning",
        },
        {
          title: "Task",
          subTitle: this.getRequriedData()
            ? "The Ticket has been Rejected"
            : "Awaiting the member to commence the task for the service order.",
          boxRequired: false,
          background: this.getRequriedData() ? "blur" : "warning",
        },
        {
          title: "Internal Verification",
          subTitle: this.getRequriedData()
            ? "The Ticket has been Rejected"
            : "Awaiting completion of the task for verification process.",
          boxRequired: false,
          background: this.getRequriedData() ? "blur" : "warning",
        },
        {
          title: "Tech Signature Process",
          subTitle: this.getRequriedData()
            ? "The Ticket has been Rejected"
            : " Member Signature Pending.",
          background: this.getRequriedData() ? "blur" : "warning",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle: this.getRequriedData()
            ? "The Ticket has been Rejected"
            : "The internal  verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          boxRequired: false,
          background: this.getRequriedData() ? "blur" : "warning",
          client: "Second",
        },
      ];
    } else if (TicketStatusId == 54) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Internal Verification",
          subTitle:
            "The quotation has been generated successfully, and now this ticket is undergoing the internal quotation Verification process",
          boxRequired: false,
          background: "danger",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            "Awaiting client quotation verification to complete the internal quotation verification process.",
          boxRequired: false,
          background: "warning",
        },

        {
          title: "Service Order",
          subTitle: " Waiting to generate the service order.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Task",
          subTitle:
            "Awaiting the member to commence the task for the service order.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Internal Verification",
          subTitle:
            " Awaiting completion of the task for verification process.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Tech Signature Process",
          subTitle: " Member Signature Pending.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle:
            "The internal  verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          boxRequired: false,
          background: "warning",
          client: "Second",
        },
      ];
    } else if (TicketStatusId == 55) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Internal Verification",
          subTitle:
            " Internal Quotation verification process is completed successfully. ",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            "The quotation has passed internal verification, and now this ticket is undergoing the client quotation Verification process.",
          boxRequired: false,
          background: "danger",
        },

        {
          title: "Service Order",
          subTitle: " Waiting to generate the service order.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Task",
          subTitle: "Awaiting the member to commence the task for the service order.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Internal Verification",
          subTitle:
            " Awaiting completion of the task for verification process.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Tech Signature Process",
          subTitle:
            "Member Signature Pending.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle: "The internal  verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          boxRequired: false,
          background: "warning",
          client: "Second",
        },
      ];
    } else if (TicketStatusId == 52) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Internal Verification",
          subTitle:
            "Internal Quotation verification process is completed successfully. ",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            "Client Quotation verification process completed successfully.",
          boxRequired: false,
          background: "success",
        },

        {
          title: "Service Order",
          subTitle:
            "The ticket is undergoing the service order generation process.",
          boxRequired: false,
          background: "danger",
        },
        {
          title: "Task",
          subTitle:
            " Awaiting the member to commence the task for the service order.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Internal Verification",
          subTitle: "Awaiting completion of the task for verification process.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Tech Signature Process",
          subTitle: "Member Signature Pending.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle:
            " The internal  verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          boxRequired: false,
          background: "warning",
          client: "Second",
        },
      ];
    } else if (TicketStatusId == 34) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Internal Verification",
          subTitle:
            "Internal Quotation verification process is completed successfully. ",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            "Client Quotation verification process completed successfully.",
          boxRequired: false,
          background: "success",
        },

        {
          title: "Service Order",
          subTitle: " The service order has been generated for the ticket.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Task",
          subTitle: "The work has been Started by the Member. ",
          boxRequired: false,
          background: "danger",
        },
        {
          title: "Internal Verification",
          subTitle: "Awaiting completion of the task for verification process.",

          boxRequired: false,
          background: "warning",
        },
        {
          title: "Tech Signature Process",
          subTitle: "Member Signature Pending.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          boxRequired: false,
          subTitle:
            " The internal  verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          background: "warning",
          client: "Second",
        },
      ];
    } else if (TicketStatusId == 30) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Internal Verification",
          subTitle:
            "Internal Quotation verification process is completed successfully. ",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            "Client Quotation verification process completed successfully.",
          boxRequired: false,
          background: "success",
        },

        {
          title: "Service Order",
          subTitle: " The service order has been generated for the ticket.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Task",
          subTitle: "The work has been Started by the Member. ",
          boxRequired: false,
          background: "danger",
        },
        {
          title: "Internal Verification",
          subTitle: "Awaiting completion of the task for verification process.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Tech Signature Process",
          subTitle: "Member Signature Pending.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle:
            " The internal  verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          boxRequired: false,
          background: "warning",
          client: "Second",
        },
      ];
    } else if (TicketStatusId == 29) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Internal Verification",
          subTitle:
            "Internal Quotation verification process is completed successfully. ",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            "Client Quotation verification process completed successfully.",
          boxRequired: false,
          background: "success",
        },

        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Task",
          subTitle: " The work has been Started by the Member. ",
          boxRequired: false,
          background: "danger",
        },
        {
          title: "Internal Verification",
          subTitle:
            " Awaiting completion of the task for verification process.",
          boxRequired: false,
          background: "warning",
        },
        {
          title: "Tech Signature Process",
          subTitle: "Member Signature Pending.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle:
            " The internal verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          boxRequired: false,
          background: "warning",
          client: "Second",
        },
      ];
    }
    else if (TicketStatusId == 72) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Internal Verification",
          subTitle:
            "Internal Quotation verification process is completed successfully. ",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            "Client Quotation verification process completed successfully.",
          boxRequired: false,
          background: "success",
        },

        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Task",
          subTitle: "The task has been completed by the member.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Internal Verification",
          subTitle:
            "The work has been completed, and it is now undergoing a Acknowledgement process by Admin.",
          boxRequired: false,
          background: "danger",
        },
        {
          title: "Tech Signature Process",
          subTitle: "Member Signature Pending.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle:
            " The internal verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          boxRequired: false,
          background: "warning",
          client: "Second",
        },
      ];
    } else if (TicketStatusId == 61) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Internal Verification",
          subTitle:
            "Internal Quotation verification process is completed successfully. ",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            "Client Quotation verification process completed successfully.",
          boxRequired: false,
          background: "success",
        },

        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Task",
          subTitle: "The task has been completed by the member.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Internal Verification",
          subTitle:
            "The work has been completed, and it is now undergoing a Acknowledgement process by Admin.",
          boxRequired: false,
          background: "danger",
        },
        {
          title: "Tech Signature Process",
          subTitle: "Member Signature Pending.",
          background: "warning",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle:
            "The internal  verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket.",
          boxRequired: false,
          background: "warning",
          client: "Second",
        },
      ];
    } else if (TicketStatusId == 31) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Internal Verification",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            "Client Quotation verification process completed successfully.",
          boxRequired: false,
          background: "success",
        },

        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Task",
          subTitle: "The task has been completed by the member.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Internal Verification",
          subTitle: "The internal verification has been completed.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Tech Signature Process",
          subTitle:
            this.incindetTechSignImageURL == null
              ? "The internal verification has been completed.awaiting member signature."
              : "Member Signature Completed.",
          background:
            this.incindetTechSignImageURL == null ? "danger" : "success",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle:
            this.incindetTechSignImageURL == null ? "The internal  verification process is awaiting completion in order to proceed with the client verification process in order to close the ticket." : this.incindetClientSignImageURL == null
              ? "The internal verification has been completed.awaiting Client signature."
              : "The Ticket has passed client verification, the ticket is closed now.",

          boxRequired: false,
          background:
            this.incindetTechSignImageURL == null ? "warning" : this.incindetClientSignImageURL == null ? "danger" : "success",

          client: "Second",
        },
      ];
    } else if (TicketStatusId == 32) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Billing Verification",
          subTitle: "The ticket has passed the billing process",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation",
          subTitle: "The Quotation has been generated successfully.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Internal Verification",
          subTitle:
            "Internal Quotation verification process is completed successfully. ",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Quotation Client Verification",
          subTitle:
            "Client Quotation verification process completed successfully.",
          boxRequired: false,
          background: "success",
        },

        {
          title: "Service Order",
          subTitle: "The service order has been generated for the ticket.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Task",
          subTitle: "The task has been completed by the member.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Internal Verification",
          subTitle: "The internal verification has been completed.",
          boxRequired: false,
          background: "success",
        },
        {
          title: "Tech Signature Process",
          subTitle: "Member Signature Completed.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Client Verification",
          subTitle:
            "The Ticket has passed client verification, the ticket is closed now.",
          boxRequired: false,
          background: "success",
          client: "Second",
        },
      ];
    } else if (TicketStatusId == 19) {
      object = [
        {
          title: "Ticket Created",
          subTitle: "The ticket has been created.",
          background: "success",
          boxRequired: false,
        },
        {
          title: "Canceled",
          subTitle: "The ticket has been canceled",
          background: "blur",
          boxRequired: false,
        },
      ];
    }
    return object;
  }

  getRequriedData(): boolean {
    console.log(this.workFlowRequired);
    if (!Array.isArray(this.workFlowRequired)) {
      console.error("workFlowRequired is not an array");
      return false;
    }

    const mydata = this.workFlowRequired.some((element) => {
      return (
        element &&
        element.workflowName ===
        "Quotation Requiring Approval From The Client Process"
      );
    });

    console.log(mydata, "mydata");
    return mydata;
  }

  sendObject(event) {
    this.sendToActivingForTab.emit(event);
  }
}
