import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FileManagementService } from "../../../core/services/file-management.service";

@Component({
  selector: "app-file-list-shown",
  templateUrl: "./file-list-shown.component.html",
  styleUrls: ["./file-list-shown.component.scss"],
})
export class FileListShownComponent implements OnChanges {
  @Input() fileList: any[] = [];

  constructor(private fileManagementService: FileManagementService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.fileList = this.fileList;
  }

  openToDownload(data: any) {
    let payload = {
      FileId: data.fileId,
    };
    this.fileManagementService.downloadFile(payload).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      window.open(url); // Open the file in a new tab for download
    });
  }
}
