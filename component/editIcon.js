import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const EditComp = () => {
    const editIconRef = useRef(null);

    useEffect(() => {
        if (editIconRef.current) {
            editIconRef.current.animate('flash', 1000);
        }
    });

    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Animatable.View ref={editIconRef} animation="flash" duration={1000}>
                <Feather name={'edit'} size={20} color="#00a85d" />
            </Animatable.View>
            <Text
                style={{
                    color: "#00a85d",
                    fontWeight: "600",
                    paddingHorizontal: 30,
                    paddingVertical: 20,
                }}>
                Edit
            </Text>
        </View>
    );
};

export default EditComp;
