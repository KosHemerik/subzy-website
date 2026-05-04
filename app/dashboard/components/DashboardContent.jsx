"use client";

/**
 * Dashboard Content Component
 * Main content area of the dashboard overview page
 */
import CaseTimeline from "./CaseTimeline";
import DashboardOverviewCards from "./DashboardOverviewCards";
import NotificationsPanel from "./NotificationsPanel";

// Sample data - replace with actual API data
const sampleCases = [
  {
    id: 1,
    title: "Teruggave Energiebelasting 2023",
    caseNumber: "#EB-2023-8942",
    status: "waiting-documents",
    steps: [
      {
        type: "intake",
        title: "Intake voltooid",
        status: "completed",
        date: "12 Oktober 2023",
      },
      {
        type: "documents",
        title: "Documenten aanleveren",
        status: "current",
        description: "Wij hebben uw jaarrekening nodig om verder te gaan.",
        action: "Nu uploaden",
      },
      {
        type: "review",
        title: "Beoordeling Subzy",
        status: "pending",
      },
      {
        type: "submitted",
        title: "Ingediend bij Belastingdienst",
        status: "pending",
      },
    ],
  },
  {
    id: 2,
    title: "Duurzaamheidssubsidie Zonnepanelen",
    caseNumber: "#DS-2023-1024",
    status: "in-progress",
    steps: [
      {
        type: "intake",
        title: "Intake & Documenten ontvangen",
        status: "completed",
        date: "05 November 2023",
      },
      {
        type: "processing",
        title: "Beoordeling door onze experts",
        status: "current",
        description: "Verwachte afronding: binnen 3 werkdagen.",
      },
      {
        type: "sent",
        title: "Aanvraag verstuurd",
        status: "pending",
      },
    ],
  },
];

export default function DashboardContent() {
  return (
    <main className="flex-grow p-4 sm:p-8 bg-gray-50 w-full overflow-y-auto">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            Dashboard Overzicht
          </h1>
          <p className="text-gray-500 mt-1">
            Bekijk de status van uw lopende aanvragen en documenten.
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm flex items-center">
            <i className="fa-solid fa-plus mr-2" /> Nieuwe aanvraag
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <DashboardOverviewCards />

      {/* Main Grid: Timelines & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Case Timelines */}
        <div className="lg:col-span-2 space-y-6">
          {sampleCases.map((caseData) => (
            <CaseTimeline key={caseData.id} caseData={caseData} />
          ))}
        </div>

        {/* Right Column: Notifications */}
        <div className="lg:col-span-1">
          <NotificationsPanel />
        </div>
      </div>
    </main>
  );
}
