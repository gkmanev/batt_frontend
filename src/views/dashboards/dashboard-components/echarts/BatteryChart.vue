<template>
    <div>
      <b-row>
        <b-col cols="6" md="6">
          <!-- <b-card class="mb-4 battery-card"> -->
            <div class="modern-battery-indicator-vertical mt-4">
                <div class="pulse-vertical" :style="{ backgroundColor: pulseColor }"></div>
              <div class="modern-battery-terminal-vertical"></div> <!-- Terminal on top -->
              <div class="glossy-overlay-vertical"></div>
              <div class="modern-battery-level-vertical" :style="{ height: batteryLevel + '%' }">                
              </div>
              <div class="battery-percentage-text-vertical">{{ batteryLevel }}%</div>
            </div>
          <!-- </b-card> -->
        </b-col>
      </b-row>
    </div>
  </template>
  
  <script>
  import axios from "axios";
import { mapState } from "vuex";

  export default {
    name: "BatteryChart",
    data() {
      return {
        batteryLevel: 85, // Example charge level
        charging: true,
      };
    },
    mounted (){
        this.fetchData()
    },
    computed: {
      ...mapState(["dateRange", "selectedDev"]),

      pulseColor() {
     
      if (this.charging == true) {
        return '#00ff85';     
      }
      else {
        return '#ff0000'; 
      }
    },
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
        let url = `http://85.14.6.37:16543/api/state_of_charge/?date_range=${this.dateRange}`;
        //let updateCurrentPath = this.lastRouteSegment()
        if (this.dateRange === "today") {
            if(this.lastRouteSegment() === 'entra'){
            const response = await axios.get(url)
            const batt1Data = response.data.filter(obj => obj.devId === 'batt-0001');
            const batt2Data = response.data.filter(obj => obj.devId === 'batt-0002');
            

            const lastValueBatt1 = batt1Data[batt1Data.length - 1].state_of_charge; // Last entry for batt-0001
            const lastValueBatt2 = batt2Data[batt2Data.length - 1].state_of_charge; // Last entry for batt-0002
            let momentSoCSum = lastValueBatt1 + lastValueBatt2;
            let batterySoC = (momentSoCSum/200)*100
            batterySoC = batterySoC.toFixed(1)
            this.batteryLevel = batterySoC
            const invertorBatt1 = batt1Data[batt1Data.length - 1].invertor_power;
            const invertorBatt2 = batt2Data[batt2Data.length - 1].invertor_power;
            
            if ((invertorBatt1 - invertorBatt2 || invertorBatt2 - invertorBatt1) > 0)
            {
                this.charging = true
            } 
            else{
                this.charging = false
            }            
        }
        if (this.lastRouteSegment() === 'client'){
            let url = `http://85.14.6.37:16543/api/state_of_charge/?date_range=${this.dateRange}&devId=${this.selectedDev}`;
            const response = await axios.get(url)
            const lastValue = response.data[response.data.length - 1].state_of_charge;
            let batterySoC = lastValue.toFixed(1)
            this.batteryLevel = batterySoC
            const invertorBatt = response.data[response.data.length - 1].invertor_power;
            if(invertorBatt >= 0){
                this.charging = true
            }
            else{
                this.charging = false
            }
            

        }
    }
    },
  }
}
  </script>
  
  <style scoped>
  .modern-battery-indicator-vertical {
    width: 60px;
    height: 150px;
    background: linear-gradient(135deg, #1e1e1e, #3e3e3e);
    border: 2px solid #111;
    border-radius: 7.5px;
    position: relative;
    display: inline-block;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.6), inset 0 1px 4px rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }
  
  .modern-battery-level-vertical {
    width: 100%;
    background: linear-gradient(to bottom, #7460ee, #9522ff);
    border-radius: 7.5px 7.5px 0 0;
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.4);
    position: absolute;
    bottom: 0;
    transition: height 0.4s ease;
  }
  
  .battery-percentage-text-vertical {
    position: absolute;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
    font-weight: bold;
    color: white;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.6);
    z-index: 2;
  }
  
  .glossy-overlay-vertical {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 7.5px;
    z-index: 1;
    pointer-events: none;
  }
  
  .pulse-vertical {
    position: absolute;
    top: 2px;
    left: 50%;
    width: 7.5px;
    height: 7.5px;
    background: #00ff85;
    border-radius: 50%;
    box-shadow: 0 0 10px 5px rgba(0, 255, 133, 0.6);
    transform: translateX(-50%);
    animation: pulse 1.5s infinite ease-in-out;
    z-index: 1;
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 5px 2.5px rgba(0, 255, 133, 0.6);
    }
    50% {
      box-shadow: 0 0 10px 5px rgba(0, 255, 133, 0.9);
    }
    100% {
      box-shadow: 0 0 5px 2.5px rgba(0, 255, 133, 0.6);
    }
  }
  
  .modern-battery-terminal-vertical {
    position: absolute;
    top: -9px;
    left: 9.5px;
    width: 36px;
    height: 15px;
    background: #5b5b5b;
    border-radius: 7.5px;
    border: 2px solid #e5e5e5;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.7);
    
  }


  </style>
  
