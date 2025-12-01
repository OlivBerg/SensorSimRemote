# Overview

The simulator mimics physical sensors, sending artificial telemetry data for "NAC", "Dow Lake", and "Fifth Avenue" locations to Azure IoT Hub via MQTT. This is useful for testing data pipelines for the Rideau Canal Monitoring Dashboard.

## Prerequisites

- Node.js and npm/yarn installed.

- Azure IoT Hub instance.

- IoT Hub Device Connection Strings for each of the three devices ("Dow Lake", "NAC", "Fifth Avenue") registered in your IoT Hub.

## Installation

1. Clone the repository

2. Install dependencies: `npm install`

## Configuration

Create a .env file and add device connection strings

```
# .env file
CONNECTION_STRING_DOW_LAKE=
CONNECTION_STRING_NAC=
CONNECTION_STRING_FIFTH=
```

## Usage

Run the simulator from your terminal:

```
npm test
or
node simSensor.js
```

## Code Structure

- dotenv: Loads environment variables from .env.

- azure-iot-device / azure-iot-device-mqtt: Azure IoT Device SDK for Node.js (MQTT transport).

- getTelemetry(location): Generates a JSON object with random sensor readings for a given location.

- main():

  - Initializes and opens connections for each device.

  - Enters a loop to send telemetry data every 10 seconds.

  - Logs status and handles disconnection.

## Sensor Data Format

Telemetry is sent as a JSON object.

```
{
  "location": "NAC",
  "iceThickness": 23.45,
  "iceTemp": -2.1,
  "surfaceTemp": 0.5,
  "snowAccumulation": 5.7,
  "externalTemp": -10.2,
  "timestamp": "2025-12-01T13:00:15.123Z"
}
```

## Troubleshooting
