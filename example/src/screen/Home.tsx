import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { init } from 'react-native-altibbi';

type Style = {
  container: ViewStyle;
  button: ViewStyle;
  buttonText: TextStyle;
};
const styles: StyleSheet = StyleSheet.create<Style>({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    width: '100%',
    borderRadius: 15,
    height: 50,
    backgroundColor: '#10e1d0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});

const Home = (props) => {
  useEffect(() => {
    init('', 'ar', '');
  }, []);

  const navigate = (page: string) => {
    props.navigation.navigate(page);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigate('User')} style={styles.button}>
        <Text style={styles.buttonText}>User Page</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigate('Consultation')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>consultation Page</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
