import {DatePipe} from '@angular/common';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import BigNumber from 'bignumber.js';
import {createChart} from 'lightweight-charts';
import {BootService} from '../services/boot.service';

@Component({
    selector: 'app-tv-volume',
    templateUrl: './tv-volume.component.html',
    styleUrls: ['./tv-volume.component.less']
})
export class TvVolumeComponent implements OnInit {

    @ViewChild('tv_chart')
    tvChart: ElementRef;
    @ViewChild('tooltip')
    tooltip: ElementRef;
    list: [] = [];

    constructor(public boot: BootService) {
        this.boot.walletReady.subscribe(() => {
            setTimeout(() => {
                const chart = createChart(this.tvChart.nativeElement, {
                    layout: {
                        textColor: '#d1d4dc',
                        backgroundColor: 'rgba(29, 30, 37, 0.57)',
                    },
                    leftPriceScale: {
                        visible: false,
                    },
                    rightPriceScale: {
                        scaleMargins: {
                            top: 0.4,
                            bottom: 0.2,
                        },
                        visible: true,
                    },
                    crosshair: {
                        vertLine: {
                            labelVisible: false,
                        }
                    },
                    grid: {
                        vertLines: {
                            visible: false,
                        },
                        horzLines: {
                            visible: false,
                        },
                    },
                });
                const lineSeries = chart.addAreaSeries(
                    {
                        topColor: 'rgba(0, 150, 136, 0.56)',
                        bottomColor: 'rgba(0, 150, 136, 0.04)',
                        lineColor: 'rgba(0, 150, 136, 1)',
                        lineWidth: 2,
                    }
                );
                let dataList = [];
                this.boot.getSubgraph().then(data => {
                    lineSeries.setData(data.liquidity);
                    dataList = data.liquidity;
                    this.list = data.liquidity;
                    setLastBarText();
                });
                const toolTip = this.tooltip.nativeElement;
                const width = 600;
                const height = 300;
                let dateStr;

                function setLastBarText() {
                    if (dataList) {
                        dateStr = dataList[dataList.length - 1].time.year + ' - ' + dataList[dataList.length - 1].time.month + ' - ' + dataList[dataList.length - 1].time.day;
                        toolTip.innerHTML = '<div style="font-size: 12px; margin: 4px 0px; color: #FFFFFF">' + '$' + dataList[dataList.length - 1].value + '</div>' +
                            '<div>' + dateStr + '</div>';
                    }
                }

                chart.subscribeCrosshairMove((param: any) => {
                    if (param === undefined || param.time === undefined || param.point.x < 0 || param.point.x > width || param.point.y < 0 || param.point.y > height) {
                        setLastBarText();
                    } else {
                        const value: any = param.seriesPrices.get(lineSeries);
                        dateStr = param?.time?.year + ' - ' + param?.time?.month + ' - ' + param?.time?.day;
                        toolTip.innerHTML = '<div style="font-size: 12px; margin: 4px 0px; color: #FFFFFF">' + '$' + (Math.round(value * 100) / 100).toFixed(2) + '</div>' + '<div>' + dateStr + '</div>';
                    }
                });

            }, 0);
        });
    }

    ngOnInit(): void {

    }

}
