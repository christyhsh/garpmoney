import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  SafeAreaView 
} from 'react-native';
import Slider from '@react-native-community/slider';

export default function App() {
  const [numberOfPeople, setNumberOfPeople] = useState(2);

  const handleConfirm = () => {
    // We'll implement this later to navigate to the next screen
    console.log(`Confirmed number of people: ${numberOfPeople}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Split the Bill</Text>
        <Text style={styles.subtitle}>How many people are dining?</Text>
        
        <View style={styles.sliderContainer}>
          <Text style={styles.numberDisplay}>{numberOfPeople}</Text>
          <Slider
            style={styles.slider}
            minimumValue={2}
            maximumValue={20}
            step={1}
            value={numberOfPeople}
            onValueChange={setNumberOfPeople}
            minimumTrackTintColor="#2196F3"
            maximumTrackTintColor="#000000"
            thumbTintColor="#2196F3"
          />
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleConfirm}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  sliderContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  numberDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2196F3',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 