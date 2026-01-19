<template>

  <div>
    <b-card class="mb-4" v-if="isDevSelected">
      <b-row class="justify-content-start"> 
        <b-col cols="6">
          <div class="widget-container d-flex"> <!-- Use d-flex to arrange items horizontally -->
            <b-col cols="4" md="4" class="d-flex justify-content-end">
              <BatteryChart class="battery-chart" />
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
    <b-row>     
        <b-col cols="3">            
            <SelectComponent />
        </b-col>
    </b-row>
    <b-row>
        <b-col class="mt-5" cols="3">            
            <RangeComponent class="mb-4" />          
        </b-col>
    </b-row>
   
    <b-row> 
        <b-col class="mt-3" v-if="isDevSelected" cols="12">          
            <StateOfCharge ref="socRef" />
        </b-col>  
    </b-row>
    <b-row>   
        <b-col class="mt-3" v-if="isDevSelected" cols="12">          
          <InvertorPower  ref="invRef" />
        </b-col>
    </b-row>
    <b-row> 
        <b-col class="mt-3" v-if="isDevSelected" cols="12">          
          <PowerFlow ref = "flowRef" />
        </b-col>
    </b-row>
    <b-row>    
        <b-col cols="12" v-if="isDevSelected" class="mt-3">
            <PriceChart />
        </b-col>
    </b-row>    
    <!-- <b-row>    
        <b-col cols="12" v-if="isDevSelected" class="mt-3">
            <RevenueChart />
        </b-col>
    </b-row>     -->
        <!--
         <b-col cols="8">
            <LineChart />
        </b-col>
        <b-col cols="4">
          <CustomProgress />
          <CorelationsHeat />
        </b-col>
        
        <b-col cols="12">
            <WeatherChart />
        </b-col>   
        <b-col cols="12">
            <WeatherChartClouds />
        </b-col>    -->
  
  </div>
  </template>
  <script>
  // -----------------------------------------
  // Import Components Here
  // -----------------------------------------
  
  import SelectComponent from "../dashboard-components/select-component/SelectComponent";
  import RangeComponent from "../dashboard-components/range-component/RangeComponent";
  import StateOfCharge from "../dashboard-components/echarts/StateOfCharge";  
  import PriceChart from "../dashboard-components/echarts/PriceChart"; 
  import InvertorPower from "../dashboard-components/echarts/InvertorPower.vue";
  import PowerFlow from '../dashboard-components/echarts/PowerFlow.vue';
  import BatteryChart from "../dashboard-components/echarts/BatteryChart.vue";
  import BatteryGauge from "../dashboard-components/echarts/BatteryGauge.vue";
  import DigiClock from "../dashboard-components/echarts/DigiClock.vue";
  

  // // import AwesomeCards from "../dashboard-components/awesome-cards/AwesomeCards";  
  // import CustomProgress from "../dashboard-components/progress-cards/CustomProgress.vue";
  import { mapState } from 'vuex';
  import axios from "axios"
  // import RevenueChart from "../dashboard-components/echarts/RevenueChart.vue";

//   import SalesCard from "../dashboard-components/sales-card/SalesCard.vue";
//   import WeatherChartClouds from "../dashboard-components/echarts/WeatherChartClouds.vue";
// import CorelationsHeat from "../dashboard-components/echarts/CorelationsHeat.vue";



  
  // -----------------------------------------
  // Export Here
  // -----------------------------------------
  export default {
    name: "ClientDashboard",
    data: () => ({
      title: "ClientDashboard",
      isDevSelected: false      
      
    }),
    components: {
   
    // LineChart,
    SelectComponent,    
    StateOfCharge,
    InvertorPower,
    PowerFlow,
    RangeComponent,
    PriceChart,
    DigiClock,
    BatteryChart,
    BatteryGauge,
    // RevenueChart
   // AwesomeCards,
   // WeatherChart,
   // CustomProgress,
   // SalesCard,
    // WeatherChartClouds,
    // CorelationsHeat
    
},

    mounted() {
      
        // Trigger "today" filter when the component is created
      if (this.selectedDev){       
        if (this.dateRange === 'today' || this.dateRange === 'dam'){
          this.isDevSelected = true
          this.fetchToday();
        }
        else if (this.dateRange === 'year'){
          this.isDevSelected = true
          this.fetchYear();
        }
      }
    },

  computed: {
      ...mapState(['selectedDev', 'dateRange']),
    },

  

  methods: {

    checkSelectedDev(){
      if(this.selectedDev){
        this.isDevSelected = true
      }
      else{
        this.isDevSelected = false
      }
    }, 

    async fetchToday() {          
       
      let url_schedule = `http://85.14.6.37:16543/api/schedule/?date_range=dam&devId=${this.selectedDev}`;
      let url = `http://85.14.6.37:16543/api/state_of_charge/?date_range=today&devId=${this.selectedDev}`;     
   
      
      try {            
               const [response, scheduleResponse] = await Promise.all([
                   axios.get(url),
                   axios.get(url_schedule),
               ]);
               
               
               this.updateTodayData = [response.data, scheduleResponse.data]
               
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
          
          let url = `http://85.14.6.37:16543/api/year-agg/?devId=${this.selectedDev}`;    
   
          
        
          try { 
                
                const [response] = await Promise.all([
                    axios.get(url),
                ]);               
                
                this.updateYearData = [response.data]
               
                
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
          
          let url = `http://85.14.6.37:16543/api/state_of_charge/?date_range=month&devId=${this.selectedDev}`;          
        
          try {                 
                const [response] = await Promise.all([
                    axios.get(url),
                ]);               
                
                this.updateMonthData = [response.data]          
                
            }
            catch (error) {
              console.error('Error fetching data:', error);
            } finally {
                this.loading = false;
                this.$refs.socRef.displayData(this.updateMonthData);
                this.$refs.invRef.displayData(this.updateMonthData);
                this.$refs.flowRef.displayData(this.updateMonthData);
            }
          

        }



  },
  watch: {
    selectedDev(newDev, oldDev) {
      if (newDev !== oldDev) {
        this.isDevSelected = true;
        if (this.dateRange === 'today' || this.dateRange === 'dam'){
          this.fetchToday();
        }
        else if (this.dateRange === 'month'){
            this.fetchMonth()
        }    
        else if (this.dateRange === 'year'){
          this.fetchYear();
        }
      }
    },
    dateRange(newRange, oldRange) {
        if (newRange !== oldRange) {     
          if (this.dateRange === 'today' || this.dateRange === 'dam'){
          this.fetchToday();
        }
        else if (this.dateRange === 'month'){
            this.fetchMonth()
        }    
        else if (this.dateRange === 'year'){
          this.fetchYear();
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
</style>
