import { useNavigate } from "react-router-dom";
import { success } from "../Utils/notification";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { logoutAPI } from "../Redux/authentication/auth.action";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from "../Components/context/LanguageContext";
import { Link } from "react-router-dom";
import '../App.css';  // Assuming you have a CSS file for global styles

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.data.token);
  const { language, changeLanguage } = useLanguage(); 
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showSignupOptions, setShowSignupOptions] = useState(false);

  // Welcome Message
  const userName = useSelector((state) => state.auth.data.userName);

  // Random Quotes
  const quotes = {
    English: [
      "The best time to plant a tree was 20 years ago. The second best time is now.",
      "You are never too old to set another goal or to dream a new dream.",
      "Believe you can and you're halfway there.",
      "Your limitation—it’s only your imagination.",
      "Push yourself, because no one else is going to do it for you."
    ],
    हिंदी: [
      "पेड़ लगाने का सबसे अच्छा समय 20 साल पहले था। दूसरा सबसे अच्छा समय अब है।",
      "एक नया लक्ष्य तय करने या नया सपना देखने के लिए आप कभी भी बहुत बूढ़े नहीं होते।",
      "विश्वास करें कि आप कर सकते हैं और आप आधे रास्ते पर हैं।",
      "आपकी सीमा—यह केवल आपकी कल्पना है।",
      "खुद को आगे बढ़ाएं, क्योंकि आपके लिए कोई और ऐसा नहीं करेगा।"
    ],
    বাংলা: [
      "গাছ লাগানোর সেরা সময় ছিল ২০ বছর আগে। দ্বিতীয় সেরা সময় হল এখন।",
      "নতুন লক্ষ্য নির্ধারণ বা নতুন স্বপ্ন দেখার জন্য আপনি কখনই খুব বয়স্ক নন।",
      "বিশ্বাস করুন আপনি পারেন এবং আপনি অর্ধেক পথ পার করেছেন।",
      "আপনার সীমাবদ্ধতা—এটি শুধুমাত্র আপনার কল্পনা।",
      "নিজেকে এগিয়ে নিয়ে যান, কারণ আপনার জন্য অন্য কেউ তা করবে না।"
    ],
    اردو: [
      "درخت لگانے کا بہترین وقت 20 سال پہلے تھا۔ دوسرا بہترین وقت اب ہے۔",
      "ایک نیا مقصد طے کرنے یا نیا خواب دیکھنے کے لیے آپ کبھی بھی بہت بوڑھے نہیں ہوتے۔",
      "یقین کریں کہ آپ کر سکتے ہیں اور آپ آدھے راستے پر ہیں۔",
      "آپ کی حد—یہ صرف آپ کا تخیل ہے۔",
      "اپنے آپ کو آگے بڑھائیں، کیونکہ آپ کے لیے کوئی اور ایسا نہیں کرے گا۔"
    ],
    मराठी: [
      "झाड लावण्यासाठी सर्वात चांगला वेळ 20 वर्षांपूर्वी होता. दुसरा चांगला वेळ आत्ताच आहे.",
      "नवीन ध्येय ठरवण्यासाठी किंवा नवीन स्वप्न पाहण्यासाठी तुम्ही कधीही खूप वृद्ध नसता.",
      "विश्वास ठेवा की तुम्ही करू शकता आणि तुम्ही अर्ध्या वाटेवर पोहोचला आहात.",
      "तुमची मर्यादा—ती फक्त तुमची कल्पना आहे.",
      "स्वतःला पुढे ढकलावे लागेल, कारण तुमच्यासाठी दुसरे कोणीही ते करणार नाही."
    ],
    العربية: [
      "أفضل وقت لزرع شجرة كان قبل 20 عامًا. ثاني أفضل وقت هو الآن.",
      "أنت لست كبيرًا جدًا على تحديد هدف جديد أو حلم حلم جديد.",
      "صدق أنك تستطيع، وستكون في منتصف الطريق.",
      "حدودك—هي فقط خيالك.",
      "ادفع نفسك، لأنه لن يقوم أحد بذلك نيابة عنك."
    ]
  };

  // Generate a random quote based on selected language
  const randomQuote = quotes[language][Math.floor(Math.random() * quotes[language].length)];

  const handleLogout = async () => {
    try {
      Cookies.remove("jwttoken");
      Cookies.remove("userid");
      await dispatch(logoutAPI());
      navigate("/");
      success("Logout Successfully");
    } catch (error) {
      console.error("Logout error:", error);
      // Handle error appropriately, perhaps with a failure notification
    }
  };

  const toggleLanguage = (lang) => {
    changeLanguage(lang);
    setShowLanguageDropdown(false); 
  };

  const toggleSignupOptions = () => {
    setShowSignupOptions(prevState => !prevState);
  };

  // Language mappings for different elements
  const translations = {
    English: {
      home: "Home", ride: "Ride", tickets: "My Tickets", welcome: `Welcome, ${userName}!`, guest: "Welcome, Guest!",
      logout: "Logout", signin: "Sign In", signup: "Sign Up", signUpToDrive: "Sign up to drive & deliver", createRiderAccount: "Create a rider account"
    },
    हिंदी: {
      home: "घर", ride: "सवारी", tickets: "मेरी टिकट", welcome: `स्वागत है, ${userName}!`, guest: "स्वागत है, अतिथि!",
      logout: "लॉग आउट", signin: "लॉग इन करें", signup: "साइन अप करें", signUpToDrive: "ड्राइव और डिलीवर करने के लिए साइन अप करें", createRiderAccount: "राइडर खाता बनाएं"
    },
    বাংলা: {
      home: "বাড়ি", ride: "চরুন", tickets: "আমার টিকিট", welcome: `স্বাগতম, ${userName}!`, guest: "স্বাগতম, অতিথি!",
      logout: "লগ আউট", signin: "লগ ইন করুন", signup: "সাইন আপ করুন", signUpToDrive: "ড্রাইভ এবং ডেলিভারির জন্য সাইন আপ করুন", createRiderAccount: "রাইডার অ্যাকাউন্ট তৈরি করুন"
    },
    اردو: {
      home: "گھر", ride: "سفر", tickets: "میری ٹکٹ", welcome: `خوش آمدید, ${userName}!`, guest: "خوش آمدید, مہمان!",
      logout: "لاگ آؤٹ", signin: "لاگ ان کریں", signup: "سائن اپ کریں", signUpToDrive: "چلانے اور ڈیلیور کرنے کے لیے سائن اپ کریں", createRiderAccount: "ایک راڈر اکاؤنٹ بنائیں"
    },
    मराठी: {
      home: "घर", ride: "सवारी", tickets: "माझे तिकिट", welcome: `स्वागत आहे, ${userName}!`, guest: "स्वागत आहे, अतिथी!",
      logout: "लॉगआउट", signin: "लॉग इन करा", signup: "साइन अप करा", signUpToDrive: "ड्राईव्ह आणि डिलीव्हर करण्यासाठी साइन अप करा", createRiderAccount: "राइडर खाता तयार करा"
    },
    العربية: {
      home: "الرئيسية", ride: "ركوب", tickets: "تذاكيري", welcome: `مرحبًا, ${userName}!`, guest: "مرحبًا, ضيف!",
      logout: "تسجيل الخروج", signin: "تسجيل الدخول", signup: "اشترك", signUpToDrive: "قم بالتسجيل للقيادة والتوصيل", createRiderAccount: "أنشئ حساب راكب"
    }
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#1a1a2e", color: "#e5e5e5" }}>
      <div className="container-fluid">
        <a className="navbar-brand" style={{ cursor: "pointer", color: "#00aaff" }} onClick={() => navigate("/")}>
          SmartShuttle
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation" style={{ borderColor: "#00aaff" }}>
          <span className="navbar-toggler-icon" style={{ backgroundColor: "#00aaff" }}></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul className="navbar-nav me-auto my-2 my-lg-0">
            <li className="nav-item">
              <a className="nav-link active" style={{ cursor: "pointer", color: "#00aaff" }} onClick={() => navigate("/")}>
                {translations[language].home}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" style={{ cursor: "pointer", color: "#00aaff" }} onClick={() => navigate("/selectbus")}>
                {translations[language].ride}
              </a>
            </li>
            <li className="nav-item">
              <a className="btn btn-outline-light" style={{ cursor: "pointer", borderColor: "#00aaff", color: "#00aaff" }} onClick={() => navigate(`/myticket`)}>
                {translations[language].tickets}
              </a>
            </li>
          </ul>

          {/* Welcome Message */}
          <div className="navbar-text" style={{ color: "#00aaff" }}>
            {token ? (
              <span>{translations[language].welcome}</span>
            ) : (
              <span>{translations[language].guest}</span>
            )}
          </div>

          {/* Random Quote */}
          <div className="navbar-text ml-3" style={{ color: "#00aaff", padding: "15px" }}>
            <i>{randomQuote}</i>
          </div>

          {/* Language selector */}
          <div>
            <span className="nav-link" style={{ cursor: "pointer", color: "#00aaff" }} onClick={() => setShowLanguageDropdown(!showLanguageDropdown)} aria-label="Change Language">
              <FontAwesomeIcon icon={faGlobe} className="icon" />
              {language}
            </span>

            {showLanguageDropdown && (
              <div className="language-dropdown" style={{ backgroundColor: "#0f3460", color: "#00aaff" }}>
                {['English', 'हिंदी', 'বাংলা', 'اردو', 'मराठी', 'العربية'].map((lang) => (
                  <button key={lang} onClick={() => toggleLanguage(lang)} className="language-button" style={{ backgroundColor: "transparent", color: "#00aaff", border: "none" }} aria-label={`Switch to ${lang}`}>
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sign Up Button & Dropdown */}
          <div>
            {token ? (
              <button className="btn btn-outline-light" style={{ borderRadius: "10px", borderColor: "#00aaff", marginRight: "8px", color: "#00aaff" }} onClick={() => handleLogout()}>
                {translations[language].logout}
              </button>
            ) : (
              <>
                <button className="btn btn-outline-light navbar-button" onClick={() => navigate("/signin")}>
                  {translations[language].signin}
                </button>
                <span className="btn btn-outline-success" style={{ color: "purple", border: "2px solid", marginRight: "8px", borderRadius: "10px", cursor: "pointer" }} onClick={toggleSignupOptions}>
                  {translations[language].signup}
                </span>
              </>
            )}
          </div>

          {/* Signup Dropdown */}
          {showSignupOptions && (
            <div className="signup-options-container" style={{ backgroundColor: "#0f3460", borderRadius: "10px", padding: "10px", position: "absolute", right: "10px", top: "60px" }}>
              <Link to="/register" className="signup-card" style={{ textDecoration: "none", color: "#00aaff", display: "block", marginBottom: "10px" }}>
                <h3>{translations[language].signUpToDrive}</h3>
              </Link>
              <Link to="/Signup" className="signup-card" style={{ textDecoration: "none", color: "#00aaff", display: "block" }}>
                <h3>{translations[language].createRiderAccount}</h3>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
