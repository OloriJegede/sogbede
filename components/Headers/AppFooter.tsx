import Image from "next/image";
import Link from "next/link";
import React from "react";

const AppFooter = () => {
  return (
    <div id="foot" className="bg-[#3A2B27] text-[#FAFAFA] py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-0">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-b border-[#CCAB8C] pb-20">
          <div className="space-y-5">
            <Image
              src={`/logo-white.svg`}
              width={220}
              height={54.61}
              alt="logo"
            />
            <div className="text-[16px]">
              A Yoruba cultural game show that turns language into fun.
            </div>
            <div className="pt-6 space-y-4">
              <div className="text-[24px] montserrat-semibold">Contact Us</div>
              <div className="text-[#FAF7F3] montserrat-semibold">
                Get In Touch
              </div>
              <div className="">
                Questions? Contact us at{" "}
                <a
                  className="montserrat-semibold underline"
                  href="mailto:iwadi@sogbede.com"
                >
                  iwadi@sogbede.com
                </a>
              </div>
            </div>
          </div>
          <div className="flex md:justify-center items-start">
            <div className="space-y-6">
              <div className="text-[24px] montserrat-semibold">Quick Links</div>
              <div className="space-y-5 text-[#FAF7F3]">
                <div>
                  <Link href={`/apply`}>Sign up</Link>
                </div>
                <div>
                  <Link href={`/#faq`}>FAQ</Link>
                </div>
                <div>
                  <Link href={`/filming-consent-agreement`}>
                    Filming Consent Agreement
                  </Link>
                </div>
                <div>
                  <Link href={`/terms-and-condition`}>Terms & Conditions</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex md:justify-center items-start">
            <div>
              <div className="text-[24px] montserrat-semibold">
                Follow Our Journey
              </div>
              <div className="flex justify-start items-center space-x-3 pt-6">
                <a
                  href="https://www.instagram.com/so.gbede"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={`/ig.svg`}
                    width={24}
                    height={24}
                    alt="instagram"
                  />
                </a>
                <a
                  href="https://www.facebook.com/share/1BFzfvS9bi/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={`/fb.svg`}
                    width={24}
                    height={24}
                    alt="facebook"
                  />
                </a>
                <a
                  href="https://x.com/eresogbede"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image src={`/x.svg`} width={24} height={24} alt="twitter" />
                </a>
                <a
                  href="https://www.youtube.com/@sogbede"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image src={`/yt.svg`} width={24} height={24} alt="youtube" />
                </a>
              </div>
            </div>
          </div>
        </section>
        <div className="pt-8 text-center">
          © 2025 ṢOGBÉDÈ. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AppFooter;
