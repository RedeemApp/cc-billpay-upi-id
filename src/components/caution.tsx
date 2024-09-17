import { AlertTriangle } from "lucide-react";

export default function Security() {
	return (
		<div className="caution-label mb-6 rounded-lg border-2 border-red-400 dark:bg-red-900 dark:border-red-800 dark:text-red-100 p-4">
			<div className="caution-heading flex items-center gap-2">
				<AlertTriangle className="h-6 w-6 mb-2 text-red-600 dark:text-white" />
				<div className="text-lg font-bold mb-2 text-red-600 dark:text-white">
					Caution:
				</div>
			</div>
			<div className="caution-description text-sm text-red-600 dark:text-white">
				Please note that these UPI IDs are generated with best effort and should
				be checked for accuracy before making any payment. We will not be held
				responsible for any losses incurred due to incorrect UPI IDs generated
				by this tool.
			</div>
		</div>
	);
}
