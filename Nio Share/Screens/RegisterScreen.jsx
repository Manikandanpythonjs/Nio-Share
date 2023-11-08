import {
  Alert,
  Platform,
  // ToastAndroid,
  View,
  Text,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
const RegisterScreen = () => {
  const keyboardDissmiss = () => {
    Keyboard.dismiss();
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigation = useNavigation();

  const handlerRegistration = () => {
    if (email === "" || password === "" || username === "") {
      // ToastAndroid.showWithGravity(
      //   "Please fill the field first ",
      //   ToastAndroid.LONG,
      //   ToastAndroid.CENTER
      // );
      console.log("Error");
    } else {
      const user = {
        username: username,
        email: email,
        password: password,
      };

      axios
        .post("http://192.168.43.191:5000/register", user)
        .then((response) => {
          console.log(response);
          Alert.alert(
            "Registration Completed",
            "you have been registered successfully. Please verify your email check in your inbox"
          );

          setUsername("");
          setEmail("");
          setPassword("");
        })
        .catch((error) => {
          Alert.alert(
            "Registration failed",
            "error occured during registration"
          );
          console.log("error", error);
        });
    }
  };

  return (
    <SafeAreaView
      onStartShouldSetResponder={keyboardDissmiss}
      style={{
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginTop: Platform.OS === "web" ? 50 : 110,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../assets/Nio.png")}
            style={{ width: 100, height: 100, resizeMode: "contain" }}
          />
        </View>

        <KeyboardAvoidingView>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginTop: 20 }}>
              Create a account now
            </Text>
          </View>
          <View style={{ marginTop: 40 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                paddingVertical: 5,
                borderRadius: 5,
              }}
            >
              <AntDesign
                style={{ marginLeft: 5 }}
                name="user"
                size={24}
                color="black"
              />
              <TextInput
                value={username}
                onChangeText={(text) => setUsername(text)}
                cursorColor={"white"}
                placeholderTextColor={"gray"}
                placeholder="Username"
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                }}
              />
            </View>
          </View>
          <View style={{ marginTop: 40 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                paddingVertical: 5,
                borderRadius: 5,
              }}
            >
              <MaterialCommunityIcons
                style={{ marginLeft: 5 }}
                name="email-outline"
                size={24}
                color="black"
              />
              <TextInput
                underlineColorAndroid={"transparent"}
                value={email}
                onChangeText={(text) => setEmail(text)}
                cursorColor={"gray"}
                placeholderTextColor={"gray"}
                placeholder="Email"
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                }}
              />
            </View>
          </View>
          <View style={{ marginTop: 30 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                paddingVertical: 5,
                borderRadius: 5,
              }}
            >
              <Feather
                style={{ marginLeft: 5 }}
                name="lock"
                size={24}
                color="black"
              />
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                cursorColor={"gray"}
                secureTextEntry
                placeholderTextColor={"gray"}
                placeholder="Password"
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                }}
              />
            </View>
          </View>

          <View style={{ marginTop: 30 }} />
          <TouchableOpacity
            onPress={() => handlerRegistration()}
            style={{
              width: "vw",
              backgroundColor: "black",
              padding: 15,

              borderRadius: 5,
            }}
          >
            <Text
              style={{
                paddingVertical: 5,
                color: "white",
                fontWeight: "bold",
                fontSize: 15,
                textAlign: "center",
              }}
            >
              Create a account
            </Text>
          </TouchableOpacity>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ marginTop: 25 }}
          >
            <Text style={{ textAlign: "center", fontSize: 18 }}>
              Already have an account? Sign in
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
