import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { ScrollView, Image, Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import { MainStackParamList } from "../MainStackScreen";
import { styles } from "./DetailScreen.styles";

interface Props {
  navigation: StackNavigationProp<MainStackParamList, "DetailScreen">;
  route: RouteProp<MainStackParamList, "DetailScreen">;
}

export default function DetailScreen({ route, navigation }: Props) {
  const { social } = route.params;

  useEffect(() => {
    console.log(typeof(social.eventDate))
  }, [])

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate("FeedScreen")} />
        <Appbar.Content title="Socials" />
      </Appbar.Header>
    );
  };

  return (
    <>
      <Bar />
      <ScrollView style={styles.container}>
        <View style={styles.view}>
          <Image style={styles.image} source={{ uri: social.eventImage }} />
          <Text style={{ ...styles.h1, marginVertical: 10 }}>
            {social.eventName}
          </Text>
          <Text style={{ ...styles.subtitle, marginBottom: 5 }}>
            {social.eventLocation}
          </Text>
          <Text style={{ ...styles.subtitle, marginTop: 5, marginBottom: 20 }}>
            {social.eventDate}
          </Text>
          <Text style={styles.body}>{social.eventDescription}</Text>
        </View>
      </ScrollView>
    </>
  );
}
