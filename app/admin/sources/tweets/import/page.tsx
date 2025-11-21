import CSVUploader from "@/components/admin/CSVUploader";
import TweetImportForm from "@/components/admin/TweetImportForm";

export default function ImportPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Import Tweets</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Add tweets to the system via CSV upload or manual entry.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                    <CSVUploader />
                </div>
                <div>
                    <TweetImportForm />
                </div>
            </div>
        </div>
    );
}
