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
import Geocoder from "react-native-geocoding";
import { useRoute } from '@react-navigation/native';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Map = ( {navigation} ) => {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const container = getContainerStyles(insets);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [userLocation, setUserLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [changeLocation, setChangeLocation] = useState(false);
  Geocoder.init(MAPS_API_KEY)

  useEffect(() => {
    getUserLocation();
  }, []);

  // update the selected location if navigate from other screens with location data
  useEffect(() => {
    const locationDataFromParams = route.params?.locationData;
    if (
      locationDataFromParams &&
      (locationDataFromParams.latitude !== selectedLocation?.latitude ||
        locationDataFromParams.longitude !== selectedLocation?.longitude)
    ) {
      setSelectedLocation({
        latitude: locationDataFromParams.latitude,
        longitude: locationDataFromParams.longitude,
      });
    }
  }, [route.params]);

  useEffect(() => {
    if (selectedLocation) {
      (async () => {
        try {
          const data = await Geocoder.from(
            selectedLocation.latitude,
            selectedLocation.longitude
          );
          const selectedAddress = data.results[0]?.formatted_address;
          setAddress(selectedAddress);
          console.log(selectedAddress);
        } catch (error) {
          console.error("Geocoding error:", error);
        }
      })();
    }
  }, [selectedLocation]);

  // verify user's permission to locate the user
  const verifyPermission = async () => {
    if ( status && status.granted) {
      return true;
    }
    const response = await requestPermission();
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

  // send the selected location to visitNode
  function passToVisitNote() {
    const locationData = {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      address: address,
    };
    console.log(locationData);
    navigation.navigate("VisitedNote", { locationData });
  }

  // send the selected location to wishNote
  function passToWishNote() {
    const locationData = {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      address: address,
    };
    console.log(locationData);
    navigation.navigate("WishNote", { locationData });
  }

  return (
    <View style={[container, commonStyles.container]}>
      {/* use the search bar to search for the address of a location */}
      <GooglePlacesAutocomplete
				placeholder="Search"
				fetchDetails={true}
				GooglePlacesSearchQuery={{
					rankby: "distance"
				}}
				onPress={(data, details = null) => {
          if (details) {
					setSelectedLocation({
						latitude: details.geometry.location.lat,
						longitude: details.geometry.location.lng,
					})
          // use the state variable to trigger rerender when the location changed via search
          setChangeLocation((prev) => !prev);
        }
				}}
				query={{
					key: MAPS_API_KEY,
					location: `${selectedLocation?.latitude ?? ''}, ${selectedLocation?.longitude ?? ''}`
				}}
				styles={{
					container: { 
            top: 40,
            position: "absolute", 
            width: "90%",
            marginLeft: "5%",
            zIndex: 9999,
          },
					listView: { backgroundColor: colors.lightGreen }
				}}
			/>
      <MapView
        key={changeLocation}
        style={styles.map}
        region={{
          latitude: selectedLocation?.latitude || userLocation?.latitude || 49.2827,
          longitude: selectedLocation?.longitude || userLocation?.longitude || -123.1207,
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
        {/* show the user's current location and the location in the selected lists*/}
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
        {/* select a location by clicking on map */}
        <Marker coordinate={selectedLocation}>
          <Callout>
            <Text>{address}</Text>
          </Callout>
        </Marker>
      </MapView>
        <View style={styles.buttonContainer}>
          <PressableButton
            defaultStyle={[
              styles.submit,
              selectedLocation ? {} : styles.submitDisabled,
            ]}
            pressedStyle={styles.pressed}
            disabled={!selectedLocation}
            onPressFunction={passToVisitNote}
          >
            <Text style={styles.text}>Mark As Visited</Text>
          </PressableButton>
          <PressableButton
            defaultStyle={[
              styles.submit,
              selectedLocation ? {} : styles.submitDisabled,
            ]}
            pressedStyle={styles.pressed}
            disabled={!selectedLocation}
            onPressFunction={passToWishNote}
          >
            <Text style={styles.text}>Add To Wishlist</Text>
          </PressableButton>
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
    width: "40%",
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  submitDisabled: {
    backgroundColor: colors.lightGray,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    color: colors.white,
    fontWeight: "bold",
  },
});
