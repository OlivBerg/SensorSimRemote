require("dotenv").config();
const IoTHubDeviceClient = require("azure-iot-device").Client;
const Message = require("azure-iot-device").Message;
const Mqtt = require("azure-iot-device-mqtt").Mqtt;

const CONNECTION_STRING_DOW_LAKE = process.env.CONNECTION_STRING_DOW_LAKE;
const CONNECTION_STRING_NAC = process.env.CONNECTION_STRING_NAC;
const CONNECTION_STRING_FIFTH = process.env.CONNECTION_STRING_FIFTH;

function getTelemetry(location) {
  return {
    location: location,
    iceThickness: Math.random() * 30 + 15, // 15 to 45 cm
    iceTemp: Math.random() * 7 - 10, // -10 to -3°C
    surfaceTemp: Math.random() * 10 - 5, // -5 to 5°C
    snowAccumulation: Math.random() * 50, // 0 to 50 cm
    externalTemp: Math.random() * 20 - 15, // -15 to 5°C
    timestamp: new Date().toISOString(),
  };
}

async function main() {
  const dowClient = IoTHubDeviceClient.fromConnectionString(
    CONNECTION_STRING_DOW_LAKE,
    Mqtt
  );
  const fifthClient = IoTHubDeviceClient.fromConnectionString(
    CONNECTION_STRING_FIFTH,
    Mqtt
  );
  const nacClient = IoTHubDeviceClient.fromConnectionString(
    CONNECTION_STRING_NAC,
    Mqtt
  );

  console.log("Connecting to IoT Hub...");
  await dowClient.open();
  await fifthClient.open();
  await nacClient.open();
  console.log("Connection to IoT Hub established.");

  console.log("Sending telemetry to IoT Hub...");
  try {
    while (true) {
      await nacClient.sendEvent(
        new Message(JSON.stringify(getTelemetry("NAC")))
      );
      console.log("NAC: sent telemetry");

      await dowClient.sendEvent(
        new Message(JSON.stringify(getTelemetry("Dow Lake")))
      );
      console.log("Dow Lake: sent telemetry");

      await fifthClient.sendEvent(
        new Message(JSON.stringify(getTelemetry("Fifth Avenue")))
      );
      console.log("Fifth Avenue: sent telemetry");

      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  } catch (err) {
    console.error(`Error sending messages: ${err.message}`);
  } finally {
    console.log("Stopped sending messages. Disconnecting...");
    await dowClient.close();
    await fifthClient.close();
    await nacClient.close();
    console.log("Disconnected from IoT Hub.");
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
