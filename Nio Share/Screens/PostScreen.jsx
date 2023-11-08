import {
  View,
  Text,
  Platform,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import "../web.module.css";
import { UserType } from "../Constant/UserContext";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function PostScreen() {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [loggeduser, setloggedUser] = useState();
  const [content, setContent] = useState("");
  const keyboardDissmiss = () => {
    Keyboard.dismiss();
  };
  console.log(userId);
  useEffect(() => {
    const getLoggedUserData = () => {
      axios
        .get(`http://192.168.43.191:5000/currentUser/${userId}`)
        .then((response) => {
          const data = response.data;
          setloggedUser(data);
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    getLoggedUserData();
  }, []);

  const handlePost = async () => {
    if (content === "") {
      Platform.OS === "web"
        ? alert("Please fill the field")
        : Alert.alert("Warning", "Please fill the field");
    } else {
      const postData = {
        userId,
      };

      if (content) {
        postData.content = content;
      }

      axios
        .post("http://192.168.43.191:5000/create-post", postData)
        .then((response) => {
          setContent("");
          navigation.navigate("home");
        })
        .catch((error) => {
          console.log("error creating post", error);
        });
    }
  };

  return (
    <SafeAreaView
      onStartShouldSetResponder={keyboardDissmiss}
      style={{ flex: 1 }}
    >
      {Platform.OS === "web" ? (
        <div className="main">
          <div className="container">
            <div className="info">
              <img
                width={50}
                height={50}
                src="https://i.pravatar.cc/150?img=2"
                style={{ borderRadius: 100 }}
              />
              <h2>{loggeduser?.[0].username}</h2>
            </div>
            <div className="inputs">
              <div>
                <input
                  value={content}
                  onChange={(text) => setContent(text.target.value)}
                  placeholder="Share your feelings"
                />
              </div>
              <div style={{ cursor: "pointer" }} className="btn-share">
                <Ionicons
                  onPress={handlePost}
                  name="send"
                  size={24}
                  color="black"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ marginTop: 30 }} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                resizeMode: "contain",
              }}
              source={{
                uri: "https://i.pravatar.cc/150?img=2",
              }}
            />

            <Text style={{ fontSize: 18, fontWeight: "600", marginLeft: 10 }}>
              {loggeduser?.[0].username}
            </Text>
          </View>
          <View style={{ marginTop: 20 }} />
          <KeyboardAvoidingView>
            <View
              style={{
                borderWidth: 0.7,
                borderColor: "#d0d0d0",
                paddingHorizontal: 10,
                paddingVertical: 15,
                width: "100%",
                borderRadius: 10,
              }}
            >
              <TextInput
                value={content}
                onChangeText={(text) => setContent(text)}
                collapsable
                cursorColor={"#d0d0d0"}
                style={{ fontSize: 15, fontWeight: "500", width: "100%" }}
                placeholder="Share Your Feelings"
                multiline
              />
            </View>
            <View style={{ marginTop: 20 }} />
            <View style={{ width: "100%" }}>
              <TouchableOpacity
                onPress={handlePost}
                style={{
                  width: "100%",
                  backgroundColor: "dodgerblue",
                  paddingVertical: 15,
                  borderRadius: 7,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 15,
                  }}
                >
                  Share Feelings
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      )}
      <StatusBar
        animated
        translucent
        networkActivityIndicatorVisible
        style="auto"
      />
    </SafeAreaView>
  );
}
