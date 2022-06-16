import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, createContext, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Switch,
  ScrollView,
  Image,
  Button,
} from "react-native";

const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee",
  },
  dark: {
    foreground: "#fafafa",
    background: "#212121",
  },
};

const ThemeContext = createContext();
const UserContext = createContext();

const apiUrl = "https://randomuser.me/api/?results=15";

export default function App() {
  const [list, setList] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);

  const [isEnabled, setIsEnabled] = useState(false);
  const [theme, setTheme] = useState(themes.light);

  const getUser = async () => {
    const res = await fetch(apiUrl);
    const randomUser = await res.json();
    setList(randomUser.results);
    setFilterUsers(randomUser.results);
  };

  const switchToggle = () => {
    setIsEnabled(isEnabled ? false : true);
    setTheme(isEnabled ? themes.light : themes.dark);
  };

  const handleFilter = (gender) => {
    let filterResult = [];

    if (gender === "male") {
      filterResult = list.filter(function (user) {
        return user.gender == "male";
      });
    } else if (gender === "female") {
      filterResult = list.filter(function (user) {
        return user.gender == "female";
      });
    } else {
      filterResult = list;
    }

    setFilterUsers(filterResult);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContext.Provider value={filterUsers}>
      <ThemeContext.Provider value={theme}>
        <View style={styles.container}>
          <SafeAreaView>
            <View style={styles.header}>
              <Text style={styles.heading1}>Users</Text>
              <Switch
                trackColor={{ false: "#FFFFFF", true: "#3e3e3e" }}
                thumbColor={isEnabled ? "#ffffff" : "#3e3e3e"}
                ios_backgroundColor="#fbfbfb"
                onValueChange={switchToggle}
                value={isEnabled}
              />
            </View>
            <View style={styles.genderButtons}>
              <View
                style={[
                  styles.button,
                  {
                    backgroundColor: theme.background,
                  },
                ]}
              >
                <Button
                  title="all"
                  color={theme.foreground}
                  onPress={() => handleFilter("all")}
                />
              </View>
              <View
                style={[
                  styles.button,
                  {
                    backgroundColor: theme.background,
                  },
                ]}
              >
                <Button
                  title="Male"
                  color={theme.foreground}
                  onPress={() => handleFilter("male")}
                />
              </View>
              <View
                style={[
                  styles.button,
                  {
                    backgroundColor: theme.background,
                  },
                ]}
              >
                <Button
                  title="Female"
                  color={theme.foreground}
                  onPress={() => handleFilter("female")}
                />
              </View>
            </View>
            <ListUsers />
            <StatusBar style={"auto"} />
          </SafeAreaView>
        </View>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}

function ListUsers() {
  return <ListUser />;
}

function ListUser() {
  const list = useContext(UserContext);
  const theme = useContext(ThemeContext);

  return (
    <ScrollView>
      {list.map((data) => {
        const {
          name: { title, first, last },
          location: {
            street: { number, name },
            city,
            country,
          },
          email,
          login: { uuid },
          picture: { large },
        } = data;
        return (
          <View
            style={[styles.card, { backgroundColor: theme.background }]}
            key={uuid}
          >
            <View>
              <Image
                style={styles.profile}
                source={{
                  uri: large,
                }}
              />
            </View>
            <View style={styles.information}>
              <Text style={[styles.name, { color: theme.foreground }]}>
                {title} {first} {last}
              </Text>
              <Text style={[styles.address, { color: theme.foreground }]}>
                {number} {name} {city} {country}
              </Text>
              <Text style={styles.email}>{email}</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#141E61",
    color: "black",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  heading1: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "800",
  },
  card: {
    height: 80,
    backgroundColor: "#eaeaea",
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  profile: {
    width: 60,
    height: 60,
    display: "flex",
    borderRadius: 6,
  },
  information: {
    marginLeft: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    color: "#007AFF",
  },
  genderButtons: {
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "#eeeeee",
    paddingHorizontal: 8,
    width: 100,
    borderRadius: 8,
    fontSize: 14,
  },
});
