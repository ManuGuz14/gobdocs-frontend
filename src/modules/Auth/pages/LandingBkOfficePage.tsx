export const LandingBkOfficePage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-10 max-w-md w-full text-center border-t-4 border-gobdocs-primary">
                <div className="mb-6 flex justify-center">
                    <svg className="w-20 h-20 text-gobdocs-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">BackOffice</h1>
                <h2 className="text-xl font-semibold text-gray-600 mb-6">Work in Progress 🚧</h2>
                <p className="text-gray-500 mb-8">
                    The operator portal functionalities are currently under development. Please check back later!
                </p>
            </div>
        </div>
    );
};
