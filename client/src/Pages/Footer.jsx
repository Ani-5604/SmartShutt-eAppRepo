import { useLanguage } from "../Components/context/LanguageContext";  // Import language context
import styles from "../Styles/landing.module.css";

function Footer() {
  const { language } = useLanguage();  // Access current language from context

  // Translations for different languages
  const translations = {
    English: {
      book: "Book",
      busTicket: "Bus Ticket",
      about: "About",
      aboutUs: "About Us",
      contactUs: "Contact Us",
      faq: "FAQ",
      copyright: "©2024 SmartShuttle. All rights reserved.",
      description: "Providing seamless and reliable transportation solutions tailored to your needs."
    },
    हिंदी: {
      book: "बुक",
      busTicket: "बस टिकट",
      about: "हमारे बारे में",
      aboutUs: "हमारे बारे में",
      contactUs: "संपर्क करें",
      faq: "अक्सर पूछे जाने वाले प्रश्न",
      copyright: "©2024 SmartShuttle. सर्वाधिकार सुरक्षित।",
      description: "आपकी ज़रूरतों के अनुसार निर्बाध और विश्वसनीय परिवहन समाधान प्रदान करना।"
    },
    বাংলা: {
      book: "বুক",
      busTicket: "বাস টিকেট",
      about: "আমাদের সম্পর্কে",
      aboutUs: "আমাদের সম্পর্কে",
      contactUs: "যোগাযোগ করুন",
      faq: "প্রশ্নাবলী",
      copyright: "©2024 SmartShuttle. সব অধিকার সংরক্ষিত।",
      description: "আপনার প্রয়োজন অনুযায়ী ধারাবাহিক এবং নির্ভরযোগ্য পরিবহন সমাধান প্রদান।"
    },
    اردو: {
      book: "کتاب",
      busTicket: "بس ٹکٹ",
      about: "ہمارے بارے میں",
      aboutUs: "ہمارے بارے میں",
      contactUs: "ہم سے رابطہ کریں",
      faq: "اکثر پوچھے گئے سوالات",
      copyright: "©2024 SmartShuttle. تمام حقوق محفوظ ہیں۔",
      description: "آپ کی ضروریات کے مطابق ہم بے روک اور قابل اعتماد نقل و حمل کے حل فراہم کرتے ہیں۔"
    },
    मराठी: {
      book: "बुक",
      busTicket: "बस तिकीट",
      about: "आमच्याबद्दल",
      aboutUs: "आमच्याबद्दल",
      contactUs: "संपर्क करा",
      faq: "वारंवार विचारले जाणारे प्रश्न",
      copyright: "©2024 SmartShuttle. सर्व हक्क राखीव.",
      description: "तुमच्या गरजा अनुरूप निर्बाध आणि विश्वासार्ह वाहतूक उपाय प्रदान करणे."
    },
    العربية: {
      book: "احجز",
      busTicket: "تذكرة الحافلة",
      about: "معلومات عنا",
      aboutUs: "معلومات عنا",
      contactUs: "اتصل بنا",
      faq: "الأسئلة المتداولة",
      copyright: "©2024 SmartShuttle. جميع الحقوق محفوظة.",
      description: "تقديم حلول نقل سلسة وموثوقة مصممة حسب احتياجاتك."
    }
  };

  return (
    <>
      <footer
        style={{
          padding: "20px 0",
          backgroundColor: "#222222",
          color: "white",
        }}
        className="app-footer"
      >
        <div className="container">
          {/* Top Footer Section */}
          <div className="row">
            {/* Logo and Description */}
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div>
                <h3>
                  <span style={{ color: "#5266FA" }}>Smart</span>Shuttle
                </h3>
                <p className="mb-30 footer-desc">
                  {translations[language].description}
                </p>
              </div>
            </div>

            {/* Booking Links */}
            <div className="col-xl-2 offset-xl-1 col-lg-2 col-md-6">
              <div>
                <h4>{translations[language].book}</h4>
                <ul className="list-unstyled">
                  <li>
                    <p className="text-decoration-none">{translations[language].busTicket}</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* About Links */}
            <div className="col-xl-3 col-lg-3 col-md-6">
              <div>
                <h4>{translations[language].about}</h4>
                <ul className="list-unstyled">
                  <li>
                    <p className="text-decoration-none">{translations[language].aboutUs}</p>
                  </li>
                  <li>
                    <p className="text-decoration-none">{translations[language].contactUs}</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Information Links */}
            <div className="col-xl-3 col-lg-3 col-md-6">
              <div>
                <ul className="list-unstyled">
                  <li>
                    <p className="text-decoration-none">{translations[language].faq}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Footer Section */}
          <div className="d-flex justify-content-center mt-4">
            <div className="copyright">
              <p className={styles.companyinfo}>
                {translations[language].copyright}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
