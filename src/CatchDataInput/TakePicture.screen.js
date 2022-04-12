import React, { useState, useEffect, useRef } from "react";
import { ActivityIndicator, View, useWindowDimensions } from "react-native";
// import { useIsFocused } from "@react-navigation/native";
import Svg, { Text } from "react-native-svg";

import {
  Camera,
  Evaluating,
  SnapButton,
  FillContainer,
} from "./TakePicture.styles";

// import FillContainer from "../../../components/utility/FillContainer.component";

const TakePicture = () => {
  // const isFocused = useIsFocused();
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef();

  const [evaluating, setEvaluating] = useState(false);

  //* Get screen dimensions
  //  Useful for styling later
  const window = useWindowDimensions();

  //* Request permission to use the camera
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  async function snap() {
    if (cameraRef) {
      setEvaluating(true);
      const image = await cameraRef.current.takePictureAsync();

      console.log(image);
      setEvaluating(false);
      // navigation.navigate("CatchDataInput", {
      //   imageURI: image.uri,
      // });
    }
  }

  //* Unmount camera component upon leaving the screen
  // if (!isFocused) {
  //   return (
  //     <View>
  //       <Text>Camera already in use!</Text>
  //     </View>
  //   );
  // }

  return (
    <FillContainer>
      <Camera type={type} ref={(camera) => (cameraRef.current = camera)}>
        {evaluating && (
          <Evaluating>
            <ActivityIndicator size="large" color="white" />
            <Svg width={window.width} height={window.height / 3}>
              <Text
                fill="white"
                stroke="black"
                fontWeight="bold"
                fontSize="30"
                x={window.width / 2}
                y={window.height / 6}
                textAnchor="middle"
              >
                Saving...
              </Text>
            </Svg>
          </Evaluating>
        )}
        <SnapButton onPress={snap} evaluating={evaluating} />
      </Camera>
    </FillContainer>
  );
};

export default TakePicture;
