import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactNative, {
	NativeModules,
	View,
	Text,
	StyleSheet,
	ScrollView,
	Dimensions,
	TextInput,
	ViewPropTypes,
} from "react-native";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import CreditCard from "./CardView";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const s = StyleSheet.create({
	container: {
		width: wp("100%"),
		alignItems: "center",
		flexDirection: "column",
		justifyContent: "space-around",
	},
	form: {
		marginTop: 20,
	},
	inputContainer: {
		// marginLeft: 20,
		marginVertical: 10,
	},
	inputLabel: {
		fontWeight: "bold",
	},
	input: {
		height: 40,
	},
});

const CARD_NUMBER_INPUT_WIDTH = wp("75%");
const CVC_INPUT_WIDTH = wp("35%");
const EXPIRY_INPUT_WIDTH = wp("35%");
const CARD_NUMBER_INPUT_WIDTH_OFFSET = 40;
const NAME_INPUT_WIDTH = CARD_NUMBER_INPUT_WIDTH;
const PREVIOUS_FIELD_OFFSET = 40;
const POSTAL_CODE_INPUT_WIDTH = 120; // https://github.com/yannickcr/eslint-plugin-react/issues/106

/* eslint react/prop-types: 0 */ export default class CreditCardInput extends Component {
	static propTypes = {
		...InjectedProps,
		labels: PropTypes.object,
		placeholders: PropTypes.object,

		labelStyle: Text.propTypes.style,
		inputStyle: Text.propTypes.style,
		inputContainerStyle: ViewPropTypes.style,

		validColor: PropTypes.string,
		invalidColor: PropTypes.string,
		placeholderColor: PropTypes.string,

		cardImageFront: PropTypes.number,
		cardImageBack: PropTypes.number,
		cardScale: PropTypes.number,
		cardFontFamily: PropTypes.string,
		cardBrandIcons: PropTypes.object,

		allowScroll: PropTypes.bool,

		additionalInputsProps: PropTypes.objectOf(
			PropTypes.shape(TextInput.propTypes)
		),
	};

	static defaultProps = {
		cardViewSize: {},
		labels: {
			name: "AD SOYAD",
			number: "KART NUMARASI",
			expiry: "SON KULLANMA TARİHİ",
			cvc: "CVC/CCV",
			postalCode: "POSTA KODU",
		},
		placeholders: {
			name: "AD SOYAD",
			number: "1234 5678 1234 5678",
			expiry: "AA/YY",
			cvc: "CVC",
			postalCode: "34000",
		},
		inputContainerStyle: {
			borderBottomWidth: 1,
			borderBottomColor: "black",
		},
		validColor: "",
		invalidColor: "red",
		placeholderColor: "gray",
		allowScroll: false,
		additionalInputsProps: {},
	};

	componentDidMount = () => this._focus(this.props.focused);

	componentWillReceiveProps = (newProps) => {
		if (this.props.focused !== newProps.focused)
			this._focus(newProps.focused);
	};

	_focus = (field) => {
		if (!field) return;

		// const scrollResponder = this.refs.Form.getScrollResponder();
		const nodeHandle = ReactNative.findNodeHandle(this.refs[field]);

		// NativeModules.UIManager.measureLayoutRelativeToParent(nodeHandle,
		//   e => { throw e; },
		//   x => {
		//     scrollResponder.scrollTo({ x: Math.max(x - PREVIOUS_FIELD_OFFSET, 0), animated: true });
		//     this.refs[field].focus();
		//   });
	};

	_inputProps = (field) => {
		const {
			inputStyle,
			labelStyle,
			validColor,
			invalidColor,
			placeholderColor,
			placeholders,
			labels,
			values,
			status,
			onFocus,
			onChange,
			onBecomeEmpty,
			onBecomeValid,
			additionalInputsProps,
		} = this.props;

		return {
			inputStyle: [s.input, inputStyle],
			labelStyle: [s.inputLabel, labelStyle],
			validColor,
			invalidColor,
			placeholderColor,
			ref: field,
			field,

			label: labels[field],
			placeholder: placeholders[field],
			value: values[field],
			status: status[field],

			onFocus,
			onChange,
			onBecomeEmpty,
			onBecomeValid,

			additionalInputProps: additionalInputsProps[field],
		};
	};

	render() {
		const {
			cardImageFront,
			cardImageBack,
			inputContainerStyle,
			values: { number, expiry, cvc, name, type },
			focused,
			requiresName,
			requiresPostalCode,
			cardScale,
			cardFontFamily,
			cardBrandIcons,
		} = this.props;

		return (
			<View style={s.container}>
				<CreditCard
					focused={focused}
					brand={type}
					scale={cardScale}
					fontFamily={cardFontFamily}
					imageFront={cardImageFront}
					imageBack={cardImageBack}
					customIcons={cardBrandIcons}
					name={requiresName ? name : " "}
					number={number}
					expiry={expiry}
					cvc={cvc}
				/>
				<View style={{}}>
					<CCInput
						{...this._inputProps("number")}
						keyboardType="numeric"
						containerStyle={[
							s.inputContainer,
							inputContainerStyle,
							{ width: CARD_NUMBER_INPUT_WIDTH },
						]}
					/>
					<View
						style={{
							width: CARD_NUMBER_INPUT_WIDTH,
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<CCInput
							{...this._inputProps("expiry")}
							keyboardType="numeric"
							containerStyle={[
								s.inputContainer,
								inputContainerStyle,
								{},
							]}
						/>
						<CCInput
							{...this._inputProps("cvc")}
							keyboardType="numeric"
							containerStyle={[
								s.inputContainer,
								inputContainerStyle,
								{},
							]}
						/>
					</View>
					{requiresName && (
						<CCInput
							{...this._inputProps("name")}
							containerStyle={[
								s.inputContainer,
								inputContainerStyle,
								{ width: NAME_INPUT_WIDTH },
							]}
						/>
					)}
					{requiresPostalCode && (
						<CCInput
							{...this._inputProps("postalCode")}
							keyboardType="numeric"
							containerStyle={[
								s.inputContainer,
								inputContainerStyle,
								{ width: POSTAL_CODE_INPUT_WIDTH },
							]}
						/>
					)}
				</View>
			</View>
		);
	}
}
