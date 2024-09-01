import { Component } from '@angular/core';

@Component({
  selector: 'app-awaiting-document',
  templateUrl: './awaiting-document.component.html',
  styleUrl: './awaiting-document.component.scss'
})
export class AwaitingDocumentComponent {
  multipleRadialbarChart: any;
  ngOnInit(): void {
    this._multipleRadialbarChart('["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger"]');
  }


private _multipleRadialbarChart(colors: any) {
  colors = this.getChartColorsArray(colors);
  this.multipleRadialbarChart = {
    series: [44, 55, 67, 83],
    chart: {
      height: 350,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: true,
            label: "Total",
          },
        },
      },
    },
    labels: ["Apples", "Oranges", "Bananas", "Berries"],
    colors: colors,
    legend: {
      show: true,
      position: 'right', // can be 'top', 'bottom', 'left', 'right'
      labels: {
        colors: undefined,
        useSeriesColors: false
      },
      markers: {
        width: 12,
        height: 12,
        strokeWidth: 0,
        strokeColor: '#fff',
        fillColors: undefined,
        radius: 12,
        customHTML: undefined,
        onClick: undefined,
        offsetX: 0,
        offsetY: 0
      },
      itemMargin: {
        horizontal: 5,
        vertical: 5
      },
      onItemClick: {
        toggleDataSeries: true
      },
      onItemHover: {
        highlightDataSeries: true
      }
    }
  };
}
private getChartColorsArray(colors: any) {
  colors = JSON.parse(colors);
  return colors.map(function (value: any) {
    var newValue = value.replace(" ", "");
    if (newValue.indexOf(",") === -1) {
      var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
      if (color) {
        color = color.replace(" ", "");
        return color;
      } else return newValue;;
    } else {
      var val = value.split(',');
      if (val.length == 2) {
        var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
        rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
        return rgbaColor;
      } else {
        return newValue;
      }
    }
  });
}


}
