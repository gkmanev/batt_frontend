<template>
    <b-card class="mb-4 line-chart">
      <div class="mt-4">
        <div v-if="loading"> <b-spinner label="Loading..."></b-spinner></div>
        <div v-else>
        <v-chart class="chart" height="450" width="100%" :option="option" @datazoom="onDataZoom" autoresize/>
        </div>
      </div>
    </b-card>
  </template>
  
  <script>
  // import * as echarts from 'echarts';

  import VChart from "vue-echarts";
  
  import { mapState } from 'vuex';
  import { mapActions } from 'vuex';
  import { use } from 'echarts/core'
  import { LineChart } from 'echarts/charts'
  import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    ToolboxComponent,
    GridComponent,
    DataZoomComponent,
  
  } from 'echarts/components'
  import { CanvasRenderer } from 'echarts/renderers'
  
  
  use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    ToolboxComponent,
    GridComponent,
    LineChart,
    CanvasRenderer,
    DataZoomComponent,
    
  ])
  
//   var timeLineSet = function(value) {
//     // Create a Date object from the UTC date string
//     let date = new Date(value);

//     // Convert UTC date to local time
//     let hours = date.getHours();
//     let minutes = date.getMinutes();

//     // Format hours and minutes to ensure two digits
//     hours = ("0" + hours).slice(-2);
//     minutes = ("0" + minutes).slice(-2);

//     return `${hours}:${minutes}`;
// };
  
 

  
  export default {
    name: "StateOfCharge",
    components: {
      VChart
    },
  
    data() {
      
      return {
        loading: false,
        
        option: {
          title: {
            text: 'State of Charge [MW/h]', 
            left: 'center',   
            textStyle: {
              fontSize: 16,
              color:'#b2b9bf',
              fontFamily: 'Arial',
              fontWeight: 'normal'
            },   
  
          },
          legend: {
            orient: 'horizontal',
            padding:[-500,100,0,0],
           
          },
          tooltip: {
                trigger: 'axis', // Tooltip triggered by axis, not just data points
                axisPointer: {
                    type: 'line', // Shows a line to indicate the axis position
                    label: {
                    backgroundColor: '#6a7985' // Optional: Customize the label background color
                    }
                },
                backgroundColor: '', // Your custom background color
                borderWidth: 0, // Set border width to 0 to remove the border
                shadowBlur: 0, // Set shadow blur to 0 to remove the shadow
                shadowOffsetX: 0, // Set shadow offset X to 0
                shadowOffsetY: 0, // Set shadow offset Y to 0
                shadowColor: 'transparent', // Set shadow color to transparent
                formatter: (params) => {
                    if (params && params.length) {
                    let tooltipContent = `<div class="tooltip-set" style="text-align:left; padding:0; margin:0; background-color: black; border-radius: 8px;">`;
                    //let cumulativeValue = 0;
                    let localTime;
                    let sumValue = null
                    // Loop over each series data point
                    params.forEach(param => {
                        //const socValue = param.data[1];
                        
                        //cumulativeValue += socValue; // Add current SoC value to cumulative total
                        const utcTime = new Date(param.data[0]);
                        const hours = utcTime.getHours().toString().padStart(2, '0');
                        const minutes = utcTime.getMinutes().toString().padStart(2, '0');
                        const day = utcTime.getDate().toString().padStart(2, '0');
                        const month = (utcTime.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
                        const year = utcTime.getFullYear();

                        // Construct time in the desired format: 13:13 | 01.10.2024
                        localTime = `${hours}:${minutes} | ${day}.${month}.${year}`;

                        if (param.seriesName === 'SUM' || param.seriesName === 'SUM Day Ahead') {
                            sumValue = param.data[1]; // Capture the sum value
                            
                            return;
                        }
                        if (param.seriesName === 'Batt1 Day Ahead')
                        {   
                          param.seriesName = 'Batt1'
                        }else if(param.seriesName === 'Batt2 Day Ahead'){
                          param.seriesName = 'Batt2'
                        }
                        tooltipContent += `
                        <div style="padding-right:15px;padding-left:15px;padding-top:3px;padding-bottom:3px;margin-bottom:0;border-bottom-left-radius: 8px;border-bottom-right-radius: 8px;">
                            <ul style="list-style-type: none; margin: 0; padding-left: 0;">
                            <li>
                                <div class="color-point" style="width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 5px; background-color: ${param.color};"></div>
                                <span style="color: gray;">${param.seriesName}: </span><span style="color: white;">${param.data[1]} MW/h</span>
                            </li>
                            </ul>
                        </div>`;
                    });
                    // Append cumulative SoC value at the end of the tooltip
                    // Add the total cumulative SoC to the tooltip content at the end
                    let footer = ''
                    if(sumValue){
                      footer = `
                      <div style="color: white; padding: 10px; background-color: #333; border-top: 1px solid #999;">                                              
                          <strong>Total ${sumValue}  </strong> at <span style="color: white;">${localTime}</span>
                      </div>`;
                    }else{
                      footer = `
                      <div style="color: white; padding: 10px; background-color: #333; border-top: 1px solid #999;">                                              
                          <strong>Time: </strong> <span style="color: white;">${localTime}</span>
                      </div>`;
                    }
                    tooltipContent += footer
                    tooltipContent += `</div>`;
                    return tooltipContent;
                    }
                    return ''; // Return an empty string if there's no data to show
                }
            },
              
    grid: {
      bottom: '25%',
      left:'10%',
      containLabel: false
    },
    xAxis: 
      {
        type: 'time',
        axisLabel: {
          rotate:40,
          margin:25,
          textStyle: {
              color: '#9a9a9a'
          },
      },
      axisLine: {
        show: true,
        onZero: true
      },

  
      boundaryGap: false,    
        
      },
    
    yAxis: [
      {
        type: 'value',
        splitLine: {
          show: false // Set this property to false to hide horizontal grid lines
        }
      },
      
    ],
    dataZoom: [
      {
        
        type: 'slider',
        height: 20,
        handleSize: '75%',
        show: true,
        dataBackground: {
            areaStyle: {
                color: '#9a9a9a'
            }
        },
        start: 0, // Start of the month (timestamp)
        end: 100, // End of the month (timestamp)
        // zoomLock: true // Lock the zoom window size to prevent resizing
    
      },
    ],
    
    series:[
    
    {
              name: "Batt1",
              smooth: true,            
              stack: 'Total',
              lineStyle:{
                width:0
              },
              itemStyle: {
                  color: '#009BCB'
              },
                     
              data: [],
              type: 'line',
              showSymbol: false,   
              areaStyle: {                
              },
      
              
    },
    {
              name: "Batt2",
              smooth: true,            
              stack: 'Total',
              lineStyle:{
                width:0
              },
              itemStyle: {
                color: '#FFBC34'
              },
              
              data: [],
              type: 'line',
              showSymbol: false,   
              areaStyle: {},        
              
    },
    {
              name: "Batt1 Day Ahead",
              smooth: true,            
              stack: 'Dam',
              lineStyle:{
                width:0,
                type: 'dashed'
              },
              itemStyle: {
                  color: '#009BCB'
              },              
              sampling: 'average',
              data: [],
              type: 'line',
              showSymbol: false,   
              areaStyle: {opacity: 0.3},            
             
              
    },
    {
              name: "Batt2 Day Ahead",
              smooth: true,            
              stack: 'Dam',
              lineStyle:{
                width:0,
                type: 'dashed'
              },
              itemStyle: {
                  color: '#FFBC34'
              },
              sampling: "",
              data: [],
              type: 'line',
              
              showSymbol: false,   
              areaStyle: {
                opacity: 0.3
              }
              
                        
    },

    {
              name: "SUM",
              smooth: true,             
              lineStyle:{
                width:1,               
              },
              itemStyle: {
                  color: 'yellow',
                  opacity: 0
              },
              sampling: 'average',
              data: [],
              type: 'line',
              
              showSymbol: false,                        
                        
    },
    
    {
              name: "Batt1 Day Ahead Before",
              smooth: true,            
              //stack: 'Dam',
              lineStyle:{
                width:0,                
              },             
              sampling: 'average',
              data: [],
              type: 'line',
              showSymbol: false,  
             
              
    },
    {
              name: "Batt2 Day Ahead Before",
              smooth: true,            
             // stack: 'Dam',
              lineStyle:{
                width:0,               
              },                     
              sampling: 'average',
              data: [],
              type: 'line',
              showSymbol: false,             
              
    },
    {
              name: "SUM Day Ahead",
              smooth: true,             
              lineStyle:{
                width:1,  
                type:"dashed"                             
              },
              itemStyle: {
                  color: 'yellow'
              },
              sampling: 'average',
              data: [],
              type: 'line',
              
              showSymbol: false,           
                        
    },
    {
              name: "SUM Day Ahead Before",
              smooth: true,             
              lineStyle:{
                width:0,   
                type:'dashed'            
              },
              itemStyle: {
                  color: 'yellow'
              },
              sampling: 'average',
              data: [],
              type: 'line',
              
              showSymbol: false,           
                        
    },

    {
              name: "Batt1 Day Ahead",
              smooth: true,            
              stack: 'Dam2',
              lineStyle:{
                width:0,
                type: 'dashed'
              },
              itemStyle: {
                  color: '#009BCB'
              },              
              sampling: 'average',
              data: [],
              type: 'line',
              showSymbol: false,   
              areaStyle: {opacity: 0.1},            
             
              
    },
    {
              name: "Batt2 Day Ahead",
              smooth: true,            
              stack: 'Dam2',
              lineStyle:{
                width:0,
                type: 'dashed'
              },
              itemStyle: {
                  color: '#FFBC34'
              },
              sampling: "",
              data: [],
              type: 'line',
              
              showSymbol: false,   
              areaStyle: {
                opacity: 0.1
              }
              
                        
    },
    {
              name: "SUM Day Ahead",
              smooth: true,             
              lineStyle:{
                width:1,  
                type:"dashed",
                opacity:0.3                             
              },
              itemStyle: {
                  color: 'yellow'
              },
              sampling: 'average',
              data: [],
              type: 'line',
              
              showSymbol: false,           
                        
    },



    ],

  }
        //end option
      };
    },
  
    mounted() { 
      this.option.series[0].data = [];
      this.option.series[1].data = [];
      this.option.series[2].data = [];
      this.option.series[3].data = [];
      this.option.series[4].data = [];
      this.option.series[5].data = [];
      this.option.series[6].data = [];
      this.option.series[7].data = [];
      this.option.series[8].data = [];
      this.option.series[9].data = [];
      this.option.series[10].data = [];
      this.option.series[11].data = [];
        this.setAxisTimeRange();
       // this.displayData();

    //  const foundObject = this.all_devs.find(obj => obj.id === this.selectedDev);      
    //   if (foundObject)
    //   {
       
    //   }    
      //this.fetchData();
    },
  
    computed: {
      ...mapState(['dateRange','selectedDev', 'all_devs']),    
  
    },
    watch: {
   
      
      dateRange(newRange, oldRange) {
        if (newRange !== oldRange) {
          this.option.series[0].data = [];
          this.option.series[1].data = [];
          this.option.series[2].data = [];
          this.option.series[3].data = [];
          this.option.series[4].data = [];
          this.option.series[5].data = [];
          this.option.series[6].data = [];
          this.option.series[7].data = [];
          this.option.series[8].data = [];
          this.option.series[9].data = [];
          this.option.series[10].data = [];
          this.option.series[11].data = [];
          this.setAxisTimeRange()
         
          //this.displayData();
          
        }
      },
      selectedDev(newDev, oldDev) {
        if (newDev !== oldDev) {
          this.option.series[0].data = [];
          this.option.series[1].data = [];
          this.option.series[2].data = [];
          this.option.series[3].data = [];
          this.option.series[4].data = [];
          this.option.series[5].data = [];
          this.option.series[6].data = [];
          this.option.series[7].data = [];
          this.option.series[8].data = [];
          this.option.series[9].data = [];
          this.option.series[10].data = [];
          this.option.series[11].data = [];
         // this.option.series[0].data = []
          this.setAxisTimeRange()
          //this.displayData();
        }
      },   
  
    },
  
    methods: {

      onDataZoom(event) {
        // Capture the dataZoom start and end values
        const start = event.start;
        const end = event.end;        
        this.updateZoomData([start, end]);
      },

      ...mapActions(['updateZoomData']),

      lastRouteSegment() {
            const pathArray = this.$route.path.split('/');    
            return pathArray.pop() || pathArray[pathArray.length - 1]; // This handles non-trailing slash URLs
        },

      setHourlyAxisLabels() {
        // Update xAxis axisLabel formatter and interval
        this.option.xAxis.axisLabel = {
          ...this.option.xAxis.axisLabel, // Preserve existing axisLabel properties
          formatter: function(value) {
            const date = new Date(value);
            return `${date.getHours()}:00`;
          }
        };
  
        this.option.xAxis.interval = 3600 * 1000; // One hour in milliseconds
  
      },  
  
      setAxisTimeRange() {
            // Create a new Date object for today's date (in local time)
            const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            let start = new Date(today); // Initialized with today's date            
            let end = new Date(today);   // Initialized with today's date
            

            if (this.dateRange === 'today') {
                end.setHours(23, 59, 59); // Set end time to the end of the day                
                this.option.xAxis.splitNumber = 24; // 24 hours in a day              
                this.option.dataZoom[0].start = 0;
                this.option.dataZoom[0].end = 100;
                this.option.dataZoom[0].zoomLock = false;

            } 
            else if (this.dateRange === 'dam') {

              start.setHours(0, 0, 0); // Start of today at 00:00
              end.setDate(end.getDate() + 2); // Move to the day after tomorrow
              end.setHours(1, 0, 0); // Set end time to 01:00 of the day after tomorrow             
              this.option.xAxis.splitNumber = 24; // 48 half-hour intervals in 24 hours
              this.option.dataZoom[0].start = 0;
              this.option.dataZoom[0].end = 100;
              this.option.dataZoom[0].zoomLock = false;

            } else if (this.dateRange === 'month') {
                start.setDate(1); // Start of the month
                end.setMonth(end.getMonth() + 1, 0); // Last day of the current month
                end.setHours(23, 59, 59); // Set end time to the end of the day
                this.option.xAxis.splitNumber = 12;
                this.option.dataZoom[0].start = 0;
                this.option.dataZoom[0].end = 100;
                this.option.dataZoom[0].zoomLock = false;
               
                this.option.xAxis.splitNumber = end.getDate(); // Number of days in the month
            } else if (this.dateRange === 'year') {
                start.setMonth(0, 1); // Start of the year (January 1st)
                end.setFullYear(end.getFullYear(), 11, 31); // Last day of the year (December 31st)
                end.setHours(23, 59, 59); // Set end time to the end of the day
               
                this.option.xAxis.splitNumber = 12; // 12 months in a year
                // Adjust the zoom window for one month (approx 8% of the year)
                // Calculate the zoom window for the current month
                const currentMonth = today.getMonth();
                const totalMonths = 12;

                // Calculate the percentage range for the current month
                const startPercentage = ((currentMonth / totalMonths) * 100) - 1;
                const endPercentage = ((currentMonth + 1) / totalMonths) * 100;

                this.option.dataZoom[0].start = startPercentage;
                this.option.dataZoom[0].end = endPercentage;
                //this.option.dataZoom[0].zoomLock = true;
            }

            // Update xAxis min and max properties
            this.option.xAxis.min = start.getTime();
            
            this.option.xAxis.max = end.getTime();

            // If needed, force an update to the chart to apply these changes
            this.$refs.chart && this.$refs.chart.refresh(); 
    },

    async displayData(data) {
      let updateCurrentPath = this.lastRouteSegment()

      if(updateCurrentPath == 'entra') {                   
       
          try {
              if (this.dateRange === "today" || this.dateRange === "dam") {   

                this.processData(data[0]);
                this.processSchedule(data[2]);
                this.processCumulative(data[1]);     
                this.processCumulativeDam(data[3]);           

              }

              else if (this.dateRange === 'year' || this.dateRange === 'month'){               
                  
                  this.processData(data[0]);
                  this.processCumulative(data[1])
                  this.setAxisTimeRange();
                
              }       

              
           
          } catch (error) {
              console.error('Error fetching data:', error);
          } finally {
              this.loading = false;
          }
    }
    if(updateCurrentPath == 'client') { 

      try {      
              if (this.dateRange === "today" || this.dateRange === 'dam') {   
               
                  this.processData(data[0]);
                  this.processSchedule(data[1]);                   

                }

                else if (this.dateRange === "year" || this.dateRange == "month"){                 
                  this.processData(data[0]);
                  this.setAxisTimeRange()                   

                } 

           
              
      } catch (error) {
          console.error('Error fetching data:', error);
      } finally {
          this.loading = false;
      }
    }
    },
  
    //Today, Month, Year
    processData(data) {
        if(data){
          let devIdToSeriesIndex = {};
          this.all_devs.forEach((dev, index) => {
              devIdToSeriesIndex[dev.id] = index;
          });       
          
          data.forEach(el => {
              let date = new Date(el.timestamp);          
              let seriesIndex = devIdToSeriesIndex[el.devId];
              if (seriesIndex !== undefined) {
                this.option.series[seriesIndex].data.push([date.getTime(), el.state_of_charge]);                
              }            
          }); 
        }       

       
    },

    processSchedule(schedule){
      if(schedule){          
          let currentDate = new Date();
          let tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1); // Move to tomorrow
          tomorrow.setHours(1, 0, 0, 0); // Set the time to 01:00:00.000

          schedule.forEach(elSched =>{           
          let date = new Date(elSched.timestamp);                          
                if (elSched.devId === "batt-0001") {  
                    if (date >= currentDate && date <= tomorrow){
                      this.option.series[2].data.push([date.getTime(), elSched.soc]);                      
                    }     
                    else if(date >= tomorrow){
                      this.option.series[9].data.push([date.getTime(), elSched.soc]);  
                    }                             
                }       
                        
                if (elSched.devId === "batt-0002") {
                  if (date >= currentDate && date <= tomorrow){
                      this.option.series[3].data.push([date.getTime(), elSched.soc]); 
                    }   
                  if( date >= tomorrow){
                    
                    this.option.series[10].data.push([date.getTime(), elSched.soc]); 
                  }              
               }
          })
        }
    },

    processCumulative(stackData){         
      if (stackData){         
        stackData.forEach(el => {
              let date = new Date(el.timestamp);
              this.option.series[4].data.push([date.getTime(), el.cumulative_soc]);
            
          });          
      }
    },
    processCumulativeDam(stackData){      
      let currentDate = new Date();   
      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1); // Move to tomorrow
      tomorrow.setHours(1, 0, 0, 0); // Set the time to 01:00:00.000  
      let hours = currentDate.getHours()
      if (stackData){         
        stackData.forEach(el => {
              let date = new Date(el.timestamp);
              if (date >= currentDate && date <= tomorrow){        
                this.option.series[7].data.push([date.getTime(), el.cumulative_soc]);
              //this.option.series[8].data.push([date.getTime(), el.cumulative_soc]);
              }
              else if(date >= tomorrow){
                this.option.series[11].data.push([date.getTime(), el.cumulative_soc]);
                if (hours >= 14){
                  this.option.series[9].areaStyle.opacity = 0.3
                  this.option.series[10].areaStyle.opacity = 0.3
                }
              }

              // else{
              //   this.option.series[7].data.push([date.toISOString(), el.cumulative_soc]);
              // }
            
          }); 
               
      }
    },


  }
  
  };
  
  
  </script>
  
  <style scoped>
  
  
  
  .line-chart {
    height: 480px;
  }
  .chart {
    height: 400px;
  }
  </style>
