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
  lineData: any;
  private trend;
  private trendData;

  constructor(private elRef: ElementRef, @Inject(CONTEXT_MENU_TOKEN) private contextMenu: ContextMenuAPI) {

  }

  ngOnInit(): void {
    let ctx = document.getElementById('canvas');
    let myLineChart = new Chart(ctx, {
      type: 'line',
      data: { labels: ['', '', '', '', '', '', '', '', '', ''],
        datasets: [{
          backgroundColor: '#ff6384',
          foregroundColor: '#ff6384',
          data: [65,
            150,
            600,
            300,
            200,
            150,
          450,
        250,
      150,
    200,
  100],
        fill: false,
        lineTension: 0
        }, {
          backgroundColor: '#0000FF',
          foregroundColor: '#0000FF',
          data: [55,
            20,
            100,
            200,
            200,
            350,
          150,
        250,
      150,
    50,
  60],
        fill: false,
        lineTension: 0
        }
      ]
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
      } else {
        if (data.body[i].path.indexOf('Trend') !== -1) {
          this.trendData.push(data.body[i]);
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

  private initTrend(chartType: string) {
    let ctx = this.elRef.nativeElement.querySelector('canvas');

    if (this.trend) {
      this.trend.destroy();
    }

    this.trend = new Chart(ctx, {
      type: chartType,
      options: {
        title: {
          display: false,
          text: ''
        },
        maintainAspectRatio: true,
        data: this.trendData ,
      }
    });

  }
private updateTrendData(data) {
if (this.trend && data.body.headers && data.body.events ) {

}
}
  private formatInfo() {
    let output = '';
    this.data.body.forEach(item => {
      output += item.path + '\n';
      output += item.timestamp + '\n';
      output += item.type + '\n';
      output += (item.good ? 'good' : 'bad') + ' data\n------------\n';
    });

    return output;
  }
}
