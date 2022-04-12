import React, { useState, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  View,
  useWindowDimensions,
  ToastAndroid,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { Camera as ExpoCamera } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import Svg, { Text } from "react-native-svg";
import * as tf from "@tensorflow/tfjs";
import {
  bundleResourceIO,
  decodeJpeg,
  fetch,
} from "@tensorflow/tfjs-react-native";

const modelJSON = require("../../assets/model_v3/model.json");
const modelWeights = [
  require("../../assets/model_v3/group1-shard1of5.bin"),
  require("../../assets/model_v3/group1-shard2of5.bin"),
  require("../../assets/model_v3/group1-shard3of5.bin"),
  require("../../assets/model_v3/group1-shard4of5.bin"),
  require("../../assets/model_v3/group1-shard5of5.bin"),
];

const classesDir = {
  1: {
    name: "With Helmet",
    id: 1,
  },
  2: {
    name: "Without Helmet",
    id: 2,
  },
};

import {
  Camera,
  Evaluating,
  SnapButton,
  FillContainer,
} from "./TakePicture.styles";

// import FillContainer from "../../../components/utility/FillContainer.component";

function handleCameraStream(images, updatePreview, gl) {
  const loop = async () => {
    const nextImageTensor = images.next().value;

    //
    // do something with tensor here
    //

    // if autorender is false you need the following two lines.
    // updatePreview();
    // gl.endFrameEXP();

    requestAnimationFrame(loop);
  };
  loop();
}

const TakePicture = () => {
  const isFocused = useIsFocused();
  const [isTfReady, setIsTfReady] = useState(false);
  const [model, setModel] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(ExpoCamera.Constants.Type.back);
  const cameraRef = useRef();

  const [evaluating, setEvaluating] = useState(false);

  //* Get screen dimensions
  //  Useful for styling later
  const window = useWindowDimensions();
  const imageWidth = window.width;

  //* Request permission to use the camera
  useEffect(() => {
    (async () => {
      const { status } = await ExpoCamera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");

      await tf.ready();
      setIsTfReady(true);

      const loadedModel = await tf.loadGraphModel(
        bundleResourceIO(modelJSON, modelWeights)
      );
      setModel(loadedModel);
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
      // setEvaluating(true);
      const image = await cameraRef.current.camera.takePictureAsync();

      console.log(image);

      ToastAndroid.show("Processing...", ToastAndroid.SHORT);

      const imageB64 = await FileSystem.readAsStringAsync(image.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const imageBuffer = tf.util.encodeString(imageB64, "base64").buffer;
      const imageData = new Uint8Array(imageBuffer);
      const imageTensor = decodeJpeg(imageData);

      const predictions = await model.executeAsync(
        imageTensor.transpose([0, 1, 2]).expandDims()
      );

      const boxes = predictions[5].arraySync();
      const scores = predictions[1].arraySync();
      const classes = predictions[0].dataSync();

      const currentDetectionObjects = [];

      scores[0].forEach((score, idx) => {
        if (score > 0.5) {
          console.log("above threshold", score);
          const bbox = [];
          const minY = boxes[0][idx][0] * imageWidth;
          const minX = boxes[0][idx][1] * imageWidth;
          const maxY = boxes[0][idx][2] * imageWidth;
          const maxX = boxes[0][idx][3] * imageWidth;
          bbox[0] = minX;
          bbox[1] = minY;
          bbox[2] = maxX - minX;
          bbox[3] = maxY - minY;

          currentDetectionObjects.push({
            class: classes[idx],
            label: classesDir[classes[idx]].name,
            score: score.toFixed(4),
            bbox: bbox,
          });
        }
      });

      console.log(currentDetectionObjects);

      ToastAndroid.show("Check console log", ToastAndroid.SHORT);
      // setEvaluating(false);
      // navigation.navigate("CatchDataInput", {
      //   imageURI: image.uri,
      // });
    }
  }

  //* Unmount camera component upon leaving the screen
  if (!isTfReady) {
    return (
      <View>
        <Text>Loading TensorFlow model...</Text>
      </View>
    );
  }

  if (!isFocused) {
    return (
      <View>
        <Text>Camera already in use!</Text>
      </View>
    );
  }

  return (
    <FillContainer>
      <Camera
        type={type}
        ref={cameraRef}
        resizeHeight={200}
        resizeWidth={152}
        resizeDepth={3}
        onReady={handleCameraStream}
        autorender={true}
      />
      {/* {evaluating ? (
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
              Processing...
            </Text>
          </Svg>
        </Evaluating>
      ) : null} */}
      <SnapButton onPress={snap} evaluating={evaluating} />
    </FillContainer>
  );
};

export default TakePicture;
