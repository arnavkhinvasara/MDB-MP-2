import React from "react";
import { Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import FeedScreen from "./FeedScreen/FeedScreen.main";
import DetailScreen from "./DetailScreen/DetailScreen.main";
import NewSocialScreen from "../NewSocialScreen/NewSocialScreen.main";
import HomeScreen from "./HomeScreen/HomeScreen.main";
import { SocialModel } from "../../../models/social";
import ConfirmationScreen from "../ConfirmationScreen/ConfirmationScreen.main";

export type MainStackParamList = {
  HomeScreen: undefined;
  FeedScreen: undefined;
  DetailScreen: { social: SocialModel };
  NewSocialScreen: undefined;
  ConfirmationScreen: undefined;
};

const MainStack = createStackNavigator<MainStackParamList>();

export function MainStackScreen() {
  return (
    // TODO (DONE): Ensure that the initial route that the navigator goes to is the HomeScreen (which is a screen you have to implement!)
    // See docs on stack navigator, what can we add as a prop into MainStack.Navigator to make sure that the HomeScreen is the initial route?
    // https://reactnavigation.org/docs/2.x/stack-navigator/

    <MainStack.Navigator initialRouteName="HomeScreen">

      {/* Add your HomeScreen to the MainStack here!  (DONE)*/}
      <MainStack.Screen
        name="HomeScreen"
        options={{ headerShown: false }}
        component={HomeScreen}
      />

      <MainStack.Screen
        name="FeedScreen"
        component={FeedScreen}
        options={({ navigation }) => ({
          title: "Socials",
          headerLeft: () => (
            <Button
              title="Home"
              // TODO (DONE but might need to be fixed): onPress When we click the home button on top left, navigate to HomeScreen
              onPress={() => navigation.navigate("HomeScreen")}
            />
          ),
          headerTitle: "All Socials",
        })
        }
      />
      <MainStack.Screen
        name="DetailScreen"
        options={{ headerShown: false }}
        component={DetailScreen}
      />
      <MainStack.Screen
        name="NewSocialScreen"
        options={{ headerShown: false }}
        component={NewSocialScreen}
      />
      <MainStack.Screen
          name="ConfirmationScreen"
          options={{ headerShown: false }}
          component={ConfirmationScreen}
      />
    </MainStack.Navigator>
  );
}
