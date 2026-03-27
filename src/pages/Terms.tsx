import InfoPageLayout from "@/components/InfoPageLayout";

const terms = [
  {
    title: "Using the Website",
    text: "By accessing the website, users agree to browse, create accounts, place orders and use services in a responsible and lawful way.",
  },
  {
    title: "Product Information",
    text: "We aim to present product details, prices, stock information and categories clearly. However, occasional updates or corrections may be required as the catalog changes.",
  },
  {
    title: "Orders and Payments",
    text: "Orders are subject to review, confirmation and payment completion. Store workflows may include updates to payment status, shipping progress and delivery completion.",
  },
  {
    title: "Account Responsibility",
    text: "Users are responsible for maintaining the accuracy of account and order details. Admin may restrict or block accounts if misuse or suspicious activity is identified.",
  },
  {
    title: "Policy Changes",
    text: "We may update these terms as the platform grows, features change or operational requirements evolve. Continued usage of the website indicates acceptance of updated terms.",
  },
];

const Terms = () => (
  <InfoPageLayout
    eyebrow="Terms and Conditions"
    title="The key terms that guide shopping, account use and store operations."
    description="These terms are here to explain how customers interact with the platform, how orders are handled and what expectations apply when using the website."
    sidebarTitle="Terms summary"
    sidebarText="A user-friendly store should keep its policies readable, structured and practical for real shopping situations."
    sidebarItems={[
      "Website usage expectations",
      "Order and payment flow",
      "Product and pricing updates",
      "Customer account responsibility",
    ]}
  >
    <div className="space-y-6">
      {terms.map((term) => (
        <div key={term.title} className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-2xl font-semibold text-slate-950">{term.title}</h2>
          <p className="mt-4 text-sm leading-8 text-slate-600 md:text-base">{term.text}</p>
        </div>
      ))}
    </div>
  </InfoPageLayout>
);

export default Terms;
