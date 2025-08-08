// testDevices.js
const { getConnectedDevices } = require('./helper');

const devices = getConnectedDevices();
console.log('✅ Connected Devices:', devices);
