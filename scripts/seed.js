const deepstream = require('deepstream.io-client-js');
const _ = require("underscore");
const constants = deepstream.CONSTANTS

const client = deepstream(process.env.HOST).login();
client.on( 'connectionStateChanged', ( connectionState ) => {
  if (connectionState === constants.CONNECTION_STATE.OPEN) {
    let count;
    let completed = 0;
    let block = false;
    for ( count = 0; count < 20; count++ ) {
      const recordName = "coins/" + String(count + 1);
      let record = client.record.getRecord(recordName);
      console.log("CREATING" + ` coin { count }`);
      const div = Math.pow(10, 6);
      record.whenReady(() => {
        record.set({
          location: {
            type: "Point",
            coordinates: [ _.random(32058640, 32071833) / div, _.random(34766230, 34786015) / div ]
          },
          value: _.random(1, 5) * 10
        },err => {
          if (err) {
            console.log('Record set with error:', err)
          } else {
            console.log('Record set without error')
          }
          completed += 1;
          if (completed === 20) {
            client.close();
          }
        });
      });
    }
    console.log("COMPLETE")
  }
});
