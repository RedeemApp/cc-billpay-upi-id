const upiFormats = [
	{
		status: "working",
		bank: "Axis",
		format: "CC.91[10 digit mobile number][last 4 digits of card]@axisbank",
	},
	{
		status: "working",
		bank: "ICICI",
		format: "ccpay[16 digit card number]@icici",
	},
	{
		status: "working",
		bank: "AU Bank",
		format: "AUCC[10 digit mobile number][last 4 digits of card]@AUBANK",
	},
	{
		status: "working",
		bank: "IDFC",
		format: "[16 digit card number].cc@idfcbank",
	},
	{ status: "working", bank: "AMEX", format: "AEBC[15 digit card number]@SC" },
	{
		status: "working",
		bank: "SBI",
		format: "Sbicard[16 digit card number]@SBI (Not working for me)",
	},
];

export default function Security() {
	return (
		<div className="generated-upi-formats overflow-x-auto">
			<div className="text-xl font-bold text-purple-800 dark:text-purple-300">
				UPI ID Formats:
			</div>
			<table className="min-w-full border-collapse bg-white dark:bg-gray-800">
				<thead>
					<tr>
						<th className="border-b-2 border-gray-400 dark:border-gray-700 p-4 text-left">
							Bank
						</th>
						<th className="border-b-2 border-gray-400 dark:border-gray-700 p-4 text-left">
							UPI Format
						</th>
					</tr>
				</thead>
				<tbody>
					{upiFormats.map((format, index) => (
						<tr key={index}>
							<td className="border-b dark:border-gray-700 p-4 font-medium dark:text-gray-300">
								{format.bank}
							</td>
							<td className="border-b dark:border-gray-700 p-4 dark:text-gray-300">
								{format.format}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
