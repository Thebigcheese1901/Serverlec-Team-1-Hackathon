/**
 * @license
 * Copyright © 2017-2018 OSIsoft, LLC. All rights reserved.
 * Use of this source code is governed by the terms in the accompanying LICENSE file.
 */
import { Component, Input, OnChanges, OnInit, ElementRef, ChangeDetectionStrategy, Inject } from '@angular/core';
import { ContextMenuAPI, CONTEXT_MENU_TOKEN } from '../framework';
import Chart from 'Chart.js';

@Component({
  selector: 'PIInterfaceMonitor',
  templateUrl: 'PIInterfaceMonitor.component.html',
  styleUrls: ['PIInterfaceMonitor.component.css']
})
export class PIInterfaceMonitorComponent implements OnChanges, OnInit {
  @Input() fgColor: string;
  @Input() bkColor: string;
  @Input() data: any;
  @Input() pathPrefix: string;
  values: any[] = [];
  labels: any[] = [];
  interface: any[] = [];
  interfaceDescription: string;
  interfaceStatus: string;
  statusColour: string[] = ['green', 'red'];
  lineData1: any = [{x: '16-Apr-2018 00:00:00' , y: 100}, {x: '16-Apr-2018 01:00:00' , y: 15},
  {x: '16-Apr-2018 02:00:00' , y: 100},
  {x: '16-Apr-2018 03:00:00' , y: 85},
  {x: '16-Apr-2018 04:00:00' , y: 100},
  {x: '16-Apr-2018 05:00:00' , y: 100}];
  lineData2: any = [{x: '16-Apr-2018 00:00:00' , y: 100}, {x: '16-Apr-2018 01:00:00' , y: 50},
  {x: '16-Apr-2018 02:00:00' , y: 50},
  {x: '16-Apr-2018 03:00:00' , y: 50},
  {x: '16-Apr-2018 04:00:00' , y: 100},
  {x: '16-Apr-2018 05:00:00' , y: 75}];
   myLineChart: Chart;
  private trend;
  private trendData;

  constructor(private elRef: ElementRef, @Inject(CONTEXT_MENU_TOKEN) private contextMenu: ContextMenuAPI) {

  }

  ngOnInit(): void {


    let ctx = document.getElementById('canvas');

   let myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Tag1',
          backgroundColor: '#ff6384',
          foregroundColor: '#ff6384',
          data: this.lineData1,
        fill: false,
        lineTension: 0
        }, {
          label: 'Tag2',
          backgroundColor: '#0000FF',
          foregroundColor: '#0000FF',
          data: this.lineData2,
        fill: false,
        lineTension: 0
        }
      ]
      },
      options: {
      scales: {
      xAxes: [{ type: 'time',
distribution: 'series', ticks: {
source: 'labels'
}
}],
yAxes: [{
scaleLabel: {
display: false,
labelString: ''
}
}]
}
    },
    });
  }
  ngOnChanges(changes) {
    if (changes.data) {
      // this.values = this.formatData();
      this.formatInterfaceData(this.data);
    }
  }

  formatData() {
    if (this.isDataValid()) {
      return this.data.body.map(r => ({ path: r.path, value: this.formatValue(r.value) }));
    } else {
      return [];
    }
  }


  private formatInterfaceData(data) {
    this.labels = [];
    this.values = [];
    this.trendData = [];
    this.interfaceDescription = '';
    this.interfaceStatus = '';


    for (let i = 0; i < data.body.length; i++) {
      if (data.body[i].path.indexOf('Description') !== -1) {
        this.interfaceDescription = data.body[i].events[0].value;
      } else if (data.body[i].path.indexOf('PI Status') !== -1) {
       this.interfaceStatus = data.body[i].events[0].value.Value;
      } else if (data.body[i].path.includes('PI Point')) {
          if (data.body[i].path.indexOf('1') !== -1) {
            for (let j = 0; j < data.body[i].events.length - 1 ; j++ ) {
            this.trendData['x'] = data.body[i].events[j].timestamp;
              this.trendData['y'] = data.body[i].events[j].value ;
              // this.lineData1.push(this.trendData);
              this.trendData = [];
            }
          } else if (data.body[i].path.indexOf('2') !== -1) {
              for (let j = 0; j < data.body[i].events.length - 1 ; j++ ) {
              this.trendData['x'] = data.body[i].events[j].timestamp;
              this.trendData['y'] = data.body[i].events[j].value ;
              // this.lineData2.push(this.trendData);
              this.trendData = [];
              }
            }
       } else {
        let label = data.body[i].path.split('|', 2)[1];
        this.labels.push(label);
        if (label === 'EnumerationValue') {
          this.values.push(data.body[i].events[0].value.Name);
        } else if (label === 'Device Status') {
          this.values.push(data.body[i].events[0].value.Name);
        } else {
        this.values.push(data.body[i].events[0].value);
          }
      }
    }
    this.buildInterface(this.labels, this.values);

  }

  private buildInterface(labels, values) {
    this.interface = [];
    for (let i = 0; i < labels.length; i++) {
      let newInterfaceEntry = {labelName: this.labels[i], labelValue: this.values[i]}
      this.interface.push(newInterfaceEntry);
    }
  }


  private formatValue(value: any) {
    // very basic enumeration support
  }

  private isDataValid(): boolean {
    return this.data && this.data.body && this.data.body.length;
 }
}
