import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MonitorIoTSignal } from '@models/monitor-iot-signal';
import { ApiService } from '@services/api.service';
import { isPlatformBrowser } from '@angular/common';
import { IoTSignalType } from 'app/enums/iot-signal-type.enum';
import * as d3 from 'd3';
import { IoTSignalStreamlType } from 'app/enums/iot-signal-stream-type.enum';


@Component({
    selector: 'home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
    readonly limit: number = 100;
    subscriptions: { iotSignals: Subscription } = { iotSignals: null };
    afterViewCheckedEnabled: boolean = true;
    graphConfig: any;
    iotSignals: {
        [key in IoTSignalType]: {
            data: { value: number, date: any }[],
            anomalies: { value: number, date: any }[],
            svg: any
        }
    } = {
            [IoTSignalType.Sine]: { data: null, anomalies: null, svg: null },
            [IoTSignalType.State]: { data: null, anomalies: null, svg: null }
        };

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private titleService: Title,
        private apiService: ApiService,
        private route: ActivatedRoute) {
        this.titleService.setTitle('Home');
        this.route.data.subscribe(data => {
            if (!data['resolverResponse']) {
                return;
            }
        });

        this.subscriptions.iotSignals = this.apiService.getIoTSignalsObservable(IoTSignalStreamlType.Monitor).subscribe(
            (iotSignals: MonitorIoTSignal[]) => {
                const limitedIoTSignals = iotSignals.slice(0, this.limit);
                this.iotSignals = limitedIoTSignals.reduce((acc, signal: MonitorIoTSignal) => {
                    const { timestamp, type, value, flag } = signal;
                    acc[type][flag ? 'anomalies' : 'data'].push({ value, date: timestamp });

                    return acc;
                }, {
                    [IoTSignalType.Sine]: {
                        data: [],
                        anomalies: [],
                        svg: this.iotSignals[IoTSignalType.Sine].svg
                    },
                    [IoTSignalType.State]: {
                        data: [],
                        anomalies: [],
                        svg: this.iotSignals[IoTSignalType.State].svg
                    }
                });

                this.afterViewCheckedEnabled = true;
            });

        const margin = { top: 10, right: 10, bottom: 35, left: 20 };
        const width = 700 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        this.graphConfig = {
            margin, width, height,
            curve: d3.curveLinear, // how to interpolate between points
            stroke: {
                color: "currentColor", // stroke color of line
                linecap: "round", // stroke line cap of the line
                linejoin: "round", // stroke line join of the line
                width: 1.5, // stroke width of line, in pixels
                opacity: 1, // stroke opacity of line
            },
            type: {
                x: d3.scaleTime, // the x-scale type
                y: d3.scaleLinear, // the y-scale type
            },
            range: {
                x: [margin.left, width - margin.right], // [left, right]
                y: [height - margin.bottom, margin.top] // [bottom, top]
            }
        }
    }

    ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        Object.values(IoTSignalType).forEach(type => {
            this.createSvg(type);
            this.refreshSvg(type);
        });
    }

    ngAfterViewChecked(): void {
        if (!isPlatformBrowser(this.platformId) || !this.afterViewCheckedEnabled) return;
        Object.values(IoTSignalType).forEach(type => this.refreshSvg(type));
    }

    private createSvg(iotSignalType: IoTSignalType): void {
        const { height, width, margin } = this.graphConfig;

        // append the svg object to the body of the page
        this.iotSignals[iotSignalType].svg = d3.select(`figure#${iotSignalType}`)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
    }

    private refreshSvg(iotSignalType: IoTSignalType): void {
        d3.selectAll(`figure#${iotSignalType} > svg > g > *`).remove();

        const { type, range, height, width, margin, curve, stroke } = this.graphConfig;
        const X = d3.map(this.iotSignals[iotSignalType].data, x => x.date);
        const Y = d3.map(this.iotSignals[iotSignalType].data, y => y.value);
        const Yanomalies = d3.map(this.iotSignals[iotSignalType].anomalies, y => y.value);
        const I: any = d3.range(X.length);

        // Compute default domains.
        const xDomain = d3.extent(X);
        const yDomain = [0, Yanomalies.length > 0 ? d3.max(Yanomalies) : Y.length > 0 ? d3.max(Y) : 5000];

        // Construct scales and axes.
        const xScale = type.x(xDomain, range.x);
        const yScale = type.y(yDomain, range.y);
        const xAxis = d3.axisBottom(xScale).ticks(d3.timeMillisecond.every(10), '%H:%M:%S.%L').tickSizeOuter(0);
        const yAxis = d3.axisLeft(yScale).ticks(height / 40);

        // Construct a line generator.
        const line = d3.line()
            .curve(curve)
            .x((i: any) => xScale(X[i]))
            .y((i: any) => yScale(Y[i]));

        // Add X axis --> it is a date format
        this.iotSignals[iotSignalType].svg.append("g")
            .attr("transform", `translate(0,${yScale(0)})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        // Add Y axis
        this.iotSignals[iotSignalType].svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(yAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width - margin.left - margin.right)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
                .attr("x", -margin.left)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text(''));

        // Add line
        this.iotSignals[iotSignalType].svg.append("path")
            .attr("fill", "none")
            .attr("stroke", stroke.color)
            .attr("stroke-width", stroke.width)
            .attr("stroke-linecap", stroke.linecap)
            .attr("stroke-linejoin", stroke.linejoin)
            .attr("stroke-opacity", stroke.opacity)
            .attr("d", line(I));

        // Add anomalies
        this.iotSignals[iotSignalType].svg
            .append("g")
            .selectAll("dot")
            .data(this.iotSignals[iotSignalType].anomalies)
            .enter()
            .append("circle")
            .attr("cx", (d: any) => xScale(d.date))
            .attr("cy", (d: any) => yScale(d.value))
            .attr("r", 5)
            .attr("fill", "#ff0000")
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        Object.values(this.subscriptions).forEach(subscription => subscription.unsubscribe());
    }
}