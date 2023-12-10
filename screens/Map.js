import { StyleSheet, Text, View, Alert, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getContainerStyles } from "../components/SafeArea";
import { commonStyles } from "../styles/CommonStyles";
import PressableButton from "../components/PressableButton";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { MAPS_API_KEY } from "@env";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { colors } from "../styles/Colors";
import Geocoder from "react-native-geocoding";
import { useRoute } from '@react-navigation/native';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { database } from "../firebase/firebaseSetup";
import ShowMapList from "../components/ShowMapLists";
import CustomMarker from "../components/CustomMarker";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Map = ( {navigation} ) => {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const container = getContainerStyles(insets);
  const [selectedLocation, setSelectedLocation] = useState(route.params?.currentWishNote?.wishlistLocation || null);
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [userLocation, setUserLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [changeLocation, setChangeLocation] = useState(false);
  const [lists, setLists] = useState([]);
  const [displayList, setDisplayList] = useState([])
  const [iconLables, setIconLables] = useState([])
  const [displayListMarker, setDisplayListMarker] = useState([])
  Geocoder.init(MAPS_API_KEY)

  useEffect(() => {
    getUserLocation();
  }, []);

  // update the selected location if navigate from other screens with location data
  useEffect(() => {
    const locationDataFromParams = route.params?.currentWishNote?.wishlistLocation;
    if (
      locationDataFromParams &&
      (locationDataFromParams.latitude !== selectedLocation?.latitude ||
        locationDataFromParams.longitude !== selectedLocation?.longitude)
    ) {
      setSelectedLocation(prevLocation => ({
        latitude: locationDataFromParams.latitude,
        longitude: locationDataFromParams.longitude,
      }));
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
        } catch (error) {
          console.error("Geocoding error:", error);
        }
      })();
    }
  }, [selectedLocation]);

  // read all the lists from database for selected list display
  useEffect(()=>{
    let q = collection(database, "lists");
      onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          let newArray = []
          querySnapshot.forEach((docSnap) => {
            newArray.push({...docSnap.data(), id: docSnap.id});
          });
          setLists(newArray);
        } else {
          setLists([]);
        }
    })
  }, []);

  // read all the wishLists of the selected lists from database based on the list id
  useEffect(()=>{
    if (displayList && displayList.length > 0) {
    let q = query(collection(database, "notes"), where("list.id", "in", displayList));
      onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          let newArray = []
          querySnapshot.forEach((docSnap) => {
            newArray.push({...docSnap.data(), id: docSnap.id});
          });
          setDisplayListMarker(newArray);
          console.log("Note To Display:", newArray);
        } else {
          setDisplayListMarker([]);
        }
    })} else {
      setDisplayListMarker([]);
    }
  }, [displayList]);

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
    const previousWishNote = route.params?.currentWishNote;
    if (previousWishNote) {
      const newWishNote = {
        noteId: previousWishNote.noteId, 
        title: previousWishNote.title,  
        wishlistLocation: locationData, 
        note: previousWishNote.note,
        list: previousWishNote.list,
        reminder: previousWishNote.reminder,
      }
      navigation.navigate("WishNote", { newWishNote });
    } else {
      navigation.navigate("WishNote", { locationData });
    }
  }

  function getSelectedList(listIdValue){
    setDisplayList(listIdValue)
  }

  // get the icon and id value pair to search for the icon based on the id
  function getListsMarkerIcon(iconValuePair){
    setIconLables(iconValuePair)
  }

  // check weather the clicked location is the one that's already showing on the map for the selected list
  function checkSameLocation(lat, long) {
    let isSameLocation = true;
    if (displayListMarker) {
        displayListMarker.some((note) => {
        if (note.location.latitude === lat && 
          note.location.longitude === long){
            isSameLocation = false;
          }
      });
    }
    return isSameLocation;
  }

  return (
    <View style={[container, commonStyles.container]}>
      {/* show the dropdown picker and let user to choose the list they want to display */}
      <View style={styles.listSelector}>
        <ShowMapList lists={lists} onValueChange={getSelectedList} onIconValuePairChange={getListsMarkerIcon} />
      </View>
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
            top: 80,
            position: "absolute", 
            width: "90%",
            marginLeft: "5%",
            zIndex: 9998,
            marginTop: 25,
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
          const selectedLatitude = e.nativeEvent.coordinate.latitude;
          const selectLongitude = e.nativeEvent.coordinate.longitude;
          // check weather the clicked location is the one that's already showing on the map for the selected list
          let isSelect = checkSameLocation(selectedLatitude, selectLongitude);
          console.log(selectLongitude, selectedLatitude)
          console.log(isSelect)
          if (route.params?.currentWishNote || isSelect) {
            setSelectedLocation(prevLocation=> ({
              latitude: selectedLatitude,
              longitude: selectLongitude,
            }));
          }
        }}
        provider="google"
      >
        {/* show the user's current location and the location in the selected lists*/}
        { (userLocation && !selectedLocation) && 
          (<CustomMarker 
            coordinate={userLocation}
            draggable={true}
            message={"Current Location"}
          />)
        }
        {/* select a location by clicking on map */}
        <CustomMarker coordinate={selectedLocation} 
          draggable={true}
          message={address}/>
        {/* show the markers of the wishNote within the selected list */}
        {displayListMarker && displayListMarker.map((note) => 
          { const noteLocation = { 
            latitude: note.location.latitude, 
            longitude: note.location.longitude 
            }
            const locationIcon = iconLables.find(item => item.iconId === note.list.id);
            return (<CustomMarker key={note.id} 
                    coordinate={noteLocation} 
                    message={note.location.address}
                    icon={locationIcon}/>)})}
      </MapView>
        <View style={styles.buttonContainer}>
        {/* disabled the button if it's an update location process for Withnote or there's no selected location */}
          <PressableButton
            defaultStyle={[
              styles.submit,
              (route.params?.currentWishNote || !selectedLocation) ? styles.submitDisabled : {},
            ]}
            pressedStyle={styles.pressed}
            disabled={route.params?.currentWishNote || !selectedLocation}
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
  listSelector: {
    zIndex: 9999,
  }
});
