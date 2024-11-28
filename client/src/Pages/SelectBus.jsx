import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../Styles/selectbus.module.css";
import axios from "axios";
import { AiTwotoneStar } from "react-icons/ai";
import { BiArrowFromLeft } from "react-icons/bi";
import { saveDatafilter } from "../Redux/filter/filter.action";
import { removeall } from "../Redux/ticket/ticket.action";
import Filters from "../Components/Seats/Filters";
import { useDispatch, useSelector } from "react-redux";
import { error } from "../Utils/notification";
import { useLanguage } from "../Components/context/LanguageContext";  // Import language context

function SelectBus() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [wentwrong, setwentwrong] = useState(false);
  const [formData, setFormData] = useState({ from: "", to: "", date: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dataredux = useSelector((state) => state.filter.data);
  const user = useSelector((state) => state.auth.user);

  const { language } = useLanguage();  // Access current language from context

  useEffect(() => {
    dispatch(removeall());
  }, []);

  useEffect(() => {
    let from = searchParams.get("from");
    let to = searchParams.get("to");
    let date = searchParams.get("date");

    if (from && to && date) {
      getdata(from, to, date);
    }
  }, [searchParams]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const { from, to, date } = formData;
    if (from && to && date) {
      setSearchParams({ from, to, date });
    } else {
      error("Please fill all fields.");
    }
  }

  async function getdata(from, to, date) {
    try {
      let res = await axios.post("http://localhost:8070/bus/getall", {
        from,
        to,
        date,
      });
      if (res.data.length === 0) {
        error("Cities Not Found. Try Mumbai To Bengaluru");
        return navigate("/");
      }
      dispatch(saveDatafilter(res.data));
      setwentwrong(false);
    } catch (error) {
      console.log(error.message);
      setwentwrong(true);
    }
  }

  async function handlebook(ele) {
    navigate({
      pathname: `/bookticket/${ele._id}`,
      search: `?&date=${searchParams.get("date")}`,
    });
  }

  // Translations for different languages
  const translations = {
    English: {
      searchForBuses: "Search for Buses",
      from: "From",
      to: "To",
      date: "Date",
      search: "Search",
      filters: "FILTERS",
      citiesNotFound: "Cities Not Found. Try Mumbai To Bengaluru",
      errorImageAlt: "Error",
      viewSeats: "View Seats",
      price: "Price : ₹",
      arrivalTime: "Arrival Time :",
      departureTime: "Departure Time :",
      email: "Email :",
      phone: "Phone :",
    },
    हिंदी: {
      searchForBuses: "बसों की खोजें",
      from: "से",
      to: "तक",
      date: "तारीख",
      search: "खोजें",
      filters: "फिल्टर",
      citiesNotFound: "शहर नहीं मिला। कृपया मुंबई से बेंगलुरु का प्रयास करें",
      errorImageAlt: "त्रुटि",
      viewSeats: "सीटें देखें",
      price: "मूल्य : ₹",
      arrivalTime: "आगमन समय :",
      departureTime: "प्रस्थान समय :",
      email: "ईमेल :",
      phone: "फोन :",
    },
    বাংলা: {
      searchForBuses: "বাস অনুসন্ধান করুন",
      from: "থেকে",
      to: "থেকে",
      date: "তারিখ",
      search: "অনুসন্ধান করুন",
      filters: "ফিল্টার",
      citiesNotFound: "শহর পাওয়া যায়নি। মুম্বাই থেকে বেঙ্গালুরু চেষ্টা করুন",
      errorImageAlt: "ত্রুটি",
      viewSeats: "সিট দেখুন",
      price: "মূল্য : ₹",
      arrivalTime: "আগমন সময় :",
      departureTime: "প্রস্থানের সময় :",
      email: "ইমেইল :",
      phone: "ফোন :",
    },
    اردو: {
      searchForBuses: "بسوں کی تلاش کریں",
      from: "سے",
      to: "تک",
      date: "تاریخ",
      search: "تلاش کریں",
      filters: "فلٹرز",
      citiesNotFound: "شہر نہیں ملا۔ ممبئی سے بنگلور کی کوشش کریں",
      errorImageAlt: "خرابی",
      viewSeats: "سیٹیں دیکھیں",
      price: "قیمت : ₹",
      arrivalTime: "آنے کا وقت :",
      departureTime: "روانہ ہونے کا وقت :",
      email: "ای میل :",
      phone: "فون :",
    },
    मराठी: {
      searchForBuses: "बससाठी शोधा",
      from: "पासून",
      to: "पर्यंत",
      date: "तारीख",
      search: "शोधा",
      filters: "फिल्टर",
      citiesNotFound: "शहरे आढळली नाहीत. मुंबई ते बेंगळुरू प्रयत्न करा",
      errorImageAlt: "त्रुटी",
      viewSeats: "सीट पहा",
      price: "किंमत : ₹",
      arrivalTime: "आगमन वेळ :",
      departureTime: "प्रस्थान वेळ :",
      email: "ईमेल :",
      phone: "फोन :",
    },
    العربية: {
      searchForBuses: "البحث عن الحافلات",
      from: "من",
      to: "إلى",
      date: "التاريخ",
      search: "ابحث",
      filters: "الفلاتر",
      citiesNotFound: "لم يتم العثور على مدن. حاول من مومباي إلى بنغالور",
      errorImageAlt: "خطأ",
      viewSeats: "عرض المقاعد",
      price: "السعر : ₹",
      arrivalTime: "وقت الوصول :",
      departureTime: "وقت المغادرة :",
      email: "البريد الإلكتروني :",
      phone: "الهاتف :",
    },
  };

  return (
    <>
      {!searchParams.get("from") || !searchParams.get("to") || !searchParams.get("date") ? (
        <div className={styles.searchForm}>
          <h3>{translations[language].searchForBuses}</h3>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              name="from"
              placeholder={translations[language].from}
              value={formData.from}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="to"
              placeholder={translations[language].to}
              value={formData.to}
              onChange={handleInputChange}
              required
            />
            <input
              type="date"
              name="date"
              placeholder={translations[language].date}
              value={formData.date}
              onChange={handleInputChange}
              required
            />
            <button type="submit">{translations[language].search}</button>
          </form>
        </div>
      ) : wentwrong ? (
        <div className={styles.wrong}>
          <img
            src={require("../Images/404-error-page-templates.png")}
            alt={translations[language].errorImageAlt}
          />
        </div>
      ) : (
        <div className={styles.main}>
          <div className={styles.filter}>
            <h5 style={{ textAlign: "left", marginLeft: "25px" }}>
              {translations[language].filters}
            </h5>
            <hr />
            <Filters />
            <hr />
          </div>
          <div className={styles.busdata}>
            {dataredux?.map((ele, i) => (
              <div key={i}>
                <h5>
                  {ele.companyname.charAt(0).toUpperCase() +
                    ele.companyname.slice(1)}{" "}
                  Travels
                </h5>
                <div>
                  <p>{ele.from}</p>
                  <p><BiArrowFromLeft /></p>
                  <p>{ele.to}</p>
                </div>
                <div>
                  {ele.aminites.map((e, i) => (
                    <div key={i}>
                      <p>{e}</p>
                    </div>
                  ))}
                </div>
                <hr />
                <h6>{translations[language].arrivalTime} {ele.arrival}</h6>
                <h6>{translations[language].departureTime} {ele.departure}</h6>
                <hr />
                <h6>{translations[language].email} {ele.email}</h6>
                <h6>{translations[language].phone} {ele.phone}</h6>
                <hr />
                <div>
                  <h5>{translations[language].price} ₹ {ele.price}</h5>
                  <h5>
                    {Array(5)
                      .fill("")
                      .map((_, i) => (
                        <AiTwotoneStar
                          key={i}
                          color={i < ele.rating ? "#FFED00" : "gray"}
                        />
                      ))}
                  </h5>
                </div>
                <button onClick={() => handlebook(ele)}>
                  {translations[language].viewSeats}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default SelectBus;
