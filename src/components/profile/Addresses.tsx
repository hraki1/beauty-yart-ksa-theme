import { getAddresses } from "@/lib/axios/addressAxios";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../UI/SpinnerLoading";
import { motion } from "framer-motion";
import AddressInfo from "./AddressInfo";

const AddressesInfo = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
  });
  

  console.log(data);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Spinner />
          <p className="text-slate-600 font-medium" style={{ fontFamily: 'Europa, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            Loading your addresses...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white overflow-hidden"
        style={{ fontFamily: 'Europa, -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        {/* Header Section */}
        <div className="p-8 border-b-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
          <h2 className="text-2xl font-bold text-slate-800 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
            Error Loading Addresses
          </h2>
        </div>

        {/* Error Content */}
        <div className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 border-l-4 border-red-500">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-red-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                {error.name || 'Connection Error'}
              </h3>
              <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                {error.message || 'Failed to load addresses. Please check your connection and try again.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => refetch()}
            className="px-8 py-3 bg-gradient-to-r from-gray-500 to-amber-500 hover:from-gray-600 hover:to-amber-600 text-white font-medium transition-all duration-300 border-l-4 border-gray-400"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  if (data?.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white overflow-hidden"
        style={{ fontFamily: 'Europa, -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        {/* Header Section */}
        <div className="p-8 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-amber-50">
          <h2 className="text-2xl font-bold text-slate-800 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
            Delivery Addresses
          </h2>
        </div>

        {/* Empty State Content */}
        <div className="p-12 text-center space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 border-l-4 border-slate-300">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold text-slate-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                No Addresses Yet
              </h3>
              <p className="text-slate-600 max-w-lg mx-auto leading-relaxed text-lg">
                You haven&apos;t added any delivery addresses yet. Add your first address to make ordering easier and faster.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button className="px-8 py-4 bg-gradient-to-r from-gray-500 to-amber-500 hover:from-gray-600 hover:to-amber-600 text-white font-medium transition-all duration-300 border-l-4 border-gray-400 text-lg">
              Add Your First Address
            </button>
            
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 text-left max-w-2xl mx-auto">
              <h4 className="font-semibold text-blue-800 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Why add addresses?
              </h4>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Faster checkout process
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Save multiple delivery locations
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Easy address management
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white overflow-hidden space-y-0"
      style={{ fontFamily: 'Europa, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      {/* Header Section */}
      <div className="p-8 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-amber-50 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Playfair Display, serif' }}>
            Delivery Addresses
          </h2>
          <p className="text-slate-600 mt-1">
            Manage your saved delivery locations
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 border-l-2 border-slate-300">
            {data?.length} {data?.length === 1 ? 'Address' : 'Addresses'}
          </span>
          <button className="px-4 py-2 bg-gradient-to-r from-gray-500 to-black hover:from-gray-600 hover:to-black text-white font-medium transition-all duration-300 border-l-4 border-gray-400 text-sm">
            Add New
          </button>
        </div>
      </div>

      {/* Addresses List */}
      <div className="divide-y-2 divide-slate-100">
        {data?.map((a, index) => (
          <div key={a.id ?? index} className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-300">
            <AddressInfo address={a} />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AddressesInfo;