import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { globalStyles } from "../styles/global";
import Firebase from "../firebase/firebase";

export default function SignIn({ navigation }) {
  const [LogInData, setLogInData] = useState({ email: "", password: "" });

  const LogIn = () => {
    Firebase.loginEmail(LogInData.email, LogInData.password).catch(err =>
      console.log(error)
    );
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.motto}>Your Virtual Waytr</Text>
      <TextInput
        style={globalStyles.logInInput}
        keyboardType="email-address"
        onChangeText={value => {
          setLogInData({ ...LogInData, email: value });
        }}
        placeholder="Email"
      />
      <TextInput
        style={globalStyles.logInInput}
        secureTextEntry={true}
        onChangeText={value => {
          setLogInData({ ...LogInData, password: value });
        }}
        placeholder="Password"
      />
      <TouchableOpacity>
        <Text style={globalStyles.forgotCredentialsLink}>Forgot password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={globalStyles.logInButton} onPress={LogIn}>
        <Text style={globalStyles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <View style={globalStyles.signUpText}>
        <Text style={globalStyles.center}>Don't have an account? </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignUp_email");
          }}
        >
          <Text style={globalStyles.hyperLink}>Sign Up.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
