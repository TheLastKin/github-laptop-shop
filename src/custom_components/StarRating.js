import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors } from 'react-native-paper';

const StarRating = ({ rating, fontSize, starColor = "#FFD932", ratingColor = Colors.white}) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
        let name = 'star';
        if (i > rating) {
            name = 'star-o';
        } else if (rating - (i - 1) >= 0.5) {
            name = 'star-half-o';
        }
        stars.push((
            <FontAwesome style={styles.star} color={starColor} name={name} size={fontSize} key={i} />
        ));
    }
    return(
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {stars}
            <Text style={[styles.rating, { fontSize: fontSize, color: ratingColor}]}>({rating})</Text>
        </View>
    );
};

export default StarRating;

const styles = StyleSheet.create({
    rating: {
        marginLeft: 5,
    },
    star: {
        marginHorizontal: 1,
    },
})