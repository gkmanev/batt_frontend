<template>
  <div class="d-flex justify-content-between">
    <div class="filter-buttons">
            <b-button-group>
              <b-button @click="filterContent('dam')" :class="{ 'active': selectedPeriod === 'dam' }">Day Ahead</b-button>
              <b-button @click="filterContent('today')" :class="{ 'active': selectedPeriod === 'today' }">Today</b-button>
              <b-button @click="filterContent('month')" :class="{ 'active': selectedPeriod === 'month' }">Month</b-button>
              <b-button @click="filterContent('year')"  :class="{ 'active': selectedPeriod === 'year' }">Year</b-button>              
            </b-button-group>
    </div>
    <div class="forecast-button">
      <b-button @click="populateBatterySchedule"  :class="{'btn-forecast':'btn', 'active': selectedPeriod === 'forecast' }">Create forecast</b-button>
    </div>
  </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  import { mapState } from 'vuex';
  import axios from 'axios';
  export default {
    data() {
      return {
        selectedPeriod: 'today',
      };
    },

    computed: {
      ...mapState(['dateRange']),    
  
    },
    mounted() { 

      this.selectedPeriod = this.dateRange

    },
  
    methods: {

      ...mapActions(['updateDateRange']),
      

      filterContent(period) {
        
        this.selectedPeriod = period
        // console.log(period)
        this.updateDateRange(period)
       
        //this.$emit('filter', period);          
      },

      async populateBatterySchedule() {
      try {
          const response = await axios.post('http://85.14.6.37:16543/api/populate-schedule/');
          if (response.status === 202) {
            console.log('Task started:', response.data.task_id);
            //this.$notify({ type: 'success', message: 'Battery schedule population started' });
          }
        } catch (error) {
          console.error('Error starting task:', error);
          //this.$notify({ type: 'error', message: 'Failed to start battery schedule population' });
        }
      }

    },
  };
  </script>
  
  <style scoped>
   button.btn.btn-secondary.active{
    background-color: #272b34;
   }
   .btn-forecast {   
    background: #8d5cf5;
    color: #ffffff;
  } 

  .btn-forecast:hover{
    background: #a57efa;
  }
  </style>