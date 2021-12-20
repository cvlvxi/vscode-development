```
0: {x: "w1", y: 0}
1: {x: "w2", y: 47}
2: {x: "w3", y: 66}
3: {x: "w4", y: 23}
4: {x: "w5", y: 34}
5: {x: "w6", y: 17}
6: {x: "w7", y: 88}
7: {x: "w8", y: 46}
8: {x: "w9", y: 48}
9: {x: "w10", y: 23}
10: {x: "w11", y: 9}
11: {x: "w12", y: 74}
12: {x: "w13", y: 81}
13: {x: "w14", y: 41}
14: {x: "w15", y: 22}
15: {x: "w16", y: 22}
16: {x: "w17", y: 17}
17: {x: "w18", y: 29}
length: 18
__proto__: Array(0)

```


# Hello


```



        var options = {
          series: [{
          name: 'Metric1',
          data: generateData(20, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric2',
          data: generateData(20, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric3',
          data: generateData(20, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric4',
          data: generateData(20, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric5',
          data: generateData(20, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric6',
          data: generateData(20, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric7',
          data: generateData(20, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric8',
          data: generateData(20, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric8',
          data: generateData(20, {
            min: 0,
            max: 90
          })
        }
        ],
          chart: {
          height: 350,
          type: 'heatmap',
        },

        title: {
          text: 'Rounded (Range without Shades)'
        },
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
```