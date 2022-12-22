import { Component, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IoTSignal } from '@models/iot-signal';
import { ApiService } from '@services/api.service';
import { isPlatformBrowser } from '@angular/common';
import { IoTSignalType } from 'app/enums/iot-signal-type.enum';
import * as d3 from 'd3';
import * as moment from 'moment';


@Component({
    selector: 'home-page',
    templateUrl: './home-page.component.html',
    styleUrls: [
        './home-page.component.common.scss',
        './home-page.component.desktop.scss',
        './home-page.component.mobile.scss'
    ],
    encapsulation: ViewEncapsulation.None,
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
            // const formatTime = d3.timeFormat("%B %d, %Y");
            // const asdf = moment(timestamp).format('YYYY-MM-DD h:mm:ss');

            const iotSignalsLength = iotSignals.length;
            const slicedSignals = iotSignals.slice(iotSignalsLength - 100, iotSignalsLength);
            this.iotSignals = slicedSignals.reduce((acc, signal: IoTSignal) => {
                const { timestamp, type, value } = signal;
                if (type === IoTSignalType.Sine) {
                    // const asdf = moment(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss');
                    // const qwer = d3.utcParse("%B %d, %Y")(asdf);
                    acc.push({ value, date: timestamp })
                }

                return acc;
            }, [])
        });
    }

    ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        this.createSvg();
        // this.drawBars(this.iotSignals);
    }

    // private createSvg(): void {
    //     // set the dimensions and margins of the graph
    //     const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    //         width = 460 - margin.left - margin.right,
    //         height = 400 - margin.top - margin.bottom;

    //     // append the svg object to the body of the page
    //     const svg = d3.select("figure#bar")
    //         .append("svg")
    //         .attr("width", width + margin.left + margin.right)
    //         .attr("height", height + margin.top + margin.bottom)
    //         .append("g")
    //         .attr("transform", `translate(${margin.left},${margin.top})`);

    //     //Read the data
    //     d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",

    //         // When reading the csv, I must format variables:
    //         function (d) {
    //             return { date: d3.timeParse("%Y-%m-%d")(d.date), value: d.value }
    //         }).then(

    //             // Now I can use this dataset:
    //             function (data) {

    //                 // Add X axis --> it is a date format
    //                 const x = d3.scaleTime()
    //                     .domain(d3.extent(data, function (d) { return d.date; }))
    //                     .range([0, width]);
    //                 svg.append("g")
    //                     .attr("transform", `translate(0, ${height})`)
    //                     .call(d3.axisBottom(x));

    //                 // Add Y axis
    //                 const y = d3.scaleLinear()
    //                     .domain([0, d3.max(data, function (d) { return +d.value; })])
    //                     .range([height, 0]);
    //                 svg.append("g")
    //                     .call(d3.axisLeft(y));

    //                 // const asdf = d3.line()
    //                 //     .x((d: any) => x(d.date))
    //                 //     .y((d: any) => y(d.value))

    //                 // Add the line
    //                 svg.append("path")
    //                     .datum(data)
    //                     .attr("fill", "none")
    //                     .attr("stroke", "steelblue")
    //                     .attr("stroke-width", 1.5)
    //                     .attr("d", d3.line()
    //                         .x((d: any) => x(d.date))
    //                         .y((d: any) => y(d.value)) as any
    //                     )

    //             })
    // }

    private createSvg(): void {
        // set the dimensions and margins of the graph
        const margin = { top: 10, right: 30, bottom: 30, left: 60 },
            width = 1300 - margin.left - margin.right,
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
        const xAxis = d3.axisBottom(xScale).ticks(width / 40).tickSizeOuter(0);
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
            .call(xAxis);

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

    // private createSvg(): void {
    //     const x = ([x]) => x; // given d in data, returns the (temporal) x-value
    //     const y = ([, y]) => y; // given d in data, returns the (quantitative) y-value
    //     let defined; // for gaps in data
    //     const curve = d3.curveLinear; // method of interpolation between points
    //     const marginTop = 20; // top margin, in pixels
    //     const marginRight = 30; // right margin, in pixels
    //     const marginBottom = 30; // bottom margin, in pixels
    //     const marginLeft = 40; // left margin, in pixels
    //     const width = 640; // outer width, in pixels
    //     const height = 400; // outer height, in pixels
    //     const xType = d3.scaleUtc; // the x-scale type
    //     let xDomain; // [xmin, xmax]
    //     const xRange = [marginLeft, width - marginRight]; // [left, right]
    //     const yType = d3.scaleLinear; // the y-scale type
    //     let yDomain; // [ymin, ymax]
    //     const yRange = [height - marginBottom, marginTop]; // [bottom, top]
    //     let yFormat; // a format specifier string for the y-axis
    //     let yLabel; // a label for the y-axis
    //     const color = "currentColor"; // stroke color of line
    //     const strokeLinecap = "round"; // stroke line cap of the line
    //     const strokeLinejoin = "round"; // stroke line join of the line
    //     const strokeWidth = 1.5; // stroke width of line, in pixels
    //     const strokeOpacity = 1; // stroke opacity of line

    //     const X = d3.map(this.iotSignals, x);
    //     const Y = d3.map(this.iotSignals, y);
    //     const I = d3.range(X.length);
    //     if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
    //     const D = d3.map(this.iotSignals, defined);

    //     // Compute default domains.
    //     if (xDomain === undefined) xDomain = d3.extent(X);
    //     if (yDomain === undefined) yDomain = [0, d3.max(Y)];

    //     // Construct scales and axes.
    //     const xScale = xType(xDomain, xRange);
    //     const yScale = yType(yDomain, yRange);
    //     const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
    //     const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

    //     // Construct a line generator.
    //     const line = d3.line()
    //         .defined(i => D[i])
    //         .curve(curve)
    //         .x(i => xScale(X[i]))
    //         .y(i => yScale(Y[i]));


    //     const svg = d3.create("svg")
    //         .attr("width", width)
    //         .attr("height", height)
    //         .attr("viewBox", [0, 0, width, height])
    //         .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    //     svg.append("g")
    //         .attr("transform", `translate(0,${height - marginBottom})`)
    //         .call(xAxis);

    //     svg.append("g")
    //         .attr("transform", `translate(${marginLeft},0)`)
    //         .call(yAxis)
    //         .call(g => g.select(".domain").remove())
    //         .call(g => g.selectAll(".tick line").clone()
    //             .attr("x2", width - marginLeft - marginRight)
    //             .attr("stroke-opacity", 0.1))
    //         .call(g => g.append("text")
    //             .attr("x", -marginLeft)
    //             .attr("y", 10)
    //             .attr("fill", "currentColor")
    //             .attr("text-anchor", "start")
    //             .text(yLabel));

    //     svg.append("path")
    //         .attr("fill", "none")
    //         .attr("stroke", color)
    //         .attr("stroke-width", strokeWidth)
    //         .attr("stroke-linecap", strokeLinecap)
    //         .attr("stroke-linejoin", strokeLinejoin)
    //         .attr("stroke-opacity", strokeOpacity)
    //         .attr("d", line(I));

    //     // return svg.node();
    // }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        Object.values(this.subscriptions).forEach(subscription => subscription.unsubscribe());
    }
}