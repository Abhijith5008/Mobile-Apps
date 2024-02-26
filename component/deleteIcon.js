import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const DeleteComp = () => {
    const trashIconRef = useRef(null);

    useEffect(()=>{
        if (trashIconRef.current) {
            trashIconRef.current.animate('shake', 1000);
        }
    });

    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
                style={{
                    color: "#fc0307",
                    fontWeight: "600",
                    paddingHorizontal: 30,
                    paddingVertical: 20,
                }}>
                Delete
            </Text>
            <Animatable.View ref={trashIconRef} animation="shake" duration={1000}>
                <Feather name={'trash'} size={20} color="red" />
            </Animatable.View>
        </View>
    );
};

export default DeleteComp;
