import React, { useState, useEffect } from "react";
import { View, FlatList, Image, Text } from "react-native";
import { Appbar, Card } from "react-native-paper";
import firebase from "firebase/app";
import {doc, getFirestore, onSnapshot, collection} from "firebase/firestore";
import { SocialModel } from "../../../../models/social.js";
import { styles } from "./FeedScreen.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../MainStackScreen.js";
import { TouchableOpacity } from "react-native-gesture-handler";

/* HOW TYPESCRIPT WORKS WITH PROPS:

  Remember the navigation-related props from Project 2? They were called `route` and `navigation`,
  and they were passed into our screen components by React Navigation automatically.  We accessed parameters 
  passed to screens through `route.params` , and navigated to screens using `navigation.navigate(...)` and 
  `navigation.goBack()`. In this project, we explicitly define the types of these props at the top of 
  each screen component.

  Now, whenever we type `navigation.`, our code editor will know exactly what we can do with that object, 
  and it'll suggest `.goBack()` as an option. It'll also tell us when we're trying to do something 
  that isn't supported by React Navigation! */

interface Props {
  navigation: StackNavigationProp<MainStackParamList, "FeedScreen">;
}

export default function FeedScreen({ navigation }: Props) {
  // TODO: Initialize a list of SocialModel objects in state.
  const [socialModelList, setSocialModelList] = useState<SocialModel[]>([])

  /* TYPESCRIPT HINT: 
    When we call useState(), we can define the type of the state
    variable using something like this:
        const [myList, setMyList] = useState<MyModelType[]>([]); */

  /*
    TODO: In a useEffect hook, start a Firebase observer to listen to the "socials" node in Firestore.
    Read More: https://firebase.google.com/docs/firestore/query-data/listen
    
  
    Reminders:
      1. Make sure you start a listener that's attached to this node!
      2. The onSnapshot method returns a method. Make sure to return the method
          in your useEffect, so that it's called and the listener is detached when
          this component is killed. 
          Read More: https://firebase.google.com/docs/firestore/query-data/listen#detach_a_listener
      3. You'll probably want to use the .orderBy method to order by a particular key.
      4. It's probably wise to make sure you can create new socials before trying to 
          load socials on this screen.
  */

  const monthMap: { [key: string]: string } = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const convertToSortableFormat = (dateString: string) => {
    const [dayOfWeek, month, day, year, time, meridian] = dateString.split(" ");
    
    // Convert month to a numeric representation
    const monthNumeric = monthMap[month];
    
    // Convert 12-hour format to 24-hour format
    let [hours, minutes] = time.split(":");
    hours = hours.padStart(2, '0'); // Ensure single-digit hours are padded to two digits
    
    if (meridian === "PM" && hours !== "12") {
      hours = String(Number(hours) + 12);
    } else if (meridian === "AM" && hours === "12") {
      hours = "00";  // Midnight case
    }
  
    // Return a new string in the format YYYY-MM-DD HH:MM
    return `${year}-${monthNumeric}-${day.padStart(2, '0')} ${hours}:${minutes}`;
  };

  useEffect(() => {
    // Get a reference to the 'socials' collection
    const socialsCollectionRef = collection(getFirestore(), 'socials');
    
    // Set up the onSnapshot listener
    const unsubscribe = onSnapshot(socialsCollectionRef, snapshot => {
      let socialsArray: SocialModel[] = [];
      snapshot.forEach(doc => {
        let dateTimeInt = Number(doc.data().eventDate)
        let date = new Date(dateTimeInt)
        let dateTimeString = date.toDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        socialsArray.push({ id: doc.id, eventDate: dateTimeString, eventDescription: doc.data().eventDescription, eventImage: doc.data().eventImage, eventLocation: doc.data().eventLocation, eventName: doc.data().eventName });
      });
      socialsArray.sort((a, b) => {
        /*
        console.log(Number(a.eventDate))
        const a_int = new Date(a.eventDate).getTime()
        console.log(a_int)
        console.log(b.eventDate)
        const b_int = new Date(b.eventDate).getTime()
        console.log(b_int)
        return a_int - b_int
        */
        const aConverted = convertToSortableFormat(a.eventDate)
        const bConverted = convertToSortableFormat(b.eventDate)
        return aConverted.localeCompare(bConverted)
      })
      setSocialModelList(socialsArray);
    }, error => {
      console.error("Error fetching socials: ", error);
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []); // Empty array means this runs once, when the component mounts

  const renderItem = ({ item }: { item: SocialModel }) => {
    // TODO: Return a Card corresponding to the social object passed in
    // to this function. On tapping this card, navigate to DetailScreen
    // and pass this social.

    return (
      <TouchableOpacity style={styles.cardView} onPress={() => navigation.navigate("DetailScreen", {social: item})}>
        <Image source={{ uri: item.eventImage }} style={styles.feedImage}/>
        <View>
          <Text>{item.eventName}</Text>
          <Text>{item.eventLocation} - {item.eventDate}</Text>
        </View>
      </TouchableOpacity>
    )
  };

  const NavigationBar = () => {
    // TODO: Return an AppBar, with a title & a Plus Action Item that goes to the NewSocialScreen.
    return (
      <View style={styles.navBar}>
        <Text style={styles.titleText}>Socials</Text>
        <TouchableOpacity style={styles.addDiv} onPress={() => navigation.navigate("NewSocialScreen")}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>
    )
  };

  return (
    <>
      {/* Embed your NavigationBar here. */}
      <NavigationBar />
      <View style={styles.container}>
        
        {/* Return a FlatList here. You'll need to use your renderItem method. */}
        <FlatList 
          data={socialModelList}
          renderItem={(item) => renderItem(item)}
        />
      </View>
    </>
  );
}
