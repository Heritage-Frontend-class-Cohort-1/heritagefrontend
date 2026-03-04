import { useState } from "react";
import { Upload, Heart, Send, Copy, Check, Building, Smartphone, ArrowRight, Sparkles } from "lucide-react";

const colors = {
  deepNavy: "#0B1B3F",
  gold: "#FFD700",
  softCream: "#FFF4E1",
  offWhite: "#F8F8F8",
  lightBlue: "#E8F0FE",
  darkGold: "#E6C200",
};

const GivingConfirmation = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Tithe");
  const [reference, setReference] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const categories = ["Tithe", "Offering", "Building Fund", "Missions", "Welfare", "Other"];
  
  const churchAccount = {
    bank: "UBA Bank",
    accountName: "RCCG The Lord's Heritage House",
    accountNumber: "1028674844",
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= 5 * 1024 * 1024) {
      setFile(selectedFile);
    } else if (selectedFile) {
      alert("File size must be less than 5MB");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(churchAccount.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload your payment receipt");
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: colors.softCream }}>
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.gold, filter: "blur(100px)" }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.deepNavy, filter: "blur(100px)" }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 right-10 text-4xl animate-bounce z-0">💝</div>
      <div className="absolute bottom-20 left-10 text-3xl animate-pulse z-0">✨</div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-8">
        {!submitted ? (
          <div className="w-full max-w-5xl">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center space-x-2 mb-4">
                <Sparkles className="h-6 w-6" style={{ color: colors.gold }} />
                <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: colors.deepNavy }}>Bless Your Church</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: colors.deepNavy }}>
                Give with <span style={{ color: colors.gold }}>Joy</span>
              </h1>
              <p className="text-gray-600 text-lg">Your generosity makes a difference</p>
            </div>

            {/* Main Card Container */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left Side - Church Details Card */}
              <div className="lg:col-span-2">
                <div
                  className="rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm"
                  style={{ 
                    backgroundColor: colors.offWhite,
                    border: `1px solid ${colors.gold}20`
                  }}
                >
                  {/* Card Header */}
                  <div 
                    className="p-6 text-center relative overflow-hidden"
                    style={{ backgroundColor: colors.deepNavy }}
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10" style={{ backgroundColor: colors.gold }}></div>
                    <Building className="h-8 w-8 mx-auto mb-3" style={{ color: colors.gold }} />
                    <h2 className="text-xl font-bold" style={{ color: colors.gold }}>Church Account</h2>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-6">
                    {/* Bank Info */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.deepNavy + '80' }}>Bank</p>
                      <p className="text-2xl font-bold" style={{ color: colors.deepNavy }}>
                        {churchAccount.bank}
                      </p>
                    </div>

                    {/* Account Name */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.deepNavy + '80' }}>Account Name</p>
                      <div className="p-4 rounded-2xl" style={{ backgroundColor: colors.lightBlue }}>
                        <p className="font-semibold text-sm" style={{ color: colors.deepNavy }}>
                          {churchAccount.accountName}
                        </p>
                      </div>
                    </div>

                    {/* Account Number - Enhanced */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.deepNavy + '80' }}>Account Number</p>
                      <div 
                        className="p-5 rounded-2xl flex items-center justify-between group cursor-pointer transition-all hover:shadow-lg"
                        style={{ 
                          backgroundColor: colors.gold + '15',
                          border: `2px solid ${colors.gold}40`
                        }}
                        onClick={copyToClipboard}
                      >
                        <span className="text-3xl font-mono font-bold tracking-widest" style={{ color: colors.deepNavy }}>
                          {churchAccount.accountNumber}
                        </span>
                        <div 
                          className="p-3 rounded-xl transition-all group-hover:scale-110"
                          style={{ 
                            backgroundColor: copied ? colors.gold : colors.offWhite,
                            border: `2px solid ${colors.gold}`
                          }}
                        >
                          {copied ? (
                            <Check className="h-5 w-5" style={{ color: colors.deepNavy }} />
                          ) : (
                            <Copy className="h-5 w-5" style={{ color: colors.deepNavy }} />
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-center mt-2" style={{ color: colors.deepNavy + '80' }}>
                        {copied ? "✓ Copied!" : "Click to copy"}
                      </p>
                    </div>

                    {/* Reference Note */}
                    <div 
                      className="p-4 rounded-2xl border-l-4"
                      style={{ 
                        backgroundColor: colors.softCream,
                        borderLeftColor: colors.gold
                      }}
                    >
                      <p className="text-sm font-medium" style={{ color: colors.deepNavy }}>
                        💡 <strong>Tip:</strong> Use your name as reference
                      </p>
                    </div>

                    {/* Help Section */}
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-center mb-2" style={{ color: colors.deepNavy + '80' }}>Need help?</p>
                      <div className="flex items-center justify-center space-x-2">
                        <Smartphone className="h-4 w-4" style={{ color: colors.gold }} />
                        <a 
                          href="tel:+2349059156800"
                          className="font-semibold hover:underline"
                          style={{ color: colors.deepNavy }}
                        >
                          +234 905 915 6800
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div 
                  className="mt-6 p-4 rounded-2xl text-center"
                  style={{ 
                    backgroundColor: colors.lightBlue,
                    border: `2px solid ${colors.gold}40`
                  }}
                >
                  <p className="text-sm font-medium" style={{ color: colors.deepNavy }}>
                    🔒 Your information is secure and confidential
                  </p>
                </div>
              </div>

              {/* Right Side - Form Card */}
              <div className="lg:col-span-3">
                <div
                  className="rounded-3xl shadow-2xl p-8 backdrop-blur-sm"
                  style={{ 
                    backgroundColor: colors.offWhite,
                    border: `1px solid ${colors.gold}20`
                  }}
                >
                  <h2 className="text-2xl font-bold mb-8" style={{ color: colors.deepNavy }}>
                    Confirm Your Gift
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Amount Input */}
                    <div>
                      <label className="block text-sm font-semibold mb-3" style={{ color: colors.deepNavy }}>
                        💰 Gift Amount (₦)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          onFocus={() => setFocusedField('amount')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Enter amount"
                          required
                          className="w-full px-6 py-4 text-lg font-semibold rounded-2xl outline-none transition-all"
                          style={{ 
                            backgroundColor: colors.softCream,
                            color: colors.deepNavy,
                            border: focusedField === 'amount' ? `3px solid ${colors.gold}` : `2px solid ${colors.gold}20`
                          }}
                        />
                        {amount && (
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: colors.gold }}>
                            ₦{parseFloat(amount).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Category and Date Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Category */}
                      <div>
                        <label className="block text-sm font-semibold mb-3" style={{ color: colors.deepNavy }}>
                          📂 Category
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          onFocus={() => setFocusedField('category')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-6 py-4 rounded-2xl outline-none transition-all appearance-none cursor-pointer font-medium"
                          style={{ 
                            backgroundColor: colors.softCream,
                            color: colors.deepNavy,
                            border: focusedField === 'category' ? `3px solid ${colors.gold}` : `2px solid ${colors.gold}20`,
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%230B1B3F' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 1rem center',
                            paddingRight: '2.5rem'
                          }}
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Date */}
                      <div>
                        <label className="block text-sm font-semibold mb-3" style={{ color: colors.deepNavy }}>
                          📅 Date
                        </label>
                        <input
                          type="date"
                          value={paymentDate}
                          onChange={(e) => setPaymentDate(e.target.value)}
                          onFocus={() => setFocusedField('date')}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="w-full px-6 py-4 rounded-2xl outline-none transition-all font-medium"
                          style={{ 
                            backgroundColor: colors.softCream,
                            color: colors.deepNavy,
                            border: focusedField === 'date' ? `3px solid ${colors.gold}` : `2px solid ${colors.gold}20`
                          }}
                        />
                      </div>
                    </div>

                    {/* Reference */}
                    <div>
                      <label className="block text-sm font-semibold mb-3" style={{ color: colors.deepNavy }}>
                        📝 Reference (Optional)
                      </label>
                      <input
                        type="text"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        onFocus={() => setFocusedField('reference')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Transaction ID or your name"
                        className="w-full px-6 py-4 rounded-2xl outline-none transition-all"
                        style={{ 
                          backgroundColor: colors.softCream,
                          color: colors.deepNavy,
                          border: focusedField === 'reference' ? `3px solid ${colors.gold}` : `2px solid ${colors.gold}20`
                        }}
                      />
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-semibold mb-3" style={{ color: colors.deepNavy }}>
                        📸 Upload Receipt
                      </label>
                      <div 
                        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${file ? 'border-solid' : 'border-dashed'}`}
                        style={{ 
                          borderColor: file ? colors.gold : colors.gold + '40',
                          backgroundColor: file ? colors.gold + '10' : colors.softCream
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="receipt"
                          required
                        />
                        <label htmlFor="receipt" className="cursor-pointer block">
                          <div className="flex justify-center mb-3">
                            <div 
                              className="p-4 rounded-full"
                              style={{ backgroundColor: colors.gold + '20' }}
                            >
                              <Upload className="h-8 w-8" style={{ color: file ? colors.gold : colors.deepNavy }} />
                            </div>
                          </div>
                          <p className="text-sm font-semibold" style={{ color: colors.deepNavy }}>
                            {file ? '✓ ' + file.name : 'Click to upload receipt'}
                          </p>
                          <p className="text-xs mt-2" style={{ color: colors.deepNavy + '80' }}>
                            JPG, PNG or PDF (Max 5MB)
                          </p>
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading || !amount || !paymentDate || !file}
                      className="w-full font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg group hover:shadow-xl active:scale-95"
                      style={{ 
                        backgroundColor: colors.gold,
                        color: colors.deepNavy
                      }}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          <span>Submit Confirmation</span>
                          <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Success Card - Enhanced */
          <div className="w-full max-w-md">
            <div
              className="rounded-3xl shadow-2xl p-12 text-center backdrop-blur-sm relative overflow-hidden"
              style={{ 
                backgroundColor: colors.offWhite,
                border: `2px solid ${colors.gold}`
              }}
            >
              {/* Success Background Animation */}
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5" style={{ backgroundColor: colors.gold }}></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-5" style={{ backgroundColor: colors.deepNavy }}></div>

              <div className="relative z-10">
                {/* Heart Icon */}
                <div className="inline-block p-6 rounded-full mb-6 animate-bounce" style={{ backgroundColor: colors.gold + '20' }}>
                  <Heart className="h-16 w-16" style={{ color: colors.gold }} fill={colors.gold} />
                </div>

                {/* Success Message */}
                <h2 className="text-3xl font-bold mb-3" style={{ color: colors.deepNavy }}>
                  Thank You!
                </h2>
                <p className="text-lg mb-2" style={{ color: colors.deepNavy }}>
                  Your gift of
                </p>
                <p className="text-4xl font-bold mb-4" style={{ color: colors.gold }}>
                  ₦{parseFloat(amount).toLocaleString()}
                </p>

                {/* Details */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-6" style={{ backgroundColor: colors.softCream }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: colors.deepNavy }}>
                    Category: <span style={{ color: colors.gold }}>{category}</span>
                  </p>
                  <p className="text-xs" style={{ color: colors.deepNavy + '80' }}>
                    We'll verify your receipt shortly and send you a confirmation.
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm mb-8" style={{ color: colors.deepNavy + '80' }}>
                  ✨ Your generosity makes a real difference in our community.
                </p>

                {/* Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setAmount("");
                      setFile(null);
                      setCategory("Tithe");
                      setReference("");
                      setPaymentDate("");
                    }}
                    className="w-full px-8 py-3 rounded-2xl font-bold transition-all hover:shadow-lg active:scale-95"
                    style={{ 
                      backgroundColor: colors.gold,
                      color: colors.deepNavy
                    }}
                  >
                    Make Another Gift
                  </button>
                  <button
                    onClick={() => window.location.href = "/"}
                    className="w-full px-8 py-3 rounded-2xl font-bold transition-all hover:shadow-lg active:scale-95"
                    style={{ 
                      backgroundColor: colors.deepNavy + '20',
                      color: colors.deepNavy,
                      border: `2px solid ${colors.deepNavy}`
                    }}
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GivingConfirmation;