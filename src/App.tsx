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
import QRCode from "react-qr-code";

export default function UPIIDGenerator() {
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [cardNumber, setCardNumber] = useState("");
	const [phoneError, setPhoneError] = useState(false);
	const [cardError, setCardError] = useState(false);
	const [cardType, setCardType] = useState<string | null>(null); 
	const [generatedUPIIds, setGeneratedUPIIds] = useState<
		{ bank: string; upiId: string; strikethrough: boolean; disabled: boolean }[]
	>([]);
	const [tableVisible, setTableVisible] = useState(false);
	const [copiedUPIId, setCopiedUPIId] = useState<string | null>(null);
    // Create local state for overlay
    const [showOverlay, setShowOverlay] = useState(false);
    const [overlayProps, setOverlayProps] = useState({upiString: '', bank: '', upiId: ''});


    // Add this method inside your component
    function openOverlay(bank: string, upiId: string) {
        const upiString = `upi://pay?pa=${upiId}&pn=${bank}&cu=INR`
        setOverlayProps({upiString, bank, upiId});
        setShowOverlay(true);
    }

    // Add this method inside your component
    function closeOverlay() {
        setShowOverlay(false);
    }

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

		const network = getCardNetwork(value);
		if(network!=null) {
			setCardType(network);
		}
		else {
			setCardType(null);
			setCardError(true);
		}
		setCardError(!isLuhnValid || !isLengthValid);
	};

	function getCardNetwork(cardNumber: string): string | null {
		const firstTwo = parseInt(cardNumber.slice(0, 2), 10);
		const firstSix = parseInt(cardNumber.slice(0, 6), 10);
		if (cardNumber[0] === '4') {
			return 'visa';
		}
		if ((firstTwo >= 51 && firstTwo <= 55) || (firstSix >= 2221 && firstSix <= 2720)) {
			return 'mastercard';
		}
		if (firstTwo === 34 || firstTwo === 37) {
			return 'amex'
		}
		if (firstTwo === 36) {
			return 'diners'
		}
		if ((firstTwo === 60 || firstTwo === 65 || firstTwo === 81 || firstTwo === 82)) {
			return 'rupay'
		}
		return null;
	}

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
					<div className="flex items-center">
                    <img className="mr-2 w-8 h-8 sm:w-12 sm:h-12" src="upi.svg" alt="UPI logo" />
					<div className="heading  sm:text-2xl font-bold text-purple-800 dark:text-purple-300">
						Pay Your Credit Card Balance via official UPI ID
					</div>
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
				<div className="sub-heading sm:text-xl text-purple-600 dark:text-purple-300 mb-6">
                An open-source and secure alternative to mainstream credit card balance payment apps.
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
							autoComplete="tel"
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
                            inputMode="numeric"
                            autoComplete="cc-number"
							onChange={(e) => validateCardNumber(e.target.value)}
							className="flex-grow w-4 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:focus:border-purple-400 dark:focus:ring-purple-400 bg-white text-black border-gray-300 focus:border-purple-500 focus:ring-purple-500 focus:outline-none focus:ring-1"
						/>
						{cardError ? (
								<CircleAlert className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-6 h-6" />
							) : (
								cardType && (
								<img
									src={`src/assets/${cardType}.png`} // Use the cardType to display the appropriate logo
									alt={`${cardType} logo`}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8"
							/>
							)
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
                                    <th className="border-b-2 border-gray-400 dark:border-gray-700 p-4 text-left hidden md:table-cell">
                                        QR code
                                    </th>
								</tr>
							</thead>
								{generatedUPIIds.map(
									({ bank, upiId, strikethrough, disabled }: { bank: string; upiId: string; strikethrough: boolean; disabled: boolean }) => {
                                         const upiString = `upi://pay?pa=${upiId}&pn=${bank}&cu=INR`
                                        return (
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
													> {upiId}
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
                                            <div className="hidden md:table-cell">
                                                        <td className="border-b border-gray-400 dark:border-gray-700 p-4">
                                                        <button onClick={() => openOverlay(upiId, bank)}>
                                                            <QRCode value={upiString} size={50} />
                                                        </button>
                                                        </td>
                                                    </div>
										</tr>
									);
                                })}
                        </table>
					)}
				</div>

                <div>
                    {showOverlay && (
                        <div id="overlay" className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-[rgb(185,185,185,0.97)] p-8 rounded-lg">
                            <div className="space-y-4">
                                <p className="text-center">{`${overlayProps.bank} / ${overlayProps.upiId}`}</p>
                                <QRCode value={overlayProps.upiString} size={300} />
                            </div>

                            <div className="flex justify-center mt-4">
                                <button
                                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                    onClick={closeOverlay}
                                >
                                    Close
                                </button>
                            </div>

                        </div>
                    )}
                </div>



				<Caution />

				<UpiFormats />

			</div>
		</main>
	);
}
