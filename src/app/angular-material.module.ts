import { NgModule } from '@angular/core';
import { MatInputModule, MatCardModule, MatButtonModule, MatToolbarModule, MatExpansionModule, MatSnackBarModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule} from '@angular/material';

@NgModule({
    exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule
    ]
})
export  class AngularMaterialModule {

}
