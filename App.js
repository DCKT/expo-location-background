import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Button } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

TaskManager.defineTask("test", ({ data, error }) => {
  if (error) {
    console.log(error);
    return;
  }
  console.log(`new locations ${data.locations.length} !`);
});

export default function App() {
  const [locationStarted, setLocationStarted] = useState(false);
  const [coords, setCoords] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let bg = await Location.requestBackgroundPermissionsAsync();
      if (bg.status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {errorMsg ? <Text>{errorMsg}</Text> : null}
      {locationStarted ? <Text>Location started</Text> : React.null}

      <Button
        title="Start location"
        onPress={() => {
          Location.startLocationUpdatesAsync("test", {
            accuracy: Location.Accuracy.High,
            timeInterval: 60 * 1000, // every 1 minute
            deferredUpdatesInterval: 0,
            showsBackgroundLocationIndicator: true,
            foregroundService: {
              notificationTitle: "Demo",
              notificationBody: "",
            },
          })
            .then(() => setLocationStarted(true))
            .catch((e) => {
              console.log(e);
              setErrorMsg("startLocationUpdatesAsync error");
            });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
