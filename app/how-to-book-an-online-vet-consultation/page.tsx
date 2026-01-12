import React from "react";
import { CheckCircle, XCircle, Calendar, MessageCircle, Video, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "How to book an online vet consultation",
  description: "Step-by-step guide to book a Dial A Vet online consultation and what to expect.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#F5F7F6] text-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl mb-3">How It Works</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Getting veterinary advice has never been easier. Here&rsquo;s how you can speak to our licensed vet team in minutes.
          </p>
        </header>

        {/* Steps */}
        <div className="space-y-6">
          <StepCard
            step="STEP 1"
            icon={<Calendar className="h-6 w-6 text-emerald-600" />}
            title="Book Your Appointment"
            description="Choose a time that works for you. Available outside of business hours for your convenience. Enter your mobile number to sign in or create an account automatically."
            points={[
              "Available outside business hours",
              "Book in under 2 minutes",
            ]}
          />

          <StepCard
            step="STEP 2"
            icon={<MessageCircle className="h-6 w-6 text-emerald-600" />}
            title="Tell Us About Your Pet"
            description="Provide basic information about your pet and describe what&rsquo;s concerning you. This helps our vets prepare for your consultation."
            points={[
              "Pet details (name, species, age, breed)",
              "Describe symptoms or concerns",
              "All information is confidential and secure",
            ]}
          />

          <StepCard
            step="STEP 3"
            icon={<Video className="h-6 w-6 text-emerald-600" />}
            title="Video Call with a Global Vet Team"
            description="At your scheduled time, you&rsquo;ll connect with one of our licensed veterinarians and nurses via video call. Show them your pet, discuss symptoms, and get professional advice."
            points={[
              "Licensed Veterinarians & Nurses",
              "Typical consultation 15–20 minutes",
              "Get treatment guidance and next steps",
            ]}
          />

          <StepCard
            step="STEP 4"
            icon={<ClipboardCheck className="h-6 w-6 text-emerald-600" />}
            title="Get Your Summary & Follow-Up"
            description="After your consultation, you&rsquo;ll receive a written summary sent to your email. If needed, our vets can recommend whether an in-clinic visit is necessary."
            points={[
              "Written summary emailed to you",
              "Clear next steps and recommendations",
              "Access your consultation history anytime",
            ]}
          />
        </div>

        {/* What We Can Help With */}
        <section className="mt-20 text-center">
          <h2 className="text-3xl mb-10">What We Can Help With</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-emerald-200">
              <CardContent className="p-6 text-left">
                <h3 className="text-emerald-700 mb-3">We Can Help With:</h3>
                <ul className="space-y-2 text-slate-700">
                  {[
                    "Behavioural concerns and anxiety",
                    "Skin conditions and allergies",
                    "Diet and nutrition advice",
                    "Preventive care guidance",
                    "Minor injuries assessment",
                    "Triage and deciding if clinic visit needed",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" /> {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-rose-200">
              <CardContent className="p-6 text-left">
                <h3 className="text-rose-700 mb-3">We Cannot:</h3>
                <ul className="space-y-2 text-slate-700">
                  {[
                    "Prescribe medication (vet clinic required)",
                    "Perform physical examinations",
                    "Handle life-threatening emergencies",
                    "Provide diagnoses (guidance only)",
                    "Replace your regular vet clinic",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-rose-600 mt-0.5" /> {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-rose-500 mt-3">
                  For emergencies, please contact your nearest emergency vet clinic immediately.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 text-center">
          <h2 className="text-2xl mb-4">Ready to Get Started?</h2>
          <p className="text-slate-500 mb-6">
            Book your first consultation or explore our pricing options.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700" href="/book-a-vet-consultation">Book a Consultation</Button>
            <Button variant="outline" className="rounded-full border-slate-300 hover:bg-slate-50" href="/pricing">View Pricing</Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function StepCard({ step, icon, title, description, points }: { step: string; icon: React.ReactNode; title: string; description: string; points: string[] }) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1 bg-emerald-50 rounded-full p-3">{icon}</div>
          <div>
            <p className="text-xs font-medium text-emerald-700 tracking-wider mb-1">{step}</p>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-slate-600 mb-3 text-sm leading-relaxed">{description}</p>
            <ul className="space-y-1 text-sm text-slate-700">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" /> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
