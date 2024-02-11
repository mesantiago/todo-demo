import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import colors from '../config/colors';

const styles = StyleSheet.create({
  footer: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingVertical: 40,
    marginTop: 40,
  },
});

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text>fullstack-demo@2024</Text>
    </View>
  );
}
