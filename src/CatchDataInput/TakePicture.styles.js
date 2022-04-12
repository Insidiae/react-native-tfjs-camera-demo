import styled from "styled-components/native";
import { Camera as ExpoCamera } from "expo-camera";

export const FillContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Camera = styled(ExpoCamera)`
  flex: 1;
  width: 100%;
  height: 100%;
  justify-content: flex-end;
  align-items: center;
`;

export const SnapButton = styled.TouchableOpacity`
  display: ${(props) => (props.evaluating ? "none" : "flex")};
  flex: 0;
  background-color: white;
  padding: 32px;
  align-self: center;
  margin: 20px;
  height: 64px;
  width: 64px;
  border-radius: 64px;
  border-width: 5px;
  border-color: black;
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
`;
