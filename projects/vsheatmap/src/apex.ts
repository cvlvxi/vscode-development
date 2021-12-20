import ApexCharts from 'apexcharts'
import { SerializedStats, SerializedChar, SerializedFile, SerializedLine } from "./types"

window.addEventListener('message', event => {
  const stats = event.data; // The json data that the extension sent
  // console.log(stats)
  var chart = new ApexCharts(document.querySelector("#chart"), generateSeriesData(stats));
  chart.render();
});

interface Data {
  x: string,
  y: number
}

interface OptionSeries {
  name: string,
  data: Data
}

function generateSeriesData(data: any) {
  let stats: SerializedStats = data.stats
  let somef = Object.keys(stats)[0]
  let {maxLineCount, lineCount, linestats} = stats[somef]

  let options: any = {
    chart: {
      height: 1800,
      type: 'heatmap',
    },
    stroke: {
      width: 0
    },
    plotOptions: {
      heatmap: {
        colorScale: {
          ranges: [{
              from: -30,
              to: 5,
              color: '#00A100',
              name: 'low',
            },
            {
              from: 6,
              to: 20,
              color: '#128FD9',
              name: 'medium',
            },
            {
              from: 21,
              to: 45,
              color: '#FFB200',
              name: 'high',
            }
          ]
        }
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff']
      }
    },
    xaxis: {
      type: 'category',
    },
    series: []
  }

  function generateSeriesLineData(line_idx: number, maxLineCount: number, linestats: Record<number, SerializedLine>) {
      let series = []
      let isZero = true
      let binWidth = 20 // aggregate the number of chars into this

      for (let char_idx=0; char_idx < maxLineCount; ++char_idx) {
        if (linestats && line_idx in linestats) {
          let cstats: Record<number, SerializedChar> = linestats[line_idx].charstats 
          if (cstats && char_idx in cstats) {
            series.push({
              x: char_idx,
              y: cstats[char_idx].timesVisited
              // y: Math.floor(cstats[char_idx].totalDuration)
            })
            isZero = false
          }
        }
        // if (isZero) {
        //   // series.push({
        //   //   x: char_idx,
        //   //   y: 0
        //   })
        // }
    }
    return series
  }

  for(let line_idx=0; line_idx < lineCount; ++line_idx) {
    options.series.push({
      name: `line-${line_idx}`,
      data: generateSeriesLineData(line_idx, maxLineCount, linestats)
    })
  }
  return options
}

