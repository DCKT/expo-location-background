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
  const [bgPerm, setBgPerm] = useState(null);
  const [fgPerm, setFgPerm] = useState(null);
  const [coords, setCoords] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let fg = await Location.requestForegroundPermissionsAsync();
      if (fg.status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      setFgPerm(fg);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>fg permission</Text>
      <Text>{fgPerm ? JSON.stringify(fgPerm, null, 2) : null}</Text>
      <View style={{ height: 15 }} />
      <Text>bg permission</Text>
      <Text>{bgPerm ? JSON.stringify(bgPerm, null, 2) : null}</Text>
      <View style={{ height: 15 }} />
      {errorMsg ? <Text>{errorMsg}</Text> : null}

      {locationStarted ? <Text>Location started</Text> : React.null}

      <Button
        title="Request bg perm"
        onPress={(_) => {
          Location.requestBackgroundPermissionsAsync()
            .then((bg) => {
              setBgPerm(bg);
              if (bg.status !== "granted") {
                setErrorMsg("Permission to access location was denied");
              }
            })
            .catch((err) => {
              setErrorMsg("requestBackgroundPermissionsAsync error check logs");
              console.log(err);
            });
        }}
      />

      <View style={{ height: 15 }} />
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
