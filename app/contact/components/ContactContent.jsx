import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";

/**
 * Contact Content Section
 * Contains contact form and info sidebar
 */
export default function ContactContent() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-2">
                Stuur ons een bericht
              </h2>
              <div className="flex items-center text-green-600 bg-green-50 px-3 py-1.5 rounded-full inline-flex text-sm font-medium">
                <i className="fa-solid fa-clock mr-2" />
                Wij reageren binnen één werkdag
              </div>
            </div>

            <ContactForm />
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-5">
            <ContactInfo />
          </div>
        </div>
      </div>
    </section>
  );
}
