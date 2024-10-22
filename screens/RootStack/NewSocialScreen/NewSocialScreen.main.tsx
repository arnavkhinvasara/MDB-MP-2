import React, { useState, useEffect } from "react";
import { Platform, View, ActivityIndicator } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { getFileObjectAsync, uuid } from "../../../Utils";

// See https://github.com/mmazzarolo/react-native-modal-datetime-picker
// Most of the date picker code is directly sourced from the example.
//import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

// See https://docs.expo.io/versions/latest/sdk/imagepicker/
// Most of the image picker code is directly sourced from the example.
import * as ImagePicker from "expo-image-picker";
import { styles } from "./NewSocialScreen.styles";

import { getFirestore, doc, collection, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getApp } from "firebase/app";
import { SocialModel } from "../../../models/social";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackScreen";

interface Props {
  navigation: StackNavigationProp<RootStackParamList, "NewSocialScreen">;
}

export default function NewSocialScreen({ navigation }: Props) {
  /* TODO: Declare state variables for all of the attributes 
           that you need to keep track of on this screen.
    
     HINTS:

      1. There are five core attributes that are related to the social object.
      2. There are two attributes from the Date Picker.
      3. There is one attribute from the Snackbar.
      4. There is one attribute for the loading indicator in the submit button.
  
  */
  const [eventName, setEventName] = useState("")
  const [eventLocation, setEventLocation] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [eventDate, setEventDate] = useState<Date>(new Date())
  const [dateText, setDateText] = useState("Choose a date")
  const [eventImage, setEventImage] = useState<string>("")
  const [imageText, setImageText] = useState("Pick an Image")

  //const [time, setTime] = useState()

  const [isLoading, setIsLoading] = useState(false)

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [theMode, setTheMode] = useState<'date' | 'time'>('date');

  const [visible, setVisible] = useState(false); //this is for the snackbar

  // TODO: Follow the Expo Docs to implement the ImagePicker component.
  // https://docs.expo.io/versions/latest/sdk/imagepicker/

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageText("Change Image")
      setEventImage(result.assets[0].uri);
    }
  };


  // TODO: Follow the GitHub Docs to implement the react-native-modal-datetime-picker component.
  // https://github.com/mmazzarolo/react-native-modal-datetime-picker

  /*
  const handleConfirm = (date: Date) => {
    setEventDate(date)
    setDateText(date.toDateString())
    setDatePickerVisibility(false);
  };
  */
  const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if (theMode=="time"){
      let dateToUse = selectedDate as Date
      setEventDate(dateToUse)

      let dateString = dateToUse.toDateString();
    
      // Get the time as a string (formatted as HH:MM)
      let timeString = dateToUse.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Combine date and time in a single string
      let dateTimeString = `${dateString}, ${timeString}`;
      setDateText(dateTimeString)
      setDatePickerVisibility(false)
      setTheMode("date")
    } else {
      setTheMode("time")
    }
  }

  const showMode = () => {
    setDatePickerVisibility(true)
  }


  // TODO: Follow the SnackBar Docs to implement the Snackbar component.
  // https://callstack.github.io/react-native-paper/snackbar.html

  const onToggleSnackBar = () => setVisible(true);

  const onDismissSnackBar = () => setVisible(false);

  const saveEvent = async () => {
    // TODO: Validate all fields (hint: field values should be stored in state variables).
    // If there's a field that is missing data, then return and show an error
    // using the Snackbar.

    if (!eventName || !eventLocation || !eventDescription || !eventDate || !eventImage){
      onToggleSnackBar()
    }

    // Otherwise, proceed onwards with uploading the image, and then the object.

    try {

      // NOTE: THE BULK OF THIS FUNCTION IS ALREADY IMPLEMENTED FOR YOU IN HINTS.TSX.
      // READ THIS TO GET A HIGH-LEVEL OVERVIEW OF WHAT YOU NEED TO DO, THEN GO READ THAT FILE!

      // (0) Firebase Cloud Storage wants a Blob, so we first convert the file path
      // saved in our eventImage state variable to a Blob.

      // (1) Write the image to Firebase Cloud Storage. Make sure to do this
      // using an "await" keyword, since we're in an async function. Name it using
      // the uuid provided below.

      // (2) Get the download URL of the file we just wrote. We're going to put that
      // download URL into Firestore (where our data itself is stored). Make sure to
      // do this using an async keyword.

      // (3) Construct & write the social model to the "socials" collection in Firestore.
      // The eventImage should be the downloadURL that we got from (3).
      // Make sure to do this using an async keyword.
      
      // (4) If nothing threw an error, then go to confirmation screen (which is a screen you must implement).
      //     Otherwise, show an error.
      setIsLoading(true)
      const asyncAwaitNetworkRequests = async () => {
        const object = await getFileObjectAsync(eventImage) as Blob;
        console.log("Object: ", object)
        const db = getFirestore();
        const storage = getStorage(getApp());
        const storageRef = ref(storage, uuid() + ".jpg");
        console.log("Storage Reffffff", storageRef)
        const result = await uploadBytes(storageRef, object);
        console.log("HIII")
        const downloadURL = await getDownloadURL(result.ref);
        const socialDoc: SocialModel = {
          eventName: eventName,
          eventDate: eventDate.getTime().toString(),
          eventLocation: eventLocation,
          eventDescription: eventDescription,
          eventImage: downloadURL,
        };
        const socialDocRef = doc(db, "socials", uuid());  // Generate a unique ID for the document
        await setDoc(socialDocRef, socialDoc);
        console.log("Finished social creation.");
      };
      await asyncAwaitNetworkRequests()
    } catch (e) {
      console.log("Error while writing social:", e);
    } finally {
      setIsLoading(false)
      navigation.navigate("ConfirmationScreen")
    }
  };

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Action onPress={navigation.goBack} icon="close" />
        <Appbar.Content title="Socials" />
      </Appbar.Header>
    );
  };

  return (
    <>
      <Bar />
      <View style={{ ...styles.container, padding: 20 }}>
        <TextInput 
          style={styles.textInputStyles}
          multiline={true}
          placeholder="Event Name"
          value={eventName}
          onChangeText={setEventName}
        />
        <TextInput 
          style={styles.textInputStyles}
          multiline={true}
          placeholder="Event Location"
          value={eventLocation}
          onChangeText={setEventLocation}
        />
        <TextInput 
          style={styles.textInputStyles}
          multiline={true}
          placeholder="Event Description"
          value={eventDescription}
          onChangeText={setEventDescription}
        />
        <Button onPress={() => showMode()}>
          {dateText}
        </Button>
        {
          isDatePickerVisible ? (
            <DateTimePicker
              value={eventDate}
              mode={theMode}
              onChange={(event: DateTimePickerEvent, selectedDate: Date | undefined) => onChange(event, selectedDate)}
            />
          ) : null
        }
        <Button onPress={() => pickImage()}>
          {imageText}
        </Button>
        <Button onPress={() => saveEvent()}>
          Save Event
        </Button>
        {isLoading && <ActivityIndicator size="large" color="#6495ED" />}
        
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          action={{
            label: 'Ok',
            onPress: () => {
              setVisible(false)
            },
          }}>
          Please make sure you have entered everything properly.
        </Snackbar>
      </View>
    </>
  );
}