<template>
  <div id="main-wrapper">
    <router-view />
  </div>
</template>

<script>

// import { mapActions } from 'vuex';

import PahoMQTT from 'paho-mqtt';
import { mapActions } from 'vuex';
export default {  
  name: 'App',
  data() {
    return {
      all: [],
      errors: [],
        connection: {
          protocol: "ws",
          host: "159.89.103.242",          
          port: 9001,
          endpoint: "/mqtt",          
          clean: true,
          connectTimeout: 30 * 1000, // ms
          reconnectPeriod: 4000, // ms
          clientId: "emqx_vue_" + Math.random().toString(16).substring(2, 8),
        },
        subscription: {
          topic: "battery_scada/+",
          qos: 0,
        },
        client: {
          connected: false,
        },
        subscribeSuccess: false,
        connecting: false,
        retryTimes: 0,
        
    }
  },
  components: {
    
  },
  created (){
    this.createAllDevs()
    this.createConnection()
  },
  

  mounted(){
           
  },
  methods:{
    ...mapActions(['allDevsCreation']),
    
    createAllDevs() {
        // Generate device IDs upfront with the correct format
        const deviceIds = Array.from({ length: 2 }, (_, i) =>
            `batt-${(i + 1).toString().padStart(4, '0')}`
        );

        // Map device IDs to device objects, incorporating coords data
        this.all = deviceIds.map(id => {          
            return {
            id: id,
            online: 'offline', // Default state
            soc: 0,
            flow_last_min: 0,
            invertor: 0                   
            };
           
        });
        this.allDevsCreation(this.all);
        

        // Directly generate ids and forecastIds from the all array
        // this.ids = this.all.map(device => device.id);
        // this.forecastIds = this.ids.map(id => `${id}F`);
        // //commit all to store
        // this.allDevsCreation(this.all);
    },
    doSubscribe() {
        const { topic, qos } = this.subscription;
        this.client.subscribe(topic, { qos: qos });
    },
    createConnection() {
        try {
            
          this.connecting = true;
          const { protocol, host, port, endpoint, clientId, connectTimeout, reconnectPeriod } = this.connection;
          const connectUrl = `${protocol}://${host}:${port}${endpoint}`;
          this.client = new PahoMQTT.Client(connectUrl, clientId);

          // Set additional client options if needed
          this.client.connectTimeout = connectTimeout;
          this.client.reconnectPeriod = reconnectPeriod;

          // Set up event listeners
        
          this.client.onConnectionLost = this.onConnectionLost.bind(this); // Bind to the component's context
          this.client.onMessageArrived = this.onMessageArrived.bind(this); // Bind to the component's context


          // Connect to the MQTT broker
          this.client.connect({
            onSuccess: () => {
              this.connecting = false;
              console.log('Connected to MQTT broker');
              this.doSubscribe(); // Subscribe after successful connection
            },
            onFailure: (error) => {
              this.connecting = false;
              console.error('MQTT connection failed:', error);
            },
          });
        } catch (error) {
          this.connecting = false;
          console.error('mqtt.connect error', error);
        }
      },
      onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
          console.error('MQTT Connection Lost:', responseObject.errorMessage);
          // Handle reconnection logic here if needed
        }
      },
      onMessageArrived(message) {        
        try {
          const topic = message.destinationName;
          const payload = message.payloadString;

          // Process the incoming message here
          const parsedPayload = JSON.parse(payload);
          
          let dev = topic.split("/")[1]
          let soc = parsedPayload.soc
          let flow_min = parsedPayload.flow_last_min
          let invertor = parsedPayload.invertor

   
          let found = this.all.find(element => element.id === dev)
          
          if(found){              
              found.soc = soc
              found.flow_last_min = flow_min
              found.online = 'online'
              found.invertor = invertor         
          } 
                   
          this.allDevsCreation(this.all);
        } catch (error) {
          console.error('Error processing MQTT message:', error);
        }
      },

    },

}
</script>

<style>

</style>
