import BackBtn from "@/components/Reusables/BackBtn";
import React from "react";

const page = () => {
  return (
    <div className="bg-[#FAF7F3]">
      <div className="max-w-[960px] mx-auto py-14 px-6 md:px-0">
        <BackBtn />
        <section className="space-y-3 pt-10">
          <h2 className="text-[#1C1A1A] text-[48px] text-center skranji">
            Filming Consent Agreement
          </h2>
          <div className="text-[#615552] text-[16px] text-center">
            This Consent & Release Agreement is for your appearance on ṢOGBÉDÈ,
            a Yoruba language game show produced by ORIIA LLC.
          </div>
          <div className="text-[#615552] text-[12px] text-center">
            By participating, you acknowledge and agree to the following terms:
          </div>
        </section>
        <section className="mt-8">
          <div className="bg-white p-5 space-y-3">
            <div className="skranji text-[#1C1A1A] text-[32px]">
              1. Filming & Photography
            </div>
            <div className="text-[#333131] text-[16px] md:w-[94%]">
              The show will be filmed, photographed, and otherwise recorded
              during production Your voice, image, name, performance, and
              likeness may appear in such recordings
            </div>
          </div>
          <div className="bg-white p-5 space-y-3">
            <div className="skranji text-[#1C1A1A] text-[32px]">
              2. Right of Use
            </div>
            <div className="text-[#333131] text-[16px] md:w-[94%] space-y-3">
              <p>
                You grant Producer the full, perpetual, worldwide, irrevocable
                right to use, reproduce, edit, adapt, modify, distribute,
                broadcast, publish, exhibit, and publicly display the
                recordings.
              </p>
              <p>
                This includes television broadcasts, streaming services,
                YouTube, social media platforms, marketing, promotional
                materials, and advertising campaigns.{" "}
              </p>
              <p>
                You waive any right to inspect or approve the final version of
                the recordings.
              </p>
            </div>
          </div>
          <div className="bg-white p-5 space-y-3">
            <div className="skranji text-[#1C1A1A] text-[32px]">
              3. Ownership
            </div>
            <div className="text-[#333131] text-[16px] md:w-[94%] space-y-3">
              <p>
                All recordings, photographs, audio, video, and related content
                are the sole and exclusive property of ORIIA LLC.
              </p>
              <p>
                You acknowledge you have no ownership, copyright, or other
                rights to such content.
              </p>
            </div>
          </div>
          <div className="bg-white p-5 space-y-3">
            <div className="skranji text-[#1C1A1A] text-[32px]">
              4. Compensation & Prizes
            </div>
            <div className="text-[#333131] text-[16px] md:w-[94%] space-y-3">
              <p>
                Participation is voluntary - no compensation for simply
                appearing on the show.
              </p>
              <p>
                If your team wins during gameplay, you'll be awarded the prize
                amount earned (up to $2,000 per team) Prize money is awarded to
                the team and must be shared among all team members.
              </p>
              <p>
                Important: Prize money must be requested before leaving the set
                on filming day. If no request is made, the prize is waived.
              </p>
              <p>
                Maximum available prize may vary by episode depending on game
                outcomes
              </p>
            </div>
          </div>
          <div className="bg-white p-5 space-y-3">
            <div className="skranji text-[#1C1A1A] text-[32px]">
              5. Waiver of Claims
            </div>
            <div className="text-[#333131] text-[16px] md:w-[94%] space-y-3">
              <p>
                You release and hold harmless ORIIA LLC from any claims arising
                from your participation in the show. This includes claims for
                defamation, invasion of privacy, infringement of publicity
                rights, or misrepresentation.
              </p>
            </div>
          </div>
          <div className="bg-white p-5 space-y-3">
            <div className="skranji text-[#1C1A1A] text-[32px]">
              6. Production Rights
            </div>
            <div className="text-[#333131] text-[16px] md:w-[94%] space-y-3">
              <p>
                The Producer has no obligation to use your appearance,
                recordings, or name in the final show. Editing and content
                decisions are at the sole discretion of the production team.
              </p>
            </div>
          </div>
          <div className="bg-white p-5 space-y-3">
            <div className="skranji text-[#1C1A1A] text-[32px]">
              7. Confidentiality
            </div>
            <div className="text-[#333131] text-[16px] md:w-[94%] space-y-3">
              <p>
                You agree not to disclose show outcomes, production details, or
                confidential information This confidentiality remains in effect
                until information is officially released by the Producer
              </p>
            </div>
          </div>
          <div className="bg-white p-5 space-y-3">
            <div className="skranji text-[#1C1A1A] text-[32px]">
              8. Entire Agreement
            </div>
            <div className="text-[#333131] text-[16px] md:w-[94%] space-y-3">
              <p>
                This Agreement represents the entire understanding between you
                and ORIIA LLC and supersedes all prior discussions or
                agreements.
              </p>
            </div>
          </div>
          <div className="bg-[#3A2B27] border border-[#F0E6DD] p-5 space-y-3">
            <div className="text-[#E8E8E8] text-[16px] md:w-[94%] space-y-3">
              <span className="montserrat-bold">Acknowledgment: </span>By
              checking the filming consent checkbox and submitting your
              application, you confirm that you have read, understood, and
              voluntarily agreed to all the terms above. You acknowledge that
              you are participating of your own free will, without expectation
              of compensation beyond any prize money that may be won and
              properly requested.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default page;
