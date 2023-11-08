import {
  View,
  Text,
  SafeAreaView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  Alert,
  // ToastAndroid,
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const LoginScreen = () => {
  const keyboardDissmiss = () => {
    Keyboard.dismiss();
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginState = async () => {
      // const token = AsyncStorage.getItem("authToken");
      // const clear = AsyncStorage.clear();

      // console.log("Token is ", clear);
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          setTimeout(() => {
            navigation.replace("main");
          }, 400);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkLoginState();
  }, []);

  const handleLogin = () => {
    const userData = {
      email: email,
      password: password,
    };

    if (email === "" || password === "") {
      console.log("error");
      // {
      //   Platform.OS === "web"
      //     ? alert("Please fill the field first")
      //     : ToastAndroid.showWithGravity(
      //         "Please fill the field first",
      //         ToastAndroid.LONG,
      //         ToastAndroid.CENTER
      //       );
      // }
    } else {
      axios
        .post("http://192.168.43.191:5000/login", userData)
        .then((response) => {
          const token = response.data.token;
          AsyncStorage.setItem("authToken", token);
          navigation.navigate("main");
        })
        .catch((error) => {
          console.error(error);
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
            marginTop: Platform.OS === "web" ? 50 : 150,
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
            <Text
              style={{
                color: "black",
                fontSize: 22,
                fontWeight: "bold",
                marginTop: 20,
              }}
            >
              Login to your account
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

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 30,
            }}
          >
            <Text>Keep me logged in</Text>

            <TouchableOpacity>
              <Text style={{ fontWeight: "600", color: "#007fff" }}>
                Forgot password
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 30 }} />
          <TouchableOpacity
            onPress={() => handleLogin()}
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
              Connect your account
            </Text>
          </TouchableOpacity>
          <Pressable
            onPress={() => navigation.navigate("register")}
            style={{ marginTop: 25 }}
          >
            <Text style={{ textAlign: "center", fontSize: 18 }}>
              Don't have an account? Sign up
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
