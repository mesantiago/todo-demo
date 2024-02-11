import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import * as PropTypes from 'prop-types';

import colors from '../config/colors';
import Footer from './Footer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    fontSize: 13,
    fontFamily:
      '"Lucida Sans Unicode","Lucida Grande",Arial,Helvetica,clean,sans-serif',
  },
  body: {
    minHeight: '30%',
  },
});

export default function Screen({ children }) {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.body}>{children}</View>
        <Footer />
      </View>
    </SafeAreaView>
  );
}

Screen.propTypes = {
  children: PropTypes.shape().isRequired,
};
