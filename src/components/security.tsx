import { Github } from "lucide-react";

export default function Security() {
	return (
		<div className="Security p-4 rounded-lg bg-gray-100 dark:bg-gray-700 mb-6">
			<h3 className="security-heading text-lg font-semibold mb-2 text-purple-800 dark:text-purple-300">
				Security First
			</h3>
			<ul className="list-disc list-inside space-y-1">
				<li className="text-black dark:text-gray-300">
					No data leaves your system.
				</li>
				<li className="list-item items-center text-black dark:text-gray-300">
					<span>Source code is publicly available on</span>
					<a
						href="https://github.com/RedeemApp/cc-billpay-upi-id"
						className="text-purple-600 inline-flex dark:text-purple-300 hover:underline items-center ml-1 "
					>
						<Github className="w-4 h-4 mr-1" />
						<span> GitHub.</span>
					</a>
				</li>
			</ul>
		</div>
	);
}
