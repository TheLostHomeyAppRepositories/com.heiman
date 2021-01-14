'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, CLUSTER } = require('zigbee-clusters');

class HS2WDZIGBEE extends ZigBeeDevice {

	async onNodeInit({ zclNode }) {

		this.printNode();
		debug(true);

    // Register measure_battery capability and configure attribute reporting
    this.batteryThreshold = 20;
    if (this.hasCapability('alarm_battery')) {
    await this.registerCapability('alarm_battery', CLUSTER.POWER_CONFIGURATION, {
          reportOpts: {
            configureAttributeReporting: {
              minInterval: 6000, // No minimum reporting interval
              maxInterval: 60000, // Maximally every ~16 hours
              minChange: 5, // Report when value changed by 5
            },
          },
        });
      };

    // measure_battery
    if (this.hasCapability('measure_battery')) {
    await this.registerCapability('measure_battery', CLUSTER.POWER_CONFIGURATION, {
            reportOpts: {
              configureAttributeReporting: {
                minInterval: 6000,
                maxInterval: 60000,
                minChange: 5,
              },
            },
          });
        };




	onDeleted(){
		this.log("Smart Wireless Siren removed")
	}

}

module.exports = HS2WDZIGBEE;
