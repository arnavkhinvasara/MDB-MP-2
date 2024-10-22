import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { MainStackParamList } from "../MainStackScreen";
import { styles } from "./HomeScreen.styles";

interface Props {
  navigation: StackNavigationProp<MainStackParamList, "HomeScreen">;
  route: RouteProp<MainStackParamList, "HomeScreen">;
}

export default function HomeScreen({ navigation }: Props) {

  return (
    <View style={styles.containerView}>
        <View style={styles.headingView}>
          <Text style={styles.welcomeText}>Welcome to MDB Socials!</Text>
        </View>
        <View style={styles.bodyView}>
          <TouchableOpacity onPress={() => navigation.navigate("FeedScreen")}>
              <Text style={styles.nextStepsText}>View Events</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("NewSocialScreen")}>
              <Text style={styles.nextStepsText}>Create New Event</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}
