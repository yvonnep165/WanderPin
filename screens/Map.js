import { StyleSheet, Text, View, Alert, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getContainerStyles } from "../components/SafeArea";
import { commonStyles } from "../styles/CommonStyles";
import PressableButton from "../components/PressableButton";
import MapView, { Callout, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { MAPS_API_KEY } from "@env";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { colors } from "../styles/Colors";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Map = ( {navigation} ) => {
  const insets = useSafeAreaInsets();
  const container = getContainerStyles(insets);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const updateLocationInterval = setInterval(() => {
      getUserLocation();
    }, 5000); // Update every 5 seconds, adjust as needed
  
    return () => clearInterval(updateLocationInterval);
  }, []);

  // send the selected location to other screens to perform other actions
  function confirmLocationHandler() {
    console.log(selectedLocation);
    // navigation.navigate("Profile", { selectedCoord: selectedLocation });
  }

  // verify user's permission to locate the user
  const verifyPermission = async () => {
    if ( status && status.granted) {
      return true;
    }
    const response = await requestPermission();
    console.log(response)
    return response && response.granted;
  };

  // get the user's current location to show on map
  async function getUserLocation() {
    try {
      const hasPermission = await verifyPermission();
      console.log("Has Permission:", hasPermission);
      if (!hasPermission) {
        Alert.alert("You need to give access to the location so that your markers around you can be shown");
        return
      }
      const locationObject = await Location.getCurrentPositionAsync();

      setUserLocation({
        latitude: locationObject.coords.latitude,
        longitude: locationObject.coords.longitude,
      });
    } catch (err) {
      console.log("locate user ", err);
    }
  }

  return (
    <View style={[container, commonStyles.container]}>
      {/* <GooglePlacesAutocomplete
				placeholder="Search"
				// fetchDetails={true}
				// GooglePlacesSearchQuery={{
				// 	rankby: "distance"
				// }}
				onPress={(data, details = null) => {
					console.log(data, details)
          if (details) {
					setSelectedLocation({
						latitude: details.geometry.location.lat,
						longitude: details.geometry.location.lng,
					})}
				}}
				query={{
					key: MAPS_API_KEY,
					language: 'en',
					location: `${selectedLocation?.latitude ?? ''}, ${selectedLocation?.longitude ?? ''}`
				}}
				styles={{
					container: { flex: 0, position: "absolute", width: "100%", zIndex: 1 },
					listView: { backgroundColor: "white" }
				}}
			/> */}
      {/* show the user's current location and the location in the selected lists*/}
      {/* select a location by clicking on map */}
      <MapView
        style={styles.map}
        region={{
          latitude: userLocation? userLocation.latitude : 49.2827,
          longitude: userLocation? userLocation.longitude : -123.1207,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={(e) => {
          setSelectedLocation({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
          });
        }}
        provider="google"
      >
        { (userLocation && !selectedLocation) && 
          (<Marker 
            coordinate={userLocation}
            draggable={true}
          >
            <Callout>
              <Text>Current Location</Text>
            </Callout>
          </Marker>)
        }
        <Marker coordinate={selectedLocation} >
          <Callout>
            <Text>selected</Text>
          </Callout>
        </Marker>
      </MapView>
        <View style={styles.buttonContainer}>
          <PressableButton
            defaultStyle={styles.submit}
            pressedStyle={styles.pressed}
            disabled={!selectedLocation}
            onPressFunction={confirmLocationHandler}
          />
        </View>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  map: {
    width: windowWidth,
    height: windowHeight,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20, 
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  submit: {
    backgroundColor: colors.deepYellow,
    width: "45%",
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});
