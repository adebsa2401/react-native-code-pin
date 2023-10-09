import {
  I18nManager,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View
} from "react-native";
import {IRNCodePinProps} from "./types";
import {useCallback, useEffect, useRef, useState} from "react";

export default function RNCodePin({
                                    value = '',
                                    codeLength = 4,
                                    cellSize = 48,
                                    cellSpacing = 4,
                                    placeholder = '',
                                    password = false,
                                    mask = '*',
                                    maskDelay = 200,
                                    keyboardType = 'numeric',
                                    autoFocus = false,
                                    restrictToNumbers = false,
                                    containerStyle = styles.containerDefault,
                                    cellStyle = styles.cellDefault,
                                    cellStyleFocused = styles.cellFocusedDefault,
                                    cellStyleFilled = {},
                                    textStyle = styles.textStyleDefault,
                                    textStyleFocused = styles.textStyleFocusedDefault,
                                    label,
                                    labelStyle = styles.labelStyleDefault,
                                    // animationFocused = 'pulse',
                                    // animated = true,
                                    editable = true,
                                    inputProps = {},
                                    disableFullscreenUI = true,
                                    onChangeText,
                                    onFulfill,
                                    onBackspace,
                                    onFocus,
                                    onBlur,
                                    testID,
                                  }: IRNCodePinProps) {
  const [focused, setFocused] = useState(autoFocus);
  const [maskDelayed, setMaskDelayed] = useState(false);
  const ref = useRef<View>(null);
  const inputRef = useRef<TextInput>(null);

  const handleCodeChange = useCallback((code: string) => {
    if (restrictToNumbers) {
      code = (code.match(/[0-9]/g) || []).join("");
    }

    onChangeText?.(code);
    (code.length === codeLength) && onFulfill?.(code);

    // handle password mask
    setMaskDelayed(password &&
      (code.length > value.length)); // only when input new char
  }, [codeLength, maskDelay]);

  const handleKeyPress = useCallback(({nativeEvent: {key}}: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (key === 'Backspace') {
      onBackspace?.();
    }
  }, [value]);

  const handleFocus = useCallback(() => {
    setFocused(true);
    onFocus?.();
  }, []);

  const handleBlur = useCallback(() => {
    setFocused(false);
    onBlur?.();
  }, []);

  useEffect(() => {
    if (maskDelayed) { // mask password after delay
      const maskTimeout = setTimeout(() => {
          setMaskDelayed(false);
        },
        maskDelay
      );

      return () => clearTimeout(maskTimeout);
    }
  }, [maskDelayed, maskDelay]);

  return (
    <View
      ref={ref}
      style={[{
        alignItems: 'stretch', flexDirection: 'row', justifyContent: 'center', position: 'relative',
        width: cellSize * codeLength + cellSpacing * (codeLength - 1),
        height: cellSize,
      },
        containerStyle,
      ]}>
      <View style={{
        position: 'absolute', margin: 0, height: '100%',
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
      }}>
        <Text style={[{
          fontSize: 15,
          color: "#000",
          position: "absolute",
          bottom: "100%",
          left: 0,
        },
          labelStyle
        ]}>
          {label}
        </Text>
        {
          [...Array(codeLength)].map((_, idx) => {
            const cellFocused = focused && idx === value.length;
            const filled = idx < value.length;
            const last = (idx === value.length - 1);
            const showMask = filled && (password && (!maskDelay || !last));
            const isPlaceholderText = typeof placeholder === 'string';
            const isMaskText = typeof mask === 'string';
            const pinCodeChar = value.charAt(idx);

            let cellText = null;
            if (filled || placeholder !== null) {
              if (showMask && isMaskText) {
                cellText = mask;
              } else if (!filled && isPlaceholderText) {
                cellText = placeholder;
              } else if (pinCodeChar) {
                cellText = pinCodeChar;
              }
            }

            const placeholderComponent = !isPlaceholderText ? placeholder : null;
            const maskComponent = (showMask && !isMaskText) ? mask : null;
            const isCellText = typeof cellText === 'string';

            return (
              <View
                key={idx}
                style={[
                  {
                    width: cellSize,
                    height: cellSize,
                    marginLeft: cellSpacing / 2,
                    marginRight: cellSpacing / 2,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  cellStyle,
                  cellFocused ? cellStyleFocused : {},
                  filled ? cellStyleFilled : {},
                ]}
                // animation={idx === value.length && focused && animated ? animationFocused : null}
                // iterationCount="infinite"
                // duration={500}
              >
                {isCellText && !maskComponent && <Text style={[textStyle, cellFocused ? textStyleFocused : {}]}>
                  {cellText}
                </Text>}

                {(!isCellText && !maskComponent) && placeholderComponent}
                {isCellText && maskComponent}
              </View>
            );
          })
        }
      </View>
      <TextInput
        disableFullscreenUI={disableFullscreenUI}
        value={value}
        ref={inputRef}
        onChangeText={handleCodeChange}
        onKeyPress={handleKeyPress}
        onFocus={handleFocus}
        onBlur={handleBlur}
        spellCheck={false}
        autoFocus={autoFocus}
        keyboardType={keyboardType}
        numberOfLines={1}
        caretHidden
        maxLength={codeLength}
        selection={{
          start: value.length,
          end: value.length,
        }}
        style={{
          flex: 1,
          opacity: 0,
          textAlign: 'center',
        }}
        testID={testID || undefined}
        editable={editable}
        {...inputProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  containerDefault: {},
  cellDefault: {
    borderColor: 'gray',
    borderWidth: 1,
  },
  cellFocusedDefault: {
    borderColor: 'black',
    borderWidth: 2,
  },
  textStyleDefault: {
    color: 'gray',
    fontSize: 24,
  },
  textStyleFocusedDefault: {
    color: 'black',
  },
  labelStyleDefault: {},
});
