import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-maintenance-documentions',
  templateUrl: './maintenance-documentions.component.html',
  styleUrl: './maintenance-documentions.component.scss'
})
export class MaintenanceDocumentionsComponent {
  @Input() headerVisible:boolean=false
  ngOnInit(): void {
  }
}
