<template>
  <div>
    <b-card class="mb-4">
      <b-row class="justify-content-start"> 
        <b-col cols="6">
          <div class="widget-container d-flex"> <!-- Use d-flex to arrange items horizontally -->
            <b-col cols="4" md="4">
              <BatteryChart class="battery-chart ml-auto" style="flex: 1;" />
            </b-col>
            <b-col cols="8" md="8">
              <BatteryGauge class="battery-gauge" style="flex: 1;" />
            </b-col>
          </div>  
        </b-col> 
        <!-- <b-col cols="4">
        </b-col> -->
        <b-col cols="6">
          <DigiClock />
        </b-col>
      </b-row>
  </b-card>
    <b-row class="mb-4"> 
      <b-col cols="12">            
        <RangeComponent @filter="handleFilter" />          
      </b-col>
    </b-row>
    <b-row>
        <b-col cols="12">
            <StateOfCharge ref="socRef" />
        </b-col>
        <b-col cols="12">
            <InvertorPower ref="invRef" />
        </b-col>
        <b-col cols="12">
            <PowerFlow ref="flowRef" />
        </b-col>
        <b-col cols="12">
            <PriceChart />
        </b-col>
        <b-col cols="12">
            <RevenueChart />
        </b-col>
    </b-row>  

  </div>  
  
  </template>
  <script>
  // -----------------------------------------
  // Import Components Here
  // -----------------------------------------
  import axios from "axios"
  import { mapState } from 'vuex';
  // import AwesomeCards from "../dashboard-components/awesome-cards/AwesomeCards";  
  import RangeComponent from "../dashboard-components/range-component/RangeComponent";
  import InvertorPower from "../dashboard-components/echarts/InvertorPower.vue";
  import PriceChart from "../dashboard-components/echarts/PriceChart";
  // import TableChart from "../dashboard-components/echarts/TableChart";

  // import GridNodes from "../dashboard-components/echarts/GridNodes";
  // import MapCard from '../dashboard-components/echarts/MapCard.vue';
 import StateOfCharge from '../dashboard-components/echarts/StateOfCharge.vue';
 import PowerFlow from '../dashboard-components/echarts/PowerFlow.vue';

import BatteryChart from "../dashboard-components/echarts/BatteryChart.vue";
import BatteryGauge from "../dashboard-components/echarts/BatteryGauge.vue";
import DigiClock from "../dashboard-components/echarts/DigiClock.vue";
import RevenueChart from "../dashboard-components/echarts/RevenueChart.vue";

  //import HighChartTest from '../dashboard-components/echarts/HighChartTest.vue';

  


  
  // -----------------------------------------
  // Export Here
  // -----------------------------------------
  export default {
    name: "ModernDashboard",
    data: () => ({
      title: "ModernDashboard",
      show:false,
      updateTodayData: [],
      updateYearData:[],
      updateMonthData: [],
      // Month Table
      month1: 0,
      monthoptions1: [
        { text: "Monthly", value: 0 },
        { text: "Daily", value: 1 },
        { text: "Weekly", value: 2 },
        { text: "Yearly", value: 3 },
      ],
      // top selling
      selling1: 0,
      sellingoptions1: [
        { text: "Monthly", value: 0 },
        { text: "Daily", value: 1 },
        { text: "Weekly", value: 2 },
        { text: "Yearly", value: 3 },
      ],
      // weather report
      weather1: 0,
      weatheroptions1: [
        { text: "Today", value: 0 },
        { text: "Weekly", value: 1 },
      ],
    }),
    components: {
    // AwesomeCards,    
    RangeComponent,
    InvertorPower,
    //HighChartTest,
    PriceChart,
    //TableChart,   
    //MapCard,
    //GridNodes,
    StateOfCharge,
    PowerFlow,
    BatteryChart,
    BatteryGauge,
    DigiClock,
    RevenueChart
    //LineChart
    
},
    methods: {
        handleFilter(period) {
        // Perform API request based on the selected period (today, week, month)
        // Update your content based on the API response
        console.log(`Filtering content for ${period}`);
        // Make API request here and update content
        },

      async fetchToday() {          
       
          let url_schedule = `http://85.14.6.37:16543/api/schedule/?date_range=dam`;
          let url = `http://85.14.6.37:16543/api/state_of_charge/?date_range=today`;                   
          let url_cumulative = `http://85.14.6.37:16543/api/state_of_charge/?date_range=today&cumulative=true`
          let url_cumulative_dam = `http://85.14.6.37:16543/api/schedule/?date_range=dam&cumulative=true`
          try { 
                
                  const [response, cumulativeResponse, scheduleResponse, cumulativeDamResponse] = await Promise.all([
                      axios.get(url),
                      axios.get(url_cumulative),
                      axios.get(url_schedule),
                      axios.get(url_cumulative_dam),
                  ]);
                  
                  
                  this.updateTodayData = [response.data, cumulativeResponse.data, scheduleResponse.data, cumulativeDamResponse.data]
                  
              }
              catch (error) {
                console.error('Error fetching data:', error);
              } finally {
                  this.loading = false;
                  this.$refs.socRef.displayData(this.updateTodayData);
                  this.$refs.invRef.displayData(this.updateTodayData);
                  this.$refs.flowRef.displayData(this.updateTodayData);
              }
        },
        async fetchYear(){
          
          let url = `http://85.14.6.37:16543/api/year-agg/`;                   
          let url_cumulative = `http://85.14.6.37:16543/api/year-sum/`
          try { 

                
                const [response, cumulativeResponse] = await Promise.all([
                    axios.get(url),
                    axios.get(url_cumulative),
                ]);               
                
                this.updateYearData = [response.data, cumulativeResponse.data]
                
            }
            catch (error) {
              console.error('Error fetching data:', error);
            } finally {
                this.loading = false;
                this.$refs.socRef.displayData(this.updateYearData);
                this.$refs.invRef.displayData(this.updateYearData);
                this.$refs.flowRef.displayData(this.updateYearData);
            }        

        },
        async fetchMonth(){          
          let url = `http://85.14.6.37:16543/api/year-agg/?date_range=month`;                   
          let url_cumulative = `http://85.14.6.37:16543/api/year-sum/?date_range=month`
          
          try { 
                
                const [response, cumulativeResponse] = await Promise.all([
                    axios.get(url),
                    axios.get(url_cumulative),
                ]);               
                
                this.updateMonthData = [response.data, cumulativeResponse.data]
                
            }
            catch (error) {
              console.error('Error fetching data:', error);
            } finally {
                this.loading = false;
                this.$refs.socRef.displayData(this.updateMonthData);
                this.$refs.invRef.displayData(this.updateMonthData);
                this.$refs.flowRef.displayData(this.updateMonthData);
            }        

        },
        


  },
    mounted() {
        // Trigger "today" filter when the component is created
        this.handleFilter('today');
        this.fetchToday();
    },
    computed: {
      ...mapState(['dateRange']),    
  
    },

    watch: {     
      dateRange(newRange, oldRange) {
        if (newRange !== oldRange) {
          if(this.dateRange === 'today' || this.dateRange === 'dam'){
            this.fetchToday()
          } 
          else if (this.dateRange === 'month'){
            this.fetchMonth()
          }    
          else if(this.dateRange === 'year'){
            this.fetchYear()
          }
              
      }
   },
   
 },



    };
  </script>

<style scoped>
.widget-container {
  display: flex;
  justify-content: space-between; /* Align items next to each other */
  max-height: 220px;
}
.battery-chart{
  max-width: 120px;

}
</style>
