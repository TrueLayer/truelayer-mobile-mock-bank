/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from "react";
import axios from 'axios';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

const Action = ({title, onClick, color }): Node => {
  return (
    <TouchableOpacity style={[{ width: "100%", padding: 12, margin: 10, backgroundColor: color }]}>
      <Text
        onPress={onClick}
        style={[{textAlign: "center", fontWeight: "bold", color: "white"}]}
      >
          {title}
      </Text>
    </TouchableOpacity>
  );
};

const useMount = func => useEffect(() => func(), []);

const extractPaymentParams = (url) => {
  const parts = url.split("/");
  const params = parts[parts.length - 1].split("#");
  return {
    env: getEnvironment(url),
    paymentId: params[0],
    token: params[1].replace("token=", "")
  }
}

const getEnvironment = (url) => {
  if(url.includes("truelayer.com"))
    return "production";
  return "sandbox"
}

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    height: '100%'
  };

  const [url, setUrl] = useState(null);
  const [params, setParams] = useState(null);

  useMount(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app
      const initialUrl = await Linking.getInitialURL();

      setUrl(initialUrl);
      if(initialUrl)
        setParams(extractPaymentParams(initialUrl))
    };

    getUrlAsync();
  });

  Linking.addEventListener('url', ({url}) => {
    setUrl(url)
    setParams(extractPaymentParams(url))
  })

  const getEnvironmentUrl = (env) => {
    switch(env) {
      case 'production':
        return 'https://pay-mock-connect.truelayer.com';
      default:
        return 'https://pay-mock-connect.truelayer-sandbox.com';
    }
  }

  const execute = async (action) => {
    if(!params) {
      Alert.alert("Error", "No deep links received", [{ text: "OK" }]);
      return
    }

    try {
      const res = await axios.post(`${getEnvironmentUrl(params.env)}/api/single-immediate-payments/${params.paymentId}/action`,
        {
          action: action,
          redirect: false,
        },
        {
          headers: {
            'Authorization': `Bearer ${params.token}`
          }
        })

      await Linking.openURL(res.data);
    }
    catch(err) {
      console.log(err)
      Alert.alert("Error", err.message, [{ text: "OK" }]);
    }
  }
 
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={[styles.container,
            {
              backgroundColor: backgroundStyle.backgroundColor, padding: 16, alignItems: "center", flexWrap: "nowrap"
            }
          ]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: isDarkMode ? Colors.white : Colors.black
              },
            ]}>
            Mock Bank
          </Text>
          <Action
            title="Execute"
            onClick={async () => { execute("Execute") }}
            color="#4caf50"
          />
          <Action
            onClick={async () => { execute("RejectAuthorisation") }}
            title="Reject Authorisation"
            color="#333333"
          />
          <Action
            onClick={async () => { execute("RejectExecution") }}
            title="Reject Execution"
            color="#333333"
          />
          <Text style={[{color: isDarkMode ? Colors.white : Colors.black}]}>
          <Text style={[{fontWeight: "bold"}]}>{ "Payment ID: " }</Text>
            {params ? `${params.paymentId || "Not Found"}` : "Not Found"}
          </Text>
        </View>        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
