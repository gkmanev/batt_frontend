<template>
    <b-card class="mb-4">
      <div class="mt-4">
        <v-chart class="chart" height="250" :option="option" autoresize />
      </div>
    </b-card>
  </template>
  
  <script>
  
  import VChart from "vue-echarts";
  import axios from 'axios';
  import { mapState } from 'vuex';
  import { use } from 'echarts/core'
  import { LineChart } from 'echarts/charts'
  import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    ToolboxComponent,
    GridComponent
  } from 'echarts/components'
  import { CanvasRenderer } from 'echarts/renderers'
  
  use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    ToolboxComponent,
    GridComponent,
    LineChart,
    CanvasRenderer
  ])
  
  // var timeLineSet = function(value) {
  //   // Create a Date object from the UTC date string
  //   let date = new Date(value);
  
  //   // Get UTC hours and minutes
  //   let hours = date.getUTCHours();
  //   let minutes = date.getUTCMinutes();
  
  //   // Format hours and minutes to ensure two digits
  //   hours = ("0" + hours).slice(-2);
  //   minutes = ("0" + minutes).slice(-2);
  
  //   return `${hours}:${minutes}`;
  // }  



//   var toolTipSet = function (params) {
//   let chartdate = new Date(params[0].value[0])
//   let month = chartdate.getMonth()+1
//   month = ("0"+month).slice(-2)
//   let day = chartdate.getDate()
//   day = ("0"+day).slice(-2)
//   let hours  = chartdate.getUTCHours()
//   hours = ("0"+hours).slice(-2)
//   let mins = chartdate.getMinutes()
//   mins = ("0" + mins).slice(-2)
//   let formatTime = day+"."+month+"/"+hours+":"+mins
//   var vals = params.reduce((prev, curr) => prev + '<li style="list-style:none">' + curr.marker + curr.seriesName + "&nbsp;&nbsp;" + curr.value[1] + "</li>", "");

//   return formatTime + vals;
//   }

  export default {
    name: "PriceChart",
    components: {
      VChart
    },
  
    data() {
      return {
        currTime:'',
        currDate:'',
        currYear:'',
        currMonth:'',
        monthLenth:'',
        created_date_or_created: 'created_date',
        //option
        option: {
          title: {
          text: 'DAM Price',    
          left: 'center',   
          textStyle: {
            fontSize: 16,
            color:'#b2b9bf',
            fontFamily: 'Arial',
            fontWeight: 'normal'
          },
        },
          tooltip: {
            backgroundColor: '', // Set your desired background color
            trigger: 'axis',
            borderWidth: 0, // Set border width to 0 to remove the border
            shadowBlur: 0, // Set shadow blur to 0 to remove the shadow
            shadowOffsetX: 0, // Set shadow offset X to 0
            shadowOffsetY: 0, // Set shadow offset Y to 0
            shadowColor: 'transparent', // Set shadow color to transparent
            formatter: (params) => {
                    if (params && params.length) {
                    let tooltipContent = `<div class="tooltip-set" style="text-align:left; padding:0; margin:0; background-color: black; border-radius: 8px;">`;
                    let localTime;
                    // Loop over each series data point
                    params.forEach(param => {
                      const utcTime = new Date(param.data[0]);
                      const hours = utcTime.getHours().toString().padStart(2, '0');
                      const minutes = utcTime.getMinutes().toString().padStart(2, '0');
                      const day = utcTime.getDate().toString().padStart(2, '0');
                      const month = (utcTime.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
                      const year = utcTime.getFullYear();
                        // Construct time in the desired format: 13:13 | 01.10.2024
                      localTime = `${hours}:${minutes} | ${day}.${month}.${year}`;

                      if(parseInt(hours) == this.removeDoublePriceTitles()){                        
                        if(param.seriesName === 'price '){                      
                 
                           tooltipContent = ``          
                          
                        }
                      }
                        tooltipContent += `
                        <div style="vertical-align: middle; color: white; padding-left: 10px;">
                            ${param.seriesName}
                        </div>
                        <div style="padding-right:15px;padding-left:15px;padding-top:3px;padding-bottom:3px;margin-bottom:0;background-color: #272b34;border-bottom-left-radius: 8px;border-bottom-right-radius: 8px;">
                            <ul style="list-style-type: none; margin: 0; padding-left: 0;">
                            <li>
                                <div class="color-point" style="width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 5px; background-color: ${param.color};"></div>
                                <span style="color: gray;"></span><span style="color: white;">${param.data[1]}</span>
                            </li>
                            <li>
                                <span style="color: gray;">Time: </span><span style="color: white;">${localTime}</span>
                            </li>
                            </ul>
                        </div>`;
                    });

                    tooltipContent += `</div>`;
                    return tooltipContent;
                    }
                    return ''; // Return an empty string if there's no data to show
                }
          },
  
          grid: {
            // left: '5%',
            // right: '1%',
            bottom: '35%',
            containLabel: false,            
          },
          xAxis: 
            {
              type: 'time',
              axisLabel: {
                rotate:40,
                margin:20,
                textStyle: {
                    color: '#9a9a9a'
                },
            },
          axisLine: {
            show: true,
          },
  
          boundaryGap: false,    
          data:[]
        
      },
    
    yAxis: [
      {
        type: 'value',
        splitLine: {
          show: false // Set this property to false to hide horizontal grid lines
        }
      },
      
    ],
    dataZoom: [{

      //top: 0,
      height: 20,      
      handleSize: "75%",
      // handleStyle: {
      //          color: "#9a9a9a",
      //          borderColor: "rgba(255, 255, 255, 1)",
      //          opacity: 0.5
      //  },

      show: true,

      // backgroundColor:'#9a9a9a',
        //  fillerColor: "rgba(255, 255, 255, 0.1)",
          dataBackground: {
              areaStyle: {
                  color: "#9a9a9a"
                      }
                  },
      start: 0,
      end: 100
      },

      ],
    series:[
      
        {
            name: "price",
            smooth: true,
            step: 'middle',
            clip: true,
            lineStyle:{
              width:1
            },
            itemStyle: {
                color: '#39c449'
            },
            sampling: 'average',
            data: [],
            type: 'line',           
            
        },
        {
            name: "price ",
            smooth: false,
            step: 'middle',
            lineStyle:{
                type: 'dotted',
                width: 1
            },
            itemStyle: {
                color: '#39c449'
            },
            sampling: 'lttb',
            data: [],
            type: "line",
        },
        {
            name: "DAM Price",
            smooth: false,
            step: 'middle',
            lineStyle:{
                type: 'dotted',
                width: 1,
                color: '#39c449'
            },
            itemStyle: {
                color: '#39c449'
            },
            sampling: 'lttb',
            data: [],
            type: "line",
        },
        {
            name: "forecast Price",
            smooth: false,
            step: 'middle',
            lineStyle:{                
                type: 'dotted',
                width: 1,
                color: 'yellow'
            },
            itemStyle: {
                color: 'yellow'
            },
            sampling: 'lttb',
            data: [],
            type: "line",
        },
        {
            name: "forecast DAM Price",
            smooth: false,
            step: 'middle',
            lineStyle:{
                type: 'dotted',
                width: 1,
                color: 'yellow'
            },
            itemStyle: {
                color: 'yellow'
            },
            sampling: 'lttb',
            data: [],
            type: "line",
        },
        {
            name: "forecast DAM Price",
            smooth: false,
            step: 'middle',
            lineStyle:{
                type: 'dotted',
                width: 1,
                color: 'yellow'
            },
            itemStyle: {
                color: 'yellow'
            },
            sampling: 'lttb',
            data: [],
            type: "line",
        },
    ]
  }
        //end option
      };
    },
  
    mounted() {
      this.fetchData();
      this.removeDoublePriceTitles();
    },
  
    computed: {
      ...mapState(['dateRange', 'zoomData', 'selectedDev'])
    },
    watch: {

      zoomData(newZoom, oldZoom){
        if (newZoom !== oldZoom){
          const start = newZoom[0]
          const end = newZoom[1]
          if(this.dateRange !== 'year'){          
            this.option.dataZoom[0].start = start
            this.option.dataZoom[0].end = end
          }
        }

      },
      
      dateRange(newRange, oldRange) {
        if (newRange !== oldRange) {
          this.option.series[0].data = []
          this.option.series[1].data = []
          this.option.series[2].data = []
          this.option.series[3].data = []
          this.option.series[4].data = []
          this.option.series[5].data = []
          this.fetchData();
        }
      },
      selectedDev(newDev, oldDev) {
        if(newDev !== oldDev){
          this.option.series[0].data = []
          this.option.series[1].data = []
          this.option.series[2].data = []
          this.option.series[3].data = []
          this.option.series[4].data = []
          this.option.series[5].data = []
          this.fetchData();
        }

      }
    },

    created (){
        this.getCurrTime()
        let date = this.currDate.split("T")[0].split("-")
        let year = parseInt(date[0])
        let month = parseInt(date[1])   
        this.monthLenth = this.daysInMonth(month,year)
    },
  
    methods: {

      removeDoublePriceTitles(){
        const today = new Date;
        return today.getHours()

      },

  
      // setHourlyAxisLabels() {
      //   // Update xAxis axisLabel formatter and interval
      //   this.option.xAxis.axisLabel = {
      //     ...this.option.xAxis.axisLabel, // Preserve existing axisLabel properties
      //     formatter: function(value) {
      //       const date = new Date(value);
      //       return `${date.getHours()}:00`;
      //     }
      //   };
  
      //   this.option.xAxis.interval = 3600 * 1000; // One hour in milliseconds

      // },  
  
      setAxisTimeRange() {
          //const today = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));
          const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
          let start = new Date(today); // Initialized with today's date            
          let end = new Date(today);   // Initialized with today's date
  
          if (this.dateRange === 'today') {
            end.setHours(23, 59, 59); // Set end time to the end of the day                
                this.option.xAxis.splitNumber = 24; // 24 hours in a day              
                this.option.dataZoom[0].start = 0;
                this.option.dataZoom[0].end = 100;
                this.option.dataZoom[0].zoomLock = false;
          } else if (this.dateRange === 'dam'){
              start.setHours(0, 0, 0); // Start of today at 00:00
              end.setDate(end.getDate() + 2); // Move to the day after tomorrow
              end.setHours(1, 0, 0); // Set end time to 01:00 of the day after tomorrow             
              this.option.xAxis.splitNumber = 24; // 48 half-hour intervals in 24 hours
              this.option.dataZoom[0].start = 0;
              this.option.dataZoom[0].end = 100;
              this.option.dataZoom[0].zoomLock = false;
          }
           else if (this.dateRange === 'month') {
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
          }
  
            this.option.xAxis.min = start.getTime();
            
            this.option.xAxis.max = end.getTime();
      },
  
  
    async fetchData() {
        let queryParam = this.dateRange;
        const start = this.currDate;
        const end = this.currTime;
        const tomorrow = new Date(new Date(start).setDate(new Date(start).getDate() + 1)).toISOString();
        

        // Configuration based on dateRange
        if (queryParam === 'today') {
            //this.configureChartForToday(); // Extract chart configuration to a method for better readability

            const url1 = `http://85.14.6.37:16455/api/price/?timestamp=&start_date=${start}&end_date=${end}`;
            
            const url2 = `http://85.14.6.37:16455/api/price/?timestamp=&start_date=${end}&end_date=${tomorrow}`;
            

            const url3Forecast =  `http://85.14.6.37:16543/api/forecasted_price/?start_date=${start}&end_date=${end}`;

            const url4Forecast = `http://85.14.6.37:16543/api/forecasted_price/?start_date=${end}&end_date=${tomorrow}`;
         
            
            try {
                const [responseOne, responseTwo, responseThree, responseFour] = await Promise.all([
                    axios.get(url1),
                    axios.get(url2),
                    axios.get(url3Forecast),
                    axios.get(url4Forecast)
                ]);
                
                this.processResponseData(1, responseOne.data); // Assuming series 1 is for the first set of data
                this.processResponseData(2, responseTwo.data); // Assuming series 2 is for the second set of data
                this.processForecast(responseThree.data, responseFour.data)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        else if (queryParam === 'dam'){
          const url1 = `http://85.14.6.37:16543/api/price/?start_date=${start}&end_date=${end}`;
          const url2 = `http://85.14.6.37:16543/api/price/?start_date=${end}&end_date=${tomorrow}`;
          const url3 = `http://85.14.6.37:16543/api/price/?date_range=dam`;          
          const url4Forecast =  `http://85.14.6.37:16543/api/forecasted_price/?start_date=${start}&end_date=${end}`;
          const url5Forecast = `http://85.14.6.37:16543/api/forecasted_price/?start_date=${end}&end_date=${tomorrow}`;
          const urlForecastDam = `http://85.14.6.37:16543/api/forecasted_price/?date_range=dam`;
                      
          try {
                const [responseOne, responseTwo, responseThree, responseFour, responseFive, responseDam] = await Promise.all([
                    axios.get(url1),
                    axios.get(url2),
                    axios.get(url3),
                    axios.get(url4Forecast),
                    axios.get(url5Forecast),
                    axios.get(urlForecastDam),


                ]);                
                this.processResponseDayAhead(responseOne.data, responseTwo.data, responseThree.data)
                this.processForecast(responseFour.data, responseFive.data)
                this.processForecastDayAhead(responseDam.data)

            } catch (error) {
                console.error('Error fetching data:', error);
            }

        }
        else{

          const url = `http://85.14.6.37:16543/api/price/?date_range=${queryParam}`;

          const urlForecast = `http://85.14.6.37:16543/api/forecasted_price/?date_range=${queryParam}`;

          try{
            const [responseOne, responseTwo] = await Promise.all([
                    axios.get(url),
                    axios.get(urlForecast),
                ]);  
            this.processMonthYear(responseOne.data, responseTwo.data)              

          } catch (error) {
                console.error('Error fetching data:', error);
          }

          
          // axios.get(url)
          //        .then(response => response.data.forEach(el=>{                 
          //           this.option.series[0].data.push([el.timestamp, el.price])
          //        }))
          //       .catch(errors => {
          //           console.log(errors)
          //       })
        }
        this.setAxisTimeRange()
    },
    getCurrTime(){
        let date = new Date();
        date.setDate(date.getDate());
        let y = date.getFullYear()
        this.currYear = y
        let thisMonth = date.getMonth()+1
        thisMonth = ('0' + thisMonth).slice(-2);
        this.currMonth = thisMonth
        let toDay = date.getDate()
        toDay = ('0' + toDay).slice(-2);
        let currHour = date.getHours()
        currHour = ('0' + currHour).slice(-2);
        let currMin = ":00:00Z"
        let now = y+"-"+thisMonth+"-"+toDay+"T"+currHour+currMin
        this.currTime = now
        this.currDate = y+"-"+thisMonth+"-"+toDay+"T"+"00:00:00Z"

   },

   daysInMonth (month, year) {
       return new Date(year, month, 0).getDate();
   },


    // Example of extracting data processing into a separate method
    processResponseData(seriesIndex, priceData) {
        if(seriesIndex == 1){          
            priceData.forEach(el =>{
                let date = new Date(el.timestamp);
                date = new Date(date.getTime() - (2 * 60 * 60 * 1000));
                el = [date.toISOString(), el.price]
                this.option.series[0].data.push(el) 
            })     
        }
        else{
            priceData.forEach(el =>{
              let date = new Date(el.timestamp);
              date = new Date(date.getTime() - (2 * 60 * 60 * 1000));
              el = [date.toISOString(), el.price]             
              this.option.series[1].data.push(el)
              this.option.series[1].lineStyle.color = '#39c449'
              this.option.series[1].itemStyle.color = "#39c449"
            })   
        }
      },
    // Process DAM
    processResponseDayAhead(res1, res2, res3){
      if (res1 && res2 && res3){        
        res1.forEach(el => {  
          let date = new Date(el.timestamp);
          date = new Date(date.getTime() - (2 * 60 * 60 * 1000));        
          el = [date.toISOString(), el.price]         
          this.option.series[0].data.push(el);
        })
        res2.forEach(el => {
          let date = new Date(el.timestamp);
          date = new Date(date.getTime() - (2 * 60 * 60 * 1000));
          el = [date.toISOString(), el.price]
          this.option.series[1].data.push(el);
          this.option.series[1].lineStyle.color = '#39c449'
          this.option.series[1].itemStyle.color = "#39c449"
        })
        res3.forEach(el => {
          let date = new Date(el.timestamp);
          date = new Date(date.getTime() - (2 * 60 * 60 * 1000));
          el = [date.toISOString(), el.price]
          this.option.series[2].data.push(el);
        })
      }

    },

    processForecast(res1, res2)
    {
      res1.forEach(el =>{
          let date = new Date(el.timestamp);
          date = new Date(date.getTime() - (2 * 60 * 60 * 1000));
          el = [date.toISOString(), el.price]
          this.option.series[3].data.push(el) 
          this.option.series[3].lineStyle.color = "orange"
          this.option.series[3].itemStyle.color = "black"
      })
      res2.forEach(el =>{
          let date = new Date(el.timestamp);
          date = new Date(date.getTime() - (2 * 60 * 60 * 1000));
          el = [date.toISOString(), el.price]
          this.option.series[4].data.push(el) 
          this.option.series[4].lineStyle.color = "orange"
          this.option.series[4].itemStyle.color = "black"
      })

    },   
    processForecastDayAhead(res){
      res.forEach(el =>{
          let date = new Date(el.timestamp);
          date = new Date(date.getTime() - (2 * 60 * 60 * 1000));
          el = [date.toISOString(), el.price]
          this.option.series[5].data.push(el)        
          this.option.series[5].lineStyle.color = "orange"
          this.option.series[5].itemStyle.color = "black"
      })

    },
    processMonthYear(res, resForecast){
      res.forEach(el => {
        this.option.series[0].data.push([el.timestamp, el.price])
      })
      resForecast.forEach(el => {
        this.option.series[1].data.push([el.timestamp, el.price])
        this.option.series[1].lineStyle.color = 'orange'
        this.option.series[1].itemStyle.color = "black"
      })

    } 
   
      }
    };
  

  
  
  </script>
  
  <style scoped>
  .chart {
    height: 450px;
  }
  </style>