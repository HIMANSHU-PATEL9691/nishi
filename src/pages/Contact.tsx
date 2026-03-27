import { Mail, MapPin, Phone, TimerReset } from "lucide-react";
import InfoPageLayout from "@/components/InfoPageLayout";

const contacts = [
  {
    title: "Customer Support",
    value: "support@nishi-fashion.com",
    note: "Help with orders, product questions and shopping support.",
    icon: Mail,
  },
  {
    title: "Phone Assistance",
    value: "+91 98765 43210",
    note: "Mon-Sat, 10:00 AM to 7:00 PM",
    icon: Phone,
  },
  {
    title: "Office Location",
    value: "Bengaluru, Karnataka, India",
    note: "Operations and catalog support center.",
    icon: MapPin,
  },
  {
    title: "Response Time",
    value: "Within 24 hours",
    note: "Most support requests are answered quickly.",
    icon: TimerReset,
  },
];

const Contact = () => (
  <InfoPageLayout
    eyebrow="Contact Us"
    title="Reach the team behind the marketplace whenever you need support."
    description="Whether you have a product question, delivery issue, partnership query or feedback about the shopping experience, we are here to help."
    sidebarTitle="Support promise"
    sidebarText="We try to make communication as clear as the shopping experience, with straightforward channels and faster response expectations."
    sidebarItems={[
      "Order and delivery support",
      "Product availability help",
      "Payment and checkout assistance",
      "Business and collaboration inquiries",
    ]}
  >
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="grid gap-5">
        {contacts.map((item) => (
          <div key={item.title} className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
            <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
              <item.icon size={20} />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-950">{item.title}</h2>
            <p className="mt-2 text-base font-medium text-slate-800">{item.value}</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">{item.note}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-950">Contact Guidelines</h2>
        <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
          <p>Share your order ID whenever you contact us about a delivery, payment or product issue.</p>
          <p>For account-related concerns, please use the same email address connected to your order or profile.</p>
          <p>Business and catalog-related questions can include details about products, supply, partnerships or store improvements.</p>
          <p>Feedback about UI, shopping experience and platform trust is always welcome because it helps us improve the store for customers.</p>
        </div>
      </div>
    </div>
  </InfoPageLayout>
);

export default Contact;
