import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Line } from 'react-chartjs-2'

const colorArray = [
  '#a6cee3',
  '#1f78b4',
  '#b2df8a',
  '#33a02c',
  '#fb9a99',
  '#e31a1c',
  '#fdbf6f',
  '#ff7f00',
  '#cab2d6',
  '#6a3d9a',
  '#ffff99',
  '#b15928',
  '#8dd3c7',
  '#ffffb3',
  '#bebada',
  '#fb8072',
  '#80b1d3',
  '#fdb462',
  '#b3de69',
  '#fccde5',
  '#d9d9d9',
  '#bc80bd',
  '#ccebc5',
  '#ffed6f'
]

const buildDataset = (label, data, color) => {
  return {
    label: label,
    data: data,
    borderColor: color,
    // backgroundColor: color, // TODO: use same color but lighter shade
    borderWidth: 2,
    fill: false,
    pointRadius: 1,
    pointHoverRadius: 5,
    pointHitRadius: 10
  }
}

function OutbreakLineChart({ labels, data, logarithmic }) {
  const [chartLabels, setChartLabels] = useState([])
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    // build chart labels
    const min = format(new Date('3/9/2020'), 'M/d/yyyy')
    const minIndex = labels.indexOf(min)
    labels.splice(0, minIndex)
    const chartLabels = labels
    setChartLabels(chartLabels)

    // calculate totals
    const sumArr = (sum, val) => sum + val
    const totals = []
    for (const date of chartLabels) {
      totals.push(data[date].map(c => c.POSITIVE).reduce(sumArr))
    }

    // build data sets
    const today = format(new Date(), 'M/d/yyyy')
    const chartData = []
    chartData.push(buildDataset('Total', totals, 'green'))
    for (const [key, entry] of Object.entries(data[today])) {
      if (key === 'palette' || entry.POSITIVE < 2) {
        continue
      }
      const cases = []
      for (const date of chartLabels) {
        let found = false
        for (const county of data[date]) {
          if (county.NAME === entry.NAME) {
            cases.push(county.POSITIVE)
            found = true
            break
          }
        }

        // not found
        if (!found) {
          cases.push(0)
        }
      }
      chartData.push(
        buildDataset(entry.NAME, cases, colorArray[key % colorArray.length])
      )
    }
    // console.log(chartData)
    setChartData(chartData)

    return () => {}
  }, [labels, data])

  return (
    <Line
      data={{
        labels: chartLabels.map(date => format(new Date(date), 'MMM d')),
        datasets: chartData
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            logarithmic
              ? {
                  type: 'logarithmic',
                  ticks: {
                    callback: (value, index, values) => {
                      value = parseInt(value)
                      const ticks = [0, 10, 100, 1000, 10000]
                      return ticks.includes(value) ? value : null
                    }
                  }
                }
              : {
                  type: 'linear'
                }
          ]
        }
      }}
    />
  )
}

export default OutbreakLineChart
