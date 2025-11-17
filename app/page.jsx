"use client";

import { useEffect, useState } from "react";

const TABS = {
  DONORS: "DONORS",
  UNITS: "UNITS",
  REQUESTS: "REQUESTS",
  AGREEMENTS: "AGREEMENTS",
};

export default function Home() {
  const [activeTab, setActiveTab] = useState(TABS.DONORS);

  // Data states
  const [donors, setDonors] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [requests, setRequests] = useState([]);
  const [units, setUnits] = useState([]);
  const [stock, setStock] = useState([]);
  const [agreements, setAgreements] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form states
  const [donorForm, setDonorForm] = useState({
    donorId: "",
    name: "",
    age: "",
    gender: "",
    address: "",
    phone: "",
    bloodType: "",
  });

  const [healthForm, setHealthForm] = useState({
    donorId: "",
    recordDate: "",
    bloodPressure: "",
    hemoglobin: "",
    isEligible: "1",
  });

  const [requestForm, setRequestForm] = useState({
    requestId: "",
    hospitalId: "",
    reqBloodType: "",
    quantityUnits: "",
  });

  const [fulfillForm, setFulfillForm] = useState({
    requestId: "",
    bankId: "",
  });

  const [unitForm, setUnitForm] = useState({
    unitId: "",
    bankId: "",
    donorId: "",
    requestId: "",
    bloodType: "",
    status: "Available",
  });

  // INITIAL LOAD
  useEffect(() => {
    refreshDonors();
    refreshHealthRecords();
    refreshRequests();
    refreshUnits();
    refreshStock();
    refreshAgreements();
  }, []);

  // HELPERS
  function showMessage(text) {
    setMessage(text);
    setTimeout(() => setMessage(""), 4000);
  }

  // LOAD FUNCTIONS
  async function refreshDonors() {
    try {
      const res = await fetch("/api/donors");
      const data = await res.json();
      setDonors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  async function refreshHealthRecords() {
    try {
      const res = await fetch("/api/health-records");
      const data = await res.json();
      setHealthRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  async function refreshRequests() {
    try {
      const res = await fetch("/api/requests");
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  async function refreshUnits() {
    try {
      const res = await fetch("/api/units");
      const data = await res.json();
      setUnits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  async function refreshStock() {
    try {
      const res = await fetch("/api/stock");
      const data = await res.json();
      setStock(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  async function refreshAgreements() {
    try {
      const res = await fetch("/api/agreements");
      const data = await res.json();
      setAgreements(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  // FORM HANDLERS
  async function handleAddDonor(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...donorForm,
          age: Number(donorForm.age),
          donorId: Number(donorForm.donorId),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add donor");
      showMessage("Donor added successfully");
      setDonorForm({
        donorId: "",
        name: "",
        age: "",
        gender: "",
        address: "",
        phone: "",
        bloodType: "",
      });
      refreshDonors();
    } catch (err) {
      console.error(err);
      showMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddHealthRecord(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/health-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...healthForm,
          donorId: Number(healthForm.donorId),
          hemoglobin: healthForm.hemoglobin
            ? Number(healthForm.hemoglobin)
            : null,
          isEligible: healthForm.isEligible === "1",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add health record");
      showMessage("Health record added (via sp_AddHealthRecord)");
      setHealthForm({
        donorId: "",
        recordDate: "",
        bloodPressure: "",
        hemoglobin: "",
        isEligible: "1",
      });
      refreshHealthRecords();
    } catch (err) {
      console.error(err);
      showMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddRequest(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...requestForm,
          requestId: Number(requestForm.requestId),
          hospitalId: Number(requestForm.hospitalId),
          quantityUnits: Number(requestForm.quantityUnits),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add request");
      showMessage("Blood request created");
      setRequestForm({
        requestId: "",
        hospitalId: "",
        reqBloodType: "",
        quantityUnits: "",
      });
      refreshRequests();
    } catch (err) {
      console.error(err);
      showMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleFulfillRequest(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/requests/${fulfillForm.requestId}/fulfill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bankId: Number(fulfillForm.bankId) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fulfill request");
      showMessage("Request fulfilled via sp_FulfillBloodRequest");
      setFulfillForm({ requestId: "", bankId: "" });
      refreshRequests();
      refreshUnits();
      refreshStock();
    } catch (err) {
      console.error(err);
      showMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelRequest(id) {
    setLoading(true);
    try {
      const res = await fetch(`/api/requests/${id}/cancel`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel request");
      showMessage("Request cancel attempted (sp_CancelBloodRequest)");
      refreshRequests();
    } catch (err) {
      console.error(err);
      showMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddUnit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...unitForm,
          unitId: Number(unitForm.unitId),
          bankId: Number(unitForm.bankId),
          donorId: Number(unitForm.donorId),
          requestId: unitForm.requestId ? Number(unitForm.requestId) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add unit");
      showMessage("Blood unit added (trigger checks donor eligibility)");
      setUnitForm({
        unitId: "",
        bankId: "",
        donorId: "",
        requestId: "",
        bloodType: "",
        status: "Available",
      });
      refreshUnits();
      refreshStock();
    } catch (err) {
      console.error(err);
      showMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  // SUMMARY VALUES
  const totalDonors = donors.length;
  const pendingRequests = requests.filter((r) => r.Status === "Pending").length;
  const totalAvailableUnits = stock.reduce(
    (sum, s) => sum + Number(s.Total_Units_Available || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-slate-50 to-sky-50">
      {/* Top bar with theme toggle */}
      <header className="bg-gradient-to-r from-rose-600 via-red-600 to-red-700 text-white px-6 py-3 flex items-center justify-between shadow-md">
        <h1 className="font-semibold tracking-wide text-lg">
          BloodBankDB – Dashboard
        </h1>

        <div className="flex items-center gap-3">
          <span className="text-sm opacity-90 hidden sm:inline">
            Next.js + MySQL {loading ? "• Processing..." : "• Ready"}
          </span>

          {/* DaisyUI theme toggle */}
          <label className="swap swap-rotate cursor-pointer">
            {/* hidden checkbox controls the state */}
            <input
              type="checkbox"
              className="theme-controller"
              value="synthwave" // change to "dark" if you prefer dark mode
            />

            {/* sun icon */}
            <svg
              className="swap-off h-7 w-7 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg
              className="swap-on h-7 w-7 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-6 px-4">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg border border-rose-100 p-4">
            <div className="text-xs uppercase text-rose-500 mb-1">
              Total Donors
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {totalDonors}
            </div>
            <div className="text-xs text-slate-500">From DONOR table</div>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg border border-amber-100 p-4">
            <div className="text-xs uppercase text-amber-500 mb-1">
              Pending Requests
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {pendingRequests}
            </div>
            <div className="text-xs text-slate-500">
              Status = &apos;Pending&apos;
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg border border-emerald-100 p-4">
            <div className="text-xs uppercase text-emerald-500 mb-1">
              Available Units
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {totalAvailableUnits}
            </div>
            <div className="text-xs text-slate-500">
              From aggregate query on BLOOD_UNIT
            </div>
          </div>
        </div>

        {/* Flash message */}
        {message && (
          <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 px-4 py-2 text-sm text-blue-800 shadow-sm">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-4 flex gap-2 border-b border-slate-200">
          {Object.entries(TABS).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setActiveTab(value)}
              className={`px-3 py-2 text-sm border-b-2 rounded-t-md transition-colors ${
                activeTab === value
                  ? "border-rose-500 text-rose-600 font-semibold bg-rose-50"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              {value === TABS.DONORS && "Donors & Health"}
              {value === TABS.UNITS && "Blood Units & Stock"}
              {value === TABS.REQUESTS && "Requests"}
              {value === TABS.AGREEMENTS && "Agreements"}
            </button>
          ))}
        </div>

        {/* DONORS & HEALTH */}
        {activeTab === TABS.DONORS && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Add Donor */}
            <div className="bg-white/95 backdrop-blur rounded-xl shadow-md border border-slate-100 p-4">
              <h2 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wide">
                Add Donor
              </h2>
              <form className="space-y-2" onSubmit={handleAddDonor}>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Donor ID
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                    value={donorForm.donorId}
                    onChange={(e) =>
                      setDonorForm({ ...donorForm, donorId: e.target.value })
                    }
                    required
                    type="number"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Name
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                    value={donorForm.name}
                    onChange={(e) =>
                      setDonorForm({ ...donorForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      min="18"
                      className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                      value={donorForm.age}
                      onChange={(e) =>
                        setDonorForm({ ...donorForm, age: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Gender
                    </label>
                    <select
                      className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                      value={donorForm.gender}
                      onChange={(e) =>
                        setDonorForm({ ...donorForm, gender: e.target.value })
                      }
                      required
                    >
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Address
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                    value={donorForm.address}
                    onChange={(e) =>
                      setDonorForm({ ...donorForm, address: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Phone
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                    value={donorForm.phone}
                    onChange={(e) =>
                      setDonorForm({ ...donorForm, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Blood Type
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                    value={donorForm.bloodType}
                    onChange={(e) =>
                      setDonorForm({
                        ...donorForm,
                        bloodType: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select</option>
                    {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(
                      (bt) => (
                        <option key={bt}>{bt}</option>
                      )
                    )}
                  </select>
                </div>
                <button
                  type="submit"
                  className="mt-2 w-full rounded-lg bg-gradient-to-r from-rose-600 to-red-600 text-white py-1.5 text-sm font-semibold hover:from-rose-700 hover:to-red-700"
                >
                  Save Donor
                </button>
              </form>
            </div>

            {/* Donor list + health record + recent records */}
            <div className="space-y-4">
              {/* Donor list */}
              <div className="bg-white/95 backdrop-blur rounded-xl shadow-md border border-slate-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
                    Donors
                  </h2>
                <button
                    onClick={refreshDonors}
                    className="text-xs px-2 py-1 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    Refresh
                  </button>
                </div>
                <div className="max-h-48 overflow-auto text-xs">
                  <table className="w-full border-collapse text-slate-800">
                    <thead>
                      <tr className="bg-rose-50 text-rose-700">
                        <th className="border border-slate-200 px-2 py-1">
                          ID
                        </th>
                        <th className="border border-slate-200 px-2 py-1">
                          Name
                        </th>
                        <th className="border border-slate-200 px-2 py-1">
                          Blood
                        </th>
                        <th className="border border-slate-200 px-2 py-1">
                          Phone
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {donors.map((d) => (
                        <tr key={d.Donor_ID} className="hover:bg-slate-50">
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {d.Donor_ID}
                          </td>
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {d.Name}
                          </td>
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {d.Blood_Type}
                          </td>
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {d.Ph_N}
                          </td>
                        </tr>
                      ))}
                      {donors.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="border border-slate-200 px-2 py-2 text-center text-slate-400 bg-white"
                          >
                            No donors yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Health Record */}
              <div className="bg-white/95 backdrop-blur rounded-xl shadow-md border border-slate-100 p-4">
                <h2 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wide">
                  Add Health Record (sp_AddHealthRecord)
                </h2>
                <form className="space-y-2" onSubmit={handleAddHealthRecord}>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        Donor ID
                      </label>
                      <input
                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                        value={healthForm.donorId}
                        onChange={(e) =>
                          setHealthForm({
                            ...healthForm,
                            donorId: e.target.value,
                          })
                        }
                        required
                        type="number"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                        value={healthForm.recordDate}
                        onChange={(e) =>
                          setHealthForm({
                            ...healthForm,
                            recordDate: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        Blood Pressure
                      </label>
                      <input
                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                        placeholder="120/80"
                        value={healthForm.bloodPressure}
                        onChange={(e) =>
                          setHealthForm({
                            ...healthForm,
                            bloodPressure: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        Hemoglobin
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                        value={healthForm.hemoglobin}
                        onChange={(e) =>
                          setHealthForm({
                            ...healthForm,
                            hemoglobin: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Eligible?
                    </label>
                    <select
                      className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                      value={healthForm.isEligible}
                      onChange={(e) =>
                        setHealthForm({
                          ...healthForm,
                          isEligible: e.target.value,
                        })
                      }
                    >
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="mt-2 w-full rounded-lg bg-gradient-to-r from-rose-600 to-red-600 text-white py-1.5 text-sm font-semibold hover:from-rose-700 hover:to-red-700"
                  >
                    Save Health Record
                  </button>
                </form>
              </div>

              {/* Recent Health Records */}
              <div className="bg-white/95 backdrop-blur rounded-xl shadow-md border border-slate-100 p-4">
                <h2 className="text-xs font-semibold text-slate-800 mb-2 uppercase tracking-wide">
                  Recent Health Records
                </h2>
                <div className="max-h-40 overflow-auto text-xs">
                  <table className="w-full border-collapse text-slate-800">
                    <thead>
                      <tr className="bg-sky-50 text-sky-700">
                        <th className="border border-slate-200 px-2 py-1">
                          Donor
                        </th>
                        <th className="border border-slate-200 px-2 py-1">
                          Record
                        </th>
                        <th className="border border-slate-200 px-2 py-1">
                          Date
                        </th>
                        <th className="border border-slate-200 px-2 py-1">
                          BP
                        </th>
                        <th className="border border-slate-200 px-2 py-1">
                          Hb
                        </th>
                        <th className="border border-slate-200 px-2 py-1">
                          Eligible
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {healthRecords.map((r) => (
                        <tr
                          key={`${r.Donor_ID}-${r.Record_ID}`}
                          className="hover:bg-slate-50"
                        >
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {r.Donor_ID}
                          </td>
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {r.Record_ID}
                          </td>
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {r.Record_Date?.slice(0, 10)}
                          </td>
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {r.Blood_Pressure}
                          </td>
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {r.Hemoglobin_lvl}
                          </td>
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {r.Is_Eligible ? "Yes" : "No"}
                          </td>
                        </tr>
                      ))}
                      {healthRecords.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="border border-slate-200 px-2 py-2 text-center text-slate-400 bg-white"
                          >
                            No records yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BLOOD UNITS & STOCK */}
        {activeTab === TABS.UNITS && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Add Unit */}
            <div className="bg-white/95 backdrop-blur rounded-xl shadow-md border border-slate-100 p-4">
              <h2 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wide">
                Add Blood Unit
              </h2>
              <form className="space-y-2" onSubmit={handleAddUnit}>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Unit ID
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                    value={unitForm.unitId}
                    onChange={(e) =>
                      setUnitForm({ ...unitForm, unitId: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Bank ID
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                      value={unitForm.bankId}
                      onChange={(e) =>
                        setUnitForm({ ...unitForm, bankId: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Donor ID
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                      value={unitForm.donorId}
                      onChange={(e) =>
                        setUnitForm({ ...unitForm, donorId: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Request ID (optional)
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                    value={unitForm.requestId}
                    onChange={(e) =>
                      setUnitForm({ ...unitForm, requestId: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Blood Type
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                    value={unitForm.bloodType}
                    onChange={(e) =>
                      setUnitForm({ ...unitForm, bloodType: e.target.value })
                    }
                    required
                  >
                    <option value="">Select</option>
                    {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(
                      (bt) => (
                        <option key={bt}>{bt}</option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                    value={unitForm.status}
                    onChange={(e) =>
                      setUnitForm({ ...unitForm, status: e.target.value })
                    }
                    required
                  >
                    <option>Available</option>
                    <option>Reserved</option>
                    <option>Used</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="mt-2 w-full rounded-lg bg-gradient-to-r from-rose-600 to-red-600 text-white py-1.5 text-sm font-semibold hover:from-rose-700 hover:to-red-700"
                >
                  Save Unit
                </button>
              </form>
              <p className="mt-2 text-[11px] text-slate-500">
                On insert, trigger <code>trg_CheckDonorEligibility</code> checks
                the donor&apos;s latest health record using{" "}
                <code>fn_GetDonorEligibility</code>.
              </p>
            </div>

            {/* Units & Stock */}
            <div className="space-y-4">
              {/* All Units */}
              <div className="bg-white/95 backdrop-blur rounded-xl shadow-md border border-slate-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
                    All Blood Units
                  </h2>
                  <button
                    onClick={refreshUnits}
                    className="text-xs px-2 py-1 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    Refresh
                  </button>
                </div>
                <div className="max-h-48 overflow-auto text-xs">
                  <table className="w-full border-collapse text-slate-800">
                    <thead>
                      <tr className="bg-rose-50 text-rose-700">
                        <th className="border border-slate-200 px-2 py-1">
                          Unit
                        </th>
                        <th className="border border-slate-200 px-2 py-1">
                          Bank
                        </th>
                        <th className="border border-slate-200 px-2 py-1">
                          Donor
                        </th>
                        <th className="border border-slate-200 px-2 py-1">
                          Blood
                        </th>
                        <th className="border border-slate-200 px-2 py-1">
                          Status
                        </th>
                        <th className="border border-slate-200 px-2 py-1">
                          Req ID
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {units.map((u) => (
                        <tr key={u.Unit_ID} className="hover:bg-slate-50">
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {u.Unit_ID}
                          </td>
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {u.Bank_ID}
                          </td>
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {u.Donor_ID}
                          </td>
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {u.Blood_Type}
                          </td>
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {u.Status}
                          </td>
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {u.Request_ID ?? "-"}
                          </td>
                        </tr>
                      ))}
                      {units.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="border border-slate-200 px-2 py-2 text-center text-slate-400 bg-white"
                          >
                            No units yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Stock summary */}
              <div className="bg-white/95 backdrop-blur rounded-xl shadow-md border border-slate-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
                    Stock Summary (Available Units)
                  </h2>
                  <button
                    onClick={refreshStock}
                    className="text-xs px-2 py-1 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    Refresh
                  </button>
                </div>
                <div className="max-h-40 overflow-auto text-xs">
                  <table className="w-full border-collapse text-slate-800">
                    <thead>
                      <tr className="bg-emerald-50 text-emerald-700">
                        <th className="border border-slate-200 px-2 py-1">
                          Blood Type
                        </th>
                        <th className="border border-slate-200 px-2 py-1">
                          Available Units
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stock.map((s) => (
                        <tr key={s.Blood_Type} className="hover:bg-slate-50">
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {s.Blood_Type}
                          </td>
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {s.Total_Units_Available}
                          </td>
                        </tr>
                      ))}
                      {stock.length === 0 && (
                        <tr>
                          <td
                            colSpan={2}
                            className="border border-slate-200 px-2 py-2 text-center text-slate-400 bg-white"
                          >
                            No data yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  This uses the aggregate query on <code>BLOOD_UNIT</code>{" "}
                  (COUNT(*) GROUP BY Blood_Type, Status=&apos;Available&apos;).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* REQUESTS */}
        {activeTab === TABS.REQUESTS && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Add request */}
            <div className="bg-white/95 backdrop-blur rounded-xl shadow-md border border-slate-100 p-4">
              <h2 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wide">
                Create Blood Request
              </h2>
              <form className="space-y-2" onSubmit={handleAddRequest}>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Request ID
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                    value={requestForm.requestId}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        requestId: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Hospital ID
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                    value={requestForm.hospitalId}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        hospitalId: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Required Blood Type
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                    value={requestForm.reqBloodType}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        reqBloodType: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select</option>
                    {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(
                      (bt) => (
                        <option key={bt}>{bt}</option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Quantity (Units)
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                    value={requestForm.quantityUnits}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        quantityUnits: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 w-full rounded-lg bg-gradient-to-r from-rose-600 to-red-600 text-white py-1.5 text-sm font-semibold hover:from-rose-700 hover:to-red-700"
                >
                  Create Request
                </button>
              </form>
            </div>

            {/* Fulfill + list */}
            <div className="space-y-4">
              <div className="bg-white/95 backdrop-blur rounded-xl shadow-md border border-slate-100 p-4">
                <h2 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wide">
                  Fulfill Request (sp_FulfillBloodRequest)
                </h2>
                <form className="space-y-2" onSubmit={handleFulfillRequest}>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Request ID
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                      value={fulfillForm.requestId}
                      onChange={(e) =>
                        setFulfillForm({
                          ...fulfillForm,
                          requestId: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Bank ID
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-300"
                      value={fulfillForm.bankId}
                      onChange={(e) =>
                        setFulfillForm({
                          ...fulfillForm,
                          bankId: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-2 w-full rounded-lg bg-gradient-to-r from-rose-600 to-red-600 text-white py-1.5 text-sm font-semibold hover:from-rose-700 hover:to-red-700"
                  >
                    Fulfill Request
                  </button>
                </form>
              </div>

              <div className="bg-white/95 backdrop-blur rounded-xl shadow-md border border-slate-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
                    All Requests
                  </h2>
                  <button
                    onClick={refreshRequests}
                    className="text-xs px-2 py-1 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    Refresh
                  </button>
                </div>
                <div className="max-h-56 overflow-auto text-xs">
                  <table className="w-full border-collapse text-slate-800">
                    <thead>
                      <tr className="bg-sky-50 text-sky-700">
                        <th className="border border-slate-200 px-2 py-1">
                          Req ID
                        </th>
                        <th className="border border-slate-200 px-2 py-1">
                          Hosp
                        </th>
                        <th className="border border-slate-200 px-2 py-1">
                          Blood
                        </th>
                        <th className="border border-slate-200 px-2 py-1">
                          Qty
                        </th>
                        <th className="border border-slate-200 px-2 py-1">
                          Status
                        </th>
                        <th className="border border-slate-200 px-2 py-1">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((r) => (
                        <tr key={r.Request_ID} className="hover:bg-slate-50">
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {r.Request_ID}
                          </td>
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {r.Hospital_ID}
                          </td>
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {r.REQ_BLOOD_TYPE}
                          </td>
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            {r.Quantity_Units}
                          </td>
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                r.Status === "Pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : r.Status === "Fulfilled"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-sky-100 text-sky-800"
                              }`}
                            >
                              {r.Status}
                            </span>
                          </td>
                          <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800 space-x-1">
                            <button
                              className="border border-slate-300 rounded px-1.5 py-0.5 text-[10px] hover:bg-slate-50"
                              onClick={() =>
                                setFulfillForm({
                                  ...fulfillForm,
                                  requestId: r.Request_ID,
                                })
                              }
                            >
                              Fill
                            </button>
                            <button
                              className="border border-red-300 rounded px-1.5 py-0.5 text-[10px] text-red-600 hover:bg-red-50"
                              onClick={() =>
                                handleCancelRequest(r.Request_ID)
                              }
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                      {requests.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="border border-slate-200 px-2 py-2 text-center text-slate-400 bg-white"
                          >
                            No requests yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  When units are assigned to a request, trigger{" "}
                  <code>trg_UpdateReqStatusOnFulfillment</code> updates the
                  status to Fulfilled / Partially Fulfilled.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AGREEMENTS */}
        {activeTab === TABS.AGREEMENTS && (
          <div className="bg-white/95 backdrop-blur rounded-xl shadow-md border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
                Supply Agreements (Hospital ↔ Blood Bank)
              </h2>
              <button
                onClick={refreshAgreements}
                className="text-xs px-2 py-1 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>
            <div className="max-h-72 overflow-auto text-xs">
              <table className="w-full border-collapse text-slate-800">
                <thead>
                  <tr className="bg-violet-50 text-violet-700">
                    <th className="border border-slate-200 px-2 py-1">
                      Hospital ID
                    </th>
                    <th className="border border-slate-200 px-2 py-1">
                      Hospital Name
                    </th>
                    <th className="border border-slate-200 px-2 py-1">
                      Bank ID
                    </th>
                    <th className="border border-slate-200 px-2 py-1">
                      Bank Name
                    </th>
                    <th className="border border-slate-200 px-2 py-1">
                      Agreement Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {agreements.map((a, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                        {a.Hospital_ID}
                      </td>
                      <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                        {a.Hospital_Name}
                      </td>
                      <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                        {a.Bank_ID}
                      </td>
                      <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                        {a.Bank_Name}
                      </td>
                      <td className="border border-slate-200 px-2 py-1 bg-white text-slate-800">
                        {a.Agreement_Date?.slice(0, 10)}
                      </td>
                    </tr>
                  ))}
                  {agreements.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="border border-slate-200 px-2 py-2 text-center text-slate-400 bg-white"
                      >
                        No agreements yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              This demonstrates JOIN between <code>SUPPLY_AGREEMENT</code>,{" "}
              <code>HOSPITAL</code> and <code>BLOOD_BANK</code>.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
