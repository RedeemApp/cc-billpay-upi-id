import { useState, useEffect } from "react";
import {
	Copy,
	CreditCard,
	Smartphone,
	Moon,
	Sun,
	CircleAlert,
} from "lucide-react";
import gpayLogo from "./assets/gpayLogo.svg";
import gpayLogoDark from "./assets/gpayLogoDark.svg";
import Security from "./components/security";
import Caution from "./components/caution";
import UpiFormats from "./components/upiFormats";

export default function UPIIDGenerator() {
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [cardNumber, setCardNumber] = useState("");
	const [phoneError, setPhoneError] = useState(false);
	const [cardError, setCardError] = useState(false);
	const [generatedUPIIds, setGeneratedUPIIds] = useState<
		{ bank: string; upiId: string; strikethrough: boolean; disabled: boolean }[]
	>([]);
	const [tableVisible, setTableVisible] = useState(false);
	const [copiedUPIId, setCopiedUPIId] = useState<string | null>(null);

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme === "dark") {
			setIsDarkMode(true);
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, []);

	const toggleDarkMode = () => {
		const newTheme = !isDarkMode ? "dark" : "light";
		setIsDarkMode(!isDarkMode);
		document.documentElement.classList.toggle("dark", !isDarkMode);
		localStorage.setItem("theme", newTheme);
	};

	const validatePhoneNumber = (phoneNumber: string) => {
		if (phoneNumber.toString().length < 10) {
			setPhoneError(true);
		} else {
			setPhoneError(false);
		}
		setPhoneNumber(phoneNumber.slice(0, 10));
	};

	const luhnCheck = (cardNumber: string) => {
		let sum = 0;
		let shouldDouble = false;

		for (let i = cardNumber.length - 1; i >= 0; i--) {
			let digit = parseInt(cardNumber[i], 10);

			if (shouldDouble) {
				digit *= 2;
				if (digit > 9) {
					digit -= 9;
				}
			}

			sum += digit;
			shouldDouble = !shouldDouble;
		}

		return sum % 10 === 0;
	};

	const validateCardNumber = (input: string) => {
		let value = input.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
		let formattedValue = "";
		for (let i = 0; i < value.length; i++) {
			if (i > 0 && i % 4 === 0) {
				formattedValue += " ";
			}
			formattedValue += value[i];
		}
		setCardNumber(formattedValue);

		const cleanedLength = value.length;
		const isLengthValid = cleanedLength === 15 || cleanedLength === 16;

		const isLuhnValid = isLengthValid ? luhnCheck(value) : false;
		if (luhnCheck(value)) {
			console.log("true");
		} else {
			console.log("false");
		}

		setCardError(!isLuhnValid || !isLengthValid);
	};

	const generateUPIIds = () => {
		const last4Digits = cardNumber.slice(-4);
		const upiIDs = {
			Axis: `CC.91${phoneNumber}${last4Digits}@axisbank`,
			ICICI: `ccpay.${cardNumber.replace(/\s+/g, "")}@icici`,
			"AU Bank": `AUCC${phoneNumber}${last4Digits}@AUBANK`,
			IDFC: `${cardNumber.replace(/\s+/g, "")}.cc@idfcbank`,
			AMEX:
				cardNumber.replace(/\s+/g, "").length === 15
					? `AEBC${cardNumber.replace(/\s+/g, "")}@SC`
					: "Not applicable for 16-digit cards",
			SBI: `Sbicard.${cardNumber.replace(/\s+/g, "")}@SBI`,
		};

		const upiList = Object.entries(upiIDs).map(([bank, upiId]) => ({
			bank,
			upiId,
			strikethrough: bank === "SBI" ? true : false,
			disabled: upiId.includes("Not applicable") || bank === "SBI",
		}));

		setGeneratedUPIIds(upiList);
		setTableVisible(true);
	};

	const copyToClipboard = (upiId: string) => {
		if (navigator.clipboard && window.isSecureContext) {
			navigator.clipboard.writeText(upiId).then(() => setCopiedUPIId(upiId));
		} else {
			const tempTextArea = document.createElement("textarea");
			tempTextArea.value = upiId;

			tempTextArea.style.position = "fixed";
			tempTextArea.style.left = "-9999px";
			document.body.appendChild(tempTextArea);
			tempTextArea.focus();
			tempTextArea.select();

			try {
				document.execCommand("copy");
				setCopiedUPIId(upiId);
			} catch (err) {
				console.error("Failed to copy UPI ID: ", err);
			}

			document.body.removeChild(tempTextArea);
		}
	};

	return (
		<main className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 dark:bg-gradient-to-br dark:from-purple-900 dark:to-indigo-900 flex items-center justify-center py-10">
			<div className="container relative sm:mt-0 max-w-4xl bg-white dark:bg-gray-800 dark:text-gray-100 p-8 rounded-lg overflow-auto">
				<div className="flex justify-between items-center mb-6">
					<div className="heading text-2xl font-bold text-purple-800 dark:text-purple-300">
						Pay Your Credit Card Bills via UPI
					</div>
					<button
						onClick={toggleDarkMode}
						className="p-2 rounded-full bg-gray-400 dark:bg-gray-600"
					>
						{isDarkMode ? (
							<Sun className="text-yellow-400" />
						) : (
							<Moon className="text-black-400" />
						)}
					</button>
				</div>
				<div className="sub-heading text-xl text-purple-600 dark:text-purple-300 mb-6">
					Did you know you can pay credit card bills via UPI id? Yes, almost all
					the banks have provided a way to do that.
				</div>

				<Security />

				<div className="Form flex flex-col gap-4 sm:flex-row mb-6">
					<div className="smartphone-input flex items-center space-x-2 w-full sm:w-1/2 relative">
						<Smartphone className="text-purple-500 dark:text-purple-300 w-6 h-6 sm:w-8 sm:h-8" />
						<input
							type="number"
							maxLength={10}
							value={phoneNumber}
							placeholder="Enter Phone Number"
							onChange={(e) => validatePhoneNumber(e.target.value)}
							className="flex-grow w-4 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:focus:border-purple-400 dark:focus:ring-purple-400 bg-white text-black border-gray-300 focus:border-purple-500 focus:ring-purple-500 focus:outline-none focus:ring-1"
						/>
						{phoneError && (
							<CircleAlert className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-6 h-6" />
						)}
					</div>
					<div className="creditcard-input flex items-center space-x-2 w-full sm:w-1/2 relative">
						<CreditCard className="text-purple-500 dark:text-purple-300 w-6 h-6 sm:w-8 sm:h-8" />
						<input
							type="text"
							maxLength={19}
							value={cardNumber}
							placeholder="Enter Credit Card Number"
							onChange={(e) => validateCardNumber(e.target.value)}
							className="flex-grow w-4 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:focus:border-purple-400 dark:focus:ring-purple-400 bg-white text-black border-gray-300 focus:border-purple-500 focus:ring-purple-500 focus:outline-none focus:ring-1"
						/>
						{cardError && (
							<CircleAlert className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-6 h-6" />
						)}
					</div>
				</div>
				<button
					onClick={generateUPIIds}
					className="generate-btn w-full mb-6 rounded-lg p-3 dark:bg-purple-600 dark:hover:bg-purple-700 bg-purple-600 hover:bg-purple-700 text-white dark:text-gray-100 transition-colors duration-200"
				>
					Generate UPI IDs
				</button>

				<div className="generated-upi-ids overflow-x-auto mb-16">
					<div className="text-xl font-bold text-purple-800 dark:text-purple-300">
						Generated UPI IDs:
					</div>

					{tableVisible && (
						<table className="min-w-full border-collapse bg-white dark:bg-gray-800 mt-6">
							<thead>
								<tr>
									<th className="border-b-2 border-gray-400 dark:border-gray-700 p-4 text-left">
										Bank
									</th>
									<th className="border-b-2 border-gray-400 dark:border-gray-700 p-4 text-left">
										UPI ID
									</th>
								</tr>
							</thead>
							<tbody>
								{generatedUPIIds.map(
									({ bank, upiId, strikethrough, disabled }) => (
										<tr key={bank}>
											<td className="border-b border-gray-400 dark:border-gray-700 p-4">
												{bank}
											</td>
											<td className="border-b border-gray-400 dark:border-gray-700 p-4">
												<div className="flex flex-col sm:flex-row sm:justify-between">
													<div
														className={`mb-2 mr-2 sm:mb-0 ${
															strikethrough ? "line-through" : ""
														}`}
													>
														{upiId}
													</div>
													{/* Buttons - Flex container with wrap */}
													<div className="flex flex-wrap gap-2">
														<button
															className="rounded-md text-black border-2 border-gray-400 bg-white dark:text-gray-300 dark:bg-gray-600 dark:border-gray-600 dark:hover:bg-gray-600 flex items-center p-1"
															onClick={() => copyToClipboard(upiId)}
															disabled={disabled}
														>
															<Copy className="w-4 h-4 mr-1" />{" "}
															{copiedUPIId === upiId ? "Copied" : "Copy"}
														</button>

														<button
															className="pay-btn rounded-md text-black border-2 border-gray-400 bg-white dark:text-gray-300 dark:bg-gray-600 dark:border-gray-600 dark:hover:bg-gray-600 flex items-center p-1"
															disabled={disabled}
														>
															<a
																href={`upi://pay?pa=${upiId}&pn=${bank}&cu=INR`}
															>
																<img
																	className="w-10 mx-2"
																	src={isDarkMode ? gpayLogoDark : gpayLogo}
																	alt="GPay Logo"
																/>
															</a>
														</button>
													</div>
												</div>
											</td>
										</tr>
									)
								)}
							</tbody>
						</table>
					)}
				</div>

				<Caution />

				<UpiFormats />
			</div>
		</main>
	);
}
