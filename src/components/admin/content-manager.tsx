import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LandingSectionManager } from "./landing-section-manager";
import { ProblemsManager } from "./problems-manager";
import { BenefitsManager } from "./benefits-manager";
import { TestimonialsManager } from "./testimonials-manager";
import { PricingManager } from "./pricing-manager";
import { FaqManager } from "./faq-manager";
import { SubdomainManager } from "./subdomain-manager";

export function ContentManager() {
  const [activeTab, setActiveTab] = useState('hero');

  const tabs = [
    { id: 'hero', label: 'Hero & CTA' },
    { id: 'problems', label: 'Problems & Solutions' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'faq', label: 'FAQ' },
    { id: 'subdomains', label: 'Subdomains' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b pb-4">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            onClick={() => setActiveTab(tab.id)}
            size="sm"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'hero' && <LandingSectionManager />}
        {activeTab === 'problems' && <ProblemsManager />}
        {activeTab === 'benefits' && <BenefitsManager />}
        {activeTab === 'testimonials' && <TestimonialsManager />}
        {activeTab === 'pricing' && <PricingManager />}
        {activeTab === 'faq' && <FaqManager />}
        {activeTab === 'subdomains' && <SubdomainManager />}
      </div>
    </div>
  );
}