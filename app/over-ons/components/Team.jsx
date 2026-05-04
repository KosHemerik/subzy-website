const teamMembers = [
  {
    name: "Jeroen de Vries",
    role: "Oprichter & Specialist",
    description: "Expert in energiebelasting met ruim 10 jaar ervaring in de sector.",
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/6616dd17e7-d0b16daed2d946d1ea55.png",
  },
  {
    name: "Sanne Bakker",
    role: "Dossierbeheerder ISDE",
    description: "Zorgt voor een vlekkeloze en snelle afhandeling van alle subsidieaanvragen.",
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/6616dd17e7-511ecdd075439c061996.png",
  },
  {
    name: "Martijn Visser",
    role: "Klantadviseur",
    description: "Uw eerste aanspreekpunt voor alle vragen rondom uw lopende aanvragen.",
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/6616dd17e7-4627d776b41c5c783057.png",
  },
  {
    name: "Lisa Jansen",
    role: "Juridisch Adviseur",
    description: "Waakt over de kwaliteit en naleving van alle complexe regelgeving.",
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/6616dd17e7-3751fd2a4b9ab10f4e88.png",
  },
];

/**
 * Team Section
 * Team members with photos and roles
 */
export default function Team() {
  return (
    <section className="py-16 bg-surface max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Ons Team</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-12">
          Maak kennis met de specialisten die zich dagelijks inzetten voor uw aanvragen.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div 
              key={member.name}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="h-64 overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  src={member.image} 
                  alt={member.name} 
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-primary text-lg">{member.name}</h3>
                <p className="text-secondary text-sm mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
