import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { UserType } from "../Constant/UserContext";
import UsersComponent from "../Components/UsersComponent";

export default function ActivityScreen() {
  const [selectedButton, setSelectedButton] = useState("people");
  const [users, setUsers] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const handleButtonclick = (tabname) => {
    setSelectedButton(tabname);
  };

  useEffect(() => {
    const fetchusers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodeToken = jwtDecode(token);
      const userId = decodeToken.userId;

      setUserId(userId);
      axios
        .get(`http://192.168.43.191:5000/user/${userId}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchusers();
  }, [users]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 20 }}>
          <Text style={{ fontSize: 25, fontWeight: "600" }}>Activity</Text>
          <View
            style={{
              marginTop: 20,
              gap: 15,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => handleButtonclick("people")}
              style={[
                {
                  flex: 1,
                  paddingHorizontal: 20,
                  paddingVertical: 15,
                  borderColor: "#d0d0d0",
                  borderRadius: 5,
                  borderWidth: 0.7,
                },

                selectedButton === "people"
                  ? { backgroundColor: "black" }
                  : null,
              ]}
            >
              <Text
                style={[
                  {
                    textAlign: "center",
                    fontWeight: "bold",
                  },

                  selectedButton === "people"
                    ? { color: "white" }
                    : { color: "black" },
                ]}
              >
                People's
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleButtonclick("all")}
              style={[
                {
                  flex: 1,
                  paddingHorizontal: 20,
                  paddingVertical: 15,
                  borderColor: "#d0d0d0",
                  borderRadius: 5,
                  borderWidth: 0.7,
                },

                selectedButton === "all" ? { backgroundColor: "black" } : null,
              ]}
            >
              <Text
                style={[
                  {
                    textAlign: "center",
                    fontWeight: "bold",
                  },

                  selectedButton === "all"
                    ? { color: "white" }
                    : { color: "black" },
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleButtonclick("request")}
              style={[
                {
                  flex: 1,
                  paddingHorizontal: 20,
                  paddingVertical: 15,
                  borderColor: "#d0d0d0",
                  borderRadius: 5,
                  borderWidth: 0.7,
                },

                selectedButton === "request"
                  ? { backgroundColor: "black" }
                  : null,
              ]}
            >
              <Text
                style={[
                  {
                    textAlign: "center",
                    fontWeight: "bold",
                  },

                  selectedButton === "request"
                    ? { color: "white" }
                    : { color: "black" },
                ]}
              >
                Request
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            {selectedButton === "people" && (
              <View style={{ marginTop: 40 }}>
                {users?.map((item, index) => (
                  <>
                    <UsersComponent key={index} item={item} />
                    <View
                      style={{
                        marginTop: 20,
                        marginBottom: 20,
                        borderBottomWidth: 0.7,
                        borderBottomColor: "#d0d0d0",
                      }}
                    />
                  </>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <StatusBar
        animated
        translucent
        networkActivityIndicatorVisible
        style="dark"
      />
    </SafeAreaView>
  );
}
