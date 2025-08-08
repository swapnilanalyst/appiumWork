const { execSync } = require('child_process');

/**
 * Dynamically gets connected Android devices.
 */
function getConnectedDevices(startingPort = 4723, silent = false) { // ✅ Added silent flag
  try {
    const output = execSync('adb devices -l').toString();
    const lines = output.split('\n');
    const devices = [];

    let index = 0;
    for (let line of lines) {
      if (line.includes('device') && !line.includes('List')) {
        const parts = line.trim().split(/\s+/);
        const deviceId = parts[0];
        if (deviceId) {
          try {
            const version = execSync(`adb -s ${deviceId} shell getprop ro.build.version.release`)
              .toString().trim();
            const port = startingPort + index * 10;
            devices.push({ deviceId, version, port });
            index++;
          } catch (e) {
            console.error(`❌ Failed to fetch Android version for device ${deviceId}: ${e.message}`);
          }
        }
      }
    }

    if (devices.length === 0 && !silent) {
      console.warn("⚠️ No connected Android devices found.");
    }

    if (!silent) {
      console.log("✅ Connected Devices:");
      devices.forEach((d, i) =>
        console.log(`  📱 Device ${i + 1}: ${d.deviceId} | Android ${d.version} | Port: ${d.port}`)
      );
    }

    return devices;
  } catch (e) {
    console.error(`❌ Error while listing connected devices: ${e.message}`);
    return [];
  }
}

module.exports = { getConnectedDevices };

// ✅ Run standalone
if (require.main === module) {
  getConnectedDevices();
}



// helper.js
// const { execSync } = require('child_process');

// function getConnectedDevices() {
//   try {
//     const output = execSync('adb devices -l').toString();
//     const lines = output.split('\n');
//     const devices = [];

//     for (const line of lines) {
//       if (line.includes('device') && !line.includes('List')) {
//         const parts = line.trim().split(/\s+/);
//         const deviceId = parts[0];
//         if (deviceId) {
//           const platformVersion = execSync(`adb -s ${deviceId} shell getprop ro.build.version.release`)
//             .toString()
//             .trim();
//           devices.push({ deviceId, platformVersion });
//         }
//       }
//     }

//     if (devices.length === 0) {
//       console.warn('⚠️ No connected Android devices found.');
//     }

//     return devices;
//   } catch (error) {
//     console.error('❌ Error fetching connected devices:', error);
//     return [];
//   }
// }

// module.exports = { getConnectedDevices };