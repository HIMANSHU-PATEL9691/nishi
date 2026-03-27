import InfoPageLayout from "@/components/InfoPageLayout";

const sections = [
  {
    title: "Information We Collect",
    text: "We may collect information such as your name, email address, shipping details, order history and account activity when you use the website or place an order.",
  },
  {
    title: "How We Use Information",
    text: "This information helps us process orders, improve the shopping experience, manage customer support, maintain account access and provide important updates related to orders or policies.",
  },
  {
    title: "Payment and Security",
    text: "Payment-related processes should be handled through secure integrations. We aim to maintain a protected shopping flow and reduce unauthorized access through managed account and admin controls.",
  },
  {
    title: "Data Sharing",
    text: "We do not intend to sell customer data. Information may only be used where necessary for operations such as delivery, order support, account management or legal compliance.",
  },
  {
    title: "Your Rights",
    text: "Customers may request support related to account access, order visibility or general questions about how their information is handled through the contact channels listed on the website.",
  },
];

const PrivacyPolicy = () => (
  <InfoPageLayout
    eyebrow="Privacy Policy"
    title="Clear information on how customer data is handled across the store."
    description="This policy explains the kind of information the website may collect, how it may be used to support shopping operations and the importance of security in the customer journey."
    sidebarTitle="Policy overview"
    sidebarText="A professional store should explain privacy in simple language so customers feel informed and protected."
    sidebarItems={[
      "Customer details and order information",
      "Account and order history usage",
      "Security and access considerations",
      "Transparency about data handling",
    ]}
  >
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title} className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-2xl font-semibold text-slate-950">{section.title}</h2>
          <p className="mt-4 text-sm leading-8 text-slate-600 md:text-base">{section.text}</p>
        </div>
      ))}
    </div>
  </InfoPageLayout>
);

export default PrivacyPolicy;
