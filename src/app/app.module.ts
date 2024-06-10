

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from "@angular/cdk/overlay";
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { NgxOrgChartModule } from 'ngx-org-chart'
import { NgxEchartsModule } from 'ngx-echarts';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { QuillModule } from 'ngx-quill'
import Quill from 'quill'
import QuillEmoji from 'quill-emoji';
import {CommonService} from './services/common.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';

Quill.register('modules/emoji-shortname', QuillEmoji.ShortNameEmoji);


@NgModule({
  declarations: [
    AppComponent,
    
 
  ],
  imports: [
    BrowserModule, 
    HttpClientModule,
    ImageCropperModule,
    DragDropModule,
    QuillModule.forRoot(),
    OverlayModule,
    ScrollingModule,
    IonicModule.forRoot({ mode: 'ios' }),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,    
    NgxOrgChartModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: CommonService, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
