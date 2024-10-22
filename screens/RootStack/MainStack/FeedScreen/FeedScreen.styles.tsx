import { StyleSheet, Dimensions } from "react-native";
import { AppStyles } from "../../../../AppStyles";

export const styles = StyleSheet.create({
  ...AppStyles,
  feedImage: {
    width: 200,
    height: 200
  },
  navBar: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "white"
  },
  titleText: {
    display: "flex",
    flex: 4,
    fontSize: 40,
    color: "red",
    textAlign: "center",
    backgroundColor: "white"
  },
  addDiv: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginRight: 10
  },
  addText: {
    fontSize: 15,
    color: "gray",
    textAlign: "center"
  },
  cardView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 15
  }
});
