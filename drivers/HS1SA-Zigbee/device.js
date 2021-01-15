'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, CLUSTER } = require('zigbee-clusters');

class HS1SAZIGBEE extends ZigBeeDevice {

	async onNodeInit({ zclNode }) {

		this.printNode();
		debug(true);

		if (this.isFirstInit()){

			//Trigger IASZONE Inclusion
			await zclNode.endpoints[1].clusters.iasZone.writeAttributes({iasCIEAddress: '00:00:00:00:00:00:00:00'});
			//Send IASZONE CIA address
			await zclNode.endpoints[1].clusters.iasZone.writeAttributes({iasCIEAddress: '00:12:4b:00:18:dd:63:58'});
			await zclNode.endpoints[1].clusters.iasZone.readAttributes('zoneId');

/*			//Read IASZONE attributes - zoneId to confirm enrollment
 			this.log("STORED zondeID: ", await zclNode.endpoints[1].clusters.iasZone.readAttributes('zoneId'));
			this.log("STORED IASZONE CIE ADDRESS: ", await zclNode.endpoints[1].clusters.iasZone.readAttributes('iasCIEAddress'));
			this.log("STORED zoneState: ", await zclNode.endpoints[1].clusters.iasZone.readAttributes('zoneState'));
*/
		};


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

		//alarm_smoke
		// add alarm_smoke capabilities if needed
		if (!this.hasCapability('alarm_smoke')) {
			this.addCapability('alarm_smoke');
		}
		zclNode.endpoints[1].clusters[CLUSTER.IAS_ZONE.NAME].onZoneStatusChangeNotification = payload => {
				this.onIASZoneStatusChangeNoficiation(payload);
			};


	}

	onIASZoneStatusChangeNoficiation({
		zoneStatus, extendedStatus, zoneId, delay,
	}) {
		this.log('IASZoneStatusChangeNotification received:', zoneStatus, extendedStatus, zoneId, delay);
		this.setCapabilityValue('alarm_smoke', zoneStatus.alarm1);
		this.setCapabilityValue('alarm_battery', zoneStatus.battery);
	}


	onDeleted(){
		this.log("Smart Smoke Sensor removed")
	}

}

module.exports = HS1SAZIGBEE;

/*'use strict';

const Homey = require('homey');
const { ZigBeeDevice } = require('homey-zigbeedriver');
const { CLUSTER } = require('zigbee-clusters');
const IASZoneBoundCluster = require('../../lib/IASZoneBoundCluster');

class HS1SAZIGBEE extends ZigBeeDevice {



  	// this method is called when the Device is inited
  async	onNodeInit({ zclNode }) {

      this.enableDebug();
      this.printNode();
      this.setAvailable();

      // Register measure_battery capability and configure attribute reporting
      this.batteryThreshold = 20;
      if (this.hasCapability('alarm_battery')) {
      await this.registerCapability('alarm_battery', CLUSTER.POWER_CONFIGURATION, {
            reportOpts: {
              configureAttributeReporting: {
                minInterval: 0, // No minimum reporting interval
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
                  minChange: 1,
                },
              },
            });
          };


      //alarm_smoke
      // add alarm_smoke capabilities if needed
      if (!this.hasCapability('alarm_smoke')) {
        this.addCapability('alarm_smoke');
      }
      zclNode.endpoints[1].clusters[CLUSTER.IAS_ZONE.NAME].onZoneStatusChangeNotification = payload => {
          this.onIASZoneStatusChangeNoficiation(payload);
        };



  }
  onIASZoneStatusChangeNoficiation({
    zoneStatus, extendedStatus, zoneId, delay,
  }) {
    this.log('IASZoneStatusChangeNotification received:', zoneStatus, extendedStatus, zoneId, delay);
    this.setCapabilityValue('alarm_smoke', zoneStatus.alarm1);
    this.setCapabilityValue('alarm_battery', zoneStatus.battery);
  }
}
module.exports = HS1SAZIGBEE;
*/
