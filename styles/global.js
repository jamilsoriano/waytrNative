import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  motto: {
    marginBottom: 50,
    fontFamily: "raleway-bold",
    textAlign: "center",
    fontSize: 40,
    color: "#333"
  },
  titleText: {
    fontFamily: "raleway-regular",
    fontSize: 18,
    color: "#333",
    textAlign: "center"
  },
  paragraph: {
    marginVertical: 8,
    lineHeight: 20
  },
  logInInput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#DFDFDF",
    margin: 7,
    padding: 15,
    backgroundColor: "#F8F8F8"
  },
  logInButton: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#97D895",
    marginHorizontal: 7,
    marginTop: 25,
    padding: 15,
    backgroundColor: "#5CDC58"
  },
  restaurantButton: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#97D895",
    paddingHorizontal: 25,
    paddingVertical: 12,
    backgroundColor: "#5CDC58"
  },
  forgotCredentialsLink: {
    marginTop: 10,
    marginRight: 7,
    color: "#67BEE7",
    fontFamily: "raleway-light",
    fontSize: 15,
    textAlign: "right"
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center"
  },
  center: {
    color: "black",
    fontFamily: "raleway-light",
    textAlign: "center",
    fontSize: 15
  },
  errMessage: {
    color: "red",
    fontFamily: "raleway-light",
    textAlign: "center",
    fontSize: 15
  },
  hyperLink: {
    color: "#67BEE7",
    fontFamily: "raleway-light"
  },
  signUpText: {
    marginTop: 20,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  tabNav: {
    backgroundColor: "#fff"
  }
});
