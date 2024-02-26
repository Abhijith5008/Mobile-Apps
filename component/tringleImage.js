import React, { useCallback, useRef } from 'react';
import Svg, { ClipPath, Defs, Path, Image as SvgImage } from 'react-native-svg';
import * as Animatable from 'react-native-animatable';
import { useFocusEffect } from '@react-navigation/native';

const InvertedTriangleImage = () => {
    const height = 400;
    const width = 550;
    const pathData = 'M0 0 L0 400 L550 200 L550 0 Z';
    const url = "../assets/defaultBackgroundImage.jpeg";
    const viewRef = useRef(null);

    useFocusEffect(
        useCallback(() => {
            viewRef.current.animate('slideInDown', 600);
        }, [])
    );

    return (
        <Animatable.View
            ref={viewRef}
            style={{
                alignItems: 'flex-start', flex: 1, padding: 20,
                paddingTop: 20,
            }}>
            <Svg height={height} width={width}>
                <Defs>
                    <ClipPath id="clip">
                        <Path d={pathData} />
                    </ClipPath>
                </Defs>
                <SvgImage
                    href={require(url)}
                    height={height}
                    width={width}
                    preserveAspectRatio="xMinYMin slice"
                    x="50"
                    clipPath="url(#clip)"
                />
            </Svg>
        </Animatable.View>
    );
};

export default InvertedTriangleImage;
