import React, { useState } from "react";
import LoginPage from "./LoginPage"; 

function App() {
  const [user, setUser] = useState(null); // Stores { username, role }
  const [accountId, setAccountId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [searchBy, setSearchBy] = useState("account_id");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");

    const searchValue = searchBy === "account_id" ? accountId : customerName;

    try {
      // Note: Ensure the URL matches your Python backend (port 5000)
      const response = await fetch("http://172.16.9.29:5000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          field: searchBy, 
          value: searchValue, 
          role: user.role 
        }),
      });

      console.log("📡 Response Status:", response.status);

      if (response.status === 404) {
        setResult("SEARCH_UNSUCCESSFUL");
      } else if (response.ok) {
        const jsonResponse = await response.json();
        console.log("✅ Success! Raw JSON:", jsonResponse);
        
        // Save the whole JSON response. 
        // We will decide what to display in the UI section below.
        setResult(jsonResponse); 
      } else {
        setError(`ERROR: SYSTEM_FAILURE_CODE_${response.status}`);
      }
    } catch (err) {
      console.error("🚨 Connection Error:", err);
      setError("CONNECTION_FAILED: BACKEND_OFFLINE");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <LoginPage onLogin={(userData) => setUser(userData)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-4 font-mono">
      {/* User Info Header */}
      <div className="mb-4 text-xs text-blue-500/50 flex gap-4 uppercase tracking-tighter">
        <span>USER: {user.username}</span>
        <span>ACCESS_LEVEL: {user.role}</span>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-blue-500/30 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.15)] overflow-hidden">
        
        <div className="bg-slate-800/50 p-6 border-b border-blue-500/20">
          <h1 className="text-3xl font-bold text-center tracking-widest text-blue-400 uppercase">Secure Vault</h1>
          <p className="text-center text-xs text-blue-500/60 mt-2">Database Access Terminal</p>
        </div>

        <form onSubmit={handleSearch} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-blue-400 mb-1 ml-1">Search By</label>
              <select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                className="w-full bg-slate-950 border border-blue-900 rounded px-4 py-2 text-blue-100 outline-none focus:border-blue-500 transition-colors"
              >
                <option value="account_id">Account ID</option>
                <option value="customer_name">Customer Name</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase text-blue-400 mb-1 ml-1">
                {searchBy === "account_id" ? "Account ID" : "Customer Name"}
              </label>
              <input
                type="text"
                value={searchBy === "account_id" ? accountId : customerName}
                onChange={(e) => searchBy === "account_id" ? setAccountId(e.target.value) : setCustomerName(e.target.value)}
                className="w-full bg-slate-950 border border-blue-900 focus:border-blue-500 rounded px-4 py-2 text-blue-100 outline-none transition-colors"
                required
                placeholder="Enter search query..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded font-bold uppercase tracking-widest transition-all 
              ${loading ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"}`}
          >
            {loading ? "Decrypting..." : "Search Database"}
          </button>
        </form>

        {/* --- RESULTS SECTION --- */}
        {(result || error) && (
          <div className="px-8 pb-8">
            <div className="p-4 rounded border border-blue-500/20 bg-blue-500/5">
              
              {error && (
                <p className="text-red-500 text-sm font-bold animate-pulse">! {error}</p>
              )}

              {result === "SEARCH_UNSUCCESSFUL" && (
                <p className="text-red-400 italic text-sm font-bold">✗ SEARCH_UNSUCCESSFUL: RECORD_NOT_FOUND</p>
              )}

              {/* Successful Response Handler */}
              {result && typeof result === "object" && result.status === "ok" && (
                <div className="space-y-3">
                  <p className="text-green-400 text-sm font-bold border-b border-green-900/30 pb-1">
                    ✓ {result.message.toUpperCase()}
                  </p>
                  
                  {/* ADMIN VIEW: Display the 'data' object if it exists */}
                  {result.data ? (
                    <div className="space-y-2">
                      {Object.entries(result.data).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-[10px] leading-tight border-b border-blue-500/5 pb-1">
                          <span className="text-blue-500/70 uppercase">{key.replace(/_/g, " ")}:</span>
                          <span className="text-blue-100 text-right ml-4">
                            {typeof value === "number" ? value.toLocaleString() : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* USER VIEW: Minimal message because 'data' is missing from response */
                    <p className="text-blue-400/60 text-[10px] italic">
                      Access Restricted: Decrypted content hidden for standard users.
                    </p>
                  )}
                </div>
              )}

            </div>
          </div>
        )}
      </div>
      
      <button 
        onClick={() => {
          setUser(null);
          setResult(null);
          setAccountId("");
          setCustomerName("");
        }} 
        className="mt-6 text-[10px] text-blue-500/40 hover:text-blue-400 transition tracking-widest"
      >
        [ TERMINATE_SESSION_LOGOUT ]
      </button>
    </div>
  );
}

export default App;