import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { OrgChart } from 'd3-org-chart';

@Component({
  selector: 'app-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss'],
})
export class OrgChartComponent implements OnInit {

  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @Input() data!: any[];
  chart: any;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (!this.chart) {
      this.chart = new OrgChart();
    }
    this.updateChart();
  }

  ngOnChanges() {
    this.updateChart();
  }
  updateChart() {
    if (!this.data) {
      return;
    }
    if (!this.chart) {
      return;
    }

    this.chart
      .container(this.chartContainer.nativeElement)
      .data(this.data)
      .nodeHeight((d: any) => 70)
      .nodeWidth((d: any) => {
        if (d.depth == 0) return 250;
        if (d.depth == 1) return 220;
        return 140;
      })
      .childrenMargin((d: any) => 50)
      .compactMarginBetween((d: any) => 35)
      .compactMarginPair((d: any) => 30)
      .neightbourMargin((a: any, b: any) => 20)
      .buttonContent(( node:any, state:any ) => {
        return `<div style="border-radius:3px;padding:3px;font-size:10px;margin:auto auto;background-color:lightgray"> <span style="font-size:9px;color:black;">${node.children
            ? `<i class="fas fa-chevron-up"></i>`
            : `<i class="fas fa-chevron-down"></i>`
          }</span>   </div>`;
      })
      .nodeContent(function (d: any, i: any, arr: any, state: any) {
        const colors = ['#278B8D', '#404040', '#0C5C73', '#33C6CB'];
        const color = colors[d.depth % colors.length];
        return `
          <div style="background-color:${color}; position:absolute;margin-top:-1px; margin-left:-1px;width:${d.width}px;height:${d.height}px;border-radius:50px">
             <img src=" ${d.data.imageUrl
          }" style="position:absolute;margin-top:5px;margin-left:${5}px;border-radius:100px;width:60px;height:60px;" />
             <div style="position:absolute;top:-15px;width:${d.width
          }px;text-align:center;color:#fafafa;">
                   <div style="margin:0 auto;background-color:${color};display:inline-block;padding:8px;padding-bottom:0px;border-radius:5px"> ${d.data.id}</div>
            </div>

            <div style="color:#fafafa;font-size:${d.depth < 2 ? 16 : 12
          }px;font-weight:bold;margin-left:70px;margin-top:15px"> ${d.depth < 2 ? d.data.name : (d.data.name || '').trim().split(/\s+/g)[0]} </div>
            <div style="color:#fafafa;margin-left:70px;margin-top:5px"> ${d.depth < 2 ? d.data.positionName : d.data.area
          } </div>
            
             <!--
             <div style="padding:20px; padding-top:35px;text-align:center">
                
                 
             </div> 
            
             <div style="display:flex;justify-content:space-between;padding-left:15px;padding-right:15px;">
               <div > Manages:  ${d.data._directSubordinates} 👤</div>  
               <div > Oversees: ${d.data._totalSubordinates} 👤</div>    
             </div>
             -->
         </div>
`;
      })
      .render();
  }

}
