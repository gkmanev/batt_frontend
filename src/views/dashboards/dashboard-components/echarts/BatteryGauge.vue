<template>
    <div>
      <b-row>
        <b-col >
          <div class="gauge-container">
            <v-chart class="chart" width="100%" :option="option" />
          </div>
        </b-col>
      </b-row>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import VChart from "vue-echarts";
  import { mapState } from 'vuex';
  import { use } from 'echarts/core'
  import { GaugeChart } from 'echarts/charts'
  import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    ToolboxComponent,
    GridComponent,
  } from 'echarts/components'
  import { CanvasRenderer } from 'echarts/renderers'
  
  use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    ToolboxComponent,
    GridComponent,
    GaugeChart,
    CanvasRenderer
  ])
  
  export default {
    name: "BatteryGauge",
    components: {
      VChart
    },
  
    data() {
      return {
        option: {
          series: [
            {
              type: 'gauge',
              startAngle: 180,
              endAngle: 0,
              min: -50,
              max: 50,
              splitNumber: 4,
              axisLine: {
                roundCap: true,
                lineStyle: {
                  width: 17,
                  color:[  [0.5, 'rgba(242, 10, 52, 0.7)'],[1, 'rgba(57, 196, 73, 0.7)']],
                  opacity:50
                    },
                
             },  
            //   itemStyle: {
            //     shadowColor: 'rgba(0,138,255,0.45)',
            //     shadowBlur: 10,
            //     shadowOffsetX: 2,
            //     shadowOffsetY: 2,
            //     color: [
            //         [0.3, '#67e0e3'],
            //         [0.7, '#37a2da'],
            //         [1, '#fd666d']
            //     ]
                
            //   },
            //   progress: {
            //     show: true,
            //     roundCap: true,
            //     width: 7
            //   },
              pointer: {
                icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                length: '50%',
                width: 4,
                offsetCenter: [0, '5%'],
                itemStyle: {
                    color: 'orange'
                }
               
              },
              
                axisTick: {
                    splitNumber: 2,
                    lineStyle: {
                    width: 2,
                    color: '#999'
                    }
              },
              splitLine: {
                length: 8,
                lineStyle: {
                  width: 1,
                  color: '#999'
                }
              },
              axisLabel: {
                distance: 30,
                color: '#999',
                fontSize: 15
              },
              title: {
                show: false
              },
              detail: {
                valueAnimation: true,
                formatter: function (value) {
                  return '{value|' + value.toFixed(0) + '}{unit| MW}';
                },
                rich: {
                  value: {
                    fontSize: 15,
                    fontWeight: 'bolder',
                    color: '#777'
                  },
                  unit: {
                    fontSize: 12,
                    color: '#999'
                  }
                }
              },
              data: [
                {
                  value: 0
                }
              ]
            }
          ],
        }
      }
    },
  
    mounted() {
      this.fetchData();
    },
  
    computed: {
      ...mapState(['dateRange','selectedDev'])
    },
    watch: {
      dateRange(newRange, oldRange) {
        if (newRange !== oldRange) {         
          this.fetchData();
        }
      },
      selectedDev(newDev, oldDev) {
        if (newDev !== oldDev) {         
      
          this.fetchData();
        }
      },  
    },
  
    methods: {
    lastRouteSegment() {
            const pathArray = this.$route.path.split('/');    
            return pathArray.pop() || pathArray[pathArray.length - 1]; // This handles non-trailing slash URLs
    },

    async fetchData() {
        if(this.lastRouteSegment() === 'entra'){
        let url_cumulative = `http://85.14.6.37:16543/api/state_of_charge/?date_range=today&cumulative=true`
        
          const response = await axios.get(url_cumulative);
  
          let currentInvertorSum = response.data[response.data.length - 1].cumulative_invertor_power;          
          this.option.series[0].data[0].value = currentInvertorSum;
        }
        if(this.lastRouteSegment() === 'client'){

            let url = `http://85.14.6.37:16543/api/state_of_charge/?date_range=today&devId=${this.selectedDev}`
            
            const response = await axios.get(url);
          let currentInvertor = response.data[response.data.length - 1].invertor_power;
          
          
          this.option.series[0].data[0].value = currentInvertor;
          this.option.series[0].min = -25
          this.option.series[0].max = 25
          this.option.series[0].splitNumber = 2
        }
    
      },
    }
  };
  </script>
  
  <style scoped>
  .chart {
    height: 300px;
  }

  
  </style>
  
