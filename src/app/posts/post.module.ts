import { BrowserModule } from '@angular/platform-browser';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@NgModule({
    declarations: [
        PostCreateComponent,
        PostListComponent
    ],
    imports: [
        AngularMaterialModule,
        CommonModule,
        BrowserModule,
        ReactiveFormsModule,
        RouterModule
    ]
})
export class PostModule {

}
