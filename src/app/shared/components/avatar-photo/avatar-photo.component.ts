import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar-photo',
  templateUrl: './avatar-photo.component.html',
  styleUrls: ['./avatar-photo.component.scss']
})
export class AvatarPhotoComponent {

  @Input()
  public name!: string;

  public initials!: string;
  public circleColor!: string;

  private colors = [
      '#EB7181', // red
      '#468547', // green
      '#FFD558', // yellow
      '#3670B2', // blue
  ];

  ngOnInit() {

    this.createInititals();
    const randomIndex = Math.floor(Math.random() * Math.floor(this.colors.length));
    this.circleColor = this.colors[randomIndex];

  }

  private createInititals(): void {
      let initials = "";

      for (let i = 0; i < this.name.length; i++) {
          if (this.name.charAt(i) === ' ') {
              continue;
          }
          if (this.name.charAt(i) === this.name.charAt(i).toUpperCase()) {
              initials += this.name.charAt(i);

              if (initials.length == 2) {
                  break;
              }
          }
      }

      this.initials = initials;
  }

}
