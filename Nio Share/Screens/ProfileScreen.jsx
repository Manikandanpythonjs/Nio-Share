import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const Logout = () => {
    clearToken();
  };

  const clearToken = () => {
    AsyncStorage.removeItem("authToken");

    navigation.replace("login");
  };
  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <View>
        <TouchableOpacity onPress={Logout}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
      <StatusBar
        animated
        translucent
        networkActivityIndicatorVisible
        style="auto"
      />
    </SafeAreaView>
  );
}
