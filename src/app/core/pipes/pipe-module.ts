import { NgModule } from '@angular/core';
import { ArrayFilter } from './flier.pipe';


const exportsList = [
    ArrayFilter,
];

@NgModule({
    declarations: [
        ...exportsList
    ],
    providers: [
        ...exportsList
    ],
    exports: [
        ...exportsList
    ]
})
export class PipesModule { }
