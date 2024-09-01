import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'arrayFilter' })
export class ArrayFilter implements PipeTransform {
    transform(items: any[], value: string): any[] {
        if (items?.length == 0) return [];
        if (!value || value?.toString()?.length == 0) return items;

        if (items && items.length > 0) {
            return items.filter(singleItem => {
                return (singleItem?.employeeName && value && singleItem?.employeeName?.toString().toLowerCase().indexOf(value.toString().toLowerCase()) > -1) || (!value && singleItem?.employeeName);
            }
            );
        } else {
            return items.filter(singleItem => {
                return (singleItem?.employeeName && value && singleItem?.employeeName?.toString().toLowerCase().indexOf(value.toString().toLowerCase()) > -1) || (!value && singleItem?.employeeName);
            }
            );
        }
    }
}