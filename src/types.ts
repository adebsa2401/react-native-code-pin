import React from "react";
import type {KeyboardTypeOptions, TextInputProps, TextStyle, ViewStyle} from "react-native";

export interface IRNCodePinProps {
  value?: string;
  codeLength?: number;
  cellSize?: number;
  cellSpacing?: number;
  placeholder?: string | React.ReactElement;
  mask?: string | React.ReactElement;
  maskDelay?: number;
  password?: boolean;
  autoFocus?: boolean;
  restrictToNumbers?: boolean;
  containerStyle?: ViewStyle;
  cellStyle?: ViewStyle;
  cellStyleFocused?: ViewStyle;
  cellStyleFilled?: ViewStyle;
  textStyle?: TextStyle;
  textStyleFocused?: TextStyle;
  label?: string | React.ReactElement;
  labelStyle?: TextStyle;
  animated?: boolean;
  animationFocused?: string | object;
  onFulfill?: (code: string) => void;
  onChangeText?: (code: string) => void;
  onBackspace?: () => void;
  testID?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  keyboardType?: KeyboardTypeOptions;
  editable?: boolean;
  inputProps?: TextInputProps;
  disableFullscreenUI?: boolean;
}
