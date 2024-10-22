import { StyleSheet } from "react-native";
import { AppStyles } from "../../../AppStyles";
import { black } from "react-native-paper/lib/typescript/styles/colors";

export const styles = StyleSheet.create({
  ...AppStyles,
  containerView: {
    display: "flex",
    marginTop: 40,
    flexDirection: "column",
    height: 650,
  },
  headingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  bodyView: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center"
  },
  welcomeText: {
    fontSize: 40,
    textAlign: "center",
    fontWeight: "900",
    color: "red",
    margin: 10
  },
  nextStepsText: {
    fontSize: 30,
    textAlign: "center",
    margin: 20,
    padding: 10,
    backgroundColor: "cornflowerblue",
    borderRadius: 10
  }
  
});