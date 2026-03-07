import { useState } from "react";
import { Upload, Heart, Send, Copy, Check, Building, Phone } from "lucide-react";

const colors = {
  navy:    "#0f1e44",
  gold:    "#e9c94a",
  cream:   "#fdfaf4",
  white:   "#ffffff",
  gray:    "#f8fafc",
  muted:   "#64748b",
  border:  "#e2e8f0",
};

const GivingConfirmation = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Tithe");
  const [reference, setReference] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState(null);

  const categories = ["Tithe", "Offering", "Building Fund", "Missions", "Welfare", "Other"];

  const church = {
    bank: "UBA Bank",
    name: "RCCG The Lord's Heritage House",
    number: "1028674844",
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f && f.size <= 5 * 1024 * 1024) setFile(f);
    else if (f) alert("File must be under 5MB");
  };

  const copyAccount = () => {
    navigator.clipboard.writeText(church.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload your payment receipt");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1400);
  };

  const reset = () => {
    setSubmitted(false);
    setAmount("");
    setCategory("Tithe");
    setReference("");
    setDate("");
    setFile(null);
  };

  return (
    <div 
      className="
        min-h-screen 
        bg-gradient-to-br from-[#fdfaf4] to-[#f8fafc] 
        pt-16 sm:pt-20 md:pt-24 lg:pt-28 
        px-4 pb-10 sm:pb-12
      "
    >
      <div className="mx-auto w-full max-w-5xl">
        {!submitted ? (
          <>
            {/* Header – with extra top margin for breathing room */}
            <div className="text-center mt-6 sm:mt-8 md:mt-10 lg:mt-12 mb-10 md:mb-14">
              <h1 className="text-4xl sm:text-5xl font-bold text-[#0f1e44] tracking-tight">
                Give <span className="text-[#e9c94a]">Joyfully</span>
              </h1>
              <p className="mt-4 text-lg text-[#64748b]">
                Your generosity changes lives
              </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-7 lg:gap-8">
              {/* Form – comes first on mobile */}
              <div className="lg:col-span-3 order-1 lg:order-2">
                <div className="bg-white rounded-3xl shadow-xl border border-[#e9c94a]/10 p-7 md:p-9">
                  <h2 className="text-2xl font-bold text-[#0f1e44] mb-8">
                    Confirm Your Giving
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-semibold text-[#0f1e44] mb-2">
                        Amount (₦)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          onFocus={() => setFocused("amount")}
                          onBlur={() => setFocused(null)}
                          placeholder="0"
                          required
                          className={`w-full px-5 py-4 rounded-2xl bg-[#fdfaf4] border-2 text-lg font-medium transition-all
                            ${focused === "amount"
                              ? "border-[#e9c94a] shadow-sm shadow-[#e9c94a]/30"
                              : "border-gray-200 hover:border-gray-300"}`}
                        />
                        {amount && (
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#e9c94a] font-semibold">
                            ₦{Number(amount).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Category + Date */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[#0f1e44] mb-2">
                          Category
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          onFocus={() => setFocused("cat")}
                          onBlur={() => setFocused(null)}
                          className={`w-full px-5 py-4 rounded-2xl bg-[#fdfaf4] border-2 font-medium appearance-none cursor-pointer
                            ${focused === "cat" ? "border-[#e9c94a] shadow-sm shadow-[#e9c94a]/30" : "border-gray-200 hover:border-gray-300"}`}
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath fill='%230f1e44' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
                            backgroundPosition: "right 1.2rem center",
                            backgroundRepeat: "no-repeat",
                            paddingRight: "2.8rem",
                          }}
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#0f1e44] mb-2">
                          Date of Payment
                        </label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          onFocus={() => setFocused("date")}
                          onBlur={() => setFocused(null)}
                          required
                          className={`w-full px-5 py-4 rounded-2xl bg-[#fdfaf4] border-2 font-medium
                            ${focused === "date" ? "border-[#e9c94a] shadow-sm shadow-[#e9c94a]/30" : "border-gray-200 hover:border-gray-300"}`}
                        />
                      </div>
                    </div>

                    {/* Reference */}
                    <div>
                      <label className="block text-sm font-semibold text-[#0f1e44] mb-2">
                        Reference (optional)
                      </label>
                      <input
                        type="text"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="Your name or transaction ID"
                        className="w-full px-5 py-4 rounded-2xl bg-[#fdfaf4] border-2 border-gray-200 hover:border-gray-300 focus:border-[#e9c94a] focus:shadow-sm focus:shadow-[#e9c94a]/30 transition-all"
                      />
                    </div>

                    {/* Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-[#0f1e44] mb-2">
                        Upload Payment Proof
                      </label>
                      <label
                        htmlFor="receipt-upload"
                        className={`block p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all
                          ${file ? "border-[#e9c94a] bg-[#e9c94a]/5" : "border-gray-300 hover:border-[#e9c94a]/60 bg-white"}`}
                      >
                        <input
                          id="receipt-upload"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFile}
                          className="hidden"
                          required
                        />
                        <div className="mx-auto w-14 h-14 rounded-full bg-[#e9c94a]/10 flex items-center justify-center mb-4">
                          <Upload className="h-7 w-7 text-[#e9c94a]" />
                        </div>
                        <p className="font-medium text-[#0f1e44]">
                          {file ? file.name : "Click or drag receipt here"}
                        </p>
                        <p className="text-sm text-[#64748b] mt-1">
                          JPG, PNG, PDF • max 5 MB
                        </p>
                      </label>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading || !amount || !date || !file}
                      className="w-full py-4 px-6 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2.5 transition-all
                        bg-[#e9c94a] text-[#0f1e44] hover:bg-[#d9b53a] disabled:opacity-50 disabled:cursor-not-allowed
                        shadow-md hover:shadow-lg active:scale-[0.98]"
                    >
                      {loading ? (
                        <>
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          <span>Processing…</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>Confirm Gift</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Bank Details – comes second on mobile */}
              <div className="lg:col-span-2 order-2 lg:order-1">
                <div className="bg-white rounded-3xl shadow-xl border border-[#e9c94a]/10 overflow-hidden">
                  <div className="bg-[#0f1e44] px-7 py-6 text-center">
                    <Building className="h-8 w-8 text-[#e9c94a] mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-[#e9c94a]">
                      Church Bank Details
                    </h3>
                  </div>

                  <div className="p-7 space-y-6">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-[#64748b] mb-1">
                        Bank
                      </div>
                      <div className="text-2xl font-bold text-[#0f1e44]">
                        {church.bank}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-[#64748b] mb-1">
                        Account Name
                      </div>
                      <div className="p-4 bg-[#fdfaf4] rounded-2xl text-[#0f1e44] font-medium">
                        {church.name}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-[#64748b] mb-1">
                        Account Number
                      </div>
                      <button
                        onClick={copyAccount}
                        className="w-full p-5 bg-[#e9c94a]/5 rounded-2xl flex items-center justify-between group hover:bg-[#e9c94a]/10 transition-all border-2 border-[#e9c94a]/20"
                      >
                        <span className="text-2xl md:text-3xl font-mono font-bold tracking-wide text-[#0f1e44]">
                          {church.number}
                        </span>
                        <div className={`p-3 rounded-xl ${copied ? "bg-[#e9c94a]" : "bg-white"} border-2 border-[#e9c94a]`}>
                          {copied ? (
                            <Check className="h-5 w-5 text-[#0f1e44]" />
                          ) : (
                            <Copy className="h-5 w-5 text-[#0f1e44]" />
                          )}
                        </div>
                      </button>
                      <p className="text-center text-xs mt-2 text-[#64748b]">
                        {copied ? "✓ Copied!" : "Tap to copy"}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 text-center">
                      <p className="text-sm text-[#0f1e44] font-medium">
                        Use your full name as reference
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-[#e9c94a]" />
                      <a href="tel:+2349059156800" className="font-medium text-[#0f1e44] hover:underline">
                        +234 905 915 6800
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-5 bg-[#e9c94a]/5 rounded-2xl text-center text-sm font-medium text-[#0f1e44]">
                  🔒 Secure & confidential
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Success Screen */
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-12 text-center border border-[#e9c94a]/20">
              <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#e9c94a]/20 to-[#fdfaf4] flex items-center justify-center">
                <Heart className="h-14 w-14 text-[#e9c94a] fill-[#e9c94a]/90" />
              </div>

              <h2 className="text-4xl font-bold text-[#0f1e44] mb-4">
                Thank You!
              </h2>

              <p className="text-xl text-[#64748b] mb-3">
                Your gift of
              </p>
              <p className="text-5xl font-bold text-[#e9c94a] mb-8">
                ₦{Number(amount).toLocaleString()}
              </p>

              <div className="inline-block px-6 py-3 mb-8 rounded-full bg-[#e9c94a]/10 text-[#e9c94a] font-semibold">
                {category}
              </div>

              <p className="text-[#64748b] leading-relaxed mb-10">
                We’ll verify your receipt shortly and send a confirmation.<br />
                Your kindness is making a real difference.
              </p>

              <div className="grid gap-4">
                <button
                  onClick={reset}
                  className="w-full py-4 px-6 rounded-2xl font-semibold text-lg bg-[#e9c94a] text-[#0f1e44] hover:bg-[#d9b53a] shadow-md hover:shadow-lg transition-all"
                >
                  Give Again
                </button>
                <button
                  onClick={() => window.location.href = "/"}
                  className="w-full py-4 px-6 rounded-2xl font-semibold text-lg border-2 border-[#0f1e44]/30 text-[#0f1e44] hover:bg-[#0f1e44]/5 transition-all"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GivingConfirmation;