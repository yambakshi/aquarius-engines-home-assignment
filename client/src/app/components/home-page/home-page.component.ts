import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IoTSignal } from '@models/iot-signal';
import { ApiService } from '@services/api.service';
import { isPlatformBrowser } from '@angular/common';
import { IoTSignalType } from 'app/enums/iot-signal-type.enum';
import * as d3 from 'd3';


@Component({
    selector: 'home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
    subscriptions: { iotSignals: Subscription } = { iotSignals: null };
    iotSignals: { value: number, date: any }[];

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

        this.subscriptions.iotSignals = this.apiService.getIoTSignalsObservable().subscribe((iotSignals: IoTSignal[]) => {
            this.iotSignals = iotSignals.reduce((acc, signal: IoTSignal) => {
                const { timestamp, type, value } = signal;
                if (type === IoTSignalType.State) {
                    acc.push({ value, date: timestamp })
                }

                return acc;
            }, [])
        });
    }

    ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        this.createSvg();
    }

    private createSvg(): void {
        // set the dimensions and margins of the graph
        const margin = { top: 10, right: 0, bottom: 35, left: 20 },
            width = 1200 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        const yFormat = "+~%"; // a format specifier string for the y-axis
        const curve = d3.curveLinear; // how to interpolate between points

        const color = "currentColor"; // stroke color of line
        const strokeLinecap = "round"; // stroke line cap of the line
        const strokeLinejoin = "round"; // stroke line join of the line
        const strokeWidth = 1.5; // stroke width of line, in pixels
        const strokeOpacity = 1; // stroke opacity of line

        const xType = d3.scaleUtc; // the x-scale type
        const yType = d3.scaleLinear; // the y-scale type

        const yRange = [height - margin.bottom, margin.top]; // [bottom, top]
        const xRange = [margin.left, width - margin.right] // [left, right]

        const X = d3.map(this.iotSignals, x => x.date);
        const Y = d3.map(this.iotSignals, y => y.value);
        const I: any = d3.range(X.length);

        // Compute default domains.
        const xDomain = d3.extent(X);
        const yDomain = [0, d3.max(Y)];

        // Construct scales and axes.
        const xScale = xType(xDomain, xRange);
        const yScale = yType(yDomain, yRange);
        const xAxis = d3.axisBottom(xScale).ticks(d3.timeMillisecond.every(5), '%H:%M:%S.%L').tickSizeOuter(0);
        const yAxis = d3.axisLeft(yScale).ticks(height / 40);

        // Construct a line generator.
        const line = d3.line()
            .curve(curve)
            .x((i: any) => {
                const asdf = xScale(X[i]);
                return asdf;
            })
            .y((i: any) => {
                const asdf = yScale(Y[i]);
                return asdf;
            });

        // append the svg object to the body of the page
        const svg = d3.select("figure#graph")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add X axis --> it is a date format
        svg.append("g")
            .attr("transform", `translate(0,${yScale(1)})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        // Add Y axis
        svg.append("g")
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

        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", strokeWidth)
            .attr("stroke-linecap", strokeLinecap)
            .attr("stroke-linejoin", strokeLinejoin)
            .attr("stroke-opacity", strokeOpacity)
            .attr("d", line(I));
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        Object.values(this.subscriptions).forEach(subscription => subscription.unsubscribe());
    }
}