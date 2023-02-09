import ProtectedRoute from "../components/ProtectedRoute";

const DashboardPage = () => {
    return (
        <ProtectedRoute>
            <div className="container flex py-2 mx-auto">
                <div className="px-12 py-24 mx-auto mt-24 overflow-y-hidden text-white">
                    <h2 className="text-2xl font-semibold">You are logged in!</h2>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default DashboardPage;