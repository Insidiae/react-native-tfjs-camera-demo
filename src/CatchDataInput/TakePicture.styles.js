import styled from "styled-components/native";
import { Camera as ExpoCamera } from "expo-camera";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";

export const FillContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const TensorCamera = cameraWithTensors(ExpoCamera);

export const Camera = styled(TensorCamera)`
  flex: 1;
  width: 100%;
  height: 100%;
  justify-content: flex-end;
  align-items: center;
  z-index: -1;
  elevation: -1;
`;

export const SnapButton = styled.TouchableOpacity`
  display: ${(props) => (props.evaluating ? "none" : "flex")};
  background-color: white;
  padding: 32px;
  margin: 20px;
  height: 64px;
  width: 64px;
  border-radius: 64px;
  border-width: 5px;
  border-color: black;
`;

export const SnapButtonWrapper = styled.View`
  position: absolute;
  bottom: 0;
  z-index: 2;
  elevation: 2;
`;

export const Evaluating = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  background-color: rgba(11, 208, 217, 0.5);
  z-index: 1;
  elevation: 1;
`;
