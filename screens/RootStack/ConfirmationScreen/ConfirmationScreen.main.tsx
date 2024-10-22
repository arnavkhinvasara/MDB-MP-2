import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { MainStackParamList } from "../MainStack/MainStackScreen";
import { styles } from "./ConfirmationScreen.styles";

interface Props {
  navigation: StackNavigationProp<MainStackParamList, "ConfirmationScreen">;
  route: RouteProp<MainStackParamList, "ConfirmationScreen">;
}

export default function ConfirmationScreen({ navigation }: Props) {

  return (
    <View style={styles.containerView}>
        <View style={styles.headingView}>
          <Text style={styles.welcomeText}>Event successfully created!</Text>
        </View>
        <View style={styles.bodyView}>
          <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
              <Text style={styles.nextStepsText}>Go to Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("FeedScreen")}>
              <Text style={styles.nextStepsText}>View Events</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}
